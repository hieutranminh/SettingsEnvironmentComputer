/**
 * IMPROVED VERSION - Example refactor of problematic areas
 */

import type jsPDF from 'jspdf'
import type { PrintSection, PdfConfig, PdfProcessingContext } from '@/types/print'
import { FONTS } from '@/utils/fontUtils'
import { SPACING, FONT_SIZES } from '../constants'

// Add missing constants
const TEXT_PROCESSING = {
  AFTER_HEADER_SPACING: 10,
  MIN_SPACE_FOR_NEW_PAGE: 50,
} as const

// Improved interface for text rendering context
interface TextRenderContext {
  pdf: jsPDF
  config: Required<PdfConfig>
  context: PdfProcessingContext
  maxWidth: number
  pageHeight: number
}

export const usePdfTextImproved = () => {
  // Extracted: Calculate if new page is needed
  const shouldStartNewPage = (
    requiredHeight: number, 
    availableHeight: number, 
    currentY: number, 
    headerEndPosition: number
  ): boolean => {
    return requiredHeight > availableHeight && 
           currentY > headerEndPosition + TEXT_PROCESSING.MIN_SPACE_FOR_NEW_PAGE
  }

  // Extracted: Calculate text metrics
  const calculateTextMetrics = (pdf: jsPDF, text: string, maxWidth: number) => {
    const lines = pdf.splitTextToSize(text, maxWidth)
    const requiredHeight = lines.length * SPACING.TEXT.LINE_HEIGHT
    return { lines, requiredHeight }
  }

  // Extracted: Add new page with proper spacing
  const addPageWithHeader = (renderContext: TextRenderContext): number => {
    const { pdf, config, context } = renderContext
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition + TEXT_PROCESSING.AFTER_HEADER_SPACING
  }

  // Simplified: Render text lines
  const renderTextLines = (renderContext: TextRenderContext, lines: string[], startY: number): number => {
    const { pdf, pageHeight } = renderContext
    let yPosition = startY

    for (const line of lines) {
      if (yPosition + SPACING.TEXT.LINE_HEIGHT > pageHeight - SPACING.MARGIN.BOTTOM) {
        yPosition = addPageWithHeader(renderContext)
      }

      pdf.text(line, SPACING.MARGIN.LEFT, yPosition, { align: 'left' })
      yPosition += SPACING.TEXT.LINE_HEIGHT
    }

    return yPosition
  }

  // Much simpler main function
  const processTextElement = (renderContext: TextRenderContext, text: string, currentY: number): number => {
    const { pdf, maxWidth, pageHeight, context } = renderContext
    
    // Calculate what we need
    const { lines, requiredHeight } = calculateTextMetrics(pdf, text, maxWidth)
    const availableHeight = pageHeight - currentY - SPACING.MARGIN.BOTTOM
    
    // Check if we need a new page for the entire block
    let yPosition = currentY
    if (shouldStartNewPage(requiredHeight, availableHeight, currentY, context.headerEndPosition)) {
      yPosition = addPageWithHeader(renderContext)
    }

    // Render the lines
    return renderTextLines(renderContext, lines, yPosition)
  }

  const processText = async (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ): Promise<number> => {
    try {
      const textElements = section.sectionTexts
      if (!textElements?.length) return context.currentY

      // Setup render context (reduces parameter passing)
      const renderContext: TextRenderContext = {
        pdf,
        config,
        context,
        maxWidth: pdf.internal.pageSize.width - SPACING.MARGIN.LEFT - SPACING.MARGIN.RIGHT,
        pageHeight: pdf.internal.pageSize.height,
      }

      // Set font once
      pdf.setFontSize(FONT_SIZES.BODY)
      pdf.setFont(FONTS.REGULAR, 'normal')

      let currentY = context.currentY

      // Process each text element (much cleaner now)
      for (const text of textElements) {
        currentY = processTextElement(renderContext, text, currentY)
        currentY += SPACING.TEXT.PARAGRAPH
      }

      return currentY
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to process text section: ${message}`)
    }
  }

  return { processText }
}
