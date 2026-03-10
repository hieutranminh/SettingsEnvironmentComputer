export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  position: StaffPosition
  isActive: boolean
  salonId: string
  profileImageUrl?: string
  hireDate: string
  salary?: number
  specializations?: string[]
  workingHours?: WorkingHours
  createdAt: string
  updatedAt: string
}

export enum StaffPosition {
  MANAGER = 'manager',
  STYLIST = 'stylist',
  ASSISTANT = 'assistant',
  RECEPTIONIST = 'receptionist',
  CLEANER = 'cleaner'
}

export interface WorkingHours {
  monday?: DaySchedule
  tuesday?: DaySchedule
  wednesday?: DaySchedule
  thursday?: DaySchedule
  friday?: DaySchedule
  saturday?: DaySchedule
  sunday?: DaySchedule
}

export interface DaySchedule {
  startTime: string
  endTime: string
  isWorking: boolean
}

export interface CreateStaffRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  position: StaffPosition
  salonId: string
  profileImageUrl?: string
  hireDate: string
  salary?: number
  specializations?: string[]
  workingHours?: WorkingHours
}

export interface UpdateStaffRequest {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  position?: StaffPosition
  isActive?: boolean
  profileImageUrl?: string
  salary?: number
  specializations?: string[]
  workingHours?: WorkingHours
}

export interface StaffListParams {
  page?: number
  limit?: number
  search?: string
  position?: StaffPosition
  isActive?: boolean
  salonId?: string
}
