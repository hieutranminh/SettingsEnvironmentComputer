export interface CustomBranchType {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomBranchTypeResponse {
  data: CustomBranchType[]
  success: boolean
  message?: string
}
