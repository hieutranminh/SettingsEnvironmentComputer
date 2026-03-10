// ===============================
// NEW CLIENTS REPEAT TABLE CONSTANTS
// ===============================

/**
 * Constants used in NewClientsRepeatTable component
 */
export const NEW_CLIENTS_REPEAT_CONSTANTS = {
  // Staff name constants
  NONE_STAFF_NAME: 'none',

  // Percentage calculation constants
  PERCENTAGE_PRECISION: 2,
  PERCENTAGE_MULTIPLIER: 100,

  // Table styling constants
  TABLE_MIN_WIDTH: '50rem',
  TABLE_SCROLL_HEIGHT: '550px',
} as const

/**
 * Type for the constants to ensure type safety
 */
export type NewClientsRepeatConstants = typeof NEW_CLIENTS_REPEAT_CONSTANTS
