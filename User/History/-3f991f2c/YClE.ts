import type { IApiResponse } from '../ApiResponse'

export interface IBranchGroup {
  id: number
  name: string
  chainId: number
}

export interface IBranchGroupRequest {
  chainId: number
}

export type IBranchGroupResponse = IApiResponse<IBranchGroup[]>
