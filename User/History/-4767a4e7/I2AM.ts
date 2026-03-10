import dayjs from 'dayjs'
import isBetweenPlugin from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetweenPlugin)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(updateLocale)

// Import Korean locale
import 'dayjs/locale/ko'

import { DATE_RANGE_PRESETS } from '@/constants'
import { getTimezoneByCountryCode } from '@/utils/common'
// Type definitions
export type DateFormat = 'date' | 'time' | 'datetime' | 'relative' | 'custom' | 'yearMonth'
export type LocaleType = 'en' | 'ko'
export type TimezoneType = 'local' | 'Asia/Seoul' | 'UTC' | 'Asia/Ho_Chi_Minh'

export interface IDateFormatOptions {
  format?: DateFormat
  locale?: LocaleType
  timezone?: TimezoneType
  customFormat?: string
  includeTime?: boolean
}

export interface ITimezoneConvertOptions {
  keepLocalTime?: boolean
}

export interface IRelativeTimeOptions {
  locale?: LocaleType
  withoutSuffix?: boolean
}

// Default timezone
const DEFAULT_TIMEZONE = 'local'

// Constants for magic numbers
const MILLISECONDS_PER_SECOND = 1000
const DEFAULT_MONTHS_RANGE = 12
const DAYS_TO_ADD_FOR_RANGE = 6

// Korean relative time translations
dayjs.updateLocale('ko', {
  relativeTime: {
    future: '%s 후',
    past: '%s 전',
    seconds: '몇 초',
    minute: '1분',
    mm: '%d분',
    hour: '1시간',
    hh: '%d시간',
    day: '1일',
    dd: '%d일',
    week: '1주',
    ww: '%d주',
    month: '1개월',
    MM: '%d개월',
    year: '1년',
    yy: '%d년',
  },
})

/**
 * Convert date to specified timezone
 *
 * @param date - The date to convert (Date object, dayjs object, or date string)
 * @param targetTimezone - Target timezone ('local', 'Asia/Seoul', or 'UTC'). Defaults to 'Asia/Seoul'
 * @param options - Conversion options
 * @param options.keepLocalTime - When converting to UTC, whether to keep the local time values. Defaults to false
 * @returns dayjs object in the specified timezone
 *
 * @example
 * ```typescript
 * const now = new Date('2024-01-15T14:30:00') // 2:30 PM local time
 *
 * // Standard timezone conversion (changes actual time)
 * const seoulTime = convertTimezone(now, 'Asia/Seoul')
 * // If local time is 2:30 PM, seoulTime will be converted to Seoul timezone
 *
 * const utcTime = convertTimezone(now, 'UTC')
 * // Converts to UTC timezone (changes actual time)
 *
 * // Keep local time when converting to UTC (only changes timezone, not time values)
 * const utcKeepLocal = convertTimezone(now, 'UTC', { keepLocalTime: true })
 * // If local time is 2:30 PM, result will be 2:30 PM UTC (same time values, different timezone)
 *
 * const localTime = convertTimezone(now, 'local')
 * // Keeps in local timezone
 * ```
 */
export const convertTimezone = (
  date: dayjs.Dayjs | Date | string,
  targetTimezone: TimezoneType = DEFAULT_TIMEZONE,
  options: ITimezoneConvertOptions = {},
): dayjs.Dayjs => {
  const { keepLocalTime = false } = options
  const dayjsDate = dayjs(date)

  if (targetTimezone === 'local') {
    return dayjsDate.local()
  }

  if (targetTimezone === 'UTC') {
    return dayjsDate.utc(keepLocalTime)
  }

  return dayjsDate.tz(targetTimezone)
}

/**
 * Convert date to UTC timezone
 *
 * @param date - The date to convert (Date object, dayjs object, or date string)
 * @param options - Conversion options
 * @param options.keepLocalTime - When converting to UTC, whether to keep the local time values. Defaults to false
 * @returns dayjs object in UTC timezone
 *
 * @example
 * ```typescript
 * const now = new Date('2024-01-15T14:30:00')
 * const utcDate = convertToUTC(now)
 * // Returns: dayjs object with 2024-01-15T14:30:00 UTC
 *
 * const utcDateKeepLocal = convertToUTC(now, { keepLocalTime: true })
 * // Returns: dayjs object with 2024-01-15T14:30:00 local time
 * ```
 */
export const convertToUTC = (
  date: dayjs.Dayjs | Date | string,
  options: ITimezoneConvertOptions = {},
): dayjs.Dayjs => {
  const { keepLocalTime = false } = options
  const dayjsDate = dayjs(date)
  return dayjsDate.utc(keepLocalTime)
}

/**
 * Format relative time (e.g., "3 days ago", "in 2 hours")
 *
 * @param date - The date to format (Date object, dayjs object, or date string)
 * @param options - Formatting options
 * @param options.locale - Locale: 'en' or 'ko'
 * @param options.withoutSuffix - Whether to exclude "ago"/"in" suffix
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * const now = new Date()
 * const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
 * const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
 *
 * // English
 * formatRelativeTime(yesterday, { locale: 'en' })
 * // Output: "a day ago"
 *
 * formatRelativeTime(tomorrow, { locale: 'en' })
 * // Output: "in a day"
 *
 * formatRelativeTime(yesterday, { locale: 'en', withoutSuffix: true })
 * // Output: "a day"
 *
 * // Korean
 * formatRelativeTime(yesterday, { locale: 'ko' })
 * // Output: "1일 전"
 *
 * formatRelativeTime(tomorrow, { locale: 'ko' })
 * // Output: "1일 후"
 * ```
 */
export const formatRelativeTime = (
  date: dayjs.Dayjs | Date | string,
  options: IRelativeTimeOptions = {},
): string => {
  const { locale = 'en', withoutSuffix = false } = options

  const dayjsDate = dayjs(date)
  const formattedDate = locale === 'ko' ? dayjsDate.locale('ko') : dayjsDate.locale('en')

  return formattedDate.fromNow(withoutSuffix)
}

/**
 * Get start of day, week, month, or year
 *
 * @param date - The reference date (Date object, dayjs object, or date string)
 * @param unit - Time unit: 'day', 'week', 'month', or 'year'
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @param options - Timezone conversion options
 * @param options.keepLocalTime - When converting to UTC timezone, whether to keep
 * the local time values. Defaults to false
 * @returns dayjs object representing the start of the specified period
 *
 * @example
 * ```typescript
 * const now = new Date('2024-01-15T14:30:00')
 *
 * getStartOf(now, 'day')
 * // Returns: 2024-01-15 00:00:00
 *
 * getStartOf(now, 'week')
 * // Returns: 2024-01-14 00:00:00 (assuming Sunday is start of week)
 *
 * getStartOf(now, 'month')
 * // Returns: 2024-01-01 00:00:00
 *
 * getStartOf(now, 'year')
 * // Returns: 2024-01-01 00:00:00
 *
 * // With UTC timezone but keeping local time values
 * getStartOf(now, 'day', 'UTC', { keepLocalTime: true })
 * // Returns: 2024-01-15 00:00:00 UTC (treated as UTC time, not converted)
 * ```
 */
export const getStartOf = (
  date: dayjs.Dayjs | Date | string,
  unit: 'day' | 'week' | 'month' | 'year',
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: ITimezoneConvertOptions = {},
): dayjs.Dayjs => {
  const dayjsDate = convertTimezone(date, timezone, options)

  switch (unit) {
    case 'day':
      return dayjsDate.startOf('day')
    case 'week':
      return dayjsDate.startOf('week')
    case 'month':
      return dayjsDate.startOf('month')
    case 'year':
      return dayjsDate.startOf('year')
    default:
      return dayjsDate.startOf('day')
  }
}

/**
 * Get end of day, week, month, or year
 *
 * @param date - The reference date (Date object, dayjs object, or date string)
 * @param unit - Time unit: 'day', 'week', 'month', or 'year'
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @param options - Timezone conversion options
 * @param options.keepLocalTime - When converting to UTC timezone, whether to keep
 * the local time values. Defaults to false
 * @returns dayjs object representing the end of the specified period
 *
 * @example
 * ```typescript
 * const now = new Date('2024-01-15T14:30:00')
 *
 * getEndOf(now, 'day')
 * // Returns: 2024-01-15 23:59:59.999
 *
 * getEndOf(now, 'week')
 * // Returns: 2024-01-20 23:59:59.999 (assuming Saturday is end of week)
 *
 * getEndOf(now, 'month')
 * // Returns: 2024-01-31 23:59:59.999
 *
 * getEndOf(now, 'year')
 * // Returns: 2024-12-31 23:59:59.999
 *
 * // With UTC timezone but keeping local time values
 * getEndOf(now, 'day', 'UTC', { keepLocalTime: true })
 * // Returns: 2024-01-15 23:59:59.999 UTC (treated as UTC time, not converted)
 * ```
 */
export const getEndOf = (
  date: dayjs.Dayjs | Date | string,
  unit: 'day' | 'week' | 'month' | 'year',
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: ITimezoneConvertOptions = {},
): dayjs.Dayjs => {
  const dayjsDate = convertTimezone(date, timezone, options)

  switch (unit) {
    case 'day':
      return dayjsDate.endOf('day')
    case 'week':
      return dayjsDate.endOf('week')
    case 'month':
      return dayjsDate.endOf('month')
    case 'year':
      return dayjsDate.endOf('year')
    default:
      return dayjsDate.endOf('day')
  }
}

/**
 * Check if a date is today
 *
 * @param date - The date to check (Date object, dayjs object, or date string)
 * @returns true if the date is today, false otherwise
 *
 * @example
 * ```typescript
 * const today = new Date()
 * const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
 *
 * isToday(today)     // true
 * isToday(yesterday) // false
 * ```
 */
export const isToday = (date: dayjs.Dayjs | Date | string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * Check if two dates are the same day
 *
 * @param date1 - First date (Date object, dayjs object, or date string)
 * @param date2 - Second date (Date object, dayjs object, or date string)
 * @returns true if both dates are the same day, false otherwise
 *
 * @example
 * ```typescript
 * const date1 = new Date('2024-01-15T10:00:00')
 * const date2 = new Date('2024-01-15T20:00:00')
 * const date3 = new Date('2024-01-16T10:00:00')
 *
 * isSameDay(date1, date2) // true (same day, different times)
 * isSameDay(date1, date3) // false (different days)
 * ```
 */
export const isSameDay = (
  date1: dayjs.Dayjs | Date | string,
  date2: dayjs.Dayjs | Date | string,
): boolean => {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

/**
 * Check if first date is before second date
 *
 * @param date1 - First date (Date object, dayjs object, or date string)
 * @param date2 - Second date (Date object, dayjs object, or date string)
 * @param unit - Time unit for comparison. Defaults to 'day'
 * @returns true if date1 is before date2, false otherwise
 *
 * @example
 * ```typescript
 * const date1 = new Date('2024-01-15T10:00:00')
 * const date2 = new Date('2024-01-16T10:00:00')
 *
 * isBefore(date1, date2)        // true (different days)
 * isBefore(date1, date2, 'day') // true
 * isBefore(date1, date2, 'hour') // true (different hours)
 * isBefore(date1, date2, 'minute') // true (different minutes)
 * ```
 */
export const isBefore = (
  date1: dayjs.Dayjs | Date | string,
  date2: dayjs.Dayjs | Date | string,
  unit: dayjs.OpUnitType = 'day',
): boolean => {
  return dayjs(date1).isBefore(dayjs(date2), unit)
}

/**
 * Check if first date is after second date
 *
 * @param date1 - First date (Date object, dayjs object, or date string)
 * @param date2 - Second date (Date object, dayjs object, or date string)
 * @param unit - Time unit for comparison. Defaults to 'day'
 * @returns true if date1 is after date2, false otherwise
 *
 * @example
 * ```typescript
 * const date1 = new Date('2024-01-16T10:00:00')
 * const date2 = new Date('2024-01-15T10:00:00')
 *
 * isAfter(date1, date2)        // true (different days)
 * isAfter(date1, date2, 'day') // true
 * isAfter(date1, date2, 'hour') // true (different hours)
 * ```
 */
export const isAfter = (
  date1: dayjs.Dayjs | Date | string,
  date2: dayjs.Dayjs | Date | string,
  unit: dayjs.OpUnitType = 'day',
): boolean => {
  return dayjs(date1).isAfter(dayjs(date2), unit)
}

/**
 * Check if a date is between two other dates
 *
 * @param date - The date to check (Date object, dayjs object, or date string)
 * @param startDate - Start of range (Date object, dayjs object, or date string)
 * @param endDate - End of range (Date object, dayjs object, or date string)
 * @param unit - Time unit for comparison. Defaults to 'day'
 * @param inclusivity - Range inclusivity: '()', '[]', '(]', or '[)'. Defaults to '[]'
 * @returns true if date is between startDate and endDate, false otherwise
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T12:00:00')
 * const start = new Date('2024-01-10T00:00:00')
 * const end = new Date('2024-01-20T00:00:00')
 *
 * isBetween(date, start, end)           // true (inclusive)
 * isBetween(date, start, end, 'day')    // true
 * isBetween(date, start, end, 'day', '()') // false (exclusive)
 * isBetween(date, start, end, 'day', '(]') // true (exclusive start, inclusive end)
 * ```
 */
export const isBetween = (
  date: dayjs.Dayjs | Date | string,
  startDate: dayjs.Dayjs | Date | string,
  endDate: dayjs.Dayjs | Date | string,
  options: { unit?: dayjs.OpUnitType; inclusivity?: '()' | '[]' | '(]' | '[)' } = {},
): boolean => {
  const { unit = 'day', inclusivity = '[]' } = options
  return dayjs(date).isBetween(dayjs(startDate), dayjs(endDate), unit, inclusivity)
}

/**
 * Add time to a date
 *
 * @param date - The base date (Date object, dayjs object, or date string)
 * @param amount - Amount to add
 * @param unit - Time unit: 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
 * @returns dayjs object with time added
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T10:00:00')
 *
 * addTime(date, 1, 'day')
 * // Returns: 2024-01-16T10:00:00
 *
 * addTime(date, 2, 'week')
 * // Returns: 2024-01-29T10:00:00
 *
 * addTime(date, 3, 'hour')
 * // Returns: 2024-01-15T13:00:00
 * ```
 */
export const addTime = (
  date: dayjs.Dayjs | Date | string,
  amount: number,
  unit: dayjs.ManipulateType,
): dayjs.Dayjs => {
  return dayjs(date).add(amount, unit)
}

/**
 * Subtract time from a date
 *
 * @param date - The base date (Date object, dayjs object, or date string)
 * @param amount - Amount to subtract
 * @param unit - Time unit: 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
 * @returns dayjs object with time subtracted
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T10:00:00')
 *
 * subtractTime(date, 1, 'day')
 * // Returns: 2024-01-14T10:00:00
 *
 * subtractTime(date, 2, 'week')
 * // Returns: 2024-01-01T10:00:00
 *
 * subtractTime(date, 3, 'hour')
 * // Returns: 2024-01-15T07:00:00
 * ```
 */
export const subtractTime = (
  date: dayjs.Dayjs | Date | string,
  amount: number,
  unit: dayjs.ManipulateType,
): dayjs.Dayjs => {
  return dayjs(date).subtract(amount, unit)
}

/**
 * Get the difference between two dates
 *
 * @param date1 - First date (Date object, dayjs object, or date string)
 * @param date2 - Second date (Date object, dayjs object, or date string)
 * @param unit - Time unit for difference. Defaults to 'day'
 * @returns Number representing the difference in the specified unit
 *
 * @example
 * ```typescript
 * const date1 = new Date('2024-01-15T10:00:00')
 * const date2 = new Date('2024-01-20T10:00:00')
 *
 * getDifference(date2, date1, 'day')   // 5 (5 days difference)
 * getDifference(date2, date1, 'hour')  // 120 (120 hours difference)
 * getDifference(date2, date1, 'week')  // 0 (same week)
 *
 * // Negative if date1 is after date2
 * getDifference(date1, date2, 'day')   // -5
 * ```
 */
export const getDifference = (
  date1: dayjs.Dayjs | Date | string,
  date2: dayjs.Dayjs | Date | string,
  unit: dayjs.OpUnitType = 'day',
): number => {
  return dayjs(date1).diff(dayjs(date2), unit)
}

/**
 * Parse date string with validation
 *
 * @param dateString - Date string to parse
 * @param format - Optional format string for parsing
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @returns dayjs object if valid, null if invalid
 *
 * @example
 * ```typescript
 * parseDate('2024-01-15')
 * // Returns: dayjs object for 2024-01-15
 *
 * parseDate('15/01/2024', 'DD/MM/YYYY')
 * // Returns: dayjs object for 2024-01-15
 *
 * parseDate('invalid-date')
 * // Returns: null
 *
 * parseDate('2024-01-15', undefined, 'Asia/Seoul')
 * // Returns: dayjs object in Seoul timezone
 * ```
 */
export const parseDate = (
  dateString: string,
  format?: string,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
): dayjs.Dayjs | null => {
  try {
    const parsed = format ? dayjs(dateString, format) : dayjs(dateString)
    return parsed.isValid() ? convertTimezone(parsed, timezone) : null
  } catch {
    return null
  }
}

/**
 * Validate if date string is valid
 *
 * @param dateString - Date string to validate
 * @param format - Optional format string for validation
 * @returns true if valid date, false otherwise
 *
 * @example
 * ```typescript
 * isValidDate('2024-01-15')           // true
 * isValidDate('2024-13-45')           // false (invalid date)
 * isValidDate('15/01/2024', 'DD/MM/YYYY') // true
 * isValidDate('15/01/2024', 'MM/DD/YYYY') // false (wrong format)
 * ```
 */
export const isValidDate = (dateString: string, format?: string): boolean => {
  try {
    const parsed = format ? dayjs(dateString, format) : dayjs(dateString)
    return parsed.isValid()
  } catch {
    return false
  }
}

/**
 * Get current date in specified timezone
 *
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @returns dayjs object representing current date/time
 *
 * @example
 * ```typescript
 * getCurrentDate()
 * // Returns: current date in local timezone
 *
 * getCurrentDate('Asia/Seoul')
 * // Returns: current date in Seoul timezone
 *
 * getCurrentDate('UTC')
 * // Returns: current date in UTC
 * ```
 */
export const getCurrentDate = (
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: TimezoneConvertOptions = {},
): dayjs.Dayjs => {
  return convertTimezone(dayjs(), timezone, options)
}

/**
 * Get date range for a specific period
 *
 * @param startDate - Start date (Date object, dayjs object, or date string)
 * @param endDate - End date (Date object, dayjs object, or date string)
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @returns Object with start and end dayjs objects
 *
 * @example
 * ```typescript
 * const start = new Date('2024-01-01')
 * const end = new Date('2024-01-31')
 *
 * const range = getDateRange(start, end)
 * // Returns: { start: dayjs('2024-01-01'), end: dayjs('2024-01-31') }
 *
 * const seoulRange = getDateRange(start, end, 'Asia/Seoul')
 * // Returns: range converted to Seoul timezone
 * ```
 */
export const getDateRange = (
  startDate: dayjs.Dayjs | Date | string,
  endDate: dayjs.Dayjs | Date | string,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  return {
    start: convertTimezone(startDate, timezone),
    end: convertTimezone(endDate, timezone),
  }
}

/**
 * Get week number of the year
 *
 * @param date - The date to get week number for (Date object, dayjs object, or date string)
 * @returns Week number (1-53)
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15')
 * getWeekNumber(date) // Returns: 3 (3rd week of 2024)
 *
 * const date2 = new Date('2024-12-31')
 * getWeekNumber(date2) // Returns: 53 (last week of 2024)
 * ```
 */
export const getWeekNumber = (date: dayjs.Dayjs | Date | string): number => {
  return dayjs(date).week()
}

/**
 * Get month name in specified locale
 *
 * @param date - The date to get month name for (Date object, dayjs object, or date string)
 * @param locale - Locale: 'en' or 'ko'. Defaults to 'en'
 * @param format - Format: 'long' or 'short'. Defaults to 'long'
 * @returns Month name string
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15')
 *
 * getMonthName(date, 'en', 'long')   // "January"
 * getMonthName(date, 'en', 'short')  // "Jan"
 * getMonthName(date, 'ko', 'long')   // "1월"
 * getMonthName(date, 'ko', 'short')  // "1월" (Korean doesn't have short form)
 * ```
 */
export const getMonthName = (
  date: dayjs.Dayjs | Date | string,
  locale: LocaleType = 'en',
  format: 'long' | 'short' = 'long',
): string => {
  const dayjsDate = dayjs(date)
  const formattedDate = locale === 'ko' ? dayjsDate.locale('ko') : dayjsDate.locale('en')

  return format === 'long' ? formattedDate.format('MMMM') : formattedDate.format('MMM')
}

/**
 * Get day name in specified locale
 *
 * @param date - The date to get day name for (Date object, dayjs object, or date string)
 * @param locale - Locale: 'en' or 'ko'. Defaults to 'en'
 * @param format - Format: 'long' or 'short'. Defaults to 'long'
 * @returns Day name string
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15') // Monday
 *
 * getDayName(date, 'en', 'long')   // "Monday"
 * getDayName(date, 'en', 'short')  // "Mon"
 * getDayName(date, 'ko', 'long')   // "월요일"
 * getDayName(date, 'ko', 'short')  // "월"
 * ```
 */
export const getDayName = (
  date: dayjs.Dayjs | Date | string,
  locale: LocaleType = 'en',
  format: 'long' | 'short' = 'long',
): string => {
  const dayjsDate = dayjs(date)
  const formattedDate = locale === 'ko' ? dayjsDate.locale('ko') : dayjsDate.locale('en')

  return format === 'long' ? formattedDate.format('dddd') : formattedDate.format('ddd')
}

/**
 * Convert between timezones
 *
 * @param date - The date to convert (Date object, dayjs object, or date string)
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns dayjs object in target timezone
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T10:00:00')
 *
 * convertBetweenTimezones(date, 'local', 'Asia/Seoul')
 * // Converts from local to Seoul timezone
 *
 * convertBetweenTimezones(date, 'UTC', 'Asia/Seoul')
 * // Converts from UTC to Seoul timezone
 *
 * convertBetweenTimezones(date, 'Asia/Seoul', 'local')
 * // Converts from Seoul to local timezone
 * ```
 */
export const convertBetweenTimezones = (
  date: dayjs.Dayjs | Date | string,
  fromTimezone: TimezoneType,
  toTimezone: TimezoneType,
): dayjs.Dayjs => {
  const dayjsDate = dayjs(date)

  if (fromTimezone === 'local' && toTimezone === 'local') {
    return dayjsDate
  }

  if (fromTimezone === 'local') {
    return dayjsDate.tz(toTimezone)
  }

  if (toTimezone === 'local') {
    return dayjsDate.tz(fromTimezone).local()
  }

  return dayjsDate.tz(fromTimezone).tz(toTimezone)
}

/**
 * Get timezone offset in minutes
 *
 * @param timezone - Timezone to get offset for. Defaults to 'local'
 * @returns Offset in minutes from UTC
 *
 * @example
 * ```typescript
 * getTimezoneOffset()           // Local timezone offset (e.g., -300 for EST)
 * getTimezoneOffset('UTC')      // 0
 * getTimezoneOffset('Asia/Seoul') // 540 (UTC+9)
 * ```
 */
export const getTimezoneOffset = (timezone: TimezoneType = DEFAULT_TIMEZONE): number => {
  if (timezone === 'local') {
    return dayjs().utcOffset()
  }

  if (timezone === 'UTC') {
    return 0
  }

  const dayjsInstance = dayjs().tz(timezone)
  return dayjsInstance.utcOffset()
}

/**
 * Check if date is in the past
 *
 * @param date - The date to check (Date object, dayjs object, or date string)
 * @returns true if date is in the past, false otherwise
 *
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
 *
 * isPast(yesterday) // true
 * isPast(tomorrow)  // false
 * isPast(new Date()) // false (current time is not in the past)
 * ```
 */
export const isPast = (date: dayjs.Dayjs | Date | string): boolean => {
  return dayjs(date).isBefore(dayjs())
}

/**
 * Check if date is in the future
 *
 * @param date - The date to check (Date object, dayjs object, or date string)
 * @returns true if date is in the future, false otherwise
 *
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
 *
 * isFuture(yesterday) // false
 * isFuture(tomorrow)  // true
 * isFuture(new Date()) // false (current time is not in the future)
 * ```
 */
export const isFuture = (date: dayjs.Dayjs | Date | string): boolean => {
  return dayjs(date).isAfter(dayjs())
}

/**
 * Get age from birth date
 *
 * @param birthDate - Birth date (Date object, dayjs object, or date string)
 * @returns Age in years
 *
 * @example
 * ```typescript
 * const birthDate = new Date('1990-05-15')
 * getAge(birthDate) // Returns: 33 (as of 2024)
 *
 * const birthDate2 = '1995-12-25'
 * getAge(birthDate2) // Returns: 28 (as of 2024)
 * ```
 */
export const getAge = (birthDate: dayjs.Dayjs | Date | string): number => {
  return dayjs().diff(dayjs(birthDate), 'year')
}

/**
 * Convert date to Unix timestamp in seconds
 *
 * @param date - The date to convert (Date object, dayjs object, or date string)
 * @param timezone - Timezone for the conversion. Defaults to 'local'
 * @param options - Timezone conversion options
 * @param options.keepLocalTime - When converting to UTC timezone, whether to keep
 * the local time values. Defaults to false
 * @returns Unix timestamp in seconds (number of seconds since January 1, 1970 UTC)
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T10:30:00')
 *
 * toUnixTimestamp(date)
 * // Returns: 1705315800 (example timestamp)
 *
 * toUnixTimestamp('2024-01-15T10:30:00')
 * // Returns: 1705315800
 *
 * toUnixTimestamp(date, 'UTC')
 * // Returns: Unix timestamp in UTC (time converted to UTC)
 *
 * toUnixTimestamp(date, 'UTC', { keepLocalTime: true })
 * // Returns: Unix timestamp treating the input as UTC time (no conversion)
 *
 * toUnixTimestamp(date, 'Asia/Seoul')
 * // Returns: Unix timestamp in Seoul timezone
 *
 * // Current timestamp
 * toUnixTimestamp(new Date())
 * // Returns: Current Unix timestamp in seconds
 * ```
 */
export const toUnixTimestamp = (
  date: dayjs.Dayjs | Date | string,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: TimezoneConvertOptions = {},
): number => {
  const dayjsDate = convertTimezone(date, timezone, options)
  return dayjsDate.unix()
}

/**
 * Convert date to Unix timestamp in milliseconds
 *
 * @param date - The date to convert (Date object, dayjs object, or date string)
 * @param timezone - Timezone for the conversion. Defaults to 'local'
 * @param options - Timezone conversion options
 * @param options.keepLocalTime - When converting to UTC timezone, whether to keep
 * the local time values. Defaults to false
 * @returns Unix timestamp in milliseconds (number of milliseconds since January 1, 1970 UTC)
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T10:30:00')
 *
 * toUnixTimestampMs(date)
 * // Returns: 1705315800000 (example timestamp in milliseconds)
 *
 * toUnixTimestampMs('2024-01-15T10:30:00')
 * // Returns: 1705315800000
 *
 * toUnixTimestampMs(date, 'UTC', { keepLocalTime: true })
 * // Returns: Unix timestamp treating the input as UTC time (no conversion)
 *
 * // Current timestamp in milliseconds
 * toUnixTimestampMs(new Date())
 * // Returns: Current Unix timestamp in milliseconds
 *
 * // Equivalent to Date.now()
 * toUnixTimestampMs(new Date()) === Date.now() // true
 * ```
 */
export const toUnixTimestampMs = (
  date: dayjs.Dayjs | Date | string,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: TimezoneConvertOptions = {},
): number => {
  const dayjsDate = convertTimezone(date, timezone, options)
  return dayjsDate.valueOf()
}

/**
 * Convert Unix timestamp in seconds to date
 *
 * @param timestamp - Unix timestamp in seconds
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @param options - Timezone conversion options
 * @param options.keepLocalTime - When converting to UTC timezone, whether to keep
 * the local time values. Defaults to false
 * @returns dayjs object representing the date
 *
 * @example
 * ```typescript
 * const timestamp = 1705315800 // January 15, 2024 10:30:00 UTC
 *
 * fromUnixTimestamp(timestamp)
 * // Returns: dayjs object for 2024-01-15T10:30:00
 *
 * fromUnixTimestamp(timestamp, 'UTC')
 * // Returns: dayjs object in UTC timezone (time converted)
 *
 * fromUnixTimestamp(timestamp, 'UTC', { keepLocalTime: true })
 * // Returns: dayjs object treating the timestamp as local time values in UTC
 *
 * fromUnixTimestamp(timestamp, 'Asia/Seoul')
 * // Returns: dayjs object in Seoul timezone
 *
 * // Format the result
 * formatDate(fromUnixTimestamp(timestamp), { locale: 'en' })
 * // Output: "2024-01-15"
 * ```
 */
export const fromUnixTimestamp = (
  timestamp: number,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: TimezoneConvertOptions = {},
): dayjs.Dayjs => {
  const dayjsDate = dayjs.unix(timestamp)
  return convertTimezone(dayjsDate, timezone, options)
}

/**
 * Convert Unix timestamp in milliseconds to date
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @param options - Timezone conversion options
 * @param options.keepLocalTime - When converting to UTC timezone, whether to keep the local time values. Defaults to false
 * @returns dayjs object representing the date
 *
 * @example
 * ```typescript
 * const timestamp = 1705315800000 // January 15, 2024 10:30:00 UTC in milliseconds
 *
 * fromUnixTimestampMs(timestamp)
 * // Returns: dayjs object for 2024-01-15T10:30:00
 *
 * fromUnixTimestampMs(timestamp, 'UTC')
 * // Returns: dayjs object in UTC timezone (time converted)
 *
 * fromUnixTimestampMs(timestamp, 'UTC', { keepLocalTime: true })
 * // Returns: dayjs object treating the timestamp as local time values in UTC
 *
 * fromUnixTimestampMs(timestamp, 'Asia/Seoul')
 * // Returns: dayjs object in Seoul timezone
 *
 * // Convert from Date.now()
 * fromUnixTimestampMs(Date.now())
 * // Returns: current date as dayjs object
 * ```
 */
export const fromUnixTimestampMs = (
  timestamp: number,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
  options: TimezoneConvertOptions = {},
): dayjs.Dayjs => {
  const dayjsDate = dayjs(timestamp)
  return convertTimezone(dayjsDate, timezone, options)
}

/**
 * Get current Unix timestamp in seconds
 *
 * @param timezone - Timezone for the timestamp. Defaults to 'local'
 * @returns Current Unix timestamp in seconds
 *
 * @example
 * ```typescript
 * getCurrentUnixTimestamp()
 * // Returns: Current timestamp in seconds (e.g., 1705315800)
 *
 * getCurrentUnixTimestamp('UTC')
 * // Returns: Current UTC timestamp in seconds
 *
 * getCurrentUnixTimestamp('Asia/Seoul')
 * // Returns: Current Seoul timestamp in seconds
 *
 * // Equivalent to Math.floor(Date.now() / 1000)
 * getCurrentUnixTimestamp() === Math.floor(Date.now() / 1000) // true
 * ```
 */
export const getCurrentUnixTimestamp = (timezone: TimezoneType = DEFAULT_TIMEZONE): number => {
  return toUnixTimestamp(getCurrentDate(timezone))
}

/**
 * Get current Unix timestamp in milliseconds
 *
 * @param timezone - Timezone for the timestamp. Defaults to 'local'
 * @returns Current Unix timestamp in milliseconds
 *
 * @example
 * ```typescript
 * getCurrentUnixTimestampMs()
 * // Returns: Current timestamp in milliseconds (e.g., 1705315800000)
 *
 * getCurrentUnixTimestampMs('UTC')
 * // Returns: Current UTC timestamp in milliseconds
 *
 * // Equivalent to Date.now()
 * getCurrentUnixTimestampMs() === Date.now() // true
 * ```
 */
export const getCurrentUnixTimestampMs = (timezone: TimezoneType = DEFAULT_TIMEZONE): number => {
  return toUnixTimestampMs(getCurrentDate(timezone))
}

/**
 * Convert timestamp between seconds and milliseconds
 *
 * @param timestamp - Timestamp to convert
 * @param fromUnit - Source unit: 'seconds' or 'milliseconds'
 * @param toUnit - Target unit: 'seconds' or 'milliseconds'
 * @returns Converted timestamp
 *
 * @example
 * ```typescript
 * const secondsTimestamp = 1705315800
 * const millisecondsTimestamp = 1705315800000
 *
 * convertTimestamp(secondsTimestamp, 'seconds', 'milliseconds')
 * // Returns: 1705315800000
 *
 * convertTimestamp(millisecondsTimestamp, 'milliseconds', 'seconds')
 * // Returns: 1705315800
 *
 * // Round trip
 * const original = 1705315800
 * const converted = convertTimestamp(original, 'seconds', 'milliseconds')
 * const back = convertTimestamp(converted, 'milliseconds', 'seconds')
 * // back === original // true
 * ```
 */
export const convertTimestamp = (
  timestamp: number,
  fromUnit: 'seconds' | 'milliseconds',
  toUnit: 'seconds' | 'milliseconds',
): number => {
  if (fromUnit === toUnit) {
    return timestamp
  }

  if (fromUnit === 'seconds' && toUnit === 'milliseconds') {
    return timestamp * MILLISECONDS_PER_SECOND
  }

  if (fromUnit === 'milliseconds' && toUnit === 'seconds') {
    return Math.floor(timestamp / MILLISECONDS_PER_SECOND)
  }

  return timestamp
}

export const convertTimestampToDate = (
  timestamp: number,
  country: string,
  isConvertToTimezone: boolean = false,
): dayjs.Dayjs => {
  let date: dayjs.Dayjs
  const timezone = getTimezoneByCountryCode(country)
  if (timestamp === null || timestamp === 0) {
    date = getCurrentDate(timezone as TimezoneType)
  } else {
    date = fromUnixTimestamp(timestamp, timezone as TimezoneType)
  }

  if (isConvertToTimezone) return convertTimezone(date, timezone as TimezoneType)
  return date
}

/**
 * Get date range for the last N months from current date
 *
 * @param months - Number of months in the range. Defaults to 12
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @returns Object with start and end dayjs objects
 *
 * @example
 * ```typescript
 * const lastYearRange = getLastMonthsRange(12)
 * // Returns: { start: dayjs('2024-08-01'), end: dayjs('2025-07-01') } (12 months total)
 *
 * const last6MonthsRange = getLastMonthsRange(6)
 * // Returns: { start: dayjs('2025-02-01'), end: dayjs('2025-07-01') } (6 months total)
 *
 * const seoulRange = getLastMonthsRange(12, 'Asia/Seoul')
 * // Returns: range in Seoul timezone
 * ```
 */
export const getLastMonthsRange = (
  months: number = DEFAULT_MONTHS_RANGE,
  timezone: TimezoneType = DEFAULT_TIMEZONE,
): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const currentDate = getCurrentDate(timezone)
  const endDate = getStartOf(currentDate, 'month')
  const startDate = subtractTime(endDate, months - 1, 'month')

  return {
    start: startDate,
    end: endDate,
  }
}

/**
 * Create a timezone-aware date conversion function with specific options
 *
 * @param timezone - Target timezone
 * @param options - Default timezone conversion options
 * @returns Function that converts dates to the specified timezone with options
 *
 * @example
 * ```typescript
 * // Create a converter that always keeps local time when converting to UTC
 * const toUTCKeepLocal = createTimezoneConverter('UTC', { keepLocalTime: true })
 *
 * const date = new Date('2024-01-15T14:30:00')
 * const utcDate = toUTCKeepLocal(date)
 * // Returns: dayjs object with 2024-01-15T14:30:00 UTC (same time values, UTC timezone)
 *
 * // Create a standard UTC converter
 * const toUTC = createTimezoneConverter('UTC')
 * const utcConverted = toUTC(date)
 * // Returns: dayjs object with time converted to UTC
 * ```
 */
export const createTimezoneConverter = (
  timezone: TimezoneType,
  defaultOptions: TimezoneConvertOptions = {},
) => {
  return (date: dayjs.Dayjs | Date | string, options: TimezoneConvertOptions = {}): dayjs.Dayjs => {
    const mergedOptions = { ...defaultOptions, ...options }
    return convertTimezone(date, timezone, mergedOptions)
  }
}

// Timezone type constants for easier usage
export const TIMEZONE_TYPE = {
  LOCAL: 'local' as const,
  UTC: 'UTC' as const,
  ASIA_SEOUL: 'Asia/Seoul' as const,
} as const

// Pre-configured timezone converters
export const toUTC = createTimezoneConverter(TIMEZONE_TYPE.UTC)
export const toUTCKeepLocal = createTimezoneConverter(TIMEZONE_TYPE.UTC, { keepLocalTime: true })
export const toSeoul = createTimezoneConverter(TIMEZONE_TYPE.ASIA_SEOUL)
export const toLocal = createTimezoneConverter(TIMEZONE_TYPE.LOCAL)

// Export dayjs instance for direct use if needed
export { dayjs }

// Export default timezone constant
export const DEFAULT_TIMEZONE_CONSTANT = DEFAULT_TIMEZONE

/**
 * Format date to JavaScript Date.toString() format with timezone
 *
 * @param date - The date to format (Date object, dayjs object, or date string)
 * @param timezone - Timezone for the result. Defaults to 'local'
 * @returns Date string in format "Fri Aug 08 2025 00:00:00 GMT+0700 (Indochina Time)"
 *
 * @example
 * ```typescript
 * const date = new Date('2025-08-08T00:00:00')
 * formatDateToString(date)
 * // Output: "Fri Aug 08 2025 00:00:00 GMT+0700 (Indochina Time)"
 * ```
 */
export const formatDateToString = (
  date: dayjs.Dayjs | Date | string,
  timezone: TimezoneType = 'local',
): string => {
  const dayjsDate = convertTimezone(date, timezone)
  return dayjsDate.toDate().toString()
}

/**
 * Format date to JavaScript Date.toLocaleString() format
 *
 * @param date - The date to format (Date object, dayjs object, or date string)
 * @param locale - Locale for formatting. Defaults to 'en-US'
 * @param options - Intl.DateTimeFormatOptions
 * @returns Localized date string
 *
 * @example
 * ```typescript
 * const date = new Date('2025-08-08T00:00:00')
 * formatDateToLocaleString(date)
 * // Output: "8/8/2025, 12:00:00 AM"
 * ```
 */
export const formatDateToLocaleString = (
  date: dayjs.Dayjs | Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dayjsDate = dayjs(date)
  return dayjsDate.toDate().toLocaleString(locale, options)
}

/**
 * Date range preset handlers
 * @returns Date range
 * @example
 * ```typescript
 * const range = dateRangePresetHandlers[DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY]()
 * // Returns: [startOfMonth, endOfDay]
 * ```
 * ```typescript
 * const range = dateRangePresetHandlers[DATE_RANGE_PRESETS.FROM_TODAY_TO_NEXT_6_DAYS]()
 * // Returns: [startOfDay, endOf6DaysLater]
 * ```
 */
export const dateRangePresetHandlers = {
  [DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY]: () => {
    const currentDate = getCurrentDate()
    const startOfMonth = getStartOf(currentDate, 'month').toDate()
    const endOfDay = getEndOf(currentDate, 'day').toDate()
    return [startOfMonth, endOfDay]
  },
  [DATE_RANGE_PRESETS.FROM_TODAY_TO_NEXT_6_DAYS]: () => {
    const currentDate = getCurrentDate()
    const startOfDay = getStartOf(currentDate, 'day').toDate()
    const endOf6DaysLater = getEndOf(addTime(currentDate, DAYS_TO_ADD_FOR_RANGE, 'day'), 'day').toDate()
    return [startOfDay, endOf6DaysLater]
  },
} as const

// Returns true when (toDate - fromDate) in calendar months is >= 1
export const validateExceedOneMonthRange = (
  fromDate: dayjs.Dayjs,
  toDate: dayjs.Dayjs,
): boolean => {
  const diffInMonths = toDate.diff(fromDate, 'month')
  return diffInMonths >= 1
}

// Returns true when toDate is same day or before fromDate (toDate <= fromDate),
export const validateToDateNotBeforeFromDate = (
  fromDate: dayjs.Dayjs,
  toDate: dayjs.Dayjs,
): boolean => {
  const isToDateAfterFromDate = isAfter(toDate, fromDate)
  return !isToDateAfterFromDate
}
