import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for ServiceSalesBySalesTypeReport
export interface ServiceSalesBySalesTypeFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  serviceId: number
  staffId: number
  isPointDeductionIncluded: boolean
  prepaidSalesCountingType: number
  salesTypeIds: number[]
}

// Request payload interface for ServiceSalesBySalesTypeReport
export interface ServiceSalesBySalesTypeReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  serviceId: number
  staffId: number
  isPointDeductionIncluded: boolean
  prepaidSalesCountingType: number
  salesTypeIds: number[]
}

export interface ReportByTypesItem {
  amount: number
  quantity: number
  staffNumber: number
  typeId: number
}

// Response item interface for ServiceSalesBySalesTypeReport
export interface ServiceSalesBySalesTypeReportItem {
  reportByTypes: ReportByTypesItem[]
  staff: string
  staffId: number
}

export type ServiceSalesBySalesTypeReportResponse = ApiResponse<ServiceSalesBySalesTypeReportItem[]>
