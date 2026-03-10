import type { ApiResponse, ListResponse } from '@/types/ApiResponse'

import { goodsReadService } from '../goods.read'

// Service Read types
export interface Service {
  serviceId: number
  serviceName: string
  serviceCategoryId: number
  price: number
  estimatedTime: number
  salarySalesValue: number
  salarySalesType: number
  salaryDeductionValue: number
  enableOnlineBookings: boolean
  shopId: number
  status: number
  orderNo: number
  numberOfActiveChildItems: number
  serviceDetails: string
  onlineDescription: string
  registrationDate: string
  modificationDate: string
}

export interface ServiceCategory {
  id: number
  serviceCategoryName: string
  shopId: number
  status: number
  active: boolean
  description?: string
  created_at?: string
  updated_at?: string
}

export interface GetServicesParams {
  pageSize?: number
  pageNumber?: number
  shopId?: number
  status?: number
  serviceCategoryId?: number
  includeInactive?: boolean
}

export interface ServiceCategoryRequest {
  headquarterShopId?: number
  pageSize?: number
  pageNumber?: number
  shopId?: number
  status?: number
}

export interface ServiceCategoryItem {
  isHeadquarterGoods: boolean
  modificationDate: string
  numberOfActiveChildItems: number
  orderNo: number
  ownShopId: number
  registrationDate: string
  serviceCategoryId: number
  serviceCategoryName: string
  shared: boolean
  shopId: number
  status: number
}

export type ServiceCategoryResponse = ApiResponse<ListResponse<ServiceCategoryItem[]>>

// Prepaid Service interfaces
export interface GetPrepaidServiceRequest {
  pageSize: number
  pageNumber: number
  shopId: number
  status: number
  serviceCategoryId?: number
}

export interface PrepaidServiceResponse {
  prepaidServiceId: number
  prepaidServiceName: string
  price: number
  unitPrice: number
  quantity: number
  validity: number
  validityType: number
  serviceCategoryId: number
  relatedServiceId: number
  relatedServiceName: string
  salarySalesType: number
  salarySalesValue: string | null
  orderNo: number
  modificationDate: string
  registrationDate: string
  numberOfActiveChildItems: number
  status: number
  shopId: number
}

export interface PrepaidService {
  prepaidServiceId: number
  prepaidServiceName: string
  serviceCategoryId: number
  serviceCategoryName: string
  price: number
  chargeAmount: number
  validity: number
  validityType: number
  prepaidServiceType: number
  discountForClient: boolean
  discountForService: number
  discountForProduct: number
  salarySalesType: number
  salarySalesValue: number | null
  orderNo: number
  modificationDate: string
  registrationDate: string
  shared: boolean
  isHeadquarterGoods: boolean
  ownShopId: number
  numberOfActiveChildItems: number
  status: number
  shopId: number
}

export interface GetPrepaidServicesRequest {
  serviceCategoryId?: number
  pageSize?: number
  pageNumber?: number
  shopId?: number
  status?: number
}

// Service Read Service
export const servicesReadService = {
  /**
   * Get all services for a shop - calls /goods/Service
   */
  getServices: async (params?: GetServicesParams): Promise<ApiResponse<ListResponse<Service>>> =>
    await goodsReadService.post<ListResponse<Service>>('Service', params),

  /**
   * Get service by ID - calls /goods/Service/{id}
   */
  getServiceById: async (id: number): Promise<ApiResponse<Service>> => {
    return await goodsReadService.get<Service>(`Service/${id}`)
  },

  /**
   * Get active services for a shop - calls /goods/Service?shopId={shopId}&status=1
   */
  getActiveServices: async (shopId: number): Promise<ApiResponse<Service[]>> => {
    return await goodsReadService.get<Service[]>(`Service?shopId=${shopId}&status=1`)
  },

  /**
   * Search services by name - calls /goods/Service/search
   */
  searchServices: async (query: string, shopId?: number): Promise<ApiResponse<Service[]>> => {
    const params = new URLSearchParams()
    params.append('search', query)
    if (shopId) params.append('shopId', shopId.toString())

    return await goodsReadService.get<Service[]>(`Service/search?${params.toString()}`)
  },

  /**
   * Get prepaid services - calls /goods/PrepaidService
   */
  getPrepaidServices: async (
    data: GetPrepaidServiceRequest,
  ): Promise<ApiResponse<ListResponse<PrepaidServiceResponse>>> => {
    return await goodsReadService.post<ListResponse<PrepaidServiceResponse>>('PrepaidService', data)
  },

  /**
   * Get prepaid services by category - calls /goods/PrepaidService
   */
  getPrepaidServicesByCategory: async (
    params?: GetPrepaidServicesRequest,
  ): Promise<ApiResponse<ListResponse<PrepaidService>>> =>
    await goodsReadService.post<ListResponse<PrepaidService>>('PrepaidService', params),

  /**
   * Get service categories - calls /goods/ServiceCategory
   */
  getServiceCategory: async (params: ServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
    return await goodsReadService.post<ListResponse<ServiceCategoryItem[]>>('ServiceCategory', params)
  },
}
