import type { AppRouteRecordRaw } from '@/router/types'

export const userRoutes: AppRouteRecordRaw[] = [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/users/UserListView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'User Management',
      breadcrumb: true
    },
    children: [
      {
        path: 'create',
        name: 'user-create',
        component: () => import('@/views/users/UserCreateView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin'],
          title: 'Create User',
          breadcrumb: true
        }
      },
      {
        path: ':id',
        name: 'user-detail',
        component: () => import('@/views/users/UserDetailView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin'],
          title: 'User Details',
          breadcrumb: true
        }
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: () => import('@/views/users/UserEditView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin'],
          title: 'Edit User',
          breadcrumb: true
        }
      }
    ]
  }
]
