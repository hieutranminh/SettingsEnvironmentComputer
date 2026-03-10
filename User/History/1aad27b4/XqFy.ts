import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'

export const branchRoutes: RouteRecordRaw[] = [
  {
    path: '/branch-sales',
    name: ROUTE_NAMES.BRANCH_SALES,
    component: () => import('@/views/branch/branch-sales/BranchSalesView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/branch-prepaid-goods',
    name: ROUTE_NAMES.BRANCH_PREPAID_GOODS,
    component: () => import('@/views/branch/branch-prepaid-goods/BranchPrepaidGoodsView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/sales-total-by-branch',
    name: ROUTE_NAMES.SALES_TOTAL_BY_BRANCH,
    redirect: '/sales-total-by-branch/sales-total',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'sales-total',
        name: ROUTE_NAMES.SALES_TOTAL,
        component: () => import('@/views/branch/SalesTotalView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-staff',
        name: ROUTE_NAMES.SALES_BY_STAFF,
        component: () => import('@/views/branch/SalesByStaffView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-item',
        name: ROUTE_NAMES.SALES_BY_ITEM,
        component: () => import('@/views/branch/SalesByItemView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/branches',
    name: ROUTE_NAMES.BRANCHES,
    component: () => import('@/views/branch/BranchesView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]
