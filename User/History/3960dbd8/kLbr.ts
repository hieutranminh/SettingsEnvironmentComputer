import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'

// Request payload interface for Active Staffs
export interface ActiveStaffsRequest {
  headquarterShopId: number
  shopId: number
}

// Response item interface for Active Staffs
export interface ActiveStaffsItem {
  aliasName: string
  shopId: number
  staffId: number
  staffNumber: number
}

// Result interface for Active Staffs
export interface ActiveStaffsResult {
  items: ActiveStaffsItem[]
}

export type ActiveStaffsResponse = ApiResponse<ActiveStaffsResult>

/**
 * Fetches sales by date report data from the API
 * @param request - The request parameters for the report
 * @returns Promise containing the API response with sales by date report data
 */
export const getActiveStaffs = async (request: ActiveStaffsRequest): Promise<ActiveStaffsResponse> => {
  return await apiRead.post<ActiveStaffsResult>('staffs/Staff/Active', request)
}
