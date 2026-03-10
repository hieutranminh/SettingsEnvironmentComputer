import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'
import type { Admin, CreateAdminRequest, UpdateAdminRequest, AdminListParams } from '@/types/Admin'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'

export const adminService = {
  // Get all admins with pagination and filters
  getAdmins: async (params?: AdminListParams): Promise<PaginatedResponse<Admin>> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.role) queryParams.append('role', params.role)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params?.salonId) queryParams.append('salonId', params.salonId)

    const endpoint = `${API_ENDPOINTS.ADMINS.BASE}?${queryParams.toString()}`
    const response = await apiGet<PaginatedResponse<Admin>>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch admins')
    }

    return response.data
  },

  // Get admin by ID
  getAdminById: async (id: string): Promise<Admin> => {
    const response = await apiGet<Admin>(API_ENDPOINTS.ADMINS.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch admin with ID: ${id}`)
    }

    return response.data
  },

  // Create new admin
  createAdmin: async (adminData: CreateAdminRequest): Promise<Admin> => {
    const response = await apiPost<Admin>(API_ENDPOINTS.ADMINS.BASE, adminData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create admin')
    }

    return response.data
  },

  // Update admin
  updateAdmin: async (id: string, adminData: UpdateAdminRequest): Promise<Admin> => {
    const response = await apiPut<Admin>(API_ENDPOINTS.ADMINS.BY_ID(id), adminData)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update admin with ID: ${id}`)
    }

    return response.data
  },

  // Delete admin
  deleteAdmin: async (id: string): Promise<void> => {
    const response = await apiDelete<void>(API_ENDPOINTS.ADMINS.BY_ID(id))

    if (!response.success) {
      throw new Error(response.message || `Failed to delete admin with ID: ${id}`)
    }
  },

  // Get admin profile
  getAdminProfile: async (): Promise<Admin> => {
    const response = await apiGet<Admin>(API_ENDPOINTS.ADMINS.PROFILE)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch admin profile')
    }

    return response.data
  },

  // Update admin profile
  updateAdminProfile: async (adminData: UpdateAdminRequest): Promise<Admin> => {
    const response = await apiPatch<Admin>(API_ENDPOINTS.ADMINS.UPDATE_PROFILE, adminData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update admin profile')
    }

    return response.data
  }
}
