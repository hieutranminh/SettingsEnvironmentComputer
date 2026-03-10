<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            :type="CHART_DISPLAY_TYPE.BAR"
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
import type { ServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { formatAmount } from '@/utils/common'
interface Props {
  data: ServiceSalesByMonthReportItem[]
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
 * Simple mapping of monthOfYear from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => `${item.monthOfYear.slice(0, 4)}-${item.monthOfYear.slice(4, 6)}`)
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
        label: 'xxxxx',
        data: props.chartDisplayValue === CHART_DISPLAY_VALUE.AMOUNT ? chartDataAmount.value : chartDataQuantity.value,
        borderRadius: 3,
        backgroundColor: colorPalette.value.primary,
      },
    ],
  }
})

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
 * Maps chart display type to corresponding dataset generator function
 * Uses strategy pattern to avoid complex if-else chains
 */
const getDatasetsByType = (type: string) => {
  const datasetMap = {
    [CHART_DISPLAY_TYPE.BAR]: getBarDatasets,
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
