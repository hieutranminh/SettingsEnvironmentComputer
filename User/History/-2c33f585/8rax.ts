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
  shopName: string
  shopId: number
  totalBalance: number
  prepaidCards: {
    balance: number | null
    records: number | null
  }
  discountCards: {
    balance: number | null
    records: number | null
  }
  prepaidServices: {
    balance: number | null
    records: number | null
    remainingQty: number | null
  }
  unlimitedPrepaidServices: {
    balance: number | null
    records: number | null
    remainingQty: number | null
  }
}

export type SalesByDateReportResponse = ApiResponse<SalesByDateReportItem[]>

/**
 * Fetches sales by date report data from the API
 * @param request - The request parameters for the report
 * @returns Promise containing the API response with sales by date report data
 */
export const getSalesByDateReport = async (request: SalesByDateReportRequest): Promise<SalesByDateReportResponse> => {
  return await apiRead.post<SalesByDateReportItem[]>('sales/SalesReports/SalesByDateReport', request)
}
