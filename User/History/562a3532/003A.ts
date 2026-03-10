export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',

  // Auth routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // User management routes
  USERS: '/users',
  USER_CREATE: '/users/create',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_EDIT: (id: string) => `/users/${id}/edit`
} as const

export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  UNAUTHORIZED: 'unauthorized',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  USERS: 'users',
  USER_CREATE: 'user-create',
  USER_DETAIL: 'user-detail',
  USER_EDIT: 'user-edit'
} as const
