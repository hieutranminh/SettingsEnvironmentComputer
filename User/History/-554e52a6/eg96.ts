export const PDF_CONSTANTS = {
  SPACING: {
    HEADER_START_Y: 50,
    TITLE_LINE_HEIGHT: 25,
    SUBTITLE_LINE_HEIGHT: 20,
    DATE_LINE_HEIGHT: 20,
    TOTAL_LINE_HEIGHT: 15,
    SECTION_SPACING: 20,
    TABLE_TITLE_SPACING: 12,
    TEXT_ELEMENT_SPACING: 5,
    TEXT_LINE_HEIGHT: 15,
  },

  MARGINS: {
    DOCUMENT: 30,
    PAGE_BOTTOM: 40,
    PAGE_NUMBER_FROM_BOTTOM: 20,
    RIGHT_SIDE: 30,
  },

  FONT_SIZES: {
    TITLE: 28,
    SUBTITLE: 14,
    DATE: 14,
    CONTENT: 12,
    PAGE_NUMBER: 12,
  },

  CANVAS: {
    MAX_WIDTH_RATIO: 0.9,
    MAX_HEIGHT_RATIO: 0.7,
    MIN_HEIGHT_FOR_CURRENT_PAGE: 100,
    PADDING: 20,
    HTML2CANVAS_SCALE: 1,
    PIXEL_TO_POINT_RATIO: 3 / 4,
  },
} as const

export const EXCEL_CONSTANTS = {
  DEFAULT_COLUMN_WIDTH: 25,
  MAX_COLUMN_WIDTH: 25,
  MIN_COLUMN_WIDTH: 10,

  COLORS: {
    HEADER_BG: 'FFDCDFE6',
    FOOTER_BG: 'FFDCDFE6',
  },

  CANVAS: {
    SCALE: 2,
    MIN_WIDTH: 800,
    MAX_WIDTH: 1200,
    MAX_HEIGHT: 400,
    COLUMN_WIDTH_FACTOR: 7,
    ROW_HEIGHT_ESTIMATE: 20,
  },

  FONT_SIZES: {
    TITLE: 16,
    SUBTITLE: 14,
    DATE: 14,
    CONTENT: 12,
  },
} as const

export const DEFAULT_PDF_CONFIG: Required<PdfConfig> = {
  format: 'a4',
  unit: 'pt',
  orientation: 'portrait',
  title: 'Title',
  subtitle: '',
  dateRange: '',
  totalItems: '',
  skipExcelDownload: false,
  printDate: '',
} as const
