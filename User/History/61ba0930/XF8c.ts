/**
 * Table configuration constants
 * Centralized constants for table components to avoid hardcoding
 */

export const TABLE_GOODS_PRODUCTS = {
  SCROLL_HEIGHT: '550px',
  MIN_WIDTH: '100rem',
} as const

export const TABLE_BRANCH_SALES = {
  SCROLL_HEIGHT: '600px',
  MIN_WIDTH: '100rem',
} as const

export const COLUMN_ALIGNMENT = {
  FIRST_COLUMN: 'center',
  OTHER_COLUMNS: 'right',
  HEADER_COLUMNS: 'center',
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
} as const

// Table column index starts from 0
export const COLUMN_INDEX = {
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
  FOURTH: 3,
  FIFTH: 4,
  SIXTH: 5,
  SEVENTH: 6,
  EIGHTH: 7,
  NINTH: 8,
  TENTH: 9,
  ELEVENTH: 10,
  TWELFTH: 11,
  THIRTEENTH: 12,
  FOURTEENTH: 13,
  FIFTEENTH: 14,
  SIXTEENTH: 15,
  SEVENTEENTH: 16,
  EIGHTEENTH: 17,
  NINETEENTH: 18,
  TWENTIETH: 19,
  TWENTY_FIRST: 20,
} as const

// Excel column index starts from 1
export const COLUMN_EXCEL = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
  FIFTH: 5,
  SIXTH: 6,
  SEVENTH: 7,
  EIGHTH: 8,
  NINTH: 9,
  TENTH: 10,
  ELEVENTH: 11,
  TWELFTH: 12,
  THIRTEENTH: 13,
  FOURTEENTH: 14,
  FIFTEENTH: 15,
  SIXTEENTH: 16,
  SEVENTEENTH: 17,
  EIGHTEENTH: 18,
  NINETEENTH: 19,
  TWENTIETH: 20,
} as const

export const TABLE_SECTIONS = {
  HEAD: 'head',
  BODY: 'body',
  FOOTER: 'foot',
} as const
