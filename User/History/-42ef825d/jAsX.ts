/**
 * Excel table processing composable
 * Handles HTML table conversion to Excel format with merged cells support
 *
 * Example usage:
 *   const { processTable } = useExcelTable()
 *   const endRow = processTable(worksheet, tableElement, startRow, alignments)
 */

import type ExcelJS from 'exceljs'

import { EXCEL_TABLE_DEFAULTS } from '../constants/excel/index'
import type { ColumnAlignments } from '../utils/excelUtils'
import {
  createCellTracker,
  findNextAvailableColumn,
  getCellText,
  getCellColspan,
  getCellRowspan,
  type CellTracker,
} from '../utils/tableUtils'

import { useExcelCellFormatter } from './useExcelCellFormatter'

/**
 * Table processing configuration
 */
interface ITableProcessingConfig {
  startColumn: number
  defaultColspan: number
  defaultRowspan: number
}

/**
 * Table processing context
 */
interface ITableProcessingContext {
  worksheet: ExcelJS.Worksheet
  cellTracker: CellTracker
  columnAlignments?: ColumnAlignments
  config: ITableProcessingConfig
}

/**
 * Cell formatter function type
 */
type CellFormatterFunction = (
  cell: ExcelJS.Cell,
  text: string,
  columnIndex: number,
  alignments?: ColumnAlignments,
) => void

/**
 * Excel table composable return type
 */
export interface IUseExcelTableReturn {
  processTable: (
    worksheet: ExcelJS.Worksheet,
    tableElement: HTMLTableElement,
    startRow: number,
    columnAlignments?: ColumnAlignments,
  ) => number
  processTableHeaders: (
    tableContext: ITableProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ) => number
  processTableBody: (
    tableContext: ITableProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ) => number
  processTableFooter: (
    tableContext: ITableProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ) => number
}

/**
 * Composable for Excel table processing
 * @returns Table processing utilities
 */
export const useExcelTable = (): IUseExcelTableReturn => {
  const { formatHeaderCell, formatDataCell, formatFooterCell } = useExcelCellFormatter()

  // Default configuration for table processing
  const defaultConfig: ITableProcessingConfig = {
    startColumn: EXCEL_TABLE_DEFAULTS.START_COLUMN,
    defaultColspan: EXCEL_TABLE_DEFAULTS.DEFAULT_COLSPAN,
    defaultRowspan: EXCEL_TABLE_DEFAULTS.DEFAULT_ROWSPAN,
  }

  // Wrapper functions to normalize formatter signatures
  const headerCellFormatter: CellFormatterFunction = (cell, text) => {
    formatHeaderCell(cell, text)
  }

  const dataCellFormatter: CellFormatterFunction = (cell, text, columnIndex, alignments) => {
    formatDataCell(cell, text, columnIndex, alignments)
  }

  const footerCellFormatter: CellFormatterFunction = (cell, text, columnIndex, alignments) => {
    formatFooterCell(cell, text, columnIndex, alignments)
  }

  /**
   * Handles merged cells in Excel worksheet
   * @param tableContext - Table processing context
   * @param rowIndex - Current row index
   * @param columnIndex - Current column index
   * @param rowspan - Number of rows to span
   * @param colspan - Number of columns to span
   * @returns Void
   *
   * Example:
   *   handleMergedCells(context, 1, 2, 2, 3)
   */
  const handleMergedCells = (
    tableContext: ITableProcessingContext,
    rowIndex: number,
    columnIndex: number,
    rowspan: number,
    colspan: number,
  ): void => {
    if (rowspan > 1 || colspan > 1) {
      const endRow = rowIndex + rowspan - 1
      const endColumn = columnIndex + colspan - 1
      tableContext.worksheet.mergeCells(rowIndex, columnIndex, endRow, endColumn)
      tableContext.cellTracker.markCellsOccupied(rowIndex, columnIndex, rowspan, colspan)
    } else {
      tableContext.cellTracker.markCellsOccupied(rowIndex, columnIndex, 1, 1)
    }
  }

  /**
   * Processes a single table cell and handles merged cells
   * @param tableCell - HTML table cell element
   * @param tableContext - Table processing context
   * @param rowIndex - Current row index
   * @param columnIndex - Current column index
   * @param cellFormatter - Function to format the Excel cell
   * @returns Updated column index after processing
   *
   * Example:
   *   const nextCol = processSingleCell(cell, context, 1, 2, formatHeaderCell)
   */
  const processSingleCell = (
    tableCell: HTMLTableCellElement,
    tableContext: ITableProcessingContext,
    rowIndex: number,
    columnIndex: number,
    cellFormatter: CellFormatterFunction,
  ): number => {
    const cellText = getCellText(tableCell)
    const colspan = getCellColspan(tableCell)
    const rowspan = getCellRowspan(tableCell)

    // Get Excel cell and format it
    const excelCell = tableContext.worksheet.getCell(rowIndex, columnIndex)
    cellFormatter(excelCell, cellText, columnIndex, tableContext.columnAlignments)

    // Handle merged cells
    handleMergedCells(tableContext, rowIndex, columnIndex, rowspan, colspan)

    return columnIndex + colspan
  }

  /**
   * Processes a single table row
   * @param tableRow - HTML table row element
   * @param tableContext - Table processing context
   * @param rowIndex - Current row index
   * @param cellFormatter - Function to format Excel cells
   * @returns Void
   *
   * Example:
   *   processTableRow(row, context, 1, formatHeaderCell)
   */
  const processTableRow = (
    tableRow: HTMLTableRowElement,
    tableContext: ITableProcessingContext,
    rowIndex: number,
    cellFormatter: CellFormatterFunction,
  ): void => {
    const cells = tableRow.querySelectorAll('th, td')
    let currentColumn = tableContext.config.startColumn

    cells.forEach((cell) => {
      // Find next available column position
      currentColumn = findNextAvailableColumn(tableContext.cellTracker, rowIndex, currentColumn)

      // Process the cell
      currentColumn = processSingleCell(
        cell as HTMLTableCellElement,
        tableContext,
        rowIndex,
        currentColumn,
        cellFormatter,
      )
    })
  }

  /**
   * Processes a table section (header, body, or footer)
   * @param tableContext - Table processing context
   * @param sectionElement - HTML section element (thead, tbody, or tfoot)
   * @param startRow - Starting row for this section
   * @param cellFormatter - Function to format Excel cells
   * @returns Row number after processing this section
   *
   * Example:
   *   const endRow = processTableSection(context, thead, 1, formatHeaderCell)
   */
  const processTableSection = (
    tableContext: ITableProcessingContext,
    sectionElement: HTMLElement | null,
    startRow: number,
    cellFormatter: CellFormatterFunction,
  ): number => {
    if (!sectionElement) return startRow

    const rows = sectionElement.querySelectorAll('tr')
    let currentRow = startRow

    rows.forEach((row) => {
      processTableRow(row as HTMLTableRowElement, tableContext, currentRow, cellFormatter)
      currentRow++
    })

    return currentRow
  }

  /**
   * Processes an HTML table and converts it to Excel format
   * @param worksheet - Excel worksheet to add table to
   * @param tableElement - HTML table element to process
   * @param startRow - Starting row in worksheet
   * @param columnAlignments - Optional column alignment configuration
   * @returns Final row number after table processing
   *
   * Example:
   *   const endRow = processTable(worksheet, tableElement, 5, { 1: 'left', 2: 'center' })
   */
  const processTable = (
    worksheet: ExcelJS.Worksheet,
    tableElement: HTMLTableElement,
    startRow: number,
    columnAlignments?: ColumnAlignments,
  ): number => {
    const tableContext: ITableProcessingContext = {
      worksheet,
      cellTracker: createCellTracker(),
      columnAlignments,
      config: defaultConfig,
    }

    let currentRow = startRow

    // Process each section of the table
    currentRow = processTableHeaders(tableContext, tableElement, currentRow)
    currentRow = processTableBody(tableContext, tableElement, currentRow)
    currentRow = processTableFooter(tableContext, tableElement, currentRow)

    return currentRow
  }

  /**
   * Processes table headers (thead section)
   * @param tableContext - Table processing context
   * @param tableElement - HTML table element
   * @param startRow - Starting row for headers
   * @returns Row number after header processing
   *
   * Example:
   *   const endRow = processTableHeaders(context, tableElement, 1)
   */
  const processTableHeaders = (
    tableContext: ITableProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ): number => {
    const thead = tableElement.querySelector('thead')
    return processTableSection(tableContext, thead, startRow, headerCellFormatter)
  }

  /**
   * Processes table body (tbody section)
   * @param tableContext - Table processing context
   * @param tableElement - HTML table element
   * @param startRow - Starting row for body
   * @returns Row number after body processing
   *
   * Example:
   *   const endRow = processTableBody(context, tableElement, 3)
   */
  const processTableBody = (
    tableContext: ITableProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ): number => {
    const tbody = tableElement.querySelector('tbody')
    return processTableSection(tableContext, tbody, startRow, dataCellFormatter)
  }

  /**
   * Processes table footer (tfoot section)
   * @param tableContext - Table processing context
   * @param tableElement - HTML table element
   * @param startRow - Starting row for footer
   * @returns Row number after footer processing
   *
   * Example:
   *   const endRow = processTableFooter(context, tableElement, 10)
   */
  const processTableFooter = (
    tableContext: ITableProcessingContext,
    tableElement: HTMLTableElement,
    startRow: number,
  ): number => {
    const tfoot = tableElement.querySelector('tfoot')
    return processTableSection(tableContext, tfoot, startRow, footerCellFormatter)
  }

  return {
    processTable,
    processTableHeaders,
    processTableBody,
    processTableFooter,
  }
}
