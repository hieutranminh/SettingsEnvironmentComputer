import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

// import { authRoutes } from './modules/auth.routes'
import { userRoutes } from './modules/user.routes'
import { accountRoutes } from './modules/account.routes'
import { paymentRoutes } from './modules/payment.routes'
import { branchRoutes } from './modules/branch.routes'
import { reportByBranchRoutes } from './modules/report-by-branch.routes'

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
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    // ...authRoutes,
    ...userRoutes,
    ...accountRoutes,
    ...paymentRoutes,
    ...branchRoutes,
  ],
})

export default router
