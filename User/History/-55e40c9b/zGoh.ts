import type { RouteRecordRaw } from 'vue-router'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/id-management',
    name: 'id-management',
    component: () => import('@/views/account/IdManagementView.vue'),
    meta: {
      title: 'ID Management',
      requiresAuth: true,
    },
  },
  {
    path: '/login-histories',
    name: 'login-histories',
    component: () => import('@/views/account/LoginHistoriesView.vue'),
    meta: {
      title: 'Login Histories',
      requiresAuth: true,
    },
  },
  {
    path: '/subscriber-information',
    name: 'subscriber-information',
    component: () => import('@/views/account/SubscriberInformationView.vue'),
    meta: {
      title: 'Subscriber Information',
      requiresAuth: true,
    },
  },
]
