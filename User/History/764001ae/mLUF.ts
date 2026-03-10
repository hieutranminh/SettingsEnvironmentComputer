import type { ApiResponse } from '../ApiResponse'

// Filter interface for ServiceSalesByMonthReport
export interface ServiceSalesByMonthFilterInterface {
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
export interface ServiceSalesByMonthReportRequest {
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
export interface ServiceSalesByMonthReportItem {
  amount: number
  monthOfYear: string
  quantity: number
  ratio?: number
}

// Result interface for ServiceSalesByMonthReport
export interface ServiceSalesByMonthReportResult {
  serviceSalesByMonths: ServiceSalesByMonthReportItem[]
  shopId: number
}

export type ServiceSalesByMonthReportResponse = ApiResponse<ServiceSalesByMonthReportResult>
