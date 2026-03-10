import type { RouteRecordRaw } from 'vue-router'

export const boardRoutes: RouteRecordRaw[] = [
  {
    path: '/board',
    name: 'board',
    redirect: '/board/headquarter-notice',
    meta: {
      title: 'Board',
      requiresAuth: true,
    },
    children: [
      {
        path: 'headquarter-notice',
        name: 'headquarter-notice',
        redirect: '/board/headquarter-notice/add',
        meta: {
          title: 'Headquarter Notice',
          requiresAuth: true,
        },
        children: [
          {
            path: 'add',
            name: 'headquarter-notice-add',
            component: () => import('@/views/board/headquarter-notice/AddView.vue'),
            meta: {
              title: 'Add Headquarter Notice',
              requiresAuth: true,
            },
          },
          {
            path: 'view',
            name: 'headquarter-notice-view',
            component: () => import('@/views/board/headquarter-notice/ViewView.vue'),
            meta: {
              title: 'View Headquarter Notice',
              requiresAuth: true,
            },
          },
          {
            path: 'edit',
            name: 'headquarter-notice-edit',
            component: () => import('@/views/board/headquarter-notice/EditView.vue'),
            meta: {
              title: 'Edit Headquarter Notice',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: 'branch-board',
        name: 'branch-board',
        redirect: '/board/branch-board/add',
        meta: {
          title: 'Branch Board',
          requiresAuth: true,
        },
        children: [
          {
            path: 'add',
            name: 'branch-board-add',
            component: () => import('@/views/board/branch-board/AddView.vue'),
            meta: {
              title: 'Add Branch Board',
              requiresAuth: true,
            },
          },
          {
            path: 'view',
            name: 'branch-board-view',
            component: () => import('@/views/board/branch-board/ViewView.vue'),
            meta: {
              title: 'View Branch Board',
              requiresAuth: true,
            },
          },
          {
            path: 'edit',
            name: 'branch-board-edit',
            component: () => import('@/views/board/branch-board/EditView.vue'),
            meta: {
              title: 'Edit Branch Board',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: 'popups',
        name: 'popups',
        redirect: '/board/popups/add',
        meta: {
          title: 'Popups',
          requiresAuth: true,
        },
        children: [
          {
            path: 'add',
            name: 'popups-add',
            component: () => import('@/views/board/popups/AddView.vue'),
            meta: {
              title: 'Add Popup',
              requiresAuth: true,
            },
          },
          {
            path: 'view',
            name: 'popups-view',
            component: () => import('@/views/board/popups/ViewView.vue'),
            meta: {
              title: 'View Popup',
              requiresAuth: true,
            },
          },
          {
            path: 'edit',
            name: 'popups-edit',
            component: () => import('@/views/board/popups/EditView.vue'),
            meta: {
              title: 'Edit Popup',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: 'ahasoft-notice',
        name: 'ahasoft-notice',
        redirect: '/board/ahasoft-notice/view',
        meta: {
          title: 'Ahasoft Notice',
          requiresAuth: true,
        },
        children: [
          {
            path: 'view',
            name: 'ahasoft-notice-view',
            component: () => import('@/views/board/ahasoft-notice/ViewView.vue'),
            meta: {
              title: 'View Ahasoft Notice',
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
]
