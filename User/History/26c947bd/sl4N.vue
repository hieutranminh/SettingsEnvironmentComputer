<template>
  <div class="date-picker-range">
    <label for="date-picker-range-label">
      {{ $t('general.label-date-range') }}
    </label>

    <!-- Date Picker Input Components -->
    <div class="date-picker-range-input">
      <DatePicker
        id="date-range-from"
        showIcon
        iconDisplay="input"
        appendTo="self"
        :view="viewMode"
        :manualInput="true"
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
        :view="viewMode"
        :manualInput="true"
        :selectOtherMonths="true"
        :modelValue="convertedToDate"
        :dateFormat="PRIMEVUE_DATE_FORMATS.YMD"
        @update:modelValue="handleToDateChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Constants
import { PRIMEVUE_DATE_FORMATS } from '@/constants'
// Utils
import {
  getEndOf,
  getStartOf,
  TIMEZONE_TYPE,
  getCurrentDate,
  toUnixTimestamp,
  fromUnixTimestamp,
} from '@/utils/dateUtils'

import type { DateValue, DateViewMode } from '@/types/Common'

// Component interface
interface Props {
  /** View */
  viewMode: DateViewMode
  /** From date */
  fromDateTs: number
  /** To date */
  toDateTs: number
  /** Min - Max from date */
  minFromDate: Date
  maxFromDate: Date
  /** Min - Max to date */
  minToDate: Date
  maxToDate: Date
}

// Component props
const props = defineProps<Props>()

// Component emits
const emits = defineEmits<{
  (e: 'dateChange', value: { fromDateTs: number; toDateTs: number }): void
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

// Type guards
const isValidDate = (value: DateValue): value is Date => {
  return value instanceof Date
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
  emits('dateChange', dateRange)
}
</script>

<style scoped lang="scss">
.date-picker-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @include maxResponsive(smallMobile) {
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .date-picker-range-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
