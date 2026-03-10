/**
 * Cải thiện: Tách initializePdfContext thành các functions nhỏ hơn
 */

// 1. Tách initializePdfContext

/**
 * Creates initial Y position for PDF content
 * @returns Initial Y coordinate
 */
const getInitialYPosition = (): number => {
  return PDF_LAYOUT_CONSTANTS.INITIAL_Y_POSITION
}

/**
 * Adds header to PDF and returns the new Y position
 * @param pdf - PDF document instance
 * @param config - PDF configuration
 * @param startY - Starting Y position
 * @returns Y position after header
 */
const addHeaderToDocument = (pdf: jsPDF, config: Required<PdfConfig>, startY: number): number => {
  const { addHeader } = usePdfHeader()
  return addHeader(pdf, config, startY)
}

/**
 * Creates initial pages tracking set
 * @returns Set with initial page number
 */
const createPagesTracker = (): Set<number> => {
  const FIRST_PAGE = 1
  return new Set<number>([FIRST_PAGE])
}

/**
 * Initializes PDF processing context with separated concerns
 */
const initializePdfContext = (pdf: jsPDF, config: Required<PdfConfig>): PdfProcessingContext => {
  const initialY = getInitialYPosition()
  const currentY = addHeaderToDocument(pdf, config, initialY)
  const headerEndPosition = currentY
  const pagesWithHeaders = createPagesTracker()

  return {
    currentY,
    headerEndPosition,
    pagesWithHeaders,
    config,
  }
}

// 2. Cải thiện Error Handling

/**
 * Custom error for PDF generation failures
 */
class PdfGenerationError extends Error {
  constructor(
    message: string,
    public readonly context: string,
    public readonly originalError?: Error,
  ) {
    super(message)
    this.name = 'PdfGenerationError'
  }
}

/**
 * Safely processes a section with proper error handling
 * @param pdf - PDF document instance
 * @param section - Section to process
 * @param config - PDF configuration
 * @param context - Processing context
 * @returns New Y position after processing
 */
const processSectionSafely = async (
  pdf: jsPDF,
  section: PrintSection,
  config: Required<PdfConfig>,
  context: PdfProcessingContext,
): Promise<number> => {
  try {
    switch (section.refType) {
      case PRINT_TYPE.TABLE:
        return await processTable(pdf, section, config, context)

      case PRINT_TYPE.CANVAS:
        return await processCanvas(pdf, section, config, context)

      case PRINT_TYPE.TEXT:
        return await processText(pdf, section, config, context)

      default:
        throw new PdfGenerationError(`Unknown section type: ${section.refType}`, 'section-processing')
    }
  } catch (error) {
    const originalError = error instanceof Error ? error : new Error(String(error))
    throw new PdfGenerationError(
      `Failed to process section of type ${section.refType}`,
      'section-processing',
      originalError,
    )
  }
}
