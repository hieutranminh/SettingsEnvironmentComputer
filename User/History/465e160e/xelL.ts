import type { RouteRecordRaw } from 'vue-router'

export const goodsRoutes: RouteRecordRaw[] = [
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/goods/ServicesView.vue'),
    meta: {
      title: 'Services',
      requiresAuth: true,
    },
  },
  {
    path: '/prepaid-cards',
    name: 'prepaid-cards',
    component: () => import('@/views/goods/PrepaidCardsView.vue'),
    meta: {
      title: 'Prepaid Cards',
      requiresAuth: true,
    },
  },
  {
    path: '/packages',
    name: 'packages',
    component: () => import('@/views/goods/PackagesView.vue'),
    meta: {
      title: 'Packages',
      requiresAuth: true,
    },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/goods/ProductsView.vue'),
    meta: {
      title: 'Products',
      requiresAuth: true,
    },
  },
  {
    path: '/product-categories',
    name: 'product-categories',
    component: () => import('@/views/goods/ProductCategoriesView.vue'),
    meta: {
      title: 'Product Categories',
      requiresAuth: true,
    },
  },
]
