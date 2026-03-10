/**
 * Print dimension constants for PDF and Excel generation
 * All measurements are in points (pt) unless specified
 */

/**
 * Standard page dimensions in points
 * 1 inch = 72 points
 */
export const PAGE_DIMENSIONS = {
  A4: {
    PORTRAIT: {
      WIDTH: 595.28, // 210mm
      HEIGHT: 841.89, // 297mm
    },
    LANDSCAPE: {
      WIDTH: 841.89,
      HEIGHT: 595.28,
    },
  },
} as const

export const PDF_LAYOUT_CONSTANTS = {
  INITIAL_Y_POSITION: 50,
} as const

/**
 * Document margins and spacing
 */
export const SPACING = {
  // Document margins
  MARGIN: {
    TOP: 50,
    BOTTOM: 40,
    LEFT: 30,
    RIGHT: 30,
  },
  // Section spacing
  SECTION: {
    BETWEEN: 20, // Space between sections
    AFTER_TITLE: 12, // Space after section title
    AFTER_HEADER: 15, // Space after document header
  },
  // Text spacing
  TEXT: {
    LINE_HEIGHT: 15,
    PARAGRAPH: 5, // Space between paragraphs
  },
  // Page numbering
  FOOTER: {
    FROM_BOTTOM: 20, // Distance from bottom of page
  },
} as const

/**
 * Canvas rendering configuration
 */
export const CANVAS_CONFIG = {
  MAX_WIDTH_RATIO: 0.9, // Canvas takes up to 90% of page width
  MAX_HEIGHT_RATIO: 0.7, // Canvas takes up to 70% of page height
  MIN_HEIGHT_FOR_CURRENT_PAGE: 100, // Minimum height required on current page
  PADDING: 20,
  HTML2CANVAS_SCALE: 2, // Scale for high quality rendering
} as const

/**
 * Table configuration
 */
export const TABLE_CONFIG = {
  MIN_CELL_HEIGHT: 24,
  ROW_HEIGHT_ESTIMATE: 12, // Estimated height per row in points
  MIN_SPACE_FOR_TABLE: 50, // Minimum space needed to start a table
} as const

/**
 * Excel specific dimensions
 */
export const EXCEL_DIMENSIONS = {
  DEFAULT_COLUMN_WIDTH: 25,
  MIN_COLUMN_WIDTH: 10,
  MAX_COLUMN_WIDTH: 25,
  COLUMN_WIDTH_PADDING: 2,
  ROW_HEIGHT_PIXELS: 20, // Approximate Excel row height in pixels
  IMAGE: {
    MIN_WIDTH: 800,
    MAX_WIDTH: 1200,
    MAX_HEIGHT: 400,
  },
  COLUMN_TO_PIXEL_FACTOR: 7, // Conversion factor from Excel column units to pixels
} as const

/**
 * Font sizes in points
 */
export const FONT_SIZES = {
  TITLE: 28,
  SUBTITLE: 14,
  BODY: 12,
  FOOTER: 12,
  TABLE_HEADER: 12,
} as const
