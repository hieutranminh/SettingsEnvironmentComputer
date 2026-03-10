import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routeNames'

export const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment',
    name: ROUTE_NAMES.PAYMENT,
    component: () => import('@/views/payment/PaymentView.vue'),
    meta: {
      title: 'Payment',
      requiresAuth: true,
    },
  },
  {
    path: '/payment-history',
    name: ROUTE_NAMES.PAYMENT_HISTORY,
    component: () => import('@/views/payment/PaymentHistoryView.vue'),
    meta: {
      title: 'Payment History',
      requiresAuth: true,
    },
  },
  {
    path: '/netmoney-history',
    name: ROUTE_NAMES.NETMONEY_HISTORY,
    component: () => import('@/views/payment/NetmoneyHistoryView.vue'),
    meta: {
      title: 'Netmoney History',
      requiresAuth: true,
    },
  },
  {
    path: '/extension-expiry-date',
    name: ROUTE_NAMES.EXTENSION_EXPIRY_DATE,
    component: () => import('@/views/payment/ExtensionExpiryDateView.vue'),
    meta: {
      title: 'Extension Expiry Date',
      requiresAuth: true,
    },
  },
]
