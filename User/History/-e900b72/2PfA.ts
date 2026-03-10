import { ref, computed, readonly } from 'vue'
import type { BranchSalesFilterInterface } from '@/types/branch/BranchSalesFilter'
import type { BranchSalesTotalReportItem, BranchSalesTotalReportResponse } from '@/services/sales/sales.read'
import { getBranchSalesTotalReport } from '@/services/sales/sales.read'
import { useLoading } from '@/composables/useLoading'

export const useSales = () => {
  const { isLoading, setLoading } = useLoading()
  
  // Reactive state
  const salesData = ref<BranchSalesTotalReportItem[]>([])
  const paginationInfo = ref<{
    pageSize: number
    pageNumber: number
    totalItems: number
  } | null>(null)
  const error = ref<string | null>(null)

  // Computed properties
  const hasData = computed(() => salesData.value.length > 0)
  const totalPages = computed(() => {
    if (!paginationInfo.value) return 0
    return Math.ceil(paginationInfo.value.totalItems / paginationInfo.value.pageSize)
  })

  /**
   * Fetch branch sales total report
   * @param filters - The filter parameters for the sales report
   * @returns Promise containing the sales report data
   */
  const fetchBranchSalesTotalReport = async (filters: BranchSalesFilterInterface): Promise<BranchSalesTotalReportResponse | null> => {
    try {
      setLoading(true)
      error.value = null

      const response = await getBranchSalesTotalReport(filters)
      
      // Update reactive state
      salesData.value = response.items || []
      paginationInfo.value = response.pagingInfo || null
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sales data'
      error.value = errorMessage
      console.error('Error fetching branch sales total report:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Clear all sales data and reset state
   */
  const clearSalesData = (): void => {
    salesData.value = []
    paginationInfo.value = null
    error.value = null
  }

  /**
   * Refresh sales data with current filters
   * @param filters - The current filter parameters
   */
  const refreshSalesData = async (filters: BranchSalesFilterInterface): Promise<void> => {
    await fetchBranchSalesTotalReport(filters)
  }

  return {
    // State
    salesData: readonly(salesData),
    paginationInfo: readonly(paginationInfo),
    error: readonly(error),
    isLoading: readonly(isLoading),
    
    // Computed
    hasData,
    totalPages,
    
    // Methods
    fetchBranchSalesTotalReport,
    clearSalesData,
    refreshSalesData,
  }
} 