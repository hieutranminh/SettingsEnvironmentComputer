/**
 * PDF Rendering Constants
 * Canvas, image, and rendering configuration
 */

/**
 * PDF canvas rendering configuration
 */
export const PDF_CANVAS_CONFIG = {
  // Size ratios
  MAX_WIDTH_RATIO: 0.9, // Canvas takes up to 90% of page width
  MAX_HEIGHT_RATIO: 0.7, // Canvas takes up to 70% of page height

  // Spacing
  PADDING: 20,
  MIN_HEIGHT_FOR_CURRENT_PAGE: 100,

  // Rendering options
  SCALE: 2,
  USE_CORS: true,
  ALLOW_TAINT: true,
  LOGGING: false,
  BACKGROUND_COLOR: '#FFFFFF',
} as const

/**
 * PDF image processing configuration
 */
export const PDF_IMAGE_CONFIG = {
  // Conversion ratios
  PIXEL_TO_POINT_RATIO: 0.75, // pt = 3/4 * px

  // Image quality
  JPEG_QUALITY: 0.95,

  // Size limits
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 800,
  MIN_WIDTH: 400,
} as const

/**
 * PDF text rendering configuration
 */
export const PDF_TEXT_RENDERING = {
  // Page break handling
  PAGE_BREAK_BUFFER: 20,
  MIN_SPACE_FOR_TEXT: 40,
  SPACING_AFTER_HEADER: 10,
  MIN_SPACE_FROM_HEADER: 50,

  // Text processing
  LINE_HEIGHT_MULTIPLIER: 1.35,
  PARAGRAPH_SPACING: 5,

  // Error handling
  ERROR_PLACEHOLDER: 'Error rendering text',
} as const

/**
 * PDF table rendering configuration
 */
export const PDF_TABLE_RENDERING = {
  // Page break handling
  MIN_SPACE_FOR_TABLE: 50,
  ROW_HEIGHT_ESTIMATE: 12,

  // Table positioning
  CENTER_TABLE: true,
  FULL_WIDTH: false,

  // Error handling
  ERROR_PLACEHOLDER: 'Error rendering table',
} as const
