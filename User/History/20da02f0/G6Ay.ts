import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { AUTH_ROUTES, ROUTE_NAMES } from '@/constants/routeNames'
import HomeView from '@/views/Home/HomeView.vue'

import { accountRoutes } from './modules/account.routes'
import { authRoutes } from './modules/auth.routes'
import { boardRoutes } from './modules/board.routes'
import { branchRoutes } from './modules/branch.routes'
import { goodsRoutes } from './modules/goods.routes'
import { paymentRoutes } from './modules/payment.routes'
import { setupRoutes } from './modules/setup.routes'
import { reportByBranchRoutes } from './modules/report-by-branch.routes'
import { useAuthStore } from '@/stores/auth/auth'

const routers: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: ROUTE_NAMES.HOME,
        component: HomeView,
      },
      {
        path: ':pathMatch(.*)*',
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/components/common/NotFound.vue'),
      },
      // {
      //   path: '/logout',
      //   name: ROUTE_NAMES.LOGOUT,
      //   component: () => import('@/views/auth/Logout.vue'),
      // },
      ...accountRoutes,
      ...paymentRoutes,
      ...branchRoutes,
      ...reportByBranchRoutes,
      ...goodsRoutes,
      ...setupRoutes,
      ...boardRoutes,
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [...authRoutes],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (
    to.params.expired ||
    to.name === ROUTE_NAMES.LOGIN ||
    to.name === ROUTE_NAMES.LOGOUT ||
    to.name === ROUTE_NAMES.FIND_LOGIN_INFO ||
    to.name === ROUTE_NAMES.LOGIN_D
  ) {
    next()
  } else {
    const loggedIn = authStore.state.logged_in
    if (!loggedIn) {
      return next({ name: AUTH_ROUTES.LOGOUT })
    }
    next()
  }
})
export default router
