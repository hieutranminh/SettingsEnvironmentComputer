// Core dependencies
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { uniq, pullAt } from 'lodash'

// Constants and types
import {
  TIME_CONSTANTS,
  DATE_FORMATS,
  TIMEZONE_CONSTANTS,
  DATE_UNITS,
  ERROR_MESSAGES,
  type DateUnit,
} from '@/constants'
import { t } from '@/plugins/i18n'

// Initialize dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// ====================
// TYPES AND INTERFACES
// ====================
export interface TimeComponents {
  hours: number
  minutes: number
  seconds: number
}

export interface DateRange {
  start: Date
  end: Date
}

export type PeriodUnit = 'day' | 'month' | 'year'
export type TimeUnit = 'hour' | 'minute' | 'second'

// ====================
// VALIDATION HELPERS
// ====================
const isValidTimestamp = (timestamp: number): boolean => {
  return !isNaN(timestamp) && timestamp > 0 && timestamp < 2147483647
}

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime())
}

const isValidTimezone = (timezone: string): boolean => {
  return /^[+-]\d{2}:\d{2}$/.test(timezone)
}

const validateAndGetDate = (date?: Date | string | number): Date => {
  if (date === undefined || date === null) {
    return new Date()
  }

  const resultDate = new Date(date)
  if (!isValidDate(resultDate)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE)
  }

  return resultDate
}

const validateAndGetTimestamp = (timestamp: number): number => {
  if (!isValidTimestamp(timestamp)) {
    throw new Error(ERROR_MESSAGES.INVALID_TIMESTAMP)
  }
  return timestamp
}

// ====================
// CONFIGURATION HELPERS
// ====================
const getTimezoneConfig = (): string => {
  return TIMEZONE_CONSTANTS.DEFAULT_TIMEZONE
}

const getDateFormatConfig = (): string => {
  return DATE_FORMATS.YMD
}

// ====================
// CORE CONVERSION UTILITIES
// ====================
export const timestampToUtcDate = (timestamp: number = 0): Date => {
  try {
    const validTimestamp = validateAndGetTimestamp(timestamp)
    return dayjs.unix(validTimestamp).utc().toDate()
  } catch {
    return new Date()
  }
}

export const dateToTimestamp = (date: Date = new Date()): number => {
  try {
    const validDate = validateAndGetDate(date)
    return dayjs(validDate).unix()
  } catch {
    return dayjs().unix()
  }
}

export const dateToUtcDayjs = (date: Date = new Date()): Dayjs => {
  try {
    const validDate = validateAndGetDate(date)
    return dayjs(validDate).utc()
  } catch {
    return dayjs().utc()
  }
}

// ====================
// TIMEZONE CONVERSION UTILITIES
// ====================
export const utcToTimezone = (timestamp: number, timezone: string = getTimezoneConfig()): number => {
  try {
    const validTimestamp = validateAndGetTimestamp(timestamp)

    if (!isValidTimezone(timezone)) {
      timezone = TIMEZONE_CONSTANTS.DEFAULT_TIMEZONE
    }

    const offsetHours = parseInt(timezone.substring(0, 3))
    return validTimestamp + offsetHours * TIME_CONSTANTS.SECONDS_PER_HOUR
  } catch {
    return timestamp
  }
}

export const utcToLocal = (timestamp: number): number => {
  try {
    const validTimestamp = validateAndGetTimestamp(timestamp)
    const localOffsetMinutes = new Date().getTimezoneOffset() * -1
    return validTimestamp + localOffsetMinutes * TIME_CONSTANTS.SECONDS_PER_MINUTE
  } catch {
    return timestamp
  }
}

// ====================
// DATE ARITHMETIC UTILITIES
// ====================
export const addTime = (date: Date, amount: number, unit: DateUnit): Date => {
  try {
    const validDate = validateAndGetDate(date)
    return dayjs(validDate).add(amount, unit).toDate()
  } catch {
    return date
  }
}

export const subtractTime = (date: Date, amount: number, unit: DateUnit): Date => {
  try {
    const validDate = validateAndGetDate(date)
    return dayjs(validDate).subtract(amount, unit).toDate()
  } catch {
    return date
  }
}

export const addDays = (date: Date = new Date(), days: number = 0): Date => {
  return addTime(date, days, DATE_UNITS.DAY)
}

export const subtractDays = (date: Date = new Date(), days: number = 0): Date => {
  return subtractTime(date, days, DATE_UNITS.DAY)
}

export const addMonths = (date: Date = new Date(), months: number = 0): Date => {
  return addTime(date, months, DATE_UNITS.MONTH)
}

export const subtractMonths = (date: Date = new Date(), months: number = 0): Date => {
  return subtractTime(date, months, DATE_UNITS.MONTH)
}

// ====================
// DATE BOUNDARY UTILITIES
// ====================
export const getStartOfPeriod = (date: Date = new Date(), unit: PeriodUnit = 'day'): Date => {
  try {
    const validDate = validateAndGetDate(date)
    return dayjs(validDate).startOf(unit).toDate()
  } catch {
    return new Date()
  }
}

export const getEndOfPeriod = (date: Date = new Date(), unit: PeriodUnit = 'day'): Date => {
  try {
    const validDate = validateAndGetDate(date)
    return dayjs(validDate).endOf(unit).toDate()
  } catch {
    return new Date()
  }
}

export const getStartOfPeriodTimestamp = (date: Date = new Date(), unit: PeriodUnit = 'day'): number => {
  const startDate = getStartOfPeriod(date, unit)
  return dateToUtcDayjs(startDate).unix()
}

export const getEndOfPeriodTimestamp = (date: Date = new Date(), unit: PeriodUnit = 'day'): number => {
  const endDate = getEndOfPeriod(date, unit)
  return dateToUtcDayjs(endDate).unix()
}

// ====================
// CURRENT TIME UTILITIES
// ====================
export const getCurrentUtcTimestamp = (): number => {
  return dayjs().unix()
}

export const getCurrentTimezoneTimestamp = (): number => {
  return dateToUtcDayjs(new Date()).unix()
}

export const getStartOfTodayTimestamp = (): number => {
  return getStartOfPeriodTimestamp(new Date(), 'day')
}

export const getEndOfTodayTimestamp = (): number => {
  return getEndOfPeriodTimestamp(new Date(), 'day')
}

// ====================
// FORMATTING UTILITIES
// ====================
export const formatTimestampToUtc = (timestamp: number = 0, format: string = DATE_FORMATS.YMD): string => {
  try {
    if (timestamp === 0) return ''

    const validTimestamp = validateAndGetTimestamp(timestamp)
    return dayjs.unix(validTimestamp).utc().format(format)
  } catch {
    return ''
  }
}

export const formatTimestampToTimezone = (
  timestamp: number = 0,
  format: string = DATE_FORMATS.YMD,
  timezone: string = getTimezoneConfig(),
): string => {
  try {
    if (timestamp === 0) return ''

    const validTimestamp = validateAndGetTimestamp(timestamp)

    if (!isValidTimezone(timezone)) {
      timezone = TIMEZONE_CONSTANTS.DEFAULT_TIMEZONE
    }

    return dayjs.unix(validTimestamp).utcOffset(timezone).format(format)
  } catch {
    return ''
  }
}

export const formatToTimezone = (
  dateInput: string | Date = '',
  format: string = DATE_FORMATS.YMD,
  timezone: string = getTimezoneConfig(),
): string => {
  try {
    if (!dateInput) return ''

    const validDate = validateAndGetDate(dateInput)

    if (!isValidTimezone(timezone)) {
      timezone = TIMEZONE_CONSTANTS.DEFAULT_TIMEZONE
    }

    return dateToUtcDayjs(validDate).utcOffset(timezone).format(format)
  } catch {
    return ''
  }
}

export const formatToDate = (dateInput: string | Date = '', format: string = DATE_FORMATS.YMD): string => {
  try {
    if (!dateInput) return ''

    const validDate = validateAndGetDate(dateInput)
    return dateToUtcDayjs(validDate).format(format)
  } catch {
    return ''
  }
}

export const formatDateWithSettings = (date: Date = new Date(), includeTime: boolean = false): string => {
  try {
    const validDate = validateAndGetDate(date)
    const dateFormat = getDateFormatConfig()
    const format = includeTime ? `${dateFormat} HH:mm` : dateFormat

    return dayjs(validDate).format(format)
  } catch {
    return ''
  }
}

export const timestampToTimeString = (timestamp: number): string => {
  try {
    const validTimestamp = validateAndGetTimestamp(timestamp)
    const hours = Math.floor(validTimestamp / TIME_CONSTANTS.SECONDS_PER_HOUR)
    const minutes = Math.floor((validTimestamp % TIME_CONSTANTS.SECONDS_PER_HOUR) / TIME_CONSTANTS.SECONDS_PER_MINUTE)

    return `${hours} ${t('general.hour')} ${minutes} ${t('general.minutes')}`
  } catch {
    return `0 ${t('general.hour')} 0 ${t('general.minutes')}`
  }
}

// ====================
// COMPARISON UTILITIES
// ====================
export const getDateDifference = (
  fromTimestamp: number = 0,
  toTimestamp: number = 0,
  unit: PeriodUnit = 'day',
): number => {
  try {
    const validFromTs = validateAndGetTimestamp(fromTimestamp)
    const validToTs = validateAndGetTimestamp(toTimestamp)

    return dayjs.unix(validToTs).diff(dayjs.unix(validFromTs), unit, true)
  } catch {
    return 0
  }
}

export const isDateRangeDifferent = (
  fromTimestamp: number = 0,
  toTimestamp: number = 0,
  unit: PeriodUnit = 'month',
): boolean => {
  try {
    const validFromTs = validateAndGetTimestamp(fromTimestamp)
    const validToTs = validateAndGetTimestamp(toTimestamp)

    const fromDate = dayjs.unix(validFromTs).utc()
    const toDate = dayjs.unix(validToTs).utc()

    return !fromDate.isSame(toDate, unit)
  } catch {
    return false
  }
}

// ====================
// SPECIALIZED UTILITIES
// ====================
export const formatDayNames = (days: number[], useShortNames: boolean = false): string => {
  try {
    if (!Array.isArray(days) || days.length === 0) {
      return ''
    }

    const uniqueDays = uniq(days.filter((day) => day >= 0 && day <= 6))

    const dayNames = useShortNames
      ? [
          t('general.sun'),
          t('general.mon'),
          t('general.tue'),
          t('general.wed'),
          t('general.thur'),
          t('general.fri'),
          t('general.sat'),
        ]
      : [
          t('general.sunday'),
          t('general.monday'),
          t('general.tuesday'),
          t('general.wednesday'),
          t('general.thursday'),
          t('general.friday'),
          t('general.saturday'),
        ]

    return pullAt(dayNames, uniqueDays).join(', ')
  } catch {
    return ''
  }
}
