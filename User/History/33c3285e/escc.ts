/**
 * Main PDF generation composable
 * Coordinates PDF creation from multiple sections
 *
 * Example usage:
 *   const { generatePdf } = usePdfGenerator()
 *   const blob = await generatePdf(sections, config)
 */

import jsPDF from 'jspdf'

import { PRINT_TYPE } from '@/constants'
import type { PrintSection, PdfConfig } from '@/types/print'

import { PDF_FORMATS, PDF_UNITS, PDF_ORIENTATIONS, PAGE_DIMENSIONS, PDF_LAYOUT_CONSTANTS } from '../constants'

import { usePdfCanvas } from './usePdfCanvas'
import { usePdfHeader } from './usePdfHeader'
import { usePdfPageNumbers } from './usePdfPageNumbers'
import { usePdfTable } from './usePdfTable'
import { usePdfText } from './usePdfText'

/**
 * PDF generator composable return type
 */
export interface UsePdfGeneratorReturn {
  generatePdf: (sections: PrintSection[], config?: PdfConfig) => Promise<Blob>
  createPdfDocument: (config: PdfConfig) => jsPDF
}

/**
 * Default PDF configuration
 */
export const getDefaultConfig = (isLandscape: boolean): Required<PdfConfig> => ({
  format: PDF_FORMATS.A4,
  unit: PDF_UNITS.PT,
  orientation: isLandscape ? PDF_ORIENTATIONS.LANDSCAPE : PDF_ORIENTATIONS.PORTRAIT,
  title: 'Document',
  subtitle: '',
  dateRange: '',
  totalItems: '',
  skipExcelDownload: false,
  printDate: '',
})

/**
 * Checks if sections require landscape orientation
 * @param sections - Print sections to check
 * @returns True if landscape orientation is needed
 */
export const checkLandscapeOrientation = (sections: PrintSection[]): boolean => {
  return sections.some((section) => {
    if (section.sectionRef && section.sectionRef instanceof HTMLElement) {
      return section.sectionRef.scrollWidth > PAGE_DIMENSIONS.A4.PORTRAIT.WIDTH
    }
    return false
  })
}

/**
 * Composable for PDF generation
 * @returns PDF generation utilities
 */
export const usePdfGenerator = (): UsePdfGeneratorReturn => {
  const { addHeader } = usePdfHeader()
  const { processTable } = usePdfTable()
  const { processCanvas } = usePdfCanvas()
  const { processText } = usePdfText()
  const { addPageNumbers } = usePdfPageNumbers()

  /**
   * Creates a new PDF document with configuration
   * @param config - PDF configuration
   * @returns jsPDF instance
   */
  const createPdfDocument = (config: PdfConfig): jsPDF => {
    return new jsPDF({
      orientation: config.orientation,
      unit: config.unit || PDF_UNITS.PT,
      format: config.format || PDF_FORMATS.A4,
    })
  }

  /**
   * Prepares PDF configuration
   * @param sections - Print sections to check
   * @param config - Optional PDF configuration
   * @returns Prepared PDF configuration
   */
  const preparePdfConfig = (sections: PrintSection[], config?: PdfConfig): Required<PdfConfig> => {
    const isLandscape = checkLandscapeOrientation(sections)
    return {
      ...getDefaultConfig(isLandscape),
      ...config,
    }
  }

  /**
   * Initializes PDF processing context with initial state
   * @param pdf - PDF document instance
   * @param config - Final PDF configuration
   * @returns Initial processing context
   *
   * Example usage:
   *   const context = initializePdfContext(pdf, finalConfig)
   *   context.currentY = 70 (after header)
   */
  const initializePdfContext = (pdf: jsPDF, config: Required<PdfConfig>): PdfProcessingContext => {
    // Start from initial Y position
    let currentY = PDF_LAYOUT_CONSTANTS.INITIAL_Y_POSITION

    // Add header and update Y position
    currentY = addHeader(pdf, config, currentY)

    // Track header end position for future reference
    const headerEndPosition = currentY

    // Initialize pages that have headers (starting with page 1)
    const pagesWithHeaders = new Set<number>([1])

    return {
      currentY,
      headerEndPosition,
      pagesWithHeaders,
      config,
    }
  }

  /**
   * Processes a single section based on its type
   * @param pdf - PDF document instance
   * @param section - Section to process
   * @param currentY - Current Y position
   * @param config - PDF configuration
   * @param headerEndPosition - Y position after header
   * @param pagesWithHeaders - Set of pages that have headers
   * @returns New Y position after processing
   */
  const processSection = async (
    pdf: jsPDF,
    section: PrintSection,
    currentY: number,
    config: Required<PdfConfig>,
    headerEndPosition: number,
    pagesWithHeaders: Set<number>,
  ): Promise<number> => {
    switch (section.refType) {
      case PRINT_TYPE.TABLE:
        return processTable(pdf, section, currentY, config, headerEndPosition, pagesWithHeaders)

      case PRINT_TYPE.CANVAS:
        return processCanvas(pdf, section, currentY, config)

      case PRINT_TYPE.TEXT:
        return processText(pdf, section, currentY, config, headerEndPosition, pagesWithHeaders)

      default:
        console.warn(`Unknown section type: ${section.refType}`)
        return currentY
    }
  }

  /**
   * Generates PDF from print sections
   * @param sections - Print sections to include
   * @param config - Optional PDF configuration
   * @returns PDF blob
   *
   * Example:
   *   const sections = [{ refType: 'table', sectionRef: tableElement }]
   *   const blob = await generatePdf(sections, { title: 'Report' })
   */
  const generatePdf = async (sections: PrintSection[], config?: PdfConfig): Promise<Blob> => {
    try {
      const finalConfig = preparePdfConfig(sections, config)
      const pdf = createPdfDocument(finalConfig)
      const context = initializePdfContext(pdf, finalConfig)
      // Initial setup
      let currentY = 50
      currentY = addHeader(pdf, finalConfig, currentY)
      const headerEndPosition = currentY
      const pagesWithHeaders = new Set<number>([1])

      // Process each section
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const isLastSection = i === sections.length - 1

        // Process section
        currentY = await processSection(pdf, section, currentY, finalConfig, headerEndPosition, pagesWithHeaders)

        // Add spacing between sections (except for last)
        if (!isLastSection) {
          currentY += 20
        }
      }

      // Add page numbers to all pages
      addPageNumbers(pdf)

      // Generate and return blob
      return pdf.output('blob')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate PDF'
      throw new Error(`PDF generation failed: ${message}`)
    }
  }

  return {
    generatePdf,
    createPdfDocument,
  }
}
