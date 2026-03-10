import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for SalesByDiscountCategoryReport
export interface SalesByDiscountCategoryFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
}

// Request payload interface for SalesByDiscountCategoryReport
export interface SalesByDiscountCategoryReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
}

// Response item interface for SalesByDiscountCategoryReport
export interface SalesByDiscountCategoryReportItem {
  discountAmount: number
  discountCategory: string
  discountCategoryId: number
  qty: number
  ratio: number
}

export type SalesByDiscountCategoryReportResponse = ApiResponse<SalesByDiscountCategoryReportItem[]>
