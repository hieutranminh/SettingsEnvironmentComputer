# DatePickerField Component

A reusable date picker component built on top of VCalendar for the LK Warehouse CMS project.

## Features

- Built on VCalendar v3.1.2
- Fully typed with TypeScript
- Support for date, dateTime, and time modes
- Custom validation and error states
- Min/max date restrictions
- Disabled dates support
- Dark mode support
- Custom color themes
- Custom date format masks

## Installation

VCalendar is already installed and configured in the project. The DatePickerField component is automatically available through the auto-import system.

## Basic Usage

```vue
<template>
  <DatePickerField
    v-model="selectedDate"
    label="Select a date"
    placeholder="Choose a date"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedDate = ref<Date | null>(null)
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Date \| null` | `null` | The selected date value (v-model) |
| `label` | `string` | `''` | Label text for the field |
| `placeholder` | `string` | `'Select date'` | Placeholder text for the input |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the field is disabled |
| `error` | `string` | `''` | Error message to display |
| `hint` | `string` | `''` | Hint message to display |
| `mode` | `'date' \| 'dateTime' \| 'time'` | `'date'` | Picker mode |
| `minDate` | `Date` | `undefined` | Minimum selectable date |
| `maxDate` | `Date` | `undefined` | Maximum selectable date |
| `disabledDates` | `Date[] \| { start: Date; end: Date }[]` | `undefined` | Dates to disable |
| `timezone` | `string` | `undefined` | Timezone for date handling |
| `color` | `string` | `'blue'` | Theme color |
| `isDark` | `boolean` | `false` | Enable dark mode |
| `masks` | `object` | `{ input: 'YYYY-MM-DD' }` | Date format masks |

## Examples

### Required Field

```vue
<DatePickerField
  v-model="date"
  label="Birth Date"
  :required="true"
  hint="This field is required"
/>
```

### With Error State

```vue
<DatePickerField
  v-model="date"
  label="Date"
  error="This date is invalid"
/>
```

### Date Range Restrictions

```vue
<template>
  <DatePickerField
    v-model="futureDate"
    label="Future Dates Only"
    :min-date="today"
    hint="Only future dates are allowed"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const today = new Date()
const futureDate = ref<Date | null>(null)
</script>
```

### DateTime Picker

```vue
<DatePickerField
  v-model="dateTime"
  label="Date and Time"
  mode="dateTime"
  :masks="{ input: 'YYYY-MM-DD HH:mm' }"
/>
```

### Custom Color

```vue
<DatePickerField
  v-model="date"
  label="Custom Color"
  color="purple"
/>
```

### Form Integration

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <DatePickerField
      v-model="formData.startDate"
      label="Start Date"
      :required="true"
      :error="formErrors.startDate"
    />
    <DatePickerField
      v-model="formData.endDate"
      label="End Date"
      :required="true"
      :min-date="formData.startDate"
      :error="formErrors.endDate"
      hint="Must be after start date"
    />
    <Button label="Submit" type="submit" />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formData = reactive({
  startDate: null as Date | null,
  endDate: null as Date | null,
})

const formErrors = reactive({
  startDate: '',
  endDate: '',
})

const handleSubmit = (): void => {
  formErrors.startDate = ''
  formErrors.endDate = ''

  if (!formData.startDate) {
    formErrors.startDate = 'Start date is required'
    return
  }

  if (!formData.endDate) {
    formErrors.endDate = 'End date is required'
    return
  }

  if (formData.endDate < formData.startDate) {
    formErrors.endDate = 'End date must be after start date'
    return
  }

  // Submit form
  console.log('Form submitted:', formData)
}
</script>
```

## Live Examples

To see all examples in action, navigate to the Examples page in the application and select "Date Picker Examples" from the dropdown.

## Styling

The component uses CSS variables for theming and respects the application's global theme. Custom styling can be applied through the following CSS variables:

- `--text-color`: Main text color
- `--text-color-secondary`: Secondary text color
- `--surface-border`: Border color
- `--surface-0`: Background color
- `--surface-100`: Disabled background
- `--primary-color`: Primary theme color
- `--primary-color-alpha-20`: Primary color with transparency
- `--red-500`: Error color
- `--red-alpha-20`: Error color with transparency

## Technical Details

- The component is built using Vue 3 Composition API
- Uses VCalendar's `VDatePicker` component internally
- Implements v-model pattern for two-way data binding
- Fully typed with TypeScript interfaces
- Auto-generates unique input IDs for accessibility

## Related Files

- Plugin setup: `src/plugins/vcalendar.ts`
- Component: `src/components/common/DatePickerField.vue`
- Examples: `src/components/template/DatePickerExamples.vue`
- Export: `src/components/common/index.ts`

## Resources

- [VCalendar Documentation](https://vcalendar.io/)
- [VCalendar Date Picker API](https://vcalendar.io/date-picker/api.html)

