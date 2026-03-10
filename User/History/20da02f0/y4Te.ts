import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

// import { authRoutes } from './modules/auth.routes'
import { accountRoutes } from './modules/account.routes'
import { paymentRoutes } from './modules/payment.routes'
import { branchRoutes } from './modules/branch.routes'
import { reportByBranchRoutes } from './modules/report-by-branch.routes'
import { goodsRoutes } from './modules/goods.routes'
import { setupRoutes } from './modules/setup.routes'
import { boardRoutes } from './modules/board.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/device-test',
      name: 'device-test',
      component: () => import('@/views/DeviceTestView.vue'),
    },
    // ...authRoutes,
    ...accountRoutes,
    ...paymentRoutes,
    ...branchRoutes,
    ...reportByBranchRoutes,
    ...goodsRoutes,
    ...setupRoutes,
    ...boardRoutes,
  ],
})

export default router
