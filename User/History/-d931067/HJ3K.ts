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

export interface BranchSalesTotalReportPagingInfo {
  pageSize: number
  pageNumber: number
  totalItems: number
}

export interface BranchSalesTotalReportResult {
  items: BranchSalesTotalReportItem[]
  pagingInfo: BranchSalesTotalReportPagingInfo
}

export interface BranchSalesTotalReportResponse {
  result: BranchSalesTotalReportResult
  errorMessages: string[]
  isOK: boolean
} 