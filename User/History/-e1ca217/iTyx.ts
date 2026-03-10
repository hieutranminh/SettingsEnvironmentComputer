import type { RouteRecordRaw } from 'vue-router'

export interface AppRouteMeta {
  requiresAuth?: boolean
  roles?: string[]
  title?: string
  icon?: string
  hidden?: boolean
  breadcrumb?: boolean
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: AppRouteMeta
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
