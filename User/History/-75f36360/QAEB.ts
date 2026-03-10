import { ref, computed, type Ref } from 'vue'

// Composables
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  DATE_RANGE_PRESETS,
  DATE_UNITS,
  STANDARD_DATE_FORMAT,
  type DateType,
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
  validateToDateNotBeforeFromDate,
  type TimezoneType,
} from '@/utils/dateUtils'

export interface IDateRangeFilterBase {
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
export interface ISavedDateRangeOptions {
  /** Default date type to use */
  defaultDateType?: DateType
  /** Custom timezone to use (defaults to UTC) */
  timezone?: string
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
}

export interface IUseSavedDateRangeFilterReturn {
  /** Saved filters that represent the last successful fetch */
  savedFilters: Ref<IDateRangeFilterBase>
  /** Display text based on saved filters (not reactive to current filters) */
  dateRangeText: Ref<string>
  /** Save current filters as the new saved state */
  saveCurrentFilters: (currentFilters: IDateRangeFilterBase) => void
  /** Get default date range based on date type */
  getDefaultDateRange: (dateType: DateType) => IDateRangeValues
  /** Initialize saved filters with default values */
  initializeSavedFilters: (dateType?: DateType) => void
  /** Validate date range based on saved filters */
  validateSavedDateRange: (options: IDateRangeValidationOptions) => IDateRangeValidationResult
}

/**
 * Composable for managing saved date range filtering logic
 * Provides saved state and methods for handling date ranges that only update when data is fetched
 *
 * @param options - Configuration options for date range behavior
 * @returns Object containing saved state and methods for date range operations
 *
 * @example
 * ```typescript
 * const {
 *   savedFilters,
 *   dateRangeText,
 *   saveCurrentFilters,
 *   initializeSavedFilters
 * } = useSavedDateRangeFilter({
 *   defaultDateType: DATE_TYPE.MONTH,
 *   timezone: TIMEZONE_TYPE.UTC
 * })
 *
 * // Save filters after successful fetch
 * saveCurrentFilters(currentFilters)
 * ```
 */
export const useSavedDateRangeFilter = (
  options: ISavedDateRangeOptions = {},
): IUseSavedDateRangeFilterReturn => {
  // Destructure options with defaults
  const { defaultDateType = DATE_TYPE.DATE, timezone = TIMEZONE_TYPE.UTC } = options

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

  // Saved filters state (only updated when data is fetched)
  const savedFilters = ref<IDateRangeFilterBase>({
    dateType: defaultDateType,
    fromDateTs: 0,
    toDateTs: 0,
  })

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
   * Get date range for DATE type (single day - today)
   * @returns Date range object with fromDateTs and toDateTs
   *
   * @example
   * Input: Current date is 2024-01-15
   * Output: { fromDateTs: 1705276800, toDateTs: 1705363199 } // Start and end of 2024-01-15
   */
  const getDateRangeForDateType = (): IDateRangeValues => {
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
  const getDateRangeForMonthType = (): IDateRangeValues => {
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
  const getDateRangeForRangeType = (): IDateRangeValues => {
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
  const getDefaultDateRange = (dateType: DateType): IDateRangeValues => {
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
   * Save current filters as the new saved state
   * This should be called after successful data fetch
   * @param currentFilters - Current filter values to save
   *
   * @example
   * // After successful fetch
   * saveCurrentFilters(filters.value)
   */
  const saveCurrentFilters = (currentFilters: IDateRangeFilterBase): void => {
    savedFilters.value = {
      dateType: currentFilters.dateType,
      fromDateTs: currentFilters.fromDateTs,
      toDateTs: currentFilters.toDateTs,
    }
  }

  /**
   * Initialize saved filters with default date range for specified date type
   * @param dateType - Date type to initialize with (optional, uses defaultDateType if not provided)
   *
   * @example
   * initializeSavedFilters(DATE_TYPE.MONTH)
   */
  const initializeSavedFilters = (dateType?: DateType): void => {
    const targetDateType = dateType ?? defaultDateType
    const dateRange = getDefaultDateRange(targetDateType)

    savedFilters.value = {
      dateType: targetDateType,
      fromDateTs: dateRange.fromDateTs,
      toDateTs: dateRange.toDateTs,
    }
  }

  /**
   * Computed property that formats the saved date range as display text
   * Only updates when savedFilters changes (after successful fetch)
   *
   * @returns Formatted date range string based on saved filters
   *
   * @example
   * For DATE_TYPE.DATE: "2024-01-15"
   * For DATE_TYPE.MONTH: "2024-01"
   * For DATE_TYPE.RANGE: "2024-01-01 - 2024-01-15"
   */
  const dateRangeText = computed((): string => {
    if (!savedFilters.value.fromDateTs || !savedFilters.value.toDateTs) {
      return ''
    }

    const fromDate = fromUnixTimestamp(savedFilters.value.fromDateTs)
    const toDate = fromUnixTimestamp(savedFilters.value.toDateTs)

    switch (savedFilters.value.dateType) {
      case DATE_TYPE.DATE:
        return formatDate(fromDate, { timezone: validatedTimezone })

      case DATE_TYPE.MONTH:
        return formatDate(fromDate, {
          format: STANDARD_DATE_FORMAT.YM,
          timezone: validatedTimezone,
        })

      case DATE_TYPE.RANGE:
        return `${formatDate(fromDate, { timezone: validatedTimezone })} - ${formatDate(toDate, { timezone: validatedTimezone })}`

      default:
        return formatDate(fromDate, { timezone: validatedTimezone })
    }
  })

  /**
   * Validate saved date range based on specified options
   * @param options - Validation options to specify which checks to perform
   * @returns Validation result with isValid flag and error information
   *
   * @example
   * ```typescript
   * const result = validateSavedDateRange({
   *   checkToDateNotBeforeFromDate: true,
   *   checkExceedOneMonthRange: true
   * })
   *
   * if (!result.isValid) {
   *   console.log(`Validation failed: ${result.errorKey}`)
   * }
   * ```
   */
  const validateSavedDateRange = (
    options: IDateRangeValidationOptions = {},
  ): IDateRangeValidationResult => {
    const { checkToDateNotBeforeFromDate = true, checkExceedOneMonthRange = true } = options

    if (!savedFilters.value.fromDateTs || !savedFilters.value.toDateTs) {
      return {
        isValid: false,
        errorKey: 'general.validate-date-range-required',
      }
    }

    const fromDate = fromUnixTimestamp(savedFilters.value.fromDateTs)
    const toDate = fromUnixTimestamp(savedFilters.value.toDateTs)

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

    return { isValid: true }
  }

  return {
    // State
    savedFilters,
    dateRangeText,

    // Methods for managing saved state
    saveCurrentFilters,
    initializeSavedFilters,

    // Utility methods
    getDefaultDateRange,
    validateSavedDateRange,
  }
}
