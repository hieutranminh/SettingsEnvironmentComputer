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

// Response item interface for branch sales data
export interface BranchPrepaidGoodsReportItem {
  shopName: string
  shopId: number
  totalBalance: number
  prepaidCards: {
    balance: number
    records: number
  }
  discountCards: {
    balance: number
    records: number
  }
  prepaidServices: {
    balance: number
    records: number
    remainingQty: number
  }
  unlimitedPrepaidServices: {
    balance: number
    records: number
    remainingQty: number
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
  return await apiRead.post<BranchPrepaidGoodsReportResponse>('sales/SalesReports/BranchPrepaidGoodsReport', request)
}
