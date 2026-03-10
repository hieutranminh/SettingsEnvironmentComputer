/**
 * Style constants for print generation
 */

import type { CellStyle } from 'jspdf-autotable'

/**
 * Color palette for print documents
 */
export const COLORS = {
  HEADER_BG: '#DCDFE6',
  HEADER_BG_ARGB: 'FFDCDFE6', // Excel ARGB format
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  BORDER: '#000000',
  WHITE: '#FFFFFF',
  WHITE_ARGB: 'FFFFFFFF',
} as const

/**
 * Border styles for tables
 */
export const BORDER_STYLES = {
  THIN: {
    style: 'thin' as const,
  },
  ALL_SIDES: {
    top: { style: 'thin' as const },
    left: { style: 'thin' as const },
    bottom: { style: 'thin' as const },
    right: { style: 'thin' as const },
  },
} as const

/**
 * Text alignment options
 */
export const ALIGNMENT = {
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
 * PDF table styles using jsPDF-AutoTable format
 */
export const PDF_TABLE_STYLES = {
  theme: 'grid' as const,
  headStyles: {
    lineWidth: 1,
    textColor: COLORS.TEXT_PRIMARY,
    fillColor: COLORS.HEADER_BG,
  } as Partial<CellStyle>,
  footStyles: {
    lineWidth: 1,
    textColor: COLORS.TEXT_PRIMARY,
    fillColor: COLORS.HEADER_BG,
  } as Partial<CellStyle>,
  styles: {
    fontStyle: 'normal' as const,
    fontSize: 12,
    halign: 'center' as const,
    valign: 'middle' as const,
    minCellHeight: 24,
  } as Partial<CellStyle>,
} as const

/**
 * Excel cell styles
 */
export const EXCEL_STYLES = {
  HEADER: {
    font: { bold: true },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: COLORS.HEADER_BG_ARGB },
    },
    border: BORDER_STYLES.ALL_SIDES,
    alignment: {
      horizontal: ALIGNMENT.HORIZONTAL.CENTER,
      vertical: ALIGNMENT.VERTICAL.MIDDLE,
      wrapText: true,
    },
  },
  BODY: {
    border: BORDER_STYLES.ALL_SIDES,
    alignment: {
      vertical: ALIGNMENT.VERTICAL.MIDDLE,
      wrapText: true,
    },
  },
  FOOTER: {
    font: { bold: true },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: COLORS.HEADER_BG_ARGB },
    },
    border: BORDER_STYLES.ALL_SIDES,
    alignment: {
      vertical: ALIGNMENT.VERTICAL.MIDDLE,
      wrapText: true,
    },
  },
  NUMBER: {
    numFmt: '#,##0',
  },
  TITLE: {
    font: { bold: true, size: 16 },
  },
  SUBTITLE: {
    font: { size: 14 },
  },
  DATE: {
    font: { size: 12 },
    alignment: {
      horizontal: ALIGNMENT.HORIZONTAL.RIGHT,
      vertical: ALIGNMENT.VERTICAL.MIDDLE,
    },
  },
  ERROR_PLACEHOLDER: {
    font: { italic: true, color: { argb: 'FF666666' } },
  },
} as const

/**
 * Canvas rendering options
 */
export const CANVAS_RENDER_OPTIONS = {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  logging: false,
  backgroundColor: COLORS.WHITE,
} as const

/**
 * Supported HTML tags for rich text formatting
 */
export const SUPPORTED_HTML_TAGS = {
  BOLD: ['b', 'strong'] as const,
  ITALIC: ['i', 'em'] as const,
} as const

export const FONT_SIZES = {
  TABLE_TITLE: 12,
  TABLE_HEADER: 10,
  TABLE_BODY: 9,
  SECTION_TITLE: 14,
  DOCUMENT_TITLE: 16,
} as const
