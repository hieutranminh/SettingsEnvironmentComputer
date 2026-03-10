// utils
import moment from 'moment'
import i18n from 'Translate'
import store from 'VuexStore'
import { uniq, pullAt } from 'lodash'

// constants
import { STANDARD_DATE_FORMAT, WEEKDAY_TRANSLATION_KEYS, DATE_FORMATS } from 'Constant'

const CUSTOM_STANDARD_DATE_FORMAT = {
  YMD:     'YYYY/MM/DD',
  YMD_HMS: 'YYYY/MM/DD HH:mm:ss',
}

// ***input TS to ...***

// input TS to Date
export function convertTimestampToUTCDate(TS = 0) {
  const momentDate = moment.unix(TS).utc()
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

// ***input date to ...***

// input Date to TS

export function getStartOfDayTSBySubtractMonth(number = 0, type = 'month') {
  return getStartOfTimezoneDateTS(subtractMonths(convertDateToTimezone(new Date()), number), type)
}

export function getStartOfTimezoneDateTS(date = new Date(), type = 'day') {
  return convertDateToMomentUTC(convertDateToTimezone(date)).startOf(type).unix()
}

export function getStartOfMonthTSBySubtract(number = 0) {
  return getStartOfTimezoneDateTS(subtractMonths(convertDateToTimezone(new Date()), number), 'month')
}

export function getSubtractMonthFromCurrentDateTS(number = 0) {
  return convertDateToMomentUTC(convertDateToTimezone(subtractMonths(convertDateToTimezone(new Date()), number))).unix()
}
export function getStartOfDayTSBySubtract(number = 0) {
  return getStartOfTimezoneDateTS(subtractDays(convertDateToTimezone(new Date()), number), 'day')
}

export function getStartOfDayTSBySubtractMonths(number = 0) {
  return getStartOfTimezoneDateTS(subtractMonths(addDays(convertDateToTimezone(new Date()), 1), number), 'day')
}

export function getEndOfTimezoneDateTS(date = new Date(), type = 'day') {
  return convertDateToMomentUTC(convertDateToTimezone(date)).endOf(type).unix()
}

export function getEndOfMonthTSByAdd(number = 0) {
  return getEndOfTimezoneDateTS(addMonths(convertDateToTimezone(new Date()), number), 'month')
}

export function getEndOfMonthTSBySubtract(number = 0) {
  return getEndOfTimezoneDateTS(subtractMonths(convertDateToTimezone(new Date()), number), 'month')
}

export function getStartOfDayTSByAdd(number = 0) {
  return getStartOfTimezoneDateTS(addDays(convertDateToTimezone(new Date()), number), 'day')
}

export function getCurrentTimezoneTS() {
  return convertDateToMomentUTC(convertDateToTimezone()).unix()
}

export function getCurrentUTCTimezoneTS() {
  return moment(convertDateToTimezone()).unix()
}

export function convertDateToTimeStamp(date = new Date()) {
  return convertDateToMomentUTC(date).unix()
}

export function getLaterMonthTs(date = new Date(), number = 1) {
  return getStartOfTimezoneDateTS(addMonths(date, number)) - 1
}

// input Date to Date
export function getStartOfDate(date = new Date(), type = 'day', isTimeZone = true) {
  if(isTimeZone) {
    return moment(convertDateToTimezone(date)).startOf(type).toDate()
  }
  return moment(date).startOf(type).toDate()
}

export function getEndOfDate(date = new Date(), type = 'day', isTimeZone = true) {
  if(isTimeZone) {
    return moment(convertDateToTimezone(date)).startOf(type).toDate()
  }
  return moment(date).startOf(type).toDate()
}

export function subtractDays(date = new Date(), number = 0) {
  return moment(date).subtract(number, 'days').toDate()
}

export function addDays(date = new Date(), number = 0) {
  return moment(date).add(number, 'days').toDate()
}

export function addMonths(date = new Date(), number = 0) {
  return moment(date).add(number, 'months').toDate()
}
export function subtractMonths(date = new Date(), number = 0) {
  return moment(date).subtract(number, 'months').toDate()
}

export function convertDateToTimezone(localDate = new Date(), includeHours = true) {
  let formatTemplate = ''
  if(includeHours) {
    formatTemplate = CUSTOM_STANDARD_DATE_FORMAT.YMD_HMS
  } else {
    formatTemplate = CUSTOM_STANDARD_DATE_FORMAT.YMD
  }
  const timezone = store.state.authentication.shop.timezone
  const format = moment(localDate).utcOffset(timezone).format(formatTemplate)
  const dateTimezone = new Date(format)
  return dateTimezone
}

export function convertTimestampInMinutes(timestamp) {
  return Math.floor(timestamp / 60)
}

// input Date to moment
export function convertDateToMomentUTC(date = new Date()) {
  const momentDate = moment().utc()
  momentDate.set({
    date:  date.getDate(),
    month: date.getMonth(),
    year:  date.getFullYear(),

    hour:        date.getHours(),
    minute:      date.getMinutes(),
    second:      date.getSeconds(),
    millisecond: date.getMilliseconds(),
  })
  return momentDate
}

// input TS to time

export function convertTimeStampToTime(timestamp) {
  let hours = parseInt(parseInt(timestamp / 60) / 60)
  let miuntes = parseInt(parseInt(timestamp / 60) % 60)
  return hours + ' ' + i18n.t('general.hour') + ' ' + miuntes + ' ' + i18n.t('general.minutes')
}

// input TS to TS

export function convertTSFromUTCToTimeZone(timestamp) {
  let zone = store.state.authentication.shop.timezone
  zone = Number(zone.slice(0, 3))
  timestamp += zone * 3600
  return timestamp
}

export function convertTSFromUTCToLocal(timestamp) {
  let zone = new Date().getTimezoneOffset() * -1
  timestamp += zone * 60
  return timestamp
}

// ***Format***
export function formatTSToUTCDate(TS = 0, formatTemplate = STANDARD_DATE_FORMAT.YMD) {
  if(TS) {
    return moment.unix(TS).utcOffset(0).format(formatTemplate)
  }
  return ''
}

export function formatTSToTimezoneDate(TS = 0, formatTemplate = STANDARD_DATE_FORMAT.YMD) {
  return moment.unix(TS).utcOffset(store.state.authentication.shop.timezone).format(formatTemplate)
}

export function formatStringOrDateObjToTimezoneDate(text = '', formatTemplate = STANDARD_DATE_FORMAT.YMD) {
  if(!text) {
    return ''
  }
  return convertDateToMomentUTC(new Date(text)).utcOffset(store.state.authentication.shop.timezone).format(formatTemplate)
}

export function formatStringOrDateObjToDate(text = '', formatTemplate = STANDARD_DATE_FORMAT.YMD) {
  if(!text) {
    return ''
  }
  return convertDateToMomentUTC(new Date(text)).format(formatTemplate)
}

//***validate*/
export function getDiffDateRange(fromDateTs = 0, toDateTS = 0, type = 'day') {
  return moment.unix(toDateTS).diff(moment.unix(fromDateTs), type, true)
}

export function checkDateRangeIsNotSame(fromDateTS = 0, toDateTS = 0, type = 'month') {
  const fromMonth = moment.unix(fromDateTS).utc()
  const toMonth = moment.unix(toDateTS).utc()

  return !moment(fromMonth).isSame(toMonth, type)
}
//**Utilities */

export function loadDayOfWeek(days, isShort = false) {
  // [1, 2] -> Monday, Tuesday
  days = uniq(days)
  let arrDay = []
  if (isShort) {
    arrDay = [
      i18n.t('general.sun'),
      i18n.t('general.mon'),
      i18n.t('general.tue'),
      i18n.t('general.wed'),
      i18n.t('general.thur'),
      i18n.t('general.fri'),
      i18n.t('general.sat'),
    ]
  } else {
    arrDay = [
      i18n.t('general.sunday'),
      i18n.t('general.monday'),
      i18n.t('general.tuesday'),
      i18n.t('general.wednesday'),
      i18n.t('general.thursday'),
      i18n.t('general.friday'),
      i18n.t('general.saturday'),
    ]
  }

  let strDay = pullAt(arrDay, days).join(', ')
  return strDay
}

export function formatDateBySetting(date = new Date(), hasHours = false) {
  const tmpShopData = store.state.authentication.shop
  if (hasHours)
    return moment(date).format(tmpShopData.format_date + ' HH:mm')
  else
    return moment(date).format(tmpShopData.format_date)
}

/**
 * Converts minutes to a formatted string representing hours and minutes.
 *
 * @param {number} minutes - The number of minutes to convert.
 * @param {boolean} [hasSecond=false] - Indicates whether to include seconds in the output. Default is false.
 * @param {boolean} [zeroInHour=true] - Indicates whether to pad the hour with a leading zero if it's less than 10. Default is true.
 * @returns {string} - A formatted string representing hours and minutes. If `hasSecond` is true, it includes seconds as well.
 */
export function convertMinutesToHours(minutes, hasSecond = false, zeroInHour = true) {
  let hour = Math.floor(minutes / 60)
  let minute = minutes % 60

  let hourStr = zeroInHour ? String(hour).padStart(2, '0') : String(hour)
  let minuteStr = String(minute).padStart(2, '0')

  return `${hourStr}:${minuteStr}${hasSecond ? ':00' : ''}`
}

/**
 * Converts a Unix timestamp to a UTC datetime object.
 *
 * @param {number} timestamp - The Unix timestamp in seconds to convert. If not provided or falsy, returns the current date.
 * @returns {Date} A Date object representing the timestamp in UTC format.
 */
export function convertTimeStampToUtcDatetime(timestamp) {
  if (!timestamp) return new Date()

  const date = new Date(timestamp * 1000)
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ))
}

/**
 * Converts an array of day indices to a comma-separated string of day names.
 *
 * @param {number[]} selectedDays - An array of day indices (0-6, where 0 is Sunday).
 * @returns {string} A comma-separated string of day names corresponding to the input indices.
 *                   Returns an empty string if the input array is empty or undefined.
 *
 * @example
 * // Returns "general.monday, general.wednesday" if WEEKDAY_TRANSLATION_KEYS is properly defined
 * loadTextOfWeek([1, 3])
 */
export function loadTextOfWeek(selectedDays) {
  // [1] -> general.monday
  if (!selectedDays?.length) {
    return ''
  }

  return selectedDays
    .map(dayIndex => WEEKDAY_TRANSLATION_KEYS[dayIndex])
    .join(', ')
}

/**
 * Converts a date from a specific timezone to a Unix timestamp
 *
 * @param {Date|string} date - The date to convert
 * @param {string} [zoneFrom] - The source timezone. Defaults to shop timezone
 * @param {boolean} [includeTime=false] - Whether to include hours/minutes/seconds
 * @returns {number|null} Unix timestamp in seconds, or null if date is invalid
 */
export function convertDateFromTimezoneToTimestamp(date, zoneFrom = null, includeTime = false) {
  // Validate input
  if (!moment(date).isValid()) {
    return null
  }

  // Use shop timezone if none provided
  const timezone = zoneFrom ?? store.state.authentication.shop.timezone

  // Format date string with or without time
  const format = includeTime ? DATE_FORMATS.WITH_TIME : DATE_FORMATS.WITHOUT_TIME
  const dateString = `${moment(date).format(format)}${timezone}`

  // Convert to timestamp (seconds)
  return Date.parse(dateString) / 1000
}

/**
 * Generates an array of Unix timestamps for all dates within a given range
 *
 * @param {number} fromTS - Start timestamp in seconds (Unix timestamp)
 * @param {number} toTS - End timestamp in seconds (Unix timestamp)
 * @returns {number[]} Array of Unix timestamps (in seconds) for each day in the range (inclusive)
 *
 * @example
 * // Generate timestamps for all dates between 2025-11-18 and 2025-11-21
 * const timestamps = generateDateRangeTimestamps(1763424000, 1763683200)
 * // Returns: [1763424000, 1763510400, 1763596800, 1763683200]
 */
export function generateDateRangeTimestamps(fromTS, toTS) {
  const dates = []
  const startMoment = moment.unix(fromTS).utc().startOf('day')
  const endMoment = moment.unix(toTS).utc().startOf('day')
  const currentMoment = startMoment.clone()

  // Generate all dates in range (inclusive)
  while (currentMoment.isSameOrBefore(endMoment, 'day')) {
    dates.push(currentMoment.unix())
    currentMoment.add(1, 'day')
  }

  return dates
}
