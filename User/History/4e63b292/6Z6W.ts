// import { apiService } from '../api'
import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'

// Types for sales read operations
export interface SaleListRequest {
  page?: number
  limit?: number
  status?: string
  customerId?: string
  startDate?: string
  endDate?: string
}

export interface SaleDetailRequest {
  saleId: string
}

export interface SaleResponse {
  id: string
  customerId: string
  customerName: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    totalPrice: number
  }>
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface SaleSummaryResponse {
  totalSales: number
  totalAmount: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    productName: string
    totalSold: number
    totalRevenue: number
  }>
}

// Read functions for sales operations
export const getSalesList = async (params?: SaleListRequest): Promise<ApiResponse<PaginatedResponse<SaleResponse>>> => {
  const queryParams = new URLSearchParams()

  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.customerId) queryParams.append('customerId', params.customerId)
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)

  const queryString = queryParams.toString()
  const endpoint = `/api/read/v1/Sales/GetList${queryString ? `?${queryString}` : ''}`

  return apiService.get<PaginatedResponse<SaleResponse>>(endpoint)
}

export const getSaleById = async (saleId: string): Promise<ApiResponse<SaleResponse>> => {
  return apiService.get<SaleResponse>(`/api/read/v1/Sales/GetById/${saleId}`)
}

export const getSalesSummary = async (params?: {
  startDate?: string
  endDate?: string
  customerId?: string
}): Promise<ApiResponse<SaleSummaryResponse>> => {
  const queryParams = new URLSearchParams()

  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  if (params?.customerId) queryParams.append('customerId', params.customerId)

  const queryString = queryParams.toString()
  const endpoint = `/api/read/v1/Sales/GetSummary${queryString ? `?${queryString}` : ''}`

  return apiService.get<SaleSummaryResponse>(endpoint)
}

export const getSalesByCustomer = async (customerId: string, params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ApiResponse<PaginatedResponse<SaleResponse>>> => {
  const queryParams = new URLSearchParams()

  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.status) queryParams.append('status', params.status)

  const queryString = queryParams.toString()
  const endpoint = `/api/read/v1/Sales/GetByCustomer/${customerId}${queryString ? `?${queryString}` : ''}`

  return apiService.get<PaginatedResponse<SaleResponse>>(endpoint)
}
