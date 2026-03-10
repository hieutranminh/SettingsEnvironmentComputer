import {
  formatDate,
  formatRelativeTime,
  formatDateSmart,
  convertTimezone,
  getStartOf,
  getEndOf,
  isToday,
  isSameDay,
  isBefore,
  isAfter,
  isBetween,
  addTime,
  subtractTime,
  getDifference,
  parseDate,
  isValidDate,
  getCurrentDate,
  getDateRange,
  getWeekNumber,
  getMonthName,
  getDayName,
  convertBetweenTimezones,
  getTimezoneOffset,
  isPast,
  isFuture,
  getAge,
  dayjs,
  DEFAULT_TIMEZONE_CONSTANT,
  type LocaleType,
} from './dateUtils'

// Example usage of dateUtils functions

// 1. Basic date formatting
const now = new Date()
const ENGLISH_LOCALE: LocaleType = 'en'
const KOREAN_LOCALE: LocaleType = 'ko'

console.log('Current date (English):', formatDate(now, { locale: ENGLISH_LOCALE }))
console.log('Current date (Korean):', formatDate(now, { locale: KOREAN_LOCALE }))
console.log('Current datetime (English):', formatDate(now, { format: 'datetime', locale: ENGLISH_LOCALE }))
console.log('Current datetime (Korean):', formatDate(now, { format: 'datetime', locale: KOREAN_LOCALE }))

// 2. Relative time formatting
const yesterday = subtractTime(now, 1, 'day')
console.log('Yesterday (English):', formatRelativeTime(yesterday, { locale: ENGLISH_LOCALE }))
console.log('Yesterday (Korean):', formatRelativeTime(yesterday, { locale: KOREAN_LOCALE }))

// 3. Timezone conversion
const seoulTime = convertTimezone(now, 'Asia/Seoul')
console.log('Current time in Seoul:', formatDate(seoulTime, { format: 'datetime', timezone: 'Asia/Seoul' }))

// 4. Start/End of periods
const startOfWeek = getStartOf(now, 'week')
const endOfMonth = getEndOf(now, 'month')
console.log('Start of week:', formatDate(startOfWeek))
console.log('End of month:', formatDate(endOfMonth))

// 5. Date comparisons
console.log('Is today?', isToday(now))
console.log('Is yesterday before today?', isBefore(yesterday, now))
console.log('Is tomorrow after today?', isAfter(addTime(now, 1, 'day'), now))

// 6. Date manipulation
const nextWeek = addTime(now, 1, 'week')
const lastMonth = subtractTime(now, 1, 'month')
console.log('Next week:', formatDate(nextWeek))
console.log('Last month:', formatDate(lastMonth))

// 7. Date difference
const daysDiff = getDifference(nextWeek, yesterday, 'day')
console.log('Days between next week and yesterday:', daysDiff)

// 8. Date parsing and validation
const dateString = '2024-01-15'
const parsedDate = parseDate(dateString)
console.log('Parsed date:', parsedDate ? formatDate(parsedDate) : 'Invalid date')
console.log('Is valid date?', isValidDate(dateString))

// 9. Smart formatting
console.log('Smart format (today):', formatDateSmart(now))
console.log('Smart format (yesterday):', formatDateSmart(yesterday))
console.log('Smart format (next week):', formatDateSmart(nextWeek))

// 10. Locale-specific information
console.log('Month name (English):', getMonthName(now, ENGLISH_LOCALE))
console.log('Month name (Korean):', getMonthName(now, KOREAN_LOCALE))
console.log('Day name (English):', getDayName(now, ENGLISH_LOCALE))
console.log('Day name (Korean):', getDayName(now, KOREAN_LOCALE))

// 11. Timezone utilities
console.log('Current timezone offset:', getTimezoneOffset())
console.log('Seoul timezone offset:', getTimezoneOffset('Asia/Seoul'))

// 12. Date range
const dateRange = getDateRange(yesterday, nextWeek)
console.log('Date range:', {
  start: formatDate(dateRange.start),
  end: formatDate(dateRange.end),
})

// 13. Week number
console.log('Current week number:', getWeekNumber(now))

// 14. Age calculation
const birthDate = '1990-05-15'
const age = getAge(birthDate)
console.log('Age from birth date:', age)

// 15. Past/Future checks
console.log('Is yesterday in the past?', isPast(yesterday))
console.log('Is next week in the future?', isFuture(nextWeek))

// 16. Between check
const isInRange = isBetween(now, yesterday, nextWeek)
console.log('Is now between yesterday and next week?', isInRange)

// Example of using with Vue 3 Composition API
export const useDateUtils = () => {
  const formatDateForDisplay = (date: Date | string, locale: LocaleType = 'en') => {
    return formatDate(date, { locale, format: 'datetime' })
  }

  const getRelativeTime = (date: Date | string, locale: LocaleType = 'en') => {
    return formatRelativeTime(date, { locale })
  }

  const getSmartDate = (date: Date | string, locale: LocaleType = 'en') => {
    return formatDateSmart(date, { locale })
  }

  const convertToSeoulTime = (date: Date | string) => {
    return convertTimezone(date, 'Asia/Seoul')
  }

  return {
    formatDateForDisplay,
    getRelativeTime,
    getSmartDate,
    convertToSeoulTime,
    isToday,
    isSameDay,
    isBefore,
    isAfter,
    isBetween,
    addTime,
    subtractTime,
    getDifference,
    parseDate,
    isValidDate,
    getCurrentDate,
    getDateRange,
    getWeekNumber,
    getMonthName,
    getDayName,
    convertBetweenTimezones,
    getTimezoneOffset,
    isPast,
    isFuture,
    getAge,
    dayjs,
    DEFAULT_TIMEZONE_CONSTANT,
  }
}
