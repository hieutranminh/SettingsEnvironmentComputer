import { isEmpty } from 'lodash'

import { TIMEZONE_CONFIG, COUNTRY_CODES, SHOP_LOCATIONS, DECIMAL_PLACES } from '@/constants'
import type { TimezoneType } from '@/utils/dateUtils'

// ===============================
// CONSTANTS
// ===============================

// File size conversion constants
const BYTES_PER_KB = 1024
const KB_PER_MB = 1024
const MB_PER_GB = 1024
const GB_PER_TB = 1024
const DECIMAL_PRECISION = 2

// Phone number formatting constants
const PHONE_LENGTH_8 = 8
const PHONE_LENGTH_9 = 9
const PHONE_LENGTH_10 = 10
const PHONE_LENGTH_11 = 11
const SEOUL_AREA_CODE_LENGTH = 2
const SEOUL_AREA_CODE_START = '02'
const REGIONAL_AREA_CODE_LENGTH = 3
const SEOUL_PHONE_MIDDLE_START = 2
const SEOUL_PHONE_MIDDLE_END = 6
const REGIONAL_PHONE_MIDDLE_START = 3
const REGIONAL_PHONE_MIDDLE_END = 6
const PHONE_LAST_DIGITS_START = 6
const SEOUL_PHONE_MIDDLE_START_ALT = 2
const SEOUL_PHONE_MIDDLE_END_ALT = 5
const PHONE_LAST_DIGITS_START_ALT = 5
const LOCAL_PHONE_START = 4
const LOCAL_PHONE_END = 8
const LONG_PHONE_AREA_CODE_LENGTH = 3
const LONG_PHONE_MIDDLE_START = 3
const LONG_PHONE_LAST_DIGITS_LENGTH = 4

// Vietnamese phone formatting constants
const VN_PHONE_AREA_CODE_LENGTH = 4
const VN_PHONE_MIDDLE_START = 4
const VN_PHONE_MIDDLE_END = 7
const VN_PHONE_LAST_DIGITS_START = 7

// Time conversion constants
const MILLISECONDS_PER_SECOND = 1000
const PERCENTAGE_MAX = 100

// ===============================
// TIMEZONE & LOCALE HELPER FUNCTIONS
// ===============================

/**
 * Get timezone by country code
 */

export const getTimezoneByCountryCode = (countryCode: string): TimezoneType => {
  if (countryCode === COUNTRY_CODES.KR) {
    return 'Asia/Seoul'
  }
  if (countryCode === COUNTRY_CODES.VN) {
    return 'local'
  }
  return 'UTC'
}
/**
 * Get timezone configuration by country code
 */
export const getTimezoneByCountry = (
  countryCode: string,
):
  | {
      country_code: (typeof COUNTRY_CODES)[keyof typeof COUNTRY_CODES]
      timezone: string
      date_format: string
      culture: string
      offset_minutes: number
    }
  | undefined => {
  return TIMEZONE_CONFIG.find((config) => config.country_code === countryCode)
}

/**
 * Get timezone offset in minutes by country code
 */
export const getTimezoneOffset = (countryCode: string): number => {
  const config = getTimezoneByCountry(countryCode)
  return config?.offset_minutes ?? 0
}

/**
 * Get timezone string by country code (e.g., "+09:00")
 */
export const getTimezoneString = (countryCode: string): string => {
  const config = getTimezoneByCountry(countryCode)
  return config?.timezone ?? '+00:00'
}

/**
 * Get date format by country code
 */
export const getDateFormat = (countryCode: string): string => {
  const config = getTimezoneByCountry(countryCode)
  return config?.date_format ?? 'YYYY-MM-DD'
}

/**
 * Get culture by country code
 */
export const getCulture = (countryCode: string): string => {
  const config = getTimezoneByCountry(countryCode)
  return config?.culture ?? ''
}

/**
 * Check if country requires Korean locale
 */
export const isKoreanLocale = (countryCode: string): boolean => {
  return countryCode === COUNTRY_CODES.KR
}

/**
 * Get locale string based on country
 */
export const getLocaleByCountry = (countryCode: string): 'en' | 'ko' => {
  return isKoreanLocale(countryCode) ? 'ko' : 'en'
}

export const getShopLocation = (country: string): string => {
  const shopLocations = [
    { country_code: '', shop_location: '' },
    { country_code: 'KR', shop_location: SHOP_LOCATIONS.KR },
    { country_code: 'VN', shop_location: SHOP_LOCATIONS.VN },
  ]

  const location = shopLocations.find((locationConfig) => locationConfig.country_code === country)
  return location ? location.shop_location : ''
}

export const formatSize = (size: number): string => {
  const bytesPerTB = BYTES_PER_KB * KB_PER_MB * MB_PER_GB * GB_PER_TB
  const bytesPerGB = BYTES_PER_KB * KB_PER_MB * MB_PER_GB
  const bytesPerMB = BYTES_PER_KB * KB_PER_MB

  if (size > bytesPerTB) {
    return `${(size / bytesPerTB).toFixed(DECIMAL_PRECISION)} TB`
  } else if (size > bytesPerGB) {
    return `${(size / bytesPerGB).toFixed(DECIMAL_PRECISION)} GB`
  } else if (size > bytesPerMB) {
    return `${(size / bytesPerMB).toFixed(DECIMAL_PRECISION)} MB`
  } else if (size > BYTES_PER_KB) {
    return `${(size / BYTES_PER_KB).toFixed(DECIMAL_PRECISION)} KB`
  }
  return `${size.toString()} B`
}
// ===============================
// NUMBER FORMATTING HELPER FUNCTIONS
// ===============================

/**
 * Format amount with Korean locale and currency
 * @param value - The number to format
 * @param options - Formatting options
 * @param options.currency - Whether to include currency symbol. Defaults to false
 * @param options.locale - Locale to use. Defaults to 'ko-KR'
 * @param options.decimalCount - Number of decimal places to show. Defaults to 0
 * @returns Formatted amount string
 *
 * @example
 * formatAmount(120000) // "120,000"
 * formatAmount(120000, { currency: true }) // "₩120,000"
 * formatAmount(120000, { currency: false }) // "120,000"
 * formatAmount(120000, { locale: 'en-US' }) // "120,000"
 * formatAmount(120000, { currency: true, locale: 'en-US' }) // "$120,000.00"
 * formatAmount(120000.5, { decimalCount: 2 }) // "120,000.50"
 * formatAmount(120000.5, { currency: true, decimalCount: 2 }) // "₩120,000.50"
 */
export const formatAmount = (
  value: number,
  options: {
    currency?: boolean
    locale?: string
    decimalCount?: number
    showZeroValues?: boolean
  } = {},
): string => {
  const { currency = false, locale = 'ko-KR', decimalCount } = options

  if (value === 0 || value === undefined || value === null) return ''

  const formatOptions: Intl.NumberFormatOptions = {}
  if (typeof decimalCount === 'number') {
    formatOptions.minimumFractionDigits = decimalCount
    formatOptions.maximumFractionDigits = decimalCount
  }

  if (currency) {
    formatOptions.style = 'currency'
    formatOptions.currency = locale === 'ko-KR' ? 'KRW' : 'USD'
  }

  return new Intl.NumberFormat(locale, formatOptions).format(value)
}

export const formatPercentage = (
  value: number,
  options: { decimalCount?: number } = {},
): string => {
  const { decimalCount } = options

  if (value === PERCENTAGE_MAX) return '100%'

  return `${formatAmount(value, { decimalCount: decimalCount ?? DECIMAL_PLACES })}%`
}

/**
 * Format number with comma separators only (no currency symbol)
 * @param value - The number to format
 * @returns Formatted number string
 *
 * @example
 * formatNumber(120000) // "120,000"
 * formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// ===============================
// PHONE NUMBER FORMATTING
// ===============================

/**
 * Format mobile and phone numbers for Korean country
 * @param number - The phone number to format
 * @param country - The country code to determine formatting rules (defaults to 'KR')
 * @returns Formatted phone number string
 *
 * @example
 * formatMobileAndPhoneNumber('01012345678') // "010-1234-5678"
 * formatMobileAndPhoneNumber('0212345678') // "02-1234-5678"
 * formatMobileAndPhoneNumber('12345678') // "1234-5678"
 */
export const formatMobileAndPhoneNumber = (number: string, country = 'KR'): string => {
  if (!number || isEmpty(number)) {
    return number
  }

  const formatKR = (num: string): string => {
    if (num.length === PHONE_LENGTH_10) {
      if (num.substring(0, SEOUL_AREA_CODE_LENGTH) !== SEOUL_AREA_CODE_START)
        return `${num.substring(0, REGIONAL_AREA_CODE_LENGTH)}-${num.substring(REGIONAL_PHONE_MIDDLE_START, REGIONAL_PHONE_MIDDLE_END)}-${num.substring(PHONE_LAST_DIGITS_START, PHONE_LENGTH_10)}`
      return `${num.substring(0, SEOUL_AREA_CODE_LENGTH)}-${num.substring(SEOUL_PHONE_MIDDLE_START, SEOUL_PHONE_MIDDLE_END)}-${num.substring(PHONE_LAST_DIGITS_START, PHONE_LENGTH_10)}`
    }
    if (num.length === PHONE_LENGTH_9)
      return `${num.substring(0, SEOUL_AREA_CODE_LENGTH)}-${num.substring(SEOUL_PHONE_MIDDLE_START_ALT, SEOUL_PHONE_MIDDLE_END_ALT)}-${num.substring(PHONE_LAST_DIGITS_START_ALT, PHONE_LENGTH_9)}`
    if (num.length === PHONE_LENGTH_8)
      return `${num.substring(0, LOCAL_PHONE_START)}-${num.substring(LOCAL_PHONE_START, LOCAL_PHONE_END)}`
    if (num.length >= PHONE_LENGTH_11)
      return `${num.substring(0, LONG_PHONE_AREA_CODE_LENGTH)}-${num.substring(LONG_PHONE_MIDDLE_START, num.length - LONG_PHONE_LAST_DIGITS_LENGTH)}-${num.substring(num.length - LONG_PHONE_LAST_DIGITS_LENGTH, num.length)}`
    return num
  }

  const formatVN = (num: string): string => {
    if (num.length === PHONE_LENGTH_10)
      return `${num.substring(0, VN_PHONE_AREA_CODE_LENGTH)}-${num.substring(VN_PHONE_MIDDLE_START, VN_PHONE_MIDDLE_END)}-${num.substring(VN_PHONE_LAST_DIGITS_START, PHONE_LENGTH_10)}`
    if (num.length === PHONE_LENGTH_11)
      return `${num.substring(0, VN_PHONE_AREA_CODE_LENGTH)}-${num.substring(VN_PHONE_MIDDLE_START, VN_PHONE_MIDDLE_END)}-${num.substring(VN_PHONE_LAST_DIGITS_START, PHONE_LENGTH_11)}`
    return num
  }

  if (country === COUNTRY_CODES.KR) return formatKR(number)
  if (country === COUNTRY_CODES.VN) return formatVN(number)
  return number
}

export const extraErrorMessages = (error: unknown): string | string[] => {
  if (Array.isArray(error)) {
    return error
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export const formatMoney = (amount: number | string): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '0'
  return new Intl.NumberFormat().format(Number(amount))
}

export const showRemoteSupport = (): void => {
  const popupWindow = window.open('https://988.co.kr', 'popup', 'width=1000,height=800')
  if (popupWindow) popupWindow.opener = null
}

export const showContactChat = (): void => {
  const popupWindow = window.open('https://talk.naver.com/WSYF626', 'popup', 'width=400,height=600')
  if (popupWindow) popupWindow.opener = null
}

export const subtractMonths = (ts: number, months: number): number => {
  const dateFormat = new Date(ts * MILLISECONDS_PER_SECOND) // timestamp -> Date
  dateFormat.setMonth(dateFormat.getMonth() - months) // lùi n tháng
  return Math.floor(dateFormat.getTime() / MILLISECONDS_PER_SECOND) // -> timestamp giây
}

// const fileUploaded = await compressFileAsync(uploadedFile, IMAGE_COMPRESS_CONFIG.MAX_IMAGE_COMPRESS_FILE_SIZE)
// Helpers for file compression
