/**
 * PDF Constants - New Organized Structure
 * This file replaces the old constants structure with better organization
 *
 * @deprecated Use individual files from pdf/ folder instead
 * This file is kept for backward compatibility during migration
 */

// Re-export from new organized structure
export * from './pdf/layout'
export * from './pdf/typography'
export * from './pdf/styling'
export * from './pdf/formatting'
export * from './pdf/rendering'

// Legacy aliases for backward compatibility
import { PDF_PAGE_DIMENSIONS } from './pdf/layout'
import { PDF_MARGINS, PDF_SECTION_SPACING, PDF_TEXT_SPACING } from './pdf/layout'
import { PDF_FONT_SIZES } from './pdf/typography'
import { PDF_COLORS } from './pdf/styling'
import { PDF_DOCUMENT_FORMATS as PDF_FORMATS, PDF_UNITS, PDF_ORIENTATIONS } from './pdf/formatting'

/**
 * @deprecated Use PDF_PAGE_DIMENSIONS instead
 */
export const PAGE_DIMENSIONS = PDF_PAGE_DIMENSIONS

/**
 * @deprecated Use PDF_MARGINS, PDF_SECTION_SPACING, PDF_TEXT_SPACING instead
 */
export const SPACING = {
  MARGIN: PDF_MARGINS,
  SECTION: PDF_SECTION_SPACING,
  TEXT: PDF_TEXT_SPACING,
  FOOTER: {
    FROM_BOTTOM: 20,
  },
}

/**
 * @deprecated Use PDF_FONT_SIZES instead
 */
export const FONT_SIZES = PDF_FONT_SIZES

/**
 * @deprecated Use PDF_COLORS instead
 */
export const COLORS = PDF_COLORS

/**
 * @deprecated Use PDF_FORMATS instead
 */
export const PDF_FORMATS_LEGACY = PDF_FORMATS
