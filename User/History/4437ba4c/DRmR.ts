import type { AppRouteRecordRaw } from '@/router/types'
import { ROUTE_NAMES } from '@/constants/APP_CONSTANTS'
import { requireAuth } from '@/router/guards'

export const dashboardRoutes: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: ROUTE_NAMES.DASHBOARD,
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      icon: 'dashboard'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/profile',
    name: ROUTE_NAMES.PROFILE,
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profile',
      icon: 'person'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/settings',
    name: ROUTE_NAMES.SETTINGS,
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Settings',
      icon: 'settings'
    },
    beforeEnter: requireAuth
  }
]
