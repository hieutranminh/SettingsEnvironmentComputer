# Filters Migration Guide

## Current State
- **8 Global Filters** defined in `src/plugins/Filters.js`
- **Usage**: Throughout templates as `{{ value | filterName }}`

## Vue 3 Changes
- **Filters are removed** in Vue 3
- **Solution**: Convert to methods or computed properties

## Filter List

1. `formatDate` - Format timestamp to timezone date
2. `formatDateToYMD` - Format timestamp to YMD format
3. `formatUTCDate` - Format UTC date
4. `formatUTCDateNoHour` - Format UTC date without hour
5. `formatStringDate` - Format string date
6. `formatDateTSFromUTCToTimeZone` - Convert UTC to timezone
7. `formatNumber` - Format number with decimals
8. `formatPhoneNumber` - Format phone number

## Migration Strategy

### Option 1: Global Methods (Recommended)
Register as global methods accessible in templates.

### Option 2: Composables
Create composables for use in Composition API.

### Option 3: Mix of Both
Global methods for templates, composables for script.

## Implementation

### 1. Create Global Methods Plugin
```javascript
// src/plugins/Filters.js (rename to GlobalMethods.js)
import { formatMoney, formatMobileAndPhoneNumber } from 'CommonHelpers'
import { formatTSToTimezoneDate, formatTSToUTCDate, formatStringOrDateObjToDate, convertTSFromUTCToTimeZone } from 'DatetimeHelpers'
import { STANDARD_DATE_FORMAT } from 'Constant'
import { common_options } from 'Options/common-options.js'

export default {
  install(app) {
    // Register as global methods
    app.config.globalProperties.$formatDate = function(TS) {
      return formatTSToTimezoneDate(TS, common_options.standard_date_format.ymdh)
    }

    app.config.globalProperties.$formatDateToYMD = function(TS) {
      return formatTSToTimezoneDate(TS, common_options.standard_date_format.ymd)
    }

    app.config.globalProperties.$formatUTCDate = function(TS) {
      return formatTSToUTCDate(TS, 'YYYY-MM-DD[\n]HH:mm')
    }

    app.config.globalProperties.$formatUTCDateNoHour = function(TS) {
      return formatTSToUTCDate(TS, common_options.standard_date_format.ymd)
    }

    app.config.globalProperties.$formatStringDate = function(date, formatTemplate = STANDARD_DATE_FORMAT.YMD) {
      return formatStringOrDateObjToDate(date, formatTemplate)
    }

    app.config.globalProperties.$formatDateTSFromUTCToTimeZone = function(date, formatTemplate = 'YYYY-MM-DD[\n]HH:mm') {
      return formatTSToUTCDate(convertTSFromUTCToTimeZone(date), formatTemplate)
    }

    app.config.globalProperties.$formatNumber = function(number, decimalCount) {
      return formatMoney(number, decimalCount)
    }

    app.config.globalProperties.$formatPhoneNumber = function(number, formatPhoneNumber) {
      return formatMobileAndPhoneNumber(number, formatPhoneNumber)
    }
  }
}
```

### 2. Update Template Usage

**Before:**
```vue
<template>
  <div>
    <p>{{ timestamp | formatDate }}</p>
    <p>{{ number | formatNumber(2) }}</p>
    <p>{{ phone | formatPhoneNumber }}</p>
  </div>
</template>
```

**After (Options API):**
```vue
<template>
  <div>
    <p>{{ $formatDate(timestamp) }}</p>
    <p>{{ $formatNumber(number, 2) }}</p>
    <p>{{ $formatPhoneNumber(phone) }}</p>
  </div>
</template>
```

**After (Composition API):**
```vue
<template>
  <div>
    <p>{{ formatDate(timestamp) }}</p>
    <p>{{ formatNumber(number, 2) }}</p>
    <p>{{ formatPhoneNumber(phone) }}</p>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const formatDate = (TS) => instance?.appContext.config.globalProperties.$formatDate(TS)
const formatNumber = (number, decimals) => instance?.appContext.config.globalProperties.$formatNumber(number, decimals)
const formatPhoneNumber = (phone) => instance?.appContext.config.globalProperties.$formatPhoneNumber(phone)
</script>
```

### 3. Create Composables (Better for Composition API)
```javascript
// src/composables/useFormatters.js
import { formatMoney, formatMobileAndPhoneNumber } from 'CommonHelpers'
import { formatTSToTimezoneDate, formatTSToUTCDate, formatStringOrDateObjToDate, convertTSFromUTCToTimeZone } from 'DatetimeHelpers'
import { STANDARD_DATE_FORMAT } from 'Constant'
import { common_options } from 'Options/common-options.js'

export function useFormatters() {
  const formatDate = (TS) => {
    return formatTSToTimezoneDate(TS, common_options.standard_date_format.ymdh)
  }

  const formatDateToYMD = (TS) => {
    return formatTSToTimezoneDate(TS, common_options.standard_date_format.ymd)
  }

  const formatUTCDate = (TS) => {
    return formatTSToUTCDate(TS, 'YYYY-MM-DD[\n]HH:mm')
  }

  const formatUTCDateNoHour = (TS) => {
    return formatTSToUTCDate(TS, common_options.standard_date_format.ymd)
  }

  const formatStringDate = (date, formatTemplate = STANDARD_DATE_FORMAT.YMD) => {
    return formatStringOrDateObjToDate(date, formatTemplate)
  }

  const formatDateTSFromUTCToTimeZone = (date, formatTemplate = 'YYYY-MM-DD[\n]HH:mm') => {
    return formatTSToUTCDate(convertTSFromUTCToTimeZone(date), formatTemplate)
  }

  const formatNumber = (number, decimalCount) => {
    return formatMoney(number, decimalCount)
  }

  const formatPhoneNumber = (number, formatPhoneNumber) => {
    return formatMobileAndPhoneNumber(number, formatPhoneNumber)
  }

  return {
    formatDate,
    formatDateToYMD,
    formatUTCDate,
    formatUTCDateNoHour,
    formatStringDate,
    formatDateTSFromUTCToTimeZone,
    formatNumber,
    formatPhoneNumber
  }
}
```

### 4. Update Plugin Registration
```javascript
// src/app.js
import Filters from './plugins/Filters' // Now GlobalMethods
// ... other imports

app.use(Filters) // Register global methods
```

## Migration Steps

1. **Find all filter usages:**
```bash
# Find all filter usages in templates
grep -r "| format" src/ --include="*.vue"
grep -r "| formatDate" src/ --include="*.vue"
grep -r "| formatNumber" src/ --include="*.vue"
# ... etc
```

2. **Update Filters.js to GlobalMethods.js**
   - Rename file
   - Convert filter registration to global methods

3. **Update all template files**
   - Replace `{{ value | filterName }}` with `{{ $filterName(value) }}`
   - Replace `{{ value | filterName(arg) }}` with `{{ $filterName(value, arg) }}`

4. **Test all formatting functionality**

## Common Patterns

### Pattern 1: Simple Filter
```vue
<!-- Before -->
{{ timestamp | formatDate }}

<!-- After -->
{{ $formatDate(timestamp) }}
```

### Pattern 2: Filter with Arguments
```vue
<!-- Before -->
{{ number | formatNumber(2) }}

<!-- After -->
{{ $formatNumber(number, 2) }}
```

### Pattern 3: Chained Filters (if any)
```vue
<!-- Before -->
{{ value | filter1 | filter2 }}

<!-- After -->
{{ $filter2($filter1(value)) }}
```

## Files to Update

Based on filter usage patterns:
- All template files using filters (estimated 200-300 files)
- `src/plugins/Filters.js` → `src/plugins/GlobalMethods.js`

## Testing Checklist

- [ ] Date formatting works correctly
- [ ] Number formatting works correctly
- [ ] Phone number formatting works correctly
- [ ] UTC date conversion works correctly
- [ ] Timezone conversion works correctly
- [ ] All filter arguments work correctly
- [ ] No console errors related to filters

