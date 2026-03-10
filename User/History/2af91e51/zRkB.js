// Model
import BookedResource from 'Models/booking/bookedResource'

/**
 * @description This function only work with the booking was restructured in bookingItem
 * @param {Object} booking It only have on bookedResource in bookedResources
 */
const getBookingSlotTime = (booking) => {
  const [bookedResource] = booking.bookedResources

  const startTimeInMinutes = BookedResource.getStartTimeInMinutes({
    startTime: bookedResource.startTime,
    isNextDay: bookedResource.isNextDay,
  })
  const endTimeInMinutes = startTimeInMinutes + Number(bookedResource.estimatedTime)

  return [startTimeInMinutes, endTimeInMinutes]
}

// Constants
const DEFAULT_ITEMS_EMPTY = []
const DEFAULT_TIME_SLOT = 5 // To calculate offset/widthRatio in for & do/while loop

const state = {
  bookingDateTS:          null,
  bookingResourceSetupId: null,

  availableEndTime:   null,
  availableStartTime: null,

  items: DEFAULT_ITEMS_EMPTY,
}

const getters = {
  availableBookings(state, getters, rootState) {
    const bookings = [...state.items]
    const ghostBooking = bookings.find(booking => !!booking.isGhostBooking)

    if (!ghostBooking) return bookings

    const draggingBooking = rootState._calendar.drag.booking ?? {}
    const [draggingBookedResource] = draggingBooking?.bookedResources ?? []

    const indexOfOriginalBooking = bookings.findIndex(b => b.bookingId === ghostBooking.originalBookingId)
    if (draggingBookedResource.bookingResourceSetupId === state.bookingResourceSetupId) {
      // Condition: if the ghost booking is not duplicated with original booking - checking with the start time of resource (which is dragging - only 1 resource) => return both bookings to display
      if(ghostBooking?.bookedResources?.length > 0 && indexOfOriginalBooking >= 0
        && ghostBooking.bookedResources[0].startTime !== bookings[indexOfOriginalBooking].bookedResources[0].startTime) {

        return bookings
      }
    } else {

      if(rootState._calendar.drag.booking.bookingDateTS !== ghostBooking.bookingDateTS){
        return bookings.filter(booking => {
          return booking.bookingId !== rootState._calendar.drag.booking?.bookingId
        })
      }
      return bookings
    }

    return bookings.filter(booking => {
      return booking.bookingId !== rootState._calendar.drag.booking?.bookingId
    })
  },

  itemGroups(state, getters) {
    const groups = []

    const bookings = [...getters.availableBookings]
    
    bookings.sort((prevBooking, nextBooking) => {
      const [prevBookingStartTime] = getBookingSlotTime(prevBooking)
      const [nextBookingStartTime] = getBookingSlotTime(nextBooking)

      return prevBookingStartTime - nextBookingStartTime
    })

    const timeSlot = DEFAULT_TIME_SLOT

    let booking = bookings.shift()
    while(booking) {
      const items = [booking]
      let [startTimeInMinutes, endTimeInMinutes] = getBookingSlotTime(booking)
      
      const group = {}
      group.startTime = startTimeInMinutes

      do {
        const filteringStartTime = startTimeInMinutes
        const filteringEndTime = startTimeInMinutes + Number(timeSlot)

        let index = 0
        while(index < bookings.length) {
          const lookupBooking = bookings[index]
          const [lookupBookingStartTimeInMinutes, lookupBookingEndTimeInMinutes] = getBookingSlotTime(lookupBooking)
          const isLookupBookingInner = lookupBookingStartTimeInMinutes >= filteringStartTime && lookupBookingStartTimeInMinutes < filteringEndTime
          const isLookupBookingOuter = lookupBookingStartTimeInMinutes <= filteringStartTime && lookupBookingEndTimeInMinutes >= filteringEndTime

          if (isLookupBookingInner || isLookupBookingOuter) {
            items.push(lookupBooking)
            
            group.startTime = Math.min(lookupBookingStartTimeInMinutes, group.startTime)
            endTimeInMinutes = Math.max(lookupBookingEndTimeInMinutes, endTimeInMinutes)

            bookings.splice(index, 1)
            
            continue
          }

          index++
        }

        startTimeInMinutes = startTimeInMinutes + Number(timeSlot)
      } while(startTimeInMinutes < endTimeInMinutes)

      items.sort((prevBooking, nextBooking) => {
        return prevBooking.createdDateTimeTS - nextBooking.createdDateTimeTS
      })

      group.items = items
      group.endTime = endTimeInMinutes
      
      groups.push(group)
      booking = bookings.shift()
    }

    return groups
  },

  itemConfigurations(state, getters) {
    const itemConfigurations = {}
    const itemGroups = getters.itemGroups

    for(let groupIndex = 0; groupIndex < itemGroups.length; groupIndex++) {
      const group = itemGroups[groupIndex]
      const bookings = group.items
      
      if (bookings && bookings.length === 1) {
        itemConfigurations[bookings[0].bookingId] = {
          offset:     0,
          widthRatio: 1,
        }
        
        continue
      }
      
      bookings.sort((prevBooking, nextBooking) => {
        const [prevBookingStartTime] = getBookingSlotTime(prevBooking)
        const [nextBookingStartTime] = getBookingSlotTime(nextBooking)

        return prevBookingStartTime - nextBookingStartTime
      })
      
      /**
       * @description Horizontal look up for calculating how max bookings in a calendar timeslot
       */
      let widthRatio = 1
      const timeSlot = DEFAULT_TIME_SLOT
      const endTime = group.endTime
      const startTime = group.startTime

      for (let time = startTime; time <= endTime; time = time + timeSlot) {
        const filteringStartTime = time
        const filteringEndTime = time + timeSlot

        const matchedBookings = bookings.filter(booking => {
          const [bookedResourceStartTimeInMinutes, bookedResourceEndTimeMinutes] = getBookingSlotTime(booking)

          const isLookupBookingInner = bookedResourceStartTimeInMinutes >= filteringStartTime && bookedResourceStartTimeInMinutes < filteringEndTime
          const isLookupBookingOuter = bookedResourceStartTimeInMinutes <= filteringStartTime && bookedResourceEndTimeMinutes >= filteringEndTime

          return isLookupBookingInner || isLookupBookingOuter
        })

        widthRatio = Math.max(widthRatio, matchedBookings.length)

        const LIMIT_BOOKINGS_PER_SLOT = 5
        if (widthRatio >= LIMIT_BOOKINGS_PER_SLOT) { // LIMIT BOOKINGS IN SLOT
          widthRatio = LIMIT_BOOKINGS_PER_SLOT
          break
        }
      }

      /**
       * @description Vertical look up for arranging booking on time
       */
      let offset = 0
      const arrangeBookings = [...bookings]
      let arrangeBooking = arrangeBookings.shift()
      
      do {
        itemConfigurations[arrangeBooking.bookingId] = {
          offset,
          widthRatio,
        }

        let [arrangeBookingStartTime, arrangeBookingEndTime] = getBookingSlotTime(arrangeBooking)
        
        let index = 0
        while(index < arrangeBookings.length) {
          const sideBooking = arrangeBookings[index]
          const [sideBookingStartTime, sideBookingEndTime] = getBookingSlotTime(sideBooking)

          if (sideBookingStartTime >= arrangeBookingEndTime || arrangeBookingStartTime >= sideBookingEndTime) {
            itemConfigurations[sideBooking.bookingId] = {
              offset,
              widthRatio,
            }

            arrangeBookings.splice(index, 1)

            arrangeBookingEndTime = Math.max(arrangeBookingEndTime, sideBookingEndTime)
            arrangeBookingStartTime = Math.min(arrangeBookingStartTime, sideBookingStartTime)

            continue
          }

          index++
        }
        
        offset++
        arrangeBooking = arrangeBookings.shift()
      } while(arrangeBooking)
    }

    return itemConfigurations
  },
}

const mutations = {
  setItems(state, items) {
    state.items = items
  },

  addItem(state, booking) {
    state.items.push(booking)
  },

  removeItem(state, booking) {
    const foundIndex = state.items.findIndex(item => {
      return item.bookingId === booking.bookingId
    })

    if (foundIndex !== -1) {
      state.items.splice(foundIndex, 1)
    }
  },

  addOrUpdateItem(state, booking) {
    const foundIndex = state.items.findIndex(item => {
      return item.bookingId === booking.bookingId
    })

    if (foundIndex !== -1) {
      state.items.splice(foundIndex, 1, booking)
    } else {
      // Double check to prevent race condition when multiple requests add same booking
      const doubleCheckIndex = state.items.findIndex(item => {
        return item.bookingId === booking.bookingId
      })
      
      if (doubleCheckIndex === -1) {
        state.items.push(booking)
      }
    }
  },

  setAvailableEndTime(state, availableEndTime) {
    state.availableEndTime = availableEndTime
  },

  setAvailableStartTime(state, availableStartTime) {
    state.availableStartTime = availableStartTime
  },

  setBookingDateTS(state, bookingDateTS) {
    state.bookingDateTS = bookingDateTS
  },

  setBookingResourceSetupId(state, bookingResourceSetupId) {
    state.bookingResourceSetupId = bookingResourceSetupId
  },
}

const actions = {}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
}