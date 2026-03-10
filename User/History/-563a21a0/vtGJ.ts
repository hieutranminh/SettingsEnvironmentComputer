import { jsPDF } from 'jspdf'

import { PRINT_PREVIEW_CONFIG } from '@/constants/print-preview.constants'
import type { PrintPreviewOptions } from '@/types/print-preview.types'

export const addPdfHeader = (doc: jsPDF, options: PrintPreviewOptions): void => {
  // Get page width for centering
  const pageWidth = doc.internal.pageSize.width

  // Start position from top margin
  let currentY = PRINT_PREVIEW_CONFIG.MARGIN.TOP

  // Title
  doc.setFontSize(28)
  doc.setFont('NanumGothic-ExtraBold', 'bold')
  doc.text(options.headerTitle || 'BÁO CÁO', pageWidth / 2, currentY, { align: 'center' })

  // Move to next line with spacing
  currentY += PRINT_PREVIEW_CONFIG.PADDING.SECTION

  // Subtitle (if exists)
  if (options.headerSubtitle) {
    doc.setFontSize(14)
    doc.setFont('NanumGothic-Regular', 'normal')
    doc.text(options.headerSubtitle, pageWidth / 2, currentY, { align: 'center' })
    // Move to next line with spacing
    currentY += PRINT_PREVIEW_CONFIG.PADDING.SECTION
  }

  // Date text
  const dateText =
    options.headerDate.length === 1
      ? `(${options.headerDate[0] || ''})`
      : `(${options.headerDate[0] || ''} - ${options.headerDate[1] || ''})`

  if (dateText && dateText !== '()') {
    doc.setFontSize(14)
    doc.setFont('NanumGothic-Regular', 'normal')
    doc.text(dateText, pageWidth / 2, currentY, { align: 'center' })
    // Move to next line with spacing
    currentY += PRINT_PREVIEW_CONFIG.PADDING.SECTION
  }

  // Current date
  const currentDate = new Date().toLocaleDateString('vi-VN')
  doc.setFontSize(14)
  doc.setFont('NanumGothic-Regular', 'normal')
  doc.text(currentDate, pageWidth - PRINT_PREVIEW_CONFIG.MARGIN.RIGHT, currentY, { align: 'right' })
}

export const addPdfFooter = (doc: jsPDF, pageNumber: number): void => {
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.text(`Trang ${pageNumber}`, 20, pageHeight - 10)
  doc.text(`In ngày: ${new Date().toLocaleDateString('vi-VN')}`, 200, pageHeight - 10)
}
