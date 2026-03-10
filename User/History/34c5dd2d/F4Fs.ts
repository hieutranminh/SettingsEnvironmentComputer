/**
 * File format and MIME type constants
 */

/**
 * Supported file formats for export
 */
export const FILE_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'xlsx',
  IMAGE: 'png',
} as const

/**
 * MIME types for different file formats
 */
export const MIME_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
} as const

/**
 * Image format configurations
 */
export const IMAGE_FORMATS = {
  PNG: {
    extension: 'png',
    mimeType: MIME_TYPES.PNG,
    dataUrlPrefix: 'data:image/png;base64,',
  },
  JPEG: {
    extension: 'jpeg',
    mimeType: MIME_TYPES.JPEG,
    dataUrlPrefix: 'data:image/jpeg;base64,',
    quality: 0.95,
  },
} as const

/**
 * Date format patterns
 */
export const DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DD',
  WITH_DAY: 'YYYY-MM-DD (ddd)',
  MONTH_ONLY: 'YYYY-MM',
  FULL: 'YYYY-MM-DD HH:mm:ss',
} as const

/**
 * Regular expressions for date pattern detection
 */
export const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  /^\d{4}-\d{2}$/, // YYYY-MM
] as const

/**
 * PDF document formats
 */
export const PDF_FORMATS = {
  A4: 'a4',
  A3: 'a3',
  LETTER: 'letter',
  LEGAL: 'legal',
} as const

/**
 * PDF units of measurement
 */
export const PDF_UNITS = {
  PT: 'pt', // Points (default)
  MM: 'mm', // Millimeters
  CM: 'cm', // Centimeters
  IN: 'in', // Inches
} as const

/**
 * PDF orientations
 */
export const PDF_ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const

/**
 * jsPDF AutoTable specific formats
 */
export const AUTOTABLE_OPTIONS = {
  THEME: {
    PLAIN: 'plain',
    GRID: 'grid',
    STRIPED: 'striped',
  },
  SHOW_FOOT: {
    NEVER: 'never',
    LAST_PAGE: 'lastPage',
    EVERY_PAGE: 'everyPage',
  },
  ROW_PAGE_BREAK: {
    AUTO: 'auto',
    AVOID: 'avoid',
  },
  TABLE_WIDTH: {
    AUTO: 'auto',
    WRAP: 'wrap',
  },
} as const
