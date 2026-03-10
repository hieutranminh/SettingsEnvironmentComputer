// Utilities
import {
  formatTimeSlot,
  convertTimeToMinutes,
  convertDateToMomentUTC,
  convertTimestampToDate,
  formatTimeSlotAtMobile,
} from '../utils/index'
import moment from 'moment'
import i18n from 'Translate'
import { cloneDeep } from 'lodash'
// Constants
import { options } from 'OptionsHelpers'
import { MINUTES_OF_24H, SELECTED_RESOURCES_OPTIONS } from 'Constant'

// Sub modules
import drag from './drag.js'
import waitings from './waitings.js'
import bookings from './bookings.js'
import workCalendar from './workCalendar.js'
import workSchedule from './workSchedule.js'
import bookingItems from './bookingItems.js'
import blockedTimes from './blockedTimes.js'
import waitingAction from './waitingAction.js'
import bookingAction from './bookingAction.js'
import checkoutAction from './checkoutAction.js'
import blockedTimeItems from './blockedTimeItems.js'
import sendMessageAction from './sendMessageAction.js'
import clientInformation from './clientInformation.js'
import bookingDescription from './bookingDescription.js'

// Sub modules generate
import { generateModule as generateTimeIndicatorModule } from './timeIndicator'

// Api
import {
  addSpecificOffDay,
  deleteSpecificOffDay,
} from 'Modules/api/booking/booking-resource-api'

const DEFAULT_TIME_SLOT_HEIGHT = 30
const MOBILE_MAX_WIDTH = 70
const DESKTOP_MAX_WIDTH = 150
const LOCAL_STORAGE_LIST_LIMIT = 10
const SELECTED_ALL = 0

/**
 * Compare a Date object (converted with shop timezone) with a moment/Date for same day
 * This avoids timezone issues when comparing specific off days with calendar dates
 *
 * The specificOffDay is created via convertTimeStampToDate with timezone conversion,
 * which means its getDate/getMonth/getFullYear return values in shop timezone.
 *
 * The calendarDate is a moment UTC that represents the calendar day.
 * Both should be compared by their date components (year, month, date) directly,
 * as they both represent the same logical day in the shop's timezone.
 *
 * @param {Date} specificOffDay - Date object created via convertTimeStampToDate with timezone conversion
 * @param {moment|Date} calendarDate - Calendar date to compare against
 * @returns {boolean} - true if both dates represent the same day
 */
const isSameDay = (specificOffDay, calendarDate) => {
  // specificOffDay is a Date object with shop timezone values
  // Its getFullYear/getMonth/getDate return the day in shop timezone
  const offDayYear = specificOffDay.getFullYear()
  const offDayMonth = specificOffDay.getMonth()
  const offDayDate = specificOffDay.getDate()

  // calendarDate is typically a moment UTC object created by convertDateToMomentUTC
  // convertDateToMomentUTC takes local date values (getDate/getMonth/getFullYear)
  // and sets them into a moment UTC object
  // So the .date()/.month()/.year() methods return those same local values
  let calYear, calMonth, calDate

  if (calendarDate && typeof calendarDate.year === 'function') {
    // It's a moment object - use its date components directly
    calYear = calendarDate.year()
    calMonth = calendarDate.month()
    calDate = calendarDate.date()
  } else if (calendarDate instanceof Date) {
    // It's a Date object - use local date components
    calYear = calendarDate.getFullYear()
    calMonth = calendarDate.getMonth()
    calDate = calendarDate.getDate()
  } else {
    // Fallback: convert to moment UTC
    const momentDate = convertDateToMomentUTC(calendarDate)
    calYear = momentDate.year()
    calMonth = momentDate.month()
    calDate = momentDate.date()
  }

  // Debug log - uncomment to debug timezone issues
  console.log('isSameDay debug:', {
    specificOffDay: specificOffDay.toString(),
    offDayDate,
    calendarDate:   calendarDate?.toString?.() || calendarDate,
    calDate,
    result:         offDayYear === calYear && offDayMonth === calMonth && offDayDate === calDate,
  })

  return offDayYear === calYear && offDayMonth === calMonth && offDayDate === calDate
}

/**
 * @typedef {Object} OpeningHour
 * @property {String} startTime
 * @property {String} finishTime
 * @property {Boolean} crossDate
 */

/**
 * @param {OpeningHour[]} openingHours
 */

const numberOfDaysViewAllLocalStorage = (shopId) => {
  let listNumberOfDaysViewAllStorage = []
  try {
    listNumberOfDaysViewAllStorage = JSON.parse(localStorage.getItem('number-of-days-view-all')) || []
  } catch(error) {
    throw error
  }
  const shopExistingInViewAllLocalStorage = listNumberOfDaysViewAllStorage.find(item => item.shop_id === shopId)

  if (shopExistingInViewAllLocalStorage) {
    return shopExistingInViewAllLocalStorage.value
  }
  return shopExistingInViewAllLocalStorage
}

const calculateWorkingHours = openingHours => {
  if (!Array.isArray(openingHours) || openingHours.length === 0) {
    return { startTime: null, finishTime: null, breakingTimes: [] } // Return default if no working hours
  }

  const calculateWorkingHours = openingHours.reduce((data, openingHour) => {
    const workingStartTimeInMinutes = convertTimeToMinutes(openingHour.startTime)
    const workingFinishTimeInMinutes = convertTimeToMinutes(openingHour.finishTime) + Number(openingHour.crossDate) * MINUTES_OF_24H

    const preStartTime = data.startTime
    const preFinishTime = data.finishTime
    const breakingTimes = data.breakingTimes

    if (preFinishTime !== null && workingStartTimeInMinutes > preFinishTime) {
      breakingTimes.push({
        startTime:  preFinishTime,
        finishTime: workingStartTimeInMinutes,
      })
    }

    if (preStartTime !== null && workingFinishTimeInMinutes < preStartTime) {
      breakingTimes.push({
        startTime:  workingFinishTimeInMinutes,
        finishTime: preStartTime,
      })
    }

    for (let breakingTimeIndex in breakingTimes) {
      const breakingTime = breakingTimes[breakingTimeIndex]
      const breakingStartTime = breakingTime.startTime
      const breakingFinishTime = breakingTime.finishTime

      if (
        preStartTime === null ||
        preFinishTime === null ||
        preStartTime > workingStartTimeInMinutes ||
        preFinishTime < workingFinishTimeInMinutes
      ) {
        break
      }

      if (
        breakingStartTime > workingStartTimeInMinutes ||
        breakingFinishTime < workingFinishTimeInMinutes
      ) {
        continue
      }

      if (workingStartTimeInMinutes === breakingStartTime) {
        if (workingFinishTimeInMinutes === breakingFinishTime) {
          breakingTimes.splice(breakingTimeIndex, 1)
          break
        }

        breakingTime.startTime = workingFinishTimeInMinutes
        breakingTimes[breakingTimeIndex] = breakingTime
        break
      }

      if (workingFinishTimeInMinutes === breakingFinishTime) {
        breakingTime.finishTime = workingStartTimeInMinutes
        breakingTimes[breakingTimeIndex] = breakingTime
        break
      }

      breakingTimes.splice(breakingTimeIndex, 1)
      breakingTimes.push(
        { startTime: breakingStartTime, finishTime: workingStartTimeInMinutes },
        { startTime: workingFinishTimeInMinutes, finishTime: breakingFinishTime },
      )
      break
    }

    data.breakingTimes = breakingTimes

    if (preStartTime === null || preStartTime > workingStartTimeInMinutes) {
      data.startTime = workingStartTimeInMinutes
    }

    if (preFinishTime === null || preFinishTime < workingFinishTimeInMinutes) {
      data.finishTime = workingFinishTimeInMinutes
    }

    return data
  }, {
    startTime:     null,
    finishTime:    null,
    breakingTimes: [],
  })

  return calculateWorkingHours
}

/**
 * @typedef {Object} DateInfo
 * @property {Moment} date
 * @property {Boolean} isOffDay
 * @typedef {Object} OpeningHourSetup
 * @property {String} start_time
 * @property {String} finish_time
 * @property {Boolean} cross_date
 * @param {Object} data
 * @param {datesInfo[]} data.datesInfo
 * @param {OpeningHourSetup[]} data.openingHoursSetup
 */

const calculateOpeningHourByDay = ({ datesInfo, openingHoursSetup, specificWorkingDays = [] }) => {
  // Create an array of timestamps from specificWorkingDays
  const specificWorkingDaysTs = specificWorkingDays.reduce((acc, item) => {
    acc[item.specificWorkingDayTS] = {
      allowedHours: item.allowedBookingHours,
      format:       item.specific_working_days_format,
    }
    return acc
  }, {})

  const result = datesInfo.reduce((data, dateInfo) => {
    const dayOfWeek = moment(dateInfo.date).day() // Get the day of the week
    const dayTs = moment(dateInfo.date).unix() // Convert the current date to a timestamp
    const uniqueKey = `${dayTs}_${dayOfWeek}` // Ensure unique keys when processing more than 7 days

    if (specificWorkingDaysTs[dayTs]) {
      return {
        ...data,
        [uniqueKey]: specificWorkingDaysTs[dayTs].allowedHours,
      }
    }

    if (dateInfo.isOffDay) {
      return data // Skip off days
    }
    // Calculate opening hours for regular days
    const openingHoursByDay = openingHoursSetup.reduce((openingHours, openingHour) => {
      if (openingHour.opened_days_of_week?.includes(dayOfWeek)) {
        openingHours.push({
          crossDate:  openingHour.cross_date,
          startTime:  openingHour.start_time,
          finishTime: openingHour.finish_time,
        })
      }
      return openingHours
    }, [])

    return {
      ...data,
      [uniqueKey]: openingHoursByDay,
    }
  }, {})

  return result
}

/**
 * @typedef {Array<{shopId: String, resource_id: number}>} ResourceDefaultSelection
 * @description getCalendarViewState is used for getting calendar view mode from the "Resource default selection" on the calendar setup page
 *
 * if resource_id = SELECTED_RESOURCES_OPTIONS.ALL or 0, the calendar will render all resources
 *
 * if resource_id = SELECTED_RESOURCES_OPTIONS.WORKING_STAFFS, the calendar will render all working resources (Exclude off resources on dates)
 *
 * if resource_id > 0, The calendar will render a specific resources on dates
 *
 * @return {{selectedResourceId: number, isExcludeOffBookingResource: boolean}}
*/

const getMaxinumNumberDisplayResourceFromLS = () => {
  try {
    const data = JSON.parse(localStorage.getItem('maximum_number_of_resource'))
    if(!Array.isArray(data)) {
      return []
    }
    return data
  } catch (error) {
    return []
  }
}

const setMaximumNumberOfResourceByShop = (maxinumResource) => {
  const data = JSON.stringify(maxinumResource)
  localStorage.setItem('maximum_number_of_resource', data)

}

export const getCalendarViewState = (shopId, resources) => {
  let selectedResourceId = 0
  let isExcludeOffBookingResource = false

  try {
    const storagedCalendarViewMode = resources?.resource_id ?? 0
    isExcludeOffBookingResource = storagedCalendarViewMode === SELECTED_RESOURCES_OPTIONS.WORKING_STAFFS
    if (storagedCalendarViewMode > 0) {
      selectedResourceId = storagedCalendarViewMode
    }
  } catch(error) {
    //
  }

  return { selectedResourceId, isExcludeOffBookingResource }
}

export const CalendarPlugin = store => {
  const state = {
    timeSlot:            60,
    timeSlotWidthDevice: DESKTOP_MAX_WIDTH,
    timeSlotHeight:      DEFAULT_TIME_SLOT_HEIGHT,

    numberOfDay:  1,
    selectedDate: convertDateToMomentUTC(new Date()).startOf('day'),

    selectedResourceId: 0,

    startTime:  null,
    finishTime: null,
    crossDate:  false,
    today:      convertDateToMomentUTC(new Date()).startOf('day'),

    bookingResources:            [],
    isExcludeOffBookingResource: false,

    specificOffDays:     [],
    bookingOpeningHours: {},
    displayCurrentTime:  false,

    timeShowUp:             true,
    notesShowUp:            true,
    serviceShowUp:          true,
    memberNumberShowUp:     true,
    allowDuplicateBookings: false,

    // UI
    calendarRef:      null,
    resourceRef:      null,
    calendarDatesRef: null,

    isHeaderShown:     true,
    isSideBarShown:    true,
    isBookingDragging: false,

    /**@description Purpose for clicking on the calendar slot */
    isCalendarSlotAccessible:   false,
    calendarSlotAccessOptions:  null,
    calendarSlotAccessCallback: null,

    // Data API
    bookingOpeningHoursSetup: null,
    datesState:               [],

    isShowQtyPrepaidService: true,
    isMoveBookingMode:       false,
    maximumNumberOfResource: getMaxinumNumberDisplayResourceFromLS(),
    bookedResourceNaverLink: [],
    isMouseMove:             false,
  }

  const getters = {
    maxinumNumberOfResource(state) {
      return state.maximumNumberOfResource
    },

    dates(state, getters) {
      const dates = []
      const workingDaysOfWeek = Object.keys(state.bookingOpeningHours ?? {})

      let index = 0
      while(dates.length < state.numberOfDay) {
        const date = convertDateToMomentUTC(state.selectedDate).add(index, 'days').startOf('day')
        const dateTs = moment(date).unix()
        const hasSpecificWorkingDay = getters.specificWorkingDaysTs.includes(dateTs)

        index++

        if (!state.isExcludeOffBookingResource || hasSpecificWorkingDay || (state.numberOfDay === 1 && state.isExcludeOffBookingResource)) {
          dates.push(date)
          continue
        }

        let checkResourceOffDay = true
        const availableBookingResources = cloneDeep(getters.availableBookingResources)
        availableBookingResources.map(resource => {
          const isBookingResourceOffDay = resource.specific_off_days.some(specificOffDay => isSameDay(specificOffDay, date))
          if (!isBookingResourceOffDay) checkResourceOffDay = false
        })
        const isDayOff = !!state.specificOffDays.find(specificOffDay => isSameDay(specificOffDay, date))

        const isOffDayOfWeeks = !workingDaysOfWeek.includes(date.get('days').toString())
        if(!isDayOff && !isOffDayOfWeeks && !checkResourceOffDay) {
          dates.push(date)
        } else if (state.numberOfDay === 1 && state.isExcludeOffBookingResource && (isDayOff || isOffDayOfWeeks)) {
          dates.push(date)
        }
      }

      return dates
    },

    datesTs(state, getters) {
      // Use map to create an array of Unix timestamps from the dates
      return getters.dates.map(date => moment(date).unix())
    },

    specificWorkingDaysTs(state) {
      // Flatten the array of specific working days timestamps from all booking resources
      return state.bookingResources.flatMap(bookingResource =>
        bookingResource.specificWorkingDays.map(item => item.specificWorkingDayTS),
      )
    },

    specificWorkingDaysTsOfResources(state) {
      // Create an object where each key is a resource ID and each value is an array of specific working days timestamps
      return state.bookingResources.reduce((acc, bookingResource) => {
        acc[bookingResource.resource_id] = bookingResource.specificWorkingDays.map(item => item.specificWorkingDayTS)
        return acc // Return the accumulator for the next iteration
      }, {}) // Initialize the accumulator as an empty object
    },

    schedule(state, getters) {
      const schedule = []

      const dates = cloneDeep(getters.dates)
      const specificOffDays = cloneDeep(state.specificOffDays)
      const availableBookingResources = cloneDeep(getters.availableBookingResources)

      let index = 0
      for (let date of dates) {
        const item = {}

        /**@description Check date is Shop's specific off days or not */
        const specificOffDayIndex = specificOffDays.findIndex(specificOffDay => isSameDay(specificOffDay, date))

        const dateTs = moment(date).unix()
        const hasSpecificWorkingDay = getters.specificWorkingDaysTs.includes(dateTs)
        const hasSpecificOffDay = hasSpecificWorkingDay ? false : specificOffDayIndex !== -1

        /**
         * @description If date is Shop's specific off days and Exclude off day is true
         * Don't show it on calendar
         */
        if (state.isExcludeOffBookingResource && hasSpecificOffDay && state.numberOfDay !== 1) {
          specificOffDays.splice(specificOffDayIndex, 1)
          continue
        }

        item.date = date
        item.bookingResources = []
        item.isOffDay = specificOffDayIndex !== -1

        const dateTime = convertDateToMomentUTC(state.selectedDate).add(index, 'days').startOf('day')
        const workingDaysOfWeek = Object.keys(state.bookingOpeningHours ?? {})
        const isOffDayOfWeeks = !workingDaysOfWeek.includes(dateTime.get('days').toString())
        index++

        let checkResourceOffDay = false
        // Check if Resource has Off Day
        availableBookingResources.map(resource => {
          resource.specific_off_days.some(specificOffDay => {
            if (isSameDay(specificOffDay, date)) checkResourceOffDay = true
          })
        })

        /*
          Issue: 814, 1042
          Summary: For Cases Specific Off Day with check
          - AND number Of Day = 1
          - AND View mode All (Exclude Off)
          - AND Check Day Off for:
            + OR isOffDay: Shop specific Off Day
            + OR isOffDayOfWeeks: Shop Regular Off Day
            + OR checkResourceOffDay && availableBookingResources?.length === 1: Resource specific Off Day
        */
        if (state.numberOfDay === 1 && state.isExcludeOffBookingResource && (item.isOffDay || isOffDayOfWeeks || (checkResourceOffDay && availableBookingResources?.length === 1))) {
          // Check if any booking resource has a specific working day on the current date
          const isSpecificWorkingDay = availableBookingResources.some(resource =>
            resource.specificWorkingDays.some(day => day.specificWorkingDayTS === dateTs),
          )

          // If no specific working day is found for any resource
          if (!isSpecificWorkingDay) {
            // Map available booking resources, adding `isOffDay` based on specific off days
            item.bookingResources = availableBookingResources.map(resource => {
              const isBookingResourceOffDay = resource.specific_off_days.some(specificOffDay => isSameDay(specificOffDay, date))

              return {
                ...resource,
                isOffDay: isBookingResourceOffDay,
              }
            })

            // Add the item with the modified booking resources to the schedule
            schedule.push(item)

            // Return the schedule immediately since further processing isn't needed
            return schedule
          }
        }

        for (let index in availableBookingResources) {
          const bookingResource = availableBookingResources[index]
          /**@description Check date is Booking Resource's specific off days or not */
          const hasSpecificWorkingDayOfResource = bookingResource.specificWorkingDays.some(item => item.specificWorkingDayTS === dateTs)
          const bookingResourceOffDayIndex = bookingResource.specific_off_days.findIndex(specificOffDay => isSameDay(specificOffDay, date))

          /**
           * @description If date is Booking Resource's specific off days and Exclude off day is true
           * Don't show it on calendar
           */

          const isBookingResourceOffDay = bookingResourceOffDayIndex !== -1

          if (state.isExcludeOffBookingResource && !hasSpecificWorkingDayOfResource) {
            if (item.isOffDay || isBookingResourceOffDay) {
              continue
            }
          }

          /**@description Check date is in Booking Resource's opened_days_of_week or not */
          const hasDaysOfWeekWorking = bookingResource.opening_hours.some(openingHour => {
            return hasSpecificWorkingDayOfResource ? true : !!openingHour.opened_days_of_week.includes(convertDateToMomentUTC(date).get('days'))
          })

          /**
           * @description If date isn't in Booking Resource's opened_days_of_week and Exclude off day is true
           * Don't show it on calendar
           */
          if (!hasDaysOfWeekWorking && state.isExcludeOffBookingResource) {
            continue
          }

          item.bookingResources.push({
            ...getters.availableBookingResources[index],
            isOffDay: isBookingResourceOffDay,
          })
        }

        if (item.bookingResources?.length) schedule.push(item)
      }
      return schedule
    },

    typeDate(state) {
      if (state.numberOfDay === 1) {
        return options.type_date.date
      }

      return options.type_date.date_range
    },

    /**@description This getters is used for store watcher */
    viewModeDependency(state) {
      return {
        numberOfDay:        state.numberOfDay,
        selectedDate:       state.selectedDate,
        selectedResourceId: state.selectedResourceId,
      }
    },

    isMultiDates(state) {
      return state.numberOfDay > 1
    },

    toDate(state, getters) {
      if (state.datesState.length) {
        return state.datesState[state.datesState.length - 1]
      }

      return getters.dates[getters.dates.length - 1]
    },

    fromDate(state, getters) {
      if (state.datesState.length) {
        return state.datesState[0]
      }

      return getters.dates[0] || state.selectedDate
    },

    timeSlotWidth(state, getters, rootState) {
      if (rootState.device.deviceInfo.isMobileDevice) {
        return MOBILE_MAX_WIDTH
      }

      return DESKTOP_MAX_WIDTH
    },

    defaultTimeSlotHeight() {
      return DEFAULT_TIME_SLOT_HEIGHT
    },

    timeSlots(state, getters, rootState) {
      const isMobileDevice = rootState.device.deviceInfo.isMobileDevice
      const startTimeInMinutes = convertTimeToMinutes(state.startTime)
      const finishTimeInMinutes = convertTimeToMinutes(state.finishTime) + Number(state.crossDate) * options.minutes_of_24h

      const timeSlots = []
      const slots = (finishTimeInMinutes - startTimeInMinutes) / state.timeSlot

      for(let index = 0; index < slots; index++) {
        const minutes = startTimeInMinutes + (state.timeSlot * index)
        const text = (() => {
          if(isMobileDevice) {
            return formatTimeSlotAtMobile({ prefix: i18n.t('general.next-day-text'), minutes })
          }
          return formatTimeSlot({ prefix: i18n.t('general.next-day-text'), minutes })
        })()
        timeSlots.push({
          text,
          minutes,
        })
      }

      return timeSlots
    },

    selectedBookingResource(state) {
      return state.bookingResources.find(bookingResource => {
        return bookingResource.id === state.selectedResourceId
      })
    },

    availableBookingResources(state) {
      if (!state.selectedResourceId) {
        return state.bookingResources
      }

      return state.bookingResources.filter(bookingResource => {
        return bookingResource.id === state.selectedResourceId
      })
    },

    getBookingResourceById: state => id => {
      return state.bookingResources.find(bookingResource => bookingResource.id === id)
    },

    shopWorkingHoursBySchedule(state, getters) {
      const schedule = cloneDeep(getters.schedule)
      const bookingOpeningHoursSetup = cloneDeep(state.bookingOpeningHoursSetup)

      const scheduleDays = calculateOpeningHourByDay({
        datesInfo:         schedule,
        openingHoursSetup: bookingOpeningHoursSetup,
      })

      const result = Object.entries(scheduleDays).map(([key, openingHoursArray]) => {
        const [dayTs, dayOfWeek] = key.split('_').map(Number) // Extract timestamp and dayOfWeek correctly

        return {
          dayOfWeek,
          workingHours: calculateWorkingHours(openingHoursArray), // Re-added calculateWorkingHours
          timestamp:    dayTs, // Include timestamp for reference if needed
        }
      })
      return result
    },

    resourcesBreakingTimesBySchedule(state, getters) {
      const schedule = cloneDeep(getters.schedule)
      const bookingResources = cloneDeep(state.bookingResources)
      const shopWorkingHoursBySchedule = cloneDeep(getters.shopWorkingHoursBySchedule)

      const resourcesBreakingTimesBySchedule = bookingResources.reduce((data, bookingResource) => {
        if(bookingResource.working_hours_are_same_as_salon && bookingResource.specific_working_days.length === 0) {
          return {
            ...data,
            [bookingResource.id]: shopWorkingHoursBySchedule,
          }
        }

        const openingHoursSetup = bookingResource.opening_hours
        const specificWorkingDays = bookingResource.specific_working_days
        const scheduleDays = calculateOpeningHourByDay({
          datesInfo: schedule,
          openingHoursSetup,
          specificWorkingDays,
        })

        const breakingTimesByResource = Object.entries(scheduleDays).map(([key, openingHoursArray]) => {
          const [dayTs, dayOfWeek] = key.split('_').map(Number) // Extract timestamp and dayOfWeek correctly

          return {
            dayOfWeek,
            workingHours: calculateWorkingHours(openingHoursArray), // Re-added calculateWorkingHours
            timestamp:    dayTs, // Keep track of timestamp if needed
          }
        })

        return {
          ...data,
          [bookingResource.id]: breakingTimesByResource,
        }
      }, {})
      return resourcesBreakingTimesBySchedule
    },

    getSelectedResourceMobileDevice(state, getters, rootState) {
      if(state.bookingResources.length === 1 && rootState.device.deviceInfo.isMobileDevice) {
        return state.bookingResources[0].id
      }

      return state.selectedResourceId
    },

    timeSlotHeight: state => state.timeSlotHeight,
  }

  const mutations = {
    setTimeSlotWidth(state, timeSlotWidth) {
      state.timeSlotWidthDevice = timeSlotWidth
    },
    setDatesState(state, datesState) {
      state.datesState = datesState
    },
    setShowQtyPrepaidService(state, isShowQtyPrepaidService) {
      state.isShowQtyPrepaidService = isShowQtyPrepaidService
    },

    setMoveBookingMode(state, isMoveBookingMode ) {
      state.isMoveBookingMode = isMoveBookingMode
    },
    resetState() {
      //
    },

    setTimeSlot(state, timeSlot) {
      state.timeSlot = timeSlot
    },

    setTimeSlotHeight(state, timeSlotHeight) {
      state.timeSlotHeight = timeSlotHeight
    },

    setNumberOfDay(state, numberOfDay) {
      state.numberOfDay = numberOfDay
    },

    setSelectedDate(state, selectedDate) {
      state.selectedDate = selectedDate
    },

    setSelectedResourceId(state, selectedResourceId) {
      state.selectedResourceId = selectedResourceId
    },

    setStartTime(state, startTime) {
      state.startTime = startTime
    },

    setFinishTime(state, finishTime) {
      state.finishTime = finishTime
    },

    setCrossDate(state, crossDate) {
      state.crossDate = crossDate
    },

    setToday(state, today) {
      state.today = today
    },

    setBookingResources(state, bookingResources) {
      state.bookingResources = bookingResources.map(bookingResource => ({
        isDayOff: false,
        ...bookingResource,
      }))
    },

    setExcludeOffBookingResource(state, isExcludeOffBookingResource) {
      state.isExcludeOffBookingResource = isExcludeOffBookingResource
    },

    setBookingOpeningHours(state, bookingOpeningHours) {
      state.bookingOpeningHours = bookingOpeningHours
    },

    setDisplayCurrentTime(state, displayCurrentTime) {
      state.displayCurrentTime = displayCurrentTime
    },

    setSpecificOffDays(state, specificOffDays) {
      state.specificOffDays = specificOffDays
    },

    // UI Mutations
    setIsBookingDragging(state, isBookingDragging) {
      state.isBookingDragging = isBookingDragging
    },

    setCalendarRef(state, calendarRef) {
      state.calendarRef = calendarRef
    },

    setResourceName(state, resourceRef) {
      state.resourceRef = resourceRef
    },

    setCalendarDatesRef(state, calendarDatesRef) {
      state.calendarDatesRef = calendarDatesRef
    },

    setIsHeaderShown(state, isHeaderShown) {
      state.isHeaderShown = isHeaderShown
    },

    setIsSidebarShown(state, isSideBarShown) {
      state.isSideBarShown = isSideBarShown
    },

    setCalendarSlotAccessible(state, isCalendarSlotAccessible) {
      state.isCalendarSlotAccessible = isCalendarSlotAccessible
    },

    setCalendarSlotAccessOptions(state, options) {
      state.calendarSlotAccessOptions = options
    },

    setCalendarSlotAccessCallback(state, calendarSlotAccessCallback) {
      state.calendarSlotAccessCallback = calendarSlotAccessCallback
    },

    setBookingOpeningHoursSetup(state, bookingOpeningHoursSetup) {
      state.bookingOpeningHoursSetup = bookingOpeningHoursSetup
    },

    setTimeShowUp(state, timeShowUp) {
      state.timeShowUp = timeShowUp
    },

    setNotesShowUp(state, notesShowUp) {
      state.notesShowUp = notesShowUp
    },

    setServiceShowUp(state, serviceShowUp) {
      state.serviceShowUp = serviceShowUp
    },

    setMemberNumberShowUp(state, memberNumberShowUp) {
      state.memberNumberShowUp = memberNumberShowUp
    },

    setAllowDuplicateBookings(state, allowDuplicateBookings) {
      state.allowDuplicateBookings = allowDuplicateBookings
    },

    setMaximumNumberOfResourceByShop(state, numberOfResource) {
      state.maximumNumberOfResource = numberOfResource
      setMaximumNumberOfResourceByShop(numberOfResource)
    },

    setBookedResourceNaverLink(state, bookedResourceNaverLink) {
      state.bookedResourceNaverLink = bookedResourceNaverLink
    },

    setIsMouseMove(state, isMouseMove) {
      state.isMouseMove = isMouseMove
    },
  }

  const actions = {
    toggleSidebar({ commit, state }) {
      commit('setIsSidebarShown', !state.isSideBarShown)
    },

    toggleHeader({ commit, state }) {
      commit('setIsHeaderShown', !state.isHeaderShown)
    },

    calculateTimeSlotHeight({ commit }, percentage = 100) {
      const calculatedTimeSlotHeight = DEFAULT_TIME_SLOT_HEIGHT * (percentage ?? 100) / 100
      commit('setTimeSlotHeight', calculatedTimeSlotHeight)
    },

    async registerCalendarModules({ state, getters }) {
      const dates = getters.dates
      const resources = state.bookingResources

      dates.forEach(date => {
        const dateTS = convertDateToMomentUTC(date).startOf('day').unix()

        resources.forEach(resource => {
          const calendarModuleName = `${dateTS}_${resource.id}`

          if (!store.hasModule(['_calendar', 'bookings', calendarModuleName])) {
            store.registerModule(['_calendar', 'bookings', calendarModuleName], cloneDeep(bookingItems))
          }

          if(!store.hasModule(['_calendar', 'blockedTimes', calendarModuleName])) {
            store.registerModule(['_calendar', 'blockedTimes', calendarModuleName], cloneDeep(blockedTimeItems))
          }
        })
      })
    },

    async calculateBookingOpeningHours({ commit }, bookingOpeningHours = []) {
      commit('setBookingOpeningHoursSetup', bookingOpeningHours)
      const calculatedBookingOpeningHours = bookingOpeningHours.reduce((data, bookingOpeningHour) => {
        const minStartTimeInMinutes = convertTimeToMinutes(data.startTime)
        const maxFinishTimeInMinutes = convertTimeToMinutes(data.finishTime) + Number(data.crossDate) * options.minutes_of_24h

        const startTimeInMinutes = convertTimeToMinutes(bookingOpeningHour.start_time)
        const finishTimeInMinutes = convertTimeToMinutes(bookingOpeningHour.finish_time) + Number(bookingOpeningHour.cross_date) * options.minutes_of_24h

        if (startTimeInMinutes < minStartTimeInMinutes || data.startTime === null) {
          data.startTime = bookingOpeningHour.start_time
        }

        if (finishTimeInMinutes > maxFinishTimeInMinutes || data.finishTime === null) {
          data.crossDate = bookingOpeningHour.cross_date
          data.finishTime = bookingOpeningHour.finish_time
        }

        const openedDaysOfWeek = bookingOpeningHour?.opened_days_of_week ?? []
        openedDaysOfWeek.forEach(dayOfWeek => {
          data.bookingOpeningHours[dayOfWeek] = {
            crossDate:  bookingOpeningHour.cross_date,
            startTime:  bookingOpeningHour.start_time,
            finishTime: bookingOpeningHour.finish_time,
          }
        })

        return data
      }, {
        startTime:           null,
        finishTime:          null,
        crossDate:           false,
        bookingOpeningHours: {},
      })
      commit('setCrossDate', calculatedBookingOpeningHours.crossDate)
      commit('setStartTime', calculatedBookingOpeningHours.startTime)
      commit('setFinishTime', calculatedBookingOpeningHours.finishTime)
      commit('setBookingOpeningHours', calculatedBookingOpeningHours.bookingOpeningHours)
    },

    async changeCalendarResourceView({ commit }, { numberOfDay, resourceId }) {
      commit('setNumberOfDay', numberOfDay)
      commit('setSelectedResourceId', resourceId)
    },

    cancelCalendarSlotAccessible({ commit }) {
      commit('setCalendarSlotAccessible', false)
      commit('setCalendarSlotAccessOptions', null)
      commit('setCalendarSlotAccessCallback', null)
      commit('setMoveBookingMode', false)
    },

    async triggerCalendarSlotAccessible({ commit }, { callback, options }) {
      const readonly = options?.readonly ?? false

      commit('setCalendarSlotAccessible', !readonly)
      commit('setCalendarSlotAccessOptions', options)

      if (!readonly) {
        commit('setCalendarSlotAccessCallback', function (...args) {
          const finish = () => {
            commit('setMoveBookingMode', false)
            commit('setCalendarSlotAccessible', false)
            commit('setCalendarSlotAccessOptions', null)
            commit('setCalendarSlotAccessCallback', null)
          }

          callback(...args, finish)
        })
      }
    },

    async updateBookingResourceSpecificOffDay({ commit, state, rootState }, { bookingResourceSetupId = 0, updateSpecificOffDays = [] }) {
      const bookingResources = state.bookingResources || []
      const bookingResourcesIndex = bookingResources.findIndex(bookingResource => bookingResource.id === bookingResourceSetupId)

      if(bookingResourcesIndex === -1) {
        return
      }

      const currentResourceSpecificOffDays = bookingResources[bookingResourcesIndex].specific_off_days || []

      const defaultPayload = {
        bookingResourceSetupId,
        shopId: rootState.authentication.shop.shop_id,
      }

      if(currentResourceSpecificOffDays.length) {
        const deletePayload = {
          ...defaultPayload,
          sessionToken:    rootState.authentication.user.session_token,
          specificOffDays: currentResourceSpecificOffDays.map(day => convertDateToMomentUTC(day).unix()),
        }

        await deleteSpecificOffDay(deletePayload)
      }

      const updatePayload = {
        ...defaultPayload,
        specificOffDays: updateSpecificOffDays,
        sessionToken:    rootState.authentication.user.session_token,
      }

      const response = await addSpecificOffDay(updatePayload)
      const updatedSpecificOffDays = response?.data?.result ?? []

      bookingResources[bookingResourcesIndex].specific_off_days = updatedSpecificOffDays.map(updatedSpecificOffDay => {
        return convertTimestampToDate(updatedSpecificOffDay)
      })

      commit('setBookingResources', bookingResources)
    },

    /**
     * @description Handle specific day of booking setup resource changed
     * @param {Object} data
     * @param {Array} data.specificOffDayTS
     * @param {Numvber} data.bookingResourceId
     */
    changeBookingSetupResourceSpecificDay({ state, commit }, data) {
      const bookingResources = [...state.bookingResources]
      const changedBookingResourceIndex = bookingResources.findIndex(bookingResources => {
        return bookingResources.id === data.bookingResourceId
      })

      if (changedBookingResourceIndex === -1) return

      bookingResources[changedBookingResourceIndex].specific_off_days = data.specificOffDayTS.map(updatedSpecificOffDay => {
        return convertTimestampToDate(updatedSpecificOffDay)
      })

      commit('setBookingResources', bookingResources)
    },

    gotoNextDate({ state, getters, commit }) {
      let index = 1
      const dates = []

      const numberOfDay = state.numberOfDay
      const selectedDate = getters.dates.at(-1)

      while(dates.length < numberOfDay) {
        const nextDate = moment(selectedDate).add(index++, 'day')

        if (state.isExcludeOffBookingResource) {
          const isDayOff = !!state.specificOffDays.find(specificOffDay => isSameDay(specificOffDay, nextDate))

          if (isDayOff) continue
        }

        dates.push(nextDate)
      }

      commit('setSelectedDate', dates.at(0))
    },

    gotoPrevDate({ state, getters, commit }) {
      let index = 1
      const dates = []

      const numberOfDay = state.numberOfDay
      const selectedDate = getters.dates.at(0)

      while(dates.length < numberOfDay) {
        const nextDate = moment(selectedDate).subtract(index++, 'day')

        if (state.isExcludeOffBookingResource) {
          const isDayOff = !!state.specificOffDays.find(specificOffDay => isSameDay(specificOffDay, nextDate))

          if (isDayOff) continue
        }

        dates.unshift(nextDate)
      }

      commit('setSelectedDate', dates.at(0))
    },

    getCalendarViewMode() {
      try {
        const data = JSON.parse(localStorage.getItem('calendarViewModeByShopDesktop')) ?? {}

        if(typeof data !== 'object') {
          return {}
        }

        return data
      } catch (error) {
        return {}
      }
    },

    async setCalendarViewMode({ rootState, dispatch }, viewMode) {
      const shopId = rootState.authentication.shop.shop_id
      const viewModeByShops = await dispatch('getCalendarViewMode')
      viewModeByShops[shopId] = viewMode

      const data = JSON.stringify(viewModeByShops)

      localStorage.setItem('calendarViewModeByShopDesktop', data)
    },

    async deleteCalendarViewMode({ rootState, dispatch }) {
      const shopId = rootState.authentication.shop.shop_id
      const viewModeByShops = await dispatch('getCalendarViewMode')
      delete viewModeByShops[shopId]

      const data = JSON.stringify(viewModeByShops)

      localStorage.setItem('calendarViewModeByShopDesktop', data)
    },

    /**
     * @param {Object} data
     * @param {Boolean} timeShowUp
     * @param {Boolean} notesShowUp
     * @param {Boolean} serviceShowUp
     * @param {Boolean} memberNumberShowUp
     */
    setCalendarShowUp({ commit }, data) {
      commit('setTimeShowUp', data.timeShowUp ?? true)
      commit('setNotesShowUp', data.notesShowUp ?? true)
      commit('setServiceShowUp', data.serviceShowUp ?? true)
      commit('setMemberNumberShowUp', data.memberNumberShowUp ?? true)
    },

    /**
     * Load Resource Default Selection
     * From issue: https://gitlab.com/aha.software.2018/aha-testing/-/issues/2138
     */
    async loadResourceDefaultSelection({ state, rootState, commit, dispatch }, resource) {
      const selectedResourceLocal = store.state.booking.selectedResource
      const shopId = parseInt(rootState.authentication.shop.shop_id)
      const { selectedResourceId, isExcludeOffBookingResource } = getCalendarViewState(shopId, resource)
      const isMobileDevice = rootState.device.deviceInfo.isMobileDevice
      const currentResource = selectedResourceLocal.find(resource => resource.shop_id === shopId)

      if (currentResource) {
        const activeResource = selectedResourceId > 0
          ? state.bookingResources.find(resource => resource.id === selectedResourceId)
          : null

        if (activeResource) {
          commit('setSelectedResourceId', selectedResourceId)
        } else {
          if(isMobileDevice && state.bookingResources.length === 1) {
            commit('setSelectedResourceId', state.bookingResources[0].id)
          } else {
            commit('setSelectedResourceId', SELECTED_ALL)
            dispatch('changeCalendarResourceView', {
              resourceId:  0,
              numberOfDay: numberOfDaysViewAllLocalStorage(rootState.authentication.shop.shop_id),
            })
          }
        }
      } else {
        commit('setSelectedResourceId', SELECTED_ALL)
      }

      if(isMobileDevice && state.bookingResources.length === 1) {
        commit('setExcludeOffBookingResource', false)
      } else {
        commit('setExcludeOffBookingResource', isExcludeOffBookingResource)
      }

      /**
       * Load Resource View Mode (Number Of Day)
       * From issue: https://gitlab.com/aha.software.2018/aha-testing/-/issues/2124
       */
      if (selectedResourceId && currentResource) {
        const viewModeByShops = await dispatch('getCalendarViewMode')

        const numberOfDay = viewModeByShops[shopId]
        if (numberOfDay) {
          commit('setNumberOfDay', numberOfDay)
        }
      }
    },

    async checkOffDay({state}, data) {
      const dayOfWeek = moment(data.bookingDate).day()
      const bookingResource = state.bookingResources.find(item => item.id === data.bookingResourceSetupId)
      const bookingOpeningHourOfResource = bookingResource?.opening_hours[0].opened_days_of_week
      const specificOffDayIndex = state.specificOffDays.findIndex(specificOffDay => isSameDay(specificOffDay, data.bookingDate))

      return !state.bookingOpeningHours[dayOfWeek] || specificOffDayIndex !== -1 || !bookingOpeningHourOfResource.includes(dayOfWeek)
    },

    changeMaximumNumberOfResource({ state, commit, rootState}, selectNumber) {
      const shopId = rootState.authentication.shop.shop_id

      const selectedNumberOfResource = {
        shopId,
        numberOfResource: selectNumber,
      }

      const numberOfResourceByShop = state.maximumNumberOfResource ?? []
      const numberOfResourceIndex = numberOfResourceByShop.findIndex(numberResource => {
        return numberResource.shopId === shopId
      })

      if(numberOfResourceIndex !== -1) {
        numberOfResourceByShop.splice(numberOfResourceIndex, 1)
      } else if(numberOfResourceByShop.length >= LOCAL_STORAGE_LIST_LIMIT) {
        numberOfResourceByShop.pop()
      }

      numberOfResourceByShop.unshift(selectedNumberOfResource)

      commit('setMaximumNumberOfResourceByShop', numberOfResourceByShop)
    },
  }

  const module = {
    state,
    getters,
    actions,
    mutations,
    modules: {
      drag,
      bookings,
      waitings,
      workCalendar,
      workSchedule,
      blockedTimes,
      waitingAction,
      bookingAction,
      checkoutAction,
      sendMessageAction,
      clientInformation,
      bookingDescription,
    },
    namespaced: true,
  }

  store.registerModule('_calendar', module)

  store.watch(
    (state, getters) => getters['_calendar/viewModeDependency'],
    () => {
      store.dispatch('_calendar/registerCalendarModules')
    },
    { deep: true },
  )

  store.watch(
    store => store._calendar.displayCurrentTime,
    (displayCurrentTime) => {
      if (displayCurrentTime) {
        if (!store.hasModule(['_calendar', 'timeIndicator'])) {
          store.registerModule(['_calendar', 'timeIndicator'], generateTimeIndicatorModule())
        }

        store.dispatch('_calendar/timeIndicator/start')
      } else {
        if (store.hasModule(['_calendar', 'timeIndicator'])) {
          store.dispatch('_calendar/timeIndicator/stop')
        }
      }
    },
  )

  store.watch(
    store => store._calendar.drag.ghostBooking,
    (booking, prevBooking) => {
      if (!booking && prevBooking) {
        store.dispatch('_calendar/bookings/removeBooking', {
          booking: prevBooking,
        })
        store.commit('_calendar/bookings/removeBookingFromBookingSet',prevBooking)
        return
      }

      if (booking) {
        store.dispatch('_calendar/drag/showGhostBooking', { booking })
      }
    },
    { deep: true },
  )

  // store.watch(
  //   state => state._calendar.sendMessageAction.messageSetup,
  //   () => {
  //     const hasSetupBookingDepositGuide = store.getters['_calendar/sendMessageAction/hasSetupBookingDepositGuide']
  //     const hasSetupBookingDepositPaymentConfirm = store.getters['_calendar/sendMessageAction/hasSetupBookingDepositPaymentConfirm']

  //     if (!hasSetupBookingDepositGuide && !hasSetupBookingDepositPaymentConfirm) return

  //     if (!store.hasModule(['_calendar', 'sendMessageAction', 'client'])) {
  //       store.registerModule(['_calendar', 'sendMessageAction', 'client'], generateClientModules())
  //     }
  //   },
  //   {
  //     deep: true,
  //     immediate: true,
  //   }
  // )
}
