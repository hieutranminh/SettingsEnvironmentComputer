import type { RouteRecordRaw } from 'vue-router'
import { requireGuest } from '../guards'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      requiresGuest: true
    },
    beforeEnter: requireGuest
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      title: 'Register',
      requiresGuest: true
    },
    beforeEnter: requireGuest
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: {
      title: 'Forgot Password',
      requiresGuest: true
    },
    beforeEnter: requireGuest
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: {
      title: 'Reset Password',
      requiresGuest: true
    },
    beforeEnter: requireGuest
  }
]
