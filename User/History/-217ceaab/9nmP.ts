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

// Default configurations (all units in pt)
export const DEFAULT_PRINT_CONFIG = {
  // A4 dimensions in pt (595.28 x 841.89)
  PAGE: {
    A4: {
      width: 595.28,
      height: 841.89,
    },
    A3: {
      width: 841.89,
      height: 1190.55,
    },
  },

  // Default margins (pt)
  MARGINS: {
    TOP: 72, // 0.5 inch
    BOTTOM: 36, // 0.5 inch
    LEFT: 36, // 0.5 inch
    RIGHT: 36, // 0.5 inch
  },

  // Default spacing (pt)
  SPACING: {
    SECTION: 18, // 0.25 inch
    LINE: 14, // ~0.2 inch
    HEADER: 24, // 0.33 inch
  },

  // Default font settings
  FONT: {
    FAMILY: 'NanumGothic-Regular',
    SIZE: {
      TITLE: 24, // pt
      SUBTITLE: 14, // pt
      BODY: 12, // pt
      SMALL: 10, // pt
    },
    COLOR: '#000000',
  },

  // Default header configuration
  HEADER: {
    TITLE_SIZE: 28, // pt
    SUBTITLE_SIZE: 14, // pt
    DATE_SIZE: 14, // pt
    SHOW_CURRENT_DATE: true,
    SHOW_PAGE_NUMBER: true,
  },
} as const

// Utility function to convert mm to pt
export const mmToPt = (mm: number): number => {
  return mm * 2.83465
}

// Utility function to convert pt to mm
export const ptToMm = (pt: number): number => {
  return pt / 2.83465
}
