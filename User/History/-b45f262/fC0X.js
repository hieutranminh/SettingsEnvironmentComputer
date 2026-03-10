// Utilities
import {
  CalendarEventBus,
  convertDateToTimezone,
  convertDateToMomentUTC,
  convertTimestampToMomentUTC,
  convertMinutesToFormattedTime,
} from 'Modules/calendar/utils/index'
import moment from 'moment'
import i18n from 'Translate'
import store from 'VuexStore'
import uniqBy from 'lodash/uniqBy'
import cloneDeep from 'lodash/cloneDeep'

// Apis
import {
  updateBookingStatus,
  updateBookingClient,
  getBookingCalendarLive,
  cancelBookingDepositPaid,
  noShowBookingDepositPaid,
  disconnectClientNaverBooking,
} from 'Modules/api/booking/booking-api'

import * as naverApi from 'Modules/api/naver/naver-api'

// Modules
import bookingItems from './bookingItems'

// Models
import Booking from 'Models/booking/booking'
import CancelBooking from 'Models/booking/cancelBooking'
import BookedResource from 'Models/booking/bookedResource'
// eslint-disable-next-line no-unused-vars
import BookingDeposit from 'Models/booking/bookingDeposit'

// Constants
import { options } from 'OptionsHelpers'
import { MINUTES_OF_24H, BOOKING_SOURCE } from 'Constant'

const excludeBookingStatuses = [
  options.booking.booking_status.canceled,
  options.booking.booking_status.no_booking,
]

const ALL_RESOURCE_ID = 0

const state = {
  bookingSet: {},

  bookingFilter: {
    shopId:                 0,
    toDateTS:               0,
    typeDate:               0,
    fromDateTS:             0,
    bookingResourceSetupId: 0,
    numberItemWaiting:      options.pagination.small,
  },

  bookingItem:       {},
  bookingCancelType: 0,

  isShowCancelBookingDepositPaid:  false,
  isShowSelectSalesAssignment:     false,
  isShowSearchVisitorActions:      false,
  isActionBookerCheckout:          false,
  isSyncBookingWhenDeleteSales:    false,
  isUnregisteredClientFromVisitor: false,
  bookingNaver:                    {},
}

const getters = {
}

const mutations = {
  setBookingSet(state, booking) {
    state.bookingSet[booking.bookingId] = booking
  },

  removeBookingFromBookingSet(state, booking) {
    if (state.bookingSet.hasOwnProperty(booking.bookingId)) {
      delete state.bookingSet[booking.bookingId]
    }
  },

  patchBookingSet(state, booking) {
    if (!state.bookingSet[booking.bookingId]) {
      return
    }

    state.bookingSet[booking.bookingId] = {
      ...state.bookingSet[booking.bookingId],
      ...booking,
    }
  },

  setBookingFilter(state, bookingFilter) {
    state.bookingFilter = {
      ...state.bookingFilter,
      ...bookingFilter,
    }
  },

  setBookingItem(state, booking) {
    state.bookingItem = booking
  },

  setBookingCancelType(state, type) {
    state.bookingItem.data.option = type
  },

  setShowCancelBookingDepositPaid(state, payload) {
    state.isShowCancelBookingDepositPaid = payload
  },

  setShowSelectSalesAssignment(state, payload) {
    state.isShowSelectSalesAssignment = payload
  },

  setShowSearchVisitorActions(state, payload) {
    state.isShowSearchVisitorActions = payload
  },

  setIsUnregisteredClientFromVisitor(state, payload) {
    state.isUnregisteredClientFromVisitor = payload
  },

  setNaverProxyBooking(state, payload) {
    state.bookingNaver = payload
  },

  setSyncBookingWhenDeleteSales(state, payload) {
    state.isSyncBookingWhenDeleteSales = payload
  },
}

const actions = {
  async getBookingCalendarLive({ state, commit, dispatch }, bookingFilter) {
    const bookingFilterClone = cloneDeep(bookingFilter)
    delete bookingFilterClone.isVisibilityChange
    delete bookingFilterClone.totalBooking

    commit('setBookingFilter', bookingFilterClone)

    const response = await getBookingCalendarLive(state.bookingFilter)

    let bookings = response.data?.result?.bookings ?? []

    // this variable hole all booking items have been dupplicated
    const bookingHasDuplicate = []
    if(bookingFilter.isVisibilityChange) {
    // If the calendar change tab, totalBookingAfterVisibilyChange is all booking of shedule calendar data
      const totalBookingAfterVisibilyChange = {}
      if(bookingFilter.totalBooking.length) {
        bookingFilter.totalBooking.forEach((item) => {
          totalBookingAfterVisibilyChange[item.bookingId] = {
            bookingResourceSetupId: item.bookedResources[0].bookingResourceSetupId,
            bookingDateTS:          item.bookingDateTS,
          }
        })
      }

      if(bookings.length) {
        for(const item of bookings) {
          if(item.status === options.booking.booking_status.canceled) {
            continue
          }
          const bookingId = item.bookingId
          const bookedResourceId = item.bookedResources[0].bookingResourceSetupId
          if(totalBookingAfterVisibilyChange[bookingId]) {
            if(totalBookingAfterVisibilyChange[bookingId].bookingResourceSetupId !== bookedResourceId || totalBookingAfterVisibilyChange[bookingId].bookingDateTS !== item.bookingDateTS) {
              bookingHasDuplicate.push(item)
            }
          }
        }
      }

    }

    const blockedTimes = response.data?.result?.blockedTimes ?? []

    dispatch('parseBookingsToObj', {bookings, bookingHasDuplicate})
    bookings.forEach(booking => commit('setBookingSet', booking))

    // Clears blocked times for each date and resource, and sets new blocked times.
    const dates = store.getters['_calendar/dates']
    const resources = store.state._calendar.bookingResources

    dates.forEach(date => {
      const dateTS = convertDateToMomentUTC(date).startOf('day').unix()

      resources.forEach(resource => {
        const calendarModuleName = `${dateTS}_${resource.id}`

        if (!store.hasModule(['_calendar', 'blockedTimes', calendarModuleName])) {
          return
        }

        store.dispatch(`_calendar/blockedTimes/${calendarModuleName}/clearAllBlockedTimes`, { root: true })
      })
    })

    dispatch('_calendar/blockedTimes/setBlockedTimes', { blockedTimes }, {
      root: true,
    })

    return response
  },

  async getBookingCalendarLiveByDateRange({ state, dispatch, rootGetters }, { toDateTS, fromDateTS, isMoveCalendar }) {
    if (isMoveCalendar) state.bookingFilter.bookingResourceSetupId = ALL_RESOURCE_ID

    let totalCalendarBookingCurrentDate = []
    const schedule = rootGetters['_calendar/schedule']
    for(let i = 0; i < schedule.length; i++) {
      const bookingResource = schedule[i].bookingResources
      const dateTS = moment(schedule[i].date).unix()

      bookingResource.forEach((item) => {
        const bookingData = rootGetters[`_calendar/bookings/${dateTS}_${item.id}/availableBookings`] || []

        if(bookingData.length) {
          totalCalendarBookingCurrentDate = [...totalCalendarBookingCurrentDate, ...bookingData]
        }
      })
    }
    const bookingFilterClone = cloneDeep(state.bookingFilter)
    bookingFilterClone.totalBooking = totalCalendarBookingCurrentDate
    bookingFilterClone.isVisibilityChange = true
    await dispatch('getBookingCalendarLive', {
      ...bookingFilterClone,
      fromDateTS,
      toDateTS,
    })
    if (!isMoveCalendar) CalendarEventBus.$emit('scroll-to-top')
  },

  async reloadBookingCalendarLive({ dispatch }) {
    return await dispatch('getBookingCalendarLive', state.bookingFilter)
  },

  async setBookingResourceAvailable({ state, commit }, { bookingDateTS, bookedResource }) {
    const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

    if (!store.hasModule(['_calendar', 'bookings', bookingItemModuleName])) {
      store.registerModule(['_calendar', 'bookings', bookingItemModuleName], cloneDeep(bookingItems))
    }

    const bookedStartTimeInMinues = BookedResource.getStartTimeInMinutes({
      startTime: bookedResource.startTime,
      isNextDay: bookedResource.isNextDay,
    })
    const bookedEndTimeInMinutes = bookedStartTimeInMinues + Number(bookedResource.estimatedTime || 0)

    commit(`_calendar/bookings/${bookingItemModuleName}/setAvailableStartTime`, Math.min(
      bookedStartTimeInMinues,
      state[bookingItemModuleName].availableStartTime ?? bookedStartTimeInMinues,
    ), { root: true })

    commit(`_calendar/bookings/${bookingItemModuleName}/setAvailableEndTime`, Math.max(
      bookedEndTimeInMinutes,
      state[bookingItemModuleName].availableEndTime ?? bookedEndTimeInMinutes,
    ), { root: true })

    commit(`_calendar/bookings/${bookingItemModuleName}/setBookingDateTS`, bookingDateTS, { root: true })
    commit(`_calendar/bookings/${bookingItemModuleName}/setBookingResourceSetupId`, bookedResource.bookingResourceSetupId, { root: true })
  },

  async parseBookingsToObj({ commit, dispatch }, data) {
    // Remove booking has been duplicate
    const { bookingHasDuplicate, bookings } = data

    if(bookingHasDuplicate.length > 0) {
      bookingHasDuplicate.forEach(booking => {

        dispatch('removeBookingById', { bookingId: booking.bookingId})
      })
    }

    bookings.forEach(booking => {
      const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()

      booking.bookedResources.forEach(async bookedResource => {
        const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

        await dispatch('setBookingResourceAvailable', {
          bookingDateTS,
          bookedResource,
        })

        if (!excludeBookingStatuses.includes(booking.status)) { // Canceled & No Booking
          commit(`_calendar/bookings/${bookingItemModuleName}/addOrUpdateItem`, {
            ...booking,
            bookedResources: [bookedResource],
          }, { root: true })
        } else {
          dispatch('removeBookingById', { bookingId: booking.bookingId })
        }
      })
    })
  },

  async addBooking({ commit, dispatch }, { booking }) {
    commit('setBookingSet', booking)

    const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()

    booking.bookedResources.forEach(async bookedResource => {
      const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

      await dispatch('setBookingResourceAvailable', {
        bookingDateTS,
        bookedResource,
      })

      // Avoid adding duplicate booking - especially through signalR
      // const existedBooking = state.bookingSet[booking.bookingId]
      // const hasSingleResource = bookedResource && typeof bookedResource === 'object'
      // if (existedBooking?.bookingSource === BOOKING_SOURCE.NAVER || (existedBooking && hasSingleResource) && bookedResource.length <= 1) {
      //   dispatch('removeBookingById', { bookingId: booking.bookingId })
      // }

      if (!excludeBookingStatuses.includes(booking.status)) {
        commit(`_calendar/bookings/${bookingItemModuleName}/addOrUpdateItem`, {
          ...booking,
          bookedResources: [bookedResource],
        }, { root: true })
      }
    })
  },

  /**
   * @param {Object} data
   * @param {Number} data.option
   * @param {Number} data.reason
   * @param {Booking} data.booking
   */
  async cancelBooking({ rootState, dispatch, commit }, data) {
    const booking = data.booking

    const cancelBooking = CancelBooking.convertFromBooking(booking)
    cancelBooking.option = data.option
    cancelBooking.reason = data.reason

    cancelBooking.cancelById = rootState.authentication.user.user_id
    cancelBooking.cancelByName = rootState.authentication.user.user_name
    cancelBooking.shopLocation = rootState.authentication.shop.shop_location
    cancelBooking.sessionToken = rootState.authentication.user.session_token

    const now = convertDateToTimezone()
    cancelBooking.cancelDateTS = convertDateToMomentUTC(now).unix()

    const result = await cancelBooking.send()

    commit('patchBookingSet', {
      bookingId: booking.bookingId,
      status:    options.booking.booking_status.canceled,
    })

    const cancelRepeatBookings = result?.cancelRepeatBookings ?? []
    cancelRepeatBookings.forEach(cancelBooking => {
      commit('patchBookingSet', {
        bookingId: cancelBooking.bookingId,
        status:    options.booking.booking_status.canceled,
      })

      dispatch('removeBookingById', { bookingId: cancelBooking.bookingId })
    })

    return result
  },

  /**
   * @param {Object} data
   */
  async cancelBookingDepositPaid({ dispatch, commit }, data) {
    const result = await cancelBookingDepositPaid(data)

    commit('patchBookingSet', {
      bookingId: data.bookingId,
      status:    options.booking.booking_status.canceled,
    })

    const cancelRepeatBookings = result?.data?.result?.cancelRepeatBookings ?? []
    cancelRepeatBookings.forEach(cancelBooking => {
      commit('patchBookingSet', {
        bookingId: cancelBooking.bookingId,
        status:    options.booking.booking_status.canceled,
      })

      dispatch('removeBookingById', { bookingId: cancelBooking.bookingId })
    })

    return result
  },

  /**
   * @param {Object} data
   * Use this in case of canceling repeat bookings of the type 'all upcoming bookings'
   * and when there is an upcoming booking has deposit
   */
  cancelRepeatBookingDepositPaid({ dispatch, commit }, data) {
    commit('patchBookingSet', {
      bookingId: data.bookingId,
      status:    options.booking.booking_status.canceled,
    })

    const cancelRepeatBookings = data?.cancelRepeatBookings ?? []
    cancelRepeatBookings.forEach(cancelBooking => {
      commit('patchBookingSet', {
        bookingId: cancelBooking.bookingId,
        status:    options.booking.booking_status.canceled,
      })

      dispatch('removeBookingById', { bookingId: cancelBooking.bookingId })
    })
  },

  /**
   * @param {Object} data
   * @param {Booking} data.booking
   * @param {Object} data.cancellation
   */
  async cancelNaverBooking({ commit, dispatch }, data) {
    const booking = data.booking
    const cancellation = data.cancellation

    const response = await naverApi.cancelNaverBooking(cancellation)

    commit('patchBookingSet', {
      bookingId: booking.bookingId,
      status:    options.booking.booking_status.canceled,
    })

    const cancelRepeatBookings = response?.data?.result?.cancelRepeatBookings ?? []
    cancelRepeatBookings.forEach(cancelBooking => {
      commit('patchBookingSet', {
        bookingId: cancelBooking.bookingId,
        status:    options.booking.booking_status.canceled,
      })

      dispatch('removeBookingById', { bookingId: cancelBooking.bookingId })
    })

    return response?.data?.result
  },

  async noShowNaverBooking({ state, dispatch }, data) {
    const noShowInfo = data.noShowInfo

    const response = await naverApi.noShowNaverBooking(noShowInfo)
    const result = response?.data?.result

    const existedBooking = state.bookingSet[result.bookingId]

    await dispatch('updateBooking', {
      booking: {
        ...existedBooking,
        status:           result.status,
        bookingDateTS:    result.bookingDateTS,
        editedDateTimeTS: result.editedDateTimeTS,
        modificationDate: result.modificationDate,
      },
    })
  },

  async removeBooking({ commit }, { booking }) {
    const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()

    booking.bookedResources.forEach(async bookedResource => {
      const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

      if (store.hasModule(['_calendar', 'bookings', bookingItemModuleName])) {
        commit(`_calendar/bookings/${bookingItemModuleName}/removeItem`, booking, { root: true })
      }
    })
  },

  async removeBookingById({ dispatch, state }, { bookingId }) {
    const booking = state.bookingSet?.[bookingId]
    if (!booking) return

    dispatch('removeBooking', { booking })
  },

  async changeBooking({ commit, dispatch }, { booking, nextBooking }) {
    if (booking.bookingId !== nextBooking.bookingId) return

    /**
     * @description Checking if the nextBooking change date.
     * Removing the existed booking from all store
     */
    const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
    const nextBookingDateTS = convertTimestampToMomentUTC(nextBooking.bookingDateTS).startOf('day').unix()

    if (nextBookingDateTS !== bookingDateTS) {
      return await dispatch('removeBooking', { booking })
    }

    /**
     * @description Checking if the nextBooking only update time.
     * Don't need to removing booking from store
     */
    booking.bookedResources.forEach(bookedResource => {
      const existedBookedResource = nextBooking.bookedResources.find(nextBookedResource => {
        return bookedResource.bookingResourceSetupId === nextBookedResource.bookingResourceSetupId
      })

      /**
       * @description Removing the existed booking from store because the booking change booking resource
       */
      if (!existedBookedResource) {
        const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

        if (store.hasModule(['_calendar', 'bookings', bookingItemModuleName])) {
          commit(`_calendar/bookings/${bookingItemModuleName}/removeItem`, booking, { root: true })
        }
      }
    })
  },

  /**
   * @param {Object} data
   * @param {Booking} data.booking
   * @param {Booking} data.movingBooking
   */
  async moveBooking({ state, rootState, dispatch }, data) {
    /**@type {Booking} */
    const booking = data.booking.clone()

    const { calendarSetup } = data

    /**@type {Booking} */
    const movingBooking = data.movingBooking.clone()

    const [movingBookedResource] = movingBooking?.bookedResources ?? []

    if (!movingBookedResource) return

    const changingBooking = cloneDeep(state.bookingSet[booking.bookingId])

    for (let index = 0; index < changingBooking.bookedResources.length; index++) {
      const bookedResource = changingBooking.bookedResources[index]
      if (bookedResource.bookedResourceId !== movingBookedResource.bookedResourceId) {
        continue
      }

      changingBooking.bookedResources[index] = {
        ...bookedResource,
        startTime:              movingBookedResource.startTime,
        isNextDay:              movingBookedResource.isNextDay,
        resourceName:           movingBookedResource.resourceName,
        bookingResourceSetupId: movingBookedResource.bookingResourceSetupId,
      }

      break
    }

    const bookedResourcesChangingBooking = (changingBooking.bookedResources || [])
    if (bookedResourcesChangingBooking.length > 1) {
      const bookingDate = moment.unix(movingBooking.bookingDateTS).utc()
      const changingDate = moment.unix(changingBooking.bookingDateTS).utc()
      if (!changingDate.isSame(bookingDate, 'day')) {
        throw new Error(i18n.t('validate-message.specification.multi-resources-booking-can-not-moving-to-other-date', { date: bookingDate.format('YYYY-MM-DD') }))
      }

      const checkDuplicateResourceSameDay = uniqBy(bookedResourcesChangingBooking, 'bookingResourceSetupId')
      if (checkDuplicateResourceSameDay.length !== bookedResourcesChangingBooking.length) {
        throw new Error(i18n.t('bookings.can-not-merge-multi-resource-booking'))
      }
    }

    if (movingBooking.bookingDateTS !== changingBooking.bookingDateTS) {
      changingBooking.bookingDateTS = movingBooking.bookingDateTS
    }

    const modelBooking = Booking.build(changingBooking)
    modelBooking.sessionToken = rootState.authentication.user.session_token
    modelBooking.bookingDateTS = movingBooking?.bookingDateTS || booking?.bookingDateTS

    modelBooking.isBookingExceedsWorkHours = movingBooking.isBookingExceedsWorkHours
    modelBooking.mustCheckPerformanceResource = movingBooking.mustCheckPerformanceResource

    const now = convertDateToTimezone()

    modelBooking.editedDateTimeTS = convertDateToMomentUTC(now).unix()

    let updatedBookings = []

    const bookingResourceBooking = booking?.bookedResources[0]?.bookingResourceSetupId
    const movingBResourceBooking = movingBooking?.bookedResources[0]?.bookingResourceSetupId
    if (booking?.bookingSource === BOOKING_SOURCE.NAVER) {
      const payload = {
        bookingId:          booking.bookingId,
        ExtSystemBookingId: booking.extSystemBookingId,
        IsChangeResource:   bookingResourceBooking !== movingBResourceBooking,
        businessId:         calendarSetup?.booking_naver_link_setup?.businessId || 0,
      }
      updatedBookings = await modelBooking.updateBookingNaver(payload)
    } else {
      updatedBookings = await modelBooking.update()
    }

    updatedBookings.forEach(booking => {
      dispatch('updateBooking', { booking })
    })
  },

  async updateBooking({ state, commit, dispatch }, { booking }) {
    const existedBooking = state.bookingSet[booking.bookingId]

    if (existedBooking) {
      await dispatch('changeBooking', {
        nextBooking: booking,
        booking:     existedBooking,
      })
    }

    const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
    booking.bookedResources.forEach(async bookedResource => {
      const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

      await dispatch('setBookingResourceAvailable', {
        bookingDateTS,
        bookedResource,
      })

      if (!excludeBookingStatuses.includes(booking.status)) { // Canceled & No Booking
        commit(`_calendar/bookings/${bookingItemModuleName}/addOrUpdateItem`, {
          ...booking,
          bookedResources: [bookedResource],
        }, { root: true })
      } else {
        dispatch('removeBookingById', { bookingId: booking.bookingId })
      }
    })

    commit('setBookingSet', booking)
  },
  /**
   * @param {BookingDeposit} bookingDeposit
   */

  async updateBookingDepositToBooking({ state, dispatch }, bookingDeposit) {
    const existedBooking = cloneDeep(state.bookingSet[bookingDeposit.bookingId])
    if (!existedBooking) {
      return
    }
    existedBooking.bookingDeposit = bookingDeposit.clone()
    dispatch('updateBooking', {
      booking: existedBooking,
    })
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async addBookingDeposit({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.save()

    dispatch('updateBookingDepositToBooking', bookingDeposit)
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async updateBookingDeposit({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.update()

    dispatch('updateBookingDepositToBooking', bookingDeposit)
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async deleteBookingDeposit({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.delete()

    dispatch('updateBookingDepositToBooking', bookingDeposit)

    return bookingDeposit
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async addBookingDepositPayment({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.addPayment()

    dispatch('updateBookingDepositToBooking', bookingDeposit)
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async updateBookingDepositPayment({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.updatePayment()

    dispatch('updateBookingDepositToBooking', bookingDeposit)

    return bookingDeposit
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async deleteBookingDepositPayment({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.deletePayment()

    dispatch('updateBookingDepositToBooking', bookingDeposit)
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async addBookingDepositPaymentRefund({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.addPaymentRefund()

    dispatch('updateBookingDepositToBooking', bookingDeposit)

    return bookingDeposit
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async updateBookingDepositPaymentRefund({ dispatch, rootState }, data) {

    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.updatePaymentRefund()

    dispatch('updateBookingDepositToBooking', bookingDeposit)

    return bookingDeposit
  },

  /**
   * @param {Object} data
   * @param {BookingDeposit} data.bookingDeposit
   */
  async deleteBookingDepositPaymentRefund({ dispatch, rootState }, data) {
    const bookingDeposit = data.bookingDeposit

    bookingDeposit.shopId = rootState.authentication.shop.shop_id
    bookingDeposit.shopLocation = rootState.authentication.shop.shop_location
    bookingDeposit.sessionToken = rootState.authentication.user.session_token

    await bookingDeposit.deletePaymentRefund()

    dispatch('updateBookingDepositToBooking', bookingDeposit)

    return bookingDeposit
  },

  /**
   * @param {Object} data
   * @param {Number} data.status
   * @param {Number} data.bookingId
   */
  async updateBookingStatus({ dispatch, rootState }, data) {
    const shopId = rootState.authentication.shop.shop_id
    const sessionToken = rootState.authentication.user.session_token
    const shopLocation = rootState.authentication.shop.shop_location

    const payload = {
      status:    data.status,
      bookingId: data.bookingId,

      shopId,
      sessionToken,
      shopLocation,
      editedDateTimeTS: convertDateToMomentUTC().unix(),
    }

    const response = await updateBookingStatus(payload)
    const result = response?.data?.result

    const existedBooking = state.bookingSet[result.bookingId]
    if (!existedBooking) return

    if (excludeBookingStatuses.includes(result.status)) {
      dispatch('removeBookingById', { bookingId: result.bookingId })
      return
    }

    await dispatch('updateBooking', {
      booking: {
        ...existedBooking,
        status:           result.status,
        bookingSource:    result.bookingSource,
        bookingDateTS:    result.bookingDateTS,
        editedDateTimeTS: result.editedDateTimeTS,
        modificationDate: result.modificationDate,
      },
    })
  },

  async noShowBookingDepositPaid({ dispatch }, data) {
    const response = await noShowBookingDepositPaid(data)
    const result = response?.data?.result

    const existedBooking = state.bookingSet[result.bookingId]
    const clonedBooking = cloneDeep(existedBooking)
    if (result.bookingDeposit.bookingDepositPayment.bookingDepositPaymentRefund !== null || result.bookingDeposit.bookingDepositPayment.bookingDepositPaymentRefund !== undefined) {
      if (clonedBooking.extSystemBookingDescriptionBase) {
        clonedBooking.extSystemBookingDescriptionBase.refundAmount = result?.bookingDeposit?.bookingDepositPayment?.bookingDepositPaymentRefund?.amount || 0
        clonedBooking.extSystemBookingDescriptionBase.refundDateTimeTS = result?.bookingDeposit?.bookingDepositPayment?.bookingDepositPaymentRefund?.paidDateTimeTS || 0
      }
    }

    if (!existedBooking) return

    if (excludeBookingStatuses.includes(result.status)) {
      dispatch('removeBookingById', { bookingId: result.bookingId })
      return
    }

    await dispatch('updateBooking', {
      booking: {
        ...clonedBooking,
        bookingDeposit:   result.bookingDeposit,
        cancellationFee:  result.cancellationFee,
        status:           result.status,
        bookingSource:    result.bookingSource,
        bookingDateTS:    result.bookingDateTS,
        editedDateTimeTS: result.editedDateTimeTS,
        modificationDate: result.modificationDate,
      },
    })
  },

  async moveBookingToSlot({ dispatch }, { booking, moveToSlot, calendarSetup }) {
    const { date, startTime, resource } = moveToSlot

    const mBooking = Booking.build(booking)
    mBooking.isBookingExceedsWorkHours = booking.isBookingExceedsWorkHours
    mBooking.mustCheckPerformanceResource = booking.mustCheckPerformanceResource

    const clonedBooking = mBooking.clone()

    clonedBooking.bookingDateTS = convertDateToMomentUTC(date).unix()
    clonedBooking.bookedResources[0].bookingResourceSetupId = resource.id

    clonedBooking.bookedResources[0].resourceId = resource.resource_id
    clonedBooking.bookedResources[0].resourceName = resource.resource_name

    clonedBooking.bookedResources[0].startTime = convertMinutesToFormattedTime(startTime)
    clonedBooking.bookedResources[0].isNextDay = !!(Math.floor(startTime / MINUTES_OF_24H))

    await dispatch('moveBooking', {
      booking:       mBooking,
      movingBooking: clonedBooking,
      calendarSetup,
    })
  },

  /**
   * @param {Object} data
   * @param {Object} data.client
   * @param {String} data.bookingId
   */
  async connectClient({ rootState, dispatch }, data) {
    const client = data.client
    const bookingId = data.bookingId

    const payload = {
      bookingId,
      clientId:                 client.clientId,
      clientName:               client.clientName,
      isAddNewClient:           !!client.isAddNewClient,
      clientMemberNumber:       client.clientMemberNumber || client.memberNumber,
      clientMobileNumber:       client.clientMobileNumber || client.mobileNumber,
      clientShopId:             client.clientShopId,
      clientRegistrationDateTS: client.clientRegistrationDateTS,
      clientShopName:           rootState.authentication.shop.shop_name,
    }
    payload.shopId = rootState.authentication.shop.shop_id
    payload.shopLocation = rootState.authentication.shop.shop_location
    payload.sessionToken = rootState.authentication.user.session_token

    const now = convertDateToTimezone()
    payload.editedDateTimeTS = convertDateToMomentUTC(now).unix()

    const response = await updateBookingClient(payload)
    const updatedBookings = response?.data?.result?.bookings ?? []

    updatedBookings.forEach(updatedBooking => {
      dispatch('updateBooking', { booking: updatedBooking })
    })

    return response
  },

  /**
   * @param {Object} data
   * @param {Number} data.clientId
   * @param {String} data.clientName
   * @param {Number} data.clientShopId
   * @param {String} data.clientShopName
   * @param {Number} data.clientMemberNumber
   * @param {Number} data.clientMobileNumber
   * @param {Number} data.clientRegistrationDateTS
  */
  async updateClientInBookings({ state, dispatch }, data) {
    Object.entries(state.bookingSet).forEach(([, booking]) => {
      if (booking.clientId !== data.clientId || (booking.clientId === data.clientId && booking.status === options.booking.booking_status.checked_out)) return

      dispatch('updateBooking', {
        booking: {
          ...booking,
          ...data,
        },
      })
    })
  },

  async disconnectClientFromNaver({ state, dispatch }, { shopId, bookingId, externalSystemBookingId }) {
    const originalBooking = cloneDeep(state.bookingSet[bookingId])
    if (!originalBooking) return

    if (originalBooking.bookingSource !== options.booking.booking_source.naver) {
      return
    }

    const response = await disconnectClientNaverBooking({
      shopId,
      bookingId,
      externalSystemBookingId,
    })

    const result = response?.data?.result

    originalBooking.notes = result.notes
    originalBooking.shopId = result.shopId
    originalBooking.clientId = result.clientId
    originalBooking.clientName = result.clientName
    originalBooking.clientMemberNumber = result.clientId
    originalBooking.clientMobileNumber = result.clientMobileNumber

    dispatch('updateBooking', {
      booking: originalBooking,
    })

    return result
  },

  deleteSaveDraft({ state, commit, dispatch }, data) {
    const booking = state.bookingSet[data.bookingId]

    if (!booking) {
      return
    }

    if (booking.draftDocumentId !== data.salesDraftId) {
      return
    }

    booking.draftDocumentId = 0

    const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
    booking.bookedResources.forEach(async bookedResource => {
      const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`

      await dispatch('setBookingResourceAvailable', {
        bookingDateTS,
        bookedResource,
      })

      if (!excludeBookingStatuses.includes(booking.status)) { // Canceled & No Booking
        commit(`_calendar/bookings/${bookingItemModuleName}/addOrUpdateItem`, booking, { root: true })
      }
    })

    commit('setBookingSet', booking)
  },
}

const modules = {}

export default {
  state,
  getters,
  actions,
  modules,
  mutations,
  namespaced: true,
}
