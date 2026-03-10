import { createRouter, createWebHistory } from 'vue-router'
import type { AppRouteRecordRaw } from './types'
import { authRoutes } from './modules/auth.routes'
import { dashboardRoutes } from './modules/dashboard.routes'
import { adminRoutes } from './modules/admin.routes'
import { publicRoutes } from './modules/public.routes'

const routes: AppRouteRecordRaw[] = [
  ...publicRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  ...adminRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found',
      hidden: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
