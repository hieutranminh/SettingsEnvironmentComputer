import { apiRead } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import type { ApiResponse } from '@/types/ApiResponse'
import type { CustomBranchTypeRequest, CustomBranchTypeResponse } from '@/types/admins/CustomBranchType'

/**
 * Fetches custom branch types for a specific chain
 * @param request - The request payload containing chainId
 * @returns Promise with the custom branch types response
 */
export const fetchCustomBranchTypes = async (
  request: CustomBranchTypeRequest
): Promise<ApiResponse<CustomBranchTypeResponse>> => {
  return apiRead.post<CustomBranchTypeResponse>(
    API_ENDPOINTS.ADMINS.CUSTOM_BRANCH_TYPE,
    request
  )
}