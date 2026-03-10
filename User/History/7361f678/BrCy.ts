import { apiService } from '../api'
import type { ApiResponse } from '@/types/ApiResponse'

// Calendar Setup Types
export interface CalendarSetup {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CalendarSetupListResponse {
  calendarSetups: CalendarSetup[]
  totalCount: number
}

export interface CalendarSetupDetailResponse {
  calendarSetup: CalendarSetup
}

// Calendar Setup Read API Functions
export const calendarSetupReadService = {
  /**
   * Get all calendar setups
   */
  async getCalendarSetupList(): Promise<ApiResponse<CalendarSetupListResponse>> {
    return apiService.get<CalendarSetupListResponse>('/read/v1/CalendarSetup')
  },

  /**
   * Get calendar setup by ID
   */
  async getCalendarSetupById(id: string): Promise<ApiResponse<CalendarSetupDetailResponse>> {
    return apiService.get<CalendarSetupDetailResponse>(`/read/v1/CalendarSetup/${id}`)
  },

  /**
   * Get active calendar setups only
   */
  async getActiveCalendarSetups(): Promise<ApiResponse<CalendarSetupListResponse>> {
    return apiService.get<CalendarSetupListResponse>('/read/v1/CalendarSetup?isActive=true')
  }
}
