import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for ServiceSalesByItemReport
export interface ServiceSalesByItemFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  categoryId: number
  serviceId: number
}

// Request payload interface for ServiceSalesByItemReport
export interface ServiceSalesByItemReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  categoryId: number
  serviceId: number
}

// Response item interface for ServiceSalesByItemReport
export interface ServiceSalesByItemReportItem {
  amount: number
  itemName: string
  quantity: number
  ratio?: number
}

export type ServiceSalesByItemReportResponse = ApiResponse<ServiceSalesByItemReportItem[]>
