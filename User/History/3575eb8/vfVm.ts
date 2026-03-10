import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'
import type { Staff, CreateStaffRequest, UpdateStaffRequest, StaffListParams, WorkingHours } from '@/types/Staff'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'

export const staffService = {
  // Get all staff with pagination and filters
  getStaffs: async (params?: StaffListParams): Promise<PaginatedResponse<Staff>> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.position) queryParams.append('position', params.position)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params?.salonId) queryParams.append('salonId', params.salonId)

    const endpoint = `${API_ENDPOINTS.STAFFS.BASE}?${queryParams.toString()}`
    const response = await apiGet<PaginatedResponse<Staff>>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch staffs')
    }

    return response.data
  },

  // Get staff by ID
  getStaffById: async (id: string): Promise<Staff> => {
    const response = await apiGet<Staff>(API_ENDPOINTS.STAFFS.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch staff with ID: ${id}`)
    }

    return response.data
  },

  // Create new staff
  createStaff: async (staffData: CreateStaffRequest): Promise<Staff> => {
    const response = await apiPost<Staff>(API_ENDPOINTS.STAFFS.BASE, staffData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create staff')
    }

    return response.data
  },

  // Update staff
  updateStaff: async (id: string, staffData: UpdateStaffRequest): Promise<Staff> => {
    const response = await apiPut<Staff>(API_ENDPOINTS.STAFFS.BY_ID(id), staffData)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update staff with ID: ${id}`)
    }

    return response.data
  },

  // Delete staff
  deleteStaff: async (id: string): Promise<void> => {
    const response = await apiDelete<void>(API_ENDPOINTS.STAFFS.BY_ID(id))

    if (!response.success) {
      throw new Error(response.message || `Failed to delete staff with ID: ${id}`)
    }
  },

  // Upload staff image
  uploadStaffImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await apiPost<{ imageUrl: string }>(API_ENDPOINTS.STAFFS.UPLOAD_IMAGE, formData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload staff image')
    }

    return response.data
  },

  // Get staff schedule
  getStaffSchedule: async (id: string): Promise<WorkingHours> => {
    const response = await apiGet<WorkingHours>(API_ENDPOINTS.STAFFS.SCHEDULE(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch staff schedule for ID: ${id}`)
    }

    return response.data
  },

  // Update staff schedule
  updateStaffSchedule: async (id: string, schedule: WorkingHours): Promise<WorkingHours> => {
    const response = await apiPut<WorkingHours>(API_ENDPOINTS.STAFFS.SCHEDULE(id), schedule)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update staff schedule for ID: ${id}`)
    }

    return response.data
  }
}
