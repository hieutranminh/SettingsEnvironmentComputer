export interface CustomBranchType {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomBranchTypeListResponse {
  customBranchTypes: CustomBranchType[]
  totalCount: number
}

export interface CustomBranchTypeFilter {
  isActive?: boolean
  search?: string
}