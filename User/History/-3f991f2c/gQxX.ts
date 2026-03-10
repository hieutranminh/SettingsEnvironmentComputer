export interface BranchGroup {
  id: number
  name: string
  chainId: number
}

export interface BranchGroupRequest {
  chainId: number
}

export interface BranchGroupResponse {
  items: BranchGroup[]
}
