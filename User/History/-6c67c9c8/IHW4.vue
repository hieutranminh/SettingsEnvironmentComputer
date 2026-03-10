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
import type { ClientsByTypeReportItem } from '@/types/client-report/ClientsByType'
import type { PrintSection } from '@/types/print'
// Utils
interface Props {
  data: ClientsByTypeReportItem[]
  chartDisplayType: ChartDisplayType
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  chartDisplayType: CHART_DISPLAY_TYPE.PIE,
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

const chartType = computed(() => {
  return props.chartDisplayType
})

const chartPlugins = computed(() => {
  const isChartBar = props.chartDisplayType === CHART_DISPLAY_TYPE.BAR
  return isChartBar ? [ChartDataLabels] : []
})

const chartLabels = computed(() => {
  return props.data.map((item) => (item.name.toLowerCase() === 'none' ? t('general.label-no-input') : item.name))
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
    label: t('clients-by-type.label-number-of-clients'),
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
