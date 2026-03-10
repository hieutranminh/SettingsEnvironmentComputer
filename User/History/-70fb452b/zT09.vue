<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <div id="legend-container"></div>

          <Chart
            :type="chartDisplayType"
            :data="chartData"
            :options="chartOptions"
            :plugins="
              chartDisplayType === CHART_DISPLAY_TYPE.BAR ? [ChartDataLabels, htmlLegendPlugin()] : [htmlLegendPlugin()]
            "
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
import type { ServiceSalesByItemReportItem } from '@/types/sales-report/ServiceSalesByItem'

interface Props {
  data: ServiceSalesByItemReportItem[]
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
 * Simple mapping of itemName from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => (item.itemName === 'NONE' ? t('general.label-no-input') : item.itemName))
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
          borderWidth: 0,
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

const htmlLegendPlugin = () => ({
  id: 'htmlLegend',
  afterUpdate(chart: any, args: any, options: any) {
    const ul = getOrCreateLegendList(chart, options.containerID)

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove()
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart)

    items.forEach((item) => {
      const li = document.createElement('li')
      li.style.alignItems = 'center'
      li.style.cursor = 'pointer'
      li.style.display = 'flex'
      li.style.flexDirection = 'row'
      li.style.marginLeft = '10px'

      li.onclick = () => {
        const { type } = chart.config
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index)
        } else {
          chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
        }
        chart.update()
      }

      // Color box
      const boxSpan = document.createElement('span')
      boxSpan.style.background = item.fillStyle
      boxSpan.style.borderColor = item.strokeStyle
      boxSpan.style.borderWidth = `${item.lineWidth}px`
      boxSpan.style.display = 'inline-block'
      boxSpan.style.flexShrink = 0
      boxSpan.style.height = '20px'
      boxSpan.style.marginRight = '10px'
      boxSpan.style.width = '20px'

      // Text
      const textContainer = document.createElement('p')
      textContainer.style.color = item.fontColor
      textContainer.style.margin = 0
      textContainer.style.padding = 0
      textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

      const text = document.createTextNode(item.text)
      textContainer.appendChild(text)

      li.appendChild(boxSpan)
      li.appendChild(textContainer)
      ul.appendChild(li)
    })
  },
})

const getOrCreateLegendList = (chart: any, id: string) => {
  const legendContainer = document.getElementById(id)
  let listContainer = legendContainer?.querySelector('ul')

  if (!listContainer) {
    listContainer = document.createElement('ul')
    listContainer.style.display = 'flex'
    listContainer.style.flexDirection = 'row'
    listContainer.style.margin = '0'
    listContainer.style.padding = '0'

    legendContainer?.appendChild(listContainer)
  }

  return listContainer
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
