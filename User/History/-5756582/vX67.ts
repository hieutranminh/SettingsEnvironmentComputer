import { apiRead } from '@/services/api'
import type { ListResponse } from '@/types/ApiResponse'

// Request payload interface for BranchSalesTotalReport
export interface BranchSalesTotalReportRequest {
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
export interface BranchSalesTotalReportItem {
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

// Response type for BranchSalesTotalReport
export type BranchSalesTotalReportResponse = ListResponse<BranchSalesTotalReportItem>

/**
 * Get branch sales total report
 * @param request - The request payload for the branch sales total report
 * @returns Promise containing the branch sales total report data
 */
export const getBranchSalesTotalReport = async (
  request: BranchSalesTotalReportRequest,
): Promise<BranchSalesTotalReportResponse> => {
  const response = await apiRead.post<BranchSalesTotalReportResponse>('SalesReports/BranchSalesTotalReport', request)
  return response.result!
}
