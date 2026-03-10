export interface PagingInfo {
  pageSize: number
  pageNumber: number
  totalItems: number
}

export interface BranchItem {
  ownerName: string | null
  ownerMobile: string | null
  managerName: string | null
  managerTitle: string | null
  phoneNumber: string | null
  mobile: string | null
  chainId: number
  branchId: number
  branchName: string
  branchNumber: number
  branchType: number
  registrationDate: string
  modificationDate: string
  address1: string | null
  address2: string | null
  branchGroupId: number | null
  branchGroupName: string | null
  customBranchTypeId: number | null
  customBranchTypeName: string | null
  branchShopId: number
}

export interface IBranchesResult {
  pagingInfo: PagingInfo
  items: BranchItem[]
}

export type IBranchSalesFilterRequest = {
  chainId: number
  pageSize: number
  pageNumber: number
  branchName: string
  branchGroupId: number
  customBranchTypeId: number
}

export interface IBranchItem {
  ownerName: string
  ownerMobile: string
  managerName: string
  managerTitle: string
  phoneNumber: string
  mobile: string
  chainId: number
  branchId: number
  branchName: string
  branchNumber: number
  branchType: number
  registrationDate: string
  modificationDate: string
  address1: string
  address2: string
  branchGroupId: number
  branchGroupName: string
  customBranchTypeId: number
  customBranchTypeName: string
  branchShopId: number
}
export interface IBranchesResponse {
  pagingInfo: PagingInfo
  items: IBranchItem[]
}

export interface IBranchRequest {
  branchShopId: number
  branchNumber: number
  branchGroupId: number
  customBranchTypeId: number
}

export type IBranchUpdateResponse = {
  modificationDate: string
  customBranchTypeName: string | null
  branchGroupName: string | null
  branchShopId: number
  branchNumber: number
  branchAlias: string | null
  customBranchTypeId: number
  branchGroupId: number
}

export type IChangeOrderNoPayload = {
  chainId: number
  oldPositionId: number
  newPositionId: number
}

export type IAddBranchTypePayload = {
  chainId: number
  name: string
}

export interface IAddBranchTypeResponse {
  id: number
  orderNo: number
  registrationDate: string
  name: string
  chainId: number
}

export type IAddBranchGroupResponse = IAddBranchTypeResponse
export type IAddBranchGroupPayload = IAddBranchTypePayload

export interface IEditBranchTypePayload {
  chainId: number
  id: number
  name: string
}

export type IEditBranchGroupPayload = IEditBranchTypePayload

export type IEditBranchGroupResponse = IEditBranchTypeResponse

export type IEditBranchTypeResponse = {
  orderNo: number
  id: number
  name: string
  chainId: number
}

export type IDeleteBranchTypePayload = {
  id: number
  chainId: number
  isConfirm: boolean
}
