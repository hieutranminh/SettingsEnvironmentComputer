/**
 * Excel-specific utility functions
 * Utilities for Excel file generation and processing
 *
 * Example usage:
 *   const columnCount = getMaxTableColumns([table1, table2])
 *   const alignment = getColumnAlignment(2, alignmentConfig)
 */

import { PRINT_TYPE } from '@/constants'
import type { IPrintSection } from '@/types/print'

import { EXCEL_DEFAULTS, EXCEL_IMAGE } from '../constants/excel/index'

import { getTableColumnCount } from './tableUtils'

/**
 * Column alignment configuration type
 */
export type ColumnAlignments = { [columnIndex: number]: 'left' | 'center' | 'right' }

/**
 * Gets the maximum number of columns across all table sections
 * @param sections - Array of print sections
 * @returns Maximum column count found
 *
 * Example:
 *   const sections = [tableSection1, tableSection2]
 *   getMaxTableColumns(sections) // Returns: 8
 */
export const getMaxTableColumns = (sections: IPrintSection[]): number => {
  let maxColumns = 1

  sections.forEach((section) => {
    if (section.refType === PRINT_TYPE.TABLE) {
      const tableElement = (section.sectionRefExcel ?? section.sectionRef) as HTMLTableElement
      const tableColumns = getTableColumnCount(tableElement)
      maxColumns = Math.max(maxColumns, tableColumns)
    }
  })

  return maxColumns
}

/**
 * Gets column alignment for a specific column index
 * @param columnIndex - The column index (1-based)
 * @param columnAlignments - Optional alignment configuration
 * @returns Alignment value ('left', 'center', 'right')
 *
 * Example:
 *   const alignment = getColumnAlignment(3, { 1: 'left', 3: 'right' })
 *   // Returns: 'right'
 */
export const getColumnAlignment = (
  columnIndex: number,
  columnAlignments?: ColumnAlignments,
): 'left' | 'center' | 'right' => {
  return columnAlignments?.[columnIndex] ?? 'center'
}

/**
 * Image dimension calculation parameters
 */
interface IImageDimensionParams {
  originalWidth: number
  originalHeight: number
  maxColumns?: number
  columnWidth?: number
  maxHeight?: number
}

/**
 * Calculates optimal image dimensions for Excel
 * @param params - Image dimension calculation parameters
 * @returns Calculated dimensions
 *
 * Example:
 *   const dims = calculateImageDimensions({ originalWidth: 1200, originalHeight: 800, maxColumns: 6, columnWidth: 25, maxHeight: 400 })
 *   // Returns: { width: 800, height: 533, rowsNeeded: 27 }
 */
export const calculateImageDimensions = (
  params: IImageDimensionParams,
): { width: number; height: number; rowsNeeded: number } => {
  const {
    originalWidth,
    originalHeight,
    maxColumns = 1,
    columnWidth = EXCEL_DEFAULTS.COLUMN_WIDTH,
    maxHeight = EXCEL_IMAGE.MAX_HEIGHT,
  } = params
  const aspectRatio = originalHeight / originalWidth

  // Calculate width based on the number of columns (to ensure the image does not exceed the table width)
  // Formula: width = number of columns * column width * adjustment factor
  const canvasWidthBound = maxColumns * columnWidth * EXCEL_IMAGE.ASPECT_RATIO_CALCULATION_FACTOR
  const isWidthOutOfBounds =
    canvasWidthBound > EXCEL_IMAGE.MAX_WIDTH_BOUND || canvasWidthBound < EXCEL_IMAGE.MIN_WIDTH_BOUND
  let excelWidth = isWidthOutOfBounds ? EXCEL_IMAGE.DEFAULT_WIDTH : canvasWidthBound

  // Calculate height maintaining aspect ratio
  let excelHeight = excelWidth * aspectRatio

  // Limit maximum height
  if (excelHeight > maxHeight) {
    excelHeight = maxHeight
    excelWidth = maxHeight / aspectRatio
  }

  // Calculate rows needed
  const rowsNeeded = Math.ceil(excelHeight / EXCEL_IMAGE.PIXELS_PER_ROW)

  return {
    width: excelWidth,
    height: excelHeight,
    rowsNeeded,
  }
}

/**
 * Creates a safe filename for Excel export
 * @param filename - Base filename
 * @returns Safe filename with .xlsx extension
 *
 * Example:
 *   createSafeFilename('report/data') // Returns: 'report-data.xlsx'
 */
export const createSafeFilename = (filename: string): string => {
  const safeFilename = filename.replace(/[/\\?%*:|"<>]/g, '-')
  return safeFilename.endsWith('.xlsx') ? safeFilename : `${safeFilename}.xlsx`
}

/**
 * Checks if a section has table data
 * @param section - Print section to check
 * @returns True if section contains table data
 */
export const hasTableData = (section: IPrintSection): boolean => {
  if (section.refType !== PRINT_TYPE.TABLE) return false

  const tableElement = section.sectionRef as HTMLTableElement
  const rows = tableElement.querySelectorAll('tr')
  return rows.length > 0
}

/**
 * Checks if a section has text data
 * @param section - Print section to check
 * @returns True if section contains text data
 */
export const hasTextData = (section: IPrintSection): boolean => {
  if (section.refType !== PRINT_TYPE.TEXT) return false
  return !!(section.sectionTexts && section.sectionTexts.length > 0)
}

/**
 * Checks if a section has canvas data
 * @param section - Print section to check
 * @returns True if section contains canvas/element data
 */
export const hasCanvasData = (section: IPrintSection): boolean => {
  if (section.refType !== PRINT_TYPE.CANVAS) return false
  return !!section.sectionRef
}
