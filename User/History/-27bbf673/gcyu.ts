import type { DateType } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

// Filter interface for ClientsByPeriodReport
export interface ClientsByPeriodFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  chainId: number
}

// Request payload interface for ClientsByPeriodReport
export interface ClientsByPeriodReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  chainId: number
}

// Summary interface for ClientsByPeriodReport
export interface ClientSummary {
  newClient: number
  newSale: number
  revisitClient: number
  revisitSale: number
  unregisteredClient: number
  unregisteredSale: number
}

// Summary interface for ClientsByPeriodReport
export interface MemberSummary {
  deductionClient: number
  deductionSale: number
  firstPurchaseClient: number
  firstPurchaseSale: number
  repurchaseClient: number
  repurchaseSale: number
}

// Result interface for ClientsByPeriodReport
export interface ClientsByPeriodReportResult {
  clientSummary: ClientSummary
  memberSummary: MemberSummary
  shopId: number
}

export type ClientsByPeriodReportResponse = ApiResponse<ClientsByPeriodReportResult>
