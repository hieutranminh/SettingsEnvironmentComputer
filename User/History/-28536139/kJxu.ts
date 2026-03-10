import type { AppRouteRecordRaw } from '@/router/types'
import { ROUTE_NAMES } from '@/constants/APP_CONSTANTS'
import { requireAdmin } from '@/router/guards'

export const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: '/admin',
    name: ROUTE_NAMES.ADMIN,
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Admin',
      icon: 'admin_panel_settings',
      hidden: true
    },
    beforeEnter: requireAdmin,
    children: [
      {
        path: '',
        name: ROUTE_NAMES.ADMIN_DASHBOARD,
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin'],
          title: 'Admin Dashboard',
          icon: 'dashboard'
        }
      },
      {
        path: 'users',
        name: ROUTE_NAMES.ADMIN_USERS,
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin'],
          title: 'User Management',
          icon: 'people'
        }
      }
    ]
  }
]
