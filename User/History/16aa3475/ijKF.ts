import type { RouteRecordRaw } from 'vue-router'

export const setupRoutes: RouteRecordRaw[] = [
  {
    path: '/setup-chain-logo',
    name: 'setup-chain-logo',
    component: () => import('@/views/setup/SetupChainLogoView.vue'),
    meta: {
      title: 'Setup Chain Logo',
      requiresAuth: true,
    },
  },
]
