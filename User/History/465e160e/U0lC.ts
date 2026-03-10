import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'

export const goodsRoutes: RouteRecordRaw[] = [
  {
    path: '/goods',
    name: ROUTE_NAMES.GOODS,
    redirect: '/goods/services',
    meta: {
      title: 'Goods',
      requiresAuth: true,
    },
    children: [
      {
        path: 'services',
        name: ROUTE_NAMES.SERVICES,
        component: () => import('@/views/goods/service/ServicesView.vue'),
        meta: {
          title: 'Services',
          requiresAuth: true,
        },
      },
      {
        path: 'packages',
        name: ROUTE_NAMES.PACKAGES,
        component: () => import('@/views/goods/package/PackagesView.vue'),
        meta: {
          title: 'Packages',
          requiresAuth: true,
        },
      },
    ],
  },
]
