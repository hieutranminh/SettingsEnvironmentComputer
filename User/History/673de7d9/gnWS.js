import { isPermittedBySetupRole } from 'CommonHelpers'
import { getAllCalendarSetupCache } from 'Modules/cache/utils/booking'
import vue from 'vue'
import vue_router from 'vue-router'

// Constants
import { sales_options } from 'Options/sales-options'

// Store
import store from '../store/store'

vue.use(vue_router)

export const routes = {
  // goods
  products:           { group: 'goods', name: 'products', path: '/products' },
  product_categories: { group: 'goods', name: 'product-categories', path: '/product-categories' },
  prepaid_cards:      { group: 'goods', name: 'prepaid-cards', path: '/prepaid-cards' },
  services:           { group: 'goods', name: 'services', path: '/services' },
  packages:           { group: 'goods', name: 'packages', path: '/packages' },

  // bookings
  calendar:              { group: 'bookings', name: 'calendar', path: '/calendar' },
  booking_opening_hours: {
    group: 'bookings',
    name:  'booking-opening-hours',
    path:  '/booking-opening-hours',
    meta:  { not_exist_menu_code: true, level: sales_options.security_level_enum.manager_or_higher },
  },
  booking_resources: {
    group: 'bookings',
    name:  'booking-resources',
    path:  '/booking-resources',
    meta:  { not_exist_menu_code: true, level: sales_options.security_level_enum.manager_or_higher },
  },
  booking_items: {
    group: 'bookings',
    name:  'booking-items',
    path:  '/booking-items',
    meta:  { not_exist_menu_code: true, level: sales_options.security_level_enum.manager_or_higher },
  },
  booking_calendar_settings: {
    group: 'bookings',
    name:  'booking-calendar-settings',
    path:  '/booking-calendar-settings',
    meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.manager_or_higher,
    },
  },
  // booking_online_booking_settings: {
  //   group: 'bookings',
  //   name: 'booking-online-booking-settings',
  //   path: '/booking-online-booking-settings',
  //   meta: {
  //     not_exist_menu_code: true,
  //     level: sales_options.security_level_enum.manager_or_higher
  //   }
  // },
  naver_link_settings: {
    group: 'bookings',
    name:  'naver-link-settings',
    path:  '/naver-link-settings',
    meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.manager_or_higher,
    },
    children: {
      naver_resource_link_settings: {
        group: 'bookings',
        title: 'naver-resource-link-settings.resource-link',
        name:  'naver-resource-link-settings',
        path:  '/naver-link-settings/naver-resource-link-settings',
        meta:  {
          not_exist_menu_code: true,
          level:               sales_options.security_level_enum.manager_or_higher,
        },
      },
      naver_each_service_link_settings: {
        group: 'bookings',
        title: 'naver-each-service-link-settings.link-each-service',
        name:  'naver-each-service-link-settings',
        path:  '/naver-link-settings/naver-each-service-link-settings',
        meta:  {
          not_exist_menu_code: true,
          level:               sales_options.security_level_enum.manager_or_higher,
        },
      },
      // This section is DEPRECATED on R48 https://gitlab.com/aha.software.2018/aha-testing/-/issues/1625
      // naver_link_all_services_at_once_settings: {
      //   group: 'bookings',
      //   title: 'naver-link-all-services-at-once-settings.link-all-services-at-once',
      //   name: 'naver-link-all-services-at-once-settings',
      //   path: '/naver-link-settings/naver-link-all-services-at-once-settings',
      //   meta: {
      //     not_exist_menu_code: true,
      //     level: sales_options.security_level_enum.manager_or_higher
      //   }
      // },
    },
  },

  // sales
  sales:                          { group: 'sales', name: 'sales', path: '/sales' },
  client_sales:                   { group: 'sales', name: 'client-sales', path: '/client-sales' },
  outstanding_by_clients:         { group: 'sales', name: 'outstanding-by-clients', path: '/outstanding-by-clients' },
  outstanding_collection_history: { group: 'sales', name: 'outstanding-collection-history', path: '/outstanding-collection-history' },
  outstanding_edit_history:       { group: 'sales', name: 'outstanding-edit-history', path: '/outstanding-edit-history' },
  balance_point_edit_history:     { group: 'sales', name: 'balance-point-edit-history', path: '/balance-point-edit-history' },
  sales_edit_delete_history:      { group: 'sales', name: 'sales-edit-delete-history', path: '/sales-edit-delete-history' },
  sales_history:                  { group: 'sales', name: 'sales-history', path: '/sales-history' },

  sales_total: { group: 'sales', name: 'sales-total', path: '/sales-total'},

  sales_by_staff: { group: 'sales', name: 'sales-by-staff', path: '/sales-by-staff' },

  sales_by_item: { group: 'sales', name: 'sales-by-item', path: '/sales-by-item' },

  // inventory
  suppliers:                { group: 'inventory', name: 'suppliers', path: '/suppliers' },
  receivings:               { group: 'inventory', name: 'receivings', path: '/receivings' },
  add_internal_use:         { group: 'inventory', name: 'add-internal-use', path: '/add-internal-use' },
  stock_internal_use:       { group: 'inventory', name: 'stock-internal-use', path: '/stock-internal-use' },
  stock_adjustment:         { group: 'inventory', name: 'stock-adjustment', path: '/stock-adjustment' },
  stock_adjustment_history: { group: 'inventory', name: 'stock-adjustment-history', path: '/stock-adjustment-history' },
  stock_history:            { group: 'inventory', name: 'stock-history', path: '/stock-history' },
  stock_status:             { group: 'inventory', name: 'stock-status', path: '/stock-status' },

  // expenditure
  expenditure_history: { group: 'expenditure', name: 'expenditure-history', path: '/expenditure-history' },
  expenditure_summary: { group: 'expenditure', name: 'expenditure-summary', path: '/expenditure-summary' },
  expenditure_items:   { group: 'expenditure', name: 'expenditure-items', path: '/expenditure-items' },

  // REPORT
  report_menu: { group: 'report', name: 'report-menu', path: '/report-menu' },

  // Report AI
  report_comprehensive_analysis:     { group: 'report', name: 'report-comprehensive-analysis', path: '/report-comprehensive-analysis' },
  report_staff_performance_analysis: { group: 'report', name: 'report-staff-performance-analysis', path: '/report-staff-performance-analysis' },
  report_operational_trend_analysis: { group: 'report', name: 'report-operational-trend-analysis', path: '/report-operational-trend-analysis' },

  // report sales analysis
  report_sales_by_date:               { group: 'report', name: 'report-sales-by-date', path: '/report-sales-by-date' },
  report_sales_by_month:              { group: 'report', name: 'report-sales-by-month', path: '/report-sales-by-month' },
  report_staff_sales_by_month:        { group: 'report', name: 'report-staff-sales-by-month', path: '/staff-sales-by-month' },
  report_service_sales:               { group: 'report', name: 'report-service-sales', path: '/report-service-sales' },
  report_service_sales_by_item:       { group: 'report', name: 'report-service-sales-by-item', path: '/report-service-sales-by-item' },
  report_service_sales_by_month:      { group: 'report', name: 'report-service-sales-by-month', path: '/report-service-sales-by-month' },
  report_service_sales_by_sales_type: {
    group: 'report', name: 'report-service-sales-by-sales-type', path: '/report-service-sales-by-sales-type',
  },
  report_product_sales_by_item:      { group: 'report', name: 'report-product-sales-by-item', path: '/report-product-sales-by-item' },
  report_product_sales_by_month:     { group: 'report', name: 'report-product-sales-by-month', path: '/report-product-sales-by-month' },
  report_sales_by_discount_category: { group: 'report', name: 'report-sales-by-discount-category', path: '/report-sales-by-discount-category' },
  report_sales_by_repeat_clients:    { group: 'report', name: 'report-sales-by-repeat-clients', path: '/report-sales-by-repeat-clients' },
  report_income_statement:           { group: 'report', name: 'report-income-statement', path: '/report-income-statement' },

  // report client analysis
  report_clients_summary:              { group: 'report', name: 'report-clients-summary', path: '/report-clients-summary' },
  report_clients_by_period:            { group: 'report', name: 'report-clients-by-period', path: '/report-clients-by-period' },
  report_clients_by_type:              { group: 'report', name: 'report-clients-by-type', path: '/report-clients-by-type' },
  report_new_clients_repeat:           { group: 'report', name: 'report-new-clients-repeat', path: '/report-new-clients-repeat' },
  report_new_clients_by_month:         { group: 'report', name: 'report-new-clients-by-month', path: '/report-new-clients-by-month' },
  report_recommended_clients_by_month: {
    group: 'report',
    name:  'report-recommended-clients-by-month',
    path:  '/report-recommended-clients-by-month',
  },
  report_new_clients_by_referral_source: {
    group: 'report',
    name:  'report-new-clients-by-referral-source',
    path:  '/report-new-clients-by-referral-source',
  },

  // report booking analysis
  report_detailed_analysis_of_bookings: {
    group: 'report',
    name:  'report-detailed-analysis-of-bookings',
    path:  '/report-detailed-analysis-of-bookings',
  },
  report_bookings_by_date:  { group: 'report', name: 'report-bookings-by-date', path: '/report-bookings-by-date' },
  report_bookings_by_month: { group: 'report', name: 'report-bookings-by-month', path: '/report-bookings-by-month' },

  // report prepaid goods and points
  report_prepaid_cards_by_client: {
    group: 'report', name:  'report-prepaid-cards-by-client', path:  '/report-prepaid-cards-by-client', meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.master,
    },
  },
  report_prepaid_card_summary: {
    group: 'report', name:  'report-prepaid-card-summary', path:  '/report-prepaid-card-summary', meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.master,
    },
  },
  report_prepaid_services_by_client: {
    group: 'report', name:  'report-prepaid-services-by-client', path:  '/report-prepaid-services-by-client', meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.master,
    },
  },
  report_loyalty_points_by_client: {
    group: 'report', name:  'report-loyalty-points-by-client', path:  '/report-loyalty-points-by-client', meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.master,
    },
  },

  // staffs
  staff_goal_management: { group: 'staffs', name: 'staff-goal-management', path: '/staff-goal-management' },
  staff_goal_setup:      { group: 'staffs', name: 'staff-goal-setup', path: '/staff-goal-setup' },
  payroll_statement:     { group: 'staffs', name: 'payroll-statement', path: '/payroll-statement' },
  payroll_setup:         { group: 'staffs', name: 'payroll-setup', path: '/payroll-setup' },
  incentives_by_staff:   { group: 'staffs', name: 'incentives-by-staff', path: '/incentives-by-staff' },
  staffs:                { group: 'staffs', name: 'staffs', path: '/staffs' },
  time_clock:            { group: 'staffs', name: 'time-clock', path: '/time-clock' },
  days_worked:           { group: 'staffs', name: 'days-worked', path: '/days-worked' },

  // clients
  clients:            { group: 'clients', name: 'clients', path: '/clients' },
  duplicated_clients: { group: 'clients', name: 'duplicated-clients', path: '/duplicated-clients' },
  deleted_clients:    { group: 'clients', name: 'deleted-clients', path: '/deleted-clients' },
  client_management:  { group: 'clients', name: 'client-management', path: '/client-management' },

  // campaigns
  // campaign_management:  { group: 'campaigns', name: 'campaign-management'},
  // campaign_report:      { group: 'campaigns', name: 'campaign-report', param: 'id' },

  //setup
  misc_codes:           { group: 'setup', name: 'misc-codes', path: '/misc-codes' },
  loyalty_points_setup: { group: 'setup', name: 'loyalty-points-setup', path: '/loyalty-points-setup' },
  environment_setup:    { group: 'setup', name: 'environment-setup', path: '/environment-setup' },
  cid_setup:            { group: 'setup', name: 'cid-setup', path: '/cid-setup' },
  cid_history:          {
    group: 'setup', name:  'cid-history', path:  '/cid-history', meta:  {
      not_exist_menu_code: true,
      level:               sales_options.security_level_enum.staff_or_higher,
    },
  },
  cid_receive_call_popup: { group: 'setup', name: 'cid-receive-call-popup', path: '/cid-receive-call-popup' },

  // account
  //user_account:              { group: 'account', name: 'user-account'},
  shop_information: { group: 'account', name: 'shop-information', path: '/shop-information' },
  user_accounts:    { group: 'account', name: 'user-accounts', path: '/user-accounts' },
  login_histories:  { group: 'account', name: 'login-histories', path: '/login-histories' },

  //account>payments
  payments:               { group: 'account/payments', name: 'payments', path: '/payments' },
  depositless_payment:    { group: 'account/payments', name: 'depositless-payment', path: '/depositless-payment' },
  automatic_transfer:     { group: 'account/payments', name: 'automatic-transfer', path: '/automatic-transfer' },
  kakao_pay:              { group: 'account/payments', name: 'kakao-pay', path: '/kakao-pay' },
  payment_date_extension: {
    group: 'account/payments',
    name:  'payment-date-extension',
    path:  '/payment-date-extension',
  },
  auto_transfer_ars: { group: 'account/payments', name: 'auto-transfer-ars', path: '/auto-transfer-ars' },

  payment_history:        { group: 'account', name: 'payment-history', path: '/payment-history' },
  payment_iamport:        { group: 'account', name: 'payment-iamport', path: '/payment-iamport' },
  virtual_account_result: { group: 'account', name: 'virtual-account-result', path: '/virtual-account-result' },
  netmoney_history:       { group: 'account', name: 'netmoney-history', path: '/netmoney-history' },
  extension_expiry_date:  { group: 'account', name: 'extension-expiry-date', path: '/extension-expiry-date' },

  // support
  boards:       { group: 'support', name: 'boards', path: '/boards/:type' },
  board_view:   { group: 'support', name: 'board-view', path: '/board-view/:board_code' },
  board_action: { group: 'support', name: 'board-action', path: '/board-action/:board_code' },
  manuals:      { group: 'support', name: 'manuals', path: '/manuals' },
  popup_view:   { group: 'support', name: 'popup-view', path: '/popup-view' },

  // messages
  message_sender_numbers:       { group: 'messages', name: 'message-sender-numbers', path: '/message-sender-numbers' },
  message_sender_number_add:    { group: 'messages', name: 'message-sender-number-add', path: '/message-sender-number-add' },
  message_sender_numbers_guide: { group: 'messages', name: 'message-sender-numbers-guide', path: '/message-sender-numbers-guide' },
  spam_info_popup:              { group: 'messages', name: 'spam-info-popup', path: '/spam-info-popup' },
  alimtalk_setup:               { group: 'messages', name: 'alimtalk-setup', path: '/alimtalk-setup' },

  text_unsubscribe_histories: { group: 'messages', name: 'text-unsubscribe-histories', path: '/text-unsubscribe-histories' },

  _calendar: { group: 'calendar', name: '_calendar', path: '/_calendar' },

  // common
  //login
  find_login_info: { group: 'common', name: 'find-login-info', path: '/find-login-info/:type/:country' },
  login:           { group: 'common', name: 'login', path: '/login' },
  login_d:         { group: 'common', name: 'login-d', path: '/login-d' },
  logout:          { group: 'common', name: 'logout', path: '/logout' },
  home:            { group: 'common', name: 'home', path: '/' },
  not_found:       { group: 'common', name: 'not-found', path: '*' },
}

const router = new vue_router({
  routes: loadRoutes(routes),
  scrollBehavior() {
    document.getElementById('app').scrollIntoView()
  },
})

function loadRoutes(routes) {
  return Object.values(routes).map(function (route) {
    return {
      path:      route.path,
      name:      route.name,
      component: loadPage(route),
      meta:      {
        preload: true,
        ...route.meta && { ...route.meta },
      },
      redirect: route.redirect,
      children: route?.children && loadRoutes(Object.values(route?.children || {})),
    }
  })
}

// utils function
function loadPage(route) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `../pages/${route.group}/${route.name}/${route.name}`).catch(handleLoadingChunksFailed)
}

function handleLoadingChunksFailed() {
  store.dispatch('app/checkAppVersionByFile')
}

function setIsLoadingInStore(is_loading) {
  store.dispatch('alert/setIsLoadingData', is_loading)
}

// navigation guards', menu/userRoles)
const spinner = document.getElementsByClassName('v-spinner')

let isSetUserLogined = false
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login-d') {
    await store.dispatch('user/logout')
  }

  if (!isSetUserLogined) {
    if (store?.state?.user?.user?.user_id) {
      store.commit('user/setLoggedIn', true)
    }
    isSetUserLogined = true
  }

  next()
})

router.beforeEach(async (to, from, next) => {
  // preLoader on
  if (spinner.length > 0 && to.meta.preload) {
    to.meta.preload = false
    setIsLoadingInStore(true)
  }

  if (to.params.expired) {
    next()
  } else {
    // check login
    if ([routes.login.name, routes.logout.name, routes.find_login_info.name, routes.login_d.name].includes(to.name)) {
      next()
    } else {
      const logged_in = store.state.user.logged_in
      if (logged_in) {
        if (isRoutePermited(to)) next()
        else {
          next('not-found')
          setIsLoadingInStore(false)
        }
      } else {
        next({ name: routes.logout.name })
        setIsLoadingInStore(false)
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.name === 'calendar') {
    const shopId = store.state.user.shop.shop_id
    getAllCalendarSetupCache({ shopId })
  }

  next()
})

// Routes > Menus >= MenuPermission
function isRoutePermited(to) {
  let isPermited = false

  if (to.name && to.name.length > 0) {
    if (to.name == 'not-found') isPermited = true
    else {
      const menuFlatItems = store.getters['menu/flatItems']
      const menuUserRoles = store.state.menu.userRoles

      const routeMatch = menuFlatItems.find(({ link }) => link ===`/${to.name}`)

      if (routeMatch) isPermited = menuUserRoles.includes(routeMatch.code)
      if (!routeMatch) isPermited = true // because some routes not in menu or menu-permission. ex: /home, /sales, /booking-opening-hours...

      if (to.meta.not_exist_menu_code) {
        isPermited = isPermittedBySetupRole(to.meta.level)
      }
    }
  }

  return isPermited
}

router.afterEach(() => {
  setIsLoadingInStore(false)
})

export default router
