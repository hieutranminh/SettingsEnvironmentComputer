import { apiService } from '../api'
import type { ApiResponse } from '@/types/ApiResponse'

// Types for sales command operations
export interface CreateSaleRequest {
  // Add specific fields based on your API requirements
  customerId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  totalAmount: number
}

export interface UpdateSaleRequest {
  saleId: string
  // Add specific fields based on your API requirements
  status?: string
  totalAmount?: number
}

export interface DeleteSaleRequest {
  saleId: string
}

export interface SaleResponse {
  id: string
  customerId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
}

// Command functions for sales operations
export const createSale = async (data: CreateSaleRequest): Promise<ApiResponse<SaleResponse>> => {
  return apiService.post<SaleResponse>('/api/cmd/v1/Sales/Create', data)
}

export const updateSale = async (data: UpdateSaleRequest): Promise<ApiResponse<SaleResponse>> => {
  return apiService.put<SaleResponse>(`/api/cmd/v1/Sales/Update/${data.saleId}`, data)
}

export const deleteSale = async (saleId: string): Promise<ApiResponse<void>> => {
  return apiService.delete<void>(`/api/cmd/v1/Sales/Delete/${saleId}`)
}

export const processSale = async (saleId: string): Promise<ApiResponse<SaleResponse>> => {
  return apiService.post<SaleResponse>(`/api/cmd/v1/Sales/Process/${saleId}`)
}
