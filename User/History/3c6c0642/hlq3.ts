// Common API Response Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  status: number
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  validation?: ValidationRule[]
  options?: SelectOption[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern'
  value?: any
  message: string
}

export interface SelectOption {
  value: string | number
  label: string
}

// Navigation Types
export interface NavigationItem {
  name: string
  path: string
  icon?: string
  children?: NavigationItem[]
  requiresAuth?: boolean
  roles?: UserRole[]
}

// Modal Types
export interface ModalConfig {
  id: string
  title: string
  component: string
  props?: Record<string, any>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

// Pagination Types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
