/**
 * PDF text section processing composable
 * Handles text block rendering in PDF documents
 *
 * Example usage:
 *   const { processText } = usePdfText()
 *   const newY = await processText(pdf, section, currentY)
 */

import type jsPDF from 'jspdf'
import type { PrintSection, PdfConfig } from '@/types/print'
import { SPACING, FONT_SIZES } from '../constants'
import { FONTS } from '@/utils/fontUtils'
import { usePdfHeader } from './usePdfHeader'

/**
 * PDF text composable return type
 */
export interface UsePdfTextReturn {
  processText: (
    pdf: jsPDF,
    section: PrintSection,
    startY: number,
    config: Required<PdfConfig>,
    headerEndPosition: number,
    pagesWithHeaders: Set<number>,
  ) => Promise<number>
}

/**
 * Composable for PDF text processing
 * @returns PDF text processing utilities
 */
export const usePdfText = (): UsePdfTextReturn => {
  const { addHeader } = usePdfHeader()

  /**
   * Calculates available width for text
   * @param pageWidth - Page width
   * @returns Available width for text
   */
  const getTextWidth = (pageWidth: number): number => {
    return pageWidth - SPACING.MARGIN.LEFT - SPACING.MARGIN.RIGHT
  }

  /**
   * Calculates available height on current page
   * @param currentY - Current Y position
   * @param pageHeight - Page height
   * @returns Available height
   */
  const getAvailableHeight = (currentY: number, pageHeight: number): number => {
    return pageHeight - currentY - SPACING.MARGIN.BOTTOM
  }

  /**
   * Adds new page with header
   * @param pdf - PDF document
   * @param config - PDF configuration
   * @param headerEndPosition - Position after header
   * @param pagesWithHeaders - Set of pages with headers
   * @returns New Y position
   */
  const addNewPage = (
    pdf: jsPDF,
    config: Required<PdfConfig>,
    headerEndPosition: number,
    pagesWithHeaders: Set<number>,
  ): number => {
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()

    if (!pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      pagesWithHeaders.add(pageNumber)
    }

    return headerEndPosition + 10
  }

  /**
   * Processes single text element
   * @param pdf - PDF document
   * @param text - Text to process
   * @param currentY - Current Y position
   * @param maxWidth - Maximum text width
   * @param pageHeight - Page height
   * @param config - PDF configuration
   * @param headerEndPosition - Position after header
   * @param pagesWithHeaders - Set of pages with headers
   * @returns New Y position
   */
  const processTextElement = (
    pdf: jsPDF,
    text: string,
    currentY: number,
    maxWidth: number,
    pageHeight: number,
    config: Required<PdfConfig>,
    headerEndPosition: number,
    pagesWithHeaders: Set<number>,
  ): number => {
    const lines = pdf.splitTextToSize(text, maxWidth)
    const requiredHeight = lines.length * SPACING.TEXT.LINE_HEIGHT
    const availableHeight = getAvailableHeight(currentY, pageHeight)
    let yPosition = currentY

    // Check if entire text block fits
    if (requiredHeight > availableHeight && yPosition > headerEndPosition + 50) {
      yPosition = addNewPage(pdf, config, headerEndPosition, pagesWithHeaders)
    }

    // Add lines with page break handling
    for (const line of lines) {
      if (yPosition + SPACING.TEXT.LINE_HEIGHT > pageHeight - SPACING.MARGIN.BOTTOM) {
        yPosition = addNewPage(pdf, config, headerEndPosition, pagesWithHeaders)
      }

      pdf.text(line, SPACING.MARGIN.LEFT, yPosition, { align: 'left' })
      yPosition += SPACING.TEXT.LINE_HEIGHT
    }

    return yPosition
  }

  /**
   * Processes text section for PDF
   * @param pdf - PDF document
   * @param section - Text section to process
   * @param startY - Starting Y position
   * @param config - PDF configuration
   * @param headerEndPosition - Position after header
   * @param pagesWithHeaders - Set of pages with headers
   * @returns Final Y position after text
   *
   * Example:
   *   const newY = await processText(pdf, textSection, 100)
   */
  const processText = async (
    pdf: jsPDF,
    section: PrintSection,
    startY: number,
    config: Required<PdfConfig>,
    headerEndPosition: number = 40,
    pagesWithHeaders: Set<number> = new Set<number>([1]),
  ): Promise<number> => {
    try {
      const textElements = section.sectionTexts
      if (!textElements?.length) return startY

      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const maxWidth = getTextWidth(pageWidth)

      // Set font for text
      pdf.setFontSize(FONT_SIZES.BODY)
      pdf.setFont(FONTS.REGULAR, 'normal')

      let currentY = startY

      // Process each text element
      for (const text of textElements) {
        currentY = processTextElement(
          pdf,
          text,
          currentY,
          maxWidth,
          pageHeight,
          config,
          headerEndPosition,
          pagesWithHeaders,
        )

        // Add spacing between text elements
        currentY += SPACING.TEXT.PARAGRAPH
      }

      return currentY
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to process text section: ${message}`)
    }
  }

  return {
    processText,
  }
}
