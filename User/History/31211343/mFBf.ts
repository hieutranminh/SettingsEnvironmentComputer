import type { DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for SalesByRepeatClientsReport
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

// Request payload interface for SalesByRepeatClientsReport
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

// Response item interface for SalesByRepeatClientsReport
export interface SalesByRepeatClientsReportItem {
  amount: number
  key: string
  itemType: number
  quantity: number
}

// Response result interface for SalesByRepeatClientsReport
export interface SalesByRepeatClientsReportResult {
  reportItems: SalesByRepeatClientsReportItem[]
  shopId: number
}

export type SalesByRepeatClientsReportResponse = ApiResponse<SalesByRepeatClientsReportResult>
