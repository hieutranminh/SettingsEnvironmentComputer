import type { AppRouteRecordRaw } from '@/router/types'
import { ROUTE_NAMES } from '@/constants/APP_CONSTANTS'
import { requireGuest } from '@/router/guards'

export const authRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      requiresGuest: true,
      title: 'Login',
      hidden: true
    },
    beforeEnter: requireGuest
  },
  {
    path: '/register',
    name: ROUTE_NAMES.REGISTER,
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      requiresGuest: true,
      title: 'Register',
      hidden: true
    },
    beforeEnter: requireGuest
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: {
      requiresGuest: true,
      title: 'Forgot Password',
      hidden: true
    },
    beforeEnter: requireGuest
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: {
      requiresGuest: true,
      title: 'Reset Password',
      hidden: true
    },
    beforeEnter: requireGuest
  }
]
