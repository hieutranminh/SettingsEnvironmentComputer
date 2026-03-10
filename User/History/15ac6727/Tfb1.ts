export interface BranchSales {
  branchId: number
  branchName: string
  branchNumber: number
  branchShopId: number
  chainId: number
}

export interface BranchSalesRequest {
  chainId: number
}

export interface BranchSalesResponse {
  items: BranchSales[]
}
