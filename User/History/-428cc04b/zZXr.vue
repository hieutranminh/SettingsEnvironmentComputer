<template>
  <Card>
    <template #content>
      <pre>{{ data }}</pre>
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
  return props.data.map((item) => item.discountCategoryName)
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
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        borderRadius: 3,
        backgroundColor: colorPalette.value.primary,
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
