import { apiRead } from '@/services/api'
import type {
  IBranchGroupResult,
  IBranchGroupRequest,
  IBranchGroupResponse,
} from '@/types/admins/BranchGroup'
import type { IBranchSalesRequest, IBranchSalesResponse } from '@/types/admins/BranchSales'
import type {
  IBranchSalesTotalFilterRequest,
  IBranchSalesTotalFilterResponse,
} from '@/types/admins/BranchSalesTotalFilter'
import type {
  ICustomBranchTypeRequest,
  ICustomBranchTypeResponse,
} from '@/types/admins/CustomBranchType'
import type { IApiResponse } from '@/types/ApiResponse'
import type { IBranchSalesFilterRequest, IBranchesResponse } from '@/types/branch/branches'

import { adminsReadService } from '../admins.read'

/**
 * Branch Read Service
 * Handles all branch-related read operations
 */
export const branchReadService = {
  /**
   * Fetches custom branch types for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the custom branch types response
   */
  getCustomBranchTypes: async (
    request: ICustomBranchTypeRequest,
  ): Promise<IApiResponse<ICustomBranchTypeResponse>> => {
    return await adminsReadService.post<ICustomBranchTypeResponse>('CustomBranchType', request)
  },

  /**
   * Fetches branch groups for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the branch groups response
   */
  getBranchGroups: (request: IBranchGroupRequest): Promise<IBranchGroupResponse> => {
    return apiRead.post<IBranchGroupResult>('admins/BranchGroup', request)
  },

  /**
   * Fetches branch sales total filter data for a specific shop
   * @param request - The request payload containing shopId
   * @returns Promise with the branch sales total filter response
   */
  getBranchSalesTotalFilter: async (
    request: IBranchSalesTotalFilterRequest,
  ): Promise<IApiResponse<IBranchSalesTotalFilterResponse>> => {
    return await adminsReadService.post<IBranchSalesTotalFilterResponse>(
      'Branch/BranchSalesTotalFilter',
      request,
    )
  },

  /**
   * Fetches branch sales for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the branch sales response
   */
  getBranchSales: async (
    request: IBranchSalesRequest,
  ): Promise<IApiResponse<IBranchSalesResponse>> => {
    return await adminsReadService.post<IBranchSalesResponse>('Branch/BranchSales', request)
  },

  getBranches: async (
    request: IBranchSalesFilterRequest,
  ): Promise<IApiResponse<IBranchesResponse>> => {
    return await adminsReadService.post<IBranchesResponse>('Branch/All', request)
  },
}
