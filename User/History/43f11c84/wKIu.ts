import { apiRead } from '@/services/api'
import type {
  ServiceSalesReportRequest,
  ServiceSalesReportResponse,
  ServiceSalesReportResult,
} from '@/types/sales-report/ServiceSales'
import type {
  ServiceSalesByItemReportRequest,
  ServiceSalesByItemReportResponse,
} from '@/types/sales-report/ServiceSalesByItem'

export const salesReportsReadService = {
  /**
   * Fetches service sales report for a specific chain
   * @param request - The request payload containing service sales report request
   * @returns Promise with the service sales report response
   */
  getServiceSalesReport: (request: ServiceSalesReportRequest): Promise<ServiceSalesReportResponse> => {
    return apiRead.post<ServiceSalesReportResult>('sales/SalesReports/ServiceSalesReport', request)
  },
}
