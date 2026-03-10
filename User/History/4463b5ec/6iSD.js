// Utilities
import { mapState } from 'vuex'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

/**
 * @param {Object} options
 * @param {String} options.targetID
 * @param {String} options.docLoadedClass
 */
export const SplashScreenMixinCreator = (options) => {
  const targetID = options?.targetID ?? 'splash-screen'
  const docLoadedClass = options?.docLoadedClass ?? 'document-loaded'

  return {
    mixins: [
      DeviceMixin,
    ],

    data() {
      return {
        $splashScreenMixin_isPreloaderShown: false,
      }
    },

    computed: {
      ...mapState('authentication', {
        apiToken:             'apiToken',
        isLoadedPublicPage:   'isLoadedPublicPage',
        isLoadedAccountInfo:  'isLoadedAccountInfo',
        isLoadingAccountInfo: 'isLoadingAccountInfo',
      }),
    },

    mounted() {
      const targetEl = document.getElementById(targetID)
      const maximumPeriodOfTimeToShowSplashScreen = 5000

      if (!this.isMobileDevice) {
        document.body.removeChild(targetEl)
        this.$data.$splashScreenMixin_isPreloaderShown = true
        return
      }

      if (this.isLoadedPublicPage || !this.apiToken) {
        this.hideSplashScreen()
        return
      }

      let loadedAccountInfoWatcher = null
      loadedAccountInfoWatcher = this.$watch('isLoadedAccountInfo', (isLoadedAccountInfo) => {
        if (isLoadedAccountInfo) {
          this.hideSplashScreen()
          loadedAccountInfoWatcher()
        } else {
          // Use to re-run this method 1 more time to handle the edge cases
          // that setTimeout functions in hideSplashScreen cannot hide the splash screen at first try
          setTimeout(() => {
            this.hideSplashScreen()
          }, maximumPeriodOfTimeToShowSplashScreen)
        }
      }, {
        immediate: true,
      })
    },

    methods: {
      hideSplashScreen() {
        const targetEl = document.getElementById(targetID)

        if (!targetEl) return

        setTimeout(() => {
          targetEl.classList.add(docLoadedClass)
        }, 800)

        setTimeout(() => {
          document.body.removeChild(targetEl)
          this.$data.$splashScreenMixin_isPreloaderShown = true
        }, 1050)
      },
    },
  }
}
