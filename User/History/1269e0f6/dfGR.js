const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

// Function to get UTC midnight timestamp
const getUTCMidnightTimestamp = (date) => {
  const dayjsDate = dayjs(date)
  const dateString = dayjsDate.format('YYYY-MM-DD')
  return dayjs.utc(`${dateString}T00:00:00Z`).unix()
}

// Function to get local timezone midnight timestamp
const getLocalMidnightTimestamp = (date, timezone) => {
  const dayjsDate = dayjs(date).tz(timezone)
  return dayjsDate.startOf('day').unix()
}

const testDate = '2025-08-01'

console.log('=== Timestamp Comparison for 2025-08-01 ===')
console.log('')

console.log('1. getUTCMidnightTimestamp:', getUTCMidnightTimestamp(testDate))
console.log('   - Represents: 2025-08-01T00:00:00Z (UTC midnight)')
console.log('   - In Asia/Ho_Chi_Minh: 2025-08-01T07:00:00+07:00')
console.log('')

console.log('2. getLocalMidnightTimestamp (Asia/Ho_Chi_Minh):', getLocalMidnightTimestamp(testDate, 'Asia/Ho_Chi_Minh'))
console.log('   - Represents: 2025-08-01T00:00:00+07:00 (Asia/Ho_Chi_Minh midnight)')
console.log('   - In UTC: 2025-07-31T17:00:00Z')
console.log('')

console.log('3. Original dayjs.tz approach:', dayjs.tz('2025-08-01T00:00:00', 'Asia/Ho_Chi_Minh').unix())
console.log('   - Same as getLocalMidnightTimestamp')
console.log('')

console.log('=== Verification ===')
console.log('1754006400 in UTC:', dayjs.unix(1754006400).utc().format())
console.log('1754006400 in Asia/Ho_Chi_Minh:', dayjs.unix(1754006400).tz('Asia/Ho_Chi_Minh').format())
console.log('1753981200 in UTC:', dayjs.unix(1753981200).utc().format())
console.log('1753981200 in Asia/Ho_Chi_Minh:', dayjs.unix(1753981200).tz('Asia/Ho_Chi_Minh').format()) 