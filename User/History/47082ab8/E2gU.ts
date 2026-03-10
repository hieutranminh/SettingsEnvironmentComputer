import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'
import type { CustomBranchType, CustomBranchTypeListResponse, CustomBranchTypeFilter } from '@/types/branch/CustomBranchType'

// Admins Read Service
export const adminsReadService = {
  /**
   * Get all custom branch types
   */
  getCustomBranchTypes: async (filter?: CustomBranchTypeFilter): Promise<ApiResponse<CustomBranchTypeListResponse>> => {
    const params = new URLSearchParams()

    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString())
    if (filter?.search) params.append('search', filter.search)

    const queryString = params.toString()
    const endpoint = queryString ? `admins/CustomBranchType?${queryString}` : 'admins/CustomBranchType'

    return await apiRead.get<CustomBranchTypeListResponse>(endpoint)
  },

  /**
   * Get custom branch type by ID
   */
  getCustomBranchTypeById: async (id: number): Promise<ApiResponse<CustomBranchType>> => {
    return await apiRead.get<CustomBranchType>(`admins/CustomBranchType/${id}`)
  },

  /**
   * Get active custom branch types only
   */
  getActiveCustomBranchTypes: async (): Promise<ApiResponse<CustomBranchTypeListResponse>> => {
    return await adminsReadService.getCustomBranchTypes({ isActive: true })
  },
}