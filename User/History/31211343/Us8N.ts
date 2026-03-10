import type { DateType } from '@/constants'

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
  amount: number
  key: string
  itemType: number
  quantity: number
}

export interface SalesByRepeatClientsReportResult {
  reportItems: SalesByRepeatClientsReportItem[]
  shopId: number
}

export type SalesByRepeatClientsReportResponse = ApiResponse<SalesByRepeatClientsReportResult>
