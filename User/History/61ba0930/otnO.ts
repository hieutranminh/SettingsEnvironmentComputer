/**
 * Table configuration constants
 * Centralized constants for table components to avoid hardcoding
 */

export const TABLE_BRANCH_SALES = {
  SCROLL_HEIGHT: '600px',
  MIN_WIDTH: '100rem',
} as const

export const COLUMN_ALIGNMENT = {
  FIRST_COLUMN: 'center',
  OTHER_COLUMNS: 'right',
  HEADER_COLUMNS: 'center',
} as const

export const COLUMN_INDEX = {
  FIRST: 0,
} as const

export const TABLE_SECTIONS = {
  HEAD: 'head',
  BODY: 'body',
  FOOTER: 'foot',
} as const
