import type { AppRouteRecordRaw } from '@/router/types'
import { ROUTE_NAMES } from '@/constants/APP_CONSTANTS'

export const publicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Home',
      icon: 'home'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'About',
      icon: 'info'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'Contact',
      icon: 'contact_support'
    }
  }
]
