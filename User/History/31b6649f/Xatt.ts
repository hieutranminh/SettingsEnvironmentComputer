import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'
import type { Sale, CreateSaleRequest, UpdateSaleRequest, SaleListParams, SaleStatistics } from '@/types/Sale'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'

export const saleService = {
  // Get all sales with pagination and filters
  getSales: async (params?: SaleListParams): Promise<PaginatedResponse<Sale>> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.clientId) queryParams.append('clientId', params.clientId)
    if (params?.staffId) queryParams.append('staffId', params.staffId)
    if (params?.salonId) queryParams.append('salonId', params.salonId)
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.SALES.BASE}?${queryParams.toString()}`
    const response = await apiGet<PaginatedResponse<Sale>>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch sales')
    }

    return response.data
  },

  // Get sale by ID
  getSaleById: async (id: string): Promise<Sale> => {
    const response = await apiGet<Sale>(API_ENDPOINTS.SALES.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch sale with ID: ${id}`)
    }

    return response.data
  },

  // Create new sale
  createSale: async (saleData: CreateSaleRequest): Promise<Sale> => {
    const response = await apiPost<Sale>(API_ENDPOINTS.SALES.BASE, saleData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create sale')
    }

    return response.data
  },

  // Update sale
  updateSale: async (id: string, saleData: UpdateSaleRequest): Promise<Sale> => {
    const response = await apiPut<Sale>(API_ENDPOINTS.SALES.BY_ID(id), saleData)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update sale with ID: ${id}`)
    }

    return response.data
  },

  // Delete sale
  deleteSale: async (id: string): Promise<void> => {
    const response = await apiDelete<void>(API_ENDPOINTS.SALES.BY_ID(id))

    if (!response.success) {
      throw new Error(response.message || `Failed to delete sale with ID: ${id}`)
    }
  },

  // Get sales statistics
  getSalesStatistics: async (salonId?: string, startDate?: string, endDate?: string): Promise<SaleStatistics> => {
    const queryParams = new URLSearchParams()
    if (salonId) queryParams.append('salonId', salonId)
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const endpoint = `${API_ENDPOINTS.SALES.STATISTICS}?${queryParams.toString()}`
    const response = await apiGet<SaleStatistics>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch sales statistics')
    }

    return response.data
  },

  // Get sales reports
  getSalesReports: async (reportType: 'daily' | 'weekly' | 'monthly', salonId?: string, startDate?: string, endDate?: string): Promise<any> => {
    const queryParams = new URLSearchParams()
    queryParams.append('type', reportType)
    if (salonId) queryParams.append('salonId', salonId)
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const endpoint = `${API_ENDPOINTS.SALES.REPORTS}?${queryParams.toString()}`
    const response = await apiGet<any>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch sales reports')
    }

    return response.data
  }
}
