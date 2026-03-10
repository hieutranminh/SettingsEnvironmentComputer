export interface Client {
  id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
  dateOfBirth?: string
  gender?: Gender
  address?: string
  isActive: boolean
  salonId: string
  profileImageUrl?: string
  notes?: string
  totalVisits: number
  lastVisitDate?: string
  createdAt: string
  updatedAt: string
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface CreateClientRequest {
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
  dateOfBirth?: string
  gender?: Gender
  address?: string
  salonId: string
  profileImageUrl?: string
  notes?: string
}

export interface UpdateClientRequest {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: Gender
  address?: string
  isActive?: boolean
  profileImageUrl?: string
  notes?: string
}

export interface ClientListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  salonId?: string
  gender?: Gender
}
