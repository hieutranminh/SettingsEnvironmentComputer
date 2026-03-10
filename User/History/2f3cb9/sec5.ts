/**
 * PDF text rendering utilities
 * Handles mixed text formatting (bold, normal) in PDFs
 *
 * Example usage:
 *   const { renderMixedText } = usePdfTextRenderer()
 *   renderMixedText(pdf, 'Normal <b>Bold</b> text', x, y)
 */

import type jsPDF from 'jspdf'

import { PDF_FONT_FAMILIES } from '../constants/pdf'
import { splitByBoldTags } from '../utils/htmlParser'

/**
 * Text alignment options
 */
export type TextAlignment = 'left' | 'center' | 'right' | 'justify'

/**
 * Text rendering options
 */
export interface TextRenderOptions {
  align?: TextAlignment
}

/**
 * PDF text renderer composable return type
 */
export interface UsePdfTextRendererReturn {
  renderMixedText: (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions) => number
  renderPlainText: (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions) => void
}

/**
 * Composable for PDF text rendering
 * @returns PDF text rendering utilities
 */
export const usePdfTextRenderer = (): UsePdfTextRendererReturn => {
  /**
   * Renders plain text without formatting
   * @param pdf - PDF document
   * @param text - Text to render
   * @param x - X position
   * @param y - Y position
   * @param options - Rendering options
   */
  const renderPlainText = (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions): void => {
    pdf.text(text, x, y, options)
  }

  /**
   * Renders text with mixed formatting (bold/normal)
   * @param pdf - PDF document
   * @param text - Text containing <b> tags
   * @param x - X position
   * @param y - Y position
   * @param options - Rendering options
   * @returns Final X position after rendering
   *
   * Example:
   *   renderMixedText(pdf, 'Total: <b>100</b> items', 30, 100)
   */
  const renderMixedText = (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions): number => {
    console.log('renderMixedText', text)
    // Save current font state
    const currentFontSize = pdf.getFontSize()
    const currentFont = pdf.getFont()

    // Split text by bold tags
    const parts = splitByBoldTags(text)
    let currentX = x

    // Render each part with appropriate formatting
    parts.forEach((part) => {
      if (part.isBold) {
        pdf.setFont(PDF_FONT_FAMILIES.BOLD, 'bold')
      } else {
        pdf.setFont(PDF_FONT_FAMILIES.REGULAR, 'normal')
      }

      pdf.text(part.text, currentX, y, options)
      currentX += pdf.getTextWidth(part.text)
    })

    // Restore original font settings
    pdf.setFontSize(currentFontSize)
    pdf.setFont(currentFont.fontName, currentFont.fontStyle)

    return currentX
  }

  return {
    renderMixedText,
    renderPlainText,
  }
}
