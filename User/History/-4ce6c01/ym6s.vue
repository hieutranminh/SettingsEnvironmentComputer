<template>
  <div class="date-picker-group">
    <!-- Date Picker Type Selection -->
    <div class="date-picker-group-type">
      <!-- Single Date Selection -->
      <div class="date-picker-group-item">
        <RadioButton
          inputId="date-type-date"
          name="dateType"
          :modelValue="dateType"
          :value="DATE_TYPE.DATE"
          :aria-label="$t('general.aria-label-date-type-date')"
          @update:modelValue="emitDateTypeChange"
        />
        <label for="date-type-date">{{ $t('general.label-date') }}</label>
      </div>

      <!-- Month Selection -->
      <div class="date-picker-group-item">
        <RadioButton
          inputId="date-type-month"
          name="dateType"
          :modelValue="dateType"
          :value="DATE_TYPE.MONTH"
          :aria-label="$t('general.aria-label-date-type-month')"
          @update:modelValue="emitDateTypeChange"
        />
        <label for="date-type-month">{{ $t('general.label-month') }}</label>
      </div>

      <!-- Date Range Selection -->
      <div class="date-picker-group-item">
        <RadioButton
          inputId="date-type-range"
          name="dateType"
          :modelValue="dateType"
          :value="DATE_TYPE.RANGE"
          :aria-label="$t('general.aria-label-date-type-range')"
          @update:modelValue="emitDateTypeChange"
        />
        <label for="date-type-range">{{ $t('general.label-date-range') }}</label>
      </div>
    </div>

    <!-- Date Picker Input Components -->
    <div class="date-picker-group-input">
      <!-- Single Date Picker -->
      <div v-if="dateType === DATE_TYPE.DATE" class="date-picker">
        <DatePicker
          showIcon
          iconDisplay="input"
          appendTo="self"
          :manualInput="true"
          :selectOtherMonths="true"
          :modelValue="convertedFromDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          @update:modelValue="handleDateChange"
        />
        <template v-if="showPrevNext">
          <Button
            severity="contrast"
            variant="outlined"
            icon="pi pi-chevron-left"
            :aria-label="$t('general.aria-label-previous-day')"
            @click="handlePreviousDate"
          />
          <Button
            severity="contrast"
            variant="outlined"
            icon="pi pi-chevron-right"
            :aria-label="$t('general.aria-label-next-day')"
            @click="handleNextDate"
          />
        </template>
      </div>

      <!-- Month Picker -->
      <div v-if="dateType === DATE_TYPE.MONTH" class="month-select">
        <DatePicker
          showIcon
          iconDisplay="input"
          view="month"
          appendTo="self"
          :manualInput="false"
          :selectOtherMonths="true"
          :minDate="monthPickerMinDate"
          :maxDate="monthPickerMaxDate"
          :modelValue="convertedFromDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
          @update:modelValue="handleMonthChange"
        />
        <template v-if="showPrevNext">
          <Button
            severity="contrast"
            variant="outlined"
            icon="pi pi-chevron-left"
            :aria-label="$t('general.aria-label-previous-month')"
            :disabled="isPreviousMonthDisabled"
            @click="handlePreviousMonth"
          />
          <Button
            severity="contrast"
            variant="outlined"
            icon="pi pi-chevron-right"
            :aria-label="$t('general.aria-label-next-month')"
            :disabled="isNextMonthDisabled"
            @click="handleNextMonth"
          />
        </template>
      </div>

      <!-- Date Range Picker -->
      <div v-if="dateType === DATE_TYPE.RANGE" class="date-range">
        <DatePicker
          id="date-range-from"
          showIcon
          iconDisplay="input"
          appendTo="self"
          :manualInput="false"
          :selectOtherMonths="true"
          :modelValue="convertedFromDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          @update:modelValue="handleFromDateChange"
        />
        <span>~</span>
        <DatePicker
          id="date-range-to"
          showIcon
          iconDisplay="input"
          appendTo="self"
          :manualInput="false"
          :selectOtherMonths="true"
          :modelValue="convertedToDate"
          :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
          @update:modelValue="handleToDateChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Constants
import { DATE_TYPE, PRIMEVUE_DATE_FORMATS } from '@/constants'
// Utils
import {
  addTime,
  getEndOf,
  getStartOf,
  subtractTime,
  TIMEZONE_TYPE,
  getCurrentDate,
  toUnixTimestamp,
  fromUnixTimestamp,
  getLastMonthsRange,
  isBefore,
  isAfter,
} from '@/utils/dateUtils'

// Type definitions
type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
type DateValue = Date | null | undefined | Date[] | (Date | null)[]

// Component interface
interface Props {
  /** Date type */
  dateType: DateType
  /** From date */
  fromDateTs: number
  /** To date */
  toDateTs: number
  /** Minimum date */
  minDate?: Date
  /** Maximum date */
  maxDate?: Date
  /** Show previous and next buttons */
  showPrevNext?: boolean
  /** Fetch on navigate */
  fetchOnNavigate?: boolean
}

// Component props
const props = defineProps<Props>()

// Component emits
const emits = defineEmits<{
  (e: 'update:dateType', value: DateType): void
  (e: 'dateChange', value: { fromDateTs: number; toDateTs: number }, fetchOnNavigate: boolean): void
}>()

/**
 * Computed property for converted from date
 * @returns Converted from date
 */
const convertedFromDate = computed<Date>(() => {
  return props.fromDateTs ? fromUnixTimestamp(props.fromDateTs).toDate() : getCurrentDate().toDate()
})

/**
 * Computed property for converted to date
 * @returns Converted to date
 * The reason I have to subtract 1 day is because
 * PrimeVue’s DatePicker displays values in UTC, while my toDateTs is based on the timezone
 * and includes the end-of-day time (e.g., 31-08-2025 11:59:59 PM).
 * As a result, when displayed in the DatePicker, it shifts to 01-09-2025.
 * Therefore, I need to subtract 1 day to match PrimeVue’s display behavior
 */
const convertedToDate = computed<Date>(() => {
  return props.toDateTs
    ? fromUnixTimestamp(props.toDateTs).subtract(1, 'day').toDate()
    : getCurrentDate().toDate()
})

/**
 * Computed property for last 12 months range
 * @returns Last 12 months range
 */
const last12MonthsRange = computed((): { minDate: Date; maxDate: Date } => {
  const RANGE_MONTHS = 12
  const { start: minDateDayjs, end: maxDateDayjs } = getLastMonthsRange(RANGE_MONTHS)

  return {
    minDate: minDateDayjs.toDate(),
    maxDate: maxDateDayjs.toDate(),
  }
})

/**
 * Computed property for month picker min date
 * @returns Month picker min date
 */
const monthPickerMinDate = computed((): Date => {
  return props.minDate ?? last12MonthsRange.value.minDate
})

/**
 * Computed property for month picker max date
 * @returns Month picker max date
 */
const monthPickerMaxDate = computed((): Date => {
  return props.maxDate ?? last12MonthsRange.value.maxDate
})

/**
 * Computed property for is previous month disabled
 * @returns Is previous month disabled
 */
const isPreviousMonthDisabled = computed((): boolean => {
  if (!convertedFromDate.value || !isValidDate(convertedFromDate.value)) return true
  const previousMonth = subtractTime(convertedFromDate.value, 1, 'month').toDate()
  return isBefore(previousMonth, monthPickerMinDate.value, 'month')
})

/**
 * Computed property for is next month disabled
 * @returns Is next month disabled
 */
const isNextMonthDisabled = computed((): boolean => {
  if (!convertedFromDate.value || !isValidDate(convertedFromDate.value)) return true
  const nextMonth = addTime(convertedFromDate.value, 1, 'month').toDate()
  return isAfter(nextMonth, monthPickerMaxDate.value, 'month')
})

// Type guards
const isValidDate = (value: DateValue): value is Date => {
  return value instanceof Date
}

/**
 * Handle date type change
 * @param value - Date type
 */
const emitDateTypeChange = (value: DateType): void => {
  emits('update:dateType', value)
}

/**
 * Create date range timestamp
 * @param startDate
 * @param endDate
 */
const createDateRangeTs = (
  startDate: Date,
  endDate: Date,
): { fromDateTs: number; toDateTs: number } => ({
  fromDateTs: toUnixTimestamp(startDate, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endDate, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
})

/**
 * Handle date change
 * @param value - Date
 */
const handleDateChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const startOfDay = getStartOf(value, 'day').toDate()
  const endOfDay = getEndOf(value, 'day').toDate()

  emitDateChange(createDateRangeTs(startOfDay, endOfDay))
}

/**
 * Handle previous date
 */
const handlePreviousDate = (): void => {
  const previousDate = subtractTime(convertedFromDate.value, 1, 'day').toDate()
  const startOfDay = getStartOf(previousDate, 'day').toDate()
  const endOfDay = getEndOf(previousDate, 'day').toDate()

  emitDateChange({
    ...createDateRangeTs(startOfDay, endOfDay),
    fetchOnNavigate: props.fetchOnNavigate,
  })
}

/**
 * Handle next date
 */
const handleNextDate = (): void => {
  const nextDate = addTime(convertedFromDate.value, 1, 'day').toDate()
  const startOfDay = getStartOf(nextDate, 'day').toDate()
  const endOfDay = getEndOf(nextDate, 'day').toDate()

  emitDateChange(createDateRangeTs(startOfDay, endOfDay))
}

/**
 * Handle month change
 * @param value - Date
 */
const handleMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const startOfMonth = getStartOf(value, 'month').toDate()
  const endOfMonth = getEndOf(value, 'month').toDate()

  emitDateChange(createDateRangeTs(startOfMonth, endOfMonth))
}

/**
 * Handle previous month
 */
const handlePreviousMonth = (): void => {
  const previousMonth = subtractTime(convertedFromDate.value, 1, 'month').toDate()
  const startOfMonth = getStartOf(previousMonth, 'month').toDate()
  const endOfMonth = getEndOf(previousMonth, 'month').toDate()

  emitDateChange(createDateRangeTs(startOfMonth, endOfMonth))
}

/**
 * Handle next month
 */
const handleNextMonth = (): void => {
  const nextMonth = addTime(convertedFromDate.value, 1, 'month').toDate()
  const startOfMonth = getStartOf(nextMonth, 'month').toDate()
  const endOfMonth = getEndOf(nextMonth, 'month').toDate()

  emitDateChange(createDateRangeTs(startOfMonth, endOfMonth))
}

/**
 * Handle from date change
 */
const handleFromDateChange = (value: DateValue): void => {
  if (!isValidDate(value)) return
  const startOfDay = getStartOf(value, 'day').toDate()

  emitDateChange({
    fromDateTs: toUnixTimestamp(startOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    toDateTs: props.toDateTs,
  })
}

/**
 * Handle to date change
 */
const handleToDateChange = (value: DateValue): void => {
  if (!isValidDate(value)) return
  const endOfDay = getEndOf(value, 'day').toDate()

  emitDateChange({
    fromDateTs: props.fromDateTs,
    toDateTs: toUnixTimestamp(endOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

/**
 * Handle date change emit
 * @param dateRange
 */
const emitDateChange = (dateRange: { fromDateTs: number; toDateTs: number }): void => {
  emits('dateChange', dateRange, props.fetchOnNavigate)
}
</script>

<style scoped lang="scss">
.date-picker-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .date-picker-group-type {
    display: flex;
    gap: 1rem;
    align-items: center;

    .date-picker-group-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .date-picker-group-input {
    @include maxResponsive(smallMobile) {
      width: 100%;
    }

    .date-picker,
    .month-select,
    .date-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      @include maxResponsive(smallMobile) {
        width: 100%;
      }

      .p-datepicker {
        flex: 1;
      }
    }
  }
}
</style>
