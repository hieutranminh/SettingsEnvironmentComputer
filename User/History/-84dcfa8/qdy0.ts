/**
 * PDF Styling Constants
 * Colors, borders, and visual styling for PDF elements
 */

/**
 * PDF color palette (hex format)
 */
export const PDF_COLORS = {
  // Text colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_MUTED: '#999999',

  // Background colors
  BACKGROUND_WHITE: '#FFFFFF',
  BACKGROUND_GRAY: '#F5F5F5',
  BACKGROUND_HEADER: '#DCDFE6',

  // Border colors
  BORDER_PRIMARY: '#000000',
  BORDER_LIGHT: '#CCCCCC',
  BORDER_GRAY: '#E0E0E0',

  // Accent colors
  ACCENT_PRIMARY: '#007BFF',
  ACCENT_SUCCESS: '#28A745',
  ACCENT_WARNING: '#FFC107',
  ACCENT_DANGER: '#DC3545',
} as const

/**
 * PDF border styles
 */
export const PDF_BORDER_STYLES = {
  NONE: {
    style: 'none' as const,
  },
  THIN: {
    style: 'thin' as const,
  },
  MEDIUM: {
    style: 'medium' as const,
  },
  THICK: {
    style: 'thick' as const,
  },
  ALL_SIDES: {
    top: { style: 'thin' as const },
    left: { style: 'thin' as const },
    bottom: { style: 'thin' as const },
    right: { style: 'thin' as const },
  },
} as const

/**
 * PDF table styling configuration
 */
export const PDF_TABLE_STYLES = {
  THEME: 'grid' as const,
  HEADER: {
    lineWidth: 1,
    textColor: PDF_COLORS.TEXT_PRIMARY,
    fillColor: PDF_COLORS.BACKGROUND_HEADER,
  },
  FOOTER: {
    lineWidth: 1,
    textColor: PDF_COLORS.TEXT_PRIMARY,
    fillColor: PDF_COLORS.BACKGROUND_HEADER,
  },
  STYLES: {
    fontStyle: 'normal' as const,
    fontSize: 12,
    halign: 'center' as const,
    valign: 'middle' as const,
    minCellHeight: 24,
    textColor: PDF_COLORS.TEXT_PRIMARY,
  },
} as const

/**
 * PDF cell height configuration
 */
export const PDF_CELL_HEIGHTS = {
  MIN_CELL_HEIGHT: 24,
  ROW_HEIGHT_ESTIMATE: 12,
  HEADER_HEIGHT: 30,
  FOOTER_HEIGHT: 25,
} as const
