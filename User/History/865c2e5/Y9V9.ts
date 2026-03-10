/**
 * PDF Typography Constants
 * Font sizes, families, and text formatting
 */

/**
 * PDF font sizes in points
 */
export const PDF_FONT_SIZES = {
  // Document titles
  DOCUMENT_TITLE: 28,
  SECTION_TITLE: 14,

  // Table elements
  TABLE_TITLE: 12,
  TABLE_HEADER: 10,
  TABLE_BODY: 9,

  // Text content
  BODY_TEXT: 12,
  SUBTITLE: 14,

  // Footer elements
  FOOTER_TEXT: 12,
  PAGE_NUMBER: 12,
} as const

/**
 * PDF font weights
 */
export const PDF_FONT_WEIGHTS = {
  NORMAL: 'normal' as const,
  BOLD: 'bold' as const,
  ITALIC: 'italic' as const,
} as const

/**
 * PDF text alignment
 */
export const PDF_TEXT_ALIGNMENT = {
  HORIZONTAL: {
    LEFT: 'left' as const,
    CENTER: 'center' as const,
    RIGHT: 'right' as const,
    JUSTIFY: 'justify' as const,
  },
  VERTICAL: {
    TOP: 'top' as const,
    MIDDLE: 'middle' as const,
    BOTTOM: 'bottom' as const,
  },
} as const

/**
 * PDF line height configuration
 */
export const PDF_LINE_HEIGHT = {
  MULTIPLIER: 1.35, // Line height = font size * multiplier
  FIXED: {
    TITLE: 25,
    SUBTITLE: 18,
    BODY: 15,
    TABLE: 12,
  },
} as const

export const PDF_FONT_FAMILIES = {
  REGULAR: 'NanumGothic-Regular' as const,
  BOLD: 'NanumGothic-ExtraBold' as const,
} as const
