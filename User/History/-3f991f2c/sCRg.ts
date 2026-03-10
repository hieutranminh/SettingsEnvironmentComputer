import type { IApiResponse, IListResponse } from '../ApiResponse'

export interface IBranchGroup {
  id: number
  name: string
  chainId: number
}

export interface IBranchGroupRequest {
  chainId: number
}

export type IBranchGroupResult = IListResponse<IBranchGroup>

export type IBranchGroupResponse = IApiResponse<IBranchGroupResult>
