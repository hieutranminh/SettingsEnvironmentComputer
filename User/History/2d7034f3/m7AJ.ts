import { computed, watch, type Ref } from 'vue'

// Composables
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { TIMEZONE_TYPE, DATE_TYPE, DATE_RANGE_PRESETS, DATE_UNITS, type DateType } from '@/constants'
// Utils
import {
  getStartOf,
  getEndOf,
  getCurrentDate,
  toUnixTimestamp,
  fromUnixTimestamp,
  dateRangePresetHandlers,
  type TimezoneType,
} from '@/utils/dateUtils'

/**
 * Constants for date formatting and period types
 */
const DATE_FORMATS = {
  MONTH: 'YYYY-MM',
  DATE: 'YYYY-MM-DD',
  RANGE_SEPARATOR: ' - ',
} as const

export interface DateRangeFilterBase {
  /** Type of date filtering (DATE, MONTH, RANGE) */
  dateType: DateType

  /** Start date as Unix timestamp */
  fromDateTs: number

  /** End date as Unix timestamp */
  toDateTs: number
}

/**
 * Interface for date range configuration options
 */
export interface DateRangeOptions {
  /** Default date type to use */
  defaultDateType?: DateType
  /** Whether to auto-update date range when date type changes */
  autoUpdateOnDateTypeChange?: boolean
  /** Custom timezone to use (defaults to UTC) */
  timezone?: string
}

/**
 * Interface for date range values returned by the composable
 */
export interface DateRangeValues {
  fromDateTs: number
  toDateTs: number
}

/**
 * Composable for managing date range filtering logic across report views
 * Provides reactive state and methods for handling date ranges, formatting, and validation
 *
 * @param filters - Reactive reference to filter object containing date range properties
 * @param options - Configuration options for date range behavior
 * @returns Object containing reactive state and methods for date range operations
 *
 * @example
 * ```typescript
 * const filters = ref<ClientsByPeriodFilterInterface>({
 *   dateType: DATE_TYPE.MONTH,
 *   fromDateTs: 1234567890,
 *   toDateTs: 1234567890,
 *   // ... other filter properties
 * })
 *
 * const {
 *   dateRangeText,
 *   getDefaultDateRange,
 *   updateDateRange,
 *   watchDateTypeChanges
 * } = useDateRangeFilter(filters, {
 *   defaultDateType: DATE_TYPE.MONTH,
 *   autoUpdateOnDateTypeChange: true
 * })
 * ```
 */
export const useDateRangeFilter = <T extends DateRangeFilterBase>(filters: Ref<T>, options: DateRangeOptions = {}) => {
  // Destructure options with defaults
  const { defaultDateType = DATE_TYPE.MONTH, autoUpdateOnDateTypeChange = true, timezone = TIMEZONE_TYPE.UTC } = options

  // Composables
  const { formatDate } = useDateFormat()

  /**
   * Validates and returns a safe timezone value
   * @param tz - Timezone string to validate
   * @returns Validated TimezoneType
   *
   * @example
   * Input: 'UTC'
   * Output: TIMEZONE_TYPE.UTC
   */
  const validateTimezone = (tz: string): TimezoneType => {
    const validTimezones = Object.values(TIMEZONE_TYPE) as string[]
    if (!validTimezones.includes(tz)) {
      return TIMEZONE_TYPE.UTC
    }
    return tz as TimezoneType
  }

  // Get validated timezone
  const validatedTimezone = validateTimezone(timezone)

  /**
   * Creates a date range object with Unix timestamps
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: new Date('2024-01-01'), new Date('2024-01-31')
   * Output: { fromDateTs: 1704067200, toDateTs: 1706745599 }
   */
  const createDateRange = (startDate: Date, endDate: Date): DateRangeValues => {
    return {
      fromDateTs: toUnixTimestamp(startDate, validatedTimezone, { keepLocalTime: true }),
      toDateTs: toUnixTimestamp(endDate, validatedTimezone, { keepLocalTime: true }),
    }
  }

  /**
   * Get date range for DATE type (single day - today)
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: Current date is 2024-01-15
   * Output: { fromDateTs: 1705276800, toDateTs: 1705363199 } // Start and end of 2024-01-15
   */
  const getDateRangeForDateType = (): DateRangeValues => {
    const startOfDay = getStartOf(getCurrentDate(), DATE_UNITS.DAY).toDate()
    const endOfDay = getEndOf(getCurrentDate(), DATE_UNITS.DAY).toDate()

    return createDateRange(startOfDay, endOfDay)
  }

  /**
   * Get date range for MONTH type (current month)
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: Current date is 2024-01-15
   * Output: { fromDateTs: 1704067200, toDateTs: 1706745599 } // Start and end of January 2024
   */
  const getDateRangeForMonthType = (): DateRangeValues => {
    const startOfMonth = getStartOf(getCurrentDate(), DATE_UNITS.MONTH).toDate()
    const endOfMonth = getEndOf(getCurrentDate(), DATE_UNITS.MONTH).toDate()

    return createDateRange(startOfMonth, endOfMonth)
  }

  /**
   * Get date range for RANGE type (from first day of month to today)
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: Current date is 2024-01-15
   * Output: { fromDateTs: 1704067200, toDateTs: 1705363199 } // From 2024-01-01 to 2024-01-15
   */
  const getDateRangeForRangeType = (): DateRangeValues => {
    const handler = dateRangePresetHandlers[DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY]
    const [startDate, endDate] = handler()

    return createDateRange(startDate, endDate)
  }

  /**
   * Get default date range based on date type
   * @param dateType - The date type to get range for
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: DATE_TYPE.MONTH
   * Output: { fromDateTs: 1704067200, toDateTs: 1706745599 } // Current month range
   */
  const getDefaultDateRange = (dateType: DateType): DateRangeValues => {
    switch (dateType) {
      case DATE_TYPE.DATE:
        return getDateRangeForDateType()
      case DATE_TYPE.MONTH:
        return getDateRangeForMonthType()
      case DATE_TYPE.RANGE:
        return getDateRangeForRangeType()
      default:
        return getDateRangeForDateType()
    }
  }

  /**
   * Update filters with new date range values
   * @param dateRange - New date range values to apply
   *
   * @example
   * updateDateRange({ fromDateTs: 1704067200, toDateTs: 1706745599 })
   */
  const updateDateRange = (dateRange: Partial<DateRangeValues>): void => {
    if (dateRange.fromDateTs !== undefined) {
      filters.value.fromDateTs = dateRange.fromDateTs
    }
    if (dateRange.toDateTs !== undefined) {
      filters.value.toDateTs = dateRange.toDateTs
    }
  }

  /**
   * Initialize filters with default date range for specified date type
   * @param dateType - Date type to initialize with (optional, uses defaultDateType if not provided)
   *
   * @example
   * initializeWithDefaultRange(DATE_TYPE.MONTH)
   */
  const initializeWithDefaultRange = (dateType?: DateType): void => {
    const targetDateType = dateType || defaultDateType
    const dateRange = getDefaultDateRange(targetDateType)

    filters.value.dateType = targetDateType
    updateDateRange(dateRange)
  }

  /**
   * Computed property that formats the current date range as display text
   * Automatically updates when filter dates or dateType changes
   *
   * @returns Formatted date range string
   *
   * @example
   * For DATE_TYPE.DATE: "2024-01-15"
   * For DATE_TYPE.MONTH: "2024-01"
   * For DATE_TYPE.RANGE: "2024-01-01 - 2024-01-15"
   */
  const dateRangeText = computed((): string => {
    if (!filters.value.fromDateTs || !filters.value.toDateTs) {
      return ''
    }

    const fromDate = fromUnixTimestamp(filters.value.fromDateTs)
    const toDate = fromUnixTimestamp(filters.value.toDateTs)

    switch (filters.value.dateType) {
      case DATE_TYPE.DATE:
        return formatDate(fromDate, { timezone: validatedTimezone })

      case DATE_TYPE.MONTH:
        return formatDate(fromDate, {
          format: DATE_FORMATS.MONTH,
          timezone: validatedTimezone,
        })

      case DATE_TYPE.RANGE:
        return `${formatDate(fromDate, { timezone: validatedTimezone })}${DATE_FORMATS.RANGE_SEPARATOR}${formatDate(toDate, { timezone: validatedTimezone })}`

      default:
        return formatDate(fromDate, { timezone: validatedTimezone })
    }
  })

  /**
   * Watch for date type changes and automatically update date range if enabled
   * Only triggers when autoUpdateOnDateTypeChange is true
   */
  const watchDateTypeChanges = (): void => {
    if (!autoUpdateOnDateTypeChange) return

    watch(
      () => filters.value.dateType,
      (newDateType, oldDateType) => {
        if (newDateType !== oldDateType && newDateType) {
          const dateRange = getDefaultDateRange(newDateType)
          updateDateRange(dateRange)
        }
      },
    )
  }

  // Auto-start watching if enabled
  if (autoUpdateOnDateTypeChange) {
    watchDateTypeChanges()
  }

  return {
    // Computed properties
    dateRangeText,

    // Methods for getting date ranges
    getDefaultDateRange,
    getDateRangeForDateType,
    getDateRangeForMonthType,
    getDateRangeForRangeType,

    // Methods for updating filters
    updateDateRange,
    initializeWithDefaultRange,

    // Utility methods
    watchDateTypeChanges,
  }
}
