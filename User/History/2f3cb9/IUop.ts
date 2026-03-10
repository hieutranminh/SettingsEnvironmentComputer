/**
 * PDF text rendering utilities
 * Handles mixed text formatting (bold, normal) in PDFs with comprehensive error handling
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
 * Font state interface for save/restore operations
 */
export interface FontState {
  fontName: string
  fontStyle: string
  fontSize: number
}
/**
 * Text part with formatting information
 */
export interface TextPart {
  text: string
  isBold: boolean
}
/**
 * PDF text renderer composable return type
 */
export interface UsePdfTextRendererReturn {
  renderMixedText: (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions) => number
  renderPlainText: (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions) => void
}
/**
 * Validates input parameters for text rendering functions
 * @param pdf - PDF document instance
 * @param text - Text content to validate
 * @param x - X coordinate
 * @param y - Y coordinate
 * @throws Error if any parameter is invalid
 */
const validateInputs = (pdf: jsPDF, text: string, x: number, y: number): void => {
  if (!pdf) {
    throw new Error('PDF document is required')
  }
  if (typeof text !== 'string') {
    throw new Error('Text must be a string')
  }
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error('Coordinates must be numbers')
  }
  if (!isFinite(x) || !isFinite(y)) {
    throw new Error('Coordinates must be finite numbers')
  }
}
/**
 * Saves current font state from PDF document
 * @param pdf - PDF document
 * @returns Current font state
 */
const saveFontState = (pdf: jsPDF): FontState => {
  const currentFont = pdf.getFont()
  return {
    fontName: currentFont.fontName,
    fontStyle: currentFont.fontStyle,
    fontSize: pdf.getFontSize(),
  }
}
/**
 * Restores font state to PDF document
 * @param pdf - PDF document
 * @param state - Font state to restore
 */
const restoreFontState = (pdf: jsPDF, state: FontState): void => {
  try {
    pdf.setFontSize(state.fontSize)
    pdf.setFont(state.fontName, state.fontStyle)
  } catch {
    // Silently handle font restoration errors to avoid breaking the rendering process
    // In production, this could be logged to an external logging service
  }
}
/**
 * Validates text parts array from HTML parsing
 * @param parts - Array of text parts to validate
 * @throws Error if parts array is invalid
 */
const validateTextParts = (parts: TextPart[]): void => {
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error('Invalid text parts from splitByBoldTags')
  }
  const hasInvalidPart = parts.some((part) => typeof part.text !== 'string' || typeof part.isBold !== 'boolean')
  if (hasInvalidPart) {
    throw new Error('Text parts have invalid structure')
  }
}
/**
 * Sets appropriate font for text part based on formatting
 * @param pdf - PDF document
 * @param isBold - Whether text should be bold
 */
const setFontForPart = (pdf: jsPDF, isBold: boolean): void => {
  if (isBold) {
    pdf.setFont(PDF_FONT_FAMILIES.BOLD, 'bold')
  } else {
    pdf.setFont(PDF_FONT_FAMILIES.REGULAR, 'normal')
  }
}
/**
 * Renders array of text parts with appropriate formatting
 * @param pdf - PDF document
 * @param parts - Array of text parts to render
 * @param x - Starting X position
 * @param y - Y position
 * @param options - Rendering options
 * @returns Final X position after rendering all parts
 */
const renderTextParts = (pdf: jsPDF, parts: TextPart[], x: number, y: number, options?: TextRenderOptions): number => {
  let currentX = x
  parts.forEach((part) => {
    setFontForPart(pdf, part.isBold)
    pdf.text(part.text, currentX, y, options)
    currentX += pdf.getTextWidth(part.text)
  })
  return currentX
}
/**
 * Composable for PDF text rendering
 * @returns PDF text rendering utilities
 */
export const usePdfTextRenderer = (): UsePdfTextRendererReturn => {
  /**
   * Renders plain text without formatting with input validation
   * @param pdf - PDF document
   * @param text - Text to render
   * @param x - X position
   * @param y - Y position
   * @param options - Rendering options
   * @throws Error if inputs are invalid
   */
  const renderPlainText = (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions): void => {
    validateInputs(pdf, text, x, y)
    pdf.text(text, x, y, options)
  }
  /**
   * Renders text with mixed formatting (bold/normal) with comprehensive error handling
   * @param pdf - PDF document
   * @param text - Text containing <b> tags
   * @param x - X position
   * @param y - Y position
   * @param options - Rendering options
   * @returns Final X position after rendering
   * @throws Error if inputs are invalid or rendering fails
   *
   * Example:
   *   renderMixedText(pdf, 'Total: <b>100</b> items', 30, 100)
   */
  const renderMixedText = (pdf: jsPDF, text: string, x: number, y: number, options?: TextRenderOptions): number => {
    // Validate all inputs before processing
    validateInputs(pdf, text, x, y)

    // If text doesn't contain bold tags, use simple rendering
    if (!text.includes('<b>') && !text.includes('</b>')) {
      renderPlainText(pdf, text, x, y, options)
      return x + pdf.getTextWidth(text)
    }

    // Save current font state for restoration
    const originalState = saveFontState(pdf)
    try {
      // Parse text and validate the result
      const parts = splitByBoldTags(text)
      validateTextParts(parts)
      // Render all text parts with appropriate formatting
      return renderTextParts(pdf, parts, x, y, options)
    } catch (error) {
      // Restore font state before re-throwing error
      restoreFontState(pdf, originalState)
      throw error
    } finally {
      // Always restore original font state
      restoreFontState(pdf, originalState)
    }
  }
  return {
    renderMixedText,
    renderPlainText,
  }
}
