import { DATE_TYPE } from '@/constants'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

export interface ServiceSalesFilterInterface {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  shopId: number
  headquarterShopId: number
  isHeadquarterView: boolean
  reportByType: number
  staffId: number
  chartType?: number
}
