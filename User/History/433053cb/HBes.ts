/**
 * Cải thiện: Tách initializePdfContext thành các functions nhỏ hơn
 */

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
