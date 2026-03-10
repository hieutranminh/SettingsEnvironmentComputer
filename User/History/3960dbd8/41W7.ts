import { apiRead } from '@/services/api'
import type { IApiResponse } from '@/types/ApiResponse'

// Request payload interface for Active Staffs
export interface IActiveStaffsRequest {
  headquarterShopId: number
  shopId: number
}

// Response item interface for Active Staffs
export interface IActiveStaffsItem {
  aliasName: string
  shopId: number
  staffId: number
  staffNumber: number
}

// Result interface for Active Staffs
export interface IActiveStaffsResult {
  items: IActiveStaffsItem[]
}

export type IActiveStaffsResponse = IApiResponse<IActiveStaffsResult>

/**
 * Fetches active staffs data from the API
 * @param request - The request parameters for the report
 * @returns Promise containing the API response with active staffs data
 */
export const getActiveStaffs = async (
  request: IActiveStaffsRequest,
): Promise<IActiveStaffsResponse> => {
  return await apiRead.post<IActiveStaffsResult>('staffs/Staff/Active', request)
}
