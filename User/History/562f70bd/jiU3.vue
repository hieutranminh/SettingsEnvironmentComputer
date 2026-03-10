<template>
  <div class="time-picker">
    <!-- Date Picker Type Selection -->
    <div class="time-picker-type">
      <!-- Single Date Selection -->
      <div class="time-picker-item">
        <RadioButton
          inputId="date-type-date"
          name="dateType"
          :value="DATE_TYPE.DATE"
          :modelValue="dateType"
          @update:modelValue="handleDateTypeChange"
          aria-label="Select date picker type: single date"
        />
        <label for="date-type-date">Date</label>
      </div>

      <!-- Month Selection -->
      <div class="time-picker-item">
        <RadioButton
          inputId="date-type-month"
          name="dateType"
          :value="DATE_TYPE.MONTH"
          :modelValue="dateType"
          @update:modelValue="handleDateTypeChange"
          aria-label="Select date picker type: month"
        />
        <label for="date-type-month">Month</label>
      </div>

      <!-- Date Range Selection -->
      <div class="time-picker-item">
        <RadioButton
          inputId="date-type-range"
          name="dateType"
          :value="DATE_TYPE.RANGE"
          :modelValue="dateType"
          @update:modelValue="handleDateTypeChange"
          aria-label="Select date picker type: date range"
        />
        <label for="date-type-range">Date Range</label>
      </div>
    </div>

    <!-- Date Picker Input Components -->
    <div class="time-picker-input">
      <!-- Single Date Picker -->
      <div
        v-if="dateType === DATE_TYPE.DATE"
        class="date-picker"
      >
        <DatePicker
          showIcon
          iconDisplay="input"
          :modelValue="selectedDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          :manualInput="false"
          @update:modelValue="processDateSelection"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-left"
          aria-label="Previous"
          @click="handlePreviousDate"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-right"
          aria-label="Next"
          @click="handleNextDate"
        />
      </div>

      <!-- Month Picker -->
      <div
        v-if="dateType === DATE_TYPE.MONTH"
        class="month-select"
      >
        <DatePicker
          showIcon
          iconDisplay="input"
          view="month"
          :minDate="monthPickerMinDate"
          :maxDate="monthPickerMaxDate"
          :modelValue="selectedMonth"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
          :manualInput="false"
          @update:modelValue="processMonthSelection"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-left"
          aria-label="Previous"
          :disabled="isPreviousMonthDisabled"
          @click="handlePreviousMonth"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-right"
          aria-label="Next"
          :disabled="isNextMonthDisabled"
          @click="handleNextMonth"
        />
      </div>

      <!-- Date Range Picker -->
      <div
        v-if="dateType === DATE_TYPE.RANGE"
        class="date-range"
      >
        <DatePicker
          id="date-range-from"
          showIcon
          iconDisplay="input"
          :modelValue="dateRangeFrom"
          :manualInput="false"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          @update:modelValue="handleFromDateChange"
        />
        <DatePicker
          id="date-range-to"
          showIcon
          iconDisplay="input"
          :modelValue="dateRangeTo"
          :manualInput="false"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          @update:modelValue="handleToDateChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref, computed, onMounted } from 'vue'

import { DATE_RANGE_PRESETS, DATE_TYPE, PRIMEVUE_DATE_FORMATS } from '@/constants'
import {
  addTime,
  getEndOf,
  getStartOf,
  getCurrentDate,
  getLastMonthsRange,
  toUnixTimestamp,
  fromUnixTimestamp,
  subtractTime,
  isBefore,
  isAfter,
} from '@/utils/dateUtils'

// Type definitions
type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
type DateValue = Date | null
type DateRangePreset = (typeof DATE_RANGE_PRESETS)[keyof typeof DATE_RANGE_PRESETS]
type TimeUnit = 'day' | 'month'

// Component interface
interface Props {
  /** Type of date picker: DATE (1), MONTH (2), or RANGE (3) */
  dateType: DateType
  /** Start date timestamp in seconds */
  fromDateTs: number
  /** End date timestamp in seconds */
  toDateTs: number
  /** Minimum selectable date for month picker. Defaults to 12 months ago */
  minDate?: Date
  /** Maximum selectable date for month picker. Defaults to current month */
  maxDate?: Date
  /** Date range preset. Defaults to FROM_FIRST_DAY_OF_MONTH_TO_TODAY */
  dateRangePreset?: DateRangePreset
}

interface Emits {
  (e: 'update:date-type', value: DateType): void
  (e: 'update:from-date-ts', value: number): void
  (e: 'update:to-date-ts', value: number): void
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed properties
const defaultDateRange = computed((): { minDate: Date; maxDate: Date } => {
  const { start: minDateDayjs, end: maxDateDayjs } = getLastMonthsRange(12)
  return {
    minDate: minDateDayjs.toDate(),
    maxDate: maxDateDayjs.toDate(),
  }
})

const monthPickerMinDate = computed((): Date => {
  return props.minDate ?? defaultDateRange.value.minDate
})

const monthPickerMaxDate = computed((): Date => {
  return props.maxDate ?? defaultDateRange.value.maxDate
})

const fromDate = computed((): DateValue => {
  return props.fromDateTs ? fromUnixTimestamp(props.fromDateTs).toDate() : null
})

const effectiveDateRangePreset = computed((): DateRangePreset => {
  return props.dateRangePreset ?? DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY
})

const isPreviousMonthDisabled = computed((): boolean => {
  if (!selectedMonth.value) return true
  const previousMonth = subtractTime(selectedMonth.value, 1, 'month').toDate()
  return isBefore(previousMonth, monthPickerMinDate.value, 'month')
})

const isNextMonthDisabled = computed((): boolean => {
  if (!selectedMonth.value) return true
  const nextMonth = addTime(selectedMonth.value, 1, 'month').toDate()
  return isAfter(nextMonth, monthPickerMaxDate.value, 'month')
})

// Reactive state
const selectedDate = ref<DateValue>(null)
const selectedMonth = ref<DateValue>(null)
const dateRangeFrom = ref<DateValue>(null)
const dateRangeTo = ref<DateValue>(null)

// Type guards
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date
}

const emitDateUpdate = (fromDate: Date, toDate: Date): void => {
  const fromTimestamp = toUnixTimestamp(fromDate)
  const toTimestamp = toUnixTimestamp(toDate)
  emit('update:from-date-ts', fromTimestamp)
  emit('update:to-date-ts', toTimestamp)
}

// Date processing functions
const processSingleDate = (value: DateValue, unit: TimeUnit): void => {
  if (!isValidDate(value)) return

  const startOfUnit = getStartOf(value, unit)
  const endOfUnit = getEndOf(value, unit)
  emitDateUpdate(startOfUnit.toDate(), endOfUnit.toDate())
}

// Date range preset handlers
const dateRangePresetHandlers = {
  [DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY]: () => {
    const currentDate = getCurrentDate()
    const startOfMonth = getStartOf(currentDate, 'month').toDate()
    const endOfDay = getEndOf(currentDate, 'day').toDate()
    return [startOfMonth, endOfDay]
  },
  [DATE_RANGE_PRESETS.FROM_TODAY_TO_NEXT_6_DAYS]: () => {
    const currentDate = getCurrentDate()
    const startOfDay = getStartOf(currentDate, 'day').toDate()
    const endOf6DaysLater = getEndOf(addTime(currentDate, 6, 'day'), 'day').toDate()
    return [startOfDay, endOf6DaysLater]
  },
} as const

// Initialization functions
const initializeDateRangePreset = (): void => {
  const handler = dateRangePresetHandlers[effectiveDateRangePreset.value]
  if (handler) {
    const [startDate, endDate] = handler()
    dateRangeFrom.value = startDate
    dateRangeTo.value = endDate
    emitDateUpdate(startDate, endDate)
  }
}

const initializeStateFromProps = (): void => {
  const { dateType } = props

  if (dateType === DATE_TYPE.DATE) {
    selectedDate.value = fromDate.value
    processSingleDate(selectedDate.value, 'day')
  } else if (dateType === DATE_TYPE.MONTH) {
    selectedMonth.value = fromDate.value
    processSingleDate(selectedMonth.value, 'month')
  } else if (dateType === DATE_TYPE.RANGE) {
    initializeDateRangePreset()
  }
}

// Event handlers
const handleDateTypeChange = (value: DateType): void => {
  emit('update:date-type', value)

  // Reset default values based on new date type
  const currentDate = getCurrentDate().toDate()

  if (value === DATE_TYPE.DATE) {
    selectedDate.value = currentDate
    processSingleDate(selectedDate.value, 'day')
  } else if (value === DATE_TYPE.MONTH) {
    selectedMonth.value = currentDate
    processSingleDate(selectedMonth.value, 'month')
  } else if (value === DATE_TYPE.RANGE) {
    initializeDateRangePreset()
  }
}

const processDateSelection = (value: unknown): void => {
  if (isValidDate(value)) {
    processSingleDate(value, 'day')
  }
}

const processMonthSelection = (value: unknown): void => {
  if (isValidDate(value)) {
    processSingleDate(value, 'month')
  }
}

const handleFromDateChange = (value: unknown): void => {
  if (isValidDate(value)) {
    dateRangeFrom.value = value
    if (dateRangeTo.value) {
      emitDateUpdate(value, dateRangeTo.value)
    }
  }
}

const handleToDateChange = (value: unknown): void => {
  if (isValidDate(value)) {
    dateRangeTo.value = value
    if (dateRangeFrom.value) {
      emitDateUpdate(dateRangeFrom.value, value)
    }
  }
}

const handlePreviousDate = (): void => {
  if (selectedDate.value) {
    const previousDate = subtractTime(selectedDate.value, 1, 'day').toDate()
    selectedDate.value = previousDate
    processSingleDate(previousDate, 'day')
  }
}

const handleNextDate = (): void => {
  if (selectedDate.value) {
    const nextDate = addTime(selectedDate.value, 1, 'day').toDate()
    selectedDate.value = nextDate
    processSingleDate(nextDate, 'day')
  }
}

const handlePreviousMonth = (): void => {
  if (selectedMonth.value) {
    const previousMonth = subtractTime(selectedMonth.value, 1, 'month').toDate()
    selectedMonth.value = previousMonth
    processSingleDate(previousMonth, 'month')
  }
}

const handleNextMonth = (): void => {
  if (selectedMonth.value) {
    const nextMonth = addTime(selectedMonth.value, 1, 'month').toDate()
    selectedMonth.value = nextMonth
    processSingleDate(nextMonth, 'month')
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeStateFromProps()
})
</script>

<style lang="scss" scoped>
.time-picker {
  display: flex;
  gap: 1rem;

  .time-picker-type {
    display: flex;
    gap: 1rem;
    align-items: center;

    .time-picker-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .time-picker-input {
    .date-picker,
    .month-select,
    .date-range {
      width: 100%;
    }

    .date-range {
      .date-range-inputs {
        display: flex;
        gap: 1rem;
        align-items: flex-end;

        .date-range-from,
        .date-range-to {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          label {
            font-weight: 500;
            color: var(--text-color);
          }
        }
      }
    }
  }
}
</style>
