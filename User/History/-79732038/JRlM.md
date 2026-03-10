# Date Utilities (dateUtils.ts)

A comprehensive date utility library built with dayjs for Vue 3 projects supporting English and Korean locales with timezone handling.

## Features

- ✅ **Multi-locale support** (English & Korean)
- ✅ **Timezone handling** (Local, Asia/Seoul, UTC)
- ✅ **Date formatting** with locale-specific patterns
- ✅ **Relative time formatting** ("3 days ago", "in 2 hours")
- ✅ **Date comparison utilities** (isToday, isSameDay, isBefore, etc.)
- ✅ **Date manipulation** (add/subtract time, get start/end of periods)
- ✅ **Smart date formatting** (context-aware display)
- ✅ **TypeScript support** with full type safety
- ✅ **Vue 3 Composition API** ready

## Installation

The library uses dayjs which is already installed in your project. All required plugins are imported and configured automatically.

## Basic Usage

### Import the utilities

```typescript
import {
  formatDate,
  formatRelativeTime,
  convertTimezone,
  isToday,
  isSameDay,
  addTime,
  subtractTime,
  getStartOf,
  getEndOf,
  dayjs,
} from '@/utils/dateUtils'
```

### Basic Date Formatting

```typescript
const now = new Date()

// English formatting
formatDate(now, { locale: 'en' })
// Output: "2024-01-15"

formatDate(now, { format: 'datetime', locale: 'en' })
// Output: "2024-01-15 02:30 PM"

// Korean formatting
formatDate(now, { locale: 'ko' })
// Output: "2024년 01월 15일"

formatDate(now, { format: 'datetime', locale: 'ko' })
// Output: "2024년 01월 15일 오후 2:30"
```

### Relative Time Formatting

```typescript
const yesterday = subtractTime(now, 1, 'day')

formatRelativeTime(yesterday, { locale: 'en' })
// Output: "a day ago"

formatRelativeTime(yesterday, { locale: 'ko' })
// Output: "1일 전"
```

### Timezone Handling

```typescript
// Convert to Seoul timezone
const seoulTime = convertTimezone(now, 'Asia/Seoul')

// Format with specific timezone
formatDate(now, {
  format: 'datetime',
  timezone: 'Asia/Seoul',
  locale: 'en',
})
// Output: "2024-01-15 11:30 PM" (if local time is 2:30 PM)
```

### Date Comparisons

```typescript
const today = new Date()
const tomorrow = addTime(today, 1, 'day')
const yesterday = subtractTime(today, 1, 'day')

isToday(today) // true
isSameDay(today, today) // true
isBefore(yesterday, today) // true
isAfter(tomorrow, today) // true
isBetween(today, yesterday, tomorrow) // true
```

### Date Manipulation

```typescript
const now = new Date()

// Add/subtract time
const nextWeek = addTime(now, 1, 'week')
const lastMonth = subtractTime(now, 1, 'month')

// Get start/end of periods
const startOfDay = getStartOf(now, 'day')
const endOfMonth = getEndOf(now, 'month')
const startOfWeek = getStartOf(now, 'week')
const endOfYear = getEndOf(now, 'year')
```

### Smart Date Formatting

```typescript
const now = new Date()
const yesterday = subtractTime(now, 1, 'day')
const nextWeek = addTime(now, 1, 'week')

formatDateSmart(now) // "a few seconds ago" (if today)
formatDateSmart(yesterday) // "a day ago"
formatDateSmart(nextWeek) // "Jan 22" (if same year, no year shown)
```

## Vue 3 Composition API Usage

### Using the useDateUtils composable

```typescript
import { useDateUtils } from '@/utils/dateUtilsExample'

export default {
  setup() {
    const {
      formatDateForDisplay,
      getRelativeTime,
      getSmartDate,
      convertToSeoulTime,
      isToday,
      isBefore,
      addTime,
      getStartOf,
    } = useDateUtils()

    const formatUserDate = (date: Date) => {
      return formatDateForDisplay(date, 'en')
    }

    const getTimeAgo = (date: Date) => {
      return getRelativeTime(date, 'ko')
    }

    return {
      formatUserDate,
      getTimeAgo,
      isToday,
      isBefore,
      addTime,
      getStartOf,
    }
  },
}
```

### In Vue template

```vue
<template>
  <div>
    <p>Current time: {{ formatUserDate(now) }}</p>
    <p>Last updated: {{ getTimeAgo(lastUpdated) }}</p>
    <p v-if="isToday(createdAt)">Created today</p>
    <p v-if="isBefore(expiryDate, now)">Expired</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDateUtils } from '@/utils/dateUtilsExample'

const { formatUserDate, getTimeAgo, isToday, isBefore } = useDateUtils()

const now = ref(new Date())
const lastUpdated = ref(new Date('2024-01-10'))
const createdAt = ref(new Date())
const expiryDate = ref(new Date('2024-02-01'))
</script>
```

## API Reference

### Core Functions

#### `formatDate(date, options?)`

Formats a date according to locale and format type.

**Parameters:**

- `date`: Date, dayjs object, or date string
- `options`: DateFormatOptions object
  - `format`: 'date' | 'time' | 'datetime' | 'relative' | 'custom'
  - `locale`: 'en' | 'ko'
  - `timezone`: 'local' | 'Asia/Seoul' | 'UTC'
  - `customFormat`: Custom dayjs format string
  - `includeTime`: Boolean to include time in output

#### `formatRelativeTime(date, options?)`

Formats relative time (e.g., "3 days ago").

**Parameters:**

- `date`: Date, dayjs object, or date string
- `options`: RelativeTimeOptions object
  - `locale`: 'en' | 'ko'
  - `withoutSuffix`: Boolean to exclude "ago"/"in" suffix

#### `convertTimezone(date, timezone?)`

Converts date to specified timezone.

**Parameters:**

- `date`: Date, dayjs object, or date string
- `timezone`: 'local' | 'Asia/Seoul' | 'UTC' (default: 'Asia/Seoul')

### Comparison Functions

- `isToday(date)`: Check if date is today
- `isSameDay(date1, date2)`: Check if two dates are the same day
- `isBefore(date1, date2, unit?)`: Check if date1 is before date2
- `isAfter(date1, date2, unit?)`: Check if date1 is after date2
- `isBetween(date, start, end, unit?, inclusivity?)`: Check if date is between range
- `isPast(date)`: Check if date is in the past
- `isFuture(date)`: Check if date is in the future

### Manipulation Functions

- `addTime(date, amount, unit)`: Add time to date
- `subtractTime(date, amount, unit)`: Subtract time from date
- `getStartOf(date, unit, timezone?)`: Get start of period
- `getEndOf(date, unit, timezone?)`: Get end of period
- `getDifference(date1, date2, unit?)`: Get difference between dates

### Utility Functions

- `parseDate(dateString, format?, timezone?)`: Parse date string with validation
- `isValidDate(dateString, format?)`: Validate date string
- `getCurrentDate(timezone?)`: Get current date in timezone
- `getDateRange(start, end, timezone?)`: Get date range object
- `getWeekNumber(date)`: Get week number of year
- `getMonthName(date, locale?, format?)`: Get month name
- `getDayName(date, locale?, format?)`: Get day name
- `getAge(birthDate)`: Calculate age from birth date
- `formatDateSmart(date, options?)`: Smart formatting with context awareness

## Format Patterns

### English (en)

- Date: `YYYY-MM-DD`
- Time: `hh:mm A`
- DateTime: `YYYY-MM-DD hh:mm A`
- Short Date: `MM/DD/YYYY`
- Month Day: `MMM DD`
- Year Month: `YYYY-MM`

### Korean (ko)

- Date: `YYYY년 MM월 DD일`
- Time: `A hh:mm`
- DateTime: `YYYY년 MM월 DD일 A hh:mm`
- Short Date: `MM/DD`
- Month Day: `MM월 DD일`
- Year Month: `YYYY년 MM월`

## Timezone Support

The library supports three timezone types:

- `'local'`: User's local timezone
- `'Asia/Seoul'`: Seoul, Korea timezone (default)
- `'UTC'`: Coordinated Universal Time

## TypeScript Types

```typescript
export type DateFormat = 'date' | 'time' | 'datetime' | 'relative' | 'custom'
export type LocaleType = 'en' | 'ko'
export type TimezoneType = 'local' | 'Asia/Seoul' | 'UTC'

export interface DateFormatOptions {
  format?: DateFormat
  locale?: LocaleType
  timezone?: TimezoneType
  customFormat?: string
  includeTime?: boolean
}

export interface RelativeTimeOptions {
  locale?: LocaleType
  withoutSuffix?: boolean
}
```

## Examples

See `dateUtilsExample.ts` for comprehensive usage examples.

## Notes

- All functions are pure and don't modify input parameters
- Functions accept Date objects, dayjs objects, or date strings
- Korean locale includes proper relative time translations
- Default timezone is set to 'Asia/Seoul' for Korean applications
- All functions include proper TypeScript types for full type safety
