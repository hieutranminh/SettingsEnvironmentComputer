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
// Composables
import { useI18n } from 'vue-i18n'

import { useChartOptions } from '@/composables/useChartOptions'
// Constants
import { CHART_DISPLAY_TYPE, CHART_DISPLAY_VALUE, PRINT_TYPE } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'
import type { ServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { formatAmount } from '@/utils/common'
interface Props {
  data: ServiceSalesByMonthReportItem[]
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
 * Simple mapping of monthOfYear from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => `${item.monthOfYear.slice(0, 4)}-${item.monthOfYear.slice(4, 6)}`)
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
    datasets: getDatasetsByType(props.chartDisplayType),
  }
})

/**
 * Computed property for totals amount
 * @returns Totals amount
 */
const getTotals = computed(() => {
  return props.data.reduce(
    (acc, item) => ({
      amount: acc.amount + item.amount || 0,
      quantity: acc.quantity + item.quantity || 0,
    }),
    {
      amount: 0,
      quantity: 0,
    },
  )
})

/**
 * Computed property for average amount
 * @returns Average amount
 */
const averageAmount = computed(() => {
  return Number((getTotals.value.amount / props.data.length).toFixed())
})

/**
 * Computed property for average data
 * @returns Average data
 */
const averageData = computed(() => new Array(props.data.length).fill(averageAmount.value))

/**
 * Computed property for average quantity
 * @returns Average quantity
 */
const averageQuantity = computed(() => {
  return Number((getTotals.value.quantity / props.data.length).toFixed())
})

/**
 * Computed property for average quantity data
 * @returns Average quantity
 */
const averageQuantityData = computed(() => new Array(props.data.length).fill(averageQuantity.value))

/**
 * Helper function to get base dataset properties
 * @returns Base dataset properties
 */
const getBaseDatasetProps = () => ({
  label: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? t('general.label-amount') : t('general.label-qty'),
  data: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? chartDataAmount.value : chartDataQuantity.value,
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
    label: `${t('general.average')} (${props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? formatAmount(averageAmount.value) : formatAmount(averageQuantity.value)})`,
    data: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? averageData.value : averageQuantityData.value,
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
