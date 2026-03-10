import { apiRead } from '@/services/api'
import type { ListResponse } from '@/types/ApiResponse'

// Request payload interface for BranchPrepaidGoodsReport
export interface BranchPrepaidGoodsReportRequest {
  pageSize: number
  isHeadquarterView: boolean
  dateType: number
  toDateTs: number
  pageNumber: number
  headquarterShopId: number
  fromDateTs: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

// Response item interface for branch sales data
export interface BranchPrepaidGoodsReportItem {
  shopName: string
  productSalesAmount: number
  productBalanceDeductionAmount: number
  serviceSalesAmount: number
  serviceBalanceDeductionAmount: number
  serviceDeductionAmount: number
  prepaidCardSalesAmount: number
  prepaidServicesSalesAmount: number
  pointDeduction: number
  prepaidGoodsDeductionAmount: number
  shopId: number
}

// Response type for BranchPrepaidGoodsReport
export type BranchPrepaidGoodsReportResponse = ListResponse<BranchPrepaidGoodsReportItem>

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
