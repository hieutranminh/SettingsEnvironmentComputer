import { DATE_TYPE } from '@/constants'

import type { ApiResponse } from '../ApiResponse'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

// Filter interface for ServiceSalesReport
export interface ClientsByPeriodFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  chainId: number
}

// Request payload interface for ServiceSalesReport
export interface ClientsByPeriodReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  chainId: number
}

// Response item interface for ServiceSalesReport
export interface ClientsByPeriodReportItem {
  amount: number
  key: string
  quantity: number
  ratio?: number
}

// Result interface for ServiceSalesReport
export interface ClientsByPeriodReportResult {
  reportByType: number
  serviceSalesItems: ClientsByPeriodReportItem[]
  shopId: number
}

export type ClientsByPeriodReportResponse = ApiResponse<ClientsByPeriodReportResult>
