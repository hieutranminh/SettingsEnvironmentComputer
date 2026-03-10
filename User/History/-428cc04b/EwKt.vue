<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            :plugins="[ChartDataLabels]"
            :height="480"
          />
        </template>

        <p v-else class="empty">{{ $t('general.no-data-for-chart') }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { ref, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useChartOptions } from '@/composables/useChartOptions'
// Constants
import { CHART_DISPLAY_TYPE, PRINT_TYPE } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'
import type { SalesByDiscountCategoryReportItem } from '@/types/sales-report/SalesByDiscountCategory'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data: SalesByDiscountCategoryReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// State
const chartRef = ref()

// Composables
const { t } = useI18n()
const { chartOptions, colorPalette } = useChartOptions(() => ({
  chartType: CHART_DISPLAY_TYPE.BAR,
  showDataLabels: true,
  dataLabelsFontSize: 10,
  dataLabelsFontWeight: 'bold',
}))

/**
 * Computed property for chart X-axis labels
 * Maps discount category names from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => item.discountCategory || t('general.label-no-input'))
})

/**
 * Computed property for chart data - discount amounts
 */
const chartDataAmount = computed(() => {
  return props.data.map((item) => item.discountAmount)
})

/**
 * Computed property for chart data - quantities
 */
const chartDataQty = computed(() => {
  return props.data.map((item) => item.qty)
})

/**
 * Chart data configuration for Chart.js
 * Creates a dataset for discount amounts with colors from the color palette
 */
const chartData = computed(() => {
  return {
    labels: chartLabels.value,
    datasets: [
      {
        label: t('sales-by-discount-category.label-discount-amount'),
        data: chartDataAmount.value,
        backgroundColor: colorPalette.value.slice(0, props.data.length),
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }
})

/**
 * Get print configuration for the chart component
 * @returns Print section configuration
 */
const getPrintConfiguration = (): PrintSection => {
  return {
    type: PRINT_TYPE.CHART,
    title: t('sales-by-discount-category.chart-title'),
    element: chartRef.value,
  }
}

// Expose methods for parent component
defineExpose({
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.empty {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
  font-style: italic;
}
</style>
