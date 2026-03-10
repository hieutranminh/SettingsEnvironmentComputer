import { apiRead } from '@/services/api'
import type {
  ProductSalesByMonthReportRequest,
  ProductSalesByMonthReportResponse,
  ProductSalesByMonthReportResult,
} from '@/types/sales-report/ProductSalesByMonth'

export const salesReportsReadService = {
  /**
   * Fetches product sales by month report for a specific chain
   * @param request - The request payload containing product sales by month report request
   * @returns Promise with the product sales by month report response
   */
  getProductSalesByMonthReport: (
    request: ProductSalesByMonthReportRequest,
  ): Promise<ProductSalesByMonthReportResponse> => {
    return apiRead.post<ProductSalesByMonthReportResult>('sales/SalesReports/ProductSalesByMonthsReport', request)
  },
}
