import { CHART_DISPLAY_TYPE } from '@/constants'

/**
 * Base dataset properties interface
 */
export interface BaseDatasetProps {
  label: string
  data: number[]
}

/**
 * Color palette interface for dataset generation
 */
export interface DatasetColorPalette {
  primary: string
  secondary: string
}

/**
 * Generate simple chart dataset for bar/pie charts
 * Used by ServiceSales and ServiceSalesByItem components
 * @param baseProps Base dataset properties (label, data)
 * @param chartType Chart display type
 * @param colorPalette Color palette for styling
 * @param pieColors Pie chart specific colors
 * @returns Array with single dataset
 * 
 * Example input: baseProps = { label: 'Amount', data: [100, 200] }, chartType = 'bar'
 * Expected output: [{ label: 'Amount', data: [100, 200], borderRadius: 3, backgroundColor: '#color' }]
 */
export const generateSimpleDataset = (
  baseProps: BaseDatasetProps,
  chartType: string,
  colorPalette: DatasetColorPalette,
  pieColors?: string[]
) => [
  {
    ...baseProps,
    ...(chartType === CHART_DISPLAY_TYPE.BAR && {
      borderRadius: 3,
      backgroundColor: colorPalette.primary,
    }),
    ...(chartType === CHART_DISPLAY_TYPE.PIE && {
      borderWidth: 0,
      hoverBorderWidth: 0,
      backgroundColor: pieColors,
    }),
  },
]

/**
 * Generate line chart dataset with average line
 * Used by SalesByDate and SalesByMonth components
 * @param mainDataProps Main line dataset properties
 * @param averageData Array of average values
 * @param averageLabel Label for average line
 * @param colorPalette Color palette for styling
 * @returns Array with two datasets (main line + average line)
 * 
 * Example input: mainDataProps = { label: 'Sales', data: [100, 200] }, averageData = [150, 150]
 * Expected output: [{ main line config }, { average line config }]
 */
export const generateLineWithAverageDataset = (
  mainDataProps: BaseDatasetProps,
  averageData: number[],
  averageLabel: string,
  colorPalette: DatasetColorPalette
) => [
  {
    ...mainDataProps,
    fill: false,
    borderColor: colorPalette.primary,
    backgroundColor: colorPalette.primary,
    pointBorderWidth: 3,
    pointBackgroundColor: colorPalette.primary,
    tension: 0.3,
  },
  {
    label: averageLabel,
    data: averageData,
    fill: false,
    borderColor: colorPalette.secondary,
    backgroundColor: colorPalette.secondary,
    pointRadius: 0,
    pointHoverRadius: 0,
    tension: 0.3,
  },
]

/**
 * Generate bar dataset for standard bar chart
 * @param baseProps Base dataset properties
 * @param colorPalette Color palette for styling
 * @returns Array with single bar dataset
 */
export const generateBarDataset = (baseProps: BaseDatasetProps, colorPalette: DatasetColorPalette) => [
  {
    ...baseProps,
    borderRadius: 3,
    backgroundColor: colorPalette.primary,
  },
]

/**
 * Generate pie dataset for pie chart
 * @param baseProps Base dataset properties
 * @param pieColors Array of colors for pie slices
 * @returns Array with single pie dataset
 */
export const generatePieDataset = (baseProps: BaseDatasetProps, pieColors: string[]) => [
  {
    ...baseProps,
    borderWidth: 0,
    hoverBorderWidth: 0,
    backgroundColor: pieColors,
  },
]

/**
 * Generate line dataset for standard line chart
 * @param baseProps Base dataset properties
 * @param colorPalette Color palette for styling
 * @returns Array with single line dataset
 */
export const generateLineDataset = (baseProps: BaseDatasetProps, colorPalette: DatasetColorPalette) => [
  {
    ...baseProps,
    fill: false,
    borderColor: colorPalette.primary,
    backgroundColor: colorPalette.primary,
    pointBorderWidth: 3,
    pointBackgroundColor: colorPalette.primary,
    tension: 0.3,
  },
]

/**
 * Generate line dataset with average overlay for complex charts
 * Used by ServiceSalesByMonth component for LINE chart type
 * @param baseProps Base dataset properties
 * @param averageData Array of average values
 * @param averageLabel Label for average line
 * @param colorPalette Color palette for styling
 * @returns Array with line dataset and average overlay
 */
export const generateLineDatasetWithAverage = (
  baseProps: BaseDatasetProps,
  averageData: number[],
  averageLabel: string,
  colorPalette: DatasetColorPalette
) => [
  {
    ...baseProps,
    fill: false,
    borderColor: colorPalette.primary,
    backgroundColor: colorPalette.primary,
    pointBorderWidth: 3,
    pointBackgroundColor: colorPalette.primary,
    tension: 0.3,
  },
  {
    label: averageLabel,
    data: averageData,
    fill: false,
    borderColor: colorPalette.secondary,
    backgroundColor: colorPalette.secondary,
    pointRadius: 0,
    pointHoverRadius: 0,
    tension: 0.3,
  },
]

/**
 * Generate bar-line combined dataset
 * Used by ServiceSalesByMonth component for BAR_LINE chart type
 * @param baseProps Base dataset properties
 * @param colorPalette Color palette for styling
 * @returns Array with line and bar datasets for mixed chart
 */
export const generateBarLineDataset = (baseProps: BaseDatasetProps, colorPalette: DatasetColorPalette) => [
  {
    ...baseProps,
    type: 'line',
    fill: false,
    borderColor: colorPalette.secondary,
    backgroundColor: colorPalette.secondary,
    pointBorderWidth: 3,
    pointBackgroundColor: colorPalette.secondary,
    tension: 0.3,
    datalabels: { display: false },
  },
  {
    ...baseProps,
    borderRadius: 3,
    backgroundColor: colorPalette.primary,
  },
]
