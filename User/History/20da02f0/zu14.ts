import { createRouter, createWebHistory } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'
import HomeView from '@/views/HomeView.vue'

import { accountRoutes } from './modules/account.routes'
import { authRoutes } from './modules/auth.routes'
import { boardRoutes } from './modules/board.routes'
import { branchRoutes } from './modules/branch.routes'
import { goodsRoutes } from './modules/goods.routes'
import { paymentRoutes } from './modules/payment.routes'
import { reportByBranchRoutes } from './modules/report-by-branch.routes'
import { setupRoutes } from './modules/setup.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.HOME,
      component: HomeView,
    },
    {
      path: '/device-test',
      name: ROUTE_NAMES.DEVICE_TEST,
      component: () => import('@/views/DeviceTestView.vue'),
    },
    ...authRoutes,
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
