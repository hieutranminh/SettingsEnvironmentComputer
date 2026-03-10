// Route Names Constants
// This file contains all route names used throughout the application

// Home Routes
export const HOME_ROUTES = {
  HOME: 'home',
  DEVICE_TEST: 'device-test',
} as const

// Account Routes
export const ACCOUNT_ROUTES = {
  ID_MANAGEMENT: 'id-management',
  LOGIN_HISTORIES: 'login-histories',
  SUBSCRIBER_INFORMATION: 'subscriber-information',
} as const

// Payment Routes
export const PAYMENT_ROUTES = {
  PAYMENT: 'payment',
  PAYMENT_HISTORY: 'payment-history',
  NETMONEY_HISTORY: 'netmoney-history',
  EXTENSION_EXPIRY_DATE: 'extension-expiry-date',
} as const

// Branch Routes
export const BRANCH_ROUTES = {
  BRANCH_SALES: 'branch-sales',
  BRANCH_PREPAID_GOODS: 'branch-prepaid-goods',
  SALES_TOTAL_BY_BRANCH: 'sales-total-by-branch',
  SALES_TOTAL: 'sales-total',
  SALES_BY_STAFF: 'sales-by-staff',
  SALES_BY_ITEM: 'sales-by-item',
  BRANCHES: 'branches',
} as const

// Report by Branch Routes
export const REPORT_BY_BRANCH_ROUTES = {
  REPORT: 'report',
  REPORT_BY_BRANCH: 'report-by-branch',
  SALES_BY_DATE: 'sales-by-date',
  SALES_BY_MONTH: 'sales-by-month',
  SERVICE_SALES: 'service-sales',
  SERVICE_SALES_BY_ITEM: 'service-sales-by-item',
  SERVICE_SALES_BY_MONTH: 'service-sales-by-month',
  SERVICE_SALES_BY_SALES_TYPE: 'service-sales-by-sales-type',
  PRODUCT_SALES_BY_ITEM: 'product-sales-by-item',
  PRODUCT_SALES_BY_MONTH: 'product-sales-by-month',
  SALES_BY_DISCOUNT_CATEGORY: 'sales-by-discount-category',
  SALES_BY_REPEAT_CLIENTS: 'sales-by-repeat-clients',
  PREPAID_GOODS_REPURCHASE: 'prepaid-goods-repurchase',
  CLIENTS_SUMMARY: 'clients-summary',
  CLIENTS_BY_PERIOD: 'clients-by-period',
  CLIENTS_BY_TYPE: 'clients-by-type',
  NEW_CLIENTS_REPEAT: 'new-clients-repeat',
  NEW_CLIENTS_BY_MONTH: 'new-clients-by-month',
  RECOMMENDED_CLIENTS_BY_MONTH: 'recommended-clients-by-month',
  NEW_CLIENTS_BY_REFERRAL_SOURCE: 'new-clients-by-referral-source',
  BOOKINGS_TALLY_DETAILS: 'bookings-tally-details',
  BOOKINGS_BY_DATE: 'bookings-by-date',
  BOOKINGS_BY_MONTH: 'bookings-by-month',
  BOOKINGS_BY_RESOURCE: 'bookings-by-resource',
  BOOKINGS_BY_DAY_OF_WEEK: 'bookings-by-day-of-week',
  BOOKINGS_BY_TIME: 'bookings-by-time',
  BOOKINGS_BY_SOURCE: 'bookings-by-source',
  BOOKING_RATIO: 'booking-ratio',
} as const

// Goods Routes
export const GOODS_ROUTES = {
  GOODS: 'goods',
  SERVICES: 'services',
  PREPAID_CARDS: 'prepaid-cards',
  PACKAGES: 'packages',
  PRODUCTS: 'products',
  PRODUCT_CATEGORIES: 'product-categories',
} as const

// Setup Routes
export const SETUP_ROUTES = {
  SETUP_CHAIN_LOGO: 'setup-chain-logo',
} as const

// Board Routes
export const BOARD_ROUTES = {
  // Headquarter Notice
  HEADQUARTER_NOTICE: 'headquarter-notice',
  HEADQUARTER_NOTICE_INDEX: 'headquarter-notice-index',
  HEADQUARTER_NOTICE_ADD: 'headquarter-notice-add',
  HEADQUARTER_NOTICE_DETAIL: 'headquarter-notice-detail',
  HEADQUARTER_NOTICE_EDIT: 'headquarter-notice-edit',

  // Branch Board
  BRANCH_BOARD: 'branch-board',
  BRANCH_BOARD_INDEX: 'branch-board-index',
  BRANCH_BOARD_ADD: 'branch-board-add',
  BRANCH_BOARD_DETAIL: 'branch-board-detail',
  BRANCH_BOARD_EDIT: 'branch-board-edit',

  // Popups
  POPUPS: 'popups',
  POPUPS_INDEX: 'popups-index',
  POPUPS_ADD: 'popups-add',
  POPUPS_DETAIL: 'popups-detail',
  POPUPS_EDIT: 'popups-edit',

  // Ahasoft Notice
  AHASOFT_NOTICE: 'ahasoft-notice',
  AHASOFT_NOTICE_DETAIL: 'ahasoft-notice-detail',
} as const

// User Routes (from existing user.routes.ts)
export const USER_ROUTES = {
  USERS: 'users',
  USER_DETAIL: 'user-detail',
  PROFILE: 'profile',
} as const

// Auth Routes (commented out in router but included for completeness)
export const AUTH_ROUTES = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
} as const

// Combined route names for easy access
export const ROUTE_NAMES = {
  ...HOME_ROUTES,
  ...ACCOUNT_ROUTES,
  ...PAYMENT_ROUTES,
  ...BRANCH_ROUTES,
  ...REPORT_BY_BRANCH_ROUTES,
  ...GOODS_ROUTES,
  ...SETUP_ROUTES,
  ...BOARD_ROUTES,
  ...USER_ROUTES,
  ...AUTH_ROUTES,
} as const

// Type for route names
export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
