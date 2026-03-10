import { computed, type ComputedRef, type Ref } from 'vue'

// Constants
import {
  TIMEZONE_TYPE,
  DATE_RANGE_PRESETS,
  DATE_UNITS,
  type DateType,
  DATE_RANGE_MODE,
} from '@/constants'
// Utils
import {
  getStartOf,
  getEndOf,
  getCurrentDate,
  toUnixTimestamp,
  fromUnixTimestamp,
  dateRangePresetHandlers,
  validateExceedOneMonthRange,
  validateExceedOneYearRange,
  validateToDateNotBeforeFromDate,
  type TimezoneType,
} from '@/utils/dateUtils'
import type { DateRangeMode } from '@/types/Common'

export interface IDateRangeBase {
  /** Start date as Unix timestamp */
  fromDateTs: number

  /** End date as Unix timestamp */
  toDateTs: number
}

/**
 * Interface for date range configuration options
 */
export interface IDateRangeOptions {
  /** Custom timezone to use (defaults to UTC) */
  timezone?: string
  /** Saved filters to use (defaults to null) */
  savedFilters?: Ref<IDateRangeBase | null>
  /** Mode to use (defaults to date) */
  mode?: DateRangeMode
}

/**
 * Interface for date range values returned by the composable
 */
export interface IDateRangeValues {
  fromDateTs: number
  toDateTs: number
}

/**
 * Interface for validation result
 */
export interface IDateRangeValidationResult {
  /** Whether the date range is valid */
  isValid: boolean
  /** Error message key if validation fails */
  errorKey?: string
}

/**
 * Interface for validation options
 */
export interface IDateRangeValidationOptions {
  /** Whether to check if to date is before from date */
  checkToDateNotBeforeFromDate?: boolean
  /** Whether to check if date range exceeds one month */
  checkExceedOneMonthRange?: boolean
  /** Whether to check if date range exceeds one year */
  checkExceedOneYearRange?: boolean
}

export interface IUseDateRangeReturn {
  dateRangeText: ComputedRef<string>
  getDefaultDateRange: (dateType: DateType) => IDateRangeValues
  getDateRangeForMonth: () => IDateRangeValues
  getDateRangeForData: () => IDateRangeValues
  updateDateRange: (dateRange: Partial<IDateRangeValues>) => void
  initializeWithDefaultRange: (dateType?: DateType) => void
  validateDateRange: (options: IDateRangeValidationOptions) => IDateRangeValidationResult
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
 * } = useDateRange(filters, {
 * })
 * ```
 */
export const useDateRange = <T extends IDateRangeBase>(
  filters: Ref<T>,
  options: IDateRangeOptions = {},
): IUseDateRangeReturn => {
  // Destructure options with defaults
  const { timezone = TIMEZONE_TYPE.UTC, mode = DATE_RANGE_MODE.DATE, savedFilters } = options

  // Composables
  // const { formatDate } = useDateFormat()

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
  const createDateRange = (startDate: Date, endDate: Date): IDateRangeValues => {
    return {
      fromDateTs: toUnixTimestamp(startDate, validatedTimezone, { keepLocalTime: true }),
      toDateTs: toUnixTimestamp(endDate, validatedTimezone, { keepLocalTime: true }),
    }
  }

  /**
   * Get date range for MONTH type (current month)
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: Current date is 2024-01-15
   * Output: { fromDateTs: 1704067200, toDateTs: 1706745599 } // Start and end of January 2024
   */
  const getDateRangeForMonth = (): IDateRangeValues => {
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
  const getDateRangeForData = (): IDateRangeValues => {
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
   * Output: { fromDateTs: 1704067200, toDateTs: 1706745599 } // Current month range
   */
  const getDefaultDateRange = (mode: DateRangeMode): IDateRangeValues => {
    console.log('mode', mode)
    return getDateRangeForMonth()
  }

  /**
   * Update filters with new date range values
   * @param dateRange - New date range values to apply
   *
   * @example
   * updateDateRange({ fromDateTs: 1704067200, toDateTs: 1706745599 })
   */
  const updateDateRange = (dateRange: Partial<IDateRangeValues>): void => {
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
  const initializeWithDefaultRange = (): void => {
    const dateRange = getDefaultDateRange(mode)
    updateDateRange(dateRange)
    // const filterData = ref<{
    //   fromDate: DateValue
    //   toDate: DateValue
    // }>({
    //   fromDate: props.modelValue.fromDateTs
    //     ? fromUnixTimestamp(props.modelValue.fromDateTs).toDate()
    //     : new Date(),
    //   toDate: props.modelValue.toDateTs
    //     ? fromUnixTimestamp(props.modelValue.toDateTs).subtract(1, 'day').toDate()
    //     : new Date(),
    // })
    // const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
    // const endOfDay = getEndOf(getCurrentDate(), 'day').toDate()
    // const filters = ref<ISalesByDateFilterInterface>({
    //   shopId: 0,
    //   headquarterShopId: shop.shopId,
    //   prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD,
    //   fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    //   toDateTs: toUnixTimestamp(endOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    //   isHeadquarterView: true,
    // })
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
    // If saved filters are provided, use them, otherwise use the filters
    const savedFiltersValue = savedFilters?.value ?? filters.value
    if (!savedFiltersValue.fromDateTs || !savedFiltersValue.toDateTs) {
      return ''
    }

    return 'example'
  })

  /**
   * Validate date range based on specified options
   * @param options - Validation options to specify which checks to perform
   * @returns Validation result with isValid flag and error information
   *
   * @example
   * ```typescript
   * const result = validateDateRange({
   *   checkToDateNotBeforeFromDate: true,
   *   checkExceedOneMonthRange: true
   * })
   *
   * if (!result.isValid) {
   *   console.log(`Validation failed: ${result.errorKey}`)
   * }
   * ```
   */
  const validateDateRange = (
    options: IDateRangeValidationOptions = {},
  ): IDateRangeValidationResult => {
    const {
      checkToDateNotBeforeFromDate = false,
      checkExceedOneMonthRange = false,
      checkExceedOneYearRange = false,
    } = options

    if (!filters.value.fromDateTs || !filters.value.toDateTs) {
      return {
        isValid: false,
        errorKey: 'general.validate-date-range-required',
      }
    }

    const fromDate = fromUnixTimestamp(filters.value.fromDateTs)
    const toDate = fromUnixTimestamp(filters.value.toDateTs)

    // Check if to date is before from date
    if (checkToDateNotBeforeFromDate && validateToDateNotBeforeFromDate(fromDate, toDate)) {
      return {
        isValid: false,
        errorKey: 'general.validate-date-range-not-before-from-date',
      }
    }

    // Check if date range exceeds one month
    if (checkExceedOneMonthRange && validateExceedOneMonthRange(fromDate, toDate)) {
      return {
        isValid: false,
        errorKey: 'general.validate-date-range-exceed-one-month',
      }
    }

    // Check if date range exceeds one year
    if (checkExceedOneYearRange && validateExceedOneYearRange(fromDate, toDate)) {
      return {
        isValid: false,
        errorKey: 'general.validate-date-range-exceed-one-year',
      }
    }

    return { isValid: true }
  }

  return {
    // Computed properties
    dateRangeText,

    // Methods for getting date ranges
    getDefaultDateRange,
    getDateRangeForMonth,
    getDateRangeForData,

    // Methods for updating filters
    updateDateRange,
    initializeWithDefaultRange,

    // Validation methods
    validateDateRange,
  }
}
