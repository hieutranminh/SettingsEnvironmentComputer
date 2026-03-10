import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiRead } from '@/services/api'
import type { CustomBranchTypeRequest, CustomBranchTypeResponse } from '@/types/admins/CustomBranchType'
import type { ApiResponse } from '@/types/ApiResponse'

/**
 * Fetches custom branch types for a specific chain
 * @param request - The request payload containing chainId
 * @returns Promise with the custom branch types response
 */
export const fetchCustomBranchTypes = async (
  request: CustomBranchTypeRequest,
): Promise<ApiResponse<CustomBranchTypeResponse>> => {
  return apiRead.post<CustomBranchTypeResponse>(API_ENDPOINTS.ADMINS.CUSTOM_BRANCH_TYPE, request)
}
