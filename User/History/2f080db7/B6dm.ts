export interface BranchSalesTotalFilterItem {
  branchShopId: number
  branchShopName: string
  customBranchTypeId: number | null
  customBranchTypeName: string | null
  branchGroupId: number | null
  branchGroupName: string | null
  branchNumber: number
}

export interface BranchSalesTotalFilterRequest {
  shopId: number
}

export interface BranchSalesTotalFilterResponse {
  items: BranchSalesTotalFilterItem[]
} 