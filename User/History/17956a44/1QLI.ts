/**
 * Filter-related constants for form components
 * Centralizes hardcoded values used across filter components
 */
export const FILTER_CONSTANTS = {
  /** Maximum number of labels to show in MultiSelect before showing "X more" */
  MAX_SELECTED_LABELS: 1,
  
  /** Height of dropdown scroll area in MultiSelect */
  SCROLL_HEIGHT: '350px',
  
  /** Minimum width for form input elements */
  MIN_INPUT_WIDTH: '200px',
  
  /** Fixed width for action buttons */
  BUTTON_WIDTH: '120px',
  
  /** Gap between form elements */
  FORM_GAP: '1rem',
  
  /** Gap between form items */
  ITEM_GAP: '0.5rem',
} as const

/**
 * Filter validation constants
 */
export const FILTER_VALIDATION = {
  /** Minimum date range in days for range type filters */
  MIN_DATE_RANGE_DAYS: 1,
  
  /** Maximum date range in days for range type filters */
  MAX_DATE_RANGE_DAYS: 365,
} as const
