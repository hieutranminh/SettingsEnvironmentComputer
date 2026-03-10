import { CHART_DISPLAY_TYPE, CHART_DISPLAY_VALUE, PRINT_TYPE } from '@/constants'
import type { PrintSection } from '@/types/print'

/**
 * Common interface for chart data items with amount and quantity
 */
export interface BaseChartDataItem {
  amount: number
  quantity: number
}

/**
 * Configuration for chart plugins based on chart type
 * @param chartType Chart display type
 * @param plugins Available plugins (e.g., ChartDataLabels)
 * @returns Array of plugins to use
 * 
 * Example input: chartType = CHART_DISPLAY_TYPE.BAR, plugins = [ChartDataLabels]
 * Expected output: [ChartDataLabels]
 */
export const getChartPlugins = (chartType: string, plugins: unknown[] = []): unknown[] => {
  const pluginEnabledTypes = [CHART_DISPLAY_TYPE.BAR, CHART_DISPLAY_TYPE.BAR_LINE]
  return pluginEnabledTypes.includes(chartType) ? plugins : []
}

/**
 * Get appropriate chart type for Chart.js consumption
 * Converts BAR_LINE to BAR since Chart.js doesn't support BAR_LINE directly
 * @param chartDisplayType Original chart display type
 * @returns Chart.js compatible chart type
 * 
 * Example input: CHART_DISPLAY_TYPE.BAR_LINE
 * Expected output: CHART_DISPLAY_TYPE.BAR
 */
export const getChartJsType = (chartDisplayType: string): string => {
  return chartDisplayType === CHART_DISPLAY_TYPE.BAR_LINE ? CHART_DISPLAY_TYPE.BAR : chartDisplayType
}

/**
 * Extract data values based on display value type
 * Generic function that works with any data structure having amount/quantity
 * @param data Array of chart data items
 * @param displayValue Display value type (AMOUNT or QUANTITY)
 * @returns Array of values for the specified type
 * 
 * Example input: data = [{ amount: 1000, quantity: 5 }], displayValue = CHART_DISPLAY_VALUE.AMOUNT
 * Expected output: [1000]
 */
export const extractChartData = <T extends BaseChartDataItem>(
  data: T[], 
  displayValue: number
): number[] => {
  return data.map((item) => (displayValue === CHART_DISPLAY_VALUE.AMOUNT ? item.amount : item.quantity))
}

/**
 * Get localized label for chart dataset
 * @param displayValue Display value type
 * @param t Translation function
 * @returns Localized label
 * 
 * Example input: displayValue = CHART_DISPLAY_VALUE.AMOUNT, t = (key) => 'Amount'
 * Expected output: 'Amount'
 */
export const getDatasetLabel = (displayValue: number, t: (key: string) => string): string => {
  return displayValue === CHART_DISPLAY_VALUE.AMOUNT ? t('general.label-amount') : t('general.label-qty')
}

/**
 * Create print configuration for chart components
 * @param chartElement Chart DOM element
 * @returns Print configuration object
 * 
 * Example input: chartElement = <canvas>...</canvas>
 * Expected output: { refType: 'CANVAS', sectionRef: chartElement }
 */
export const createChartPrintConfig = (chartElement: HTMLElement | null): PrintSection => {
  return {
    refType: PRINT_TYPE.CANVAS,
    sectionRef: chartElement,
  }
}

/**
 * Get chart DOM element from chart reference
 * Handles both direct element refs and component refs with $el property
 * @param chartRef Vue ref to chart element
 * @returns DOM element or null
 * 
 * Example input: chartRef.value = { $el: <canvas>...</canvas> }
 * Expected output: <canvas>...</canvas>
 */
export const getChartElement = (chartRef: any): HTMLElement | null => {
  if (!chartRef.value) return null
  
  // Handle PrimeVue Chart component (has $el property)
  if (chartRef.value.$el) return chartRef.value.$el
  
  // Handle direct DOM element
  return chartRef.value
}

/**
 * Format label with fallback for empty/NONE values
 * @param value Original value
 * @param fallbackKey Translation key for fallback
 * @param t Translation function
 * @returns Formatted label
 * 
 * Example input: value = 'NONE', fallbackKey = 'general.label-no-input', t = (key) => 'No Input'
 * Expected output: 'No Input'
 */
export const formatChartLabel = (
  value: string, 
  fallbackKey: string, 
  t: (key: string) => string
): string => {
  return value === 'NONE' ? t(fallbackKey) : value
}
