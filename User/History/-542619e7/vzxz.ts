import { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

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
