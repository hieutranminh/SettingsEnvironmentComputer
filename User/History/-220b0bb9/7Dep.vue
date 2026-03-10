<template>
  <Card>
    <template #content>
      <template v-if="data.length">
        <div class="select-display-item">
          <label for="display-item-type">{{ $t('sales-by-date.label-display-item') }}</label>
          <Select
            v-model="displayItemType"
            labelId="display-item-type"
            :options="displayItemTypeOptions"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <Chart
          ref="chartRef"
          type="line"
          :data="chartData"
          :options="chartOptions"
          :height="400"
        />
      </template>

      <p v-else class="empty">{{ $t('general.no-data-for-chart') }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useChartOptions } from '@/composables/useChartOptions'
import { useChartPrint } from '@/composables/useChartPrint'
import { useDisplayTypeSelector } from '@/composables/useDisplayTypeSelector'
import type { SalesByDateReportItem } from '@/services/sales/sales-reports/sales-by-date-report.read'
import { createAverageArray, calculateAverage } from '@/utils/chartDataProcessing'
import { generateLineWithAverageDataset } from '@/utils/chartDatasetGenerators'
import { formatAmount } from '@/utils/common'

interface Props {
  data: SalesByDateReportItem[]
  prepaidSalesCountingType: number
}

const props = defineProps<Props>()

// Composables
const { t } = useI18n()
const { chartOptions } = useChartOptions()
const { chartRef, getPrintConfiguration } = useChartPrint()
const {
  displayItemType,
  displayItemTypeOptions,
  getLabelByType,
  getAmountByType,
  calculateTotals,
} = useDisplayTypeSelector({
  prepaidSalesCountingType: props.prepaidSalesCountingType,
  translationPrefix: 'sales-by-date',
})

/**
 * Chart X-axis labels (dates)
 */
const chartLabels = computed(() => props.data.map((item) => item.date))

/**
 * Current display type data points
 */
const currentAmountByType: ComputedRef<number[]> = computed(() =>
  props.data.map((item) => getAmountByType(item, displayItemType.value))
)

/**
 * Totals across all data items
 */
const totals = computed(() => calculateTotals(props.data))

/**
 * Average amount for current display type
 */
const averageAmount: ComputedRef<number> = computed(() => {
  if (props.data.length === 0) return 0

  const totalAmount = getAmountByType(totals.value as SalesByDateReportItem, displayItemType.value)
  return calculateAverage(totalAmount, props.data.length)
})

/**
 * Average data array
 */
const averageData: ComputedRef<number[]> = computed(() =>
  createAverageArray(averageAmount.value, props.data.length),)

/**
 * Chart data configuration
 */
const chartData = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement)
  const colorPalette = {
    primary: documentStyle.getPropertyValue('--p-green-600'),
    secondary: documentStyle.getPropertyValue('--p-orange-400'),
  }

  const mainDataProps = {
    label: getLabelByType(displayItemType.value),
    data: currentAmountByType.value,
  }

  const averageLabel = `${t('general.average')} (${formatAmount(averageAmount.value) || 0})`

  const datasets = generateLineWithAverageDataset(
    mainDataProps,
    averageData.value,
    averageLabel,
    colorPalette
  )

  return {
    labels: chartLabels.value,
    datasets,
  }
})

defineExpose({
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.select-display-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;

  .p-select {
    min-width: 200px;
  }
}

.empty {
  text-align: center;
  padding: 1rem;
}
</style>
