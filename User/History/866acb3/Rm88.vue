<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            :type="chartType"
            :data="chartData"
            :options="chartOptions"
            :plugins="chartPlugins"
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
import { useFormat } from '@/composables/useFormat'
import { useChartOptions } from '@/composables/useChartOptions'
// Constants
import {
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  PRINT_TYPE,
  type ChartDisplayType,
  type ChartDisplayValue,
} from '@/constants'
// Types
import type { IPrintSection } from '@/types/print'
import type { IServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { formatAmount } from '@/utils/common'

interface IProps {
  data?: IServiceSalesByMonthReportItem[]
  chartDisplayType?: ChartDisplayType
  chartDisplayValue?: ChartDisplayValue
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  chartDisplayType: CHART_DISPLAY_TYPE.BAR,
  chartDisplayValue: CHART_DISPLAY_VALUE.AMOUNT,
})
// Constants local
const DATA_LABELS_FONT_SIZE = 10
const DATA_LABELS_FONT_WEIGHT = 'bold'
const BORDER_RADIUS = 3
const POINT_BORDER_WIDTH = 3
const TENSION = 0.3

// State
const chartRef = ref()

// Composables
const { t } = useI18n()
const { formatYearMonthDisplay } = useFormat()
const { chartOptions, colorPalette } = useChartOptions(() => ({
  chartType: props.chartDisplayType,
  showDataLabels: true,
  dataLabelsFontSize: DATA_LABELS_FONT_SIZE,
  dataLabelsFontWeight: DATA_LABELS_FONT_WEIGHT,
}))

/**
 * IF chartDisplayType is BAR_LINE, return BAR
 * Otherwise, return chartDisplayType
 * Because chartjs just support bar and line
 */
const chartType = computed(() => {
  return props.chartDisplayType === CHART_DISPLAY_TYPE.BAR_LINE
    ? CHART_DISPLAY_TYPE.BAR
    : props.chartDisplayType
})

/**
 * IF chartDisplayType is BAR_LINE or BAR, return ChartDataLabels plugins
 * Otherwise, return empty array
 */
const chartPlugins = computed(() => {
  const isChartBarOrBarLine =
    props.chartDisplayType === CHART_DISPLAY_TYPE.BAR_LINE ||
    props.chartDisplayType === CHART_DISPLAY_TYPE.BAR
  return isChartBarOrBarLine ? [ChartDataLabels] : []
})

/**
 * Computed property for chart X-axis labels
 * Simple mapping of monthOfYear from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => formatYearMonthDisplay(String(item.monthOfYear)))
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
const totals = computed(() => {
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
  if (props.data.length === 0) return 0
  return Number((totals.value.amount / props.data.length).toFixed())
})

/**
 * Computed property for average data
 * @returns Average data
 */
const averageAmountData = computed(() => createAverageData(averageAmount.value, props.data.length))

/**
 * Computed property for average quantity
 * @returns Average quantity
 */
const averageQuantity = computed(() => {
  return Number((totals.value.quantity / props.data.length).toFixed())
})

/**
 * Computed property for average quantity data
 * @returns Average quantity
 */
const averageQuantityData = computed(() =>
  createAverageData(averageQuantity.value, props.data.length),
)

/**
 * Computed property for average data
 * If chartDisplayValue is AMOUNT, return averageAmountData
 * Otherwise, return averageQuantityData
 * @returns Average data
 */
const averageData = computed(() => {
  return props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT
    ? averageAmountData.value
    : averageQuantityData.value
})

const averageLabel = computed(() => {
  return `${t('general.average')} (${props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? formatAmount(averageAmount.value) : formatAmount(averageQuantity.value)})`
})

/**
 * Helper function to create average data
 * @param value - Average value
 * @param length - Length of the array
 * @returns Average data
 */
const createAverageData = (value: number, length: number): number[] => new Array(length).fill(value)

/**
 * Helper function to get base dataset properties
 * @returns Base dataset properties
 */
const getBaseDatasetProps = (): { label: string; data: number[] } => ({
  label:
    props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT
      ? t('general.label-amount')
      : t('general.label-qty'),
  data:
    props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT
      ? chartDataAmount.value
      : chartDataQuantity.value,
})

/**
 * Helper function to get bar datasets
 * @returns Bar datasets
 */
const getBarDatasets = (): {
  label: string
  data: number[]
  borderRadius: number
  backgroundColor: string
}[] =>
  [
    {
      ...getBaseDatasetProps(),
      borderRadius: BORDER_RADIUS,
      backgroundColor: colorPalette.value.primary,
    },
  ] as { label: string; data: number[]; borderRadius: number; backgroundColor: string }[]

/**
 * Helper function to get line datasets
 * @returns Line datasets
 */
const getLineDatasets = (): {
  label: string
  data: number[]
  fill: boolean
  clip: boolean
  borderColor: string
  backgroundColor: string
  pointBorderWidth: number
  pointBackgroundColor: string
  tension: number
}[] =>
  [
    {
      ...getBaseDatasetProps(),
      fill: false,
      clip: false,
      borderColor: colorPalette.value.primary,
      backgroundColor: colorPalette.value.primary,
      pointBorderWidth: POINT_BORDER_WIDTH,
      pointBackgroundColor: colorPalette.value.primary,
      tension: TENSION,
    },
    {
      label: averageLabel.value,
      data: averageData.value,
      fill: false,
      clip: false,
      borderColor: colorPalette.value.secondary,
      backgroundColor: colorPalette.value.secondary,
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: TENSION,
    },
  ] as {
    label: string
    data: number[]
    fill: boolean
    clip: boolean
    borderColor: string
    backgroundColor: string
    pointBorderWidth: number
    pointBackgroundColor: string
    tension: number
  }[]

/**
 * Helper function to get bar line datasets
 * @returns Bar line datasets
 */
const getBarLineDatasets = (): {
  label: string
  data: number[]
  type: string
  fill: boolean
  borderColor: string
  backgroundColor: string
  pointBorderWidth: number
  pointBackgroundColor: string
  tension: number
  datalabels: { display: boolean }
}[] =>
  [
    {
      ...getBaseDatasetProps(),
      type: 'line',
      fill: false,
      clip: false,
      borderColor: colorPalette.value.secondary,
      backgroundColor: colorPalette.value.secondary,
      pointBorderWidth: POINT_BORDER_WIDTH,
      pointBackgroundColor: colorPalette.value.secondary,
      tension: TENSION,
      datalabels: { display: false },
    },
    {
      ...getBaseDatasetProps(),
      borderRadius: BORDER_RADIUS,
      backgroundColor: colorPalette.value.primary,
    },
  ] as {
    label: string
    data: number[]
    type: string
    fill: boolean
    borderColor: string
    backgroundColor: string
    pointBorderWidth: number
    pointBackgroundColor: string
    tension: number
    datalabels: { display: boolean }
  }[]

/**
 * Maps chart display type to corresponding dataset generator function
 * Uses strategy pattern to avoid complex if-else chains
 */
const getDatasetsByType = (type: string): { label: string; data: number[] }[] => {
  const datasetMap = {
    [CHART_DISPLAY_TYPE.BAR]: getBarDatasets,
    [CHART_DISPLAY_TYPE.LINE]: getLineDatasets,
    [CHART_DISPLAY_TYPE.BAR_LINE]: getBarLineDatasets,
  }

  return datasetMap[type as keyof typeof datasetMap]?.() ?? []
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
const getPrintConfiguration = (): IPrintSection => {
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
