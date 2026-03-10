<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            :type="chartDisplayType"
            :data="chartData"
            :options="chartOptions"
            :plugins="chartDisplayType === CHART_DISPLAY_TYPE.BAR ? [ChartDataLabels] : []"
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
import { CHART_DISPLAY_TYPE, CHART_DISPLAY_VALUE, PRINT_TYPE } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'
import type { ServiceSalesReportItem } from '@/types/sales-report/ServiceSales'

interface Props {
  data: ServiceSalesReportItem[]
  chartDisplayType: string
  chartDisplayValue: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  chartDisplayType: CHART_DISPLAY_TYPE.BAR,
  chartDisplayValue: CHART_DISPLAY_VALUE.AMOUNT,
})

// State
const chartRef = ref()

// Composables
const { t } = useI18n()
const { chartOptions, colorPalette, pieChartColorPalette } = useChartOptions(() => ({
  chartType: props.chartDisplayType,
  showDataLabels: true,
  dataLabelsFontSize: 10,
  dataLabelsFontWeight: 'bold',
}))

/**
 * Computed property for chart X-axis labels
 * Simple mapping of keys from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => (item.key === 'NONE' ? t('general.label-no-input') : item.key))
})

/**
 * Computed property for chart data amount
 * Simple mapping of amount from data items
 */
const chartDataAmount = computed(() => {
  return props.data.map((item) => item.amount)
})

/**
 * Computed property for chart data quantity
 * Simple mapping of quantity from data items
 */
const chartDataQuantity = computed(() => {
  return props.data.map((item) => item.quantity)
})

/**
 * Computed property for chart data
 * Combines labels and datasets for Chart.js consumption
 * Re-computes when displayItemType or data changes
 */
const chartData = computed(() => {
  return {
    labels: chartLabels.value,
    datasets: [
      {
        label:
          props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? t('general.label-amount') : t('general.label-qty'),
        data: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? chartDataAmount.value : chartDataQuantity.value,
        // Apply type-specific options
        ...(props.chartDisplayType === CHART_DISPLAY_TYPE.BAR && {
          borderRadius: 3,
          backgroundColor: colorPalette.value.primary,
        }),
        ...(props.chartDisplayType === CHART_DISPLAY_TYPE.PIE && {
          borderWidth: 1,
          hoverBorderWidth: 0,
          backgroundColor: pieChartColorPalette.value.colors,
        }),
      },
    ],
  }
})

/**
 * Method to get chart DOM element
 * @returns Chart DOM element or null if not found
 */
const getChartDOM = (): HTMLElement | null => {
  if (chartRef.value) return chartRef.value
  return null
}

/**
 * Method to get print configuration
 * @returns Print configuration
 */
const getPrintConfiguration = (): PrintSection => {
  const chartElement = getChartDOM()

  return {
    refType: PRINT_TYPE.CANVAS,
    sectionRef: chartElement,
  }
}

defineExpose({
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.empty {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--p-gray-300);
}
</style>
