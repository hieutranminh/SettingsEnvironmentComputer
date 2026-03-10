import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'

// Request payload interface for BranchPrepaidGoodsReport
export interface BranchPrepaidGoodsReportRequest {
  isHeadquarterView: boolean
  headquarterShopId: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

// Response item interface for branch prepaid goods data
export interface BranchPrepaidGoodsReportItem {
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

// Response type for BranchPrepaidGoodsReport
export type BranchPrepaidGoodsReportResponse = ApiResponse<BranchPrepaidGoodsReportItem[]>

/**
 * Get branch prepaid goods report
 * @param request - The request payload for the branch prepaid goods report
 * @returns Promise containing the branch prepaid goods report data
 */
export const getBranchPrepaidGoodsReport = async (
  request: BranchPrepaidGoodsReportRequest,
): Promise<BranchPrepaidGoodsReportResponse> => {
  const response = await apiRead.post<BranchPrepaidGoodsReportResponse>(
    'sales/SalesReports/BranchPrepaidGoodsReport',
    request,
  )
  return response.result!
}
