export interface ICustomBranchType {
  id: number
  name: string
  chainId: number
}

export interface ICustomBranchTypeRequest {
  chainId: number
}

export interface ICustomBranchTypeResponse {
  items: ICustomBranchType[]
}
