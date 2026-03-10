import type { RouteRecordRaw } from 'vue-router'

export const reportByBranchRoutes: RouteRecordRaw[] = [
  {
    path: 'report',
    name: 'report',
    meta: {
      title: 'Report',
      requiresAuth: true,
    },
    children: [
      {
        path: 'sales-by-date',
        name: 'sales-by-date',
        component: () => import('@/views/report-by-branch/report/SalesByDateView.vue'),
        meta: {
          title: 'Sales by Date',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-month',
        name: 'sales-by-month',
        component: () => import('@/views/report-by-branch/report/SalesByMonthView.vue'),
        meta: {
          title: 'Sales by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales',
        name: 'service-sales',
        component: () => import('@/views/report-by-branch/report/ServiceSalesView.vue'),
        meta: {
          title: 'Service Sales',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-item',
        name: 'service-sales-by-item',
        component: () => import('@/views/report-by-branch/report/ServiceSalesByItemView.vue'),
        meta: {
          title: 'Service Sales by Item',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-month',
        name: 'service-sales-by-month',
        component: () => import('@/views/report-by-branch/report/ServiceSalesByMonthView.vue'),
        meta: {
          title: 'Service Sales by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'service-sales-by-sales-type',
        name: 'service-sales-by-sales-type',
        component: () => import('@/views/report-by-branch/report/ServiceSalesBySalesTypeView.vue'),
        meta: {
          title: 'Service Sales by Sales Type',
          requiresAuth: true,
        },
      },
      {
        path: 'product-sales-by-item',
        name: 'product-sales-by-item',
        component: () => import('@/views/report-by-branch/report/ProductSalesByItemView.vue'),
        meta: {
          title: 'Product Sales by Item',
          requiresAuth: true,
        },
      },
      {
        path: 'product-sales-by-month',
        name: 'product-sales-by-month',
        component: () => import('@/views/report-by-branch/report/ProductSalesByMonthView.vue'),
        meta: {
          title: 'Product Sales by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-discount-category',
        name: 'sales-by-discount-category',
        component: () => import('@/views/report-by-branch/report/SalesByDiscountCategoryView.vue'),
        meta: {
          title: 'Sales by Discount Category',
          requiresAuth: true,
        },
      },
      {
        path: 'sales-by-repeat-clients',
        name: 'sales-by-repeat-clients',
        component: () => import('@/views/report-by-branch/report/SalesByRepeatClientsView.vue'),
        meta: {
          title: 'Sales by Repeat Clients',
          requiresAuth: true,
        },
      },
      {
        path: 'prepaid-goods-repurchase',
        name: 'prepaid-goods-repurchase',
        component: () => import('@/views/report-by-branch/report/PrepaidGoodsRepurchaseView.vue'),
        meta: {
          title: 'Prepaid Goods Repurchase',
          requiresAuth: true,
        },
      },
      {
        path: 'clients-summary',
        name: 'clients-summary',
        component: () => import('@/views/report-by-branch/report/ClientsSummaryView.vue'),
        meta: {
          title: 'Clients Summary',
          requiresAuth: true,
        },
      },
      {
        path: 'clients-by-period',
        name: 'clients-by-period',
        component: () => import('@/views/report-by-branch/report/ClientsByPeriodView.vue'),
        meta: {
          title: 'Clients by Period',
          requiresAuth: true,
        },
      },
      {
        path: 'clients-by-type',
        name: 'clients-by-type',
        component: () => import('@/views/report-by-branch/report/ClientsByTypeView.vue'),
        meta: {
          title: 'Clients by Type',
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-repeat',
        name: 'new-clients-repeat',
        component: () => import('@/views/report-by-branch/report/NewClientsRepeatView.vue'),
        meta: {
          title: 'New Clients Repeat',
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-by-month',
        name: 'new-clients-by-month',
        component: () => import('@/views/report-by-branch/report/NewClientsByMonthView.vue'),
        meta: {
          title: 'New Clients by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'recommended-clients-by-month',
        name: 'recommended-clients-by-month',
        component: () => import('@/views/report-by-branch/report/RecommendedClientsByMonthView.vue'),
        meta: {
          title: 'Recommended Clients by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'new-clients-by-referral-source',
        name: 'new-clients-by-referral-source',
        component: () => import('@/views/report-by-branch/report/NewClientsByReferralSourceView.vue'),
        meta: {
          title: 'New Clients by Referral Source',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-tally-details',
        name: 'bookings-tally-details',
        component: () => import('@/views/report-by-branch/report/BookingsTallyDetailsView.vue'),
        meta: {
          title: 'Bookings Tally Details',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-date',
        name: 'bookings-by-date',
        component: () => import('@/views/report-by-branch/report/BookingsByDateView.vue'),
        meta: {
          title: 'Bookings by Date',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-month',
        name: 'bookings-by-month',
        component: () => import('@/views/report-by-branch/report/BookingsByMonthView.vue'),
        meta: {
          title: 'Bookings by Month',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-resource',
        name: 'bookings-by-resource',
        component: () => import('@/views/report-by-branch/report/BookingsByResourceView.vue'),
        meta: {
          title: 'Bookings by Resource',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-day-of-week',
        name: 'bookings-by-day-of-week',
        component: () => import('@/views/report-by-branch/report/BookingsByDayOfWeekView.vue'),
        meta: {
          title: 'Bookings by Day of Week',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-time',
        name: 'bookings-by-time',
        component: () => import('@/views/report-by-branch/report/BookingsByTimeView.vue'),
        meta: {
          title: 'Bookings by Time',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings-by-source',
        name: 'bookings-by-source',
        component: () => import('@/views/report-by-branch/report/BookingsBySourceView.vue'),
        meta: {
          title: 'Bookings by Source',
          requiresAuth: true,
        },
      },
      {
        path: 'booking-ratio',
        name: 'booking-ratio',
        component: () => import('@/views/report-by-branch/report/BookingRatioView.vue'),
        meta: {
          title: 'Booking Ratio',
          requiresAuth: true,
        },
      },
    ],
  },
]
