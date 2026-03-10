import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routeNames'

export const boardRoutes: RouteRecordRaw[] = [
  // Headquarter Notice
  {
    path: '/headquarter-notice',
    name: ROUTE_NAMES.HEADQUARTER_NOTICE,
    component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeView.vue'),
    meta: {
      title: 'Headquarter Notice',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.HEADQUARTER_NOTICE_INDEX,
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeIndexView.vue'),
        meta: {
          title: 'Index Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: ROUTE_NAMES.HEADQUARTER_NOTICE_ADD,
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeAddView.vue'),
        meta: {
          title: 'Add Headquarter Notice',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: ROUTE_NAMES.HEADQUARTER_NOTICE_DETAIL,
        component: () => import('@/views/board/headquarter-notice/HeadquarterNoticeDetailView.vue'),
        props: true,
        meta: {
          title: 'Headquarter Notice Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: ROUTE_NAMES.HEADQUARTER_NOTICE_EDIT,
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
    name: ROUTE_NAMES.BRANCH_BOARD,
    component: () => import('@/views/board/branch-board/BranchBoardView.vue'),
    meta: {
      title: 'Branch Board',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.BRANCH_BOARD_INDEX,
        component: () => import('@/views/board/branch-board/BranchBoardIndexView.vue'),
        meta: {
          title: 'Index Branch Board',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: ROUTE_NAMES.BRANCH_BOARD_ADD,
        component: () => import('@/views/board/branch-board/BranchBoardAddView.vue'),
        meta: {
          title: 'Add Branch Board',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: ROUTE_NAMES.BRANCH_BOARD_DETAIL,
        component: () => import('@/views/board/branch-board/BranchBoardDetailView.vue'),
        props: true,
        meta: {
          title: 'Branch Board Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: ROUTE_NAMES.BRANCH_BOARD_EDIT,
        component: () => import('@/views/board/branch-board/BranchBoardEditView.vue'),
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
    name: ROUTE_NAMES.POPUPS,
    component: () => import('@/views/board/popups/PopupsView.vue'),
    meta: {
      title: 'Popups',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.POPUPS_INDEX,
        component: () => import('@/views/board/popups/PopupsIndexView.vue'),
        meta: {
          title: 'Index Popups',
          requiresAuth: true,
        },
      },
      {
        path: 'add',
        name: ROUTE_NAMES.POPUPS_ADD,
        component: () => import('@/views/board/popups/PopupsAddView.vue'),
        meta: {
          title: 'Add Popups',
          requiresAuth: true,
        },
      },
      {
        path: 'detail/:id',
        name: ROUTE_NAMES.POPUPS_DETAIL,
        component: () => import('@/views/board/popups/PopupsDetailView.vue'),
        props: true,
        meta: {
          title: 'Popups Detail',
          requiresAuth: true,
        },
      },
      {
        path: 'edit/:id',
        name: ROUTE_NAMES.POPUPS_EDIT,
        component: () => import('@/views/board/popups/PopupsEditView.vue'),
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
    name: ROUTE_NAMES.AHASOFT_NOTICE,
    component: () => import('@/views/board/ahasoft-notice/AhasoftNoticeView.vue'),
    meta: {
      title: 'Ahasoft Notice',
      requiresAuth: true,
    },
    children: [
      {
        path: 'detail/:id',
        name: ROUTE_NAMES.AHASOFT_NOTICE_DETAIL,
        component: () => import('@/views/board/ahasoft-notice/AhasoftNoticeDetailView.vue'),
        props: true,
        meta: {
          title: 'Ahasoft Notice Detail',
          requiresAuth: true,
        },
      },
    ],
  },
]
