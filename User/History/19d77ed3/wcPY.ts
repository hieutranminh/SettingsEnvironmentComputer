import { type DateType, type ReportByTypeProduct } from '@/constants'

import type { IApiResponse } from '../ApiResponse'

// Filter interface for ProductSalesByItemReport
export interface IProductSalesByItemFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: ReportByTypeProduct
  staffId: number
}

// Request payload interface for ProductSalesByItemReport
export interface IProductSalesByItemReportRequest {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: ReportByTypeProduct
  staffId: number
}

// Response item interface for ProductSalesByItemReport
export interface IProductSalesByItemReportItem {
  amount: number
  key: string
  quantity: number
  ratio?: number
}

// Result interface for ProductSalesByItemReport
export interface IProductSalesByItemReportResult {
  productSalesByItems: IProductSalesByItemReportItem[]
  shopId: number
}

export type IProductSalesByItemReportResponse = IApiResponse<IProductSalesByItemReportResult>
