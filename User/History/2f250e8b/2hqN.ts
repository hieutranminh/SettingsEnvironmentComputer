import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'

// Request payload interface for SalesByMonthReport
export interface SalesByMonthReportRequest {
  isHeadquarterView: boolean
  headquarterShopId: number
  shopId: number
  toDateTs: number
  fromDateTs: number
  prepaidSalesCountingType: number
}

// Response item interface for SalesByMonthReport
export interface SalesByMonthReportItem {
  fromDateTS: number
  key: string
  prepaidCardAmount: number
  prepaidServiceAmount: number
  productAmount: number
  serviceAmount: number
  toDateTS: number
  total?: number
  date?: string
}

// Result interface for SalesByMonthReport
export interface SalesByMonthReportResult {
  reportItems: SalesByMonthReportItem[]
  shopId: number
}

export type SalesByMonthReportResponse = ApiResponse<SalesByMonthReportResult>

/**
 * Fetches sales by month report data from the API
 * @param request - The request parameters for the report
 * @returns Promise containing the API response with sales by month report data
 */
export const getSalesByMonthReport = async (
  request: SalesByMonthReportRequest,
): Promise<SalesByMonthReportResponse> => {
  return await apiRead.post<SalesByMonthReportResult>('sales/SalesReports/SalesByMonthReport', request)
}
