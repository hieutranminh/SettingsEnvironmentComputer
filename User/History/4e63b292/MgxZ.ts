import type { ApiResponse } from '@/types/ApiResponse'
import type {
  BranchSalesTotalReportRequest,
  BranchSalesTotalReportResponse
} from '@/types/branch/BranchSalesTotalReport'
import { apiRead } from '../api'

// Sales Read Service - Base API layer with /sales prefix
export const salesReadService = {
  /**
   * Make a GET request to /sales/{endpoint}
   */
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return await apiRead.get<T>(`sales/${endpoint}`)
  },

  /**
   * Make a POST request to /sales/{endpoint} (for complex queries)
   */
  post: async <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
    return await apiRead.post<T>(`sales/${endpoint}`, data)
  }
}

// Branch Sales Total Report Service
export const branchSalesTotalReportService = {
  /**
   * Get branch sales total report
   */
  getBranchSalesTotalReport: async (
    request: BranchSalesTotalReportRequest
  ): Promise<ApiResponse<BranchSalesTotalReportResponse>> => {
    return await salesReadService.post<BranchSalesTotalReportResponse>(
      'SalesReports/BranchSalesTotalReport',
      request
    )
  }
} 