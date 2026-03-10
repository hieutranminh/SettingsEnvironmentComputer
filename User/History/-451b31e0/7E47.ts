/**
 * Print and PDF generation constants
 * Extracted from print-preview.store.ts to eliminate hardcoding
 */

// PDF Page Layout Constants
export const PDF_LAYOUT = {
  MARGINS: {
    DEFAULT: 30,
    BOTTOM: 40,
    LEFT: 30,
    RIGHT: 30,
  },
  SPACING: {
    HEADER_TOP: 50,
    BETWEEN_SECTIONS: 20,
    AFTER_TITLE: 25,
    AFTER_SUBTITLE: 20,
    AFTER_DATE: 15,
    LINE_HEIGHT: 15,
  },
  FOOTER: {
    POSITION_FROM_BOTTOM: 20,
    MIN_SPACE_FOR_TABLE: 50,
  },
} as const

// Font Configuration
export const PDF_FONTS = {
  SIZES: {
    TITLE: 28,
    SUBTITLE: 14,
    DATE: 14,
    TOTAL_ITEMS: 12,
    PAGE_NUMBER: 12,
    TABLE_CONTENT: 12,
  },
  STYLES: {
    TITLE: 'bold',
    SUBTITLE: 'normal',
    DATE: 'normal',
    TOTAL_ITEMS: 'normal',
    PAGE_NUMBER: 'normal',
  },
} as const

// Color Scheme
export const PDF_COLORS = {
  TABLE: {
    HEADER_BACKGROUND: '#DCDFE6',
    HEADER_TEXT: '#000',
    FOOTER_BACKGROUND: '#DCDFE6',
    BORDER: '#000',
  },
  TEXT: {
    DEFAULT: '#000',
    ERROR_PLACEHOLDER: '#666666',
  },
} as const

// Canvas Processing Configuration
export const CANVAS_CONFIG = {
  // Canvas takes up to 90% of the page width
  MAX_WIDTH_RATIO: 0.9,
  // Canvas takes up to 70% of the page height
  MAX_HEIGHT_RATIO: 0.7,
  // Minimum height required on the current page
  MIN_HEIGHT_FOR_CURRENT_PAGE: 100,
  PADDING: 20,
  // html2canvas scale
  SCALE: 1,
  // Quality settings
  HTML2CANVAS: {
    SCALE: 2,
    USE_CORS: true,
    ALLOW_TAINT: true,
    LOGGING: false,
    BACKGROUND_COLOR: '#ffffff',
  },
  // Pixel to point conversion (pt = 3/4 * px)
  PIXEL_TO_POINT_RATIO: 3 / 4,
} as const

// Excel Configuration
export const EXCEL_CONFIG = {
  DEFAULT_COLUMN_WIDTH: 25,
  IMAGE: {
    MIN_WIDTH: 800,
    MAX_WIDTH: 1200,
    MAX_HEIGHT: 400,
    WIDTH_MULTIPLIER: 7, // Excel column units to pixels
    ROWS_PER_PIXEL: 20, // Estimate: 1 Excel row ~ 20 pixels
  },
  FONTS: {
    TITLE_SIZE: 16,
    SUBTITLE_SIZE: 14,
    DATE_SIZE: 14,
    TOTAL_SIZE: 12,
    CONTENT_SIZE: 12,
  },
  COLORS: {
    HEADER_BACKGROUND: 'FFDCDFE6',
    ERROR_TEXT: 'FF666666',
  },
} as const

// Table Configuration
export const TABLE_CONFIG = {
  STYLES: {
    THEME: 'grid',
    MIN_CELL_HEIGHT: 24,
    LINE_WIDTH: 1,
  },
  ROW_HEIGHT_ESTIMATE: 12, // pt per row
  SHOW_FOOT: 'lastPage',
  ROW_PAGE_BREAK: 'avoid',
  TABLE_WIDTH: 'auto',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  FAILED_TO_OPEN_PREVIEW: 'Failed to open print preview',
  FAILED_TO_GENERATE_PDF: 'Failed to generate PDF',
  FAILED_TO_PROCESS_TABLE: 'Failed to process table section',
  FAILED_TO_PROCESS_CANVAS: 'Failed to process canvas section',
  FAILED_TO_PROCESS_TEXT: 'Failed to process text section',
  FAILED_TO_GENERATE_EXCEL: 'Failed to generate Excel file',
  UNKNOWN_ERROR: 'Unknown error',
} as const

// File Extensions and MIME Types
export const FILE_TYPES = {
  PDF: {
    EXTENSION: '.pdf',
    MIME_TYPE: 'application/pdf',
  },
  EXCEL: {
    EXTENSION: '.xlsx',
    MIME_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  IMAGE: {
    JPEG: 'JPEG',
    PNG: 'png',
  },
} as const

// Alignment Options
export const ALIGNMENT_OPTIONS = {
  HORIZONTAL: {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
    JUSTIFY: 'justify',
  },
  VERTICAL: {
    TOP: 'top',
    MIDDLE: 'middle',
    BOTTOM: 'bottom',
  },
} as const

// Page Configuration
export const PAGE_CONFIG = {
  FORMAT: 'a4',
  UNIT: 'pt',
  ORIENTATIONS: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
  },
} as const

// Date Pattern Recognition
export const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  /^\d{4}-\d{2}$/, // YYYY-MM
] as const

// Rich Text HTML Tags
export const HTML_TAGS = {
  BOLD: ['b', 'strong'],
  ITALIC: ['i', 'em'],
  HTML_REGEX: /<(\/?)([bi]|strong|em)>/gi,
  TAG_REGEX: /<[^>]*>/g,
} as const

// Cell Tracker Configuration
export const CELL_TRACKER = {
  DEFAULT_COLSPAN: 1,
  DEFAULT_ROWSPAN: 1,
  CELL_SEPARATOR: '-',
} as const

// Performance and Limits
export const PERFORMANCE_LIMITS = {
  MAX_COLUMN_WIDTH: 25,
  MIN_COLUMN_WIDTH: 10,
  COLUMN_WIDTH_PADDING: 2,
} as const
