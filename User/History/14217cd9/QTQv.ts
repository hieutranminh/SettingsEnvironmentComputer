export interface ApiResponse<T> {
  isOK: boolean
  result?: T
  message?: string
  errors?: string[]
  errorMessages: ApiError[]
}
export interface ApiError {
  errorCode: string
  errorMessage: string
  errorValues: string[]
}

export interface ListResponse<T> {
  items: T[]
  pagingInfo?: {
    pageNumber: number
    pageSize: number
    totalItems: number
  }
}

// Interface for API error objects
export interface ErrorMessages {
  errorMessage: string
  errorValues: string[]
  errorCode: string
}

export interface AppError {
  errorMessages: string[]
}

// Branch Prepaid Goods Report Types
export interface PrepaidCardInfo {
  records: number | null
  balance: number | null
}

export interface DiscountCardInfo {
  records: number | null
  balance: number | null
}

export interface PrepaidServiceInfo {
  remainingQty: number | null
  records: number
  balance: number | null
}

export interface UnlimitedPrepaidServiceInfo {
  remainingQty: number
  records: number
  balance: number | null
}

export interface ShopPrepaidGoodsData {
  shopName: string
  prepaidCards: PrepaidCardInfo
  discountCards: DiscountCardInfo
  prepaidServices: PrepaidServiceInfo
  unlimitedPrepaidServices: UnlimitedPrepaidServiceInfo
  totalBalance: number
  shopId: number
}

export interface BranchPrepaidGoodsReportResponse {
  result: ShopPrepaidGoodsData[]
  errorMessages: ApiError[]
  isOK: boolean
}
