export interface IBranchGroup {
  id: number
  name: string
  chainId: number
}

export interface IBranchGroupRequest {
  chainId: number
}

export interface IBranchGroupResponse {
  items: IBranchGroup[]
}
