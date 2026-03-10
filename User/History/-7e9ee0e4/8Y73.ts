/**
 * PDF header generation composable
 * Handles adding headers to PDF pages
 *
 * Example usage:
 *   const { addHeader } = usePdfHeader()
 *   const newY = addHeader(pdf, config, startY)
 */

import type jsPDF from 'jspdf'

import { useDateFormat } from '@/composables/useDateFormat'
import type { PdfConfig } from '@/types/print'

import { 
  PDF_FONT_SIZES, 
  PDF_MARGINS, 
  PDF_SECTION_SPACING, 
  PDF_FONT_FAMILIES,
  PDF_HEADER_SPACING,
  PDF_DATE_FORMATS
} from '../constants/pdf'

import { usePdfTextRenderer } from './usePdfTextRenderer'

/**
 * PDF header composable return type
 */
export interface UsePdfHeaderReturn {
  addHeader: (pdf: jsPDF, config: Required<PdfConfig>, startY: number) => number
}

/**
 * Composable for PDF header generation
 * @returns PDF header utilities
 */
export const usePdfHeader = (): UsePdfHeaderReturn => {
  const { formatDate } = useDateFormat()
  const { renderMixedText } = usePdfTextRenderer()

  /**
   * Sets font style for subtitle elements (subtitle, date range)
   * @param pdf - PDF document
   */
  const setSubtitleFont = (pdf: jsPDF): void => {
    pdf.setFontSize(PDF_FONT_SIZES.SUBTITLE)
    pdf.setFont(PDF_FONT_FAMILIES.REGULAR, 'normal')
  }

  /**
   * Adds title to PDF
   * @param pdf - PDF document
   * @param title - Title text
   * @param centerX - Center X position
   * @param y - Y position
   * @returns New Y position
   */
  const addTitle = (pdf: jsPDF, title: string, centerX: number, y: number): number => {
    pdf.setFontSize(PDF_FONT_SIZES.DOCUMENT_TITLE)
    pdf.setFont(PDF_FONT_FAMILIES.BOLD, 'bold')
    pdf.text(title, centerX, y, { align: 'center' })
    return y + PDF_HEADER_SPACING.AFTER_DOCUMENT_TITLE
  }

  /**
   * Adds subtitle to PDF
   * @param pdf - PDF document
   * @param subtitle - Subtitle text
   * @param centerX - Center X position
   * @param y - Y position
   * @returns New Y position
   */
  const addSubtitle = (pdf: jsPDF, subtitle: string, centerX: number, y: number): number => {
    if (!subtitle) return y

    setSubtitleFont(pdf)
    pdf.text(subtitle, centerX, y, { align: 'center' })
    return y + PDF_HEADER_SPACING.BETWEEN_HEADER_ELEMENTS
  }

  /**
   * Adds date range to PDF
   * @param pdf - PDF document
   * @param dateRange - Date range text
   * @param centerX - Center X position
   * @param y - Y position
   * @returns New Y position
   */
  const addDateRange = (pdf: jsPDF, dateRange: string, centerX: number, y: number): number => {
    if (!dateRange) return y

    setSubtitleFont(pdf)
    pdf.text(dateRange, centerX, y, { align: 'center' })
    return y + PDF_HEADER_SPACING.BETWEEN_HEADER_ELEMENTS
  }

  /**
   * Adds current date to PDF
   * @param pdf - PDF document
   * @param pageWidth - Page width
   * @param y - Y position
   */
  const addCurrentDate = (pdf: jsPDF, pageWidth: number, y: number): void => {
    setSubtitleFont(pdf)
    const currentDate = formatDate(new Date(), { format: PDF_DATE_FORMATS.HEADER_DATE })
    pdf.text(currentDate, pageWidth - PDF_MARGINS.RIGHT, y, {
      align: 'right',
    })
  }

  /**
   * Adds total items count to PDF
   * @param pdf - PDF document
   * @param totalItems - Total items text (can contain HTML)
   * @param y - Y position
   */
  const addTotalItems = (pdf: jsPDF, totalItems: string, y: number): void => {
    if (!totalItems) return

    pdf.setFontSize(PDF_FONT_SIZES.BODY_TEXT)
    renderMixedText(pdf, totalItems, PDF_MARGINS.LEFT, y, {
      align: 'left',
    })
  }

  /**
   * Adds complete header to PDF document
   * @param pdf - PDF document instance
   * @param config - PDF configuration
   * @param startY - Starting Y position
   * @returns Y position after header
   *
   * Example:
   *   const newY = addHeader(pdf, config, 50)
   */
  const addHeader = (pdf: jsPDF, config: Required<PdfConfig>, startY: number): number => {
    const pageWidth = pdf.internal.pageSize.width
    const centerX = pageWidth / 2
    let currentY = startY

    // Add title
    currentY = addTitle(pdf, config.title, centerX, currentY)

    // Add subtitle
    currentY = addSubtitle(pdf, config.subtitle, centerX, currentY)

    // Add date range
    currentY = addDateRange(pdf, config.dateRange, centerX, currentY)

    // Add current date and total items on the same line
    addCurrentDate(pdf, pageWidth, currentY)
    addTotalItems(pdf, config.totalItems, currentY)

    return currentY + PDF_HEADER_SPACING.AFTER_COMPLETE_HEADER
  }

  return {
    addHeader,
  }
}
