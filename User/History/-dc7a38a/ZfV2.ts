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
import { FONTS } from '@/utils/fontUtils'
import { FONT_SIZES, SPACING } from '../constants'

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
    const footerY = pageHeight - SPACING.FOOTER.FROM_BOTTOM

    // Save current page
    const currentPage = pdf.getCurrentPageInfo().pageNumber

    // Add page numbers to all pages
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(FONT_SIZES.FOOTER)
      pdf.setFont(FONTS.REGULAR, 'normal')
      
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
