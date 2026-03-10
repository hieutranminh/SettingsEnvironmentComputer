import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for ServiceSalesBySalesTypeReport
export interface IServiceSalesBySalesTypeFilterInterface {
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
export interface IServiceSalesBySalesTypeReportRequest {
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

export interface IReportByTypesItem {
  amount: number
  quantity: number
  staffNumber: number
  typeId: number
}

// Response item interface for ServiceSalesBySalesTypeReport
export interface IServiceSalesBySalesTypeReportItem {
  reportByTypes: IReportByTypesItem[]
  staff: string
  staffId: number
}

export type ServiceSalesBySalesTypeReportResponse = ApiResponse<
  IServiceSalesBySalesTypeReportItem[]
>
