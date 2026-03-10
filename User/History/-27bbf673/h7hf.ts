import { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

// Filter interface for ServiceSalesReport
export interface ServiceSalesFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  staffId: number
}

// Request payload interface for ServiceSalesReport
export interface ServiceSalesReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  staffId: number
}

// Response item interface for ServiceSalesReport
export interface ServiceSalesReportItem {
  amount: number
  key: string
  quantity: number
  ratio?: number
}

// Result interface for ServiceSalesReport
export interface ServiceSalesReportResult {
  reportByType: number
  serviceSalesItems: ServiceSalesReportItem[]
  shopId: number
}

export type ServiceSalesReportResponse = ApiResponse<ServiceSalesReportResult>
