import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'
import type { CustomBranchTypeResponse } from '@/types/shop/shop'

/**
 * Pure API service for shop read operations
 * Contains only API calls without any business logic
 */
export const shopReadService = {
  /**
   * Get custom branch types
   * @returns Promise with API response containing custom branch types
   */
  getCustomBranchTypes: async (): Promise<ApiResponse<CustomBranchTypeResponse>> => {
    return await apiRead.get<CustomBranchTypeResponse>('admins/CustomBranchType')
  },
}
