import { ref } from 'vue'

import { salesReportsReadService } from '@/services/sales/sales-reports.read'
import type {
  ServiceSalesByItemFilterInterface,
  ServiceSalesByItemReportItem,
  ServiceSalesByItemReportRequest,
} from '@/types/sales-report/ServiceSalesByItem'

/**
 * Composable for managing service sales by item report data and operations
 * Provides reactive state and methods for fetching and managing service sales by item report data
 * @returns Object containing reactive state and methods for service sales by item report operations
 */
export const useServiceSalesByItemReport = () => {
  // Reactive state
  const filterData = ref<ServiceSalesByItemFilterInterface | null>(null)
  const items = ref<ServiceSalesByItemReportItem[]>([])

  /**
   * Fetches service sales by item report data from the API
   * @param filters - Filter parameters for the report request
   * @returns Promise that resolves when the report data is fetched
   * @example
   * await fetchReport({
   *   dateType: 'month',
   *   fromDateTs: 1640995200,
   *   toDateTs: 1643673599,
   *   shopId: 1,
   *   headquarterShopId: 1,
   *   isHeadquarterView: true,
   *   categoryId: 0,
   *   serviceId: 0
   * })
   */
  const fetchReport = async (filters: ServiceSalesByItemFilterInterface): Promise<void> => {
    try {
      filterData.value = filters

      const request: ServiceSalesByItemReportRequest = {
        dateType: filters.dateType,
        fromDateTs: filters.fromDateTs,
        toDateTs: filters.toDateTs,
        shopId: filters.shopId,
        headquarterShopId: filters.headquarterShopId,
        isHeadquarterView: filters.isHeadquarterView,
        categoryId: filters.categoryId,
        serviceId: filters.serviceId,
      }

      const response = await salesReportsReadService.getServiceSalesByItemReport(request)
      items.value = response.data || []
    } catch (error) {
      console.error('Error fetching service sales by item report:', error)
      items.value = []
    }
  }

  return {
    filterData,
    items,
    fetchReport,
  }
}
