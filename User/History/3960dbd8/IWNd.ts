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
export const staffsReadService = {
  /**
   * Fetches custom branch types for a specific chain
   * @param request - The request payload containing chainId
   * @returns Promise with the custom branch types response
   */
  getCustomBranchTypes: async (request: CustomBranchTypeRequest): Promise<ApiResponse<CustomBranchTypeResponse>> => {
    return await adminsReadService.post<CustomBranchTypeResponse>('CustomBranchType', request)
  },
}
