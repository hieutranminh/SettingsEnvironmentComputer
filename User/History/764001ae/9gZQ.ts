import type { ApiResponse } from '../ApiResponse'

// Filter interface for ServiceSalesByMonthReport
export interface IServiceSalesByMonthFilterInterface {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  serviceId: number
  staffId: number
}

// Request payload interface for ServiceSalesByMonthReport
export interface IServiceSalesByMonthReportRequest {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  serviceId: number
  staffId: number
}

// Response item interface for ServiceSalesByMonthReport
export interface IServiceSalesByMonthReportItem {
  amount: number
  monthOfYear: string
  quantity: number
  ratio?: number
}

// Result interface for ServiceSalesByMonthReport
export interface IServiceSalesByMonthReportResult {
  serviceSalesByMonths: IServiceSalesByMonthReportItem[]
  shopId: number
}

export type IServiceSalesByMonthReportResponse = ApiResponse<IServiceSalesByMonthReportResult>
