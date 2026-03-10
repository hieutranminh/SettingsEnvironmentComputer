/**
 * Constants for New Clients Repeat Table
 * Centralizes all magic values and configuration
 */

// Calculation constants
export const PERCENTAGE_CALCULATION = {
  PRECISION: 100,
  MULTIPLIER: 100,
} as const

// Display constants
export const DISPLAY_CONFIG = {
  TABLE_HEIGHT: '550px',
  MIN_TABLE_WIDTH: '50rem',
  EMPTY_DATA_PADDING: '2rem',
} as const

// Staff name constants
export const STAFF_CONFIG = {
  NONE_IDENTIFIER: 'none',
  NO_INPUT_FALLBACK_KEY: 'general.label-no-input',
} as const

// Date format constants
export const DATE_FORMAT = {
  YEAR_SLICE_START: 0,
  YEAR_SLICE_END: 4,
  MONTH_SLICE_START: 4,
  MONTH_SLICE_END: 6,
  MONTH_DISPLAY_SLICE: -2,
} as const
