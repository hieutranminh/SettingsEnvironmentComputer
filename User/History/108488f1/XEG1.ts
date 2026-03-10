import type { ApiResponse, PaginatedResponse } from '@/types/ApiResponse'
import type { Booking, CreateBookingRequest, UpdateBookingRequest, BookingListParams, AvailableSlot, CalendarEvent } from '@/types/Booking'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'

export const bookingService = {
  // Get all bookings with pagination and filters
  getBookings: async (params?: BookingListParams): Promise<PaginatedResponse<Booking>> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.clientId) queryParams.append('clientId', params.clientId)
    if (params?.staffId) queryParams.append('staffId', params.staffId)
    if (params?.salonId) queryParams.append('salonId', params.salonId)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.BOOKINGS.BASE}?${queryParams.toString()}`
    const response = await apiGet<PaginatedResponse<Booking>>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch bookings')
    }

    return response.data
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiGet<Booking>(API_ENDPOINTS.BOOKINGS.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to fetch booking with ID: ${id}`)
    }

    return response.data
  },

  // Create new booking
  createBooking: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    const response = await apiPost<Booking>(API_ENDPOINTS.BOOKINGS.BASE, bookingData)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create booking')
    }

    return response.data
  },

  // Update booking
  updateBooking: async (id: string, bookingData: UpdateBookingRequest): Promise<Booking> => {
    const response = await apiPut<Booking>(API_ENDPOINTS.BOOKINGS.BY_ID(id), bookingData)

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to update booking with ID: ${id}`)
    }

    return response.data
  },

  // Delete booking
  deleteBooking: async (id: string): Promise<void> => {
    const response = await apiDelete<void>(API_ENDPOINTS.BOOKINGS.BY_ID(id))

    if (!response.success) {
      throw new Error(response.message || `Failed to delete booking with ID: ${id}`)
    }
  },

  // Get calendar events
  getCalendarEvents: async (startDate: string, endDate: string, salonId?: string): Promise<CalendarEvent[]> => {
    const queryParams = new URLSearchParams()
    queryParams.append('startDate', startDate)
    queryParams.append('endDate', endDate)
    if (salonId) queryParams.append('salonId', salonId)

    const endpoint = `${API_ENDPOINTS.BOOKINGS.CALENDAR}?${queryParams.toString()}`
    const response = await apiGet<CalendarEvent[]>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch calendar events')
    }

    return response.data
  },

  // Get available time slots
  getAvailableSlots: async (date: string, staffId?: string, salonId?: string): Promise<AvailableSlot[]> => {
    const queryParams = new URLSearchParams()
    queryParams.append('date', date)
    if (staffId) queryParams.append('staffId', staffId)
    if (salonId) queryParams.append('salonId', salonId)

    const endpoint = `${API_ENDPOINTS.BOOKINGS.AVAILABLE_SLOTS}?${queryParams.toString()}`
    const response = await apiGet<AvailableSlot[]>(endpoint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch available slots')
    }

    return response.data
  }
}
