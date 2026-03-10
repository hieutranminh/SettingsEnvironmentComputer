/**
 * PDF page numbering composable
 * Handles adding page numbers to all pages
 *
 * Example usage:
 *   const { addPageNumbers } = usePdfPageNumbers()
 *   addPageNumbers(pdf)
 */

import type jsPDF from 'jspdf'

import { t } from '@/plugins/i18n'

import { PDF_FOOTER, PDF_FONT_SIZES, PDF_FONT_FAMILIES } from '../constants/pdf'

/**
 * PDF page numbers composable return type
 */
export interface UsePdfPageNumbersReturn {
  addPageNumbers: (pdf: jsPDF) => void
}

/**
 * Composable for PDF page numbering
 * @returns PDF page numbering utilities
 */
export const usePdfPageNumbers = (): UsePdfPageNumbersReturn => {
  /**
   * Adds page numbers to all pages in the PDF
   * @param pdf - PDF document instance
   *
   * Example:
   *   addPageNumbers(pdf) // Adds "Page 1", "Page 2", etc.
   */
  const addPageNumbers = (pdf: jsPDF): void => {
    const totalPages = pdf.getNumberOfPages()
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    const centerX = pageWidth / 2
    const footerY = pageHeight - PDF_FOOTER.FROM_BOTTOM

    // Save current page
    const currentPage = pdf.getCurrentPageInfo().pageNumber

    // Add page numbers to all pages
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(PDF_FONT_SIZES.FOOTER_TEXT)
      pdf.setFont(PDF_FONT_FAMILIES.REGULAR, 'normal')

      const pageText = `${t('general.page')} ${i}`
      pdf.text(pageText, centerX, footerY, { align: 'center' })
    }

    // Restore to current page
    pdf.setPage(currentPage)
  }

  return {
    addPageNumbers,
  }
}
