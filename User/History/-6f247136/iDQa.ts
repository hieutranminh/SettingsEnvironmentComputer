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
  ratio?: number
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

export interface FooterTotals {
  totalNewClients: number
  totalRepeatClients: number
  totalRepeatPercentage: string
  monthlyTotals: MonthlyTotal[]
}

export interface RepeatColumn {
  month: number
  clients: number
  percentage: string
}

export interface Summary {
  totalClients: number
  percentage: number
}

export interface MonthlyTotal {
  month: number
  clients: number
  percentage: number
}

export interface TableRow {
  repeatColumns: RepeatColumn[]
  rowIndex: number
  summary: Summary
  totalNewClients: number
}
