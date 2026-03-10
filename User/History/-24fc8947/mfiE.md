# useDateRangeFilter.ts - Code Review & Improvements

## Current Issues

### 1. Code Duplication (Critical)
- `getDateRangeForDateType`, `getDateRangeForMonthType`, `getDateRangeForRangeType` có pattern tương tự
- Lặp lại logic `toUnixTimestamp` với cùng options

### 2. Hardcoded Values
- `'YYYY-MM'` format string
- `'day'`, `'month'` period strings

### 3. Type Safety Issues
- Unsafe type casting `timezone as TimezoneType`
- Missing timezone validation

### 4. Side Effects
- Auto-starting watcher có thể gây confusion
- Khó control khi nào watcher được start

## Proposed Improvements

### 1. Extract Common Logic
```typescript
const createDateRange = (startDate: Date, endDate: Date): DateRangeValues => {
  return {
    fromDateTs: toUnixTimestamp(startDate, timezone as TimezoneType, { keepLocalTime: true }),
    toDateTs: toUnixTimestamp(endDate, timezone as TimezoneType, { keepLocalTime: true }),
  }
}

const getDateRangeForDateType = (): DateRangeValues => {
  const startOfDay = getStartOf(getCurrentDate(), 'day').toDate()
  const endOfDay = getEndOf(getCurrentDate(), 'day').toDate()
  return createDateRange(startOfDay, endOfDay)
}
```

### 2. Extract Constants
```typescript
const DATE_FORMATS = {
  MONTH: 'YYYY-MM',
  DATE: 'YYYY-MM-DD',
  RANGE_SEPARATOR: ' - '
} as const

const PERIOD_TYPES = {
  DAY: 'day',
  MONTH: 'month'
} as const
```

### 3. Add Timezone Validation
```typescript
const validateTimezone = (tz: string): TimezoneType => {
  if (!Object.values(TIMEZONE_TYPE).includes(tz as TimezoneType)) {
    console.warn(`Invalid timezone: ${tz}, falling back to UTC`)
    return TIMEZONE_TYPE.UTC
  }
  return tz as TimezoneType
}
```

### 4. Remove Auto-start Side Effect
```typescript
// Remove this:
if (autoUpdateOnDateTypeChange) {
  watchDateTypeChanges()
}

// Let users call it explicitly:
const { watchDateTypeChanges } = useDateRangeFilter(filters, options)
watchDateTypeChanges() // Explicit call
```

### 5. Add Error Handling
```typescript
const getDefaultDateRange = (dateType: DateType): DateRangeValues => {
  try {
    switch (dateType) {
      case DATE_TYPE.DATE:
        return getDateRangeForDateType()
      case DATE_TYPE.MONTH:
        return getDateRangeForMonthType()
      case DATE_TYPE.RANGE:
        return getDateRangeForRangeType()
      default:
        console.warn(`Unknown date type: ${dateType}, falling back to DATE`)
        return getDateRangeForDateType()
    }
  } catch (error) {
    console.error('Error getting default date range:', error)
    return getDateRangeForDateType() // Fallback
  }
}
```

## Overall Assessment

**Score: 7.5/10**

**Strengths:**
- Good TypeScript usage
- Excellent documentation
- Clear function separation
- Follows Vue 3 patterns

**Main Issues:**
- Code duplication (biggest issue)
- Some hardcoded values
- Type safety concerns
- Side effects in composable

**Recommendation:** Refactor to reduce duplication and improve type safety while maintaining current API.
