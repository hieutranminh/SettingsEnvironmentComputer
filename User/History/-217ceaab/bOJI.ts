export const PRINT_PREVIEW_WORKER_ACTIONS = {
  BRANCH_SALES: 'BRANCH_SALES',
  PREPAID_CARDS_BY_CLIENTS: 'PREPAID_CARDS_BY_CLIENTS',
  PREPAID_CARD_SUMMARY: 'PREPAID_CARD_SUMMARY',
  PREPAID_SERVICES_BY_CLIENT: 'PREPAID_SERVICES_BY_CLIENT',
  LOYALTY_POINTS_BY_CLIENT: 'LOYALTY_POINTS_BY_CLIENT',
  BOOKING_LIST_CALENDAR: 'BOOKING_LIST_CALENDAR',
  SALES_HISTORY: 'SALES_HISTORY',
  BOOKING_DEPOSIT_LIST: 'BOOKING_DEPOSIT_LIST',
  STAFF_MISMATCH_HISTORY: 'STAFF_MISMATCH_HISTORY',
  SALES_TRANSFER_HISTORY: 'SALES_TRANSFER_HISTORY',
  PREPAID_GOODS_SALES: 'PREPAID_GOODS_SALES',
  STOCK_INTERNAL_USE: 'STOCK_INTERNAL_USE',
  STOCK_ADJUSTMENT: 'STOCK_ADJUSTMENT',
  STOCK_HISTORY: 'STOCK_HISTORY',
  STOCK_STATUS: 'STOCK_STATUS',
  RECEIVINGS: 'RECEIVINGS',
  BOOKING_DEPOSIT_BEFORE_PAYMENT: 'BOOKING_DEPOSIT_BEFORE_PAYMENT',
  BOOKING_DEPOSIT_PAYMENT_HISTORY: 'BOOKING_DEPOSIT_PAYMENT_HISTORY',
  BOOKING_LIST_CALENDAR_V2: 'BOOKING_LIST_CALENDAR_V2',
  TIME_CLOCK: 'TIME_CLOCK',
  SALES_TRANSFER_STAFF_HISTORY: 'SALES_TRANSFER_STAFF_HISTORY',
  PREPAID_SERVICES_SUMMARY: 'PREPAID_SERVICES_SUMMARY',
  PRODUCTS: 'PRODUCTS',
} as const

export const PRINT_PREVIEW_CONFIG = {
  // Page dimensions based on A4 standard (unit: pt)
  // A4: 595.28 x 841.89 pt
  PAGE_WIDTH: 595.28,
  PAGE_HEIGHT: 841.89,

  // Page margin (unit: pt)
  MARGIN: {
    TOP: 45.35, // ~16mm
    BOTTOM: 45.35, // ~16mm
    LEFT: 34.02, // ~12mm
    RIGHT: 34.02, // ~12mm
  },

  // Inner padding for each section (unit: pt)
  PADDING: {
    SECTION: 22.68, // ~8mm
    HEADER: 22.68, // ~8mm
    FOOTER: 22.68, // ~8mm
  },

  // Fixed sizes for common elements (unit: pt)
  SIZE: {
    HEADER_HEIGHT: 113.39, // ~40mm
    FOOTER_HEIGHT: 85.04, // ~30mm
    SECTION_SPACING: 34.02, // ~12mm - Spacing between sections
    LINE_HEIGHT: 1.5, // For text rendering
  },

  // Default font settings for print
  FONT: {
    FAMILY: 'NanumGothic-Regular',
    SIZE: 12, // pt
    COLOR: '#000000',
  },

  // Paper settings
  PAPER: {
    SIZE: 'A4',
    ORIENTATION: 'portrait', // or 'landscape'
    UNIT: 'pt',
  },
} as const

// Header customization constants
export const HEADER_CONFIG = {
  // Default font sizes (pt)
  FONT_SIZE: {
    TITLE: 28,
    SUBTITLE: 14,
    DATE: 14,
    CURRENT_DATE: 14,
  },
  
  // Default font families
  FONT_FAMILY: {
    TITLE: 'NanumGothic-ExtraBold',
    SUBTITLE: 'NanumGothic-Regular',
    DATE: 'NanumGothic-Regular',
    CURRENT_DATE: 'NanumGothic-Regular',
  },
  
  // Default spacing (pt)
  SPACING: {
    TITLE_TO_SUBTITLE: 22.68, // ~8mm
    SUBTITLE_TO_DATE: 22.68, // ~8mm
    DATE_TO_CONTENT: 22.68, // ~8mm
  },
} as const

// Fake data constants for development/testing
export const FAKE_DATA_CONFIG = {
  BRANCH_SALES: {
    DEFAULT_RECORD_COUNT: 5,
    BRANCH_NAMES: ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E'],
    MIN_SALES: 100,
    MAX_SALES: 300,
    MIN_QUANTITY: 300,
    MAX_QUANTITY: 800,
    MIN_AMOUNT: 10000000,
    MAX_AMOUNT: 30000000,
  },
} as const
