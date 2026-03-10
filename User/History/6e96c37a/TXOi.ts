import type { RouteRecordRaw } from 'vue-router'
// import { requireGuest } from '../guards'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      requiresGuest: true,
      hideHeader: true,
    },
    // beforeEnter: requireGuest
  },
  {
    path: '/login-d',
    name: 'login-d',
    component: () => import('@/views/auth/LoginDView.vue'),
    meta: {
      title: 'Login Key',
      requiresGuest: true,
      hideHeader: true,
    },
    // beforeEnter: requireGuest
  },
  // {
  //   path: '/validation',
  //   name: 'validation',
  //   component: () => import('@/views/validationForm.vue'),
  //   meta: {
  //     title: 'Login Key',
  //     requiresGuest: true,
  //     hideHeader: true,
  //   },
  //   // beforeEnter: requireGuest
  // },
  // {
  //   path: '/register',
  //   name: 'register',
  //   component: () => import('@/views/auth/RegisterView.vue'),
  //   meta: {
  //     title: 'Register',
  //     requiresGuest: true,
  //     hideHeader: true
  //   },
  //   beforeEnter: requireGuest
  // },
]
