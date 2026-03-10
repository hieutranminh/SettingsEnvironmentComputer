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
          v-model="filterData.dateType"
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
          v-model="filterData.dateType"
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
          v-model="filterData.dateType"
          aria-label="Select date picker type: date range"
        />
        <label for="date-type-range">Date Range</label>
      </div>
    </div>

    <!-- Date Picker Input Components -->
    <div class="time-picker-input">
      <!-- Single Date Picker -->
      <div
        v-if="filterData.dateType === DATE_TYPE.DATE"
        class="date-picker"
      >
        <DatePicker
          showIcon
          iconDisplay="input"
          v-model="filterData.fromDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          :manualInput="false"
          @update:modelValue="handleDateChange"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-left"
          aria-label="Previous day"
          @click="handlePreviousDate"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-right"
          aria-label="Next day"
          @click="handleNextDate"
        />
      </div>

      <!-- Month Picker -->
      <div
        v-if="filterData.dateType === DATE_TYPE.MONTH"
        class="month-select"
      >
        <DatePicker
          showIcon
          iconDisplay="input"
          view="month"
          :minDate="monthPickerMinDate"
          :maxDate="monthPickerMaxDate"
          v-model="filterData.fromDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
          :manualInput="false"
          @update:modelValue="handleMonthChange"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-left"
          aria-label="Previous month"
          :disabled="isPreviousMonthDisabled"
          @click="handlePreviousMonth"
        />
        <Button
          severity="contrast"
          variant="outlined"
          icon="pi pi-chevron-right"
          aria-label="Next month"
          :disabled="isNextMonthDisabled"
          @click="handleNextMonth"
        />
      </div>

      <!-- Date Range Picker -->
      <div
        v-if="filterData.dateType === DATE_TYPE.RANGE"
        class="date-range"
      >
        <DatePicker
          id="date-range-from"
          showIcon
          iconDisplay="input"
          v-model="filterData.fromDate"
          :manualInput="false"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          @update:modelValue="handleFromDateChange"
        />
        <span>~</span>
        <DatePicker
          id="date-range-to"
          showIcon
          iconDisplay="input"
          v-model="filterData.toDate"
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
import { ref, computed, onMounted, watch } from 'vue'

import { DATE_RANGE_PRESETS, DATE_TYPE, PRIMEVUE_DATE_FORMATS, TIMEZONE_TYPE } from '@/constants'
import {
  addTime,
  getEndOf,
  getStartOf,
  getCurrentDate,
  getLastMonthsRange,
  toUnixTimestamp,
  subtractTime,
  isBefore,
  isAfter,
  fromUnixTimestamp,
  convertTimezone,
} from '@/utils/dateUtils'

// Type definitions
type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
type DateValue = Date | null | undefined | Date[] | (Date | null)[]
type DateRangePreset = (typeof DATE_RANGE_PRESETS)[keyof typeof DATE_RANGE_PRESETS]
type TimeUnit = 'day' | 'month'

// Component interface
interface Props {
  /** Initial date type. Defaults to DATE */
  initialDateType?: DateType
  /** Initial from date timestamp in seconds */
  initialFromDateTs?: number
  /** Initial to date timestamp in seconds */
  initialToDateTs?: number
  /** Minimum selectable date for month picker. Defaults to 12 months ago */
  minDate?: Date
  /** Maximum selectable date for month picker. Defaults to current month */
  maxDate?: Date
  /** Date range preset. Defaults to FROM_FIRST_DAY_OF_MONTH_TO_TODAY */
  dateRangePreset?: DateRangePreset
}

interface Emits {
  (e: 'dateChange', value: { dateType: DateType; fromDateTs: number; toDateTs: number }): void
  (e: 'filterTriggered'): void
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

const effectiveDateRangePreset = computed((): DateRangePreset => {
  return props.dateRangePreset ?? DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY
})

const isPreviousMonthDisabled = computed((): boolean => {
  if (!filterData.value.fromDate || !isValidDate(filterData.value.fromDate)) return true
  const previousMonth = subtractTime(filterData.value.fromDate, 1, 'month').toDate()
  return isBefore(previousMonth, monthPickerMinDate.value, 'month')
})

const isNextMonthDisabled = computed((): boolean => {
  if (!filterData.value.fromDate || !isValidDate(filterData.value.fromDate)) return true
  const nextMonth = addTime(filterData.value.fromDate, 1, 'month').toDate()
  return isAfter(nextMonth, monthPickerMaxDate.value, 'month')
})

// Reactive state
const filterData = ref<{
  dateType: DateType
  fromDate: DateValue
  toDate: DateValue
}>({
  dateType: props.initialDateType ?? DATE_TYPE.DATE,
  fromDate: props.initialFromDateTs ? fromUnixTimestamp(props.initialFromDateTs).toDate() : getCurrentDate().toDate(),
  toDate: props.initialToDateTs ? fromUnixTimestamp(props.initialToDateTs).toDate() : getCurrentDate().toDate(),
})

// Type guards
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date
}

// Date processing functions
const processSingleDate = (value: DateValue, unit: TimeUnit): void => {
  if (!isValidDate(value)) return

  const startOfUnit = getStartOf(value, unit)
  const endOfUnit = getEndOf(value, unit)

  filterData.value.fromDate = startOfUnit.toDate()
  filterData.value.toDate = endOfUnit.toDate()
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

// Event emission helper
const emitDateChange = (): void => {
  const { fromDate, toDate } = filterData.value

  if (!fromDate || !toDate) return

  if (!isValidDate(fromDate) || !isValidDate(toDate)) return

  emit('dateChange', {
    dateType: filterData.value.dateType,
    fromDateTs: toUnixTimestamp(fromDate, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    toDateTs: toUnixTimestamp(toDate, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}
const emitFilterTriggered = (): void => {
  emit('filterTriggered')
}

// Initialization functions
const initializeDateRangePreset = (): void => {
  const handler = dateRangePresetHandlers[effectiveDateRangePreset.value]
  if (handler) {
    const [startDate, endDate] = handler()
    filterData.value.fromDate = startDate
    filterData.value.toDate = endDate
  }
}

const initializeDefaultData = (): void => {
  handleDateTypeChange(filterData.value.dateType)
}

// Event handlers
const handleDateTypeChange = (value: DateType): void => {
  if (value === DATE_TYPE.DATE) {
    processSingleDate(getCurrentDate().toDate(), 'day')
  } else if (value === DATE_TYPE.MONTH) {
    processSingleDate(getCurrentDate().toDate(), 'month')
  } else if (value === DATE_TYPE.RANGE) {
    initializeDateRangePreset()
  }

  emitDateChange()
}

// Watch for dateType changes from v-model
watch(
  () => filterData.value.dateType,
  (newValue) => {
    handleDateTypeChange(newValue)
  },
)

const handleDateChange = (value: DateValue): void => {
  const a = convertTimezone(value)
  const b = convertTimezone(value, 'Asia/Seoul')
  console.log('a', a.toDate().toString())
  console.log('b', b.toDate().toString())
  if (isValidDate(value)) {
    processSingleDate(value, 'day')
    emitDateChange()
  }
}

const handleMonthChange = (value: DateValue): void => {
  if (isValidDate(value)) {
    processSingleDate(value, 'month')
    emitDateChange()
  }
}

const handleFromDateChange = (value: DateValue): void => {
  if (isValidDate(value)) {
    const startOfUnit = getStartOf(value, 'day')
    filterData.value.fromDate = startOfUnit.toDate()
    emitDateChange()
  }
}

const handleToDateChange = (value: DateValue): void => {
  if (isValidDate(value)) {
    const endOfUnit = getEndOf(value, 'day')
    filterData.value.toDate = endOfUnit.toDate()
    emitDateChange()
  }
}

const handlePreviousDate = (): void => {
  if (filterData.value.fromDate && isValidDate(filterData.value.fromDate)) {
    const previousDate = subtractTime(filterData.value.fromDate, 1, 'day').toDate()
    filterData.value.fromDate = previousDate
    processSingleDate(previousDate, 'day')
    emitDateChange()
    emitFilterTriggered()
  }
}

const handleNextDate = (): void => {
  if (filterData.value.fromDate && isValidDate(filterData.value.fromDate)) {
    const nextDate = addTime(filterData.value.fromDate, 1, 'day').toDate()
    filterData.value.fromDate = nextDate
    processSingleDate(nextDate, 'day')
    emitDateChange()
    emitFilterTriggered()
  }
}

const handlePreviousMonth = (): void => {
  if (filterData.value.fromDate && isValidDate(filterData.value.fromDate)) {
    const previousMonth = subtractTime(filterData.value.fromDate, 1, 'month').toDate()
    filterData.value.fromDate = previousMonth
    processSingleDate(previousMonth, 'month')
    emitDateChange()
    emitFilterTriggered()
  }
}

const handleNextMonth = (): void => {
  if (filterData.value.fromDate && isValidDate(filterData.value.fromDate)) {
    const nextMonth = addTime(filterData.value.fromDate, 1, 'month').toDate()
    filterData.value.fromDate = nextMonth
    processSingleDate(nextMonth, 'month')
    emitDateChange()
    emitFilterTriggered()
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeDefaultData()
})
</script>

<style lang="scss" scoped>
.time-picker {
  display: flex;
  flex-wrap: wrap;
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
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}
</style>
