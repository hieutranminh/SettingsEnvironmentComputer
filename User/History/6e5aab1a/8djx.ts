export interface CustomBranchType {
  id: number
  name: string
  chainId: number
}

export interface CustomBranchTypeResponse {
  items: CustomBranchType[]
}

export interface CustomBranchTypeRequest {
  chainId: number
}
