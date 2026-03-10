import type { BranchGroupRequest, BranchGroupResponse } from '@/types/admins/BranchGroup'
import type { BranchSalesRequest, BranchSalesResponse } from '@/types/admins/BranchSales'
import type {
  BranchSalesTotalFilterRequest,
  BranchSalesTotalFilterResponse,
} from '@/types/admins/BranchSalesTotalFilter'
import type { CustomBranchTypeRequest, CustomBranchTypeResponse } from '@/types/admins/CustomBranchType'
import type { ApiResponse } from '@/types/ApiResponse'

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
  getCustomBranchTypes: async (request: CustomBranchTypeRequest): Promise<ApiResponse<CustomBranchTypeResponse>> => {
    return await adminsReadService.post<CustomBranchTypeResponse>('CustomBranchType', request)
  },

  /**
   * Fetches branch groups for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the branch groups response
   */
  getBranchGroups: async (request: BranchGroupRequest): Promise<ApiResponse<BranchGroupResponse>> => {
    return await adminsReadService.post<BranchGroupResponse>('BranchGroup', request)
  },

  /**
   * Fetches branch sales total filter data for a specific shop
   * @param request - The request payload containing shopId
   * @returns Promise with the branch sales total filter response
   */
  getBranchSalesTotalFilter: async (
    request: BranchSalesTotalFilterRequest,
  ): Promise<ApiResponse<BranchSalesTotalFilterResponse>> => {
    return await adminsReadService.post<BranchSalesTotalFilterResponse>('Branch/BranchSalesTotalFilter', request)
  },

  /**
   * Fetches branch sales for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the branch sales response
   */
  getBranchSales: async (request: BranchSalesRequest): Promise<ApiResponse<BranchSalesResponse>> => {
    return await adminsReadService.post<BranchSalesResponse>('Branch/BranchSales', request)
  },
}
