import type { RouteRecordRaw } from 'vue-router'

export const setupRoutes: RouteRecordRaw[] = [
  {
    path: '/setup',
    name: 'setup',
    redirect: '/setup/setup-chain-logo',
    meta: {
      title: 'Setup',
      requiresAuth: true,
    },
    children: [
      {
        path: 'setup-chain-logo',
        name: 'setup-chain-logo',
        component: () => import('@/views/setup/SetupChainLogoView.vue'),
        meta: {
          title: 'Setup Chain Logo',
          requiresAuth: true,
        },
      },
    ],
  },
]
