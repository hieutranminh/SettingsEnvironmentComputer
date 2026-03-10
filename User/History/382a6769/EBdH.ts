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
    records: number
    remainingQty: number | null
  }
  unlimitedPrepaidServices: {
    balance: number | null
    records: number
    remainingQty: number
  }
}

// Response type for BranchPrepaidGoodsReport
export type BranchPrepaidGoodsReportResponse = ApiResponse<BranchPrepaidGoodsReportItem[]>

/**
 * Get branch prepaid goods report
 * 
 * Fetches a comprehensive report of prepaid goods across branches including:
 * - Prepaid cards (balance and record count)
 * - Discount cards (balance and record count) 
 * - Prepaid services (balance, record count, and remaining quantity)
 * - Unlimited prepaid services (balance, record count, and remaining quantity)
 * - Total balance per shop
 * 
 * @param request - The request payload for the branch prepaid goods report
 * @returns Promise containing the branch prepaid goods report data
 * 
 * @example
 * ```typescript
 * const request = {
 *   isHeadquarterView: true,
 *   headquarterShopId: 123,
 *   branchName: "Main Branch",
 *   branchShopIds: [456, 789],
 *   branchGroupId: 1,
 *   customBranchTypeId: 2
 * }
 * 
 * const report = await getBranchPrepaidGoodsReport(request)
 * // Returns: ApiResponse<BranchPrepaidGoodsReportItem[]>
 * // Contains shop data with prepaid goods balances and quantities
 * ```
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
