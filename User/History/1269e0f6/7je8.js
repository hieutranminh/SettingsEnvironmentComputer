// Simple test to verify timestamp conversion
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

// Test the fixed convertTimezone function
const convertTimezone = (date, targetTimezone = 'local') => {
  const dayjsDate = dayjs(date)

  if (targetTimezone === 'local') {
    return dayjsDate.local()
  }

  if (targetTimezone === 'UTC') {
    return dayjsDate.utc()
  }

  // Use utcOffset instead of tz to preserve the same moment in time
  const offset = dayjs.tz(targetTimezone).format('Z') // Get offset like "+09:00"
  return dayjsDate.utcOffset(offset)
}

const toUnixTimestamp = (date, timezone = 'local') => {
  const dayjsDate = convertTimezone(date, timezone)
  return dayjsDate.unix()
}

// Test case: Fri Aug 01 2025 00:00:00 GMT+0700 (Indochina Time)
const testDate = new Date('Fri Aug 01 2025 00:00:00 GMT+0700')

console.log('Input date:', testDate.toString())
console.log('Input date ISO:', testDate.toISOString())

const result = toUnixTimestamp(testDate, 'Asia/Seoul')
console.log('Result timestamp:', result)

// Convert back to verify
const backToDate = dayjs.unix(result).tz('Asia/Seoul')
console.log('Converted back:', backToDate.format('YYYY-MM-DD HH:mm:ss Z'))

// Expected: 1754006400
console.log('Expected timestamp: 1754006400')
console.log('Match:', result === 1754006400) 