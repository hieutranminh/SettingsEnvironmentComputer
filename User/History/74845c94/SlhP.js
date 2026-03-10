import Vue from 'vue'
import moment from 'moment'
import store from 'VuexStore'

export const delay = miliseconds => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, miliseconds)
  })
}

export const convertTimeToMinutes = (time) => {
  const [hours, minutes] = String(time).split(':')
  return Number(hours) * 60 + Number(minutes)
}

export const convertMinutesToTime = (minutes, hasSeconds = true) => {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60

  return `${String(hour).padStart(2, 0)}:${String(minute).padStart(2, 0)}${hasSeconds ? ':00' : ''}`
}

// import { convertDateToMomentUTC } from 'Modules/calendar/utils/index'
/**@param {Date|moment} date */
export const convertDateToMomentUTC = (date = new Date()) => {
  if (date instanceof moment) {
    if (date.isUTC()) {
      return moment(date)
    }
  }

  const convertDate = moment().utc()
  const momentDate = moment(date).toDate()

  convertDate.set({
    date:  momentDate.getDate(),
    month: momentDate.getMonth(),
    year:  momentDate.getFullYear(),

    hour:        momentDate.getHours(),
    minute:      momentDate.getMinutes(),
    second:      momentDate.getSeconds(),
    millisecond: momentDate.getMilliseconds(),
  })

  return convertDate
}

// import { convertTimestampToMomentUTC } from 'Modules/calendar/utils/index'
export const convertTimestampToMomentUTC = timestamp => {
  return moment.unix(timestamp).utc()
}

export const convertTimestampToDate = (timestamp = 0) => {
  const momentDate = convertTimestampToMomentUTC(timestamp)

  return new Date(
    momentDate.get('year'),
    momentDate.get('month'),
    momentDate.get('date'),
    momentDate.get('hour'),
    momentDate.get('minute'),
    momentDate.get('second'),
    momentDate.get('millisecond'),
  )
}

export const convertDateToTimezone = (date = new Date()) => {
  const timezone = store.state.authentication.shop.timezone
  const momentDate = moment(date).utcOffset(timezone)

  return new Date(
    momentDate.get('year'),
    momentDate.get('month'),
    momentDate.get('date'),
    momentDate.get('hour'),
    momentDate.get('minute'),
    momentDate.get('second'),
    momentDate.get('millisecond'),
  )
}

export const convertTimestamptoDateTimeZone = (timestamp) => {
  const timezone = store.state.authentication.shop.timezone
  const momentDate = moment.unix(timestamp).utcOffset(timezone)

  return new Date(
    momentDate.get('year'),
    momentDate.get('month'),
    momentDate.get('date'),
    momentDate.get('hour'),
    momentDate.get('minute'),
    momentDate.get('second'),
    momentDate.get('millisecond'),
  )
}

/**
 * Converts a given time string to minutes.
 *
 * The given time string should be in the format of 'HH:MM'. The function
 * will throw an error if the parameter is not a string or if the string
 * does not contain two valid numbers separated by a colon.
 *
 * @param {string} time - The time to convert, in the format of 'HH:MM'.
 * @returns {number} The given time in minutes.
 * @throws {Error} If the parameter is not a string or if the string is not in the correct format.
 */
export const timeToMinutes = (time) => {
  if (typeof time !== 'string') {
    throw new Error('timeToMinutes expects a string parameter')
  }

  const [hours, minutes] = time.split(':').map((value) => {
    const number = Number(value)

    if (isNaN(number)) {
      throw new Error(`timeToMinutes expects a valid number in the parameter, got ${value}`)
    }

    return number
  })

  const adjustedHours = hours >= 0 && hours <= 12 ? hours + 24 : hours
  return adjustedHours * 60 + minutes
}

/**
 * Checks if the given timestamp corresponds to yesterday's date.
 *
 * @param {number} timestamp - The timestamp to check, in seconds.
 * @returns {boolean} True if the timestamp is yesterday, false otherwise.
 */
function isYesterday(timestamp) {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    return false
  }

  try {
    const zone = store.state.authentication.shop?.timezone || 0
    const dateToCheck = moment(timestamp * 1000).startOf('day')
    const yesterday = moment().subtract(1, 'days').utcOffset(zone).startOf('day')
    const result = yesterday.isSame(dateToCheck, 'day')
    return result
  } catch (error) {
    return false
  }
}

/**
 * Checks if the given timestamp corresponds to today's date.
 *
 * @param {number} specificWorkingDayTS - The timestamp to check, in seconds.
 * @returns {boolean} True if the timestamp is today, false otherwise.
 */
const isToday = (specificWorkingDayTS) => {
  if (typeof specificWorkingDayTS !== 'number' || isNaN(specificWorkingDayTS)) {
    return false
  }

  try {
    const targetDate = moment(specificWorkingDayTS * 1000).startOf('day')
    const today = moment().startOf('day')
    return today.isSame(targetDate, 'day')
  } catch (error) {
    return false
  }
}

/**
 * Finds the resource with the latest cross date.
 *
 * @param {Array} resources - Array of resources to check.
 * @returns {Object} An object with the following properties:
 *  - hasCrossDate: boolean indicating if any resource has a cross date.
 *  - latestResource: Object with the latest cross date, with the following properties:
 *    - finishTime: string in the format HH:MM.
 *    - crossDate: boolean indicating if the resource has a cross date.
 *    - source: string indicating the source of the cross date, either 'resource' or 'shop'.
 *    - resourceId: number with the ID of the resource.
 *    - specificWorkingDayId: number with the ID of the specific working day.
 *    - specificWorkingDay: string with the date of the specific working day in the format YYYY-MM-DD.
 *    - timestamp: number with the timestamp of the specific working day in seconds.
 */
export const findResourceWithLatestCrossDate = (resources) => {
  return resources.reduce((acc, resource) => {
    if (!resource || !resource.specificWorkingDays) {
      return acc
    }

    resource.specificWorkingDays.forEach((day) => {
      if (!isYesterday(day.specificWorkingDayTS)) {
        return
      }

      if (!day || !day.allowedBookingHours) {
        return
      }

      day.allowedBookingHours.forEach((hour) => {
        if (!hour || !hour.crossDate) {
          return
        }

        const currentMinutes = timeToMinutes(hour.finishTime)
        const resultMinutes = acc.latestResource ?
          timeToMinutes(acc.latestResource.finishTime) : 0

        if (!acc.latestResource || currentMinutes > resultMinutes) {
          acc.latestResource = {
            finishTime:           hour.finishTime,
            crossDate:            hour.crossDate,
            source:               'resource',
            resourceId:           resource.id,
            specificWorkingDayId: day.resourceSpecificWorkingDayId,
            specificWorkingDay:   day.specific_working_days_format,
            timestamp:            day.specificWorkingDayTS,
          }
        }

        acc.hasCrossDate = true
      })
    })
    return acc
  }, {
    hasCrossDate:   false,
    latestResource: null,
  })
}

/**
 * Get the latest finish time between the shop and resources.
 *
 * @param {Object} shopConfig - The shop configuration object.
 * @param {Array} resources - Array of resources to check.
 * @returns {Object} An object with the following properties:
 *  - crossDate: boolean indicating if the latest finish time has a cross date.
 *  - finishTime: string with the latest finish time in the format HH:MM.
 *  - resource: Object with the latest finish time resource.
 */
export const getLatestFinishTimeInfo = (shopConfig, resources) => {
  let result = {
    crossDate:  false,
    finishTime: null,
    resource:   null,
  }

  try {
    if (!shopConfig || !resources) {
      return result
    }

    const isShopCrossDay= shopConfig.openingHoursConvert.filter((item => {
      return item.crossDate
    })).length > 0

    const { hasCrossDate, latestResource } = findResourceWithLatestCrossDate(resources)
    // Convert shop finish time to minutes
    const shopMinutes = shopConfig.crossDate ? timeToMinutes(shopConfig.finishTime) : 0

    // Convert resource finish time to minutes
    const resourceMinutes = (hasCrossDate && latestResource) ?
      timeToMinutes(latestResource.finishTime) : 0

    if(!latestResource) {
      result.crossDate = isShopCrossDay
      result.finishTime = shopConfig.finishTime || null
      return result
    }

    // Compare and get the latest time
    if (resourceMinutes >= shopMinutes) {
      result.crossDate = latestResource.crossDate
      result.finishTime = latestResource.finishTime
      result.resource = latestResource
    } else {
      result.crossDate = shopConfig.crossDate
      result.finishTime = shopConfig.finishTime
    }

    return result

  } catch (error) {
    return result
  }
}

export const convertTimeToMoment = (time, format = 'HH:mm:ss') => moment(time, format)

/**
 * Adjusts the current date based on the specified finish time and cross-date flag.
 *
 * This function calculates the adjusted "today" date in the shop's timezone
 * (Korea, UTC+9). It handles both non-crossing and crossing date scenarios.
 *
 * - Non-crossing date: Returns the current day's start in UTC.
 * - Crossing date: If the current time is before or equal to the finish time,
 *   returns the previous day's start in UTC; otherwise, returns the current
 *   day's start in UTC.
 *
 * @param {string|moment.Moment} finishTime - The finish time for the shop, can be
 *   a string in 'HH:mm' format or a moment object.
 * @param {boolean} crossDate - Indicates whether the date crosses midnight.
 * @returns {moment.Moment} The adjusted date as a moment object in UTC.
 */
export const calculateCustomizeSelectedTodayDay = (finishTime, crossDate) => {
  // Get current time in shop's timezone (Korea) (timezone: +9)
  const now = convertDateToTimezone(new Date())
  const currentMoment = moment(now)

  // Case 1: Non-crossing date (e.g. 8am-11pm)
  // Simply return the date after converting to Korea timezone
  if (!crossDate) {
    return convertDateToMomentUTC(
      moment(now).startOf('day').toDate(),
    )
  }

  // Case 2: Crossing date (e.g. 8am-3am next day)
  const shopFinishTime = moment.isMoment(finishTime) ?
    finishTime :
    moment(finishTime, 'HH:mm')

  const currentTime = moment(currentMoment.format('HH:mm'), 'HH:mm')
  const finishTimeFormat = moment(shopFinishTime.format('HH:mm'), 'HH:mm')

  if (currentTime.isSameOrBefore(finishTimeFormat)) {
    return convertDateToMomentUTC(
      moment(now).subtract(1, 'day').startOf('day').toDate(),
    )
  }

  return convertDateToMomentUTC(
    moment(now).startOf('day').toDate(),
  )
}

/** @param {MouseEvent} event */
/** @param {Object} options */
/** @param {Element} options.target*/
/** @param {Number} options.timeSlot */
/** @param {Number} options.timeSlotHeight */
export const getMinutesFromMouseEvent = (event, target, options) => {
  const clientY = event.clientY
  const { top } = target.getBoundingClientRect()

  const timeSlots = Math.floor((clientY - top) / options.timeSlotHeight)
  return timeSlots * options.timeSlot
}

export const formatTimeBasedOnMinutes = ({ prefix = '', minutes = 0, format = 'hh:mm A' }) => {
  const time = moment.duration(minutes, 'minutes')
  const timeText = moment.utc(time.as('milliseconds')).format(format)

  if (prefix && time.days()) {
    return `${prefix} ${timeText}`
  }

  return timeText
}

export const formatTimeInfoInMinutes = ({ minutes = 0, format = 'hh:mm A' }) => {
  const time = moment.duration(minutes, 'minutes')
  const date = moment.utc(time.as('milliseconds'))

  if (time.days()) {
    /**
     * @description Post or Ante Meridiem (AM | PM)
     */
    const poam = date.format('A')

    return `${time.hours().toString().padStart(2, 0)}:${time.minutes().toString().padStart(2, 0)} ${poam}`
  }

  return date.format(format)
}

export const formatTimeInMinutes = ({ prefix = '', minutes = 0 }) => {
  const time = moment.duration(minutes, 'minutes')
  const timeText = `${time.hours().toString().padStart(2, 0)}:${time.minutes().toString().padStart(2, 0)}`

  if (prefix && time.days()) {
    return `${prefix} ${timeText}`
  }

  return timeText
}

export const formatTimeSlot = ({ prefix = '', minutes = 0 }) => {
  const time = moment.duration(minutes, 'minutes')

  if (prefix && time.days()) {
    return `${prefix} ${time.hours().toString().padStart(2, 0)}:${time.minutes().toString().padStart(2, 0)}`
  }

  return moment.utc(time.as('milliseconds')).format(time.hours() === 0 ? 'HH:mm A' : 'hh:mm A')
}

export const formatTimeSlotAtMobile = ({ prefix = '', minutes = 0 }) => {
  const time = moment.duration(minutes, 'minutes')

  if (prefix && time.days()) {
    return `${prefix} ${time.hours().toString().padStart(2, 0)}`
  }

  return moment.utc(time.as('milliseconds')).format(time.hours() === 0 ? 'HH A' : 'hh A')
}

export const convertMinutesToFormattedTime = minutes => {
  const time = moment.duration(minutes, 'minutes')

  return `${time.hours().toString().padStart(2, 0)}:${time.minutes().toString().padStart(2, 0)}:00`
}

export const roundUpTo30Minutes = (minutes) => {
  if (minutes <= 0) {
    return 0
  }
  return Math.ceil(minutes / 30) * 30
}

export const roundDownTo60Minutes = (minutes) => {
  if (minutes <= 0) {
    return 0
  }
  return Math.floor(minutes / 60) * 60
}

export const CalendarEventBus = new Vue()
