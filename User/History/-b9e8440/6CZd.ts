import type { TooltipItem, ChartType } from 'chart.js'
import { computed, type ComputedRef } from 'vue'

// Utils
import { formatAmount } from '@/utils/common'
import { min } from 'lodash'

// Constants for chart configuration
const DEFAULT_ASPECT_RATIO = 0.6
const DEFAULT_LEGEND_FONT_SIZE = 12
const DEFAULT_LEGEND_PADDING_PIE = 10
const DEFAULT_LEGEND_PADDING_OTHER = 20
const DEFAULT_DATA_LABELS_FONT_SIZE = 10
const DEFAULT_CHART_TYPE = 'line'

/**
 * Color palette configuration for different chart types
 * Provides consistent color schemes across the application
 */
interface IChartColorPalette {
  primary: string
  secondary: string
}

/**
 * Pie chart specific color palette
 * Dedicated color palette for pie charts with multiple colors
 */
interface IPieChartColorPalette {
  colors: string[]
}

/**
 * Configuration interface for chart options
 * Simplified interface for better maintainability
 */
interface IChartOptionsConfig {
  // Chart type
  chartType?: string

  // Basic chart configuration
  maintainAspectRatio?: boolean
  aspectRatio?: number

  // Legend configuration
  showLegend?: boolean
  legendFontSize?: number
  legendFontWeight?: string | number
  legendPadding?: number
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  htmlLegendContainerId?: string

  // Grid and axes configuration
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean

  // Data labels configuration
  showDataLabels?: boolean
  dataLabelsAnchor?: string
  dataLabelsAlign?: string
  dataLabelsFontSize?: number
  dataLabelsFontWeight?: string | number

  // Color palette
  colorPalette?: Partial<IChartColorPalette>

  // Custom options override
  customOptions?: Record<string, unknown>
}

/**
 * Get default color palette from CSS variables
 * Provides consistent colors across the application
 * @returns IChartColorPalette object with CSS variable values
 */
const getDefaultColorPalette = (): IChartColorPalette => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    primary: documentStyle.getPropertyValue('--p-green-600'),
    secondary: documentStyle.getPropertyValue('--p-orange-400'),
  }
}

/**
 * Predefined color array for pie charts
 */
const PIE_CHART_COLORS = [
  '#0074D9',
  '#FF4136',
  '#2ECC40',
  '#FF851B',
  '#7FDBFF',
  '#B10DC9',
  '#FFDC00',
  '#001f3f',
  '#39CCCC',
  '#01FF70',
  '#85144b',
  '#F012BE',
  '#3D9970',
  '#111111',
  '#AAAAAA',
  '#0074D9',
  '#FF4136',
  '#2ECC40',
  '#FF851B',
  '#7FDBFF',
  '#B10DC9',
  '#FFDC00',
  '#001f3f',
  '#39CCCC',
  '#01FF70',
  '#85144b',
  '#F012BE',
  '#3D9970',
  '#111111',
  '#AAAAAA',
] as const

/**
 * Get pie chart specific color palette
 * Dedicated color palette for pie charts with multiple colors
 * @returns IPieChartColorPalette object with predefined colors
 */
const getPieChartColorPalette = (): IPieChartColorPalette => {
  return {
    colors: [...PIE_CHART_COLORS],
  }
}

/**
 * Creates base chart options configuration
 * @param config - Configuration options
 * @param textColor - Text color from CSS variables
 * @param textColorSecondary - Secondary text color from CSS variables
 * @returns Base chart options
 */
const createBaseOptions = (
  config: IChartOptionsConfig,
  textColor: string,
  textColorSecondary: string,
): Record<string, unknown> => {
  const {
    maintainAspectRatio = false,
    aspectRatio = DEFAULT_ASPECT_RATIO,
    showLegend = true,
    legendFontSize = DEFAULT_LEGEND_FONT_SIZE,
    legendFontWeight = 'bold',
    legendPadding = DEFAULT_LEGEND_PADDING_OTHER,
    legendPosition = 'top',
    htmlLegendContainerId = 'legend-container',
  } = config

  return {
    maintainAspectRatio,
    aspectRatio,
    plugins: {
      htmlLegend: {
        containerID: htmlLegendContainerId,
      },
      legend: showLegend
        ? {
            position: legendPosition,
            labels: {
              color: textColor,
              font: {
                size: legendFontSize,
                weight: legendFontWeight,
              },
              padding: legendPadding,
            },
          }
        : {
            display: false,
          },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: TooltipItem<ChartType>): string => {
            return ` ${ctx.label}: ${ctx.formattedValue}`
          },
          title: (): string[] => [],
        },
      },
    },
  }
}

/**
 * Creates data labels plugin configuration
 * @param config - Configuration options
 * @returns Data labels plugin configuration
 */
const createDataLabelsPlugin = (config: IChartOptionsConfig): Record<string, unknown> => {
  const {
    showDataLabels = false,
    dataLabelsAnchor = 'end',
    dataLabelsAlign = 'top',
    dataLabelsFontSize = DEFAULT_DATA_LABELS_FONT_SIZE,
    dataLabelsFontWeight = 'bold',
  } = config

  if (!showDataLabels) return {}

  return {
    datalabels: {
      anchor: dataLabelsAnchor,
      align: dataLabelsAlign,
      clamp: true,
      offset: 0,
      font: {
        size: dataLabelsFontSize,
        weight: dataLabelsFontWeight,
      },
      formatter: (value: number): string => {
        return `${value ? formatAmount(value) : 0}`
      },
    },
  }
}

/**
 * Creates scales configuration for charts that support them
 * @param chartType - The type of chart
 * @param config - Configuration options
 * @param textColorSecondary - Secondary text color from CSS variables
 * @param surfaceBorder - Border color from CSS variables
 * @returns Scales configuration
 */
const createScalesConfig = (
  chartType: string,
  config: IChartOptionsConfig,
  textColorSecondary: string,
  surfaceBorder: string,
): Record<string, unknown> | undefined => {
  if (chartType === 'pie' || chartType === 'doughnut') return undefined

  const { showGrid = true, showXAxis = true, showYAxis = true } = config

  return {
    // eslint-disable-next-line id-length
    x: showXAxis
      ? {
          ticks: {
            color: textColorSecondary,
          },
          grid: showGrid
            ? {
                color: surfaceBorder,
              }
            : {
                display: false,
              },
        }
      : {
          display: false,
        },
    // eslint-disable-next-line id-length
    y: showYAxis
      ? {
          min: null,
          suggestedMin: 0,
          ticks: {
            color: textColorSecondary,
          },
          grid: showGrid
            ? {
                color: surfaceBorder,
              }
            : {
                display: false,
              },
        }
      : {
          display: false,
        },
  }
}

/**
 * Create chart options based on chart type and configuration
 * @param chartType - The type of chart
 * @param config - Configuration options
 * @returns Computed chart options
 */
const createChartOptions = (
  chartType: string,
  config: IChartOptionsConfig,
): Record<string, unknown> => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  // Adjust legend padding for pie charts
  const adjustedConfig = {
    ...config,
    legendPadding: chartType === 'pie' ? DEFAULT_LEGEND_PADDING_PIE : DEFAULT_LEGEND_PADDING_OTHER,
  }

  // Create base options
  const baseOptions = createBaseOptions(adjustedConfig, textColor, textColorSecondary)

  // Add data labels plugin if enabled
  const dataLabelsPlugin = createDataLabelsPlugin(adjustedConfig)
  if (Object.keys(dataLabelsPlugin).length > 0) {
    baseOptions.plugins = {
      ...(baseOptions.plugins as Record<string, unknown>),
      ...dataLabelsPlugin,
    }
  }

  // Add scales for chart types that support them
  const scalesConfig = createScalesConfig(
    chartType,
    adjustedConfig,
    textColorSecondary,
    surfaceBorder,
  )
  if (scalesConfig) {
    baseOptions.scales = scalesConfig
  }

  // Merge all options: base + custom
  return { ...baseOptions, ...adjustedConfig.customOptions }
}

/**
 * Enhanced chart options composable with type-specific support
 * @param config - Configuration options for the chart (can be reactive)
 * @returns Object containing chartOptions computed property and color palette
 */
export const useChartOptions = (
  config: IChartOptionsConfig | (() => IChartOptionsConfig) = {},
): {
  chartOptions: ComputedRef<Record<string, unknown>>
  colorPalette: ComputedRef<IChartColorPalette>
  pieChartColorPalette: ComputedRef<IPieChartColorPalette>
} => {
  const chartOptions = computed(() => {
    // Get current config (handle both static and reactive config)
    const currentConfig = typeof config === 'function' ? config() : config

    // Extract chart type from config or default to 'line'
    const chartType = currentConfig.chartType ?? DEFAULT_CHART_TYPE
    return createChartOptions(chartType, currentConfig)
  })

  // Get color palette for use in chart data
  const colorPalette = computed(() => {
    const currentConfig = typeof config === 'function' ? config() : config
    const defaultPalette = getDefaultColorPalette()
    return { ...defaultPalette, ...currentConfig.colorPalette }
  })

  // Get pie chart specific color palette
  const pieChartColorPalette = computed(() => {
    return getPieChartColorPalette()
  })

  return {
    chartOptions,
    colorPalette,
    pieChartColorPalette,
  }
}
