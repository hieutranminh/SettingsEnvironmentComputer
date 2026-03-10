/**
 * PDF canvas processing composable
 * Handles canvas/chart rendering in PDF documents
 *
 * Example usage:
 *   const { processCanvas } = usePdfCanvas()
 *   const newY = await processCanvas(pdf, section, currentY)
 */

import html2canvas from 'html2canvas'
import type jsPDF from 'jspdf'

import type { IPrintSection, IPdfConfig, IPdfProcessingContext } from '@/types/print'

import { PDF_CANVAS_CONFIG, PDF_MARGINS, PDF_IMAGE_CONFIG } from '../constants/pdf'

import { usePdfHeader } from './usePdfHeader'

/**
 * Canvas dimensions for PDF
 */
interface ICanvasDimensions {
  originalWidth: number
  originalHeight: number
  scaledWidth: number
  scaledHeight: number
  aspectRatio: number
}

/**
 * PDF canvas composable return type
 */
export interface IUsePdfCanvasReturn {
  processCanvas: (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ) => Promise<number>
}

/**
 * Composable for PDF canvas processing
 * @returns PDF canvas processing utilities
 */
export const usePdfCanvas = (): IUsePdfCanvasReturn => {
  const { addHeader } = usePdfHeader()
  /**
   * Converts HTML element to canvas
   * @param element - HTML element to convert
   * @returns Canvas element
   */
  const convertToCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return html2canvas(element, {
      scale: PDF_CANVAS_CONFIG.SCALE,
      useCORS: PDF_CANVAS_CONFIG.USE_CORS,
      allowTaint: PDF_CANVAS_CONFIG.ALLOW_TAINT,
      logging: PDF_CANVAS_CONFIG.LOGGING,
      backgroundColor: PDF_CANVAS_CONFIG.BACKGROUND_COLOR,
    })
  }

  /**
   * Calculates canvas dimensions for PDF
   * @param canvas - Canvas element
   * @param maxWidth - Maximum width in PDF
   * @param maxHeight - Maximum height in PDF
   * @returns Calculated dimensions
   */
  const calculateDimensions = (
    canvas: HTMLCanvasElement,
    maxWidth: number,
    maxHeight: number,
  ): ICanvasDimensions => {
    // Convert pixel to point using standard ratio
    const originalWidth = PDF_IMAGE_CONFIG.PIXEL_TO_POINT_RATIO * canvas.width
    const originalHeight = PDF_IMAGE_CONFIG.PIXEL_TO_POINT_RATIO * canvas.height
    const aspectRatio = originalHeight / originalWidth

    let scaledWidth = originalWidth
    let scaledHeight = originalHeight

    // Scale down if needed while maintaining aspect ratio
    if (originalWidth > maxWidth) {
      scaledWidth = maxWidth
      scaledHeight = scaledWidth * aspectRatio
    }

    if (scaledHeight > maxHeight) {
      scaledHeight = maxHeight
      scaledWidth = scaledHeight / aspectRatio
    }

    return {
      originalWidth,
      originalHeight,
      scaledWidth,
      scaledHeight,
      aspectRatio,
    }
  }

  /**
   * Checks if new page is needed for canvas
   * @param currentY - Current Y position
   * @param canvasHeight - Canvas height
   * @param pageHeight - Page height
   * @returns True if new page is needed
   */
  const needsNewPage = (currentY: number, canvasHeight: number, pageHeight: number): boolean => {
    const remainingHeight = pageHeight - currentY - PDF_MARGINS.BOTTOM
    return (
      remainingHeight < PDF_CANVAS_CONFIG.MIN_HEIGHT_FOR_CURRENT_PAGE ||
      canvasHeight > remainingHeight
    )
  }

  /**
   * Processes canvas section for PDF
   * @param pdf - PDF document
   * @param section - Canvas section to process
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns Final Y position after canvas
   *
   * Example:
   *   const newY = await processCanvas(pdf, canvasSection, config, context)
   */
  const processCanvas = async (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ): Promise<number> => {
    try {
      const element = section.sectionRef as HTMLElement

      // Convert to canvas
      const canvas = await convertToCanvas(element)

      // Get document dimensions
      const docWidth = pdf.internal.pageSize.width
      const docHeight = pdf.internal.pageSize.height
      const maxCanvasWidth = docWidth * PDF_CANVAS_CONFIG.MAX_WIDTH_RATIO
      const maxCanvasHeight = docHeight * PDF_CANVAS_CONFIG.MAX_HEIGHT_RATIO

      // Calculate dimensions
      const dimensions = calculateDimensions(canvas, maxCanvasWidth, maxCanvasHeight)

      // Check if new page needed
      let { currentY } = context
      if (needsNewPage(currentY, dimensions.scaledHeight, docHeight)) {
        pdf.addPage()
        currentY = addHeader(pdf, config, PDF_MARGINS.TOP)
      }

      // Calculate center position
      const xPosition = (docWidth - dimensions.scaledWidth) / PDF_CANVAS_CONFIG.CENTER_DIVISOR

      // Add image to PDF
      pdf.addImage(
        canvas,
        PDF_IMAGE_CONFIG.DEFAULT_FORMAT,
        xPosition,
        currentY,
        dimensions.scaledWidth,
        dimensions.scaledHeight,
      )

      return currentY + dimensions.scaledHeight
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to process canvas: ${message}`)
    }
  }

  return {
    processCanvas,
  }
}
