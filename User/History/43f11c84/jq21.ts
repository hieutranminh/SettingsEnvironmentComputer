import { apiRead } from '@/services/api'
import type {
  IBranchSalesTotalReportRequest,
  IBranchSalesTotalReportResponse,
  IBranchSalesTotalReportResult,
} from '@/types/sales-report/BranchSales'
import type {
  ISalesByDateReportRequest,
  ISalesByDateReportResponse,
  ISalesByDateReportResult,
} from '@/types/sales-report/SalesByDate'
import type {
  ISalesByMonthReportRequest,
  ISalesByMonthReportResponse,
  ISalesByMonthReportResult,
} from '@/types/sales-report/SalesByMonth'
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
  IServiceSalesReportRequest,
  IServiceSalesReportResponse,
  IServiceSalesReportResult,
} from '@/types/sales-report/ServiceSales'
import type {
  IServiceSalesByItemReportRequest,
  IServiceSalesByItemReportResponse,
  IServiceSalesByItemReportItem,
} from '@/types/sales-report/ServiceSalesByItem'
import type {
  IServiceSalesByMonthReportRequest,
  IServiceSalesByMonthReportResponse,
  IServiceSalesByMonthReportResult,
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
   * Fetches branch prepaid goods report for a specific chain
   * @param request - The request payload containing branch prepaid goods report request
   * @returns Promise with the branch prepaid goods report response
   */
  getBranchPrepaidGoodsReport: (
    request: IBranchPrepaidGoodsReportRequest,
  ): Promise<IBranchPrepaidGoodsReportResponse> => {
    return apiRead.post<IBranchPrepaidGoodsReportResult>(
      'sales/SalesReports/BranchPrepaidGoodsReport',
      request,
    )
  },

  /**
   * Fetches sales by date report for a specific chain
   * @param request - The request payload containing sales by date report request
   * @returns Promise with the sales by date report response
   */
  getSalesByDateReport: (
    request: ISalesByDateReportRequest,
  ): Promise<ISalesByDateReportResponse> => {
    return apiRead.post<ISalesByDateReportResult>('sales/SalesReports/SalesByDateReport', request)
  },

  /**
   * Fetches sales by month report for a specific chain
   * @param request - The request payload containing sales by month report request
   * @returns Promise with the sales by month report response
   */
  getSalesByMonthReport: (
    request: ISalesByMonthReportRequest,
  ): Promise<ISalesByMonthReportResponse> => {
    return apiRead.post<ISalesByMonthReportResult>('sales/SalesReports/SalesByMonthReport', request)
  },

  /**
   * Fetches service sales report for a specific chain
   * @param request - The request payload containing service sales report request
   * @returns Promise with the service sales report response
   */
  getServiceSalesReport: (
    request: IServiceSalesReportRequest,
  ): Promise<IServiceSalesReportResponse> => {
    return apiRead.post<IServiceSalesReportResult>('sales/SalesReports/ServiceSalesReport', request)
  },

  /**
   * Fetches service sales by item report for a specific chain
   * @param request - The request payload containing service sales by item report request
   * @returns Promise with the service sales by item report response
   */
  getServiceSalesByItemReport: (
    request: IServiceSalesByItemReportRequest,
  ): Promise<IServiceSalesByItemReportResponse> => {
    return apiRead.post<IServiceSalesByItemReportItem[]>(
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
    request: IServiceSalesByMonthReportRequest,
  ): Promise<IServiceSalesByMonthReportResponse> => {
    return apiRead.post<IServiceSalesByMonthReportResult>(
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
    request: IProductSalesByItemReportRequest,
  ): Promise<IProductSalesByItemReportResponse> => {
    return apiRead.post<IProductSalesByItemReportResult>(
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
    request: IProductSalesByMonthReportRequest,
  ): Promise<IProductSalesByMonthReportResponse> => {
    return apiRead.post<IProductSalesByMonthReportResult>(
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
    request: ISalesByDiscountCategoryReportRequest,
  ): Promise<ISalesByDiscountCategoryReportResponse> => {
    return apiRead.post<ISalesByDiscountCategoryReportItem[]>(
      'sales/SalesReports/SalesByDiscountCategoryReport',
      request,
    )
  },
}
