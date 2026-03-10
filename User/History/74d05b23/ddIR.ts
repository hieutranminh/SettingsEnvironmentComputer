import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'
import type { Client, CreateClientRequest, UpdateClientRequest, ClientListParams } from '@/types/Client'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'

export const clientService = {
  // Get all clients with pagination and filters
  getClients: async (params?: ClientListParams): Promise<PaginatedResponse<Client>> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params?.salonId) queryParams.append('salonId', params.salonId)
    if (params?.gender) queryParams.append('gender', params.gender)

    const endpoint = `${API_ENDPOINTS.CLIENTS.BASE}?${queryParams.toString()}`
    const response = await apiGet<PaginatedResponse<Client>>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch clients')
    }

    return response.data
  },

  // Get client by ID
  getClientById: async (id: string): Promise<Client> => {
    const response = await apiGet<Client>(API_ENDPOINTS.CLIENTS.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch client with ID: ${id}`)
    }

    return response.data
  },

  // Create new client
  createClient: async (clientData: CreateClientRequest): Promise<Client> => {
    const response = await apiPost<Client>(API_ENDPOINTS.CLIENTS.BASE, clientData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create client')
    }

    return response.data
  },

  // Update client
  updateClient: async (id: string, clientData: UpdateClientRequest): Promise<Client> => {
    const response = await apiPut<Client>(API_ENDPOINTS.CLIENTS.BY_ID(id), clientData)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update client with ID: ${id}`)
    }

    return response.data
  },

  // Delete client
  deleteClient: async (id: string): Promise<void> => {
    const response = await apiDelete<void>(API_ENDPOINTS.CLIENTS.BY_ID(id))

    if (!response.success) {
      throw new Error(response.message || `Failed to delete client with ID: ${id}`)
    }
  },

  // Upload client image
  uploadClientImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await apiPost<{ imageUrl: string }>(API_ENDPOINTS.CLIENTS.UPLOAD_IMAGE, formData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload client image')
    }

    return response.data
  },

  // Get client statistics
  getClientStatistics: async (salonId?: string): Promise<{
    totalClients: number
    activeClients: number
    newClientsThisMonth: number
    averageVisitsPerClient: number
  }> => {
    const queryParams = new URLSearchParams()
    if (salonId) queryParams.append('salonId', salonId)

    const endpoint = `${API_ENDPOINTS.CLIENTS.STATISTICS}?${queryParams.toString()}`
    const response = await apiGet<{
      totalClients: number
      activeClients: number
      newClientsThisMonth: number
      averageVisitsPerClient: number
    }>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch client statistics')
    }

    return response.data
  }
}
