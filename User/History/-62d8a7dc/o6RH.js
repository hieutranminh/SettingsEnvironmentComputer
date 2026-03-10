// Utils
import redirect from './redirect'
import goodsRoutes from './goods-routes'
import salesRoutes from './sales-routes'
import setupRoutes from './setup-routes'
import reportRoutes from './report-routes'
import staffsRoutes from './staffs-routes'
import clientsRoutes from './clients-routes'
import accountRoutes from './account-routes'
import supportRoutes from './support-routes'
import calendarRoutes from './calendar-routes'
import messagesRoutes from './messages-routes'
import inventoryRoutes from './inventory-routes'
import expenditureRoutes from './expenditure-routes'

// Store
import store from 'Store/store'

const routes = [
  {
    path:      '/login',
    name:      'login',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common/login/login.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/login-d',
    name:      'login-d',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common/login-d/login-d.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/sign-consent-form',
    name:      'sign-consent-form',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Modules/consent/components/sign-consent-form/sign-consent-form.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
      public:  true,
    },
  },
  {
    path:      '/signature',
    name:      'signature',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Modules/consent/components/signature/signature.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
      public:  true,
    },
  },
  {
    path:      '/alert-result',
    name:      'alert-result',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Modules/consent/components/alert-result-modal/alert-result-modal.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
      public:  true,
    },
  },
  {
    path:      '/logout',
    name:      'logout',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common/logout/logout.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/find-login-info/:type/:country',
    name:      'find-login-info',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common/find-login-info/find-login-info.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/payments',
    name:      'payments',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/account/payments/payments/payments.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/payment-iamport',
    name:      'payment-iamport',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/account/payment-iamport/payment-iamport.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/extension-expiry-date',
    name:      'extension-expiry-date',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/account/extension-expiry-date/extension-expiry-date.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/auto-transfer-ars',
    name:      'auto-transfer-ars',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/account/payments/auto-transfer-ars/auto-transfer-ars.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/virtual-account-result',
    name:      'virtual-account-result',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/account/virtual-account-result/virtual-account-result.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/netmoney-history',
    name:      'netmoney-history',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/account/netmoney-history/netmoney-history.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
    },
  },
  {
    path:      '/sales-statement',
    name:      'sales-statement',
    component: () => import('Pages/sales-statement/view-sales-statement.vue').catch(handleLoadingChunksFailed),
    meta:      {
      preload: true,
      public:  true,
    },
  },
  // eslint-disable-next-line no-undef
  ...(process.env.NODE_ENV === 'local' ? [{
    path:      '/common-design-system',
    name:      'common-design-system',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common-design-system/common-design-system.vue').catch(handleLoadingChunksFailed),
  }] : []),
  {
    path:      '/',
    component: () => import(/* webpackChunkName: "view-[request]" */ 'Modules/authentication/components/authentication-container.vue').catch(handleLoadingChunksFailed),
    children:  [
      {
        path:      '/',
        name:      'home',
        component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common/home/home.vue').catch(handleLoadingChunksFailed),
        meta:      {
          preload: true,
        },
      },

      ...goodsRoutes,
      ...salesRoutes,
      ...setupRoutes,
      ...reportRoutes,
      ...staffsRoutes,
      ...supportRoutes,
      ...clientsRoutes,
      ...accountRoutes,
      ...calendarRoutes,
      ...messagesRoutes,
      ...inventoryRoutes,
      ...expenditureRoutes,
      ...redirect,
      {
        path:      '*',
        name:      'not-found',
        component: () => import(/* webpackChunkName: "view-[request]" */ 'Pages/common/not-found/not-found.vue').catch(handleLoadingChunksFailed),
        meta:      {
          preload: true,
        },
      },
    ],
  },
]

export function handleLoadingChunksFailed(error) {
  // Log error for debugging
  console.error('[Router] Failed to load chunk:', error)

  // Check if it's a chunk loading error (common in Edge on first load)
  if (error && (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk'))) {
    // Try to reload the page once
    const hasReloaded = sessionStorage.getItem('chunkLoadErrorReloaded')
    if (!hasReloaded) {
      sessionStorage.setItem('chunkLoadErrorReloaded', 'true')
      window.location.reload()
      return
    }
    sessionStorage.removeItem('chunkLoadErrorReloaded')
  }

  store.dispatch('app/checkAppVersionByFile')
}

export default routes
