/**
 * Main PDF generation composable
 * Coordinates PDF creation from multiple sections
 *
 * Example usage:
 *   const { generatePdf } = usePdfGenerator()
 *   const blob = await generatePdf(sections, config)
 */

import jsPDF from 'jspdf'
import { ref, type Ref } from 'vue'

import { PRINT_TYPE } from '@/constants'
import type { IPrintSection, IPdfConfig, IPdfProcessingContext } from '@/types/print'
import { ensureFontsReady } from '@/utils/fontUtils'

import {
  PDF_UNITS,
  PDF_HEADER,
  PDF_ORIENTATIONS,
  PDF_PAGE_DIMENSIONS,
  PDF_SECTION_SPACING,
  PDF_DOCUMENT_FORMATS,
} from '../constants/pdf'

// Composable
import { usePdfCanvas } from './usePdfCanvas'
import { usePdfHeader } from './usePdfHeader'
import { usePdfPageNumbers } from './usePdfPageNumbers'
import { usePdfTable } from './usePdfTable'
import { usePdfText } from './usePdfText'
import { parseError } from '@/utils/common'

const pdfDocumentInstance = ref<jsPDF | null>(null)

/**
 * PDF generator composable return type
 */
export interface IUsePdfGeneratorReturn {
  pdfDocumentInstance: Ref<jsPDF | null>
  generatePdf: (sections: IPrintSection[], config?: IPdfConfig) => Promise<Blob>
  createPdfDocument: (config: IPdfConfig) => jsPDF
}

/**
 * Default PDF configuration
 */
export const getDefaultConfig = (isLandscape: boolean): Required<IPdfConfig> => ({
  format: PDF_DOCUMENT_FORMATS.A4,
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
export const checkLandscapeOrientation = (sections: IPrintSection[]): boolean => {
  return sections.some((section) => {
    if (section.sectionRef && section.sectionRef instanceof HTMLElement) {
      return section.sectionRef.scrollWidth > PDF_PAGE_DIMENSIONS.A4.PORTRAIT.WIDTH
    }
    return false
  })
}

/**
 * Composable for PDF generation
 * @returns PDF generation utilities
 */
export const usePdfGenerator = (): IUsePdfGeneratorReturn => {
  const { addHeader } = usePdfHeader()
  const { processTable } = usePdfTable()
  const { processCanvas } = usePdfCanvas()
  const { processText } = usePdfText()
  const { addPageNumbers } = usePdfPageNumbers()

  /**
   * Map of section types to their processors
   */
  const processors = {
    [PRINT_TYPE.TABLE]: processTable,
    [PRINT_TYPE.CANVAS]: processCanvas,
    [PRINT_TYPE.TEXT]: processText,
  }

  /**
   * Creates a new PDF document with configuration
   * @param config - PDF configuration
   * @returns jsPDF instance
   */
  const createPdfDocument = (config: IPdfConfig): jsPDF => {
    return new jsPDF({
      orientation: config.orientation,
      unit: config.unit ?? PDF_UNITS.PT,
      format: config.format ?? PDF_DOCUMENT_FORMATS.A4,
    })
  }

  /**
   * Prepares PDF configuration
   * @param sections - Print sections to check
   * @param config - Optional PDF configuration
   * @returns Prepared PDF configuration
   */
  const preparePdfConfig = (
    sections: IPrintSection[],
    config?: IPdfConfig,
  ): Required<IPdfConfig> => {
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
  const initializePdfContext = (
    pdf: jsPDF,
    config: Required<IPdfConfig>,
  ): IPdfProcessingContext => {
    // Start from initial Y position
    let currentY: number = PDF_HEADER.INITIAL_Y_POSITION

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
   * Finalizes PDF document with post-processing tasks
   * @param pdf - PDF document instance
   * @param context - Processing context (optional for additional data)
   *
   * Example usage:
   *   finalizePdf(pdf, context)
   *   // Adds page numbers to all pages
   */
  const finalizePdf = (pdf: jsPDF, context?: IPdfProcessingContext): void => {
    // Add page numbers to all pages
    addPageNumbers(pdf)

    // Future finalization tasks can be added here:
    // - Add watermarks
    // - Add document metadata
    // - Apply final formatting
    // - Compress PDF if needed

    // Optional: Log finalization stats
    if (context && import.meta.env.DEV) {
      const totalPages = pdf.getNumberOfPages()
      const pagesWithHeaders = context.pagesWithHeaders.size

      // keep console.debug for development to debug
      // eslint-disable-next-line no-console
      console.debug(`PDF finalized: ${totalPages} pages, ${pagesWithHeaders} with headers`)
    }
  }

  /**
   * Processes all sections sequentially
   * @param pdf - PDF document instance
   * @param sections - Sections to process
   * @param context - Processing context (modified in place)
   */
  const processSections = async (
    pdf: jsPDF,
    sections: IPrintSection[],
    config: Required<IPdfConfig>,
    context: IPdfProcessingContext,
  ): Promise<void> => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const processor = processors[section.refType]
      const isLastSection = i === sections.length - 1

      // Process current section
      if (processor) {
        context.currentY = await processor(pdf, section, config, context)
      }

      // Add spacing between sections (except for last)
      if (!isLastSection) {
        context.currentY += PDF_SECTION_SPACING.BETWEEN_SECTIONS
      }
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
  const generatePdf = async (sections: IPrintSection[], config?: IPdfConfig): Promise<Blob> => {
    try {
      // Ensure fonts are loaded before PDF generation
      await ensureFontsReady()

      const finalConfig = preparePdfConfig(sections, config)
      const pdf = createPdfDocument(finalConfig)
      const context = initializePdfContext(pdf, finalConfig)

      await processSections(pdf, sections, finalConfig, context)

      // Finalize PDF
      finalizePdf(pdf, context)

      pdfDocumentInstance.value = pdf

      // Generate and return blob
      return pdf.output('blob')
    } catch (error) {
      const message = parseError(error, 'Failed to generate PDF')
      throw new Error(message)
    }
  }

  return {
    pdfDocumentInstance,

    generatePdf,
    createPdfDocument,
  }
}
