import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'

// Request payload interface for SalesByDateReport
export interface SalesByDateReportRequest {
  isHeadquarterView: boolean
  headquarterShopId: number
  shopId: number
  toDateTs: number
  fromDateTs: number
  prepaidSalesCountingType: number
}

// Response item interface for SalesByDateReport
export interface SalesByDateReportItem {
  clientId: null
  fromDateTS: 0
  key: '20250810'
  prepaidCardAmount: 0
  prepaidServiceAmount: 0
  productAmount: 0
  serviceAmount: 0
  toDateTS: 0
}

// Result interface for SalesByDateReport
export interface SalesByDateReportResult {
  reportItems: SalesByDateReportItem[]
  shopId: number
}

export type SalesByDateReportResponse = ApiResponse<SalesByDateReportResult>

/**
 * Fetches sales by date report data from the API
 * @param request - The request parameters for the report
 * @returns Promise containing the API response with sales by date report data
 */
export const getSalesByDateReport = async (request: SalesByDateReportRequest): Promise<SalesByDateReportResponse> => {
  return await apiRead.post<SalesByDateReportResult>('sales/SalesReports/SalesByDateReport', request)
}
