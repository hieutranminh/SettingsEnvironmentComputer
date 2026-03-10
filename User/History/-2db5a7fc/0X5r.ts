import { apiCmd, apiClient } from '../api'
import type { ApiResponse } from '@/types/ApiResponse'
import type { Goods } from './goods.read'

// Command types
export interface CreateGoodsRequest {
  name: string
  description?: string
  price: number
  category: string
  stockQuantity: number
  isActive?: boolean
  images?: string[]
  specifications?: Record<string, unknown>
  supplierId?: string
}

export interface UpdateGoodsRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  stockQuantity?: number
  isActive?: boolean
  images?: string[]
  specifications?: Record<string, unknown>
  supplierId?: string
}

export interface BulkUpdateStockRequest {
  goodsId: string
  quantity: number
  operation: 'add' | 'subtract' | 'set'
  reason?: string
}

// Goods Command Service
export const goodsCmdService = {
  /**
   * Create new goods
   */
  create: async (data: CreateGoodsRequest): Promise<ApiResponse<Goods>> => {
    return await apiCmd.post<Goods>('goods', data)
  },

  /**
   * Update goods by ID
   */
  update: async (id: string, data: UpdateGoodsRequest): Promise<ApiResponse<Goods>> => {
    return await apiCmd.put<Goods>(`goods/${id}`, data)
  },

  /**
   * Partially update goods by ID
   */
  patch: async (id: string, data: UpdateGoodsRequest): Promise<ApiResponse<Goods>> => {
    return await apiCmd.patch<Goods>(`goods/${id}`, data)
  },

  /**
   * Delete goods by ID
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return await apiCmd.delete<void>(`goods/${id}`)
  },

  /**
   * Bulk delete goods
   */
  bulkDelete: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiCmd.post<void>('goods/bulk-delete', { ids })
  },

  /**
   * Update stock quantity
   */
  updateStock: async (id: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set'): Promise<ApiResponse<Goods>> => {
    return await apiCmd.patch<Goods>(`goods/${id}/stock`, { quantity, operation })
  },

  /**
   * Bulk update stock quantities
   */
  bulkUpdateStock: async (updates: BulkUpdateStockRequest[]): Promise<ApiResponse<Goods[]>> => {
    return await apiCmd.post<Goods[]>('goods/bulk-stock-update', { updates })
  },

  /**
   * Activate goods
   */
  activate: async (id: string): Promise<ApiResponse<Goods>> => {
    return await apiCmd.patch<Goods>(`goods/${id}/activate`, {})
  },

  /**
   * Deactivate goods
   */
  deactivate: async (id: string): Promise<ApiResponse<Goods>> => {
    return await apiCmd.patch<Goods>(`goods/${id}/deactivate`, {})
  },

  /**
   * Upload goods images
   */
  uploadImages: async (id: string, images: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> => {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append(`images`, image)
    })

    return await apiCmd.post<{ imageUrls: string[] }>(`goods/${id}/images`, formData)
  },

  /**
   * Remove goods images
   */
  removeImages: async (id: string, imageUrls: string[]): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/cmd/v1/goods/${id}/images`, { data: { imageUrls } })
    return response.data
  }
}
