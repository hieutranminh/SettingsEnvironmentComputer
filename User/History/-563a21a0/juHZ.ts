import { jsPDF } from 'jspdf'

import { DEFAULT_PRINT_CONFIG } from '@/constants/print-preview.constants'
import type { PrintHeaderConfig, PrintPageConfig, PrintPreviewOptions } from '@/types/print-preview.types'

interface HeaderRenderOptions {
  doc: jsPDF
  headerConfig: PrintHeaderConfig
  pageConfig: PrintPageConfig
  pageWidth: number
}

export const renderPdfHeader = (options: HeaderRenderOptions): number => {
  const { doc, headerConfig, pageConfig, pageWidth } = options

  // Start position from top margin - jsPDF has internal margins, so we need to adjust
  let currentY = pageConfig.margins.top + 10 // Add small offset for jsPDF internal margins

  // Debug info
  console.log('PDF Header Debug:', {
    pageWidth,
    margins: pageConfig.margins,
    startY: currentY,
    title: headerConfig.title,
  })

  // Set default font
  doc.setFont(pageConfig.font.family, 'normal')
  doc.setTextColor(pageConfig.font.color)

  // Title
  doc.setFontSize(DEFAULT_PRINT_CONFIG.HEADER.TITLE_SIZE)
  doc.setFont('NanumGothic-ExtraBold', 'bold')
  doc.text(headerConfig.title, pageWidth / 2, currentY, { align: 'center' })
  currentY += DEFAULT_PRINT_CONFIG.SPACING.HEADER

  // Subtitle (if exists)
  if (headerConfig.subtitle) {
    doc.setFontSize(DEFAULT_PRINT_CONFIG.HEADER.SUBTITLE_SIZE)
    doc.setFont('NanumGothic-Regular', 'normal')
    doc.text(headerConfig.subtitle, pageWidth / 2, currentY, { align: 'center' })
    currentY += DEFAULT_PRINT_CONFIG.SPACING.SECTION
  }

  // Date range (if exists)
  if (headerConfig.dateRange) {
    const dateText =
      headerConfig.dateRange.from === headerConfig.dateRange.to
        ? `(${headerConfig.dateRange.from})`
        : `(${headerConfig.dateRange.from} - ${headerConfig.dateRange.to})`

    doc.setFontSize(DEFAULT_PRINT_CONFIG.HEADER.DATE_SIZE)
    doc.setFont('NanumGothic-Regular', 'normal')
    doc.text(dateText, pageWidth / 2, currentY, { align: 'center' })
    currentY += DEFAULT_PRINT_CONFIG.SPACING.SECTION
  }

  // Custom fields
  if (headerConfig.customFields && headerConfig.customFields.length > 0) {
    headerConfig.customFields.forEach((field) => {
      const text = `${field.label}: ${field.value}`
      let xPosition: number

      switch (field.position) {
        case 'left':
          xPosition = pageConfig.margins.left
          break
        case 'right':
          xPosition = pageWidth - pageConfig.margins.right
          break
        default: // center
          xPosition = pageWidth / 2
          break
      }

      doc.setFontSize(DEFAULT_PRINT_CONFIG.HEADER.DATE_SIZE)
      doc.setFont('NanumGothic-Regular', 'normal')
      doc.text(text, xPosition, currentY, {
        align: field.position,
      })
      currentY += DEFAULT_PRINT_CONFIG.SPACING.LINE
    })
  }

  // Current date (if enabled)
  if (headerConfig.showCurrentDate !== false) {
    const currentDate = new Date().toLocaleDateString('ko-KR')
    doc.setFontSize(DEFAULT_PRINT_CONFIG.HEADER.DATE_SIZE)
    doc.setFont('NanumGothic-Regular', 'normal')
    doc.text(currentDate, pageWidth - pageConfig.margins.right, currentY, { align: 'right' })
  }

  return currentY
}

export const addPdfHeader = (doc: jsPDF, options: PrintPreviewOptions): number => {
  console.log('%cworker - addPdfHeader', 'color: red', options)
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  console.log('PDF Document Info:', {
    pageWidth,
    pageHeight,
    unit: doc.internal.scaleFactor,
  })

  // Use default page config if not provided
  const pageConfig: PrintPageConfig = {
    orientation: 'portrait',
    paperSize: 'A4',
    margins: {
      top: DEFAULT_PRINT_CONFIG.MARGINS.TOP,
      bottom: DEFAULT_PRINT_CONFIG.MARGINS.BOTTOM,
      left: DEFAULT_PRINT_CONFIG.MARGINS.LEFT,
      right: DEFAULT_PRINT_CONFIG.MARGINS.RIGHT,
    },
    font: {
      family: DEFAULT_PRINT_CONFIG.FONT.FAMILY,
      size: DEFAULT_PRINT_CONFIG.FONT.SIZE.BODY,
      color: DEFAULT_PRINT_CONFIG.FONT.COLOR,
    },
    spacing: {
      section: DEFAULT_PRINT_CONFIG.SPACING.SECTION,
      line: DEFAULT_PRINT_CONFIG.SPACING.LINE,
    },
  }

  // Use default header config if not provided
  const headerConfig: PrintHeaderConfig = {
    showCurrentDate: true,
    showPageNumber: true,
    ...options.config.header,
  }

  return renderPdfHeader({
    doc,
    headerConfig,
    pageConfig,
    pageWidth,
  })
}

export const addPdfFooter = (doc: jsPDF, pageNumber: number, showPageNumber = true): void => {
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width

  doc.setFontSize(DEFAULT_PRINT_CONFIG.HEADER.DATE_SIZE)
  doc.setFont('NanumGothic-Regular', 'normal')

  if (showPageNumber) {
    doc.text(`Page ${pageNumber}`, 20, pageHeight - 20)
  }

  const currentDate = new Date().toLocaleDateString('ko-KR')
  doc.text(`Printed: ${currentDate}`, pageWidth - 20, pageHeight - 20, { align: 'right' })
}
