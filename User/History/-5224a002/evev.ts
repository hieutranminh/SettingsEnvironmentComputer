import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'

export const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment-history',
    name: ROUTE_NAMES.PAYMENT_HISTORY,
    component: () => import('@/views/payment/payment-history/PaymentHistoryView.vue'),
    meta: {
      title: 'Payment History',
      requiresAuth: true,
    },
  },
  {
    path: '/netmoney-history',
    name: ROUTE_NAMES.NETMONEY_HISTORY,
    component: () => import('@/views/payment/netmoney-history/NetmoneyHistoryView.vue'),
    meta: {
      title: 'Netmoney History',
      requiresAuth: true,
    },
  },
  {
    path: '/extension-expiry-date',
    name: ROUTE_NAMES.EXTENSION_EXPIRY_DATE,
    component: () => import('@/views/payment/extension-expiry-date/ExtensionExpiryDateView.vue'),
    meta: {
      title: 'Extension Expiry Date',
      requiresAuth: true,
    },
  },
]
