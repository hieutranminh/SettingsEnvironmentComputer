import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './modules/public.routes'
import { authRoutes } from './modules/auth.routes'
import { userRoutes } from './modules/user.routes'
import { authGuard, initAuthGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...authRoutes,
    ...userRoutes
  ],
})

// Global navigation guards
router.beforeEach(initAuthGuard)
router.beforeEach(authGuard)

export default router
