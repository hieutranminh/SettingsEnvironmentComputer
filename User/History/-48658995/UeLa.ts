/**
 * Composable for New Clients Repeat Table logic
 * Separates business logic from component presentation
 */
import { computed, type ComputedRef } from 'vue'
import type { NewClientsRepeatReportItem, RepeatInfo } from '@/types/client-report/NewClientsRepeat'

// Constants
const PERCENTAGE_PRECISION = 100
const NONE_STAFF_IDENTIFIER = 'none'

interface TransformedRepeatData {
  staffName: string
  totalNewClients: number
  totalRepeatClients: number
  ratio: number
  monthlyRepeats: Array<{
    month: string
    count: number
    percentage: number
  }>
}

export const useNewClientsRepeatTable = (data: ComputedRef<NewClientsRepeatReportItem[]>) => {
  /**
   * Calculate percentage ratio with consistent precision
   * Input: numerator and denominator values
   * Output: Percentage rounded to 2 decimal places
   */
  const calculatePercentageRatio = (numerator: number, denominator: number): number => {
    if (denominator === 0) return 0
    return Math.round((numerator / denominator) * PERCENTAGE_PRECISION * PERCENTAGE_PRECISION) / PERCENTAGE_PRECISION
  }

  /**
   * Calculate total repeat clients from repeat info array
   * Input: Array of RepeatInfo objects
   * Output: Sum of all totalRepeatClients
   */
  const getTotalRepeatClients = (repeatInfos: RepeatInfo[]): number => {
    return repeatInfos.reduce((sum, info) => sum + info.totalRepeatClients, 0)
  }

  /**
   * Transform raw API data to display format
   * Input: Raw report data array
   * Output: Structured data for table display
   */
  const transformedData = computed<TransformedRepeatData[]>(() => {
    if (!data.value || data.value.length === 0) {
      return []
    }

    return data.value.map((item) => {
      const totalRepeatClients = getTotalRepeatClients(item.repeatInfos)
      
      const monthlyRepeats = item.repeatInfos.map((repeatInfo) => ({
        month: formatMonthDisplay(repeatInfo.repeatOfYearMonth),
        count: repeatInfo.totalRepeatClients,
        percentage: calculatePercentageRatio(repeatInfo.totalRepeatClients, item.totalNewClients)
      }))

      return {
        staffName: item.staffName,
        totalNewClients: item.totalNewClients,
        totalRepeatClients,
        ratio: calculatePercentageRatio(totalRepeatClients, item.totalNewClients),
        monthlyRepeats
      }
    })
  })

  /**
   * Format month display from YYYYMM to readable format
   * Input: YYYYMM number format
   * Output: MM month string for display
   */
  const formatMonthDisplay = (yearMonth: number): string => {
    return yearMonth.toString().slice(-2)
  }

  /**
   * Get month header for new clients column
   * Input: First repeat info item
   * Output: Formatted YYYY-MM string
   */
  const monthOfNewClients = computed(() => {
    const firstItem = data.value?.[0]?.repeatInfos?.[0]
    if (!firstItem) return ''
    
    const monthStr = String(firstItem.repeatOfYearMonth)
    return `${monthStr.slice(0, 4)}-${monthStr.slice(4, 6)}`
  })

  /**
   * Format staff name for display
   * Input: Raw staff name string
   * Output: Formatted staff name or fallback text
   */
  const formatStaffName = (staffName: string, noInputLabel: string): string => {
    return staffName.toLowerCase() === NONE_STAFF_IDENTIFIER ? noInputLabel : staffName
  }

  /**
   * Get unique month headers from data
   * Input: Transformed data array
   * Output: Array of month strings for table headers
   */
  const monthHeaders = computed(() => {
    const firstItem = transformedData.value?.[0]
    if (!firstItem) return []
    
    return firstItem.monthlyRepeats.map(repeat => repeat.month)
  })

  return {
    transformedData,
    monthOfNewClients,
    monthHeaders,
    formatStaffName,
    formatMonthDisplay
  }
}
