import type { ApiResponse } from '../ApiResponse'

// Filter interface for ClientsByPeriodReport
export interface NewClientRepeatFilterInterface {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
}

// Request payload interface for ClientsByPeriodReport
export interface NewClientRepeatReportRequest {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
}

export interface RepeatInfo {
  repeatOfYearMonth: number
  totalRepeatClients: number
}

// Response item interface for NewClientRepeatReport
export interface NewClientRepeatReportItem {
  repeatInfos: RepeatInfo[]
  staffName: string
  totalNewClients: number
}

// Result interface for ClientsByPeriodReport
export interface NewClientRepeatReportResult {
  reportItems: NewClientRepeatReportItem[]
  shopId: number
}

export type NewClientRepeatReportResponse = ApiResponse<NewClientRepeatReportResult>
