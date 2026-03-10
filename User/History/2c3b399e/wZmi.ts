import type { RouteRecordRaw } from 'vue-router'

export const boardRoutes: RouteRecordRaw[] = [
  // Headquarter Notice
  {
    path: '/headquarter-notice',
    name: 'headquarter-notice',
    component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeView.vue'),
    meta: {
      title: 'Headquarter Notice',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'headquarter-notice-index',
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeIndexView.vue'),
        meta: {
          title: 'Index Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: 'headquarter-notice-add',
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeAddView.vue'),
        meta: {
          title: 'Add Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: 'headquarter-notice-detail',
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeDetailView.vue'),
        props: true,
        meta: {
          title: 'Headquarter Notice Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'headquarter-notice-edit',
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeEditView.vue'),
        props: true,
        meta: {
          title: 'Edit Headquarter Notice',
          requiresAuth: true,
        },
      },
    ],
  },

  // Branch Board
  {
    path: '/branch-board',
    name: 'branch-board',
    component: () => import('@/views/board/BranchBoardView.vue'),
    meta: {
      title: 'Branch Board',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'branch-board-index',
        component: () => import('@/views/board/BranchBoardIndexView.vue'),
        meta: {
          title: 'Index Branch Board',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: 'branch-board-add',
        component: () => import('@/views/board/BranchBoardAddView.vue'),
        meta: {
          title: 'Add Branch Board',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: 'branch-board-detail',
        component: () => import('@/views/board/BranchBoardDetailView.vue'),
        props: true,
        meta: {
          title: 'Branch Board Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'branch-board-edit',
        component: () => import('@/views/board/BranchBoardEditView.vue'),
        props: true,
        meta: {
          title: 'Edit Branch Board',
          requiresAuth: true,
        },
      },
    ],
  },

  // Popups
  {
    path: '/popups',
    name: 'popups',
    component: () => import('@/views/board/PopupsView.vue'),
    meta: {
      title: 'Popups',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'popups-index',
        component: () => import('@/views/board/PopupsIndexView.vue'),
        meta: {
          title: 'Index Popups',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: 'popups-add',
        component: () => import('@/views/board/PopupsAddView.vue'),
        meta: {
          title: 'Add Popups',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: 'popups-detail',
        component: () => import('@/views/board/PopupsDetailView.vue'),
        props: true,
        meta: {
          title: 'Popups Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'popups-edit',
        component: () => import('@/views/board/PopupsEditView.vue'),
        props: true,
        meta: {
          title: 'Edit Popups',
          requiresAuth: true,
        },
      },
    ],
  },

  // Ahasoft Notice
  {
    path: '/ahasoft-notice',
    name: 'ahasoft-notice',
    component: () => import('@/views/board/AhasoftNoticeView.vue'),
    meta: {
      title: 'Ahasoft Notice',
      requiresAuth: true,
    },
    children: [
      {
        path: 'detail/:id',
        name: 'ahasoft-notice-detail',
        component: () => import('@/views/board/AhasoftNoticeDetailView.vue'),
        props: true,
        meta: {
          title: 'Ahasoft Notice Detail',
          requiresAuth: true,
        },
      },
    ],
  },
]
