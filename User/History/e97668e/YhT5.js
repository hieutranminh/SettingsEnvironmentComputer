// Vue Package
import vue from 'vue'
import app from './app.vue'
import 'jspdf/dist/polyfills.es.js'
import router from 'Modules/router'
import store from './store/store.js'
import vueCookies from 'vue-cookies'
import i18n from './translate/translate.js'

// Components
import AIcon from 'Modules/aha/a-icon/a-icon.vue'
import AhaButton from 'CommonComponents/aha-button/aha-button.vue'
// import { MOBILE_MAX_WIDTH } from 'Constant'
// Plugins
import Filters from './plugins/Filters'
import EventBus from './plugins/EventBus'
import Bootstrap from './plugins/Bootstrap'
import TouchOnce from './plugins/TouchOnce'
import Directives from './plugins/Directives'
import SignalR from 'Modules/signal-r/plugins/SignalR' 
import ObserverIntersect from './plugins/ObserverIntersect'
import AuthenticationPlugin from 'Modules/authentication/plugins/authentication'
import VueSignaturePad from 'vue-signature-pad'

// Resgister app plugins
vue.use(SignalR)
vue.use(Filters)
vue.use(EventBus)
vue.use(Bootstrap)
vue.use(TouchOnce)
vue.use(Directives)
vue.use(VueSignaturePad)
vue.use(ObserverIntersect)
vue.use(SignalR, { module: 'signalR' })

vue.use(AuthenticationPlugin, {
  store,
  router,
  excludes: [
    'login', 'login-d', 'logout', 'find-login-info', // Login routes
    'sign-consent-form', 'signature', 'alert-result', // Consent Routes
    'sales-statement', // Sales statement routes
    'payments', 'payment-iamport', 'netmoney-history', 'extension-expiry-date', 'auto-transfer-ars', 'virtual-account-result', // Expired shop routes
  ],
})

// Register components
vue.component('AIcon', AIcon)
vue.component('AhaButton', AhaButton)

// Vue Config
// eslint-disable-next-line no-undef
const app_environment = process.env.NODE_ENV
if (app_environment == 'local') {
  vue.config.devtools = true
  vue.config.productionTip = true
  vue.config.performance = true
}
else {
  vue.config.devtools = false
  vue.config.productionTip = false
}

vue.use(vueCookies)
vue.$cookies.config('1d')

// Sentry
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

// eslint-disable-next-line no-undef
if (app_environment === 'test') { // only tracking with sentry on Development environment
  Sentry.init({
    Vue:          vue,
    // eslint-disable-next-line no-undef
    dsn:          process.env.SALONADMIN_SENTRY_DSN,
    environment:  app_environment,
    // eslint-disable-next-line no-undef
    release:      process.env.RELEASE_VERSION,
    integrations: [
      // The @sentry/tracing package provides a BrowserTracing integration to add
      // automatic instrumentation for monitoring the performance of browser applications.
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins:         [
          // The default value of tracingOrigins is ['localhost', /^\//].
          // The JavaScript SDK will attach the sentry-trace header to all
          // outgoing XHR/fetch requests whose destination contains a string in the list or matches a regex in the list.
          // eslint-disable-next-line no-undef
          process.env.SALONADMIN_GATEWAY_BASEURL,
          /^\//,
        ],
      }),
    ],
    tracingOptions: {
      // enable this option if you want to also track child components and see more details about the rendering process
      trackComponents: true,
    },
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
    // Vue specific
    // Passing in logErrors is optional and is false if it is not provided.
    // If you set it to true, Sentry will call original Vue's logError function as well
    logErrors:        app_environment === 'local',
    // Sentry will send all Vue components’ props for logging purpose
    attachProps:      true,
    // stack traces are automatically attached to all messages logged
    attachStacktrace: true,
  })
}

// Global CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './template/template.scss'

// Vue Instanse
export default new vue({
  el: '#app',

  i18n,
  store,
  router,

  render: h => h(app),
})

