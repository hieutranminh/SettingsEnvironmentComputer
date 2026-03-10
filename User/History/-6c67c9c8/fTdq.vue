<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            :type="chartDisplayType"
            :data="chartData"
            :options="chartOptions"
            :plugins="chartPlugins"
            :height="CHART_HEIGHT"
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
import { CHART_DISPLAY_TYPE, PRINT_TYPE, type ChartDisplayType } from '@/constants'
// Types
import type { ClientsByTypeReportItem } from '@/types/client-report/ClientsByType'
import type { PrintSection } from '@/types/print'

interface Props {
  data: ClientsByTypeReportItem[]
  chartDisplayType: ChartDisplayType
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  chartDisplayType: CHART_DISPLAY_TYPE.PIE,
})

// Constants
const CHART_HEIGHT = 480
const DATA_LABELS_FONT_SIZE = 10
const DATA_LABELS_FONT_WEIGHT = 'bold' as const
const BAR_BORDER_RADIUS = 3
const NO_INPUT_VALUE = 'none'

// State
const chartRef = ref()

// Composables
const { t } = useI18n()
const { chartOptions, colorPalette, pieChartColorPalette } = useChartOptions(() => ({
  chartType: props.chartDisplayType,
  showDataLabels: true,
  dataLabelsFontSize: DATA_LABELS_FONT_SIZE,
  dataLabelsFontWeight: DATA_LABELS_FONT_WEIGHT,
}))

const chartPlugins = computed(() => {
  const isChartBar = props.chartDisplayType === CHART_DISPLAY_TYPE.BAR
  return isChartBar ? [ChartDataLabels] : []
})

const chartLabels = computed(() => {
  return props.data.map((item) =>
    item.name.toLowerCase() === NO_INPUT_VALUE ? t('general.label-no-input') : item.name,
  )
})

/**
 * Computed property for chart data amount
 * Simple mapping of amount from data items
 */
const chartDataAmount = computed(() => {
  return props.data.map((item) => item.totalClient)
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
 * Helper function to get line datasets
 * @returns Line datasets
 */
const getPieDatasets = () => [
  {
    data: chartDataAmount.value,
    borderWidth: 0,
    hoverBorderWidth: 0,
    backgroundColor: pieChartColorPalette.value.colors,
  },
]

/**
 * Helper function to get bar datasets
 * @returns Bar datasets
 */
const getBarDatasets = () => [
  {
    label: t('clients-by-type.label-number-of-clients'),
    data: chartDataAmount.value,
    borderRadius: BAR_BORDER_RADIUS,
    backgroundColor: colorPalette.value.primary,
  },
]

/**
 * Maps chart display type to corresponding dataset generator function
 * Uses strategy pattern to avoid complex if-else chains
 */
type DatasetFunction = () => Array<{
  data: number[]
  borderWidth?: number
  hoverBorderWidth?: number
  backgroundColor: string | string[]
  label?: string
  borderRadius?: number
}>

const getDatasetsByType = (type: ChartDisplayType) => {
  const datasetMap: Partial<Record<ChartDisplayType, DatasetFunction>> = {
    [CHART_DISPLAY_TYPE.PIE]: getPieDatasets,
    [CHART_DISPLAY_TYPE.BAR]: getBarDatasets,
  }

  return datasetMap[type]?.() || []
}

/**
 * Method to get print configuration
 * @returns Print configuration
 */
const getPrintConfiguration = (): PrintSection => {
  return {
    refType: PRINT_TYPE.CANVAS,
    sectionRef: chartRef.value,
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
