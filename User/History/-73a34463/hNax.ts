import { apiService } from './base'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
}

export interface UserFilters {
  search?: string
  role?: string
  created_at_from?: string
  created_at_to?: string
}

export const userApi = {
  async getUsers(
    page = 1,
    limit = 10,
    filters?: UserFilters
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = filters ? { ...filters } : {}
    return apiService.getPaginated<User>('/users', page, limit, { params })
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(`/users/${id}`)
  },

  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    return apiService.post<User>('/users', data)
  },

  async updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiService.put<User>(`/users/${id}`, data)
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/users/${id}`)
  },

  async updateProfile(data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiService.put<User>('/users/profile', data)
  },

  async changePassword(data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }): Promise<ApiResponse<void>> {
    return apiService.post<void>('/users/change-password', data)
  },
}
