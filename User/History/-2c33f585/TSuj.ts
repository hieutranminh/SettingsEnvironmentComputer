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
  clientId: number[] | null
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
  return await apiRead.post<SalesByDateReportResponse>('sales/SalesReports/SalesByDateReport', request)
}
