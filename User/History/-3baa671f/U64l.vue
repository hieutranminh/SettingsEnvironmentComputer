<template>
  <div
    id="app"
    :class="[
      'app',
      app_language,
    ]"
  >
    <div
      v-if="isRouteLoading"
      class="app-route-loading"
    >
      <div class="app-route-loading__content">
        <img
          src="/template/manifest/icon192x192-removebg.png"
          alt="Loading..."
          class="app-route-loading__logo"
        >
        <div class="app-route-loading__spinner" />
      </div>
    </div>

    <router-view v-show="!isRouteLoading" />

    <translate
      :language="language"
      class="d-none"
    />

    <pre-loader
      v-if="$data.$splashScreenMixin_isPreloaderShown"
      :key="'app-spinner'"
    />

    <alert
      id="alert-modal"
      :key="'app-alert-modal'"
      @on-shown="onShownGlobalAlertModal"
    />

    <aha-new-deploy-countdown-modal
      id="new-deploy-modal"
      :visible="isShowNewDeployCountdownModal"
      @change="toggleShowNewDeployCountdownModal"
      @on-reloaded-automatically="onReloadedAutomatically"
    />

    <aha-maintain-countdown-modal
      id="new-deploy-modal"
      :visible="isShowMaintainCountdownModal"
      @change="toggleShowMaintainCountdownModal"
      @on-reloaded-automatically="onReloadedAutomatically"
    />

    <b-modal
      id="app-messages"
      :title="$t('general.alert')"
      :ok-title="$t('general.close')"
      :visible="isShowAppMessages"
      ok-only
      @change="toggleShowAppMessages"
    >
      <p
        v-for="(message, index) in appMessagesFiltered"
        :key="index"
        v-html="message"
      />
    </b-modal>

    <aha-dialog />

    <signal-r-logs />

    <!-- Dialog alert special - Handle special error display cases -->
    <dialog-alert-special />

    <dialog-alert-confirm-retry />

    <popup-retry-timeout />

    <help-center-info />
  </div>
</template>

<script>
// Utils
import BaseCache from 'Caches/base-cache'
import { checkMobileApp, checkAspPage } from 'CommonHelpers'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

// Constant
import { options } from 'OptionsHelpers'
import { APP_API_STATUS } from 'Constant'
import { booking_options } from 'Options/booking-options'
import { clients_options } from 'Options/clients-options'

// Components
import AhaDialog from 'Modules/dialog/dialog.vue'
import Alert from 'CommonComponents/alert/alert.vue'
import Translate from 'CommonComponents/translate/translate.vue'
import PreLoader from 'CommonComponents/pre-loader/pre-loader.vue'
import HelpCenterInfo from 'Components/help-center-info/help-center-info.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import PopupRetryTimeout from 'Modules/dialog/components/popup-retry-timeout/popup-retry-timeout.vue'
import DialogAlertSpecial from 'Modules/dialog/components/dialog-alert-special/dialog-alert-special.vue'
import AhaMaintainCountdownModal from 'Components/aha-maintain-countdown-modal/aha-maintain-countdown-modal.vue'
import AhaNewDeployCountdownModal from 'Components/aha-new-deploy-countdown-modal/aha-new-deploy-countdown-modal.vue'
import DialogAlertConfirmRetry from 'Modules/dialog/components/dialog-alert-confirm-retry/dialog-alert-confirm-retry.vue'

// Mixins
import WindowMessageMixin from 'Mixins/window-message-mixin.js'
import { SplashScreenMixinCreator } from 'Mixins/splash-screen-mixin.js'

export default {

  components: {
    Alert,
    AhaDialog,
    PreLoader,
    Translate,
    HelpCenterInfo,
    PopupRetryTimeout,
    DialogAlertSpecial,
    DialogAlertConfirmRetry,
    AhaMaintainCountdownModal,
    AhaNewDeployCountdownModal,

    SignalRLogs: () => import('Modules/signal-r/components/signalr-logs/signalr-logs.vue'),
  },

  extends: ComponentBase,
  provide: {
    isFullPath: true,
  },

  mixins: [
    WindowMessageMixin,
    SplashScreenMixinCreator(),
  ],

  data() {
    return {
      popup_view:           options.boards_enum.popup_view,
      cid_popup_view:       options.cid_enum.cid_popup_view,
      spam_info_popup_view: options.messages_enums.spam_info_popup_view,
      isShowHelperPopup:    false,
      isRouteLoading:       true,
    }
  },

  computed: {
    ...mapState('authentication', {
      is_logged: 'logged_in',
    }),

    ...mapGetters('device',{
      isIpad:   'isIpad',
      isIphone: 'isIphone',
    }),

    ...mapState('app', [
      'appMessages',
      'isShowAppMessages',
      'appVersionLastModified',
      'tempAppVersionLastModified',
      'isShowMaintainCountdownModal',
      'isShowNewDeployCountdownModal',
    ]),

    ...mapState('signalR', {
      signalRConnection: 'connection',
    }),

    ...mapGetters('signalR', {
      isSignalRConnectionDisconnected: 'isDisconnected',
    }),
    ...mapGetters('alert', {
      getPendingApi: 'getPendingApi',
    }),

    language() {
      return this.x_user.language
    },

    app_language(){
      return `app--${this.$i18n.locale}`
    },

    appMessagesFiltered() {
      const serverMaintenanceMessage = this.appMessages.find(
        messageObj => messageObj.status && messageObj.status === APP_API_STATUS.SERVER_MAINTENANCE,
      )

      // if Server is under maintenance show only its message
      if (serverMaintenanceMessage) {
        return [serverMaintenanceMessage.message]
      }

      return [...new Set(this.appMessages.map(
        messageObj => messageObj.message,
      ))]
    },

    isPageNotFoundRoute() {
      return this.$route && this.$route.name === 'not-found'
    },
  },

  watch: {
    isSignalRConnectionDisconnected(newValue, oldValue) {
      this.clearAllGoodsCaches()
      // in case signalR lost connection then reconnect
      if (oldValue === true && newValue === false) {
        this.checkAppVersionByFile()

      }
    },

    isShowAppMessages(isShow) {
      if (!isShow) {
        // clear app messages on hide
        this.setAppMessages([])
      }
    },

    '$i18n.locale': {
      handler() {
        localStorage.setItem('offlineText', this.$i18n.t('general.offline-text'))
        localStorage.setItem('retryButtonText', this.$i18n.t('general.retry-text'))
      },
      immediate: true,
      deep:      true,
    },
  },

  created(){
    // view build

    document.title = 'Ahasoft Plus'
    // load app by shopId in cache_session
    // let cache_shop_id = cache_session.getShopIdCache()
    // this.setShopData(cache_shop_id)
    window.addEventListener('online', this.checkAppVersionByFile)
    document.addEventListener('visibilitychange', this.onVisibilityChange)

    // clear all browser cache on refresh
    const baseCacheInstance = new BaseCache()
    baseCacheInstance.clearAllCache([
      // environment
      options.sessions.environment_setups.key,
      // sales
      options.sessions.all_sales_setups.key,
      // booking
      options.sessions.all_calendar_setups.key,
      options.sessions.payment_method_setup.key,
      booking_options.cache.booking_deposit_setup_session.key,
      // client
      clients_options.cache.all_clients_setups.key,
      // staff
      options.sessions.staffs.key,
      options.sessions.staff_goal_setup.key,
      options.sessions.staff_payroll_setup.key,
    ])
  },

  mounted() {
    const isMobileApp = checkMobileApp()
    const isAspPage = checkAspPage()
    if(isMobileApp === null || !isMobileApp) {
      const parsedUrl = new URL(location)
      const isMobileApp = parsedUrl.searchParams.get('isMobileApp') || false
      sessionStorage.setItem('isMobileApp', isMobileApp)
    }
    if(isAspPage === null || !isAspPage) {
      const parsedUrl = new URL(location)
      const isAspPage = parsedUrl.searchParams.get('isAspPage') || false
      sessionStorage.setItem('isAspPage', isAspPage)
    }
    if(this.isMobileApp) {
      if(this.isIphone || this.isIpad) {
        const parsedUrl = new URL(location)
        const version = parsedUrl.searchParams.get('version') || ''
        if(version) {
          sessionStorage.setItem('appVersion', version)
        }
      }
    }
    // Unregister all existing service workers to prevent cache issues
    this.unregisterAllServiceWorkers()
    this.checkAppVersionByFile()
    window.addEventListener('message', this.windowMessageMixin_handleReceiveMessage)

    window.addEventListener('resize', this.windowHeight)
    this.windowHeight()

    // Add event listener for orientation change
    this.setDataDeviceInfo()
    window.addEventListener('resize', this.updateWindowDimensions)
    window.addEventListener('orientationchange', this.handleOrientationChange)

    // Call initially to set the height correctly
    this.updateWindowDimensions()

    // Hide route loading after initial route is ready
    // Use $nextTick to ensure router-view has rendered
    this.$nextTick(() => {
      // Add small delay to ensure async component has loaded
      setTimeout(() => {
        this.isRouteLoading = false
      }, 100)
    })

    // Fallback: ensure loading screen is hidden after max 3 seconds
    // This prevents blank screen issues on Edge browser
    setTimeout(() => {
      if (this.isRouteLoading) {
        this.isRouteLoading = false
      }
    }, 3000)

    // Also listen for route changes to handle loading state
    this.$router.afterEach(() => {
      this.$nextTick(() => {
        this.isRouteLoading = false
      })
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.windowHeight)
    window.removeEventListener('online', this.checkAppVersionByFile)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    window.removeEventListener('message', this.windowMessageMixin_handleReceiveMessage)
    window.addEventListener('resize', this.updateWindowDimensions)
    window.addEventListener('orientationchange', this.handleOrientationChange)

  },

  methods: {
    ...mapActions('app', {
      setAppMessages:                    'setAppMessages',
      toggleShowAppMessages:             'toggleShowAppMessages',
      xCheckAppVersionByFile:            'checkAppVersionByFile',
      setAppVersionLastModified:         'setAppVersionLastModified',
      setShowNewDeployCountdownModal:    'setShowNewDeployCountdownModal',
      toggleShowMaintainCountdownModal:  'toggleShowMaintainCountdownModal',
      toggleShowNewDeployCountdownModal: 'toggleShowNewDeployCountdownModal',
    }),

    ...mapActions('device', [
      'setDataDeviceInfo',
    ]),

    ...mapMutations('goods_cache', {
      xSetHasSetupChangedServicesCache:          'setHasSetupChangedServicesCache',
      xSetHasSetupChangedProductsCache:          'setHasSetupChangedProductsCache',
      xSetHasSetupChangedPackagesCache:          'setHasSetupChangedPackagesCache',
      xSetHasSetupChangedPrepaidCardsCache:      'setHasSetupChangedPrepaidCardsCache',
      xSetHasSetupChangedPrepaidServicesCache:   'setHasSetupChangedPrepaidServicesCache',
      xSetHasSetupChangedServiceCategoriesCache: 'setHasSetupChangedServiceCategoriesCache',
      xSetHasSetupChangedProductCategoriesCache: 'setHasSetupChangedProductCategoriesCache',
    }),

    async checkAppVersionByFile() {
      const { currentAppVersionLastModified } = await this.xCheckAppVersionByFile() || {}
      if (!this.appVersionLastModified) {
        this.setAppVersionLastModified(currentAppVersionLastModified ?? '')
      }
    },

    onReloadedAutomatically(newAppVersionLastModified) {
      this.setAppVersionLastModified(newAppVersionLastModified ?? '')
    },

    onVisibilityChange() {
      // user back to the tab after hide on background or go to another tabs
      if (
        document.visibilityState === 'visible' &&
        (!this.signalRConnection || this.isSignalRConnectionDisconnected)
      ) {
        this.checkAppVersionByFile()
      }
    },

    onShownGlobalAlertModal() {
      // avoid show #alert-modal when #app-messages was showing
      if (this.isShowAppMessages) {
        this.$nextTick(() => {
          this.hideDialogById('alert-modal')
        })
      }
    },

    clearAllGoodsCaches() {
      this.xSetHasSetupChangedServicesCache(true)
      this.xSetHasSetupChangedProductsCache(true)
      this.xSetHasSetupChangedPackagesCache(true)
      this.xSetHasSetupChangedPrepaidCardsCache(true)
      this.xSetHasSetupChangedPrepaidServicesCache(true)
      this.xSetHasSetupChangedServiceCategoriesCache(true)
      this.xSetHasSetupChangedProductCategoriesCache(true)
    },

    async unregisterAllServiceWorkers() {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }
    },

    windowHeight() {
      const doc = document.documentElement
      doc.style.setProperty('--window-height', `${window.innerHeight}px`)
    },

    updateWindowDimensions() {
      const doc = document.documentElement
      const newHeight = window.innerHeight
      doc.style.setProperty('--window-height', `${newHeight}px`)
    },

    handleOrientationChange() {
      this.preLoader(true)
      const orientationChangeTimeOut = setTimeout(() => {
        this.updateWindowDimensions() // Force height recalculation after orientation change

        this.$nextTick(() => {
          // For interact Old Device
          this.setDataDeviceInfo()
          this.preLoader(false)
        })
        clearTimeout(orientationChangeTimeOut)
      }, 500) // Small delay to ensure orientation is fully applied

      // For interact Modern Device
      this.$nextTick(() => {
        this.setDataDeviceInfo()
      })
    },
  },
}
</script>

<style lang="scss">
  @import './app.scss';

  #app-messages___BV_modal_outer_ {
    z-index: 999999 !important;
  }
</style>

<style lang="scss" scoped>

  #app {
    ::v-deep #alert-modal {
      .validate-errors-wrapper {
        max-height: 50vh;
        overflow: auto;
      }
    }
  }

  .app-route-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #fff;

    &__content {
      text-align: center;
    }

    &__logo {
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
    }

    &__spinner {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #0093ff;
      border-radius: 50%;
      animation: app-route-spin 1s linear infinite;
    }
  }

  @keyframes app-route-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

</style>
