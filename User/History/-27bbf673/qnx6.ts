import { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

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
export interface clientSummary {
  newClient: number
  newSale: number
  revisitClient: number
  revisitSale: number
  unregisteredClient: number
  unregisteredSale: number
}

// Summary interface for ClientsByPeriodReport
export interface memberSummary {
  deductionClient: number
  deductionSale: number
  firstPurchaseClient: number
  firstPurchaseSale: number
  repurchaseClient: number
  repurchaseSale: number
}

// Result interface for ClientsByPeriodReport
export interface ClientsByPeriodReportResult {
  clientSummary: clientSummary
  memberSummary: memberSummary
  shopId: number
}

export type ClientsByPeriodReportResponse = ApiResponse<ClientsByPeriodReportResult>
