import { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

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
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  serviceId: number
  staffId: number
}

// Response item interface for ServiceSalesBySalesTypeReport
export interface ServiceSalesBySalesTypeReportItem {
  amount: number
  monthOfYear: string
  quantity: number
  ratio?: number
}

// Result interface for ServiceSalesBySalesTypeReport
export interface ServiceSalesBySalesTypeReportResult {
  serviceSalesByMonths: ServiceSalesBySalesTypeReportItem[]
  shopId: number
}

export type ServiceSalesBySalesTypeReportResponse = ApiResponse<ServiceSalesBySalesTypeReportResult>
