import { useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'

import type { RouteName } from '@/constants/routeNames'

/**
 * Router navigation composable for type-safe navigation using route name constants
 */
export const useRouterNavigation = () => {
  const router = useRouter()

  const createNavigationFunctions = () => {
    const navigateTo = (name: RouteName, params?: Record<string, string | number>) => {
      return router.push({ name, params })
    }

    const navigateToWithQuery = (name: RouteName, query?: LocationQueryRaw) => {
      return router.push({ name, query })
    }

    const navigateToWithParamsAndQuery = (
      name: RouteName,
      params?: Record<string, string | number>,
      query?: LocationQueryRaw,
    ) => {
      return router.push({ name, params, query })
    }

    const replaceTo = (name: RouteName, params?: Record<string, string | number>) => {
      return router.replace({ name, params })
    }

    const replaceToWithQuery = (name: RouteName, query?: LocationQueryRaw) => {
      return router.replace({ name, query })
    }

    const replaceToWithParamsAndQuery = (
      name: RouteName,
      params?: Record<string, string | number>,
      query?: LocationQueryRaw,
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

  const createRouteMatchingFunctions = () => {
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

  const createUtilityFunctions = () => {
    const getRouteNameByPath = (): RouteName | null => {
      // This would need to be implemented based on your router configuration
      // For now, returning null as a placeholder
      return null
    }

    return {
      getRouteNameByPath,
    }
  }

  const navigationFunctions = createNavigationFunctions()
  const routeMatchingFunctions = createRouteMatchingFunctions()
  const utilityFunctions = createUtilityFunctions()

  return {
    // Navigation functions
    ...navigationFunctions,

    // Route matching functions
    ...routeMatchingFunctions,

    // Utility functions
    ...utilityFunctions,
  }
}
