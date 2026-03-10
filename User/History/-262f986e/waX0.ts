import type { DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for PrepaidGoodsRepurchaseReport
export interface PrepaidGoodsRepurchaseFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
  reportByType: number
}

// Request payload interface for PrepaidGoodsRepurchaseReport
export interface PrepaidGoodsRepurchaseReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  staffId: number
  reportByType: number
}

// Response item interface for PrepaidGoodsRepurchaseReport
export interface PrepaidGoodsRepurchaseReportItem {
  amount: number
  key: string
  itemType: number
  quantity: number
}

// Response result interface for PrepaidGoodsRepurchaseReport
export interface PrepaidGoodsRepurchaseReportResult {
  reportItems: PrepaidGoodsRepurchaseReportItem[]
  shopId: number
}

export type PrepaidGoodsRepurchaseReportResponse = ApiResponse<PrepaidGoodsRepurchaseReportResult>
