/**
 * PDF text section processing composable - FIXED VERSION
 * Handles text block rendering in PDF documents with proper page break handling
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

export interface UsePdfTextReturn {
  processText: (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ) => Promise<number>
}

export const usePdfText = (): UsePdfTextReturn => {
  const { addHeader } = usePdfHeader()

  /**
   * Calculates text metrics for rendering
   */
  const calculateTextMetrics = (pdf: jsPDF, text: string, maxWidth: number): TextMetrics => {
    const lines = pdf.splitTextToSize(text, maxWidth)
    const requiredHeight = lines.length * SPACING.TEXT.LINE_HEIGHT
    return { lines, requiredHeight }
  }

  /**
   * Calculates available width for text
   */
  const getTextWidth = (pageWidth: number): number => {
    return pageWidth - SPACING.MARGIN.LEFT - SPACING.MARGIN.RIGHT
  }

  /**
   * Calculates available height on current page
   */
  const getAvailableHeight = (currentY: number, pageHeight: number): number => {
    return pageHeight - currentY - SPACING.MARGIN.BOTTOM
  }

  /**
   * Checks if current line needs new page
   */
  const shouldAddNewPageForLine = (yPosition: number, pageHeight: number): boolean => {
    return yPosition + SPACING.TEXT.LINE_HEIGHT > pageHeight - SPACING.MARGIN.BOTTOM
  }

  /**
   * Adds new page with header - FIXED
   */
  const addNewPage = (renderContext: TextRenderingContext): number => {
    const { pdf, config, context } = renderContext
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()

    // ✅ Reset font settings after adding new page
    pdf.setFontSize(FONT_SIZES.BODY)
    pdf.setFont(FONTS.REGULAR, 'normal')

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition + TEXT_CONSTANTS.SPACING_AFTER_HEADER
  }

  /**
   * Renders text lines with improved page break handling - FIXED
   */
  const renderTextLines = (renderContext: TextRenderingContext, lines: string[], startY: number): number => {
    let yPosition = startY

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // ✅ Check if we need a new page for this line
      if (shouldAddNewPageForLine(yPosition, renderContext.pageHeight)) {
        yPosition = addNewPage(renderContext)
      }

      // ✅ Ensure we're still within page bounds after potential page break
      if (yPosition + SPACING.TEXT.LINE_HEIGHT > renderContext.pageHeight - SPACING.MARGIN.BOTTOM) {
        yPosition = addNewPage(renderContext)
      }

      // ✅ Validate line width before rendering
      const lineWidth = renderContext.pdf.getTextWidth(line)
      if (lineWidth > renderContext.maxWidth) {
        // If line is still too long, split it further
        const subLines = renderContext.pdf.splitTextToSize(line, renderContext.maxWidth)
        for (const subLine of subLines) {
          if (shouldAddNewPageForLine(yPosition, renderContext.pageHeight)) {
            yPosition = addNewPage(renderContext)
          }
          renderContext.pdf.text(subLine, SPACING.MARGIN.LEFT, yPosition, { align: 'left' })
          yPosition += SPACING.TEXT.LINE_HEIGHT
        }
      } else {
        // ✅ Render line with proper positioning
        renderContext.pdf.text(line, SPACING.MARGIN.LEFT, yPosition, {
          align: 'left',
          maxWidth: renderContext.maxWidth, // ✅ Explicit maxWidth constraint
        })
        yPosition += SPACING.TEXT.LINE_HEIGHT
      }
    }

    return yPosition
  }

  /**
   * Processes single text element with improved page break logic - FIXED
   */
  const processTextElement = (renderContext: TextRenderingContext, text: string, currentY: number): number => {
    const { pdf, maxWidth } = renderContext

    // ✅ Pre-validate text width
    const textWidth = pdf.getTextWidth(text)
    if (textWidth <= maxWidth) {
      // Text fits in one line, simple case
      const { lines } = calculateTextMetrics(pdf, text, maxWidth)
      return renderTextLines(renderContext, lines, currentY)
    }

    // ✅ Text needs wrapping, calculate metrics properly
    const { lines } = calculateTextMetrics(pdf, text, maxWidth)

    // ✅ Double-check each line fits within bounds
    const validatedLines: string[] = []
    for (const line of lines) {
      const lineWidth = pdf.getTextWidth(line)
      if (lineWidth > maxWidth) {
        // Further split oversized lines
        const subLines = pdf.splitTextToSize(line, maxWidth)
        validatedLines.push(...subLines)
      } else {
        validatedLines.push(line)
      }
    }

    return renderTextLines(renderContext, validatedLines, currentY)
  }

  /**
   * Enhanced text width validation - NEW
   */
  const validateTextWidth = (pdf: jsPDF, maxWidth: number): void => {
    const sampleText = 'Sample text for width validation'
    const sampleWidth = pdf.getTextWidth(sampleText)
    const ratio = sampleWidth / sampleText.length

    // ✅ Check if maxWidth is reasonable
    if (maxWidth < ratio * 10) {
      // Minimum 10 characters worth of space
      throw new Error(`Text width too small: ${maxWidth}. May cause overflow issues.`)
    }
  }

  /**
   * Main text processing function - ENHANCED
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

      // ✅ Set font BEFORE any calculations
      pdf.setFontSize(FONT_SIZES.BODY)
      pdf.setFont(FONTS.REGULAR, 'normal')

      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const maxWidth = getTextWidth(pageWidth)

      // ✅ Enhanced width validation
      if (maxWidth <= 0) {
        throw new Error(
          `Invalid text width: ${maxWidth}. Page: ${pageWidth}, Margins: L${SPACING.MARGIN.LEFT}+R${SPACING.MARGIN.RIGHT}`,
        )
      }

      // ✅ Validate text width is practical
      validateTextWidth(pdf, maxWidth)

      const renderContext: TextRenderingContext = {
        pdf,
        config,
        context,
        pageWidth,
        pageHeight,
        maxWidth,
      }

      let { currentY } = context

      // ✅ Process each text element with enhanced error handling
      for (let i = 0; i < textElements.length; i++) {
        const text = textElements[i]

        try {
          currentY = processTextElement(renderContext, text, currentY)
          // Add spacing between text elements
          currentY += SPACING.TEXT.PARAGRAPH
        } catch (elementError) {
          console.warn(`Failed to process text element ${i}:`, elementError)
          // Continue with next element
          continue
        }
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
