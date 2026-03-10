import type { IListResponse } from '../ApiResponse'

// Filter interface for SalesTypeReport
export interface ISalesTypeFilterInterface {
  shopId: number
  headquarterShopId: number
  pageNumber: number
  pageSize: number
  status: number
}

// Request payload interface for SalesTypeReport
export interface ISalesTypeReportRequest {
  shopId: number
  headquarterShopId: number
  pageNumber: number
  pageSize: number
  status: number
}

// Response item interface for SalesTypeReport
export interface ISalesTypeReportItem {
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

export type ISalesTypeReportResponse = IListResponse<ISalesTypeReportItem>
