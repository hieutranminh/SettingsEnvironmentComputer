import type { RouteRecordRaw } from 'vue-router'

export const branchRoutes: RouteRecordRaw[] = [
  {
    path: '/branch-sales',
    name: 'branch-sales',
    component: () => import('@/views/branch/BranchSalesView.vue'),
    meta: {
      title: 'Branch Sales',
      requiresAuth: true,
    },
  },
  {
    path: '/branch-prepaid-goods',
    name: 'branch-prepaid-goods',
    component: () => import('@/views/branch/BranchPrepaidGoodsView.vue'),
    meta: {
      title: 'Branch Prepaid Goods',
      requiresAuth: true,
    },
  },
  {
    path: '/sales-total-by-branch',
    name: 'sales-total-by-branch',
    component: () => import('@/views/branch/SalesTotalByBranchView.vue'),
    meta: {
      title: 'Sales Total by Branch',
      requiresAuth: true,
    },
    children: [
      {
        path: 'sales-total',
        name: 'sales-total',
        component: () => import('@/views/branch/SalesTotalView.vue'),
        meta: {
          title: 'Sales Total',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-staff',
        name: 'sales-by-staff',
        component: () => import('@/views/branch/SalesByStaffView.vue'),
        meta: {
          title: 'Sales by Staff',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-item',
        name: 'sales-by-item',
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
    name: 'branches',
    component: () => import('@/views/branch/BranchesView.vue'),
    meta: {
      title: 'Branches',
      requiresAuth: true,
    },
  },
]
