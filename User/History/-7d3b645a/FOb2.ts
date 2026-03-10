import { apiGet } from '@/api'
import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'

// Goods types
export interface Goods {
  id: string
  name: string
  description?: string
  price: number
  category: string
  stockQuantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GoodsFilter {
  category?: string
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface GoodsDetail extends Goods {
  images?: string[]
  specifications?: Record<string, any>
  supplier?: {
    id: string
    name: string
    contact: string
  }
}

// Goods Read Service
export const goodsReadService = {
  /**
   * Get all goods with pagination and filtering
   */
  getAll: async (filter?: GoodsFilter): Promise<ApiResponse<PaginatedResponse<Goods>>> => {
    const params = new URLSearchParams()

    if (filter?.category) params.append('category', filter.category)
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString())
    if (filter?.search) params.append('search', filter.search)
    if (filter?.page) params.append('page', filter.page.toString())
    if (filter?.limit) params.append('limit', filter.limit.toString())

    const queryString = params.toString()
    const endpoint = `/goods?${queryString}`

    return await apiGet<PaginatedResponse<Goods>>(endpoint)
  },

  /**
   * Get goods by ID
   */
  getById: async (id: string): Promise<ApiResponse<GoodsDetail>> => {
    return await apiGet<GoodsDetail>(`/goods/${id}`)
  },

  /**
   * Get goods by category
   */
  getByCategory: async (category: string): Promise<ApiResponse<Goods[]>> => {
    return await apiGet<Goods[]>(`/goods/category/${category}`)
  },

  /**
   * Search goods by name or description
   */
  search: async (query: string): Promise<ApiResponse<Goods[]>> => {
    return await apiGet<Goods[]>(`/goods/search?q=${encodeURIComponent(query)}`)
  },

  /**
   * Get active goods only
   */
  getActive: async (): Promise<ApiResponse<Goods[]>> => {
    return await apiGet<Goods[]>('/goods/active')
  },

  /**
   * Get low stock goods (below threshold)
   */
  getLowStock: async (threshold: number = 10): Promise<ApiResponse<Goods[]>> => {
    return await apiGet<Goods[]>(`/goods/low-stock?threshold=${threshold}`)
  }
}
