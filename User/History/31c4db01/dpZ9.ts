import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/ko'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Set default timezone based on locale
const setTimezone = (locale: string) => {
  const timezoneMap: Record<string, string> = {
    en: 'UTC',
    ko: 'Asia/Seoul'
  }
  
  const tz = timezoneMap[locale] || 'UTC'
  dayjs.tz.setDefault(tz)
}

// Initialize with current locale
const currentLocale = localStorage.getItem('locale') || 'en'
setTimezone(currentLocale)

// Export configured dayjs instance
export default dayjs

// Export timezone setter for use in components
export { setTimezone } 