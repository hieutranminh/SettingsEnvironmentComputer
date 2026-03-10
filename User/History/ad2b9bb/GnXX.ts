// Export all services
export { adminService } from './adminService'
export { goodService } from './goodService'
export { clientService } from './clientService'
export { staffService } from './staffService'
export { bookingService } from './bookingService'
export { saleService } from './saleService'

// Export API utilities
export { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiClient } from './api'

// Export types for convenience
export type { Admin, CreateAdminRequest, UpdateAdminRequest, AdminListParams } from '@/types/Admin'
export type { Good, CreateGoodRequest, UpdateGoodRequest, GoodListParams } from '@/types/Good'
export type { Client, CreateClientRequest, UpdateClientRequest, ClientListParams } from '@/types/Client'
export type { Staff, CreateStaffRequest, UpdateStaffRequest, StaffListParams, WorkingHours } from '@/types/Staff'
export type { Booking, CreateBookingRequest, UpdateBookingRequest, BookingListParams, AvailableSlot, CalendarEvent } from '@/types/Booking'
export type { Sale, CreateSaleRequest, UpdateSaleRequest, SaleListParams, SaleStatistics } from '@/types/Sale'
export type { ApiResponse, PaginatedResponse, ApiError } from '@/types/ApiResponse'
