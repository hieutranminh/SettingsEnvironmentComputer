import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routeNames'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/id-management',
    name: ROUTE_NAMES.ID_MANAGEMENT,
    component: () => import('@/views/account/IdManagementView.vue'),
    meta: {
      title: 'ID Management',
      requiresAuth: true,
    },
  },
  {
    path: '/login-histories',
    name: ROUTE_NAMES.LOGIN_HISTORIES,
    component: () => import('@/views/account/LoginHistoriesView.vue'),
    meta: {
      title: 'Login Histories',
      requiresAuth: true,
    },
  },
  {
    path: '/subscriber-information',
    name: ROUTE_NAMES.SUBSCRIBER_INFORMATION,
    component: () => import('@/views/account/SubscriberInformationView.vue'),
    meta: {
      title: 'Subscriber Information',
      requiresAuth: true,
    },
  },
]
