import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'

// Request payload interface for BranchPrepaidGoodsReport
export interface IBranchPrepaidGoodsReportRequest {
  isHeadquarterView: boolean
  headquarterShopId: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

// Response item interface for branch prepaid goods data
export interface IBranchPrepaidGoodsReportItem {
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

export type IBranchPrepaidGoodsReportResponse = ApiResponse<IBranchPrepaidGoodsReportItem[]>

/**
 * Fetches branch prepaid goods report data from the API
 * @param request - The request parameters for the report
 * @returns Promise containing the API response with branch prepaid goods data
 */
export const getBranchPrepaidGoodsReport = async (
  request: IBranchPrepaidGoodsReportRequest,
): Promise<IBranchPrepaidGoodsReportResponse> => {
  return await apiRead.post<IBranchPrepaidGoodsReportItem[]>(
    'sales/SalesReports/BranchPrepaidGoodsReport',
    request,
  )
}
