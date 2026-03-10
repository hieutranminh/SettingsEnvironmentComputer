export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: AdminRole
  isActive: boolean
  salonId?: string
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  HEADQUARTER_ADMIN = 'headquarter_admin',
  SALON_ADMIN = 'salon_admin'
}

export interface CreateAdminRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  phoneNumber?: string
  role: AdminRole
  salonId?: string
}

export interface UpdateAdminRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  role?: AdminRole
  isActive?: boolean
  salonId?: string
}

export interface AdminListParams {
  page?: number
  limit?: number
  search?: string
  role?: AdminRole
  isActive?: boolean
  salonId?: string
}
