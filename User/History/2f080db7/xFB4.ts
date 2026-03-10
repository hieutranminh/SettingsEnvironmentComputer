export interface IBranchSalesTotalFilterItem {
  branchShopId: number
  branchShopName: string
  customBranchTypeId: number | null
  customBranchTypeName: string | null
  branchGroupId: number | null
  branchGroupName: string | null
  branchNumber: number
}

export interface IBranchSalesTotalFilterRequest {
  shopId: number
}

export interface IBranchSalesTotalFilterResponse {
  items: IBranchSalesTotalFilterItem[]
}
