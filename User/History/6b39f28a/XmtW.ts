/**
 * PDF Layout and Page Configuration Constants
 * All measurements are in points (pt) unless specified
 * 1 inch = 72 points
 */

/**
 * Standard PDF page dimensions in points
 */
export const PDF_PAGE_DIMENSIONS = {
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
  A3: {
    PORTRAIT: {
      WIDTH: 841.89, // 297mm
      HEIGHT: 1190.55, // 420mm
    },
    LANDSCAPE: {
      WIDTH: 1190.55,
      HEIGHT: 841.89,
    },
  },
} as const

/**
 * PDF page margins and spacing
 */
export const PDF_MARGINS = {
  TOP: 50,
  BOTTOM: 40,
  LEFT: 30,
  RIGHT: 30,
} as const

/**
 * PDF section spacing
 */
export const PDF_SECTION_SPACING = {
  BETWEEN_SECTIONS: 20,
  AFTER_TITLE: 12,
  AFTER_HEADER: 15,
  AFTER_TABLE: 10,
} as const

/**
 * PDF text spacing
 */
export const PDF_TEXT_SPACING = {
  LINE_HEIGHT: 15,
  PARAGRAPH: 5,
  INDENT: 20,
} as const

/**
 * PDF page break configuration
 */
export const PDF_PAGE_BREAK = {
  MIN_SPACE_FOR_CONTENT: 50,
  MIN_SPACE_FOR_TABLE: 50,
  MIN_SPACE_FOR_CANVAS: 100,
  BUFFER_FROM_BOTTOM: 20,
} as const

/**
 * PDF footer configuration
 */
export const PDF_FOOTER = {
  FROM_BOTTOM: 20,
  HEIGHT: 15,
} as const

/**
 * PDF page numbering configuration
 */
export const PDF_PAGE_NUMBERING = {
  FIRST_PAGE_NUMBER: 1,
  START_FROM: 1,
} as const

/**
 * PDF header configuration
 */
export const PDF_HEADER = {
  INITIAL_Y_POSITION: 50,
  SPACING_AFTER: 10,
  MIN_SPACE_FROM_HEADER: 50,
} as const

/**
 * PDF header element spacing
 * Specific spacing values for header components
 */
export const PDF_HEADER_SPACING = {
  // Spacing after main document title
  AFTER_DOCUMENT_TITLE: 25,
  
  // Spacing between header elements (subtitle, date range)
  BETWEEN_HEADER_ELEMENTS: 20,
  
  // Spacing for same-line elements (current date + total items)
  SAME_LINE_VERTICAL_OFFSET: 0,
  
  // Final spacing after complete header before content
  AFTER_COMPLETE_HEADER: 20,
} as const
