import type { DateType, ReportByType } from '@/constants'
import type { IApiResponse } from '../ApiResponse'

// Filter interface for ServiceSalesReport
export interface IServiceSalesFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: ReportByType
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
  reportByType: ReportByType
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
  reportByType: ReportByType
  serviceSalesItems: IServiceSalesReportItem[]
  shopId: number
}

export type IServiceSalesReportResponse = IApiResponse<IServiceSalesReportResult>
