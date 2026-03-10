import type { RouteRecordRaw } from 'vue-router'

export const boardRoutes: RouteRecordRaw[] = [
  {
    path: '/headquarter-notice',
    name: 'headquarter-notice',
    component: () => import('@/views/board/HeadquarterNoticeView.vue'),
    meta: {
      title: 'Headquarter Notice',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'headquarter-notice-index',
        component: () => import('@/views/board/HeadquarterNoticeIndexView.vue'),
        meta: {
          title: 'Index Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: 'headquarter-notice-add',
        component: () => import('@/views/board/HeadquarterNoticeAddView.vue'),
        meta: {
          title: 'Add Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: 'headquarter-notice-add',
        component: () => import('@/views/board/HeadquarterNoticeAddView.vue'),
        meta: {
          title: 'Add Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: 'headquarter-notice-detail',
        component: () => import('@/views/board/HeadquarterNoticeDetailView.vue'),
        props: true,
        meta: {
          title: 'Headquarter Notice Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'headquarter-notice-edit',
        component: () => import('@/views/board/HeadquarterNoticeEditView.vue'),
        props: true,
        meta: {
          title: 'Edit Headquarter Notice',
          requiresAuth: true,
        },
      },
    ],
  },
]
