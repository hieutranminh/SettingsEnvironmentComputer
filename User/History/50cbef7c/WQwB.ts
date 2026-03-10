/**
 * PDF text section processing composable
 * Handles text block rendering in PDF documents with improved page break handling
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
  // Add buffer to avoid text being cut off at the end of the page
  PAGE_BREAK_BUFFER: 20,
  // Minimum height required before deciding to break the page
  MIN_SPACE_FOR_TEXT: 40,
  // Line height multiplier for dynamic calculation
  LINE_HEIGHT_MULTIPLIER: 1.35,
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
  lineHeight: number
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
   * Gets dynamic line height based on font size
   * @param pdf - PDF document
   * @returns Calculated line height
   */
  const getLineHeight = (pdf: jsPDF): number => {
    const fontSize = pdf.getFontSize()
    // Calculate dynamic line height based on font size (usually 1.2 - 1.5 times the font size)
    return fontSize * 1.35
  }

  /**
   * Calculates text metrics for rendering
   * @param pdf - PDF document
   * @param text - Text to analyze
   * @param maxWidth - Maximum text width
   * @returns Text lines and required height
   */
  const calculateTextMetrics = (pdf: jsPDF, text: string, maxWidth: number): TextMetrics => {
    const lines = pdf.splitTextToSize(text, maxWidth)
    const lineHeight = getLineHeight(pdf)
    const requiredHeight = lines.length * lineHeight
    return { lines, requiredHeight, lineHeight }
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
    // Subtract buffer to avoid text overflow
    return pageHeight - currentY - SPACING.MARGIN.BOTTOM - TEXT_CONSTANTS.PAGE_BREAK_BUFFER
  }

  /**
   * Determines if a page break is needed
   * @param currentY - Current Y position
   * @param requiredHeight - Height needed for text
   * @param pageHeight - Page height
   * @returns True if page break needed
   */
  const shouldBreakPage = (currentY: number, requiredHeight: number, pageHeight: number): boolean => {
    const availableHeight = getAvailableHeight(currentY, pageHeight)

    // If not enough space or too close to the bottom of the page
    if (availableHeight < TEXT_CONSTANTS.MIN_SPACE_FOR_TEXT) {
      return true
    }

    // If the text block does not fit in the remaining space
    if (requiredHeight > availableHeight) {
      // Only break if the text block is too long
      // Avoid breaking for short text blocks
      return requiredHeight > TEXT_CONSTANTS.MIN_SPACE_FOR_TEXT
    }

    return false
  }

  /**
   * Checks if current line needs new page
   * @param yPosition - Current Y position
   * @param lineHeight - Height of one line
   * @param pageHeight - Page height
   * @returns True if new page needed
   */
  const shouldAddNewPageForLine = (yPosition: number, lineHeight: number, pageHeight: number): boolean => {
    // Check with buffer to avoid overflow
    const bottomLimit = pageHeight - SPACING.MARGIN.BOTTOM - TEXT_CONSTANTS.PAGE_BREAK_BUFFER
    return yPosition + lineHeight > bottomLimit
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

    // Ensure consistent font after page break
    pdf.setFontSize(FONT_SIZES.BODY)
    pdf.setFont(FONTS.REGULAR, 'normal')

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition + TEXT_CONSTANTS.SPACING_AFTER_HEADER
  }

  /**
   * Renders text lines with improved page break handling
   * @param renderContext - Text rendering context
   * @param lines - Text lines to render
   * @param startY - Starting Y position
   * @param lineHeight - Height of each line
   * @returns Final Y position
   */
  const renderTextLines = (
    renderContext: TextRenderingContext,
    lines: string[],
    startY: number,
    lineHeight: number,
  ): number => {
    let yPosition = startY
    const { pdf, pageHeight } = renderContext

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Check if we need to break the page
      if (shouldAddNewPageForLine(yPosition, lineHeight, pageHeight)) {
        yPosition = addNewPage(renderContext)

        // Ensure font consistency after page break
        pdf.setFontSize(FONT_SIZES.BODY)
        pdf.setFont(FONTS.REGULAR, 'normal')
      }

      // Render line with proper alignment
      pdf.text(line, SPACING.MARGIN.LEFT, yPosition, {
        align: 'left',
        maxWidth: renderContext.maxWidth,
      })

      yPosition += lineHeight
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
    const { pdf, maxWidth, pageHeight } = renderContext

    // Trim text to avoid extra whitespace
    const trimmedText = text.trim()
    if (!trimmedText) return currentY

    const { lines, requiredHeight, lineHeight } = calculateTextMetrics(pdf, trimmedText, maxWidth)

    let yPosition = currentY

    // Check if we need to break the page for the entire text block
    if (shouldBreakPage(yPosition, requiredHeight, pageHeight)) {
      yPosition = addNewPage(renderContext)

      // Reset font after page break
      pdf.setFontSize(FONT_SIZES.BODY)
      pdf.setFont(FONTS.REGULAR, 'normal')
    }

    // Render lines with improved page break handling
    return renderTextLines(renderContext, lines, yPosition, lineHeight)
  }

  /**
   * Processes text section for PDF
   * @param pdf - PDF document
   * @param section - Text section to process
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns Final Y position after text
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

      // Ensure font consistency from the beginning
      pdf.setFontSize(FONT_SIZES.BODY)
      pdf.setFont(FONTS.REGULAR, 'normal')

      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const maxWidth = getTextWidth(pageWidth)

      if (maxWidth <= 0) {
        throw new Error(
          `Invalid text width: ${maxWidth}. Page: ${pageWidth}, Margins: L${SPACING.MARGIN.LEFT}+R${SPACING.MARGIN.RIGHT}`,
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

      // Process each text element with better spacing
      for (let i = 0; i < textElements.length; i++) {
        const text = textElements[i]

        // Skip empty text elements
        if (!text || !text.trim()) continue

        currentY = processTextElement(renderContext, text, currentY)

        // Add paragraph spacing (no spacing after the last element)
        if (i < textElements.length - 1) {
          currentY += SPACING.TEXT.PARAGRAPH

          // Check if paragraph spacing pushes to the next page
          if (shouldAddNewPageForLine(currentY, 0, pageHeight)) {
            currentY = addNewPage(renderContext)
          }
        }
      }

      // Update context with new Y position
      context.currentY = currentY

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
