import { type DateType } from '@/constants'
import type { ApiResponse, ListResponse } from '@/types/ApiResponse'

export interface BranchSalesFilterInterface {
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

export interface BranchSalesTotalReportRequest {
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

export interface BranchSalesTotalReportItem {
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

export interface BranchSalesReportData {
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

export type BranchSalesTotalReportResult = ListResponse<BranchSalesTotalReportItem>

export type BranchSalesTotalReportResponse = ApiResponse<BranchSalesTotalReportResult>
