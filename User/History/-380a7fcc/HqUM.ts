import type { ApiResponse } from '../ApiResponse'

// Filter interface for ProductSalesByMonthReport
export interface IProductSalesByMonthFilterInterface {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  productId: number
  staffId: number
}

// Request payload interface for ProductSalesByMonthReport
export interface IProductSalesByMonthReportRequest {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  categoryId: number
  productId: number
  staffId: number
}

// Response item interface for ProductSalesByMonthReport
export interface IProductSalesByMonthReportItem {
  amount: number
  monthOfYear: string
  quantity: number
  ratio?: number
}

// Result interface for ProductSalesByMonthReport
export interface IProductSalesByMonthReportResult {
  productSalesByMonths: IProductSalesByMonthReportItem[]
  shopId: number
}

export type IProductSalesByMonthReportResponse = ApiResponse<IProductSalesByMonthReportResult>
