// Utilities
import i18n from 'Translate'
import {guid} from 'CommonHelpers'
import {options} from 'OptionsHelpers'
import router from 'Modules/router/index'
import {convertDateToMomentUTC, convertMinutesToFormattedTime} from 'Modules/calendar/utils/index'

// Sub modules
import recentlyClient from 'Modules/calendar/store/recentlyClient'
import {generateModule as generateClientModule} from 'Modules/clients/store/client'
import {generateModule as generateBookingModule} from 'Modules/calendar/store/booking'

// Models
import Client from 'Models/client/client'
import Booking from 'Models/booking/booking'
import Waiting from 'Models/waiting/waiting.js'
import BookedResource from 'Models/booking/bookedResource'

// Validator
import BookingValidator from 'Validators/booking/bookingValidator'

// Constants
import {MAX_ITEMS_RESOURCE} from 'Modules/calendar/constant/index.js'
import {BOOKING_STATUS, CLIENT_ERROR_CODES, CLIENT_STATUS, MINUTES_OF_24H, PAGINATION} from 'Constant'

const MAX_NUMBER_BOOKING_OF_CELL = 5

const state = {
  visible:   false,
  isWalking: false,

  /**
   * @description bookingResourceSetupId is supported for edit a no-show/checked out booking when click a booking on calendar
   */
  bookingResourceSetupId: 0,

  /**@description isClientCompletelyDeleted is supported for editing a booking of deleted client */
  isClientCompletelyDeleted: false,

  /**
   * @description addingCallback and updatingCallback will called after submiting a <booking-action />
   * which is out of scope of the calling component
   *
   * Example:
   * <div>
   *    <booking-action ... />
   *
   *    <booking-list ... />
   * </div>
   *
   * @description In the booking-list component has the button "Add booking" and It will trigger open a booking-action modal
   * When a user click the "Add booking" button.
   *
   * async handleAddbookingClick() {
   *    const result = await this.openbookingAction()
   *    @description result will be null when the user click cancel Or be addedbooking if the user completely create a booking
   * }
   * */
  addingCallback:                   null,
  updatingCallback:                 null,
  bookingClient:                    null,
  activeWizardStep:                 'client',
  isUnregisteredClientCheckedStore: false,
}

const getters = {}

const mutations = {
  setBookingClients(state, bookingClient) {
    state.bookingClient = bookingClient
  },

  setVisible(state, visible) {
    state.visible = visible
  },

  setAddingCallback(state, addingCallback) {
    state.addingCallback = addingCallback
  },

  setUpdatingCallback(state, updatingCallback) {
    state.updatingCallback = updatingCallback
  },

  setBookingResourceSetupId(state, bookingResourceSetupId) {
    state.bookingResourceSetupId = bookingResourceSetupId
  },

  setClientCompletelyDeleted(state, isClientCompletelyDeleted) {
    state.isClientCompletelyDeleted = isClientCompletelyDeleted
  },

  setActiveWizardStep(state, activeWizardStep) {
    state.activeWizardStep = activeWizardStep
  },

  setIsUnregisteredClientCheckedStore(state, isUnregisteredClientChecked) {
    state.isUnregisteredClientCheckedStore = isUnregisteredClientChecked
  },
}

const actions = {
  async addBooking({ state, commit, dispatch }) {
    const bookings = await state.booking.save()

    bookings.forEach(booking => dispatch('_calendar/bookings/addBooking', { booking }, {
      root: true,
    }))

    if (state.booking.clientId) {
      commit('recentlyClient/setRecentlyClient', {
        clientId:     state.booking.clientId,
        clientName:   state.booking.clientName,
        clientShopId: state.booking.clientShopId,
      })
    }

    if (state.addingCallback) {
      state.addingCallback(state.booking)
      commit('setAddingCallback', null)
    }

    return state.booking.clone()
  },

  async updateBookingNaver({state, commit, dispatch}, data) {
    const { isExceedWorkingHour, payload } = data
    commit('booking/setBooking', {...state.booking, isBookingExceedsWorkHours: isExceedWorkingHour})
    const bookings = await state.booking.updateBookingNaver(payload)

    bookings.forEach(booking => dispatch('_calendar/bookings/updateBooking', { booking }, {
      root: true,
    }))

    commit('recentlyClient/setRecentlyClient', {
      clientId:     state.booking.clientId,
      clientName:   state.booking.clientName,
      clientShopId: state.booking.clientShopId,
    })

    if (state.updatingCallback) {
      state.updatingCallback(state.booking)
      commit('setUpdatingCallback', null)
    }

    return state.booking.clone()
  },

  async updateBooking({ state, commit, dispatch }, exceedWorkingHour = false) {
    commit('booking/setBooking', {...state.booking, isBookingExceedsWorkHours: exceedWorkingHour})
    const bookings = await state.booking.update()

    bookings.forEach(booking => dispatch('_calendar/bookings/updateBooking', { booking }, {
      root: true,
    }))

    commit('recentlyClient/setRecentlyClient', {
      clientId:     state.booking.clientId,
      clientName:   state.booking.clientName,
      clientShopId: state.booking.clientShopId,
    })

    if (state.updatingCallback) {
      state.updatingCallback(state.booking)
      commit('setUpdatingCallback', null)
    }

    return state.booking.clone()
  },

  validateBooking({ state }) {
    const client = state.client
    const booking = state.booking
    if(!booking.clientId) {
      return booking.validate()
    }

    const prepaidServiceByBooking = (booking.bookedResources || []).reduce((repaidServices, bookedResource) => {
      const bookedItems = bookedResource?.bookedItems || []
      return repaidServices.concat(bookedItems.filter(bookedItem => bookedItem.deductedPrepaidGoodsRef))
    }, [])

    if(!prepaidServiceByBooking.length) {
      return booking.validate()
    }

    const allPrepaidServiceByClient = client?.prepaidServices?.items
    const isValid = BookingValidator.validateBookingPrepaidService({
      booking,
      prepaidServiceByBooking,
      allPrepaidServiceByClient,
    })

    if(!isValid) {
      throw new Error(i18n.t('bookings.remaining-quantity-of-prepaid-ticket-not-enough'))
    }
    return booking.validate()
  },

  async getClient({ state, dispatch, commit }, { clientId, shopId, skipUncompletedDeleteClient = false, includeRecentInfo = false }) {
    try {
      const client = await dispatch('client/getClient', { clientId, shopId, includeRecentInfo })

      /**@description If an user is temporary deleted, show alert "User is not existed" */
      if (!skipUncompletedDeleteClient && client.status === CLIENT_STATUS.UNCOMPLETED_DELETE) {
        throw new Error(i18n.t('clients.client-not-exist'))
      }

      dispatch('client/getClientAccount')

      if (client) {
        if (client.clientId !== state.client.clientId) {
          commit('client/bookings/setItems', [])
          commit('client/prepaidCards/setItems', [])
          commit('client/prepaidServices/setItems', [])
        }

        commit('booking/setClient', {
          ...client,
          clientShopId:             client.shopId,
          clientShopName:           client.shopName,
          clientMobileNumber:       client.mobileNumber,
          clientMemberNumber:       client.memberNumber,
          clientRegistrationDateTS: convertDateToMomentUTC(client.registrationDate).unix(),
        })
      }

      return client
    } catch (error) {
      /**@description If user is adding a booking, throw error immediately when select a completely deleted client */
      if (!state.booking.bookingId) {
        throw error
      }

      if (!error.isApiError() || !error.codes.includes(CLIENT_ERROR_CODES.CLN02R)) {
        throw error
      }

      const client = new Client()
      client.clientId = state.booking.clientId
      client.shopId = state.booking.clientShopId
      client.clientName = state.booking.clientName
      client.shopName = state.booking.clientShopName
      client.memberNumber = state.booking.clientMemberNumber
      client.mobileNumber = state.booking.clientMobileNumber
      client.clientInputDateTimeTS = state.booking.clientRegistrationDateTS

      commit('client/setClient', client)
      commit('setClientCompletelyDeleted', true)
    }
  },

  async getRecentlyClient({ dispatch, state, rootState }) {
    await dispatch('getClient', {
      skipUncompletedDeleteClient: true,
      clientId:                    state.recentlyClient.clientId,
      shopId:                      rootState.authentication.shop.shop_id,
      includeRecentInfo:           true,
    })
  },

  /**
   * @description This action openBookingActionBySlot is used for add a booking, if you had
   * date, startTime, resource, client
   *
   * @param {any} param0
   * @param {Object} param1
   * @param {Date} param1.date
   * @param {Client} param1.client
   * @param {Object} param1.resource
   * @param {String} param1.startTime 00:00
   */
  async openBookingActionBySlot({ rootState, dispatch }, { date, startTime, resource, client, isWalking = false }) {
    console.log('1', date, startTime, resource, client, isWalking)
    console.log('2', rootState._calendar.timeSlot)
    const bookedResource = new BookedResource()
    bookedResource.bookedResourceId = guid()

    bookedResource.bookingResourceSetupId = resource.id
    bookedResource.resourceId = resource.resource_id
    bookedResource.resourceName = resource.resource_name
    bookedResource.estimatedTime = rootState._calendar.timeSlot
    bookedResource.startTime = convertMinutesToFormattedTime(startTime)
    bookedResource.isNextDay = !!(Math.floor(startTime / MINUTES_OF_24H))

    bookedResource.setDefaultEstimatedTime(rootState._calendar.timeSlot)

    const booking = new Booking()
    booking.addBookedResource(bookedResource)
    booking.bookingDateTS = date
    booking.bookingClientType = isWalking ? options.booking_client_type.walking_client : options.booking_client_type.booked_client

    if(client === undefined && state.bookingClient !== null) {
      client = state.bookingClient
    }
    if (client) {
      booking.clientId = client.clientId
      booking.clientShopId = client.shopId
      booking.clientShopName = client.shopName
      booking.clientMemberNumber = client.memberNumber
      booking.clientMobileNumber = client.mobileNumber
      booking.clientRegistrationDateTS = client.clientInputDateTimeTS
    }

    return await dispatch('openBookingAction', booking)
  },

  /**
   * @description This action openBookingAction is used for add a booking which is customized yourself
   */
  async openBookingAction({ rootState, commit, dispatch }, booking = new Booking()) {
    booking.createdById = rootState?.authentication?.user?.user_id
    booking.createdByName = rootState?.authentication?.user?.user_name
    booking.sessionToken = rootState?.authentication?.user?.session_token

    booking.shopId = rootState?.authentication?.shop?.shop_id
    booking.chainId = rootState?.authentication?.shop?.chain_id
    booking.shopName = rootState?.authentication?.shop?.shop_name
    booking.branchNumber = rootState?.authentication?.shop?.branch_number
    booking.shopLocation = rootState?.authentication?.shop?.shop_location

    const shopId = booking.shopId
    const clientId = booking.clientId

    /**
     * @description Should set a booking data before setClient
     */
    commit('booking/setBooking', booking)

    const currentRoute = router.app.$route

    if(currentRoute.query.clientId && currentRoute.query.clientShopId) {
      const clientIdQuery = parseInt(currentRoute.query.clientId)
      const shopIdQuery = parseInt(currentRoute.query.clientShopId)
      if(clientIdQuery === 0) {
        booking.clientMobileNumber = currentRoute.query.mobileNumber
        commit('booking/setBooking', booking)

      } else {
        await dispatch('getClient', { clientId: clientIdQuery, shopId: shopIdQuery, includeRecentInfo: true })
        dispatch('client/getClientAccount', { clientIdQuery, shopIdQuery })
      }
    }

    if (booking.clientId) {
      await dispatch('getClient', { clientId, shopId, includeRecentInfo: true })
      dispatch('client/getClientAccount', { clientId, shopId })
    }

    commit('setVisible', true)

    return addingCallback => {
      commit('setAddingCallback', addingCallback)
    }
  },

  /**
   * @param {Object} data
   * @param {Booking} data.booking
   * @param {Boolean} data.skipClient
   * @param {Boolean} data.skipBookedItems
   * @param {Number} data.bookingResourceSetupId
   */
  async openBookingActionForUpdating({ rootState, commit, dispatch }, data) {
    const booking = data.booking
    const skipClient = data.skipClient ?? false
    const skipBookedItems = data.skipBookedItems ?? false

    const shopId = booking.shopId
    const clientId = booking.clientId
    const bookingId = booking.bookingId

    booking.sessionToken = rootState?.authentication?.user?.session_token
    booking.shopLocation = rootState?.authentication?.shop?.shop_location
    booking.bookedResources.forEach(bookedResource => bookedResource.setDefaultEstimatedTime(rootState._calendar.timeSlot))

    if (data.bookingResourceSetupId) {
      commit('setBookingResourceSetupId', data.bookingResourceSetupId)
    }

    /**
     * @description Should set a booking data before setClient
     */

    commit('booking/setBooking', booking)

    if (booking.clientId && !skipClient) {
      await dispatch('getClient', { clientId, shopId, includeRecentInfo: true })
    }

    if (!skipBookedItems) {
      if (bookingId) {
        await dispatch('booking/syncBookedItemsEstimatedTimeWithSystem')
      }

      let hasDeductServiceItem = false
      const bookedResources = booking.bookedResources || []
      for(const bookedResource of bookedResources) {
        const bookedItems = bookedResource.bookedItems || []
        for(const bookedItem of bookedItems) {
          if(bookedItem.deductedPrepaidGoodsRef) {
            hasDeductServiceItem = true
            break
          }

          if(hasDeductServiceItem) {
            break
          }
        }
      }

      if(hasDeductServiceItem) {
        const response = await dispatch('client/getClientPrepaidServices', {
          pageSize: PAGINATION.MAX,
        })

        const allPrepaidServicesByClient = response?.data?.result?.items || []

        await dispatch('booking/updateBookedResourceForUpdatingBooking', {
          clientPrepaidServices: allPrepaidServicesByClient,
        })
      }
    }

    commit('setVisible', true)

    return updatingCallback => {
      commit('setUpdatingCallback', updatingCallback)
    }
  },

  async openBookingActionFromWaiting({ dispatch, rootState, rootGetters, commit }, data) {
    const date = data?.date
    const resource = data?.resource
    const startTime = data?.startTime

    /**@description Check add a waiting duplicate with bookings */
    const bookingItemModuleName = `${date.unix()}_${resource.id}`
    const itemGroups = rootGetters[`_calendar/bookings/${bookingItemModuleName}/itemGroups`]
    const bookingHasDuplicate = itemGroups.find(group => startTime >= group.startTime && startTime < group.endTime && group.items.length)

    const hasDuplicateBooking = itemGroups.some((group) => {
      return data.startTime >= group.startTime && data.startTime < group.endTime && group.items.length > 0
    })

    const bookingRangeTimes = bookingHasDuplicate?.items.map(booking => {
      const bookingResource = booking?.bookedResources[0]
      const bookingStartTime = BookedResource.getStartTimeInMinutes({
        startTime: bookingResource?.startTime,
        isNextDay: bookingResource?.isNextDay,
      })
      const bookingEndTime = bookingStartTime + booking?.bookedResources[0]?.estimatedTime

      return [bookingStartTime, bookingEndTime]
    })

    const bookingWithRange = []
    if (bookingRangeTimes && bookingRangeTimes.length) {
      bookingRangeTimes.forEach((range, index) => {
        const [bookingStartTime, bookingEndTime] = range
        if (startTime >= bookingStartTime && startTime < bookingEndTime) {
          bookingWithRange.push(bookingHasDuplicate.items[index])
        }
      })
    }

    const bookingSlotWithNonNoShowStatus = bookingWithRange.some(booking => {
      return booking.status !== BOOKING_STATUS.NO_SHOW
    })

    if (rootState._calendar.allowDuplicateBookings) {
      if (data.bookings.length >= MAX_NUMBER_BOOKING_OF_CELL) {
        throw new Error(i18n.t('bookings.duplicate-bookings-is-not-allowed'))
      }
    } else {
      if (hasDuplicateBooking && bookingSlotWithNonNoShowStatus) {
        throw new Error(i18n.t('bookings.duplicate-bookings-is-not-allowed'))
      }
    }
    /** END Check add a waiting duplicate with bookings */

    /**@type {Waiting} */
    const waiting = Waiting.build(data?.waiting)

    /**@type {Booking} */
    const booking = waiting.convertToBooking()

    booking.createdById = rootState?.authentication?.user?.user_id
    booking.createdByName = rootState?.authentication?.user?.user_name
    booking.sessionToken = rootState?.authentication?.user?.session_token

    booking.shopId = rootState?.authentication?.shop?.shop_id
    booking.chainId = rootState?.authentication?.shop?.chain_id
    booking.shopName = rootState?.authentication?.shop?.shop_name
    booking.shopLocation = rootState?.authentication?.shop?.shop_location

    const shopId = booking.shopId
    const clientId = booking.clientId

    booking.bookedResources[0].bookedResourceId = guid()
    booking.bookedResources[0].startTimeInMinutes = startTime
    booking.bookedResources[0].bookingResourceSetupId = resource.id

    booking.bookedResources[0].resourceId = resource.resource_id
    booking.bookedResources[0].resourceName = resource.resource_name

    booking.bookingDateTS = date.startOf('day').unix()
    booking.bookedResources[0].estimatedTime = Math.max(rootState._calendar.timeSlot, booking.bookedResources[0].estimatedTime)

    /**
     * @description Should set a booking data before setClient
     */
    commit('booking/setBooking', booking)

    if(booking.clientId) {
      await dispatch('getClient', { clientId, shopId, includeRecentInfo: true })
      dispatch('client/getClientAccount', { clientId, shopId })
    }

    if(booking.clientId) {
      const bookedItems = booking.bookedResources[0]?.bookedItems || []
      const hasServiceDeduct = bookedItems.some(bookedItem => bookedItem.deductedPrepaidGoodsRef)
      if(hasServiceDeduct) {
        const response = await dispatch('client/getClientPrepaidServices', {
          pageSize: PAGINATION.MAX,
        })

        const allPrepaidServicesByClient = response?.data?.result?.items || []

        await dispatch('booking/arrangePrepaidServiceToBookedResource', { allPrepaidServicesByClient })
      }
    }

    commit('setVisible', true)

    return addingCallback => {
      commit('setAddingCallback', addingCallback)
    }
  },

  async closeBookingAction({ commit }) {
    const client = new Client()
    const booking = new Booking()

    commit('setVisible', false)
    commit('setBookingResourceSetupId', 0)
    commit('setClientCompletelyDeleted', false)

    commit('client/setClient', client)
    commit('booking/setBooking', booking)

    commit('client/bookings/setItems', [])
    commit('client/prepaidCards/setItems', [])
    commit('client/prepaidServices/setItems', [])

    commit('setAddingCallback', null)
    commit('setUpdatingCallback', null)
  },

  async resetBooking({ commit }) {
    const booking = new Booking()
    commit('booking/setBooking', booking)
  },

  /**
   * @param {Object} data
   * @param {Array} data.bookingItems
   * @param {BookedResource} data.bookedResource
   */
  async rebook({ dispatch }, data) {
    /**@type {bookingItems}*/
    const bookingItems = data.bookingItems
    const bookedResource = data.bookedResource
    const itemsCanBeAdded = MAX_ITEMS_RESOURCE - (bookingItems || []).length

    const bookedItems = bookedResource.bookedItems

    if(itemsCanBeAdded < bookedItems.length) {
      throw new Error(i18n.t('bookings.warning_can_not_exceed_booked_items_max', {
        items_max: MAX_ITEMS_RESOURCE,
      }))
    }

    const deductServiceItems = data.bookingItems.filter(bookingItem => !!bookingItem.deductedPrepaidGoodsRef)

    if(deductServiceItems.length) {
      const response = await dispatch('client/getClientPrepaidServices', {
        pageSize: PAGINATION.MAX,
      })

      const allPrepaidServicesByClient = response?.data?.result?.items || []
      const allPrepaidServicesIds = Object.values(allPrepaidServicesByClient || {}).map(prepaidService => prepaidService?.id)

      for(const deductServiceItem of deductServiceItems) {
        if(allPrepaidServicesIds.includes(deductServiceItem?.deductedPrepaidGoodsRef)) {
          continue
        }

        throw new Error(i18n.t('bookings.invalid-booking-prepaid-services-rebook-warning'))
      }

      await dispatch('booking/rebookBookedItemsToBookedResource', {
        bookingItems:          bookingItems,
        bookedResource:        data.bookedResource,
        clientPrepaidServices: allPrepaidServicesByClient,
      })

      return
    }

    await dispatch('booking/addBookedItemsToBookedResource', {
      bookedItems:    data.bookingItems,
      bookedResource: data.bookedResource,
    })
  },

  async refreshClientInformation({ state, dispatch }) {
    const payload = {
      clientId:          state.booking.clientId,
      shopId:            state.booking.clientShopId,
      includeRecentInfo: true,
    }

    await Promise.all([
      dispatch('getClient', payload),
      dispatch('client/account/getClientAccount', payload),
    ])

    dispatch('client/pourAccountInfoClient')
  },

  async updateClientNotes({ state, dispatch }, data) {
    await dispatch('client/updateClientNotes', {
      notes:    data.notes,
      clientId: state.booking.clientId,
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
  modules: {
    recentlyClient,
    client:  generateClientModule(),
    booking: generateBookingModule(),
  },
  namespaced: true,
}
