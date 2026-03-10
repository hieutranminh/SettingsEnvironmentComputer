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

import { PDF_MARGINS, PDF_TEXT_SPACING, PDF_FONT_SIZES, PDF_TEXT_RENDERING, PDF_FONT_FAMILIES } from '../constants/pdf'

import { usePdfHeader } from './usePdfHeader'

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
   * Sets default font configuration for text rendering
   * @param pdf - PDF document
   */
  const setDefaultFont = (pdf: jsPDF): void => {
    pdf.setFontSize(PDF_FONT_SIZES.BODY_TEXT)
    pdf.setFont(PDF_FONT_FAMILIES.REGULAR, 'normal')
  }

  /**
   * Gets dynamic line height based on font size
   * @param pdf - PDF document
   * @returns Calculated line height
   */
  const getLineHeight = (pdf: jsPDF): number => {
    const fontSize = pdf.getFontSize()
    // Calculate dynamic line height based on font size (usually 1.2 - 1.5 times the font size)
    return fontSize * PDF_TEXT_RENDERING.LINE_HEIGHT_MULTIPLIER
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
    return pageWidth - PDF_MARGINS.LEFT - PDF_MARGINS.RIGHT
  }

  /**
   * Calculates available height on current page
   * @param currentY - Current Y position
   * @param pageHeight - Page height
   * @returns Available height
   */
  const getAvailableHeight = (currentY: number, pageHeight: number): number => {
    // Subtract buffer to avoid text overflow
    return pageHeight - currentY - PDF_MARGINS.BOTTOM - PDF_TEXT_RENDERING.PAGE_BREAK_BUFFER
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

    // Early return: not enough space for any text
    if (availableHeight < PDF_TEXT_RENDERING.MIN_SPACE_FOR_TEXT) {
      return true
    }

    // Early return: text fits in available space
    if (requiredHeight <= availableHeight) {
      return false
    }

    // Text doesn't fit, but only break if it's substantial enough
    return requiredHeight > PDF_TEXT_RENDERING.MIN_SPACE_FOR_TEXT
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
    const bottomLimit = pageHeight - PDF_MARGINS.BOTTOM - PDF_TEXT_RENDERING.PAGE_BREAK_BUFFER
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
    setDefaultFont(pdf)

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, PDF_MARGINS.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition + PDF_TEXT_RENDERING.SPACING_AFTER_HEADER
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
        setDefaultFont(pdf)
      }

      // Render line with proper alignment
      pdf.text(line, PDF_MARGINS.LEFT, yPosition, {
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

    // Early return: no page break needed
    if (!shouldBreakPage(currentY, requiredHeight, pageHeight)) {
      return renderTextLines(renderContext, lines, currentY, lineHeight)
    }

    // Page break needed - add new page and reset font
    const yPosition = addNewPage(renderContext)
    setDefaultFont(pdf)

    // Render lines with improved page break handling
    return renderTextLines(renderContext, lines, yPosition, lineHeight)
  }

  /**
   * Validates and prepares PDF dimensions
   * @param pdf - PDF document
   * @returns Page dimensions and max width
   */
  const preparePdfDimensions = (pdf: jsPDF): { pageWidth: number; pageHeight: number; maxWidth: number } => {
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    const maxWidth = getTextWidth(pageWidth)

    if (maxWidth <= 0) {
      throw new Error(
        `Invalid text width: ${maxWidth}. Page: ${pageWidth}, Margins: L${PDF_MARGINS.LEFT}+R${PDF_MARGINS.RIGHT}`,
      )
    }

    return { pageWidth, pageHeight, maxWidth }
  }

  /**
   * Processes text elements with proper spacing
   * @param renderContext - Text rendering context
   * @param textElements - Array of text elements to process
   * @returns Final Y position after processing all elements
   */
  const processTextElements = (renderContext: TextRenderingContext, textElements: string[]): number => {
    const {
      pageHeight,
      context: { currentY: initialY },
    } = renderContext
    let currentY = initialY

    for (let i = 0; i < textElements.length; i++) {
      const text = textElements[i]

      // Skip empty text elements
      if (!text || !text.trim()) continue

      currentY = processTextElement(renderContext, text, currentY)

      // Add paragraph spacing (no spacing after the last element)
      if (i < textElements.length - 1) {
        currentY += PDF_TEXT_SPACING.PARAGRAPH

        // Check if paragraph spacing pushes to the next page
        if (shouldAddNewPageForLine(currentY, 0, pageHeight)) {
          currentY = addNewPage(renderContext)
        }
      }
    }

    return currentY
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
      setDefaultFont(pdf)

      const { pageWidth, pageHeight, maxWidth } = preparePdfDimensions(pdf)

      const renderContext: TextRenderingContext = {
        pdf,
        config,
        context,
        pageWidth,
        pageHeight,
        maxWidth,
      }

      const finalY = processTextElements(renderContext, textElements)

      // Update context with new Y position
      context.currentY = finalY

      return finalY
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to process text section: ${message}`)
    }
  }

  return {
    processText,
  }
}
