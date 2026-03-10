import type { RouteRecordRaw } from 'vue-router'
// import { requireAuth, requireAdmin } from '../guards'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/users/UsersView.vue'),
    meta: {
      title: 'Users',
      requiresAuth: true,
      requiresAdmin: true
    },
    // beforeEnter: requireAdmin
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/views/users/UserDetailView.vue'),
    meta: {
      title: 'User Detail',
      requiresAuth: true,
      requiresAdmin: true
    },
    // beforeEnter: requireAdmin
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/users/ProfileView.vue'),
    meta: {
      title: 'Profile',
      requiresAuth: true
    },
    // beforeEnter: requireAuth
  }
]
