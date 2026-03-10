import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for SalesByDiscountCategoryReport
export interface ISalesByDiscountCategoryFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
}

// Request payload interface for SalesByDiscountCategoryReport
export interface ISalesByDiscountCategoryReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
}

// Response item interface for SalesByDiscountCategoryReport
export interface ISalesByDiscountCategoryReportItem {
  discountAmount: number
  discountCategory: string
  discountCategoryId: number
  qty: number
  ratio: number
}

export type ISalesByDiscountCategoryReportResponse = ApiResponse<
  ISalesByDiscountCategoryReportItem[]
>
