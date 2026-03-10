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
export interface ITextRenderOptions {
  align?: TextAlignment
}

/**
 * Text rendering parameters
 */
export interface ITextRenderParams {
  pdf: jsPDF
  text: string
  xPosition: number
  yPosition: number
  options?: ITextRenderOptions
}
/**
 * Font state interface for save/restore operations
 */
export interface IFontState {
  fontName: string
  fontStyle: string
  fontSize: number
}
/**
 * Text part with formatting information
 */
export interface ITextPart {
  text: string
  isBold: boolean
}
/**
 * PDF text renderer composable return type
 */
export interface IUsePdfTextRendererReturn {
  renderMixedText: (params: ITextRenderParams) => number
  renderPlainText: (params: ITextRenderParams) => void
}
/**
 * Validates input parameters for text rendering functions
 * @param params - Text rendering parameters
 * @throws Error if any parameter is invalid
 */
const validateInputs = (params: ITextRenderParams): void => {
  const { pdf, text, xPosition, yPosition } = params
  
  if (!pdf) {
    throw new Error('PDF document is required')
  }
  if (typeof text !== 'string') {
    throw new Error('Text must be a string')
  }
  if (typeof xPosition !== 'number' || typeof yPosition !== 'number') {
    throw new Error('Coordinates must be numbers')
  }
  if (!isFinite(xPosition) || !isFinite(yPosition)) {
    throw new Error('Coordinates must be finite numbers')
  }
}
/**
 * Saves current font state from PDF document
 * @param pdf - PDF document
 * @returns Current font state
 */
const saveFontState = (pdf: jsPDF): IFontState => {
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
const restoreFontState = (pdf: jsPDF, state: IFontState): void => {
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
const validateTextParts = (parts: ITextPart[]): void => {
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error('Invalid text parts from splitByBoldTags')
  }
  const hasInvalidPart = parts.some(
    (part) => typeof part.text !== 'string' || typeof part.isBold !== 'boolean',
  )
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
 * @param xPosition - Starting X position
 * @param yPosition - Y position
 * @param options - Rendering options
 * @returns Final X position after rendering all parts
 */
const renderTextParts = (
  pdf: jsPDF,
  parts: ITextPart[],
  xPosition: number,
  yPosition: number,
  options?: ITextRenderOptions,
): number => {
  let currentX = xPosition
  parts.forEach((part) => {
    setFontForPart(pdf, part.isBold)
    pdf.text(part.text, currentX, yPosition, options)
    currentX += pdf.getTextWidth(part.text)
  })
  return currentX
}
/**
 * Composable for PDF text rendering
 * @returns PDF text rendering utilities
 */
export const usePdfTextRenderer = (): IUsePdfTextRendererReturn => {
  /**
   * Renders plain text without formatting with input validation
   * @param params - Text rendering parameters
   * @throws Error if inputs are invalid
   */
  const renderPlainText = (params: ITextRenderParams): void => {
    const { pdf, text, xPosition, yPosition, options } = params
    validateInputs(params)
    pdf.text(text, xPosition, yPosition, options)
  }
  /**
   * Renders text with mixed formatting (bold/normal) with comprehensive error handling
   * @param params - Text rendering parameters
   * @returns Final X position after rendering
   * @throws Error if inputs are invalid or rendering fails
   *
   * Example:
   *   renderMixedText({ pdf, text: 'Total: <b>100</b> items', xPosition: 30, yPosition: 100 })
   */
  const renderMixedText = (params: ITextRenderParams): number => {
    const { pdf, text, xPosition, yPosition, options } = params
    
    // Validate all inputs before processing
    validateInputs(params)
    // Save current font state for restoration
    const originalState = saveFontState(pdf)
    try {
      // Parse text and validate the result
      const parts = splitByBoldTags(text)
      validateTextParts(parts)
      // Render all text parts with appropriate formatting
      return renderTextParts(pdf, parts, xPosition, yPosition, options)
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
