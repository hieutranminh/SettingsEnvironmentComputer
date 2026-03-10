export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password'
  },

  // Admin endpoints
  ADMINS: {
    BASE: '/admins',
    BY_ID: (id: string) => `/admins/${id}`,
    PROFILE: '/admins/profile',
    UPDATE_PROFILE: '/admins/profile'
  },

  // Goods endpoints
  GOODS: {
    BASE: '/goods',
    BY_ID: (id: string) => `/goods/${id}`,
    CATEGORIES: '/goods/categories',
    UPLOAD_IMAGE: '/goods/upload-image'
  },

  // Clients endpoints
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: string) => `/clients/${id}`,
    UPLOAD_IMAGE: '/clients/upload-image',
    STATISTICS: '/clients/statistics'
  },

  // Staff endpoints
  STAFFS: {
    BASE: '/staffs',
    BY_ID: (id: string) => `/staffs/${id}`,
    UPLOAD_IMAGE: '/staffs/upload-image',
    SCHEDULE: (id: string) => `/staffs/${id}/schedule`
  },

  // Boards endpoints
  BOARDS: {
    BASE: '/boards',
    BY_ID: (id: string) => `/boards/${id}`,
    UPLOAD_IMAGE: '/boards/upload-image'
  },

  // Bookings endpoints
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    CALENDAR: '/bookings/calendar',
    AVAILABLE_SLOTS: '/bookings/available-slots'
  },

  // Sales endpoints
  SALES: {
    BASE: '/sales',
    BY_ID: (id: string) => `/sales/${id}`,
    STATISTICS: '/sales/statistics',
    REPORTS: '/sales/reports'
  },

  // Admin Sales endpoints
  ADMIN_SALES: {
    BASE: '/admin-sales',
    BY_ID: (id: string) => `/admin-sales/${id}`,
    STATISTICS: '/admin-sales/statistics'
  },

  // Common endpoints
  COMMON: {
    UPLOAD: '/upload',
    HEALTH_CHECK: '/health'
  }
} as const

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const
