import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'
import type { Good, CreateGoodRequest, UpdateGoodRequest, GoodListParams } from '@/types/Good'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'

export const goodService = {
  // Get all goods with pagination and filters
  getGoods: async (params?: GoodListParams): Promise<PaginatedResponse<Good>> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params?.salonId) queryParams.append('salonId', params.salonId)
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())

    const endpoint = `${API_ENDPOINTS.GOODS.BASE}?${queryParams.toString()}`
    const response = await apiGet<PaginatedResponse<Good>>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch goods')
    }

    return response.data
  },

  // Get good by ID
  getGoodById: async (id: string): Promise<Good> => {
    const response = await apiGet<Good>(API_ENDPOINTS.GOODS.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch good with ID: ${id}`)
    }

    return response.data
  },

  // Create new good
  createGood: async (goodData: CreateGoodRequest): Promise<Good> => {
    const response = await apiPost<Good>(API_ENDPOINTS.GOODS.BASE, goodData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create good')
    }

    return response.data
  },

  // Update good
  updateGood: async (id: string, goodData: UpdateGoodRequest): Promise<Good> => {
    const response = await apiPut<Good>(API_ENDPOINTS.GOODS.BY_ID(id), goodData)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update good with ID: ${id}`)
    }

    return response.data
  },

  // Delete good
  deleteGood: async (id: string): Promise<void> => {
    const response = await apiDelete<void>(API_ENDPOINTS.GOODS.BY_ID(id))

    if (!response.success) {
      throw new Error(response.message || `Failed to delete good with ID: ${id}`)
    }
  },

  // Get good categories
  getGoodCategories: async (): Promise<string[]> => {
    const response = await apiGet<string[]>(API_ENDPOINTS.GOODS.CATEGORIES)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch good categories')
    }

    return response.data
  },

  // Upload good image
  uploadGoodImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await apiPost<{ imageUrl: string }>(API_ENDPOINTS.GOODS.UPLOAD_IMAGE, formData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload good image')
    }

    return response.data
  }
}
