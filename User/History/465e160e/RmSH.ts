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
        component: () => import('@/views/goods/ServicesView.vue'),
        meta: {
          title: 'Services',
          requiresAuth: true,
        },
      },
      {
        path: 'prepaid-cards',
        name: ROUTE_NAMES.PREPAID_CARDS,
        component: () => import('@/views/goods/PrepaidCardsView.vue'),
        meta: {
          title: 'Prepaid Cards',
          requiresAuth: true,
        },
      },
      {
        path: 'packages',
        name: ROUTE_NAMES.PACKAGES,
        component: () => import('@/views/goods/PackagesView.vue'),
        meta: {
          title: 'Packages',
          requiresAuth: true,
        },
      },
      {
        path: 'products',
        name: ROUTE_NAMES.PRODUCTS,
        component: () => import('@/views/goods/ProductsView.vue'),
        meta: {
          title: 'Products',
          requiresAuth: true,
        },
      },
      {
        path: 'product-categories',
        name: ROUTE_NAMES.PRODUCT_CATEGORIES,
        component: () => import('@/views/goods/ProductCategoriesView.vue'),
        meta: {
          title: 'Product Categories',
          requiresAuth: true,
        },
      },
    ],
  },
]
