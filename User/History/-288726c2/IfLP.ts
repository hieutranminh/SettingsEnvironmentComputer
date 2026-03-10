import { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

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
  amount: number
  monthOfYear: string
  quantity: number
  ratio?: number
}

export type SalesByDiscountCategoryReportResponse = ApiResponse<SalesByDiscountCategoryReportItem[]>
