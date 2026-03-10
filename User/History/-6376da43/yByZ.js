// Utilities
import i18n from 'Translate'
import { guid } from 'CommonHelpers'

// Models
import Service from 'Models/goods/service'
import Booking from 'Models/booking/booking'
import BookedItem from 'Models/booking/bookedItem'
import RepeatBooking from 'Models/booking/repeatBooking'
import BookedResource from 'Models/booking/bookedResource'
import BookingDeposit from 'Models/booking/bookingDeposit'
// eslint-disable-next-line no-unused-vars
import ClientPrepaidService from 'Models/client/clientPrepaidService'

// Apis
import { getServiceForBookingById } from 'Modules/api/goods/service-api'
import { disconnectClientNaverBooking } from 'Modules/api/booking/booking-api'

// Constants
import { options } from 'OptionsHelpers'
import { BOOKING_ITEM_TYPE, ENUM_NO_LIMIT } from 'Constant'
import { MAX_ITEMS_RESOURCE } from 'Modules/calendar/constant/index.js'

export const generateModule = () => {
  const state = new Booking()

  const getters = {
    preferredStaffIdForBooking(state, getters, rootState) {
      if (state.bookedResources?.length === 0) return 0

      const selectedResource = rootState._calendar.bookingResources.find(bookingResources => {
        return bookingResources.id == state.bookedResources[0]?.bookingResourceSetupId
      })

      return selectedResource?.resource_id ?? 0
    },
  }

  const mutations = {
  /**@param {Booking} state */
    setBooking(state, booking = new Booking()) {
      state.copy(booking)
    },

    setSalesId(state = new Booking, salesId) {
      state.salesId = salesId
    },

    setStatus(state = new Booking, status) {
      state.status = status
    },

    setDraftDocumentId(state = new Booking, draftDocumentId) {
      state.draftDocumentId = draftDocumentId
    },

    setClient(state = new Booking(), client) {
      state.clientId = client.clientId
      state.clientName = client.clientName
      state.clientShopId = client.clientShopId
      state.clientShopName = client.clientShopName
      state.clientMemberNumber = client.clientMemberNumber
      state.clientMobileNumber = client.clientMobileNumber
      state.clientRegistrationDateTS = client.clientRegistrationDateTS
    },

    removeClient(state = new Booking()) {
      state.clientId = 0
      state.clientName = ''
      state.clientShopId = ''
      state.clientShopName = ''
      state.clientMemberNumber = ''
      state.clientMobileNumber = ''
      state.clientRegistrationDateTS = null
    },

    setClientName(state = new Booking, clientName) {
      state.clientName = clientName
    },

    setClientMobileNumber(state = new Booking, clientMobileNumber) {
      state.clientMobileNumber = clientMobileNumber
    },

    setIsVip(state = new Booking(), isVip) {
      state.isVip = isVip
    },

    setIsMember(state = new Booking(), isMember) {
      state.isMember = isMember
    },

    setConfirmed(state = new Booking(), confirmed) {
      state.confirmed = confirmed
    },

    setSendMessages(state = new Booking(), sendMessages) {
      state.sendMessages = sendMessages
    },

    setDisplayColor(state = new Booking(), displayColor) {
      state.displayColor = displayColor
    },

    setIsDepositRequired(state = new Booking(), isDepositRequired) {
      state.isDepositRequired = isDepositRequired
    },

    // Set client visitor to handle refreshClientInformation
    setClientVisitor(state = new Booking(), clientVisitor) {
      state.clientVisitor = clientVisitor
    },

    setClientId(state = new Booking(), clientId) {
      state.clientId = clientId
    },

    addBookedResource(state = new Booking, bookedResource = new BookedResource) {
      console.log('addBookedResource', bookedResource)
      state.bookedResources.push(bookedResource)
    },

    updateBookedResource(state = new Booking, bookedResource = new BookedResource) {
      const foundBookedResourceIndex = state.bookedResources.findIndex(_bookedResource => {
        return _bookedResource.bookedResourceId === bookedResource.bookedResourceId
      })

      state.bookedResources[foundBookedResourceIndex]?.copy(bookedResource)
    },

    removeBookedResource(state = new Booking, bookedResource = new BookedResource) {
      const foundBookedResourceIndex = state.bookedResources.findIndex(_bookedResource => {
        return _bookedResource.bookedResourceId === bookedResource.bookedResourceId
      })

      state.bookedResources.splice(foundBookedResourceIndex, 1)
    },

    setRepeatBooking(state = new Booking, repeatBooking = new RepeatBooking) {
      state.repeatBooking = repeatBooking
    },

    setNotes(state = new Booking, notes) {
      state.notes = notes
    },

    setBookingClientType(state = new Booking, bookingClientType) {
      state.bookingClientType = bookingClientType
      if (bookingClientType === options.booking_client_type.walking_client) {
        state.sendMessages = false
        state.repeatBooking = null
      } else {
        state.sendMessages = true
      }
    },

    setCreatedDateTimeTS(state = new Booking, createdDateTimeTS) {
      state.createdDateTimeTS = createdDateTimeTS
    },

    setEditedDateTimeTS(state = new Booking, editedDateTimeTS) {
      state.editedDateTimeTS = editedDateTimeTS
    },

    setBookingDeposit(state = new Booking, bookingDeposit = new BookingDeposit()) {
      state.bookingDeposit = bookingDeposit
    },

    setSessionToken(state = new Booking(), sessionToken) {
      state.sessionToken = sessionToken
    },

    setBookingDateTS(state = new Booking(), bookingDateTS) {
      state.bookingDateTS = bookingDateTS
    },

    setBookingPerformanceResource(state = new Booking(), bookingPerformanceResource) {
      state.mustCheckPerformanceResource = bookingPerformanceResource
    },

    setBookingExceedsWorkHours(state = new Booking(), isBookingExceedsWorkHours) {
      state.isBookingExceedsWorkHours = isBookingExceedsWorkHours
    },

    setMustCheckPerformanceResource(state = new Booking(), mustCheckPerformanceResource) {
      state.mustCheckPerformanceResource = mustCheckPerformanceResource
    },

    resetBookedResourceItems(state = new Booking()) {
      state.bookedResources.forEach(bookedResource => {
        bookedResource.bookedItems = []
      })
    },
  }

  const actions = {
    async addBookedResource({ commit }, bookedResource = new BookedResource()) {
      commit('addBookedResource', bookedResource)
    },

    async updateBookedResource({ commit }, bookedResource = new BookedResource()) {
      commit('updateBookedResource', bookedResource)
    },

    async removeBookedResource({ commit }, bookedResource = new BookedResource()) {
      commit('removeBookedResource', bookedResource)
    },

    async addBookedItemsToBookedResource({ commit }, { bookedItems = [], bookedResource = new BookedResource() }) {
    /** @type {BookedResource} */
      const clonedBookedResource = bookedResource.clone()

      clonedBookedResource.bookedItems = [
        ...clonedBookedResource.bookedItems,
        ...bookedItems.map(bookedItem => {

          bookedItem.setIsNew(true)
          bookedItem.bookedItemId = guid()

          return bookedItem
        }),
      ]
      clonedBookedResource.estimatedTime = clonedBookedResource.bookedItemsEstimatedTime
      commit('updateBookedResource', clonedBookedResource)
    },

    async removeBookedItemFromBookedResource({ commit, dispatch }, { bookedItem = new BookedItem(), bookedResource = new BookedResource() }) {
    /** @type {BookedResource} */
      const clonedBookedResource = bookedResource.clone()

      const foundBookedItemIndex = clonedBookedResource.bookedItems.findIndex((_bookedItem = new BookedItem()) => {
        return _bookedItem.bookedItemId === bookedItem.bookedItemId
      })

      clonedBookedResource.bookedItems.splice(foundBookedItemIndex, 1)
      clonedBookedResource.estimatedTime = clonedBookedResource.bookedItemsEstimatedTime

      commit('updateBookedResource', clonedBookedResource)

      if (bookedItem.bookedType === BOOKING_ITEM_TYPE.SERVICE_ITEM && bookedItem.deductedPrepaidGoodsRef > 0) {
        dispatch('calculateBookedItemDeductUsingTimes', { removedBookedItem: bookedItem })
      }
    },

    /**
   * @param {Object} data
   * @param {BookedItem} data.removedBookedItem
   */
    calculateBookedItemDeductUsingTimes({ state, commit }, data) {
      const removedBookedItem = data.removedBookedItem

      /**@type {Array<BookedResource>} */
      const bookedResources = state.bookedResources ?? []
      for(let bookedResource of bookedResources) {
      /**@type {BookedResource} */
        const clonedBookedResource = bookedResource.clone()

        if (clonedBookedResource.bookedItems.length == 0) continue

        for (let /**@type {BookedItem}*/bookedItem of clonedBookedResource.bookedItems) {
          if (
            bookedItem.bookedType === BOOKING_ITEM_TYPE.BOOKING_ITEM ||
          bookedItem.deductedPrepaidGoodsRef !== removedBookedItem.deductedPrepaidGoodsRef
          ) {
            continue
          }

          if (bookedItem.deductedPrepaidGoodsRefUsingTimes > removedBookedItem.deductedPrepaidGoodsRefUsingTimes) {
            bookedItem.deductedPrepaidGoodsRefUsingTimes--
          }
        }

        commit('updateBookedResource', clonedBookedResource)
      }
    },

    /**
   * @param {Object} data
   * @param {Booking} data.booking
   */
    async getBookedItemsInformation(context, data) {
    /**@type {Booking} */
      const booking = data.booking

      return await booking.getBookedItemsInformation()
    },

    async syncBookedItemsEstimatedTimeWithSystem({ state, dispatch }) {
    /**@type {Booking} */
      const booking = state.clone()
      const { serviceByIds, bookingItemByIds } = await dispatch('getBookedItemsInformation', { booking })

      /**@type {Array<BookedResource>} */
      const bookedResources = booking.bookedResources ?? []
      bookedResources.forEach(bookedResource => {
        const clonedBookedResource = bookedResource.clone()

        /**@type {Array<BookedItem>} */
        const bookingItems = clonedBookedResource.bookedItems
        const clonedBookingItems = bookingItems.map(bookedItem => {
          const clonedBookedItem = bookedItem.clone()
          if (clonedBookedItem.bookedType === BOOKING_ITEM_TYPE.SERVICE_ITEM && serviceByIds[clonedBookedItem.bookedRefId]) {
            clonedBookedItem.setEsimatedTime(serviceByIds[clonedBookedItem.bookedRefId].estimatedTime ?? 0)
          }
          if (clonedBookedItem.bookedType === BOOKING_ITEM_TYPE.BOOKING_ITEM && bookingItemByIds[clonedBookedItem.bookedRefId]) {
            clonedBookedItem.setEsimatedTime(bookingItemByIds[clonedBookedItem.bookedRefId].estimatedTime ?? 0)
          }

          return clonedBookedItem
        })

        clonedBookedResource.bookedItems = clonedBookingItems

        dispatch('updateBookedResource', clonedBookedResource)
      })
    },

    /**
     * @param {Object} data
     * @param {BookedResource} data.bookedResource
     * @param {ClientPrepaidService} data.clientPrepaidService
     */
    async addPrepaidServiceToBookedResource({ state, dispatch, rootState }, data) {
      const bookedResource = data.bookedResource
      const clientPrepaidService = data.clientPrepaidService

      const totalDeductedPrepaidServiceUsing = (() => {

        if(clientPrepaidService.quantity === -1) {
          return null
        }

        if(clientPrepaidService.initialQuantity === -1) {
          return null
        }

        /**@type {Array<BookedResource>} */
        const existingBookedResources = state.bookedResources ?? []

        return existingBookedResources.reduce((total, existingBookedResource) => {
          for(let index = 0; index < existingBookedResource.bookedItems.length; index++) {
          /**@type {BookedItem} */
            const bookedItem = existingBookedResource.bookedItems[index]

            if (
              bookedItem.bookedType !== BOOKING_ITEM_TYPE.SERVICE_ITEM ||
              bookedItem.deductedPrepaidGoodsRef !== clientPrepaidService.id
            ) {
              continue
            }

            total++
          }

          return total
        }, clientPrepaidService.initialQuantity - clientPrepaidService.quantity + 1)
      })()

      if (
        !(clientPrepaidService.quantity === -1) &&
        !(clientPrepaidService.initialQuantity === -1) &&
        totalDeductedPrepaidServiceUsing > clientPrepaidService.initialQuantity
      ) {
        throw new Error(i18n.t('bookings.out-of-quantity-warning'))
      }

      const totalBookedItems = state.bookedResources.reduce((total, bookedResource) => total + bookedResource.bookedItems.length, 0)
      if (totalBookedItems === MAX_ITEMS_RESOURCE) {
        throw new Error(i18n.t('bookings.warning_can_not_exceed_booked_items_max', {
          items_max: MAX_ITEMS_RESOURCE,
        }))
      }

      const response = await getServiceForBookingById({
        shopId:    clientPrepaidService.shopId,
        status:    options.good_status.active,
        serviceId: clientPrepaidService.relatedServiceId,
      })

      /**@type {Service} */
      const service = Service.build(response?.data?.result?.service)

      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)

      bookedItem.bookedItemId = guid()
      bookedItem.bookedRefName = service.serviceName
      bookedItem.bookedType = BOOKING_ITEM_TYPE.SERVICE_ITEM
      bookedItem.bookedRefId = clientPrepaidService.relatedServiceId

      bookedItem.deductedPrepaidGoodsRef = clientPrepaidService.id
      bookedItem.deductedPrepaidGoodsRefUsingTimes = totalDeductedPrepaidServiceUsing
      bookedItem.deductedPrepaidGoodsRefName = clientPrepaidService.prepaidServiceName

      const deductedPrepaidGoodsRefInitQuantity = (() => {
        if(clientPrepaidService.isInitialQuantityNoLimit) {
          return null
        }

        if(clientPrepaidService.isQuantityNoLimit) {
          return null
        }

        return clientPrepaidService.initialQuantity
      })()

      bookedItem.deductedPrepaidGoodsRefInitQuantity = deductedPrepaidGoodsRefInitQuantity

      bookedItem.setEsimatedTime(service.estimatedTime ?? rootState._calendar.timeSlot)

      await dispatch('addBookedItemsToBookedResource', {
        bookedResource,
        bookedItems: [ bookedItem ],
      })
    },

    async updateBookedResourceForUpdatingBooking({ state, dispatch }, data) {
      const clientPrepaidServices = data.clientPrepaidServices
      const bookedResources = state.bookedResources.map(bookedResource => bookedResource.clone())

      const updatedBookedResources = []

      for(const bookedResource of bookedResources) {
        const bookedItems = bookedResource.bookedItems || []

        const deductUsingTimesByPrepaidService = {}
        for(const bookedItem of bookedItems) {
          const deductedPrepaidGoodsRef = bookedItem.deductedPrepaidGoodsRef
          if(!deductedPrepaidGoodsRef) {
            continue
          }

          const clientPrepaidService = clientPrepaidServices.find(prepaidService => prepaidService?.id === deductedPrepaidGoodsRef)

          if(!clientPrepaidService) {
            // throw new Error('The prepaid service is not found.')
            continue
          }

          const totalDeductedPrepaidServiceUsing = (() => {
            if (clientPrepaidService.isQuantityNoLimit) {
              deductUsingTimesByPrepaidService[clientPrepaidService.id] = null
              return null
            }

            if(clientPrepaidService.isInitialQuantityNoLimit) {
              deductUsingTimesByPrepaidService[clientPrepaidService.id] = null
              return null
            }

            /**@type {Array<BookedResource>} */
            const initialDeductTimes = deductUsingTimesByPrepaidService[clientPrepaidService.id] ?? clientPrepaidService.initialQuantity - clientPrepaidService.quantity + 1
            const deductTimes = updatedBookedResources.reduce((total, existingBookedResource) => {
              for(let index = 0; index < existingBookedResource.bookedItems.length; index++) {
              /**@type {BookedItem} */
                const bookedItem = existingBookedResource.bookedItems[index]

                if (
                  bookedItem.bookedType !== BOOKING_ITEM_TYPE.SERVICE_ITEM ||
                  bookedItem.deductedPrepaidGoodsRef !== clientPrepaidService.id
                ) {
                  continue
                }

                total++
              }

              return total
            }, initialDeductTimes)
            deductUsingTimesByPrepaidService[clientPrepaidService.id] = deductTimes + 1
            return deductTimes
          })()

          if (
            !clientPrepaidService.isQuantityNoLimit &&
            !clientPrepaidService.isInitialQuantityNoLimit &&
            totalDeductedPrepaidServiceUsing > clientPrepaidService.initialQuantity
          ) {
            bookedItem.deductedPrepaidGoodsRef = 0
            bookedItem.deductedPrepaidGoodsRefName = ''
            bookedItem.deductedPrepaidGoodsRefUsingTimes = undefined
            bookedItem.deductedPrepaidGoodsRefInitQuantity = undefined

            continue
          }

          bookedItem.deductedPrepaidGoodsRefUsingTimes = totalDeductedPrepaidServiceUsing

          const deductedPrepaidGoodsRefInitQuantity = (() => {
            if(clientPrepaidService.isInitialQuantityNoLimit) {
              return null
            }

            if(clientPrepaidService.isQuantityNoLimit) {
              return null
            }

            return clientPrepaidService.initialQuantity
          })()

          bookedItem.deductedPrepaidGoodsRefInitQuantity = deductedPrepaidGoodsRefInitQuantity
        }

        await dispatch('updateBookedResource', bookedResource)
        updatedBookedResources.push(bookedResource)
      }
    },

    /**
     * @param {Object} data
     * @param {ClientPrepaidService[]} data.allPrepaidServicesByClient
     */
    async arrangePrepaidServiceToBookedResource({ state, dispatch }, data) {
    /**@type {Booking} */
      const booking = state.clone()

      /**@type {Array<ClientPrepaidService>} */
      const allPrepaidServicesByClient = data.allPrepaidServicesByClient

      const deductPrepaidServices = {}

      for (let bookedResource of booking.bookedResources) {
      /**@type {Array<BookedItem>} */
        const bookedItems = bookedResource.bookedItems

        if(!bookedItems.length) {
          continue
        }

        for(const bookedItem of bookedItems) {
          const isDeductService = !!bookedItem.deductedPrepaidGoodsRef

          if(!isDeductService) {
            continue
          }

          const prepaidServiceUsingDeduct = allPrepaidServicesByClient.find(prepaidService => prepaidService.id === bookedItem.deductedPrepaidGoodsRef)

          if(!prepaidServiceUsingDeduct) {
            continue
          }

          if(!deductPrepaidServices[prepaidServiceUsingDeduct.id]) {
            const isQuantityNoLimit = prepaidServiceUsingDeduct.quantity === ENUM_NO_LIMIT
            const isInitialQuantityNoLimit = prepaidServiceUsingDeduct.initialQuantity === ENUM_NO_LIMIT

            const usingTimes = (() => {
              if(isQuantityNoLimit) {
                return null
              }

              if(isInitialQuantityNoLimit) {
                return null
              }

              return prepaidServiceUsingDeduct.initialQuantity - prepaidServiceUsingDeduct.quantity + 1
            })()

            deductPrepaidServices[prepaidServiceUsingDeduct.id] = {
              usingTimes,
              isQuantityNoLimit,
              isInitialQuantityNoLimit,
              initialQuantity: prepaidServiceUsingDeduct.initialQuantity,
            }
          } else {
            const deductPrepaidService = deductPrepaidServices[prepaidServiceUsingDeduct.id]

            if(!deductPrepaidService.isQuantityNoLimit && !deductPrepaidService.isInitialQuantityNoLimit) {
              ++deductPrepaidServices[prepaidServiceUsingDeduct.id].usingTimes

              if(deductPrepaidServices[prepaidServiceUsingDeduct.id].usingTimes > deductPrepaidServices[prepaidServiceUsingDeduct.id].initialQuantity) {
                throw new Error(i18n.t('bookings.out-of-quantity-warning'))
              }
            }
          }

          const deductServiceInfo = deductPrepaidServices[prepaidServiceUsingDeduct.id]

          bookedItem.deductedPrepaidGoodsRefUsingTimes = deductServiceInfo.usingTimes

          const deductedPrepaidGoodsRefInitQuantity = (() => {
            if(deductServiceInfo.isInitialQuantityNoLimit) {
              return null
            }

            if(deductServiceInfo.isQuantityNoLimit) {
              return null
            }

            return deductServiceInfo.initialQuantity
          })()
          bookedItem.deductedPrepaidGoodsRefInitQuantity = deductedPrepaidGoodsRefInitQuantity
        }

        dispatch('updateBookedResource', bookedResource)
      }
    },

    /**
     * @param {Object} data
     * @param {bookingItem} data.bookingItem
     * @param {BookedResource} data.bookedResource
     */
    async addServiceToBookedResource({ dispatch }, data) {
      const bookingItem = data.bookingItem
      const bookedResource = data.bookedResource

      await dispatch('addBookedItemsToBookedResource', {
        bookedResource,
        bookedItems: [ bookingItem ],
      })
    },

    /**
     * @param {Object} data
     * @param {bookingItem} data.bookingItem
     * @param {BookedResource} data.bookedResource
     */
    async addBookingItemToBookedResource({ dispatch }, data) {
      const bookingItem = data.bookingItem
      const bookedResource = data.bookedResource

      await dispatch('addBookedItemsToBookedResource', {
        bookedResource,
        bookedItems: [ bookingItem ],
      })
    },

    /**
     * @param {Object} data
     * @param {bookingItem[]} data.bookingItems
     * @param {BookedResource} data.bookedResource
     * @param {ClientPrepaidService[]} data.clientPrepaidServices
     */
    async rebookBookedItemsToBookedResource({ dispatch }, data) {
      const bookingItems = data.bookingItems
      const bookedResource = data.bookedResource
      const clientPrepaidServices = data.clientPrepaidServices

      for(const bookingItem of bookingItems) {
        if(bookingItem.bookedType === BOOKING_ITEM_TYPE.BOOKING_ITEM) {
          await dispatch('addBookingItemToBookedResource', {
            bookingItem,
            bookedResource,
          })

          continue
        }

        if(bookingItem.deductedPrepaidGoodsRef) {
          const clientPrepaidService = clientPrepaidServices.find(clientPrepaidService => clientPrepaidService.id === bookingItem.deductedPrepaidGoodsRef)
          await dispatch('addPrepaidServiceToBookedResource', {
            bookedResource,
            clientPrepaidService,
          })

          continue
        }

        await dispatch('addServiceToBookedResource', {
          bookingItem,
          bookedResource,
        })
      }
    },

    async disconnectClientFromNaver(ctx, { shopId, bookingId, externalSystemBookingId }) {
      const response = await disconnectClientNaverBooking({
        shopId,
        bookingId,
        externalSystemBookingId,
      })

      return response?.data?.result
    },
  }

  return {
    state,
    getters,
    actions,
    mutations,
    namespaced: true,
  }
}

export default generateModule()
