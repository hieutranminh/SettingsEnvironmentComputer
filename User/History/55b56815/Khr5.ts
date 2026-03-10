import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants'

export const releaseRoutes: RouteRecordRaw[] = [
  {
    path: 'release',
    meta: {
      title: 'menu.release',
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.RELEASE,
        component: () => import('@/views/Release/ReleaseView.vue'),
      },
      {
        path: ':releaseNo',
        name: ROUTE_NAMES.RELEASE_DETAIL,
        component: () => import('@/views/Release/ReleaseDetailView.vue'),
        meta: {
          title: 'release.detail',
        },
      },
    ],
  },
]
