import { type DateType } from '@/constants'
import type { ApiResponse, ListResponse } from '@/types/ApiResponse'

export interface IBranchSalesFilter {
  pageSize: number
  isHeadquarterView: boolean
  dateType: DateType
  toDateTs: number
  pageNumber: number
  headquarterShopId: number
  fromDateTs: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

export interface IBranchSalesTotalReportRequest {
  pageSize: number
  isHeadquarterView: boolean
  dateType: DateType
  toDateTs: number
  pageNumber: number
  headquarterShopId: number
  fromDateTs: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

export interface IBranchSalesTotalReportItem {
  shopName: string
  productSalesAmount: number
  productBalanceDeductionAmount: number
  serviceSalesAmount: number
  serviceBalanceDeductionAmount: number
  serviceDeductionAmount: number
  prepaidCardSalesAmount: number
  prepaidServicesSalesAmount: number
  pointDeduction: number
  prepaidGoodsDeductionAmount: number
  shopId: number
}

export interface IBranchSalesReportData {
  shopId: number
  branch: string
  serviceSales: number
  servicePrepaidCardDeduction: number
  servicePrepaidServiceDeduction: number
  serviceTotal: number
  productSales: number
  productPrepaidCardDeduction: number
  productTotal: number
  revenueTotal: number
  prepaidCard: number
  prepaidService: number
  prepaidTotal: number
  salesTotal: number
  prepaidGoodsDeductionTotal: number
  pointsDeduction: number
}

export type IBranchSalesTotalReportResult = ListResponse<IBranchSalesTotalReportItem>

export type IBranchSalesTotalReportResponse = ApiResponse<IBranchSalesTotalReportResult>
