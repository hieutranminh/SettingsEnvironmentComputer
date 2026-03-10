export interface ApiResponse<T = any> {
  isOK: boolean
  result?: T
  errorMessages?: string[]
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
export interface ApiError {
  isApiError?: () => boolean
  message?: string | string[]
  codes?: string
  values?: string[][]
}
