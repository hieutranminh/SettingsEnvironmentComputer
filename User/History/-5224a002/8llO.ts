import type { RouteRecordRaw } from 'vue-router'
import { PAYMENT_ROUTES } from '@/constants/routeNames'

export const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment',
    name: PAYMENT_ROUTES.PAYMENT,
    component: () => import('@/views/payment/PaymentView.vue'),
    meta: {
      title: 'Payment',
      requiresAuth: true,
    },
  },
  {
    path: '/payment-history',
    name: PAYMENT_ROUTES.PAYMENT_HISTORY,
    component: () => import('@/views/payment/PaymentHistoryView.vue'),
    meta: {
      title: 'Payment History',
      requiresAuth: true,
    },
  },
  {
    path: '/netmoney-history',
    name: PAYMENT_ROUTES.NETMONEY_HISTORY,
    component: () => import('@/views/payment/NetmoneyHistoryView.vue'),
    meta: {
      title: 'Netmoney History',
      requiresAuth: true,
    },
  },
  {
    path: '/extension-expiry-date',
    name: PAYMENT_ROUTES.EXTENSION_EXPIRY_DATE,
    component: () => import('@/views/payment/ExtensionExpiryDateView.vue'),
    meta: {
      title: 'Extension Expiry Date',
      requiresAuth: true,
    },
  },
]
