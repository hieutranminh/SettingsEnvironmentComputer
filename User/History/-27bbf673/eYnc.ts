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

export interface clientSummary {
  newClient: 6
  newSale: 10
  revisitClient: 1
  revisitSale: 34
  unregisteredClient: 0
  unregisteredSale: 0
}

export interface memberSummary {
  memberCount: number
  memberAmount: number
}

// Result interface for ClientsByPeriodReport
export interface ClientsByPeriodReportResult {
  clientSummary: clientSummary
  memberSummary: memberSummary
  shopId: number
}

export type ClientsByPeriodReportResponse = ApiResponse<ClientsByPeriodReportResult>
