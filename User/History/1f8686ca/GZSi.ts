import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if user has required roles
  if (to.meta?.roles && authStore.user) {
    const roles = to.meta.roles as string[]
    const hasRequiredRole = roles.some((role: string) =>
      authStore.user?.roles.includes(role)
    )

    if (!hasRequiredRole) {
      next({ name: 'unauthorized' })
      return
    }
  }

  // If user is authenticated and trying to access login/register pages, redirect to dashboard
  if (authStore.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
    next({ name: 'dashboard' })
    return
  }

  next()
}

export const initAuthGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore()

  // Initialize auth state from localStorage or token
  await authStore.initializeAuth()

  next()
}
