// Utilities
import { SignalREvent } from '../lib/utils'
import { redirectLogin } from 'HTTPHelpers'
import * as SignalR from '@microsoft/signalr'

// Apis
import { getToken, getBookingLive } from 'Modules/api/booking/booking-api'

// View Models
import WaitingViewModel from 'ViewModels/bookings/waiting-view-model'
import BookingViewModel from 'Modules/view-model/booking/booking-view-model'
import BlockedTimeViewModel from 'ViewModels/bookings/blocked-time-view-model'

// Constants
import { options } from 'OptionsHelpers'
import { LOGOUT_REASON_ENUM } from 'Constant'

const state = {
  logs:               [],
  isEnableLogs:       true,
  isSignalRLogsShown: false,

  connection:        null,
  isConnectedBefore: false,
}

const getters = {
  isConnected(state) {
    return state?.connection?.state === SignalR.HubConnectionState.Connected
  },

  isDisconnected(state) {
    return state?.connection?.state === SignalR.HubConnectionState.Disconnected
  },
}

const mutations = {
  resetState() {
    //
  },

  setLogs(state, logs) {
    state.logs = logs
  },

  setIsEnableLogs(state, isEnableLogs) {
    state.isEnableLogs = isEnableLogs
  },

  setIsSignalRLogsShown(state, isSignalRLogsShown) {
    state.isSignalRLogsShown = isSignalRLogsShown
  },

  setConnection(state, connection) {
    state.connection = connection
  },

  setIsConnectedBefore(isConnectedBefore) {
    state.isConnectedBefore = isConnectedBefore
  },
}

const actions = {
  addLog({ commit, state }, data) {
    const logs = state.logs ?? []
    logs.splice(0, 0, data)

    commit('setLogs', logs)
  },

  clearLogs({ commit }) {
    commit('setLogs', [])
  },

  toggleLogs({ commit, state }) {
    commit('setIsEnableLogs', !state.isEnableLogs)
  },

  async generate({ dispatch }, { shopId }) {
    const token = await dispatch('getBookingToken', {
      shopId,
      lifeTime: '1',
      hubName:  'salonadmin',
    })

    if (token) {
      await dispatch('connectSignalR', { token })
    }
  },

  async connectSignalR({ commit }, { token }) {
    // eslint-disable-next-line no-undef
    const connection = new SignalR.HubConnectionBuilder().withUrl(process.env.NOTIFICATION_READ_API_BASEURL, {
      accessTokenFactory: async () => token,
    }).withAutomaticReconnect().build()

    connection.on('SendMessage', (notiType, plainText) => {
      const data = JSON.parse(plainText)

      SignalREvent.$emit(notiType, data)
      SignalREvent.$emit('SendMessage', notiType, data)
    })

    connection.onclose(error => SignalREvent.on('close', error))
    connection.onreconnecting((error) => SignalREvent.on('reconnecting', error))
    connection.onreconnected((connectionId) => SignalREvent.on('reconnected', connectionId))

    await connection.start()

    commit('setConnection', connection)
    commit('setIsConnectedBefore', true)
  },

  startSignalR({ state }) {
    state.connection?.start?.()
  },

  stopSignalR({ state }) {
    state.connection?.stop?.()
  },

  async getBookingToken(ctx, { shopId, hubName, lifeTime }) {
    const response = await getToken({ shopId, hubName, lifeTime })

    return response?.data
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
}

export const createSignalRPlugin = module => {
  return async store => {
    store.watch(
      state => state?.authentication?.logged_in,
      async isLoggedIn => {

        if (isLoggedIn) {
          await store.dispatch(`${module}/generate`, {
            shopId: store.state?.authentication?.shop?.shop_id,
          })
        } else if (store.state?.[module]?.connection?.stop) {
          store.state[module].connection.stop()
        }
      }, {
        immediate: true,
      },
    )
  }
}

export const SignalREventPlugin = (store) => {
  const handleAddSignalRLog = (notiType, data) => {
    store.dispatch('signalR/addLog', {
      data,
      notiType,
      date: new Date(),
    }, { root: true })
  }

  store.watch(
    state => state.signalR.isEnableLogs,
    isEnableLogs => {
      if (isEnableLogs) {
        SignalREvent.$on('SendMessage', handleAddSignalRLog)
      } else {
        SignalREvent.$off('SendMessage', handleAddSignalRLog)
      }
    }, {
      immediate: true,
    },
  )

  const checkUserSessionToken = sessionToken => {
    return store.state?.authentication?.user?.session_token === sessionToken
  }

  // Bookings event
  const handleBookingCreated = data => {
    if (checkUserSessionToken(data.sessionToken)) return

    const bookings = BookingViewModel.mapBookingsFromApi([data.booking])
    const booking = bookings.items[0]

    const isBookingExisted = store.getters['booking/getBookingCalendar'].find(({ id }) => id === booking.id)
    if (!isBookingExisted) {
      store.dispatch('booking/addBookingNotificationData', bookings.items)
    }
  }

  const handleBookingUpdated = async data => {
    const bookings = BookingViewModel.mapBookingsFromApi([data.booking])
    const booking = bookings.items[0]

    store.dispatch('booking/updateBookingNotificationData', booking)
  }

  const handleBookingCanceled = async data => {
    const bookings = BookingViewModel.mapBookingsFromApi(data?.bookings ?? [])

    const canceledBookings = bookings?.items?.map(item => ({
      id:                item.id,
      reason:            item.cancel_booking_reason.reason,
      cancel_by_name:    item.cancel_booking_reason.cancel_by_name,
      cancel_date_ts:    item.cancel_booking_reason.cancel_date_ts,
      cancel_booking_id: item.cancel_booking_reason.cancel_booking_id,
    }))

    store.dispatch('booking_cancel/addBookingCancelNotificationData', canceledBookings)
  }

  SignalREvent.$on(options.notification_type.bookings_created, handleBookingCreated)
  SignalREvent.$on(options.notification_type.bookings_updated, handleBookingUpdated)
  SignalREvent.$on(options.notification_type.bookings_cancelled, handleBookingCanceled)
  // store.getters['booking/getBookingCalendar']

  // Blocked time event

  const handleBlockedTimeCreated = async data => {
    const blockedTime = new BlockedTimeViewModel().getBlockedTimeFromNotification(data)
    store.dispatch('blocked_time/addBlockedTimeNotificationData', blockedTime)
  }

  const handleBlockedTimeUpdated = async data => {
    const blockedTime = new BlockedTimeViewModel().getBlockedTimeFromNotification(data)
    store.dispatch('blocked_time/updateBlockedTimeNotificationData', blockedTime)
  }

  const handleBlockedTimeDeleted = async data => {
    const blockedTime = new BlockedTimeViewModel().getBlockedTimeFromNotification(data)
    store.dispatch('blocked_time/deleteBlockedTimeNotificationData', blockedTime)
  }

  SignalREvent.$on(options.notification_type.blocked_time_created, handleBlockedTimeCreated)
  SignalREvent.$on(options.notification_type.blocked_time_updated, handleBlockedTimeUpdated)
  SignalREvent.$on(options.notification_type.blocked_time_deleted, handleBlockedTimeDeleted)

  // Waiting event

  const handleWaitingCreated = async data => {
    const waiting = new WaitingViewModel()
    waiting.mapFieldsFromApi(data)

    store.dispatch('waiting/addWaitingNotificationData', waiting.getFields())
  }

  const handleWaitingChanged = async data => {
    const waiting = new WaitingViewModel()
    waiting.mapFieldsFromApi(data)

    store.dispatch('waiting/updateWaitingNotificationData', waiting.getFields())
  }

  SignalREvent.$on([
    options.notification_type.waitings_updated,
    options.notification_type.waitings_changed_to_bookings,
  ], handleWaitingChanged)
  SignalREvent.$on(options.notification_type.waitings_created, handleWaitingCreated)

  // Setup event

  const handleSalesEnvironmentSetupChange = () => {
    store.dispatch('cache/sales/clearAllSalesSetup')
  }

  const handleEnvironmentSetupChange = () => {
    store.dispatch('cache/client/clearClientShopInfo')
    store.dispatch('cache/sales/clearEnvironmentSetup')
  }

  const handleClientEnvironmentSetupChange = () => {
    store.dispatch('cache/client/clearClientShopInfo')
    store.dispatch('cache/client/clearClientEnvironmentSetup')
  }

  SignalREvent.$on([
    options.notification_type.sales_general_setup_updated,
    options.notification_type.shop_environment_setup_updated,
    options.notification_type.client_environment_setup_updated,
    options.notification_type.sales_data_protection_and_security_setup_updated,
  ], handleEnvironmentSetupChange)

  SignalREvent.$on([
    options.notification_type.loyalty_point_changed,
    options.notification_type.sales_general_setup_updated,
    options.notification_type.sales_data_protection_and_security_setup_updated,
  ], handleSalesEnvironmentSetupChange)

  SignalREvent.$on(options.notification_type.client_environment_setup_updated, handleClientEnvironmentSetupChange)

  store.watch(state => state.signalR.connection, connection => {
    if (connection.state === SignalR.HubConnectionState.Disconnected) {
      store.dispatch('cache/sales/clearAllSalesSetup')
      store.dispatch('cache/client/clearClientShopInfo')
      store.dispatch('cache/sales/clearEnvironmentSetup')
      store.dispatch('cache/client/clearClientEnvironmentSetup')
    }
  }, {
    deep: true,
  })

  // Other event

  const handleStaffStatusChanged = async (data) => {
    const resourceId = data.staffId ?? 0

    store.dispatch('cache/staff/removingActiveStaffsResponse')
    store.dispatch('cache/booking/changeResourceByInactivedStaff', { resourceId })
  }

  SignalREvent.$on(options.notification_type.staff_status_changed, handleStaffStatusChanged)

  const handleExtSystemBookingPaymentPaid = async data => {
    const requestingPaymentBookingId = store.getters['notification/getBookingIdRequestingPayment']
    const requestingPaymentSessionToken = store.getters['notification/getSessionTokenRequestingPayment']

    if (checkUserSessionToken(requestingPaymentSessionToken) && requestingPaymentBookingId === data.bookingId) {
      store.commit('notification/setPaymentCompleteInfoOfRequestingPayment', data)

      /**
       * @description Get update booking when the complete revise payment with update coupon
       */
      const response = await getBookingLive({
        shopId:    data.shopId,
        bookingId: data.bookingId,
      })

      const booking = BookingViewModel.mapFieldsFromResponse(response?.data?.result)?.fields

      store.dispatch('booking/updateBookingNotificationData', booking)
    }
  }

  SignalREvent.$on(options.notification_type.ext_system_booking_payment_paid, handleExtSystemBookingPaymentPaid)

  const handleGoodsChanged = () => {
    store.commit('goods_cache/setHasSetupChangedPackagesCache', true)
    store.commit('goods_cache/setHasSetupChangedServicesCache', true)
    store.commit('goods_cache/setHasSetupChangedProductsCache', true)
    store.commit('goods_cache/setHasSetupChangedPrepaidCardsCache', true)
    store.commit('goods_cache/setHasSetupChangedPrepaidServicesCache', true)
    store.commit('goods_cache/setHasSetupChangedServiceCategoriesCache', true)

    store.dispatch('cache/goods/clearServiceByIds')
    store.dispatch('cache/goods/clearServiceCategoryByIds')
  }

  SignalREvent.$on(options.notification_type.goods_changed, handleGoodsChanged)

  const handleServiceChanged = () => {
    store.dispatch('cache/goods/clearServiceByIds')
    store.commit('goods_cache/setHasSetupChangedServicesCache', true)
  }

  SignalREvent.$on(options.notification_type.service_changed, handleServiceChanged)

  const handleServiceCategoryChanged = () => {
    store.dispatch('cache/goods/clearServiceCategoryByIds')
    store.commit('goods_cache/setHasSetupChangedServiceCategoriesCache', true)
  }

  SignalREvent.$on(options.notification_type.service_category_changed, handleServiceCategoryChanged)

  const handleProductCategoryChanged = () => {
    store.commit('goods_cache/setHasSetupChangedProductsCache', true)
    store.commit('goods_cache/setHasSetupChangedProductCategoriesCache', true)
  }

  SignalREvent.$on(options.notification_type.product_category_changed, handleProductCategoryChanged)

  const handleLogoutUserAccess = (data) => {
    const isChangePasswordLogout = data.logoutReason === LOGOUT_REASON_ENUM.CHANGE_PASSWORD &&
    store.state?.authentication?.user?.user_id === data.userAccountId

    const isShopInfoChangedLogout = (data.logoutReason === LOGOUT_REASON_ENUM.SHOP_CHANGED_EXPIRED ||
    data.logoutReason === LOGOUT_REASON_ENUM.SHOP_CHANGED_STATUS) &&
    store.state?.authentication?.shop?.shop_id === data.shopId

    const shouldRedirectLogin = isChangePasswordLogout || isShopInfoChangedLogout
    if (shouldRedirectLogin) {
      redirectLogin()
    }
  }

  SignalREvent.$on(options.notification_type.logout_user_access, handleLogoutUserAccess)

  SignalREvent.$on(options.notification_type.system_new_version, () => store.dispatch('app/setShowNewDeployCountdownModal', true))
  SignalREvent.$on(options.notification_type.system_maintain_mode, () => store.dispatch('app/setShowMaintainCountdownModal', true))
  SignalREvent.$on(options.notification_type.package_changed, () => store.commit('goods_cache/setHasSetupChangedPackagesCache', true))
  SignalREvent.$on(options.notification_type.prepaid_card_changed, () => store.commit('goods_cache/setHasSetupChangedPrepaidCardsCache', true))
  SignalREvent.$on(options.notification_type.product_inventory_changed, () => store.commit('goods_cache/setHasSetupChangedProductsCache', true))
  SignalREvent.$on(options.notification_type.prepaid_service_changed, () => store.commit('goods_cache/setHasSetupChangedPrepaidServicesCache', true))
}
