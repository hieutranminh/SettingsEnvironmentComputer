import { ref, computed } from 'vue'

import { DATE_RANGE_PRESETS, DATE_TYPE, PRIMEVUE_DATE_FORMATS } from '@/constants'
import {
  addTime,
  getEndOf,
  getStartOf,
  getCurrentDate,
  getLastMonthsRange,
  toUnixTimestamp,
  fromUnixTimestamp,
} from '@/utils/dateUtils'

// Type definitions
export type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
export type DateValue = Date | null
export type DateRangeValue = Date[] | null
export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[keyof typeof DATE_RANGE_PRESETS]
export type TimeUnit = 'day' | 'month'

export interface TimeFilterState {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  minDate?: Date
  maxDate?: Date
  dateRangePreset?: DateRangePreset
}

export interface TimeFilterEmits {
  (e: 'update:date-type', value: DateType): void
  (e: 'update:from-date-ts', value: number): void
  (e: 'update:to-date-ts', value: number): void
}

export const useTimeFilter = (initialState: TimeFilterState, emit: (event: string, value: unknown) => void) => {
  // Reactive state
  const selectedDate = ref<DateValue>(null)
  const selectedMonth = ref<DateValue>(null)
  const dateRange = ref<DateRangeValue>(null)

  // Computed properties
  const defaultDateRange = computed((): { minDate: Date; maxDate: Date } => {
    const { start: minDateDayjs, end: maxDateDayjs } = getLastMonthsRange(12)
    return {
      minDate: minDateDayjs.toDate(),
      maxDate: maxDateDayjs.toDate(),
    }
  })

  const monthPickerMinDate = computed((): Date => {
    return initialState.minDate ?? defaultDateRange.value.minDate
  })

  const monthPickerMaxDate = computed((): Date => {
    return initialState.maxDate ?? defaultDateRange.value.maxDate
  })

  const fromDate = computed((): DateValue => {
    return initialState.fromDateTs ? fromUnixTimestamp(initialState.fromDateTs).toDate() : null
  })

  const effectiveDateRangePreset = computed((): DateRangePreset => {
    return initialState.dateRangePreset ?? DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY
  })

  // Utility functions
  const isValidDateRange = (value: unknown): value is [Date, Date] => {
    return Array.isArray(value) && value.length === 2 && value[0] instanceof Date && value[1] instanceof Date
  }

  const emitDateUpdate = (fromDate: Date, toDate: Date): void => {
    const fromTimestamp = toUnixTimestamp(fromDate)
    const toTimestamp = toUnixTimestamp(toDate)
    emit('update:from-date-ts', fromTimestamp)
    emit('update:to-date-ts', toTimestamp)
  }

  // Date processing functions
  const processSingleDate = (value: DateValue, unit: TimeUnit): void => {
    if (!value) return

    try {
      const startOfUnit = getStartOf(value, unit)
      const endOfUnit = getEndOf(value, unit)
      emitDateUpdate(startOfUnit.toDate(), endOfUnit.toDate())
    } catch (error) {
      throw new Error(`Error processing ${unit} date: ${error}`)
    }
  }

  const processDateRange = (value: unknown): void => {
    if (!isValidDateRange(value)) return

    try {
      const [startDate, endDate] = value
      emitDateUpdate(startDate, endDate)
    } catch (error) {
      throw new Error(`Error processing date range: ${error}`)
    }
  }

  // Initialization functions
  const initializeDateRangePreset = (): void => {
    const currentDate = getCurrentDate()

    if (effectiveDateRangePreset.value === DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY) {
      const startOfMonth = getStartOf(currentDate, 'month').toDate()
      const endOfDay = getEndOf(currentDate, 'day').toDate()
      dateRange.value = [startOfMonth, endOfDay]
      emitDateUpdate(startOfMonth, endOfDay)
    }

    if (effectiveDateRangePreset.value === DATE_RANGE_PRESETS.FROM_TODAY_TO_NEXT_6_DAYS) {
      const startOfDay = getStartOf(currentDate, 'day').toDate()
      const endOf6DaysLater = getEndOf(addTime(currentDate, 6, 'day'), 'day').toDate()
      dateRange.value = [startOfDay, endOf6DaysLater]
      emitDateUpdate(startOfDay, endOf6DaysLater)
    }
  }

  const initializeStateFromProps = (): void => {
    const { dateType } = initialState

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

  const handleDateUpdate = (value: unknown): void => {
    if (value instanceof Date) {
      processSingleDate(value, 'day')
    }
  }

  const handleMonthUpdate = (value: unknown): void => {
    if (value instanceof Date) {
      processSingleDate(value, 'month')
    }
  }

  const handleRangeUpdate = (value: unknown): void => {
    if (isValidDateRange(value)) {
      processDateRange(value)
    }
  }

  return {
    // State
    selectedDate,
    selectedMonth,
    dateRange,

    // Computed
    monthPickerMinDate,
    monthPickerMaxDate,

    // Methods
    initializeStateFromProps,
    handleDateTypeChange,
    handleDateUpdate,
    handleMonthUpdate,
    handleRangeUpdate,
  }
}
