import { apiRead } from '@/services/api'
import type {
  IBranchSalesTotalReportRequest,
  IBranchSalesTotalReportResponse,
  IBranchSalesTotalReportResult,
} from '@/types/sales-report/BranchSales'
import type {
  IProductSalesByItemReportRequest,
  IProductSalesByItemReportResponse,
  IProductSalesByItemReportResult,
} from '@/types/sales-report/ProductSalesByItem'
import type {
  IProductSalesByMonthReportRequest,
  IProductSalesByMonthReportResponse,
  IProductSalesByMonthReportResult,
} from '@/types/sales-report/ProductSalesByMonth'
import type {
  ISalesByDiscountCategoryReportRequest,
  ISalesByDiscountCategoryReportResponse,
  ISalesByDiscountCategoryReportItem,
} from '@/types/sales-report/SalesByDiscountCategory'
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
  IServiceSalesBySalesTypeReportRequest,
  IServiceSalesBySalesTypeReportResponse,
  IServiceSalesBySalesTypeReportItem,
} from '@/types/sales-report/ServiceSalesBySalesType'

export const salesReportsReadService = {
  /**
   * Fetches branch sales total report for a specific chain
   * @param request - The request payload containing branch sales total report request
   * @returns Promise with the branch sales total report response
   */
  getBranchSalesTotalReport: async (
    request: IBranchSalesTotalReportRequest,
  ): Promise<IBranchSalesTotalReportResponse> => {
    return apiRead.post<IBranchSalesTotalReportResult>(
      'sales/SalesReports/BranchSalesTotalReport',
      request,
    )
  },

  /**
   * Fetches service sales report for a specific chain
   * @param request - The request payload containing service sales report request
   * @returns Promise with the service sales report response
   */
  getServiceSalesReport: (
    request: ServiceSalesReportRequest,
  ): Promise<ServiceSalesReportResponse> => {
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
    return apiRead.post<ServiceSalesByItemReportItem[]>(
      'sales/SalesReports/ServiceSalesByItemReport',
      request,
    )
  },

  /**
   * Fetches service sales by month report for a specific chain
   * @param request - The request payload containing service sales by month report request
   * @returns Promise with the service sales by month report response
   */
  getServiceSalesByMonthReport: (
    request: ServiceSalesByMonthReportRequest,
  ): Promise<ServiceSalesByMonthReportResponse> => {
    return apiRead.post<ServiceSalesByMonthReportResult>(
      'sales/SalesReports/ServiceSalesByMonthsReport',
      request,
    )
  },

  /**
   * Fetches service sales by sales type report for a specific chain
   * @param request - The request payload containing service sales by sales type report request
   * @returns Promise with the service sales by sales type report response
   */
  getServiceSalesBySalesTypeReport: (
    request: IServiceSalesBySalesTypeReportRequest,
  ): Promise<IServiceSalesBySalesTypeReportResponse> => {
    return apiRead.post<IServiceSalesBySalesTypeReportItem[]>(
      'sales/SalesReports/ServiceSalesBySalesTypes',
      request,
    )
  },

  /**
   * Fetches product sales by item report for a specific chain
   * @param request - The request payload containing product sales by item report request
   * @returns Promise with the product sales by item report response
   */
  getProductSalesByItemReport: (
    request: ProductSalesByItemReportRequest,
  ): Promise<ProductSalesByItemReportResponse> => {
    return apiRead.post<ProductSalesByItemReportResult>(
      'sales/SalesReports/ProductSalesByItemFilterReport',
      request,
    )
  },

  /**
   * Fetches product sales by month report for a specific chain
   * @param request - The request payload containing product sales by month report request
   * @returns Promise with the product sales by month report response
   */
  getProductSalesByMonthReport: (
    request: ProductSalesByMonthReportRequest,
  ): Promise<ProductSalesByMonthReportResponse> => {
    return apiRead.post<ProductSalesByMonthReportResult>(
      'sales/SalesReports/ProductSalesByMonthsReport',
      request,
    )
  },

  /**
   * Fetches sales by discount category report for a specific chain
   * @param request - The request payload containing sales by discount category report request
   * @returns Promise with the sales by discount category report response
   */
  getSalesByDiscountCategoryReport: (
    request: SalesByDiscountCategoryReportRequest,
  ): Promise<SalesByDiscountCategoryReportResponse> => {
    return apiRead.post<SalesByDiscountCategoryReportItem[]>(
      'sales/SalesReports/SalesByDiscountCategoryReport',
      request,
    )
  },
}
