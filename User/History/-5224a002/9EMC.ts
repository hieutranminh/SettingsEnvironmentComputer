import type { RouteRecordRaw } from 'vue-router'

export const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment',
    name: 'payment',
    component: () => import('@/views/payment/PaymentView.vue'),
    meta: {
      title: 'Payment',
      requiresAuth: true,
    },
  },
  {
    path: '/payment/payment-history',
    name: 'payment-history',
    component: () => import('@/views/payment/PaymentHistoryView.vue'),
    meta: {
      title: 'Payment History',
      requiresAuth: true,
    },
  },
  {
    path: '/payment/netmoney-history',
    name: 'netmoney-history',
    component: () => import('@/views/payment/NetmoneyHistoryView.vue'),
    meta: {
      title: 'Netmoney History',
      requiresAuth: true,
    },
  },
  {
    path: '/payment/extension-expiry-date',
    name: 'extension-expiry-date',
    component: () => import('@/views/payment/ExtensionExpiryDateView.vue'),
    meta: {
      title: 'Extension Expiry Date',
      requiresAuth: true,
    },
  },
]
