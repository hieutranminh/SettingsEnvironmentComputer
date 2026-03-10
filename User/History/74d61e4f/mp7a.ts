/**
 * Excel generation constants and configurations
 * Centralized constants for Excel file generation
 */

/**
 * Default Excel worksheet configuration
 */
export const EXCEL_DEFAULTS = {
  COLUMN_WIDTH: 25,
  TITLE_FONT_SIZE: 16,
  SUBTITLE_FONT_SIZE: 14,
  DATE_FONT_SIZE: 14,
  TOTAL_ITEMS_FONT_SIZE: 12,
  BODY_FONT_SIZE: 12,
  SECTION_TITLE_FONT_SIZE: 12,

  DEFAULT_FILENAME: 'export',
  DEFAULT_WORKSHEET_TITLE: 'Export',
  DEFAULT_TITLE_ALIGNMENT: 'left',
  TITLE_COLUMN: 1 as number,
  START_ROW: 1 as number,
} as const

/**
 * Excel cell styling constants
 */
export const EXCEL_STYLES = {
  HEADER_FILL_COLOR: 'FFDCDFE6',
  BORDER_STYLE: 'thin',
  NUMBER_FORMAT: '#,##0',
} as const

/**
 * Canvas to Excel image processing constants
 */
export const EXCEL_IMAGE = {
  SCALE_FACTOR: 2,
  BACKGROUND_COLOR: '#ffffff',
  MAX_WIDTH_BOUND: 1200,
  MIN_WIDTH_BOUND: 800,
  DEFAULT_WIDTH: 800,
  MAX_HEIGHT: 400,
  PIXELS_PER_ROW: 20,
  // Excel column to pixel conversion factor
  // Used to convert Excel column units to pixels (approximation)
  ASPECT_RATIO_CALCULATION_FACTOR: 7,
} as const

/**
 * Excel spacing and layout constants
 */
export const EXCEL_SPACING = {
  HEADER_SPACING: 1,
  SECTION_SPACING: 1,
  TEXT_ELEMENT_SPACING: 1,
} as const

/**
 * Excel header positioning constants
 */
export const EXCEL_HEADER = {
  STARTING_ROW: 1 as number,
  HEADER_COLUMN: 1 as number,
  MIN_COLUMNS_FOR_DATE: 1 as number,
}

/**
 * Excel file format constants
 */
export const EXCEL_FORMAT = {
  EXTENSION: '.xlsx',
  MIME_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const

/**
 * Excel alignment options
 */
export const EXCEL_ALIGNMENT = {
  HORIZONTAL: {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
  },
  VERTICAL: {
    TOP: 'top',
    MIDDLE: 'middle',
    BOTTOM: 'bottom',
  },
} as const

/**
 * Excel font styling constants
 */
export const EXCEL_FONT = {
  BOLD: true,
  ITALIC: true,
  NORMAL: false,
} as const

/**
 * Excel date format patterns
 */
export const EXCEL_DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DD',
  WITH_DAY: 'YYYY-MM-DD (ddd)',
  MONTH_ONLY: 'YYYY-MM',
  FULL: 'YYYY-MM-DD HH:mm:ss',
  PRINT_DATE: 'YYYY-MM-DD (ddd)',
} as const

/**
 * Excel canvas processing constants
 */
export const EXCEL_CANVAS_CONFIG = {
  SCALE: 2,
  USE_CORS: true,
  ALLOW_TAINT: false,
  LOGGING: false,
  BACKGROUND_COLOR: '#ffffff',
} as const

/**
 * Excel table processing constants
 */
export const EXCEL_TABLE_DEFAULTS = {
  START_COLUMN: 1 as number,
  DEFAULT_COLSPAN: 1 as number,
  DEFAULT_ROWSPAN: 1 as number,
} as const
