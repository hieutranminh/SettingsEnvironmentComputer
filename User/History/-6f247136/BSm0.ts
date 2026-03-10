import type { ApiResponse } from '../ApiResponse'

// Filter interface for ClientsByPeriodReport
export interface NewClientsRepeatFilterInterface {
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
}

// Request payload interface for ClientsByPeriodReport
export interface NewClientsRepeatReportRequest {
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
export interface NewClientsRepeatReportItem {
  repeatInfos: RepeatInfo[]
  staffName: string
  totalNewClients: number
}

// Result interface for ClientsByPeriodReport
export interface NewClientsRepeatReportResult {
  reportItems: NewClientsRepeatReportItem[]
  shopId: number
}

export type NewClientsRepeatReportResponse = ApiResponse<NewClientsRepeatReportResult>
