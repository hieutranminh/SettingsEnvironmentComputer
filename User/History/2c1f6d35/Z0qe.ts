import { useRouter } from 'vue-router'
import type { RouteName } from '@/constants/routeNames'

/**
 * Router utility functions for navigation using route name constants
 */

/**
 * Navigate to a route by name with optional parameters
 */
export const useRouterNavigation = () => {
  const router = useRouter()

  const navigateTo = (name: RouteName, params?: Record<string, string | number>) => {
    return router.push({ name, params })
  }

  const navigateToWithQuery = (name: RouteName, query?: Record<string, string | number | boolean>) => {
    return router.push({ name, query })
  }

  const navigateToWithParamsAndQuery = (
    name: RouteName,
    params?: Record<string, string | number>,
    query?: Record<string, string | number | boolean>,
  ) => {
    return router.push({ name, params, query })
  }

  const replaceTo = (name: RouteName, params?: Record<string, string | number>) => {
    return router.replace({ name, params })
  }

  const replaceToWithQuery = (name: RouteName, query?: Record<string, string | number | boolean>) => {
    return router.replace({ name, query })
  }

  const replaceToWithParamsAndQuery = (
    name: RouteName,
    params?: Record<string, string | number>,
    query?: Record<string, string | number | boolean>,
  ) => {
    return router.replace({ name, params, query })
  }

  return {
    navigateTo,
    navigateToWithQuery,
    navigateToWithParamsAndQuery,
    replaceTo,
    replaceToWithQuery,
    replaceToWithParamsAndQuery,
  }
}

/**
 * Get route name by path (useful for reverse lookup)
 */
export const getRouteNameByPath = (path: string): RouteName | null => {
  // This would need to be implemented based on your router configuration
  // For now, returning null as a placeholder
  return null
}

/**
 * Check if current route matches a specific route name
 */
export const useRouteMatcher = () => {
  const router = useRouter()

  const isCurrentRoute = (name: RouteName): boolean => {
    return router.currentRoute.value.name === name
  }

  const isCurrentRouteIn = (names: RouteName[]): boolean => {
    return names.includes(router.currentRoute.value.name as RouteName)
  }

  return {
    isCurrentRoute,
    isCurrentRouteIn,
  }
}
