import { PREPAID_SALES_COUNTING_TYPE } from '@/constants'

type PrepaidSalesCountingType = (typeof PREPAID_SALES_COUNTING_TYPE)[keyof typeof PREPAID_SALES_COUNTING_TYPE]

export interface SalesByMonthFilterInterface {
  shopId: number
  headquarterShopId: number
  prepaidSalesCountingType: PrepaidSalesCountingType
  toDateTs: number
  fromDateTs: number
  isHeadquarterView: boolean
}
