import { ref } from 'vue'
import type { PrintSection } from '@/types/print'
import { createChartPrintConfig, getChartElement } from '@/utils/chartCommon'

/**
 * Composable for chart printing functionality
 * Provides standardized print configuration for chart components
 * @returns Chart print functionality
 *
 * Example usage in component:
 * const { chartRef, getPrintConfiguration } = useChartPrint()
 * defineExpose({ getPrintConfiguration })
 */
export const useChartPrint = () => {
  const chartRef = ref()

  /**
   * Get print configuration for the chart
   * @returns Print configuration object with chart element reference
   *
   * Example output: { refType: 'CANVAS', sectionRef: <canvas>...</canvas> }
   */
  const getPrintConfiguration = (): PrintSection => {
    const chartElement = getChartElement(chartRef)
    return createChartPrintConfig(chartElement)
  }

  return {
    chartRef,
    getPrintConfiguration,
  }
}
