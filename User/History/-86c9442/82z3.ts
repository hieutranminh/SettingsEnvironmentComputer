/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-depth */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Composables
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { A4_PAGE_WIDTH, PRINT_TYPE } from '@/constants'
import { t } from '@/plugins/i18n.ts'
// Types
import type { CellTracker, ProcessingContext, PdfConfig, PrintPreviewState, PrintSection } from '@/types/print'
// Utils
import { FONTS } from '@/utils/fontUtils'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
      finalX?: number
      pageNumber?: number
    }
  }
}

export const usePrintPreviewStore = defineStore('printPreview', () => {
  const { formatDate } = useDateFormat()

  // State
  const state = ref<PrintPreviewState>({
    isVisible: false,
    sections: [],
    pdfBlobUrl: null,
    isLoading: false,
    error: null,
    config: null,
  })
  const pdfDocument = ref<jsPDF | null>(null)
  const customExcelHandler = ref<(() => void) | undefined>(undefined)

  // Getters
  const isVisible = computed(() => state.value.isVisible)
  const sections = computed(() => state.value.sections)
  const pdfBlobUrl = computed(() => state.value.pdfBlobUrl)
  const isLoading = computed(() => state.value.isLoading)
  const config = computed(() => state.value.config)
  const error = computed(() => state.value.error)
  const isLandscape = computed(() =>
    state.value.sections.some(
      (section) => section.sectionRef && section.sectionRef.scrollWidth > A4_PAGE_WIDTH.PORTRAIT,
    ),
  )

  // Actions
  const openPrintPreview = async (
    printSections: PrintSection[],
    config?: PdfConfig,
    callbackCustomExcelHandler?: (() => void) | undefined,
  ): Promise<void> => {
    try {
      state.value.isLoading = true
      state.value.isVisible = true
      state.value.error = null
      state.value.sections = printSections

      customExcelHandler.value = callbackCustomExcelHandler || undefined
      // Generate PDF first before showing dialog
      await generatePdfFromSections(printSections, config)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open print preview'
      state.value.error = errorMessage
      throw new Error(errorMessage)
    } finally {
      state.value.isLoading = false
    }
  }

  const setIsLoading = (isLoading: boolean): void => {
    state.value.isLoading = isLoading
  }

  const cleanup = (): void => {
    if (state.value.pdfBlobUrl) {
      URL.revokeObjectURL(state.value.pdfBlobUrl)
      state.value.pdfBlobUrl = null
    }
  }

  const closePrintPreview = (): void => {
    cleanup()
    state.value.isVisible = false
    state.value.sections = []
    state.value.error = null
  }

  const generatePdfFromSections = async (printSections: PrintSection[], config?: PdfConfig): Promise<void> => {
    try {
      // Default configuration
      const defaultConfig: Required<PdfConfig> = {
        format: 'a4',
        unit: 'pt',
        orientation: isLandscape.value ? 'landscape' : 'portrait',
        title: 'Title',
        subtitle: '',
        dateRange: '',
        totalItems: '',
        skipExcelDownload: false,
      }

      // Merge with provided config
      const finalConfig = { ...defaultConfig, ...config }

      // Set config
      state.value.config = finalConfig

      // Create a new PDF document with flexible configuration
      pdfDocument.value = new jsPDF({
        orientation: finalConfig.orientation,
        unit: finalConfig.unit,
        format: finalConfig.format,
      })

      let currentY = 50 // Starting Y position (adjusted for pt units)

      // Add header and calculate total space needed from top
      currentY = addPdfHeader(pdfDocument.value, finalConfig, currentY)

      // This is the Y position after header (where content should start)
      const headerEndPosition = currentY

      // Track pages that already have headers to avoid duplication
      const pagesWithHeaders = new Set<number>([1]) // Page 1 always has header

      // Process each section
      for (let i = 0; i < printSections.length; i++) {
        const section = printSections[i]
        const isLastSection = i === printSections.length - 1

        if (section.refType === PRINT_TYPE.TABLE) {
          // Process table and get the final Y position
          currentY = await processTableSection(
            pdfDocument.value,
            section,
            currentY,
            finalConfig,
            headerEndPosition,
            pagesWithHeaders,
          )

          // Add spacing after table only if it's not the last section
          if (!isLastSection) {
            currentY += 20 // Add spacing between tables/sections
          }
        } else if (section.refType === PRINT_TYPE.CANVAS) {
          currentY = await processCanvasSection(pdfDocument.value, section, currentY, finalConfig)

          // Add spacing after canvas only if it's not the last section
          if (!isLastSection) {
            currentY += 20 // Add spacing between sections
          }
        } else if (section.refType === PRINT_TYPE.TEXT) {
          currentY = await processTextSection(
            pdfDocument.value,
            section,
            currentY,
            finalConfig,
            headerEndPosition,
            pagesWithHeaders,
          )
          if (!isLastSection) {
            currentY += 20 // Add spacing between sections
          }
        }
        // Log current position for debugging
        console.log(`Section ${i + 1} (${section.refType}) ended at Y: ${currentY}`)
      }

      // Add page numbers to all pages after all sections are processed
      addPageNumbers(pdfDocument.value)

      // Generate blob URL
      const pdfBlob = pdfDocument.value.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      state.value.pdfBlobUrl = url
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF'
      throw new Error(errorMessage)
    }
  }

  const addPdfHeader = (pdf: jsPDF, config: Required<PdfConfig>, startY: number): number => {
    const pageWidth = pdf.internal.pageSize.width
    const centerX = pageWidth / 2

    // Add title
    pdf.setFontSize(28)
    pdf.setFont(FONTS.BOLD, 'bold')
    pdf.text(config.title, centerX, startY, { align: 'center' })
    startY += 25

    // Add subtitle
    if (config.subtitle) {
      pdf.setFontSize(14)
      pdf.setFont(FONTS.REGULAR, 'normal')
      pdf.text(config.subtitle, centerX, startY, { align: 'center' })
      startY += 20
    }

    // Add date range
    if (config.dateRange) {
      pdf.setFontSize(14)
      pdf.setFont(FONTS.REGULAR, 'normal')
      pdf.text(config.dateRange, centerX, startY, { align: 'center' })
      startY += 20
    }

    // Add current date from right side
    pdf.setFontSize(14)
    pdf.setFont(FONTS.REGULAR, 'normal')
    pdf.text(formatDate(new Date(), { format: 'YYYY-MM-DD (ddd)' }), pageWidth - 30, startY, {
      align: 'right',
    })

    // Add total items if config.totalItems is not 0
    if (config.totalItems) {
      pdf.setFontSize(12)
      renderMixedText(pdf, config.totalItems, 30, startY, {
        align: 'left',
      })
    }
    startY += 15

    return startY
  }

  const addPageNumbers = (pdf: jsPDF): void => {
    const totalPages = pdf.getNumberOfPages()
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    const centerX = pageWidth / 2
    const footerY = pageHeight - 20 // Position from bottom

    // Save current page
    const currentPage = pdf.getCurrentPageInfo().pageNumber

    // Add page numbers to all pages
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(12)
      pdf.setFont(FONTS.REGULAR, 'normal')
      pdf.text(`${t('general.page')} ${i}`, centerX, footerY, { align: 'center' })
    }

    // Restore to current page (usually the last page)
    pdf.setPage(currentPage)
  }

  const processTableSection = async (
    pdf: jsPDF,
    section: PrintSection,
    startY: number,
    config?: Required<PdfConfig>,
    headerEndPosition: number = 40, // Position after header where content should start
    pagesWithHeaders: Set<number> = new Set<number>([1]),
  ): Promise<number> => {
    try {
      const tableElement = section.sectionRef
      const docPadding = 30 // pt units
      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const bottomMargin = 40 // Space to keep from bottom of page

      // Check if we need a new page before starting the table
      if (startY > pageHeight - bottomMargin - 50) {
        // 50 is minimum space for table
        pdf.addPage()
        startY = headerEndPosition // Reset to position after header
      }

      // Add title to the table
      if (section.title) {
        pdf.setFontSize(12)
        pdf.setFont(FONTS.BOLD, 'bold')

        // Calculate X position based on alignment
        let xPosition: number
        const alignment = section.titleAlignment || 'left'

        switch (alignment) {
          case 'center':
            xPosition = pageWidth / 2
            break
          case 'right':
            xPosition = pageWidth - docPadding
            break
          case 'left':
          default:
            xPosition = docPadding
            break
        }

        pdf.text(section.title, xPosition, startY, { align: section.titleAlignment || 'left' })
        startY += 12
      }

      // Add table to PDF using jsPDF-AutoTable
      autoTable(pdf, {
        html: tableElement as HTMLTableElement,
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        theme: 'grid',
        // Ensure table footer (tfoot) renders only on the last page
        showFoot: 'lastPage',
        headStyles: {
          lineWidth: 1,
          textColor: '#000',
          font: FONTS.REGULAR,
          fillColor: '#DCDFE6',
          ...(section.tableStyles?.headStyles || {}),
        },
        footStyles: {
          lineWidth: 1,
          textColor: '#000',
          font: FONTS.REGULAR,
          fillColor: '#DCDFE6',
          ...(section.tableStyles?.footStyles || {}),
        },
        styles: {
          font: FONTS.REGULAR,
          fontStyle: 'normal',
          fontSize: 12,
          halign: 'center',
          valign: 'middle',
          minCellHeight: 24,
          ...(section.tableStyles?.styles || {}),
        },
        startY: startY,
        margin: {
          left: docPadding,
          right: docPadding,
          top: headerEndPosition, // Reserve space from top to position after header
        },
        // Add header to each page (except first page which already has header)
        didDrawPage: ({ doc }) => {
          const pageNumber = doc.getNumberOfPages()
          // Add header on subsequent pages only if not already added
          if (pageNumber > 1 && config && pagesWithHeaders && !pagesWithHeaders.has(pageNumber)) {
            // Add header at the top of the page
            addPdfHeader(pdf, config, 50)
            // Mark this page as having header
            pagesWithHeaders.add(pageNumber)
          }
        },

        ...(section.tableStyles?.columnStyles && { columnStyles: section.tableStyles.columnStyles }),
        ...(section.tableStyles?.bodyStyles && { bodyStyles: section.tableStyles.bodyStyles }),
        ...(section.tableStyles?.didParseCell && { didParseCell: section.tableStyles.didParseCell }),
      })
      // Use lastAutoTable.finalY to get the exact Y position after the table
      // This is provided by jspdf-autotable after drawing the table
      const finalY = pdf.lastAutoTable?.finalY || startY

      // If lastAutoTable is not available, fall back to estimation
      if (!pdf.lastAutoTable?.finalY) {
        const estimatedRowHeight = 12 // pt per row
        const totalRows = tableElement?.querySelectorAll('tr').length || 1
        const estimatedTableHeight = totalRows * estimatedRowHeight + 20 // +20 for margins
        return startY + estimatedTableHeight
      }

      return finalY
    } catch (err) {
      throw new Error(`Failed to process table section: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const processCanvasSection = async (
    pdf: jsPDF,
    section: PrintSection,
    startY: number,
    config?: Required<PdfConfig>,
  ): Promise<number> => {
    try {
      const canvasElement = section.sectionRef

      // Fixed configuration for all canvas
      const CANVAS_CONFIG = {
        // Canvas takes up to 90% of the page width
        maxWidthRatio: 0.9,
        // Canvas takes up to 70% of the page height
        maxHeightRatio: 0.7,
        // Minimum height required on the current page
        minHeightForCurrentPage: 100,
        padding: 20,
        // html2canvas scale
        scale: 1,
      }

      // Convert to canvas
      const canvas = await html2canvas(canvasElement as HTMLElement, {
        scale: CANVAS_CONFIG.scale,
        useCORS: true,
        allowTaint: true,
        // Disable logging to reduce noise
        logging: false,
      })

      // Document dimensions
      const docWidth = pdf.internal.pageSize.width
      const docHeight = pdf.internal.pageSize.height
      const maxCanvasWidth = docWidth * CANVAS_CONFIG.maxWidthRatio
      const maxCanvasHeight = docHeight * CANVAS_CONFIG.maxHeightRatio

      // Convert pixel to point (pt = 3/4 * px)
      const originalWidth = (3 / 4) * canvas.width
      const originalHeight = (3 / 4) * canvas.height
      const aspectRatio = originalHeight / originalWidth

      // Strategy: Scale to fit within max width/height while keeping aspect ratio
      let scaledWidth = originalWidth
      let scaledHeight = originalHeight

      // Scale down if needed
      if (originalWidth > maxCanvasWidth) {
        scaledWidth = maxCanvasWidth
        scaledHeight = scaledWidth * aspectRatio
      }

      if (scaledHeight > maxCanvasHeight) {
        scaledHeight = maxCanvasHeight
        scaledWidth = scaledHeight / aspectRatio
      }

      // Check if need new page
      const remainingHeight = docHeight - startY - 40 // 40 for footer
      if (remainingHeight < CANVAS_CONFIG.minHeightForCurrentPage || scaledHeight > remainingHeight) {
        pdf.addPage()
        startY = config ? addPdfHeader(pdf, config, 50) : 40
      }

      // Calculate position
      const xPosition = (docWidth - scaledWidth) / 2 // Always center for consistency

      // Add to PDF
      pdf.addImage(canvas, 'JPEG', xPosition, startY, scaledWidth, scaledHeight)

      return startY + scaledHeight
    } catch (err) {
      throw new Error(`Failed to process canvas section: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const processTextSection = async (
    pdf: jsPDF,
    section: PrintSection,
    startY: number,
    config?: Required<PdfConfig>,
    headerEndPosition: number = 40,
    pagesWithHeaders: Set<number> = new Set<number>([1]),
  ): Promise<number> => {
    try {
      const textElements = section.sectionTexts
      if (!textElements?.length) return startY

      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const margins = { left: 30, right: 30, bottom: 40 }
      const lineHeight = 15
      const maxWidth = pageWidth - margins.left - margins.right

      pdf.setFontSize(12)
      pdf.setFont(FONTS.REGULAR, 'normal')

      let currentY = startY

      const addNewPage = () => {
        pdf.addPage()
        if (config && pagesWithHeaders) {
          const pageNumber = pdf.getNumberOfPages()
          if (!pagesWithHeaders.has(pageNumber)) {
            addPdfHeader(pdf, config, 50)
            pagesWithHeaders.add(pageNumber)
          }
        }
        return headerEndPosition + 10
      }

      for (const text of textElements) {
        const lines = pdf.splitTextToSize(text, maxWidth)
        const requiredHeight = lines.length * lineHeight
        const availableHeight = pageHeight - currentY - margins.bottom

        // Check if need new page for entire text block
        if (requiredHeight > availableHeight && currentY > headerEndPosition + 50) {
          currentY = addNewPage()
        }

        // Add lines with page break handling
        for (const line of lines) {
          if (currentY + lineHeight > pageHeight - margins.bottom) {
            currentY = addNewPage()
          }
          pdf.text(line, margins.left, currentY, { align: 'left' })
          currentY += lineHeight
        }

        currentY += 5 // Spacing between text elements
      }

      return currentY
    } catch (err) {
      throw new Error(`Failed to process text section: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const downloadPdf = (filename: string): void => {
    pdfDocument.value?.save(filename)
  }

  /**
   * Downloads the Excel file using a custom handler if provided.
   * If no custom handler is set, throws an explicit error.
   *
   * Example usage:
   *   await downloadExcel('report-name')
   *
   * Expected output:
   *   - Downloads an Excel file with the specified filename
   *   - Includes header information and table data
   *   - Handles merged cells and complex table structures
   */
  const downloadExcel = async (filename: string): Promise<void> => {
    if (customExcelHandler.value) {
      await customExcelHandler.value()
      return
    }

    const { title, subtitle, dateRange, totalItems } = state.value.config || {}

    try {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet(title)
      worksheet.properties.defaultColWidth = 25

      // Set up header information
      let currentRow = 1

      // Add title
      if (title) {
        const titleCell = worksheet.getCell(currentRow, 1)
        titleCell.value = title
        titleCell.font = { bold: true, size: 16 }
        currentRow++
      }

      // Add subtitle
      if (subtitle) {
        const subtitleCell = worksheet.getCell(currentRow, 1)
        subtitleCell.value = subtitle
        subtitleCell.font = { size: 14 }
        currentRow++
      }

      // Add date range
      if (dateRange) {
        const dateCell = worksheet.getCell(currentRow, 1)
        dateCell.value = dateRange
        dateCell.font = { bold: true, size: 14 }
        currentRow++
      }

      // Add total items with rich text formatting
      if (totalItems) {
        const totalCell = worksheet.getCell(currentRow, 1)

        // Parse HTML string and create rich text
        const richTextValue = parseHtmlToRichText(totalItems)
        if (richTextValue.isRichText && richTextValue.richText) {
          // ExcelJS requires richText to be wrapped in an object
          totalCell.value = {
            richText: richTextValue.richText,
          }
        } else {
          totalCell.value = richTextValue.plainText
          totalCell.font = { size: 12 }
        }
      }

      // Add empty row for spacing
      currentRow++

      // Determine the maximum number of columns from all tables
      let maxColumns = 1
      state.value.sections.forEach((section) => {
        if (section.refType === PRINT_TYPE.TABLE) {
          const tableElement = section.sectionRef as HTMLTableElement
          const tableColumns = getTableColumnCount(tableElement)
          maxColumns = Math.max(maxColumns, tableColumns)
        }
      })

      // Move generation date to the rightmost column with right alignment
      if (maxColumns > 1) {
        // Add generation date to the rightmost column
        const generatedCell = worksheet.getCell(currentRow - 1, maxColumns)
        generatedCell.value = formatDate(new Date(), { format: 'YYYY-MM-DD (ddd)' })
        generatedCell.alignment = { horizontal: 'right', vertical: 'middle' }
        generatedCell.font = { size: 12 }

        // Add empty row for spacing
        currentRow++
      }

      /**
       * Process each section
       *
       * @param section - The section to process
       * @param sectionIndex - The index of the section
       * @param currentRow - The current row in the worksheet
       * @param worksheet - The worksheet to process
       * @param tableElement - The table element to process
       */
      for (let sectionIndex = 0; sectionIndex < state.value.sections.length; sectionIndex++) {
        const section = state.value.sections[sectionIndex]

        // Process table section
        if (section.refType === PRINT_TYPE.TABLE) {
          const tableElement = section.sectionRef as HTMLTableElement

          // Add section title if exists
          if (section.title) {
            const sectionTitleCell = worksheet.getCell(currentRow, 1)
            sectionTitleCell.value = section.title
            sectionTitleCell.font = { bold: true, size: 12 }
            currentRow++
          }

          // Process table data
          currentRow = processTableToExcel(worksheet, tableElement, currentRow, section.excelColumnAlignments)

          // Add spacing between sections
          if (sectionIndex < state.value.sections.length - 1) {
            currentRow += 1
          }
        }

        // Process canvas section
        else if (section.refType === PRINT_TYPE.CANVAS) {
          // Process canvas section
          currentRow = await processCanvasToExcel(worksheet, workbook, section, currentRow, maxColumns)

          // Add spacing between sections
          if (sectionIndex < state.value.sections.length - 1) {
            currentRow += 1
          }
        }

        // Process text section
        else if (section.refType === PRINT_TYPE.TEXT) {
          currentRow = await processTextToExcel(worksheet, section, currentRow)

          // Add spacing between sections
          if (sectionIndex < state.value.sections.length - 1) {
            currentRow += 1
          }
        }
      }

      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${filename}.xlsx`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate Excel file'
      throw new Error(errorMessage)
    }
  }

  // Helper function to create cell tracker
  const createCellTracker = (): CellTracker => {
    const occupiedCells = new Map<string, boolean>()

    const isCellOccupied = (row: number, col: number): boolean => {
      return occupiedCells.has(`${row}-${col}`)
    }

    const markCellsOccupied = (startRow: number, startCol: number, rowspan: number, colspan: number): void => {
      for (let r = startRow; r < startRow + rowspan; r++) {
        for (let c = startCol; c < startCol + colspan; c++) {
          occupiedCells.set(`${r}-${c}`, true)
        }
      }
    }

    return { occupiedCells, isCellOccupied, markCellsOccupied }
  }

  // Helper function to get column alignment
  const getColumnAlignment = (
    columnIndex: number,
    columnAlignments?: { [columnIndex: number]: 'left' | 'center' | 'right' },
  ): 'left' | 'center' | 'right' => {
    return columnAlignments?.[columnIndex] || 'center'
  }

  /**
   * Parse cell value
   * @param cellText - The text in the cell
   * @returns The parsed value and whether it is numeric
   */
  const parseCellValue = (cellText: string) => {
    // Check if the cell text is a date
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}$/, // YYYY-MM
    ]
    const isDateLike = datePatterns.some((pattern) => pattern.test(cellText.trim()))
    if (isDateLike) {
      const date = new Date(cellText.trim())
      if (!isNaN(date.getTime())) {
        return { value: cellText, isNumeric: false }
      }
    }

    // Check if the cell text is a numeric value
    const numericValue = parseFloat(cellText.replace(/[^\d.-]/g, ''))
    if (!isNaN(numericValue) && cellText.match(/^\s*[\d,.-]+\s*$/)) {
      return { value: numericValue, isNumeric: true }
    }
    return { value: cellText, isNumeric: false }
  }

  /**
   * Process table headers
   * @param context - The processing context
   * @param tableElement - The table element
   * @param startRow - The start row in the worksheet
   * @returns The current row in the worksheet
   */
  const processTableHeaders = (
    context: ProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ): number => {
    let currentRow = startRow
    const thead = tableElement.querySelector('thead')

    if (!thead) return currentRow

    const headerRows = thead.querySelectorAll('tr')

    headerRows.forEach((row) => {
      const cells = row.querySelectorAll('th, td')
      let currentCol = 1

      cells.forEach((cell) => {
        // Find next available column
        while (context.cellTracker.isCellOccupied(currentRow, currentCol)) {
          currentCol++
        }

        const cellText = cell.textContent?.trim() || ''
        const colspan = parseInt(cell.getAttribute('colspan') || '1')
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1')

        // Set cell value
        const excelCell = context.worksheet.getCell(currentRow, currentCol)
        excelCell.value = cellText

        // Apply header styling
        excelCell.font = { bold: true }
        excelCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDCDFE6' },
        }
        excelCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        excelCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        }

        // Handle merged cells
        if (colspan > 1 || rowspan > 1) {
          const endRow = currentRow + rowspan - 1
          const endCol = currentCol + colspan - 1
          context.worksheet.mergeCells(currentRow, currentCol, endRow, endCol)
          context.cellTracker.markCellsOccupied(currentRow, currentCol, rowspan, colspan)
        } else {
          context.cellTracker.markCellsOccupied(currentRow, currentCol, 1, 1)
        }

        currentCol += colspan
      })

      currentRow++
    })

    return currentRow
  }

  /**
   * Process table body
   * @param context - The processing context
   * @param tableElement - The table element
   * @param startRow - The start row in the worksheet
   * @returns The current row in the worksheet
   */
  const processTableBody = (context: ProcessingContext, tableElement: HTMLTableElement, startRow: number): number => {
    let currentRow = startRow
    const tbody = tableElement.querySelector('tbody')

    if (!tbody) return currentRow

    const dataRows = tbody.querySelectorAll('tr')

    dataRows.forEach((row) => {
      const cells = row.querySelectorAll('td, th')
      let currentCol = 1

      cells.forEach((cell) => {
        // Find next available column
        while (context.cellTracker.isCellOccupied(currentRow, currentCol)) {
          currentCol++
        }

        const cellText = cell.textContent?.trim() || ''
        const colspan = parseInt(cell.getAttribute('colspan') || '1')
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1')

        // Set cell value
        const excelCell = context.worksheet.getCell(currentRow, currentCol)
        const { value, isNumeric } = parseCellValue(cellText)

        excelCell.value = value
        if (isNumeric) {
          excelCell.numFmt = '#,##0'
        }

        // Apply data cell styling
        excelCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }

        // Apply alignment
        const horizontalAlignment = getColumnAlignment(currentCol, context.columnAlignments)
        excelCell.alignment = {
          horizontal: horizontalAlignment,
          vertical: 'middle',
          wrapText: true,
        }

        // Handle merged cells
        if (colspan > 1 || rowspan > 1) {
          const endRow = currentRow + rowspan - 1
          const endCol = currentCol + colspan - 1
          context.worksheet.mergeCells(currentRow, currentCol, endRow, endCol)
          context.cellTracker.markCellsOccupied(currentRow, currentCol, rowspan, colspan)
        } else {
          context.cellTracker.markCellsOccupied(currentRow, currentCol, 1, 1)
        }

        currentCol += colspan
      })

      currentRow++
    })

    return currentRow
  }

  /**
   * Process table footer
   * @param context - The processing context
   * @param tableElement - The table element
   * @param startRow - The start row in the worksheet
   * @returns The current row in the worksheet
   */
  const processTableFooter = (context: ProcessingContext, tableElement: HTMLTableElement, startRow: number): number => {
    let currentRow = startRow
    const tfoot = tableElement.querySelector('tfoot')

    if (!tfoot) return currentRow

    const footerRows = tfoot.querySelectorAll('tr')

    footerRows.forEach((row) => {
      const cells = row.querySelectorAll('td, th')
      let currentCol = 1

      cells.forEach((cell) => {
        // Find next available column
        while (context.cellTracker.isCellOccupied(currentRow, currentCol)) {
          currentCol++
        }

        const cellText = cell.textContent?.trim() || ''
        const colspan = parseInt(cell.getAttribute('colspan') || '1')
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1')

        // Set cell value
        const excelCell = context.worksheet.getCell(currentRow, currentCol)
        const { value, isNumeric } = parseCellValue(cellText)

        excelCell.value = value
        if (isNumeric) {
          excelCell.numFmt = '#,##0'
        }

        // Apply footer styling
        excelCell.font = { bold: true }
        excelCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDCDFE6' },
        }
        excelCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }

        // Apply alignment
        const horizontalAlignment = getColumnAlignment(currentCol, context.columnAlignments)
        excelCell.alignment = {
          horizontal: horizontalAlignment,
          vertical: 'middle',
          wrapText: true,
        }

        // Handle merged cells
        if (colspan > 1 || rowspan > 1) {
          const endRow = currentRow + rowspan - 1
          const endCol = currentCol + colspan - 1
          context.worksheet.mergeCells(currentRow, currentCol, endRow, endCol)
          context.cellTracker.markCellsOccupied(currentRow, currentCol, rowspan, colspan)
        } else {
          context.cellTracker.markCellsOccupied(currentRow, currentCol, 1, 1)
        }

        currentCol += colspan
      })

      currentRow++
    })

    return currentRow
  }

  /**
   * Process table section to Excel
   * @param worksheet - The worksheet to process
   * @param tableElement - The table element to process
   * @param startRow - The start row in the worksheet
   * @param columnAlignments - The column alignments to apply
   * @returns The current row in the worksheet
   */
  const processTableToExcel = (
    worksheet: ExcelJS.Worksheet,
    tableElement: HTMLTableElement,
    startRow: number,
    columnAlignments?: { [columnIndex: number]: 'left' | 'center' | 'right' },
  ): number => {
    // Create processing context
    const context: ProcessingContext = {
      worksheet,
      cellTracker: createCellTracker(),
      columnAlignments,
    }

    let currentRow = startRow

    // Process each section of the table
    currentRow = processTableHeaders(context, tableElement, currentRow)
    currentRow = processTableBody(context, tableElement, currentRow)
    currentRow = processTableFooter(context, tableElement, currentRow)

    /** This code might be useful in the future
     * Auto-fit columns based on content
     worksheet.columns.forEach((column, index) => {
      let maxLength = 10 // Minimum width

      // Check all cells in this column
      worksheet.getColumn(index + 1).eachCell((cell) => {
        const cellValue = cell.value?.toString() || ''
        maxLength = Math.max(maxLength, cellValue.length)
      })

      // Set column width (with reasonable limits)
      column.width = Math.min(Math.max(maxLength + 2, 10), 25)
    })
    */

    return currentRow
  }

  /**
   * Process canvas section to Excel
   * @param worksheet - The worksheet to process
   * @param workbook - The workbook to process
   * @param section - The section to process
   * @param startRow - The start row in the worksheet
   * @param maxColumns - The maximum number of columns in the worksheet
   * @returns The current row in the worksheet
   */
  const processCanvasToExcel = async (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    section: PrintSection,
    startRow: number,
    maxColumns: number,
  ): Promise<number> => {
    try {
      const canvasElement = section.sectionRef

      // Convert canvas/element to canvas using html2canvas
      const canvas = await html2canvas(canvasElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      // Convert canvas to base64
      const imageBase64 = canvas.toDataURL('image/png')

      // Add image to workbook
      const imageId = workbook.addImage({
        base64: imageBase64,
        extension: 'png',
      })

      // Get default column width from worksheet
      const defaultColumnWidth = worksheet.properties?.defaultColWidth || 25

      // Calculate width based on the number of columns (to ensure the image does not exceed the table width)
      // Formula: width = number of columns * column width * adjustment factor
      // The factor 7 is used to convert from Excel column units to pixels (approximation)
      // 800 is the minimum width for the image to be visible
      const canvasWidthBound = maxColumns * defaultColumnWidth * 7
      const excelWidth = canvasWidthBound > 1200 || canvasWidthBound < 800 ? 800 : canvasWidthBound

      // Calculate the aspect ratio of the original canvas
      const aspectRatio = canvas.height / canvas.width

      // Calculate height based on the aspect ratio to maintain image proportions
      const excelHeight = excelWidth * aspectRatio

      // Limit the maximum height (to avoid overly long images)
      const finalHeight = Math.min(excelHeight, 400)
      const finalWidth = excelHeight > 400 ? 400 / aspectRatio : excelWidth

      // Add image to worksheet
      worksheet.addImage(imageId, {
        tl: { col: 0, row: startRow - 1 }, // Top-left position (0-based)
        ext: {
          width: finalWidth,
          height: finalHeight,
        },
      })

      // Calculate the number of rows needed to fit the image (estimate: 1 Excel row ~ 20 pixels)
      const rowsNeeded = Math.ceil(finalHeight / 20)

      return startRow + rowsNeeded
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback: add a text placeholder
      const errorCell = worksheet.getCell(startRow, 1)
      errorCell.value = `[Canvas Image - ${section.title || 'Untitled'}]`
      errorCell.font = { italic: true, color: { argb: 'FF666666' } }

      return startRow + 1
    }
  }

  /**
   * Process text section to Excel
   * @param worksheet - The worksheet to process
   * @param section - The section to process
   * @param startRow - The start row in the worksheet
   * @param maxColumns - The maximum number of columns in the worksheet
   * @returns The current row in the worksheet
   */
  const processTextToExcel = (worksheet: ExcelJS.Worksheet, section: PrintSection, startRow: number): number => {
    try {
      const textElements = section.sectionTexts
      if (!textElements?.length) return startRow

      let currentRow = startRow
      // Process each text element
      textElements.forEach((text, index) => {
        const textCell = worksheet.getCell(currentRow, 1)
        textCell.value = text
        textCell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true,
        }

        // Add spacing between text elements (except for the last one)
        if (index < textElements.length - 1) {
          currentRow++ // Empty row for spacing
        }
      })

      return currentRow
    } catch (err) {
      throw new Error(`Failed to process text section: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  /**
   * Calculates the total number of columns in an HTML table by analyzing colspan attributes
   * @param tableElement - The HTML table element to analyze
   * @returns The total number of columns in the table
   */
  const getTableColumnCount = (tableElement: HTMLTableElement): number => {
    let maxColumns = 0

    // Check all rows to find the maximum column count
    const allRows = tableElement.querySelectorAll('tr')

    allRows.forEach((row) => {
      let columnCount = 0
      const cells = row.querySelectorAll('th, td')

      cells.forEach((cell) => {
        const colspan = parseInt(cell.getAttribute('colspan') || '1')
        columnCount += colspan
      })

      maxColumns = Math.max(maxColumns, columnCount)
    })

    return maxColumns
  }

  // Type definitions for better type safety
  interface FormatState {
    isBold: boolean
    isItalic: boolean
  }

  interface ParsedHtmlResult {
    isRichText: boolean
    richText?: ExcelJS.RichText[]
    plainText?: string
  }

  // Constants for supported HTML tags
  const HTML_TAGS = {
    BOLD: ['b', 'strong'] as const,
    ITALIC: ['i', 'em'] as const,
  } as const

  const createHtmlTagRegex = (): RegExp => /<(\/?)([bi]|strong|em)>/gi

  /**
   * Creates a rich text part with current formatting
   * @param text - Text content to format (e.g., "Hello World")
   * @param formatState - Current formatting state
   * @returns ExcelJS RichText object with applied formatting
   * @example
   * // Input: text="Bold Text", formatState={isBold: true, isItalic: false}
   * // Output: {text: "Bold Text", font: {bold: true, italic: false}}
   */
  const createRichTextPart = (text: string, formatState: FormatState): ExcelJS.RichText => ({
    text,
    font: {
      bold: formatState.isBold,
      italic: formatState.isItalic,
    },
  })

  /**
   * Updates formatting state based on HTML tag
   * @param tagName - HTML tag name (b, strong, i, em)
   * @param isClosing - Whether this is a closing tag
   * @param currentState - Current formatting state
   * @returns Updated formatting state
   * @example
   * // Input: tagName="b", isClosing=false, currentState={isBold: false, isItalic: false}
   * // Output: {isBold: true, isItalic: false}
   */
  const updateFormatting = (tagName: string, isClosing: boolean, currentState: FormatState): FormatState => {
    const { isBold, isItalic } = currentState
    const normalizedTag = tagName.toLowerCase()

    if (HTML_TAGS.BOLD.includes(normalizedTag as 'b' | 'strong')) {
      return { isBold: !isClosing, isItalic }
    }

    if (HTML_TAGS.ITALIC.includes(normalizedTag as 'i' | 'em')) {
      return { isBold, isItalic: !isClosing }
    }

    return currentState
  }

  /**
   * Adds text content to rich text parts array if text exists
   * @param text - Text content to add
   * @param formatState - Current formatting state
   * @param richTextParts - Array to add text parts to
   * @example
   * // Input: text="Hello", formatState={isBold: true, isItalic: false}, richTextParts=[]
   * // Output: richTextParts=[{text: "Hello", font: {bold: true, italic: false}}]
   */
  const addTextIfExists = (text: string, formatState: FormatState, richTextParts: ExcelJS.RichText[]): void => {
    if (text) {
      richTextParts.push(createRichTextPart(text, formatState))
    }
  }

  /**
   * Strips all HTML tags from a string
   * @param htmlString - String containing HTML tags
   * @returns Plain text without HTML tags
   * @example
   * // Input: "<b>Bold</b> text"
   * // Output: "Bold text"
   */
  const stripHtmlTags = (htmlString: string): string => htmlString.replace(/<[^>]*>/g, '')

  /**
   * Parses HTML string to Excel rich text format
   * Supports <b>, <strong>, <i>, <em> tags
   * @param htmlString - HTML string to parse (e.g., "Hello <b>World</b>!")
   * @returns Object containing either rich text array or plain text
   * @example
   * // Input: "Hello <b>World</b>!"
   * // Output: {isRichText: true, richText: [...]}
   */
  const parseHtmlToRichText = (htmlString: string): ParsedHtmlResult => {
    // Return plain text if no HTML tags found
    if (!/<[^>]*>/.test(htmlString)) {
      return { isRichText: false, plainText: htmlString }
    }

    const richTextParts: ExcelJS.RichText[] = []
    const htmlTagRegex = createHtmlTagRegex()
    let lastIndex = 0
    let formatState: FormatState = { isBold: false, isItalic: false }

    // Process each HTML tag match
    let match: RegExpExecArray | null
    while ((match = htmlTagRegex.exec(htmlString)) !== null) {
      // Add text content before current tag
      const textBefore = htmlString.slice(lastIndex, match.index)
      addTextIfExists(textBefore, formatState, richTextParts)

      // Update formatting state based on current tag
      const [, closingFlag, tagName] = match
      const isClosing = closingFlag === '/'
      formatState = updateFormatting(tagName, isClosing, formatState)

      lastIndex = match.index + match[0].length
    }

    // Add remaining text after last tag
    const remainingText = htmlString.slice(lastIndex)
    addTextIfExists(remainingText, formatState, richTextParts)

    // Return plain text if no rich text parts were created
    if (richTextParts.length === 0) {
      return {
        isRichText: false,
        plainText: stripHtmlTags(htmlString),
      }
    }

    return { isRichText: true, richText: richTextParts }
  }

  // Helper function to render text with mixed styling
  const renderMixedText = (
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    options?: { align?: 'left' | 'center' | 'right' | 'justify' },
  ): number => {
    const currentFontSize = pdf.getFontSize()
    const currentFont = pdf.getFont()

    // Split text by <b> and </b> tags
    const parts = text.split(/(<b>.*?<\/b>)/g)
    let currentX = x

    parts.forEach((part) => {
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        // Bold text
        const boldText = part.replace(/<\/?b>/g, '')
        pdf.setFont(FONTS.BOLD, 'bold')
        pdf.text(boldText, currentX, y, options)
        currentX += pdf.getTextWidth(boldText)
      } else if (part.trim()) {
        // Normal text
        pdf.setFont(FONTS.REGULAR, 'normal')
        pdf.text(part, currentX, y, options)
        currentX += pdf.getTextWidth(part)
      }
    })

    // Restore original font settings
    pdf.setFontSize(currentFontSize)
    pdf.setFont(currentFont.fontName, currentFont.fontStyle)

    return currentX
  }

  return {
    // State
    state,

    // Getters
    isVisible,
    sections,
    pdfBlobUrl,
    isLoading,
    isLandscape,
    config,
    error,

    // Actions
    openPrintPreview,
    closePrintPreview,
    setIsLoading,
    downloadPdf,
    downloadExcel,
  }
})
