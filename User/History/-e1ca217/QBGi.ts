import type { RouteRecordRaw } from 'vue-router'

export interface AppRouteRecordRaw extends RouteRecordRaw {
  meta?: {
    requiresAuth?: boolean
    requiresGuest?: boolean
    roles?: string[]
    title?: string
    icon?: string
    hidden?: boolean
    breadcrumb?: string
  }
}

export interface BreadcrumbItem {
  name: string
  path?: string
  icon?: string
}

export interface NavigationItem {
  name: string
  path: string
  icon?: string
  children?: NavigationItem[]
  meta?: {
    roles?: string[]
    hidden?: boolean
  }
}
