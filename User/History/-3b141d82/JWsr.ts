/**
 * Main Excel generation composable
 * Coordinates Excel creation from multiple sections
 *
 * Example usage:
 *   const { generateExcel } = useExcelGenerator()
 *   await generateExcel(sections, config, 'report-2024')
 */

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import { PRINT_TYPE } from '@/constants'
import type { PrintSection, PdfConfig } from '@/types/print'

import { EXCEL_SPACING, EXCEL_FORMAT, EXCEL_DEFAULTS } from '../constants/excel/index'
import { getMaxTableColumns, createSafeFilename, hasTableData, hasTextData, hasCanvasData } from '../utils/excelUtils'

// Composables
import { useExcelCanvas } from './useExcelCanvas'
import { useExcelCellFormatter } from './useExcelCellFormatter'
import { useExcelHeader } from './useExcelHeader'
import { useExcelTable } from './useExcelTable'
import { useExcelText } from './useExcelText'
import { useExcelWorkbook } from './useExcelWorkbook'

/**
 * Section processor strategy interface
 */
interface SectionProcessor {
  canProcess: (section: PrintSection) => boolean
  process: (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    section: PrintSection,
    currentRow: number,
    maxColumns: number,
  ) => Promise<number>
}

export interface UseExcelGeneratorReturn {
  generateExcel: (sections: PrintSection[], config?: PdfConfig, filename?: string) => Promise<void>
  processExcelSections: (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    sections: PrintSection[],
    startRow: number,
    maxColumns: number,
  ) => Promise<number>
}

/**
 * Composable for Excel generation
 * @returns Excel generation utilities
 */
export const useExcelGenerator = (): UseExcelGeneratorReturn => {
  const { createWorkbook, createWorksheet } = useExcelWorkbook()
  const { addHeader } = useExcelHeader()
  const { processTable } = useExcelTable()
  const { processCanvas } = useExcelCanvas()
  const { processText } = useExcelText()
  const { formatCell } = useExcelCellFormatter()

  /**
   * Validates input parameters
   * @param sections - Print sections to validate
   * @param config - Optional configuration
   * @param filename - Optional filename
   */
  const validateInputs = (sections: PrintSection[], config?: PdfConfig, filename?: string): void => {
    if (!Array.isArray(sections)) {
      throw new Error('Sections must be an array')
    }

    if (sections.length === 0) {
      throw new Error('Sections array cannot be empty')
    }

    if (filename && typeof filename !== 'string') {
      throw new Error('Filename must be a string')
    }
  }

  /**
   * Creates a Required<PdfConfig> from optional config with default values
   * @param config - Optional configuration
   * @returns Required configuration with defaults
   */
  const createRequiredConfig = (config: PdfConfig): Required<PdfConfig> => {
    return {
      title: config.title || '',
      subtitle: config.subtitle || '',
      dateRange: config.dateRange || '',
      format: config.format || 'a4',
      unit: config.unit || 'mm',
      orientation: config.orientation || 'portrait',
      printDate: config.printDate || '',
      totalItems: config.totalItems || '',
      skipExcelDownload: config.skipExcelDownload || false,
    }
  }

  /**
   * Adds section title to worksheet with column merging and alignment support
   * @param worksheet - Excel worksheet
   * @param title - Section title
   * @param currentRow - Current row position
   * @param titleAlignment - Title alignment (left, center, right)
   * @param maxColumns - Maximum columns for merging
   * @returns Updated row position
   *
   * Example:
   *   const newRow = addSectionTitle(worksheet, 'Sales Report', 5, 'center', 8)
   */
  const addSectionTitle = (
    worksheet: ExcelJS.Worksheet,
    section: PrintSection,
    currentRow: number,
    maxColumns: number = 1,
  ): number => {
    const startColumn = EXCEL_DEFAULTS.TITLE_COLUMN
    const endColumn = Math.max(startColumn, maxColumns)

    // Get the title cell
    const sectionTitleCell = worksheet.getCell(currentRow, startColumn)
    sectionTitleCell.value = section.title

    // Merge cells if we have multiple columns
    if (maxColumns > 1) {
      worksheet.mergeCells(currentRow, startColumn, currentRow, endColumn)
    }

    // Format the cell with alignment
    formatCell(sectionTitleCell, {
      bold: true,
      fontSize: EXCEL_DEFAULTS.SECTION_TITLE_FONT_SIZE,
      alignment: section.titleAlignment || EXCEL_DEFAULTS.DEFAULT_TITLE_ALIGNMENT,
      verticalAlignment: 'middle',
    })

    return currentRow + EXCEL_SPACING.SECTION_SPACING
  }

  /**
   * Section processors for different types
   */
  const sectionProcessors: SectionProcessor[] = [
    {
      canProcess: (section) => section.refType === PRINT_TYPE.TABLE && hasTableData(section),
      process: (worksheet, _, section, currentRow) => {
        const tableElement = section.sectionRef as HTMLTableElement
        return processTable(worksheet, tableElement, currentRow, section.excelColumnAlignments)
      },
    },
    {
      canProcess: (section) => section.refType === PRINT_TYPE.CANVAS && hasCanvasData(section),
      process: async (worksheet, workbook, section, currentRow, maxColumns) => {
        const canvasElement = section.sectionRef as HTMLElement
        return await processCanvas(worksheet, workbook, canvasElement, currentRow, maxColumns, section.title)
      },
    },
    {
      canProcess: (section) => section.refType === PRINT_TYPE.TEXT && hasTextData(section),
      process: (worksheet, _, section, currentRow) => {
        return processText(worksheet, section.sectionTexts!, currentRow)
      },
    },
  ]

  /**
   * Processes a single section
   * @param worksheet - Excel worksheet
   * @param workbook - Excel workbook
   * @param section - Section to process
   * @param currentRow - Current row position
   * @param maxColumns - Maximum columns
   * @returns Updated row position
   */
  const processSection = async (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    section: PrintSection,
    currentRow: number,
    maxColumns: number,
  ): Promise<number> => {
    // Add section title if exists
    if (section.title) {
      currentRow = addSectionTitle(worksheet, section, currentRow, maxColumns)
    }

    // Find and execute appropriate processor
    const processor = sectionProcessors.find((p) => p.canProcess(section))
    if (processor) {
      return await processor.process(worksheet, workbook, section, currentRow, maxColumns)
    }

    return currentRow
  }

  /**
   * Processes all sections and adds them to the Excel worksheet
   * @param worksheet - Excel worksheet to add sections to
   * @param workbook - Excel workbook for image management
   * @param sections - Print sections to process
   * @param startRow - Starting row for content
   * @param maxColumns - Maximum columns for layout calculations
   * @returns Final row number after all sections
   *
   * Example:
   *   const endRow = await processExcelSections(worksheet, workbook, sections, 5, 8)
   */
  const processExcelSections = async (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    sections: PrintSection[],
    startRow: number,
    maxColumns: number,
  ): Promise<number> => {
    let currentRow = startRow

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex]
      const isLastSection = sectionIndex === sections.length - 1

      // Process section
      currentRow = await processSection(worksheet, workbook, section, currentRow, maxColumns)

      // Add spacing between sections (except for the last one)
      if (!isLastSection) {
        currentRow += EXCEL_SPACING.SECTION_SPACING
      }
    }

    return currentRow
  }

  /**
   * Generates Excel file from print sections
   * @param sections - Print sections to include in Excel
   * @param config - Optional configuration for header information
   * @param filename - Optional filename for the Excel file
   *
   * Example:
   *   await generateExcel(sections, {
   *     title: 'Sales Report',
   *     subtitle: 'Q1 2024',
   *     dateRange: '2024-01-01 ~ 2024-03-31'
   *   }, 'sales-report-q1-2024')
   */
  const generateExcel = async (
    sections: PrintSection[],
    config?: PdfConfig,
    filename: string = EXCEL_DEFAULTS.DEFAULT_FILENAME,
  ): Promise<void> => {
    try {
      // Validate inputs
      validateInputs(sections, config, filename)

      // Create workbook and worksheet
      const workbook = createWorkbook()
      const worksheetTitle = config?.title || EXCEL_DEFAULTS.DEFAULT_WORKSHEET_TITLE
      const worksheet = createWorksheet(workbook, worksheetTitle)

      // Calculate maximum columns for layout
      const maxColumns = getMaxTableColumns(sections)

      let currentRow = EXCEL_DEFAULTS.START_ROW

      // Add header if config is provided
      if (config) {
        // Ensure config has all required properties for addHeader
        const requiredConfig = createRequiredConfig(config)
        currentRow = addHeader(worksheet, requiredConfig, maxColumns)
      }

      // Process all sections
      await processExcelSections(worksheet, workbook, sections, currentRow, maxColumns)

      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: EXCEL_FORMAT.MIME_TYPE })
      const safeFilename = createSafeFilename(filename)

      saveAs(blob, safeFilename)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Excel generation failed: ${message}`)
    }
  }

  return {
    generateExcel,
    processExcelSections,
  }
}
