# Shop Timezone Usage

This document explains how to use the shop timezone functionality in the application.

## Overview

The application now supports converting dates to the shop's timezone, which is stored in the auth store as `shop.timezone`. The timezone is stored in offset format (e.g., '+09:00', '+07:00') and can be converted to IANA timezone format for use with dayjs.

## Available Functions

### 1. `convertToShopTimezone(date, shopTimezone)`

Converts a date to the specified shop timezone.

```typescript
import { convertToShopTimezone } from '@/utils/dateUtils'

const now = new Date('2024-01-15T14:30:00')
const shopTime = convertToShopTimezone(now, '+09:00')
// Returns: dayjs object in Asia/Seoul timezone
```

### 2. `convertOffsetToIANA(offset)`

Converts timezone offset format to IANA timezone format.

```typescript
import { convertOffsetToIANA } from '@/utils/dateUtils'

convertOffsetToIANA('+09:00') // Returns: 'Asia/Seoul'
convertOffsetToIANA('+07:00') // Returns: 'Asia/Ho_Chi_Minh'
convertOffsetToIANA('+08:00') // Returns: 'Asia/Shanghai'
```

## Using the Composable

### `useShopTimezone()`

The composable provides easy access to shop timezone functionality:

```typescript
import { useShopTimezone } from '@/composables'

const { 
  shopTimezone, 
  shopIANATimezone, 
  convertDateToShopTimezone, 
  hasShopTimezone 
} = useShopTimezone()

// Get shop timezone string (e.g., '+09:00')
console.log(shopTimezone.value)

// Get IANA timezone format (e.g., 'Asia/Seoul')
console.log(shopIANATimezone.value)

// Convert date to shop timezone
const now = new Date()
const shopTime = convertDateToShopTimezone(now)

// Check if shop timezone is available
if (hasShopTimezone.value) {
  // Use shop timezone
}
```

## Example Usage in Vue Components

```vue
<template>
  <div>
    <p>Current time in shop timezone: {{ shopTimeFormatted }}</p>
    <p>Shop timezone: {{ shopTimezone }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShopTimezone } from '@/composables'
import { formatDate } from '@/utils/dateUtils'

const { shopTimezone, convertDateToShopTimezone } = useShopTimezone()

const shopTimeFormatted = computed(() => {
  const now = new Date()
  const shopTime = convertDateToShopTimezone(now)
  
  if (shopTime) {
    return formatDate(shopTime, { 
      format: 'datetime', 
      locale: 'en' 
    })
  }
  
  return formatDate(now, { 
    format: 'datetime', 
    locale: 'en' 
  })
})
</script>
```

## Supported Timezone Offsets

The following timezone offsets are supported and will be converted to their corresponding IANA timezone:

- `+09:00` → `Asia/Seoul`
- `+08:00` → `Asia/Shanghai`
- `+07:00` → `Asia/Ho_Chi_Minh`
- `-05:00` → `America/New_York`
- `-08:00` → `America/Los_Angeles`
- `+00:00` → `UTC`

For other offsets, the function will attempt to use the offset directly with dayjs.

## Error Handling

- If the shop timezone is not available, functions will fallback to local timezone
- If the auth store is not accessible, functions will return local timezone
- Invalid timezone offsets will be handled gracefully

## Integration with Existing Functions

You can use the shop timezone with existing date utility functions:

```typescript
import { formatDate, convertToShopTimezone } from '@/utils/dateUtils'

const now = new Date()
const shopTime = convertToShopTimezone(now, '+09:00')

// Format the shop time
const formatted = formatDate(shopTime, { 
  format: 'datetime', 
  locale: 'ko' 
})
``` 