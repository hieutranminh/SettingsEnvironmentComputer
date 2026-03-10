import { DATE_TYPE } from '@/constants'

type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

export interface BranchSalesFilter {
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
