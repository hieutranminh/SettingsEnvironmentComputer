import type { IBranchGroupRequest, IBranchGroupResponse } from '@/types/admins/BranchGroup'
import type { BranchSalesRequest, BranchSalesResponse } from '@/types/admins/BranchSales'
import type {
  IBranchSalesTotalFilterRequest,
  IBranchSalesTotalFilterResponse,
} from '@/types/admins/BranchSalesTotalFilter'
import type {
  CustomBranchTypeRequest,
  CustomBranchTypeResponse,
} from '@/types/admins/CustomBranchType'
import type { ApiResponse } from '@/types/ApiResponse'
import type { BranchSalesFilterRequest, IBranchesResponse } from '@/types/branch/branches'

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
    request: CustomBranchTypeRequest,
  ): Promise<ApiResponse<CustomBranchTypeResponse>> => {
    return await adminsReadService.post<CustomBranchTypeResponse>('CustomBranchType', request)
  },

  /**
   * Fetches branch groups for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the branch groups response
   */
  getBranchGroups: async (
    request: IBranchGroupRequest,
  ): Promise<ApiResponse<IBranchGroupResponse>> => {
    return await adminsReadService.post<IBranchGroupResponse>('BranchGroup', request)
  },

  /**
   * Fetches branch sales total filter data for a specific shop
   * @param request - The request payload containing shopId
   * @returns Promise with the branch sales total filter response
   */
  getBranchSalesTotalFilter: async (
    request: IBranchSalesTotalFilterRequest,
  ): Promise<ApiResponse<IBranchSalesTotalFilterResponse>> => {
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
    request: BranchSalesRequest,
  ): Promise<ApiResponse<BranchSalesResponse>> => {
    return await adminsReadService.post<BranchSalesResponse>('Branch/BranchSales', request)
  },

  getBranches: async (
    request: BranchSalesFilterRequest,
  ): Promise<ApiResponse<IBranchesResponse>> => {
    return await adminsReadService.post<IBranchesResponse>('Branch/All', request)
  },
}
