import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routeNames'

export const setupRoutes: RouteRecordRaw[] = [
  {
    path: '/setup-chain-logo',
    name: ROUTE_NAMES.SETUP_CHAIN_LOGO,
    component: () => import('@/views/setup/SetupChainLogoView.vue'),
    meta: {
      title: 'Setup Chain Logo',
      requiresAuth: true,
    },
  },
]
