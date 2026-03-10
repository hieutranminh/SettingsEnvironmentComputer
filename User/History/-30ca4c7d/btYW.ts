/**
 * PDF table processing composable
 * Handles table rendering in PDF documents
 *
 * Example usage:
 *   const { processTable } = usePdfTable()
 *   const newY = await processTable(pdf, section, currentY)
 */

import type jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import type { PrintSection, PdfConfig, PdfProcessingContext } from '@/types/print'
import { FONTS } from '@/utils/fontUtils'

import {
  PDF_MARGINS,
  PDF_SECTION_SPACING,
  PDF_TABLE_STYLES,
  PDF_PAGE_BREAK,
  PDF_FONT_SIZES,
  PDF_TEXT_ALIGNMENT,
  PDF_PAGE_NUMBERING,
  PDF_FONT_WEIGHTS,
  PDF_CANVAS_CONFIG,
} from '../constants/pdf'
import { estimateTableHeight } from '../utils/tableUtils'

import { usePdfHeader } from './usePdfHeader'

/**
 * Text alignment type for table titles
 */
type TextAlignment = 'left' | 'center' | 'right'

/**
 * CreateTableConfig options interface
 */
interface ICreateTableConfigOptions {
  section: PrintSection
  tableElement: HTMLTableElement
  currentY: number
  context: PdfProcessingContext
  config: Required<PdfConfig>
}

/**
 * PDF table composable return type
 */
export interface IUsePdfTableReturn {
  processTable: (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ) => Promise<number>
}

/**
 * Composable for PDF table processing
 * @returns PDF table processing utilities
 */
export const usePdfTable = (): IUsePdfTableReturn => {
  const { addHeader } = usePdfHeader()

  /**
   * Adds table title if present
   * @param pdf - PDF document
   * @param title - Title text
   * @param alignment - Title alignment
   * @param startY - Starting Y position
   * @param pageWidth - Page width
   * @returns New Y position
   */
  const addTableTitle = (
    pdf: jsPDF,
    title: string | undefined,
    alignment: string | undefined,
    startY: number,
    pageWidth: number,
  ): number => {
    if (!title) return startY

    pdf.setFontSize(PDF_FONT_SIZES.TABLE_TITLE)
    pdf.setFont(FONTS.BOLD, PDF_FONT_WEIGHTS.BOLD)

    const xPosition = calculateTitlePosition(alignment, pageWidth)
    const align: TextAlignment =
      (alignment as TextAlignment) || PDF_TEXT_ALIGNMENT.DEFAULT_HORIZONTAL

    pdf.text(title, xPosition, startY, { align })
    return startY + PDF_SECTION_SPACING.AFTER_TITLE
  }

  /**
   * Calculate title X position based on alignment
   * @param alignment - Title alignment
   * @param pageWidth - Page width
   * @returns X position
   */
  const calculateTitlePosition = (alignment: string | undefined, pageWidth: number): number => {
    const align: TextAlignment =
      (alignment as TextAlignment) || PDF_TEXT_ALIGNMENT.DEFAULT_HORIZONTAL

    switch (align) {
      case PDF_TEXT_ALIGNMENT.HORIZONTAL.CENTER:
        return pageWidth / PDF_CANVAS_CONFIG.CENTER_DIVISOR
      case 'right':
        return pageWidth - PDF_MARGINS.RIGHT
      case PDF_TEXT_ALIGNMENT.HORIZONTAL.LEFT:
      default:
        return PDF_MARGINS.LEFT
    }
  }

  /**
   * Creates base table configuration
   * @param tableElement - HTML table element
   * @param currentY - Current Y position
   * @returns Base table configuration
   */
  const createTableBaseConfig = (
    tableElement: HTMLTableElement,
    currentY: number,
  ): ICreateTableBaseConfig => ({
    html: tableElement,
    tableWidth: 'auto' as const,
    rowPageBreak: 'avoid' as const,
    theme: 'grid' as const,
    showFoot: 'lastPage' as const,
    startY: currentY,
  })

  /**
   * Creates table styles configuration
   * @param section - Table section
   * @returns Table styles configuration
   */
  const createTableStyles = (section: PrintSection) => ({
    headStyles: {
      ...PDF_TABLE_STYLES.HEADER,
      ...(section.tableStyles?.headStyles || {}),
    },
    footStyles: {
      ...PDF_TABLE_STYLES.FOOTER,
      ...(section.tableStyles?.footStyles || {}),
    },
    styles: {
      font: FONTS.REGULAR,
      ...PDF_TABLE_STYLES.STYLES,
      ...(section.tableStyles?.styles || {}),
    },
  })

  /**
   * Creates table margins configuration
   * @param context - PDF processing context
   * @returns Margins configuration
   */
  const createTableMargins = (context: PdfProcessingContext) => ({
    margin: {
      left: PDF_MARGINS.LEFT,
      right: PDF_MARGINS.RIGHT,
      top: context.headerEndPosition,
    },
  })

  /**
   * Creates page draw handler for table rendering
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns Page draw handler function
   */
  const createPageDrawHandler =
    (config: Required<PdfConfig>, context: PdfProcessingContext) =>
    ({ doc }: { doc: jsPDF }) => {
      const pageNumber = doc.getNumberOfPages()
      if (
        pageNumber > PDF_PAGE_NUMBERING.FIRST_PAGE_NUMBER &&
        !context.pagesWithHeaders.has(pageNumber)
      ) {
        addHeader(doc, config, PDF_MARGINS.TOP)
        context.pagesWithHeaders.add(pageNumber)
      }
    }

  /**
   * Creates optional table configuration properties
   * @param section - Table section
   * @returns Optional configuration properties
   */
  const createOptionalTableConfig = (section: PrintSection) => ({
    ...(section.tableStyles?.columnStyles && {
      columnStyles: section.tableStyles.columnStyles,
    }),
    ...(section.tableStyles?.bodyStyles && {
      bodyStyles: section.tableStyles.bodyStyles,
    }),
    ...(section.tableStyles?.didParseCell && {
      didParseCell: section.tableStyles.didParseCell,
    }),
  })

  /**
   * Checks if new page is needed for table
   * @param currentY - Current Y position
   * @param pageHeight - Page height
   * @returns True if new page is needed
   */
  const needsNewPage = (currentY: number, pageHeight: number): boolean => {
    const availableSpace = pageHeight - currentY - PDF_MARGINS.BOTTOM
    return availableSpace < PDF_PAGE_BREAK.MIN_SPACE_FOR_TABLE
  }

  /**
   * Handles page break with header addition
   * @param pdf - PDF document
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns New Y position
   */
  const handlePageBreak = (
    pdf: jsPDF,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ): number => {
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, PDF_MARGINS.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition
  }

  /**
   * Creates autoTable configuration object using helper functions
   * @param options - Configuration options object
   * @returns autoTable configuration
   */
  const createTableConfig = (options: ICreateTableConfigOptions) => {
    const { section, tableElement, currentY, context, config } = options

    const baseConfig = createTableBaseConfig(tableElement, currentY)
    const tableStyles = createTableStyles(section)
    const margins = createTableMargins(context)
    const pageDrawHandler = createPageDrawHandler(config, context)
    const optionalConfig = createOptionalTableConfig(section)

    return {
      ...baseConfig,
      ...tableStyles,
      ...margins,
      didDrawPage: pageDrawHandler,
      ...optionalConfig,
    }
  }

  /**
   * Gets final Y position after table rendering
   * @param pdf - PDF document
   * @param currentY - Current Y position
   * @param tableElement - HTML table element
   * @returns Final Y position
   */
  const getFinalYPosition = (
    pdf: jsPDF,
    currentY: number,
    tableElement: HTMLTableElement,
  ): number => {
    if (pdf.lastAutoTable?.finalY) {
      return pdf.lastAutoTable.finalY
    }

    // Fallback calculation
    const estimatedHeight = estimateTableHeight(tableElement)
    return currentY + estimatedHeight
  }

  /**
   * Processes table section for PDF
   * @param pdf - PDF document
   * @param section - Table section to process
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns Final Y position after table
   *
   * Example:
   *   const newY = await processTable(pdf, tableSection, config, context)
   */
  const processTable = async (
    pdf: jsPDF,
    section: PrintSection,
    config: Required<PdfConfig>,
    context: PdfProcessingContext,
  ): Promise<number> => {
    try {
      const tableElement = section.sectionRef as HTMLTableElement
      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      let { currentY } = context

      // Handle page break if needed
      if (needsNewPage(currentY, pageHeight)) {
        currentY = handlePageBreak(pdf, config, context)
      }

      // Add table title
      currentY = addTableTitle(pdf, section.title, section.titleAlignment, currentY, pageWidth)

      // Create and apply table configuration
      const tableConfig = createTableConfig({
        section,
        tableElement,
        currentY,
        context,
        config,
      })
      autoTable(pdf, tableConfig)

      // Return final Y position
      return getFinalYPosition(pdf, currentY, tableElement)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to process table: ${message}`)
    }
  }

  return {
    processTable,
  }
}
