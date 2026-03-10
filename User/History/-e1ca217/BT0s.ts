import type { RouteRecordRaw } from 'vue-router'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  meta?: {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
    icon?: string
    hidden?: boolean
    breadcrumb?: boolean
  }
  children?: AppRouteRecordRaw[]
}

export interface User {
  id: string
  email: string
  name: string
  roles: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}
