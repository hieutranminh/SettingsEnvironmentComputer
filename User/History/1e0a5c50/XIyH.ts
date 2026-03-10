/**
 * Table analysis and processing utilities
 *
 * Example usage:
 *   const columnCount = getTableColumnCount(tableElement)
 *   const value = parseCellValue('1,234.56')
 */

import { DATE_PATTERNS } from '../constants'

/**
 * Cell tracker for managing merged cells in Excel
 */
export interface CellTracker {
  occupiedCells: Map<string, boolean>
  isCellOccupied: (row: number, col: number) => boolean
  markCellsOccupied: (startRow: number, startCol: number, rowspan: number, colspan: number) => void
}

/**
 * Parsed cell value result
 */
export interface ParsedCellValue {
  value: string | number
  isNumeric: boolean
  isDate?: boolean
}

/**
 * Table dimension information
 */
export interface TableDimensions {
  rows: number
  columns: number
  hasHeader: boolean
  hasFooter: boolean
}

/**
 * Creates a cell tracker for managing merged cells
 * @returns CellTracker instance
 *
 * Example:
 *   const tracker = createCellTracker()
 *   tracker.markCellsOccupied(1, 1, 2, 3) // Mark 2x3 area as occupied
 *   tracker.isCellOccupied(1, 2) // Returns: true
 */
export const createCellTracker = (): CellTracker => {
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

/**
 * Calculates the total number of columns in an HTML table
 * @param tableElement - The HTML table element to analyze
 * @returns The total number of columns in the table
 *
 * Example:
 *   const table = document.querySelector('table')
 *   getTableColumnCount(table) // Returns: 5
 */
export const getTableColumnCount = (tableElement: HTMLTableElement): number => {
  let maxColumns = 0

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

/**
 * Gets table dimensions and structure information
 * @param tableElement - The HTML table element to analyze
 * @returns Table dimension information
 */
export const getTableDimensions = (tableElement: HTMLTableElement): TableDimensions => {
  const rows = tableElement.querySelectorAll('tr').length
  const columns = getTableColumnCount(tableElement)
  const hasHeader = !!tableElement.querySelector('thead')
  const hasFooter = !!tableElement.querySelector('tfoot')

  return { rows, columns, hasHeader, hasFooter }
}

/**
 * Checks if a string represents a date
 * @param text - Text to check
 * @returns True if text matches date pattern
 */
export const isDateString = (text: string): boolean => {
  const trimmedText = text.trim()
  return DATE_PATTERNS.some((pattern) => pattern.test(trimmedText))
}

/**
 * Checks if a string represents a numeric value
 * @param text - Text to check
 * @returns True if text is numeric
 */
export const isNumericString = (text: string): boolean => {
  const numericValue = parseFloat(text.replace(/[^\d.-]/g, ''))
  return !isNaN(numericValue) && /^\s*[\d,.-]+\s*$/.test(text)
}

/**
 * Parses cell value to determine type and format
 * @param cellText - The text in the cell
 * @returns The parsed value and type information
 *
 * Example:
 *   parseCellValue('1,234.56')
 *   // Returns: { value: 1234.56, isNumeric: true }
 *
 *   parseCellValue('2024-01-15')
 *   // Returns: { value: '2024-01-15', isNumeric: false, isDate: true }
 */
export const parseCellValue = (cellText: string): ParsedCellValue => {
  // Check if date
  if (isDateString(cellText)) {
    const date = new Date(cellText.trim())
    if (!isNaN(date.getTime())) {
      return { value: cellText, isNumeric: false, isDate: true }
    }
  }

  // Check if numeric
  if (isNumericString(cellText)) {
    const numericValue = parseFloat(cellText.replace(/[^\d.-]/g, ''))
    return { value: numericValue, isNumeric: true }
  }

  // Default to string
  return { value: cellText, isNumeric: false }
}

/**
 * Gets colspan value from a table cell
 * @param cell - HTML table cell element
 * @returns Colspan value (default: 1)
 */
export const getCellColspan = (cell: HTMLTableCellElement): number => {
  return parseInt(cell.getAttribute('colspan') || '1')
}

/**
 * Gets rowspan value from a table cell
 * @param cell - HTML table cell element
 * @returns Rowspan value (default: 1)
 */
export const getCellRowspan = (cell: HTMLTableCellElement): number => {
  return parseInt(cell.getAttribute('rowspan') || '1')
}

/**
 * Gets text content from a table cell
 * @param cell - HTML table cell element
 * @returns Trimmed text content
 */
export const getCellText = (cell: HTMLTableCellElement): string => {
  return cell.textContent?.trim() || ''
}

/**
 * Finds the next available column in a row (considering merged cells)
 * @param tracker - Cell tracker instance
 * @param row - Current row number
 * @param startCol - Starting column to check from
 * @returns Next available column index
 */
export const findNextAvailableColumn = (tracker: CellTracker, row: number, startCol: number = 1): number => {
  let col = startCol
  while (tracker.isCellOccupied(row, col)) {
    col++
  }
  return col
}

/**
 * Estimates the height of a table in points
 * @param tableElement - HTML table element
 * @param rowHeight - Estimated height per row (default: 12pt)
 * @returns Estimated table height in points
 */
export const estimateTableHeight = (tableElement: HTMLTableElement, rowHeight: number = 12): number => {
  const totalRows = tableElement.querySelectorAll('tr').length || 1
  const margins = 20 // Additional space for margins
  return totalRows * rowHeight + margins
}
