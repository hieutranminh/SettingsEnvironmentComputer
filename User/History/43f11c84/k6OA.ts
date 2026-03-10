import { apiRead } from '@/services/api'
import type {
  ServiceSalesReportRequest,
  ServiceSalesReportResponse,
  ServiceSalesReportResult,
} from '@/types/sales-report/ServiceSales'
import type {
  ServiceSalesByItemReportRequest,
  ServiceSalesByItemReportResponse,
  ServiceSalesByItemReportItem,
} from '@/types/sales-report/ServiceSalesByItem'
import type {
  ServiceSalesByMonthReportRequest,
  ServiceSalesByMonthReportResponse,
  ServiceSalesByMonthReportResult,
} from '@/types/sales-report/ServiceSalesByMonth'
import type {
  ServiceSalesBySalesTypeReportRequest,
  ServiceSalesBySalesTypeReportResponse,
  ServiceSalesBySalesTypeReportItem,
} from '@/types/sales-report/ServiceSalesBySalesType'

export const salesReportsReadService = {
  /**
   * Fetches service sales report for a specific chain
   * @param request - The request payload containing service sales report request
   * @returns Promise with the service sales report response
   */
  getServiceSalesReport: (request: ServiceSalesReportRequest): Promise<ServiceSalesReportResponse> => {
    return apiRead.post<ServiceSalesReportResult>('sales/SalesReports/ServiceSalesReport', request)
  },

  /**
   * Fetches service sales by item report for a specific chain
   * @param request - The request payload containing service sales by item report request
   * @returns Promise with the service sales by item report response
   */
  getServiceSalesByItemReport: (
    request: ServiceSalesByItemReportRequest,
  ): Promise<ServiceSalesByItemReportResponse> => {
    return apiRead.post<ServiceSalesByItemReportItem[]>('sales/SalesReports/ServiceSalesByItemReport', request)
  },

  /**
   * Fetches service sales by month report for a specific chain
   * @param request - The request payload containing service sales by month report request
   * @returns Promise with the service sales by month report response
   */
  getServiceSalesByMonthReport: (
    request: ServiceSalesByMonthReportRequest,
  ): Promise<ServiceSalesByMonthReportResponse> => {
    return apiRead.post<ServiceSalesByMonthReportResult>('sales/SalesReports/ServiceSalesByMonthsReport', request)
  },

  /**
   * Fetches service sales by sales type report for a specific chain
   * @param request - The request payload containing service sales by sales type report request
   * @returns Promise with the service sales by sales type report response
   */
  getServiceSalesBySalesTypeReport: (
    request: ServiceSalesBySalesTypeReportRequest,
  ): Promise<ServiceSalesBySalesTypeReportResponse> => {
    return apiRead.post<ServiceSalesBySalesTypeReportItem[]>('sales/SalesReports/ServiceSalesBySalesTypes', request)
  },
}
