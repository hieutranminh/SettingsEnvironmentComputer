# AppDatePicker Component

A reusable date picker component built on top of v-calendar with PrimeVue styling integration.

## Installation

The v-calendar library and its dependencies are already installed and configured in the project.

Dependencies:
- `v-calendar@3.1.2`
- `@popperjs/core@2.11.8`

## Basic Usage

```vue
<template>
  <AppDatePicker v-model="selectedDate" placeholder="Select a date" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedDate = ref<Date | null>(null)
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Date \| { start: Date; end: Date } \| null` | `null` | The selected date or date range |
| `mode` | `'date' \| 'dateTime' \| 'time'` | `'date'` | The picker mode |
| `isRequired` | `boolean` | `false` | Whether the field is required |
| `isRange` | `boolean` | `false` | Enable date range selection |
| `disabled` | `boolean` | `false` | Disable the date picker |
| `placeholder` | `string` | `'Select date'` | Input placeholder text |
| `minDate` | `Date` | `undefined` | Minimum selectable date |
| `maxDate` | `Date` | `undefined` | Maximum selectable date |
| `disabledDates` | `Date[] \| { start: Date; end: Date }[] \| ((date: Date) => boolean)` | `undefined` | Dates to disable |
| `color` | `string` | `'blue'` | Calendar color theme |
| `timezone` | `string` | `undefined` | Timezone for date handling |
| `hasError` | `boolean` | `false` | Show error styling |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Date \| { start: Date; end: Date } \| null` | Emitted when the date changes |

## Examples

### Single Date Selection

```vue
<template>
  <AppDatePicker v-model="date" placeholder="Select a date" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>
```

### Date Range Selection

```vue
<template>
  <AppDatePicker 
    v-model="dateRange" 
    is-range 
    placeholder="Select date range" 
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dateRange = ref<{ start: Date; end: Date } | null>(null)
</script>
```

### Date Time Picker

```vue
<template>
  <AppDatePicker 
    v-model="dateTime" 
    mode="dateTime" 
    placeholder="Select date and time" 
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dateTime = ref<Date | null>(null)
</script>
```

### With Min/Max Dates

```vue
<template>
  <AppDatePicker 
    v-model="date"
    :min-date="minDate"
    :max-date="maxDate"
    placeholder="Select a date"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)

const minDate = new Date()
minDate.setDate(minDate.getDate() - 7) // 7 days ago

const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 7) // 7 days from now
</script>
```

### With Disabled Dates

```vue
<template>
  <AppDatePicker 
    v-model="date"
    :disabled-dates="disabledDates"
    placeholder="Select a date"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)

// Disable weekends
const disabledDates = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}
</script>
```

### With Error State

```vue
<template>
  <div>
    <AppDatePicker 
      v-model="date"
      :has-error="!date && submitted"
      placeholder="Select a date"
    />
    <small v-if="!date && submitted" class="error">Date is required</small>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
const submitted = ref(false)
</script>
```

### Disabled State

```vue
<template>
  <AppDatePicker 
    v-model="date"
    disabled
    placeholder="Disabled picker"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>
```

## Styling

The component automatically integrates with PrimeVue's theming system using CSS custom properties:

- `--p-inputtext-border-color`
- `--p-inputtext-background`
- `--p-inputtext-color`
- `--p-focus-ring-color`
- `--p-error-color`
- `--p-primary-color`

## Notes

- The component is automatically imported and available globally (no need to import it manually)
- It follows PrimeVue's design system for consistent styling
- v-calendar is configured globally in `src/plugins/vcalendar.ts`
- All v-calendar props can be passed through using `v-bind="$attrs"`

## See Also

- [v-calendar Documentation](https://vcalendar.io/)
- [DatePicker Examples](../template/DatePickerExamples.vue)

