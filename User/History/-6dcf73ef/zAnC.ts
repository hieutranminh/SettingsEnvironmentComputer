import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'

export const reportByBranchRoutes: RouteRecordRaw[] = [
  {
    path: '/report',
    name: ROUTE_NAMES.REPORT,
    meta: {
      requiresAuth: true,
    },
    children: [
      // Report by Branch
      {
        path: '',
        name: ROUTE_NAMES.REPORT_BY_BRANCH,
        component: () => import('@/views/report-by-branch/ReportByBranchView.vue'),
        meta: {
          requiresAuth: true,
        },
      },

      // Sales Analysis
      {
        path: 'sales-by-date',
        name: ROUTE_NAMES.SALES_BY_DATE,
        component: () => import('@/views/report-by-branch/sales-by-date/SalesByDateView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-month',
        name: ROUTE_NAMES.SALES_BY_MONTH,
        component: () => import('@/views/report-by-branch/sales-by-month/SalesByMonthView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales',
        name: ROUTE_NAMES.SERVICE_SALES,
        component: () => import('@/views/report-by-branch/service-sales/ServiceSalesView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-item',
        name: ROUTE_NAMES.SERVICE_SALES_BY_ITEM,
        component: () => import('@/views/report-by-branch/service-sales-by-item/ServiceSalesByItemView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-month',
        name: ROUTE_NAMES.SERVICE_SALES_BY_MONTH,
        component: () => import('@/views/report-by-branch/service-sales-by-month/ServiceSalesByMonthView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-sales-type',
        name: ROUTE_NAMES.SERVICE_SALES_BY_SALES_TYPE,
        component: () => import('@/views/report-by-branch/service-sales-by-sales-type/ServiceSalesBySalesTypeView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'product-sales-by-item',
        name: ROUTE_NAMES.PRODUCT_SALES_BY_ITEM,
        component: () => import('@/views/report-by-branch/product-sales-by-item/ProductSalesByItemView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'product-sales-by-month',
        name: ROUTE_NAMES.PRODUCT_SALES_BY_MONTH,
        component: () => import('@/views/report-by-branch/product-sales-by-month/ProductSalesByMonthView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-discount-category',
        name: ROUTE_NAMES.SALES_BY_DISCOUNT_CATEGORY,
        component: () => import('@/views/report-by-branch/sales-by-discount-category/SalesByDiscountCategoryView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-repeat-clients',
        name: ROUTE_NAMES.SALES_BY_REPEAT_CLIENTS,
        component: () => import('@/views/report-by-branch/sales-by-repeat-clients/SalesByRepeatClientsView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'prepaid-goods-repurchase',
        name: ROUTE_NAMES.PREPAID_GOODS_REPURCHASE,
        component: () => import('@/views/report-by-branch/prepaid-goods-repurchase/PrepaidGoodsRepurchaseView.vue'),
        meta: {
          requiresAuth: true,
        },
      },

      // Clients Analysis
      {
        path: 'clients-summary',
        name: ROUTE_NAMES.CLIENTS_SUMMARY,
        component: () => import('@/views/report-by-branch/ClientsSummaryView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'clients-by-period',
        name: ROUTE_NAMES.CLIENTS_BY_PERIOD,
        component: () => import('@/views/report-by-branch/clients-by-period/ClientsByPeriodView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'clients-by-type',
        name: ROUTE_NAMES.CLIENTS_BY_TYPE,
        component: () => import('@/views/report-by-branch/clients-by-type/ClientsByTypeView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-repeat',
        name: ROUTE_NAMES.NEW_CLIENTS_REPEAT,
        component: () => import('@/views/report-by-branch/NewClientsRepeatView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-by-month',
        name: ROUTE_NAMES.NEW_CLIENTS_BY_MONTH,
        component: () => import('@/views/report-by-branch/NewClientsByMonthView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'recommended-clients-by-month',
        name: ROUTE_NAMES.RECOMMENDED_CLIENTS_BY_MONTH,
        component: () => import('@/views/report-by-branch/RecommendedClientsByMonthView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-by-referral-source',
        name: ROUTE_NAMES.NEW_CLIENTS_BY_REFERRAL_SOURCE,
        component: () => import('@/views/report-by-branch/NewClientsByReferralSourceView.vue'),
        meta: {
          requiresAuth: true,
        },
      },

      // Bookings Analysis
      {
        path: 'bookings-tally-details',
        name: ROUTE_NAMES.BOOKINGS_TALLY_DETAILS,
        component: () => import('@/views/report-by-branch/BookingsTallyDetailsView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-date',
        name: ROUTE_NAMES.BOOKINGS_BY_DATE,
        component: () => import('@/views/report-by-branch/BookingsByDateView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-month',
        name: ROUTE_NAMES.BOOKINGS_BY_MONTH,
        component: () => import('@/views/report-by-branch/BookingsByMonthView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-resource',
        name: ROUTE_NAMES.BOOKINGS_BY_RESOURCE,
        component: () => import('@/views/report-by-branch/BookingsByResourceView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-day-of-week',
        name: ROUTE_NAMES.BOOKINGS_BY_DAY_OF_WEEK,
        component: () => import('@/views/report-by-branch/BookingsByDayOfWeekView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-time',
        name: ROUTE_NAMES.BOOKINGS_BY_TIME,
        component: () => import('@/views/report-by-branch/BookingsByTimeView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-source',
        name: ROUTE_NAMES.BOOKINGS_BY_SOURCE,
        component: () => import('@/views/report-by-branch/BookingsBySourceView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'booking-ratio',
        name: ROUTE_NAMES.BOOKING_RATIO,
        component: () => import('@/views/report-by-branch/BookingRatioView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
]
