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

import type { PrintSection, PdfConfig } from '@/types/print'

import { CANVAS_CONFIG, SPACING } from '../constants'

import { usePdfHeader } from './usePdfHeader'

/**
 * Canvas dimensions for PDF
 */
interface CanvasDimensions {
  originalWidth: number
  originalHeight: number
  scaledWidth: number
  scaledHeight: number
  aspectRatio: number
}

/**
 * PDF canvas composable return type
 */
export interface UsePdfCanvasReturn {
  processCanvas: (pdf: jsPDF, section: PrintSection, startY: number, config: Required<PdfConfig>) => Promise<number>
}

/**
 * Composable for PDF canvas processing
 * @returns PDF canvas processing utilities
 */
export const usePdfCanvas = (): UsePdfCanvasReturn => {
  const { addHeader } = usePdfHeader()

  /**
   * Converts HTML element to canvas
   * @param element - HTML element to convert
   * @returns Canvas element
   */
  const convertToCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return html2canvas(element, {
      scale: CANVAS_CONFIG.HTML2CANVAS_SCALE,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
  }

  /**
   * Calculates canvas dimensions for PDF
   * @param canvas - Canvas element
   * @param maxWidth - Maximum width in PDF
   * @param maxHeight - Maximum height in PDF
   * @returns Calculated dimensions
   */
  const calculateDimensions = (canvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): CanvasDimensions => {
    // Convert pixel to point (pt = 3/4 * px)
    const originalWidth = (3 / 4) * canvas.width
    const originalHeight = (3 / 4) * canvas.height
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
    const remainingHeight = pageHeight - currentY - SPACING.MARGIN.BOTTOM
    return remainingHeight < CANVAS_CONFIG.MIN_HEIGHT_FOR_CURRENT_PAGE || canvasHeight > remainingHeight
  }

  /**
   * Processes canvas section for PDF
   * @param pdf - PDF document
   * @param section - Canvas section to process
   * @param startY - Starting Y position
   * @param config - PDF configuration
   * @returns Final Y position after canvas
   *
   * Example:
   *   const newY = await processCanvas(pdf, canvasSection, 100)
   */
  const processCanvas = async (
    pdf: jsPDF,
    section: PrintSection,
    startY: number,
    config: Required<PdfConfig>,
  ): Promise<number> => {
    try {
      const element = section.sectionRef as HTMLElement

      // Convert to canvas
      const canvas = await convertToCanvas(element)

      // Get document dimensions
      const docWidth = pdf.internal.pageSize.width
      const docHeight = pdf.internal.pageSize.height
      const maxCanvasWidth = docWidth * CANVAS_CONFIG.MAX_WIDTH_RATIO
      const maxCanvasHeight = docHeight * CANVAS_CONFIG.MAX_HEIGHT_RATIO

      // Calculate dimensions
      const dimensions = calculateDimensions(canvas, maxCanvasWidth, maxCanvasHeight)

      // Check if new page needed
      let currentY = startY
      if (needsNewPage(currentY, dimensions.scaledHeight, docHeight)) {
        pdf.addPage()
        currentY = config ? addHeader(pdf, config, SPACING.MARGIN.TOP) : 40
      }

      // Calculate center position
      const xPosition = (docWidth - dimensions.scaledWidth) / 2

      // Add image to PDF
      pdf.addImage(canvas, 'JPEG', xPosition, currentY, dimensions.scaledWidth, dimensions.scaledHeight)

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
