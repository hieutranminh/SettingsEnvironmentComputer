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
