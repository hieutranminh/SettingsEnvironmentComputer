/**
 * PDF Header Service
 * Handles PDF header generation with proper separation of concerns
 * Extracted from print-preview.store.ts
 */

import type jsPDF from 'jspdf'
import { FONTS } from '@/utils/fontUtils'
import { useDateFormat } from '@/composables/useDateFormat'
import { PDF_LAYOUT, PDF_FONTS, ALIGNMENT_OPTIONS } from '@/constants/print.constants'
import type { PdfConfig } from '@/types/print'

export interface PdfHeaderService {
  addHeader: (pdf: jsPDF, config: Required<PdfConfig>, startY: number) => number
  addPageNumbers: (pdf: jsPDF) => void
  renderMixedText: (
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    options?: { align?: 'left' | 'center' | 'right' | 'justify' },
  ) => number
}

/**
 * Creates PDF header service with proper error handling and clean API
 *
 * Example usage:
 *   const headerService = createPdfHeaderService()
 *   const newY = headerService.addHeader(pdf, config, 50)
 *
 * Expected output:
 *   - Adds formatted header to PDF document
 *   - Returns Y position after header for content placement
 *   - Handles mixed text formatting (bold/normal)
 */
export const createPdfHeaderService = (): PdfHeaderService => {
  const { formatDate } = useDateFormat()

  /**
   * Adds a formatted header to the PDF document
   * @param pdf - The jsPDF instance
   * @param config - PDF configuration with title, subtitle, etc.
   * @param startY - Starting Y position for the header
   * @returns Final Y position after the header is added
   */
  const addHeader = (pdf: jsPDF, config: Required<PdfConfig>, startY: number): number => {
    const pageWidth = pdf.internal.pageSize.width
    const centerX = pageWidth / 2
    let currentY = startY

    try {
      // Add title
      currentY = addTitleSection(pdf, config.title, centerX, currentY)

      // Add subtitle if provided
      if (config.subtitle) {
        currentY = addSubtitleSection(pdf, config.subtitle, centerX, currentY)
      }

      // Add date range if provided
      if (config.dateRange) {
        currentY = addDateRangeSection(pdf, config.dateRange, centerX, currentY)
      }

      // Add current date and total items
      currentY = addDateAndTotalSection(pdf, config, pageWidth, currentY)

      return currentY
    } catch (error) {
      throw new Error(`Failed to add PDF header: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Adds title section to the PDF
   */
  const addTitleSection = (pdf: jsPDF, title: string, centerX: number, startY: number): number => {
    pdf.setFontSize(PDF_FONTS.SIZES.TITLE)
    pdf.setFont(FONTS.BOLD, PDF_FONTS.STYLES.TITLE)
    pdf.text(title, centerX, startY, { align: ALIGNMENT_OPTIONS.HORIZONTAL.CENTER })

    return startY + PDF_LAYOUT.SPACING.AFTER_TITLE
  }

  /**
   * Adds subtitle section to the PDF
   */
  const addSubtitleSection = (pdf: jsPDF, subtitle: string, centerX: number, startY: number): number => {
    pdf.setFontSize(PDF_FONTS.SIZES.SUBTITLE)
    pdf.setFont(FONTS.REGULAR, PDF_FONTS.STYLES.SUBTITLE)
    pdf.text(subtitle, centerX, startY, { align: ALIGNMENT_OPTIONS.HORIZONTAL.CENTER })

    return startY + PDF_LAYOUT.SPACING.AFTER_SUBTITLE
  }

  /**
   * Adds date range section to the PDF
   */
  const addDateRangeSection = (pdf: jsPDF, dateRange: string, centerX: number, startY: number): number => {
    pdf.setFontSize(PDF_FONTS.SIZES.DATE)
    pdf.setFont(FONTS.REGULAR, PDF_FONTS.STYLES.DATE)
    pdf.text(dateRange, centerX, startY, { align: ALIGNMENT_OPTIONS.HORIZONTAL.CENTER })

    return startY + PDF_LAYOUT.SPACING.AFTER_SUBTITLE
  }

  /**
   * Adds current date and total items section
   */
  const addDateAndTotalSection = (
    pdf: jsPDF,
    config: Required<PdfConfig>,
    pageWidth: number,
    startY: number,
  ): number => {
    // Add current date from right side
    pdf.setFontSize(PDF_FONTS.SIZES.DATE)
    pdf.setFont(FONTS.REGULAR, PDF_FONTS.STYLES.DATE)
    const currentDate = formatDate(new Date(), { format: 'YYYY-MM-DD (ddd)' })
    pdf.text(currentDate, pageWidth - PDF_LAYOUT.MARGINS.DEFAULT, startY, {
      align: ALIGNMENT_OPTIONS.HORIZONTAL.RIGHT,
    })

    // Add total items if provided
    if (config.totalItems) {
      pdf.setFontSize(PDF_FONTS.SIZES.TOTAL_ITEMS)
      renderMixedText(pdf, config.totalItems, PDF_LAYOUT.MARGINS.DEFAULT, startY, {
        align: ALIGNMENT_OPTIONS.HORIZONTAL.LEFT,
      })
    }

    return startY + PDF_LAYOUT.SPACING.AFTER_DATE
  }

  /**
   * Adds page numbers to all pages in the PDF document
   * @param pdf - The jsPDF instance
   */
  const addPageNumbers = (pdf: jsPDF): void => {
    try {
      const totalPages = pdf.getNumberOfPages()
      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const centerX = pageWidth / 2
      const footerY = pageHeight - PDF_LAYOUT.FOOTER.POSITION_FROM_BOTTOM

      // Save current page
      const currentPage = pdf.getCurrentPageInfo().pageNumber

      // Add page numbers to all pages
      for (let i = 1; i <= totalPages; i++) {
        addPageNumberToPage(pdf, i, centerX, footerY)
      }

      // Restore to current page
      pdf.setPage(currentPage)
    } catch (error) {
      throw new Error(`Failed to add page numbers: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Adds page number to a specific page
   */
  const addPageNumberToPage = (pdf: jsPDF, pageNumber: number, centerX: number, footerY: number): void => {
    pdf.setPage(pageNumber)
    pdf.setFontSize(PDF_FONTS.SIZES.PAGE_NUMBER)
    pdf.setFont(FONTS.REGULAR, PDF_FONTS.STYLES.PAGE_NUMBER)
    // Note: t() function should be imported from i18n plugin
    pdf.text(`Page ${pageNumber}`, centerX, footerY, { align: ALIGNMENT_OPTIONS.HORIZONTAL.CENTER })
  }

  /**
   * Renders text with mixed styling (bold/normal)
   * @param pdf - The jsPDF instance
   * @param text - Text with HTML tags for formatting
   * @param x - X position
   * @param y - Y position
   * @param options - Text alignment options
   * @returns Final X position after rendering
   */
  const renderMixedText = (
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    options?: { align?: 'left' | 'center' | 'right' | 'justify' },
  ): number => {
    try {
      const currentFontSize = pdf.getFontSize()
      const currentFont = pdf.getFont()

      // Split text by <b> and </b> tags
      const parts = text.split(/(<b>.*?<\/b>)/g)
      let currentX = x

      parts.forEach((part) => {
        if (part.startsWith('<b>') && part.endsWith('</b>')) {
          currentX = renderBoldText(pdf, part, currentX, y, options)
        } else if (part.trim()) {
          currentX = renderNormalText(pdf, part, currentX, y, options)
        }
      })

      // Restore original font settings
      pdf.setFontSize(currentFontSize)
      pdf.setFont(currentFont.fontName, currentFont.fontStyle)

      return currentX
    } catch (error) {
      throw new Error(`Failed to render mixed text: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Renders bold text part
   */
  const renderBoldText = (
    pdf: jsPDF,
    boldPart: string,
    currentX: number,
    y: number,
    options?: { align?: 'left' | 'center' | 'right' | 'justify' },
  ): number => {
    const boldText = boldPart.replace(/<\/?b>/g, '')
    pdf.setFont(FONTS.BOLD, 'bold')
    pdf.text(boldText, currentX, y, options)
    return currentX + pdf.getTextWidth(boldText)
  }

  /**
   * Renders normal text part
   */
  const renderNormalText = (
    pdf: jsPDF,
    normalText: string,
    currentX: number,
    y: number,
    options?: { align?: 'left' | 'center' | 'right' | 'justify' },
  ): number => {
    pdf.setFont(FONTS.REGULAR, 'normal')
    pdf.text(normalText, currentX, y, options)
    return currentX + pdf.getTextWidth(normalText)
  }

  return {
    addHeader,
    addPageNumbers,
    renderMixedText,
  }
}
