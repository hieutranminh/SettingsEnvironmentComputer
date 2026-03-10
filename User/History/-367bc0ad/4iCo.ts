import { isEmpty } from 'lodash'
import {
  TIMEZONE_CONFIG,
  COUNTRY_CODES,
  SHOP_LOCATIONS,
  DECIMAL_PLACES,
  USER_ROLES,
  BYTES_PER_KB,
  KB_PER_MB,
  MB_PER_GB,
  GB_PER_TB,
  DECIMAL_PRECISION,
  PERCENTAGE_MAX_WITH_DECIMAL,
  PERCENTAGE_MAX_WITHOUT_DECIMAL,
  PHONE_LENGTH_10,
  SEOUL_AREA_CODE_LENGTH,
  SEOUL_AREA_CODE_START,
  REGIONAL_AREA_CODE_LENGTH,
  REGIONAL_PHONE_MIDDLE_END,
  PHONE_LAST_DIGITS_START,
  REGIONAL_PHONE_MIDDLE_START,
  SEOUL_PHONE_MIDDLE_START,
  SEOUL_PHONE_MIDDLE_END,
  PHONE_LENGTH_9,
  PHONE_LENGTH_8,
  LOCAL_PHONE_START,
  LOCAL_PHONE_END,
  SEOUL_PHONE_MIDDLE_START_ALT,
  SEOUL_PHONE_MIDDLE_END_ALT,
  PHONE_LAST_DIGITS_START_ALT,
  LONG_PHONE_LAST_DIGITS_LENGTH,
  LONG_PHONE_MIDDLE_START,
  LONG_PHONE_AREA_CODE_LENGTH,
  PHONE_LENGTH_11,
  VN_PHONE_AREA_CODE_LENGTH,
  VN_PHONE_MIDDLE_START,
  VN_PHONE_MIDDLE_END,
  VN_PHONE_LAST_DIGITS_START,
  MILLISECONDS_PER_SECOND,
  MINUTES_PER_DAY,
  MINUTES_PER_HOUR,
  TEN_MINUTES,
  TIME_PART_PAD_LENGTH,
  LOGIN_ERROR_CODES,
  ZERO_THRESHOLD,
} from '@/constants'
import type { TimezoneType } from '@/utils/dateUtils'
import { t } from '@/plugins/i18n'
import type { IApiResponse } from '@/types/ApiResponse'

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
    // Use explicit IANA timezone for VN to avoid ambiguity in downstream conversions
    return 'Asia/Ho_Chi_Minh'
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
interface IFormatAmountOptions {
  currency?: boolean
  locale?: string
  decimalCount?: number
  showZeroValues?: boolean
}

const DEFAULT_OPTIONS: Required<IFormatAmountOptions> = {
  currency: false,
  locale: 'ko-KR',
  decimalCount: 0,
  showZeroValues: false,
}

export const formatAmount = (value: number, options: IFormatAmountOptions = {}): string => {
  const { currency, locale, decimalCount, showZeroValues } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  // Handle near-zero values: if absolute value is very small, treat as 0
  const normalizedValue = Math.abs(value) < ZERO_THRESHOLD ? 0 : value

  if (
    (normalizedValue === 0 && !showZeroValues) ||
    normalizedValue === undefined ||
    normalizedValue === null
  )
    return ''

  const formatOptions: Intl.NumberFormatOptions = {}

  if (typeof decimalCount === 'number') {
    formatOptions.minimumFractionDigits = decimalCount
    formatOptions.maximumFractionDigits = decimalCount
  }

  if (currency) {
    formatOptions.style = 'currency'
    formatOptions.currency = locale === 'ko-KR' ? 'KRW' : 'USD'
  }

  const formatValue = new Intl.NumberFormat(locale, formatOptions).format(normalizedValue)
  return formatValue === PERCENTAGE_MAX_WITH_DECIMAL ? PERCENTAGE_MAX_WITHOUT_DECIMAL : formatValue
}

export const formatPercentage = (
  value: number,
  options: { decimalCount?: number; showZeroValues?: boolean; hiddenZero?: boolean } = {},
): string => {
  if (options.hiddenZero && value === 0) return ''
  const { decimalCount, showZeroValues } = options

  return `${formatAmount(value, { decimalCount: decimalCount ?? DECIMAL_PLACES, showZeroValues })}%`
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

export function formatEstimateTime(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes)) return '-'
  if (totalMinutes === 0) return `00 ${t('common.mins')}`

  const minutes = Math.max(0, Math.round(totalMinutes)) // đảm bảo số nguyên, không âm
  const hours = Math.floor(minutes / MINUTES_PER_HOUR)
  const mins = minutes % MINUTES_PER_HOUR

  const hStr =
    hours > 0 ? `${hours} ${hours === 1 ? t('common.est-hour') : t('common.est-hours')}` : ''
  let mStr = ''
  if (mins > 0) {
    if (mins < TEN_MINUTES) {
      mStr = `0${mins} ${mins === 1 ? t('common.min') : t('common.mins')}`
    } else {
      mStr = `${mins} ${mins === 1 ? t('common.min') : t('common.mins')}`
    }
  }

  if (hours > 0 && mins === 0) return hStr // 60 -> "1 hour"
  if (hours === 0 && mins > 0) return mStr // 45 -> "45 mins"
  return `${hStr} ${mStr}`.trim() // 90 -> "1 hour 30 mins", 61 -> "1 hour 1 min"
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
export const formatMobileAndPhoneNumber = (number: string | null, country = 'KR'): string => {
  if (!number || isEmpty(number)) {
    return number ?? ''
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

export const formatAsTextExcel = (value: string): string => {
  if (!value) return ''
  return `'${value}`
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

export const parseError = (
  error: unknown,
  fallback: string = 'An unknown error occurred',
): string => (error instanceof Error ? error.message : fallback)

export const parseYupError = (error: unknown): unknown => {
  return error && typeof error === 'object' && 'inner' in error
}

// const fileUploaded = await compressFileAsync(uploadedFile, IMAGE_COMPRESS_CONFIG.MAX_IMAGE_COMPRESS_FILE_SIZE)
// Helpers for file compression

// ex: 840 => 14:00
export function convertMinutesToHours(minutes: number): string {
  let tmpHour = ''
  if (minutes >= MINUTES_PER_DAY) {
    //1440 ~ 24:00
    tmpHour += '+1D '
    minutes -= MINUTES_PER_DAY
  }

  // Optional: security input
  if (!Number.isFinite(minutes)) throw new Error('minutes must be a finite number')

  const hourNum = Math.floor(minutes / MINUTES_PER_HOUR) //60 ~ 1 minute
  const minuteNum = Math.floor(minutes - hourNum * MINUTES_PER_HOUR)

  const hh = String(hourNum).padStart(TIME_PART_PAD_LENGTH, '0')
  const mm = String(minuteNum).padStart(TIME_PART_PAD_LENGTH, '0')

  return (tmpHour += `${hh}:${mm}`)
}

export const convertAnErrorMessagesToString = (errorMessage: unknown): string => {
  if (Array.isArray(errorMessage)) {
    return errorMessage.map((e) => e.errorMessage).join('\n')
  }
  return String(errorMessage)
}

export const convertAnErrorMessagesToArray = (errorMessage: unknown): string[] => {
  if (Array.isArray(errorMessage)) {
    return errorMessage.map((e) => e.errorMessage)
  }
  return [String(errorMessage)]
}

export const replaceAll = (str: string, search_str: string, replace_str: string): string => {
  return str.split(search_str).join(replace_str)
}

export const showUserRoles = (userRole: string): string => {
  if (userRole == USER_ROLES.ADMIN_MASTER || userRole == USER_ROLES.ADMIN_STAFF)
    return t('user-roles.admin-master')
  if (userRole == USER_ROLES.MASTER) return t('user-roles.master')
  if (userRole == USER_ROLES.ADMIN_STAFF) return t('user-roles.staff')
  if (userRole == USER_ROLES.MASTER) return t('user-roles.manager')
  return ''
}

export const handleKeyDownInput = (e: KeyboardEvent): void => {
  const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (/^\d$/.test(e.key) || allowed.includes(e.key)) return
  e.preventDefault()
}

export const preventEvent = (event: ClipboardEvent): void => {
  event.preventDefault()
}

/**
 * Extract error messages from API response errorMessages array
 * @param errorMessages - Array of error objects from API response
 * @returns Array of error message strings
 */
export const extractErrorMessages = (
  errorMessages: Array<{ errorMessage: string }> | undefined,
): string[] => {
  if (!errorMessages || !Array.isArray(errorMessages)) {
    return []
  }

  return errorMessages.map((error) => error.errorMessage).filter(Boolean)
}

const getErrorMessage = (
  errorMessage: string,
  repleaseTag: string[],
  apiError: IApiResponse<unknown>,
): string => {
  let message = t(errorMessage)
  for (const index in repleaseTag) {
    const replaceTag = repleaseTag[index]
    const replaceTagValue = ''
    const errorValues = apiError.errorMessages[0].errorValues
    for (const idx in errorValues) {
      const errorValue = errorValues[idx]
      const breakValueIndex = errorValue.indexOf(':')
      const keyTxt = errorValue.substring(0, breakValueIndex)
      const COLON_AND_SPACE = 2
      const contentTxt = errorValue.substring(breakValueIndex + COLON_AND_SPACE)

      const isLoginFailCount = replaceTag === '#login' && keyTxt === 'loginFailCount'
      const failCount = Number(contentTxt) || 0
      const extraMsg =
        isLoginFailCount && failCount > 0
          ? `<p/><br>${t('logins.if-10times-fail')}(${failCount}/10)`
          : ''
      message += extraMsg
      message = message.replace(replaceTag, replaceTagValue)
    }
  }
  return message
}

export const validateErrorMessages = (error: IApiResponse<unknown>): string => {
  let message = error.errorMessages[0].errorMessage
  let replaceTags: string[] = []

  // LOGIN
  if (
    error.errorMessages[0].errorCode == LOGIN_ERROR_CODES.UA14C ||
    error.errorMessages[0].errorCode === LOGIN_ERROR_CODES.UA01R
  ) {
    replaceTags = ['#login']
    message = getErrorMessage('logins.id-or-password-incorrect', replaceTags, error)
  }

  if (error.errorMessages[0].errorCode == LOGIN_ERROR_CODES.IDT09A) {
    replaceTags = []
    message = getErrorMessage('logins.expired-shop', replaceTags, error)
  }

  return `${message}`
}

export const isExternalLink = (link: string): boolean => {
  return /^https?:\/\//.test(link)
}

export const getAdminsImageURL = (path: string, name: string): string => {
  return `${import.meta.env.VITE_AZURE_STORAGE_ADMINS_URL}${path}/${name}`
}

export const checkExactKeyExistsInArray = (key: string, array: string[]): boolean => {
  return array.includes(key)
}

export const checkValidMobilePhoneKR = (mobile: string): boolean => {
  if (/^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/.test(mobile) == false) return false
  else return true
}

export const getBoardImageUrl = (imagePath: string, imageName: string): string => {
  return `${import.meta.env.VITE_AZURE_STORAGE_BOARD_URL}${imagePath}/${imageName}`
}

/**
 * Navigate to login page based on country code
 * Supports both external URLs (http/https) and internal routes
 * @param countryCode - Country code (e.g., 'KR', 'VN')
 * @returns true if navigation was attempted, false if no login URL configured
 */
export const gotoLoginPageWhenPossible = (countryCode: string): boolean => {
  const currentMode = import.meta.env.MODE
  const isDev = import.meta.env.DEV
  const isProd = import.meta.env.PROD

  const getEnvLoginURL = (countryCode: string): string | undefined => {
    if (countryCode === COUNTRY_CODES.KR) return import.meta.env.VITE_LOGIN_URL_KR
    return import.meta.env.VITE_LOGIN_URL_DEFAULT
  }

  const loginPage = getEnvLoginURL(countryCode)

  // Log environment info for debugging
  console.group('🔧 Environment Info - gotoLoginPageWhenPossible')
  console.log('Mode:', currentMode)
  console.log('Is Development:', isDev)
  console.log('Is Production:', isProd)
  console.log('Country Code:', countryCode)
  console.log('Login URL (KR):', import.meta.env.VITE_LOGIN_URL_KR)
  console.log('Login URL (Default):', import.meta.env.VITE_LOGIN_URL_DEFAULT)
  console.log('Selected Login URL:', loginPage)
  console.groupEnd()

  if (!loginPage) {
    return false
  }

  if (loginPage.startsWith('http')) {
    // External URL - use window.location.replace for full page reload
    window.location.replace(loginPage)
    return true
  }

  // Internal route - use window.location for navigation
  // This avoids circular dependency issues with router import
  window.location.href = loginPage
  return true
}
