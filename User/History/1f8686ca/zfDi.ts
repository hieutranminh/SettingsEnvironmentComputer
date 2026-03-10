import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/APP_CONSTANTS'
import authService from '@/services/auth'

export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  if (authService.isAuthenticated()) {
    next()
  } else {
    next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
  }
}

export const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  if (authService.isAuthenticated()) {
    next({ name: ROUTE_NAMES.DASHBOARD })
  } else {
    next()
  }
}

export const requireRole = (requiredRoles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    if (!authService.isAuthenticated()) {
      next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
      return
    }

    // Get user role from token or store
    const token = authService.getAccessToken()
    if (!token) {
      next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userRole = payload.role

      if (requiredRoles.includes(userRole)) {
        next()
      } else {
        next({ name: ROUTE_NAMES.DASHBOARD })
      }
    } catch {
      next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
    }
  }
}

export const requireAdmin = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  requireRole(['admin'])(to, from, next)
}

export const requireModerator = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  requireRole(['admin', 'moderator'])(to, from, next)
}
