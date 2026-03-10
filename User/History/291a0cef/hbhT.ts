/**
 * PDF Formatting Constants
 * File formats, orientations, and document configuration
 */

/**
 * PDF document formats
 */
export const PDF_DOCUMENT_FORMATS = {
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
 * PDF page orientations
 */
export const PDF_ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const

/**
 * PDF image formats
 */
export const PDF_IMAGE_FORMATS = {
  JPEG: 'JPEG',
  PNG: 'PNG',
} as const

/**
 * PDF date format patterns
 */
export const PDF_DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DD',
  WITH_DAY: 'YYYY-MM-DD (ddd)',
  MONTH_ONLY: 'YYYY-MM',
  FULL: 'YYYY-MM-DD HH:mm:ss',
  PRINT_DATE: 'YYYY-MM-DD (ddd)',
} as const

/**
 * PDF AutoTable specific options
 */
export const PDF_AUTOTABLE_OPTIONS = {
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

/**
 * PDF supported HTML tags for rich text
 */
export const PDF_SUPPORTED_HTML_TAGS = {
  BOLD: ['b', 'strong'] as const,
  ITALIC: ['i', 'em'] as const,
} as const
