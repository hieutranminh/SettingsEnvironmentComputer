import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for ProductSalesByItemReport
export interface ProductSalesByItemFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  staffId: number
}

// Request payload interface for ProductSalesByItemReport
export interface ProductSalesByItemReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  staffId: number
}

// Response item interface for ProductSalesByItemReport
export interface ProductSalesByItemReportItem {
  amount: number
  key: string
  quantity: number
  ratio?: number
}

// Result interface for ProductSalesByItemReport
export interface ProductSalesByItemReportResult {
  productSalesByItems: ProductSalesByItemReportItem[]
  shopId: number
}

export type ProductSalesByItemReportResponse = ApiResponse<ProductSalesByItemReportResult>
