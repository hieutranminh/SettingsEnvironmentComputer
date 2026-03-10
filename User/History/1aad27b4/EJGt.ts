import type { RouteRecordRaw } from 'vue-router'
import { BRANCH_ROUTES } from '@/constants/routeNames'

export const branchRoutes: RouteRecordRaw[] = [
  {
    path: '/branch-sales',
    name: BRANCH_ROUTES.BRANCH_SALES,
    component: () => import('@/views/branch/BranchSalesView.vue'),
    meta: {
      title: 'Branch Sales',
      requiresAuth: true,
    },
  },
  {
    path: '/branch-prepaid-goods',
    name: BRANCH_ROUTES.BRANCH_PREPAID_GOODS,
    component: () => import('@/views/branch/BranchPrepaidGoodsView.vue'),
    meta: {
      title: 'Branch Prepaid Goods',
      requiresAuth: true,
    },
  },
  {
    path: '/sales-total-by-branch',
    name: BRANCH_ROUTES.SALES_TOTAL_BY_BRANCH,
    redirect: '/sales-total-by-branch/sales-total',
    meta: {
      title: 'Sales Total by Branch',
      requiresAuth: true,
    },
    children: [
      {
        path: 'sales-total',
        name: BRANCH_ROUTES.SALES_TOTAL,
        component: () => import('@/views/branch/SalesTotalView.vue'),
        meta: {
          title: 'Sales Total',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-staff',
        name: BRANCH_ROUTES.SALES_BY_STAFF,
        component: () => import('@/views/branch/SalesByStaffView.vue'),
        meta: {
          title: 'Sales by Staff',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-item',
        name: BRANCH_ROUTES.SALES_BY_ITEM,
        component: () => import('@/views/branch/SalesByItemView.vue'),
        meta: {
          title: 'Sales by Item',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/branches',
    name: BRANCH_ROUTES.BRANCHES,
    component: () => import('@/views/branch/BranchesView.vue'),
    meta: {
      title: 'Branches',
      requiresAuth: true,
    },
  },
]
