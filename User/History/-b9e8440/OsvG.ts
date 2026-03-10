 
 
import type { TooltipItem, ChartType } from 'chart.js'
import { computed } from 'vue'

// Utils
import { formatAmount } from '@/utils/common'

// Constants for magic numbers
const DEFAULT_ASPECT_RATIO = 0.6
const DEFAULT_LEGEND_FONT_SIZE = 12
const PIE_LEGEND_PADDING = 10
const DEFAULT_LEGEND_PADDING = 20
const DEFAULT_DATA_LABELS_FONT_SIZE = 10

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

// Pie chart color constants
const PIE_CHART_COLORS = [
  '#0074D9', '#FF4136', '#2ECC40', '#FF851B', '#7FDBFF',
  '#B10DC9', '#FFDC00', '#001f3f', '#39CCCC', '#01FF70',
  '#85144b', '#F012BE', '#3D9970', '#111111', '#AAAAAA',
  '#0074D9', '#FF4136', '#2ECC40', '#FF851B', '#7FDBFF',
  '#B10DC9', '#FFDC00', '#001f3f', '#39CCCC', '#01FF70',
  '#85144b', '#F012BE', '#3D9970', '#111111', '#AAAAAA',
]

/**
 * Get pie chart specific color palette
 * Dedicated color palette for pie charts with multiple colors
 * @returns IPieChartColorPalette object with predefined colors
 */
const getPieChartColorPalette = (): IPieChartColorPalette => {
  return {
    colors: PIE_CHART_COLORS,
  }
}

/**
 * Create chart options based on chart type and configuration
 * @param chartType - The type of chart
 * @param config - Configuration options
 * @returns Computed chart options
 */
const createChartOptions = (chartType: string, config: IChartOptionsConfig): Record<string, unknown> => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  const {
    maintainAspectRatio = false,
    aspectRatio = DEFAULT_ASPECT_RATIO,
    showLegend = true,
    legendFontSize = DEFAULT_LEGEND_FONT_SIZE,
    legendFontWeight = 'bold',
    legendPadding = chartType === 'pie' ? PIE_LEGEND_PADDING : DEFAULT_LEGEND_PADDING,
    legendPosition = 'top',
    htmlLegendContainerId = 'legend-container',
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showDataLabels = false,
    dataLabelsAnchor = 'end',
    dataLabelsAlign = 'top',
    dataLabelsFontSize = DEFAULT_DATA_LABELS_FONT_SIZE,
    dataLabelsFontWeight = 'bold',
    customOptions = {},
  } = config

  // Base options that apply to all chart types
  const baseOptions: Record<string, unknown> = {
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
          label: (ctx: TooltipItem<ChartType>) => {
            return ` ${ctx.label}: ${ctx.formattedValue}`
          },
          title: () => [],
        },
      },
    },
  }

  // Add data labels plugin if enabled
  if (showDataLabels) {
    baseOptions.plugins = {
      ...(baseOptions.plugins as Record<string, unknown>),
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

  // Add scales for chart types that support them (line, bar, etc.)
  if (chartType !== 'pie' && chartType !== 'doughnut') {
    baseOptions.scales = {
      xAxis: showXAxis
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
      yAxis: showYAxis
        ? {
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

  // Merge all options: base + custom
  return { ...baseOptions, ...customOptions }
}

/**
 * Enhanced chart options composable with type-specific support
 * @param config - Configuration options for the chart (can be reactive)
 * @returns Object containing chartOptions computed property and color palette
 */
export const useChartOptions = (config: IChartOptionsConfig | (() => IChartOptionsConfig) = {}): {
  chartOptions: any
  colorPalette: any
  pieChartColorPalette: any
} => {
  const chartOptions = computed(() => {
    // Get current config (handle both static and reactive config)
    const currentConfig = typeof config === 'function' ? config() : config

    // Extract chart type from config or default to 'line'
    const chartType = currentConfig.chartType ?? 'line'
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
