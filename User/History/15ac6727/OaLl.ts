export interface IBranchSales {
  branchId: number
  branchName: string
  branchNumber: number
  branchShopId: number
  chainId: number
}

export interface IBranchSalesRequest {
  chainId: number
}

export interface IBranchSalesResponse {
  items: IBranchSales[]
}
