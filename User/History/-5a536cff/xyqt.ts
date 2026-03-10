import type { ApiResponse, ListResponse } from '../ApiResponse'

// Filter interface for SalesTypeReport
export interface SalesTypeFilterInterface {
  shopId: number
  headquarterShopId: number
  pageNumber: number
  pageSize: number
  status: number
}

// Request payload interface for SalesTypeReport
export interface SalesTypeReportRequest {
  shopId: number
  headquarterShopId: number
  pageNumber: number
  pageSize: number
  status: number
}

// Response item interface for SalesTypeReport
export interface SalesTypeReportItem {
  id: number
  modificationDate: string
  modificationDateTS: number
  name: string
  orderNo: number
  registrationDate: string
  registrationDateTS: number
  salesMiscCodeSourceType: number
  shopId: number
  status: number
}

export type SalesTypeReportResponse = ListResponse<SalesTypeReportItem>
