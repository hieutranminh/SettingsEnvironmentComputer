<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            :type="chartTypeCondition"
            :data="chartData"
            :options="chartOptions"
            :plugins="chartPluginsCondition"
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
import { useI18n } from 'vue-i18n'

import { useChartOptions } from '@/composables/useChartOptions'
import { CHART_DISPLAY_TYPE, CHART_DISPLAY_VALUE, PRINT_TYPE } from '@/constants'
import type { PrintSection } from '@/types/print'
import type { ServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'
import {
  calculateTotals,
  calculateAverage,
  createAverageArray,
  formatChartLabels,
  extractChartValues,
  formatAverageLabel,
} from '@/utils/chartDataProcessing'
interface Props {
  data: ServiceSalesByMonthReportItem[]
  chartDisplayType: string
  chartDisplayValue: number
}

const props = defineProps<Props>()

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
 * IF chartDisplayType is BAR_LINE, return BAR
 * Otherwise, return chartDisplayType
 * Because chartjs just support bar and line
 */
const chartTypeCondition = computed(() => {
  return props.chartDisplayType === CHART_DISPLAY_TYPE.BAR_LINE ? CHART_DISPLAY_TYPE.BAR : props.chartDisplayType
})

/**
 * IF chartDisplayType is BAR_LINE or BAR, return ChartDataLabels plugins
 * Otherwise, return empty array
 */
const chartPluginsCondition = computed(() => {
  const isBarOrBarLine =
    props.chartDisplayType === CHART_DISPLAY_TYPE.BAR_LINE
    || props.chartDisplayType === CHART_DISPLAY_TYPE.BAR
  return isBarOrBarLine ? [ChartDataLabels] : []
})

/**
 * Computed property for chart X-axis labels
 * Uses utility function for consistent formatting
 */
const chartLabels = computed(() => formatChartLabels(props.data))

/**
 * Computed property for chart data values based on display type
 * Uses utility function to extract appropriate values
 */
const chartDataValues = computed(() => extractChartValues(props.data, props.chartDisplayValue))

/**
 * Computed property for chart data
 * Combines labels and datasets for Chart.js consumption
 * Re-computes when displayItemType or data changes
 */
const chartData = computed(() => {
  return {
    labels: chartLabels.value,
    datasets: getDatasetsByType(props.chartDisplayType),
  }
})

/**
 * Computed property for totals using utility function
 * @returns Object with total amount and quantity
 */
const totals = computed(() => calculateTotals(props.data))

/**
 * Computed property for average value based on display type
 * @returns Average value for current display type
 */
const averageValue = computed(() => {
  const total = props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? totals.value.amount : totals.value.quantity
  return calculateAverage(total, props.data.length)
})

/**
 * Computed property for average data array
 * @returns Array filled with average values
 */
const averageDataArray = computed(() => createAverageArray(averageValue.value, props.data.length))

/**
 * Helper function to get base dataset properties
 * @returns Base dataset properties with appropriate label and data
 */
const getBaseDatasetProps = () => ({
  label: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? t('general.label-amount') : t('general.label-qty'),
  data: chartDataValues.value,
})

/**
 * Helper function to get bar datasets
 * @returns Bar datasets
 */
const getBarDatasets = () => [
  {
    ...getBaseDatasetProps(),
    borderRadius: 3,
    backgroundColor: colorPalette.value.primary,
  },
]

/**
 * Helper function to get pie datasets
 * @returns Pie datasets
 */
const getPieDatasets = () => [
  {
    ...getBaseDatasetProps(),
    borderWidth: 0,
    hoverBorderWidth: 0,
    backgroundColor: pieChartColorPalette.value.colors,
  },
]

/**
 * Helper function to get line datasets
 * @returns Line datasets
 */
const getLineDatasets = () => [
  {
    ...getBaseDatasetProps(),
    fill: false,
    borderColor: colorPalette.value.primary,
    backgroundColor: colorPalette.value.primary,
    pointBorderWidth: 3,
    pointBackgroundColor: colorPalette.value.primary,
    tension: 0.3,
  },
  {
    label: formatAverageLabel(averageValue.value, props.chartDisplayValue, t),
    data: averageDataArray.value,
    fill: false,
    borderColor: colorPalette.value.secondary,
    backgroundColor: colorPalette.value.secondary,
    pointRadius: 0,
    pointHoverRadius: 0,
    tension: 0.3,
  },
]

/**
 * Helper function to get bar line datasets
 * @returns Bar line datasets
 */
const getBarLineDatasets = () => [
  {
    ...getBaseDatasetProps(),
    type: 'line',
    fill: false,
    borderColor: colorPalette.value.secondary,
    backgroundColor: colorPalette.value.secondary,
    pointBorderWidth: 3,
    pointBackgroundColor: colorPalette.value.secondary,
    tension: 0.3,
    datalabels: { display: false },
  },
  {
    ...getBaseDatasetProps(),
    borderRadius: 3,
    backgroundColor: colorPalette.value.primary,
  },
]

/**
 * Helper function to get datasets by type
 * @param type - Chart display type
 * @returns Datasets by type
 */
const getDatasetsByType = (type: string) => {
  const datasetMap = {
    [CHART_DISPLAY_TYPE.BAR]: getBarDatasets,
    [CHART_DISPLAY_TYPE.PIE]: getPieDatasets,
    [CHART_DISPLAY_TYPE.LINE]: getLineDatasets,
    [CHART_DISPLAY_TYPE.BAR_LINE]: getBarLineDatasets,
  }

  return datasetMap[type as keyof typeof datasetMap]?.() || []
}

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
