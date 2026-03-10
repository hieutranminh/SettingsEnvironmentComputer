import type { ReportByTypeInClientsByType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for ClientsByTypeReport
export interface ClientsByTypeFilterInterface {
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: ReportByTypeInClientsByType
}

// Request payload interface for ClientsByTypeReport
export interface ClientsByTypeReportRequest {
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: ReportByTypeInClientsByType
}

// Response item interface for ClientsByTypeReport
export interface ClientsByTypeReportItem {
  id: number
  name: string
  totalClient: number
}

// Result interface for ClientsByTypeReport
export interface ClientsByTypeReportResult {
  reportItems: ClientsByTypeReportItem[]
  shopId: number
}

export type ClientsByTypeReportResponse = ApiResponse<ClientsByTypeReportResult>
