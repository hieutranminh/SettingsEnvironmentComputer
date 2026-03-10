export interface Booking {
  id: string
  clientId: string
  staffId: string
  salonId: string
  serviceIds: string[]
  scheduledDate: string
  scheduledTime: string
  duration: number // in minutes
  status: BookingStatus
  totalPrice: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export interface CreateBookingRequest {
  clientId: string
  staffId: string
  salonId: string
  serviceIds: string[]
  scheduledDate: string
  scheduledTime: string
  duration: number
  notes?: string
}

export interface UpdateBookingRequest {
  staffId?: string
  serviceIds?: string[]
  scheduledDate?: string
  scheduledTime?: string
  duration?: number
  status?: BookingStatus
  notes?: string
}

export interface BookingListParams {
  page?: number
  limit?: number
  clientId?: string
  staffId?: string
  salonId?: string
  status?: BookingStatus
  startDate?: string
  endDate?: string
}

export interface AvailableSlot {
  date: string
  time: string
  available: boolean
  staffId?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  clientName: string
  staffName: string
  status: BookingStatus
  color?: string
}
