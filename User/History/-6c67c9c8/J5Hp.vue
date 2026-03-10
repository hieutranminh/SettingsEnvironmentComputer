<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart :type="chartType" :data="chartData" :options="chartOptions" :plugins="chartPlugins" :height="480" />
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
import { CHART_DISPLAY_TYPE, PRINT_TYPE, type ChartDisplayType } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'

import type { ClientsByTypeReportItem } from '@/types/sales-report/ClientsByType'
// Utils
interface Props {
  data: ClientsByTypeReportItem[]
  chartDisplayType: ChartDisplayType
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  chartDisplayType: CHART_DISPLAY_TYPE.BAR,
})

// State
const chartRef = ref()

// Composables
const { t } = useI18n()
const { chartOptions, colorPalette } = useChartOptions(() => ({
  chartType: props.chartDisplayType,
  showDataLabels: true,
  dataLabelsFontSize: 10,
  dataLabelsFontWeight: 'bold',
}))

const chartType = computed(() => {
  return props.chartDisplayType
})

/**
 * IF chartDisplayType is BAR_LINE or BAR, return ChartDataLabels plugins
 * Otherwise, return empty array
 */
const chartPlugins = computed(() => {
  const isChartBarOrBarLine =
    props.chartDisplayType === CHART_DISPLAY_TYPE.BAR_LINE || props.chartDisplayType === CHART_DISPLAY_TYPE.BAR
  return isChartBarOrBarLine ? [ChartDataLabels] : []
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
 * Helper function to get base dataset properties
 * @returns Base dataset properties
 */
const getBaseDatasetProps = () => ({
  label: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? t('general.label-amount') : t('general.label-qty'),
  data: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? chartDataAmount.value : chartDataQuantity.value,
})

/**
 * Helper function to get line datasets
 * @returns Line datasets
 */
const getPieDatasets = () => [
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
    label: averageLabel.value,
    data: averageData.value,
    fill: false,
    borderColor: colorPalette.value.secondary,
    backgroundColor: colorPalette.value.secondary,
    pointRadius: 0,
    pointHoverRadius: 0,
    tension: 0.3,
  },
]

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
 * Maps chart display type to corresponding dataset generator function
 * Uses strategy pattern to avoid complex if-else chains
 */
const getDatasetsByType = (type: string) => {
  const datasetMap = {
    [CHART_DISPLAY_TYPE.PIE]: getPieDatasets,
    [CHART_DISPLAY_TYPE.BAR]: getBarDatasets,
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
