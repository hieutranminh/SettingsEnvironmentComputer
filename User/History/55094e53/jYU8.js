// Utils
import { handleLoadingChunksFailed } from './index.js'

// Constants
import { sales_options } from 'Options/sales-options'

const reportRoutes = [
  {
    path:     '/report',
    redirect: { name: 'report-menu' },
  },
  {
    path:      '/report/menu',
    name:      'report-menu',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-menu/report-menu.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/operational-trend-analysis',
    name:      'report-operational-trend-analysis',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-operational-trend-analysis/report-operational-trend-analysis.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/sales-by-date',
    name:      'report-sales-by-date',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-sales-by-date/report-sales-by-date.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/sales-by-month',
    name:      'report-sales-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-sales-by-month/report-sales-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/staff-sales-by-month',
    name:      'report-staff-sales-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-staff-sales-by-month/report-staff-sales-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/service-sales',
    name:      'report-service-sales',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-service-sales/report-service-sales.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/service-sales-by-item',
    name:      'report-service-sales-by-item',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-service-sales-by-item/report-service-sales-by-item.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/service-sales-by-month',
    name:      'report-service-sales-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-service-sales-by-month/report-service-sales-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/service-sales-by-sales-type',
    name:      'report-service-sales-by-sales-type',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-service-sales-by-sales-type/report-service-sales-by-sales-type.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/product-sales-by-item',
    name:      'report-product-sales-by-item',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-product-sales-by-item/report-product-sales-by-item.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/product-sales-by-month',
    name:      'report-product-sales-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-product-sales-by-month/report-product-sales-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/sales-by-discount-category',
    name:      'report-sales-by-discount-category',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-sales-by-discount-category/report-sales-by-discount-category.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/sales-by-repeat-clients',
    name:      'report-sales-by-repeat-clients',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-sales-by-repeat-clients/report-sales-by-repeat-clients.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/prepaid-goods-repurchase',
    name:      'report-prepaid-goods-repurchase',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-prepaid-goods-repurchase/report-prepaid-goods-repurchase.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/income-statement',
    name:      'report-income-statement',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-income-statement/report-income-statement.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/clients-summary',
    name:      'report-clients-summary',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-clients-summary/report-clients-summary.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/clients-by-period',
    name:      'report-clients-by-period',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-clients-by-period/report-clients-by-period.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/clients-by-type',
    name:      'report-clients-by-type',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-clients-by-type/report-clients-by-type.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/new-clients-repeat',
    name:      'report-new-clients-repeat',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-new-clients-repeat/report-new-clients-repeat.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/new-clients-by-month',
    name:      'report-new-clients-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-new-clients-by-month/report-new-clients-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/recommended-clients-by-month',
    name:      'report-recommended-clients-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-recommended-clients-by-month/report-recommended-clients-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/new-clients-by-referral-source',
    name:      'report-new-clients-by-referral-source',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-new-clients-by-referral-source/report-new-clients-by-referral-source.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/detailed-analysis-of-bookings',
    name:      'report-detailed-analysis-of-bookings',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-detailed-analysis-of-bookings/report-detailed-analysis-of-bookings.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },

  {
    path:      '/report/report-booking-by-resource',
    name:      'report-booking-by-resource',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-booking-by-resource/report-booking-by-resource.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },

  {
    path:      '/report/report-booking-by-date-of-week',
    name:      'report-booking-by-date-of-week',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-booking-by-date-of-week/report-booking-by-date-of-week.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },

  {
    path:      '/report/report-booking-by-time',
    name:      'report-booking-by-time',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-booking-by-time/report-booking-by-time.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },

  {
    path:      '/report/report-booking-by-source',
    name:      'report-booking-by-source',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-booking-by-source/report-booking-by-source.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },

  {
    path:      '/report/report-tally-bookings',
    name:      'report-tally-bookings',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-tally-booking/report-tally-booking.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/bookings-by-date',
    name:      'report-bookings-by-date',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-bookings-by-date/report-bookings-by-date.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/bookings-by-month',
    name:      'report-bookings-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-bookings-by-month/report-bookings-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/booking-ratio',
    name:      'report-bookings-ratio',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-booking-ratio/report-booking-ratio.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/report-utilization-rate',
    name:      'report-utilization-rate',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-utilization-rate/report-utilization-rate.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/report/prepaid-cards-by-client',
    name:      'report-prepaid-cards-by-client',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-prepaid-cards-by-client/report-prepaid-cards-by-client.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
  {
    path:      '/report/prepaid-card-summary',
    name:      'report-prepaid-card-summary',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-prepaid-card-summary/report-prepaid-card-summary.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
  {
    path:      '/report/prepaid-services-by-client',
    name:      'report-prepaid-services-by-client',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-prepaid-services-by-client/report-prepaid-services-by-client.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
  {
    path:      '/report/prepaid-service-summary',
    name:      'report-prepaid-service-summary',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-prepaid-service-summary/report-prepaid-service-summary.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
  {
    path:      '/report/loyalty-points-by-client',
    name:      'report-loyalty-points-by-client',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-loyalty-points-by-client/report-loyalty-points-by-client.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
  {
    path:      '/report/prepaid-goods-expired-balance',
    name:      'report-prepaid-goods-expired-balance',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-prepaid-goods-expired-balance/report-prepaid-goods-expired-balance.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
  {
    path:      '/report/expired-balance-by-month',
    name:      'report-expired-balance-by-month',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/report/report-expired-balance-by-month/report-expired-balance-by-month.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload:          true,
      notExistMenuCode: true,
      level:            sales_options.security_level_enum.master,
    },
  },
]

export default reportRoutes
