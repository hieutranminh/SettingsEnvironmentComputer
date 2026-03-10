import type { ServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'
import { CHART_DISPLAY_VALUE } from '@/constants'
import { formatAmount } from '@/utils/common'

/**
 * Calculate totals from sales data
 * @param data Array of sales report items
 * @returns Object containing total amount and quantity
 * 
 * Example input: [{ amount: 1000, quantity: 5 }, { amount: 2000, quantity: 3 }]
 * Expected output: { amount: 3000, quantity: 8 }
 */
export const calculateTotals = (data: ServiceSalesByMonthReportItem[]) => {
  return data.reduce(
    (acc, item) => ({
      amount: acc.amount + (item.amount || 0),
      quantity: acc.quantity + (item.quantity || 0),
    }),
    {
      amount: 0,
      quantity: 0,
    },
  )
}

/**
 * Calculate average from totals and data length
 * @param total Total value
 * @param dataLength Number of data items
 * @returns Average value rounded to nearest integer
 * 
 * Example input: total = 3000, dataLength = 3
 * Expected output: 1000
 */
export const calculateAverage = (total: number, dataLength: number): number => {
  if (dataLength === 0) return 0
  return Number((total / dataLength).toFixed())
}

/**
 * Create array filled with average values
 * @param averageValue Average value to fill
 * @param length Array length
 * @returns Array filled with average values
 * 
 * Example input: averageValue = 1000, length = 3
 * Expected output: [1000, 1000, 1000]
 */
export const createAverageArray = (averageValue: number, length: number): number[] => {
  return new Array(length).fill(averageValue)
}

/**
 * Format chart labels from monthOfYear strings
 * @param data Array of sales report items
 * @returns Array of formatted labels (YYYY-MM format)
 * 
 * Example input: [{ monthOfYear: '202301' }, { monthOfYear: '202302' }]
 * Expected output: ['2023-01', '2023-02']
 */
export const formatChartLabels = (data: ServiceSalesByMonthReportItem[]): string[] => {
  return data.map((item) => `${item.monthOfYear.slice(0, 4)}-${item.monthOfYear.slice(4, 6)}`)
}

/**
 * Extract chart data values based on display type
 * @param data Array of sales report items
 * @param displayValue Display value type (amount or quantity)
 * @returns Array of values for chart display
 * 
 * Example input: data = [{ amount: 1000, quantity: 5 }], displayValue = CHART_DISPLAY_VALUE.AMOUNT
 * Expected output: [1000]
 */
export const extractChartValues = (data: ServiceSalesByMonthReportItem[], displayValue: number): number[] => {
  return data.map((item) => displayValue === CHART_DISPLAY_VALUE.AMOUNT ? item.amount : item.quantity)
}

/**
 * Format average label with appropriate value formatting
 * @param averageValue Average value
 * @param displayValue Display value type
 * @param t Translation function
 * @returns Formatted label string
 * 
 * Example input: averageValue = 1500, displayValue = CHART_DISPLAY_VALUE.AMOUNT, t = (key) => key
 * Expected output: 'general.average (1,500)'
 */
export const formatAverageLabel = (averageValue: number, displayValue: number, t: (key: string) => string): string => {
  return `${t('general.average')} (${formatAmount(averageValue)})`
}
