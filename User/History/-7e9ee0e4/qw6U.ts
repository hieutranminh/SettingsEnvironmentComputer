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
  PDF_MARGINS,
  PDF_HEADER_SPACING,
  PDF_DATE_FORMATS,
  PDF_FONT_SIZES,
  PDF_FONT_WEIGHTS,
  PDF_FONT_FAMILIES,
  PDF_CANVAS_CONFIG,
} from '../constants/pdf'

import { usePdfTextRenderer } from './usePdfTextRenderer'

/**
 * PDF header composable return type
 */
export interface IUsePdfHeaderReturn {
  addHeader: (pdf: jsPDF, config: Required<PdfConfig>, startY: number) => number
}

/**
 * Composable for PDF header generation
 * @returns PDF header utilities
 */
export const usePdfHeader = (): IUsePdfHeaderReturn => {
  const { formatDate } = useDateFormat()
  const { renderMixedText } = usePdfTextRenderer()

  /**
   * Validates PDF document parameter
   * @param pdf - PDF document to validate
   * @throws Error if PDF is invalid
   */
  const validatePdfDocument = (pdf: jsPDF): void => {
    if (!pdf) {
      throw new Error('PDF document is required')
    }
    if (typeof pdf.setFontSize !== 'function') {
      throw new Error('Invalid PDF document: missing required methods')
    }
  }

  /**
   * Validates Y position parameter
   * @param currentY - Y position to validate
   * @throws Error if Y position is invalid
   */
  const validateYPosition = (currentY: number): void => {
    if (typeof currentY !== 'number' || Number.isNaN(currentY) || currentY < 0) {
      throw new Error('Y position must be a valid positive number')
    }
  }

  /**
   * Sets font style for subtitle elements (subtitle, date range)
   * @param pdf - PDF document
   */
  const setSubtitleFont = (pdf: jsPDF): void => {
    pdf.setFontSize(PDF_FONT_SIZES.SUBTITLE)
    pdf.setFont(PDF_FONT_FAMILIES.REGULAR, PDF_FONT_WEIGHTS.NORMAL)
  }

  /**
   * Adds title to PDF
   * @param pdf - PDF document
   * @param title - Title text
   * @param centerX - Center X position
   * @param y - Y position
   * @returns New Y position
   */
  const addTitle = (pdf: jsPDF, title: string, centerX: number, currentY: number): number => {
    pdf.setFontSize(PDF_FONT_SIZES.DOCUMENT_TITLE)
    pdf.setFont(PDF_FONT_FAMILIES.BOLD, PDF_FONT_WEIGHTS.BOLD)
    pdf.text(title, centerX, currentY, { align: 'center' })
    return currentY + PDF_HEADER_SPACING.AFTER_DOCUMENT_TITLE
  }

  /**
   * Adds subtitle to PDF
   * @param pdf - PDF document
   * @param subtitle - Subtitle text
   * @param centerX - Center X position
   * @param currentY - Y position
   * @returns New Y position
   */
  const addSubtitle = (pdf: jsPDF, subtitle: string, centerX: number, currentY: number): number => {
    if (!subtitle) return currentY

    setSubtitleFont(pdf)
    pdf.text(subtitle, centerX, currentY, { align: 'center' })
    return currentY + PDF_HEADER_SPACING.BETWEEN_HEADER_ELEMENTS
  }

  /**
   * Adds date range to PDF
   * @param pdf - PDF document
   * @param dateRange - Date range text
   * @param centerX - Center X position
   * @param currentY - Y position
   * @returns New Y position
   */
  const addDateRange = (
    pdf: jsPDF,
    dateRange: string,
    centerX: number,
    currentY: number,
  ): number => {
    if (!dateRange) return currentY

    setSubtitleFont(pdf)
    pdf.text(dateRange, centerX, currentY, { align: 'center' })
    return currentY + PDF_HEADER_SPACING.BETWEEN_HEADER_ELEMENTS
  }

  /**
   * Adds current date to PDF
   * @param pdf - PDF document
   * @param pageWidth - Page width
   * @param currentY - Y position
   */
  const addCurrentDate = (pdf: jsPDF, pageWidth: number, currentY: number): void => {
    setSubtitleFont(pdf)
    const currentDate = formatDate(new Date(), { format: PDF_DATE_FORMATS.WITH_DAY })
    pdf.text(currentDate, pageWidth - PDF_MARGINS.RIGHT, currentY, {
      align: 'right',
    })
  }

  /**
   * Adds total items count to PDF
   * @param pdf - PDF document
   * @param totalItems - Total items text (can contain HTML)
   * @param currentY - Y position
   */
  const addTotalItems = (pdf: jsPDF, totalItems: string, currentY: number): void => {
    if (!totalItems) return

    pdf.setFontSize(PDF_FONT_SIZES.BODY_TEXT)
    renderMixedText(pdf, totalItems, PDF_MARGINS.LEFT, currentY, {
      align: 'left',
    })
  }

  /**
   * Adds complete header to PDF document
   * @param pdf - PDF document instance
   * @param config - PDF configuration
   * @param startY - Starting Y position
   * @returns Y position after header
   * @throws Error if parameters are invalid
   *
   * Example:
   *   const newY = addHeader(pdf, config, 50)
   */
  const addHeader = (pdf: jsPDF, config: Required<PdfConfig>, startY: number): number => {
    // Validate input parameters
    validatePdfDocument(pdf)
    validateYPosition(startY)

    if (!config) {
      throw new Error('PDF configuration is required')
    }

    if (!config.title || typeof config.title !== 'string') {
      throw new Error('PDF title is required and must be a string')
    }

    const pageWidth = pdf.internal.pageSize.width
    const centerX = pageWidth / PDF_CANVAS_CONFIG.CENTER_DIVISOR
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
