/**
 * PDF text section processing composable
 * Handles text block rendering in PDF documents
 *
 * Example usage:
 *   const { processText } = usePdfText()
 *   const newY = await processText(pdf, section, currentY)
 */

import type jsPDF from 'jspdf'

import type { PrintSection, PdfConfig, PdfProcessingContext } from '@/types/print'
import { FONTS } from '@/utils/fontUtils'

import { SPACING, FONT_SIZES } from '../constants'

import { usePdfHeader } from './usePdfHeader'

const TEXT_CONSTANTS = {
  SPACING_AFTER_HEADER: 10,
  MIN_SPACE_FROM_HEADER: 50,
} as const

interface TextRenderingContext {
  pdf: jsPDF
  config: Required<PdfConfig>
  context: PdfProcessingContext
  pageWidth: number
  pageHeight: number
  maxWidth: number
}

interface TextMetrics {
  lines: string[]
  requiredHeight: number
}

/**
 * PDF text composable return type
 */
export interface UsePdfTextReturn {
  processText: (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ) => Promise<number>
}

/**
 * Composable for PDF text processing
 * @returns PDF text processing utilities
 */
export const usePdfText = (): UsePdfTextReturn => {
  const { addHeader } = usePdfHeader()

  /**
   * Calculates text metrics for rendering
   * @param pdf - PDF document
   * @param text - Text to analyze
   * @param maxWidth - Maximum text width
   * @returns Text lines and required height
   */
  const calculateTextMetrics = (pdf: jsPDF, text: string, maxWidth: number): TextMetrics => {
    const lines = pdf.splitTextToSize(text, maxWidth)
    const requiredHeight = lines.length * SPACING.TEXT.LINE_HEIGHT
    return { lines, requiredHeight }
  }

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
   * Determines if a page break is needed
   * @param currentY - Current Y position
   * @param requiredHeight - Height needed for text
   * @param pageHeight - Page height
   * @param headerEndPosition - Position after header
   * @returns True if page break needed
   */
  const shouldBreakPage = (
    currentY: number,
    requiredHeight: number,
    pageHeight: number,
    headerEndPosition: number,
  ): boolean => {
    const availableHeight = getAvailableHeight(currentY, pageHeight)
    return requiredHeight > availableHeight && currentY > headerEndPosition + TEXT_CONSTANTS.MIN_SPACE_FROM_HEADER
  }

  /**
   * Checks if current line needs new page
   * @param yPosition - Current Y position
   * @param pageHeight - Page height
   * @returns True if new page needed
   */
  const shouldAddNewPageForLine = (yPosition: number, pageHeight: number): boolean => {
    return yPosition + SPACING.TEXT.LINE_HEIGHT > pageHeight - SPACING.MARGIN.BOTTOM
  }

  /**
   * Adds new page with header
   * @param renderContext - Text rendering context
   * @returns New Y position
   */
  const addNewPage = (renderContext: TextRenderingContext): number => {
    const { pdf, config, context } = renderContext
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition + TEXT_CONSTANTS.SPACING_AFTER_HEADER
  }

  /**
   * Renders text lines with page break handling
   * @param renderContext - Text rendering context
   * @param lines - Text lines to render
   * @param startY - Starting Y position
   * @returns Final Y position
   */
  const renderTextLines = (renderContext: TextRenderingContext, lines: string[], startY: number): number => {
    let yPosition = startY

    for (const line of lines) {
      if (shouldAddNewPageForLine(yPosition, renderContext.pageHeight)) {
        yPosition = addNewPage(renderContext)
      }

      renderContext.pdf.text(line, SPACING.MARGIN.LEFT, yPosition, { align: 'left' })
      yPosition += SPACING.TEXT.LINE_HEIGHT
    }

    return yPosition
  }

  /**
   * Processes single text element with improved structure
   * @param renderContext - Text rendering context
   * @param text - Text to process
   * @param currentY - Current Y position
   * @returns New Y position
   */
  const processTextElement = (renderContext: TextRenderingContext, text: string, currentY: number): number => {
    const { pdf, maxWidth, pageHeight, context } = renderContext
    const { lines, requiredHeight } = calculateTextMetrics(pdf, text, maxWidth)

    let yPosition = currentY

    // Check if entire text block needs page break
    if (shouldBreakPage(yPosition, requiredHeight, pageHeight, context.headerEndPosition)) {
      yPosition = addNewPage(renderContext)
    }

    // Render lines with page break handling
    return renderTextLines(renderContext, lines, yPosition)
  }

  /**
   * Processes text section for PDF
   * @param pdf - PDF document
   * @param section - Text section to process
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns Final Y position after text
   *
   * Example:
   *   const newY = await processText(pdf, textSection, config, context)
   */
  const processText = async (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ): Promise<number> => {
    try {
      const textElements = section.sectionTexts
      if (!textElements?.length) return context.currentY

      // ✅ Set font BEFORE calculating text metrics
      pdf.setFontSize(FONT_SIZES.BODY)
      pdf.setFont(FONTS.REGULAR, 'normal')

      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const maxWidth = getTextWidth(pageWidth)

      // ✅ Validate calculated maxWidth
      if (maxWidth <= 0) {
        throw new Error(
          `Invalid text width calculated: ${maxWidth}. Page width: ${pageWidth}, Margins: L${SPACING.MARGIN.LEFT}+R${SPACING.MARGIN.RIGHT}`,
        )
      }

      const renderContext: TextRenderingContext = {
        pdf,
        config,
        context,
        pageWidth,
        pageHeight,
        maxWidth,
      }

      let { currentY } = context

      // Process each text element
      for (const text of textElements) {
        currentY = processTextElement(renderContext, text, currentY)
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
