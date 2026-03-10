import type { RouteRecordRaw } from 'vue-router'
import { ACCOUNT_ROUTES } from '@/constants/routeNames'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/id-management',
    name: ACCOUNT_ROUTES.ID_MANAGEMENT,
    component: () => import('@/views/account/IdManagementView.vue'),
    meta: {
      title: 'ID Management',
      requiresAuth: true,
    },
  },
  {
    path: '/login-histories',
    name: ACCOUNT_ROUTES.LOGIN_HISTORIES,
    component: () => import('@/views/account/LoginHistoriesView.vue'),
    meta: {
      title: 'Login Histories',
      requiresAuth: true,
    },
  },
  {
    path: '/subscriber-information',
    name: ACCOUNT_ROUTES.SUBSCRIBER_INFORMATION,
    component: () => import('@/views/account/SubscriberInformationView.vue'),
    meta: {
      title: 'Subscriber Information',
      requiresAuth: true,
    },
  },
]
