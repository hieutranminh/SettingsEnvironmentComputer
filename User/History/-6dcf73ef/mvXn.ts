import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'

export const reportByBranchRoutes: RouteRecordRaw[] = [
  {
    path: '/report',
    name: ROUTE_NAMES.REPORT,
    meta: {
      title: 'Report',
      requiresAuth: true,
    },
    children: [
      // Report by Branch
      {
        path: '',
        name: ROUTE_NAMES.REPORT_BY_BRANCH,
        component: () => import('@/views/report-by-branch/ReportByBranchView.vue'),
        meta: {
          title: 'Report by Branch',
          requiresAuth: true,
        },
      },

      // Sales Analysis
      {
        path: 'sales-by-date',
        name: ROUTE_NAMES.SALES_BY_DATE,
        component: () => import('@/views/report-by-branch/sales-by-date/SalesByDateView.vue'),
        meta: {
          title: 'Sales by Date',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-month',
        name: ROUTE_NAMES.SALES_BY_MONTH,
        component: () => import('@/views/report-by-branch/sales-by-month/SalesByMonthView.vue'),
        meta: {
          title: 'Sales by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales',
        name: ROUTE_NAMES.SERVICE_SALES,
        component: () => import('@/views/report-by-branch/service-sales/ServiceSalesView.vue'),
        meta: {
          title: 'Service Sales',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-item',
        name: ROUTE_NAMES.SERVICE_SALES_BY_ITEM,
        component: () => import('@/views/report-by-branch/ServiceSalesByItemView.vue'),
        meta: {
          title: 'Service Sales by Item',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-month',
        name: ROUTE_NAMES.SERVICE_SALES_BY_MONTH,
        component: () => import('@/views/report-by-branch/ServiceSalesByMonthView.vue'),
        meta: {
          title: 'Service Sales by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-sales-type',
        name: ROUTE_NAMES.SERVICE_SALES_BY_SALES_TYPE,
        component: () => import('@/views/report-by-branch/ServiceSalesBySalesTypeView.vue'),
        meta: {
          title: 'Service Sales by Sales Type',
          requiresAuth: true,
        },
      },
      {
        path: 'product-sales-by-item',
        name: ROUTE_NAMES.PRODUCT_SALES_BY_ITEM,
        component: () => import('@/views/report-by-branch/ProductSalesByItemView.vue'),
        meta: {
          title: 'Product Sales by Item',
          requiresAuth: true,
        },
      },
      {
        path: 'product-sales-by-month',
        name: ROUTE_NAMES.PRODUCT_SALES_BY_MONTH,
        component: () => import('@/views/report-by-branch/ProductSalesByMonthView.vue'),
        meta: {
          title: 'Product Sales by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-discount-category',
        name: ROUTE_NAMES.SALES_BY_DISCOUNT_CATEGORY,
        component: () => import('@/views/report-by-branch/SalesByDiscountCategoryView.vue'),
        meta: {
          title: 'Sales by Discount Category',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-repeat-clients',
        name: ROUTE_NAMES.SALES_BY_REPEAT_CLIENTS,
        component: () => import('@/views/report-by-branch/SalesByRepeatClientsView.vue'),
        meta: {
          title: 'Sales by Repeat Clients',
          requiresAuth: true,
        },
      },
      {
        path: 'prepaid-goods-repurchase',
        name: ROUTE_NAMES.PREPAID_GOODS_REPURCHASE,
        component: () => import('@/views/report-by-branch/PrepaidGoodsRepurchaseView.vue'),
        meta: {
          title: 'Prepaid Goods Repurchase',
          requiresAuth: true,
        },
      },

      // Clients Analysis
      {
        path: 'clients-summary',
        name: ROUTE_NAMES.CLIENTS_SUMMARY,
        component: () => import('@/views/report-by-branch/ClientsSummaryView.vue'),
        meta: {
          title: 'Clients Summary',
          requiresAuth: true,
        },
      },
      {
        path: 'clients-by-period',
        name: ROUTE_NAMES.CLIENTS_BY_PERIOD,
        component: () => import('@/views/report-by-branch/ClientsByPeriodView.vue'),
        meta: {
          title: 'Clients by Period',
          requiresAuth: true,
        },
      },
      {
        path: 'clients-by-type',
        name: ROUTE_NAMES.CLIENTS_BY_TYPE,
        component: () => import('@/views/report-by-branch/ClientsByTypeView.vue'),
        meta: {
          title: 'Clients by Type',
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-repeat',
        name: ROUTE_NAMES.NEW_CLIENTS_REPEAT,
        component: () => import('@/views/report-by-branch/NewClientsRepeatView.vue'),
        meta: {
          title: 'New Clients Repeat',
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-by-month',
        name: ROUTE_NAMES.NEW_CLIENTS_BY_MONTH,
        component: () => import('@/views/report-by-branch/NewClientsByMonthView.vue'),
        meta: {
          title: 'New Clients by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'recommended-clients-by-month',
        name: ROUTE_NAMES.RECOMMENDED_CLIENTS_BY_MONTH,
        component: () => import('@/views/report-by-branch/RecommendedClientsByMonthView.vue'),
        meta: {
          title: 'Recommended Clients by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-by-referral-source',
        name: ROUTE_NAMES.NEW_CLIENTS_BY_REFERRAL_SOURCE,
        component: () => import('@/views/report-by-branch/NewClientsByReferralSourceView.vue'),
        meta: {
          title: 'New Clients by Referral Source',
          requiresAuth: true,
        },
      },

      // Bookings Analysis
      {
        path: 'bookings-tally-details',
        name: ROUTE_NAMES.BOOKINGS_TALLY_DETAILS,
        component: () => import('@/views/report-by-branch/BookingsTallyDetailsView.vue'),
        meta: {
          title: 'Bookings Tally Details',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-date',
        name: ROUTE_NAMES.BOOKINGS_BY_DATE,
        component: () => import('@/views/report-by-branch/BookingsByDateView.vue'),
        meta: {
          title: 'Bookings by Date',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-month',
        name: ROUTE_NAMES.BOOKINGS_BY_MONTH,
        component: () => import('@/views/report-by-branch/BookingsByMonthView.vue'),
        meta: {
          title: 'Bookings by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-resource',
        name: ROUTE_NAMES.BOOKINGS_BY_RESOURCE,
        component: () => import('@/views/report-by-branch/BookingsByResourceView.vue'),
        meta: {
          title: 'Bookings by Resource',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-day-of-week',
        name: ROUTE_NAMES.BOOKINGS_BY_DAY_OF_WEEK,
        component: () => import('@/views/report-by-branch/BookingsByDayOfWeekView.vue'),
        meta: {
          title: 'Bookings by Day of Week',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-time',
        name: ROUTE_NAMES.BOOKINGS_BY_TIME,
        component: () => import('@/views/report-by-branch/BookingsByTimeView.vue'),
        meta: {
          title: 'Bookings by Time',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-source',
        name: ROUTE_NAMES.BOOKINGS_BY_SOURCE,
        component: () => import('@/views/report-by-branch/BookingsBySourceView.vue'),
        meta: {
          title: 'Bookings by Source',
          requiresAuth: true,
        },
      },
      {
        path: 'booking-ratio',
        name: ROUTE_NAMES.BOOKING_RATIO,
        component: () => import('@/views/report-by-branch/BookingRatioView.vue'),
        meta: {
          title: 'Booking Ratio',
          requiresAuth: true,
        },
      },
    ],
  },
]
