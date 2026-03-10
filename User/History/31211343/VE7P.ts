import { type DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for SalesByDiscountCategoryReport
export interface SalesByRepeatClientsFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
  reportByType: number
}

// Request payload interface for SalesByDiscountCategoryReport
export interface SalesByRepeatClientsReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
  reportByType: number
}

// Response item interface for SalesByDiscountCategoryReport
export interface SalesByRepeatClientsReportItem {
  discountAmount: number
  discountCategory: string
  discountCategoryId: number
  qty: number
  ratio: number
}

export type SalesByRepeatClientsReportResponse = ApiResponse<SalesByRepeatClientsReportItem[]>
