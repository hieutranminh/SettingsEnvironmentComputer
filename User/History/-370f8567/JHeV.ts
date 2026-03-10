/**
 * PDF table processing composable - IMPROVED VERSION
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

import { SPACING, PDF_TABLE_STYLES, TABLE_CONFIG, FONT_SIZES } from '../constants'
import { estimateTableHeight } from '../utils/tableUtils'

import { usePdfHeader } from './usePdfHeader'

/**
 * PDF table composable return type
 */
export interface UsePdfTableReturn {
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
export const usePdfTable = (): UsePdfTableReturn => {
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

    pdf.setFontSize(FONT_SIZES.TABLE_TITLE)
    pdf.setFont(FONTS.BOLD, 'bold')

    const xPosition = calculateTitlePosition(alignment, pageWidth)
    const align = (alignment || 'left') as 'left' | 'center' | 'right'

    pdf.text(title, xPosition, startY, { align })
    return startY + SPACING.SECTION.AFTER_TITLE
  }

  /**
   * Calculate title X position based on alignment
   * @param alignment - Title alignment
   * @param pageWidth - Page width
   * @returns X position
   */
  const calculateTitlePosition = (alignment: string | undefined, pageWidth: number): number => {
    const align = alignment || 'left'

    switch (align) {
      case 'center':
        return pageWidth / 2
      case 'right':
        return pageWidth - SPACING.MARGIN.RIGHT
      case 'left':
      default:
        return SPACING.MARGIN.LEFT
    }
  }

  /**
   * Checks if new page is needed for table
   * @param currentY - Current Y position
   * @param pageHeight - Page height
   * @returns True if new page is needed
   */
  const needsNewPage = (currentY: number, pageHeight: number): boolean => {
    const availableSpace = pageHeight - currentY - SPACING.MARGIN.BOTTOM
    return availableSpace < TABLE_CONFIG.MIN_SPACE_FOR_TABLE
  }

  /**
   * Handles page break with header addition
   * @param pdf - PDF document
   * @param config - PDF configuration
   * @param context - PDF processing context
   * @returns New Y position
   */
  const handlePageBreak = (pdf: jsPDF, config: Required<PdfConfig>, context: PdfProcessingContext): number => {
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()

    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }

    return context.headerEndPosition
  }

  /**
   * Creates autoTable configuration object
   * @param section - Table section
   * @param tableElement - HTML table element
   * @param currentY - Current Y position
   * @param context - PDF processing context
   * @param config - PDF configuration
   * @returns autoTable configuration
   */
  const createTableConfig = (
    section: PrintSection,
    tableElement: HTMLTableElement,
    currentY: number,
    context: PdfProcessingContext,
    config: Required<PdfConfig>,
  ) => {
    return {
      html: tableElement,
      tableWidth: 'auto' as const,
      rowPageBreak: 'avoid' as const,
      theme: 'grid' as const,
      showFoot: 'lastPage' as const,
      headStyles: {
        ...PDF_TABLE_STYLES.headStyles,
        ...(section.tableStyles?.headStyles || {}),
      },
      footStyles: {
        ...PDF_TABLE_STYLES.footStyles,
        ...(section.tableStyles?.footStyles || {}),
      },
      styles: {
        font: FONTS.REGULAR,
        ...PDF_TABLE_STYLES.styles,
        ...(section.tableStyles?.styles || {}),
      },
      startY: currentY,
      margin: {
        left: SPACING.MARGIN.LEFT,
        right: SPACING.MARGIN.RIGHT,
        top: context.headerEndPosition,
      },
      didDrawPage: ({ doc }: { doc: jsPDF }) => {
        const pageNumber = doc.getNumberOfPages()
        if (pageNumber > 1 && !context.pagesWithHeaders.has(pageNumber)) {
          addHeader(doc, config, SPACING.MARGIN.TOP)
          context.pagesWithHeaders.add(pageNumber)
        }
      },
      ...(section.tableStyles?.columnStyles && {
        columnStyles: section.tableStyles.columnStyles,
      }),
      ...(section.tableStyles?.bodyStyles && {
        bodyStyles: section.tableStyles.bodyStyles,
      }),
      ...(section.tableStyles?.didParseCell && {
        didParseCell: section.tableStyles.didParseCell,
      }),
    }
  }

  /**
   * Gets final Y position after table rendering
   * @param pdf - PDF document
   * @param currentY - Current Y position
   * @param tableElement - HTML table element
   * @returns Final Y position
   */
  const getFinalYPosition = (pdf: jsPDF, currentY: number, tableElement: HTMLTableElement): number => {
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
      const tableConfig = createTableConfig(section, tableElement, currentY, context, config)
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
