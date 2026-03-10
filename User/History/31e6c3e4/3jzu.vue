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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useChartOptions } from '@/composables/useChartOptions'
import { useChartPrint } from '@/composables/useChartPrint'
import { CHART_DISPLAY_TYPE, CHART_DISPLAY_VALUE } from '@/constants'
import type { ServiceSalesReportItem } from '@/types/sales-report/ServiceSales'
import { 
  extractChartData, 
  formatChartLabel, 
  getChartPlugins, 
  getDatasetLabel 
} from '@/utils/chartCommon'
import { generateSimpleDataset } from '@/utils/chartDatasetGenerators'

interface Props {
  data: ServiceSalesReportItem[]
  chartDisplayType: string
  chartDisplayValue: number
}

const props = defineProps<Props>()

// Composables
const { t } = useI18n()
const { chartOptions, colorPalette, pieChartColorPalette } = useChartOptions(() => ({
  chartType: props.chartDisplayType,
  showDataLabels: true,
  dataLabelsFontSize: 10,
  dataLabelsFontWeight: 'bold',
}))
const { chartRef, getPrintConfiguration } = useChartPrint()

/**
 * Chart plugins based on chart type
 */
const chartPlugins = computed(() => getChartPlugins(props.chartDisplayType, [ChartDataLabels]))

/**
 * Chart X-axis labels with formatted fallback for NONE values
 */
const chartLabels = computed(() => {
  return props.data.map((item) => formatChartLabel(item.key, 'general.label-no-input', t))
})

/**
 * Chart data values based on display type
 */
const chartDataValues = computed(() => extractChartData(props.data, props.chartDisplayValue))

/**
 * Chart data configuration
 */
const chartData = computed(() => {
  const baseDatasetProps = {
    label: getDatasetLabel(props.chartDisplayValue, t),
    data: chartDataValues.value,
  }

  const datasets = generateSimpleDataset(
    baseDatasetProps,
    props.chartDisplayType,
    colorPalette.value,
    pieChartColorPalette.value.colors
  )

  return {
    labels: chartLabels.value,
    datasets,
  }
})

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
