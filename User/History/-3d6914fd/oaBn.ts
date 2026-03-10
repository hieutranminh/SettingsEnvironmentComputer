import type { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

// Filter interface for ServiceSalesReport
export interface IServiceSalesFilterInterface {
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
export interface IServiceSalesReportRequest {
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
export interface IServiceSalesReportItem {
  amount: number
  key: string
  quantity: number
  ratio?: number
}

// Result interface for ServiceSalesReport
export interface IServiceSalesReportResult {
  reportByType: number
  serviceSalesItems: IServiceSalesReportItem[]
  shopId: number
}

export type IServiceSalesReportResponse = ApiResponse<IServiceSalesReportResult>
