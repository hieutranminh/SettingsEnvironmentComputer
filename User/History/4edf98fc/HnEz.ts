/**
 * Excel header generation composable
 * Handles title, subtitle, date range, and total items in Excel headers
 *
 * Example usage:
 *   const { addHeader } = useExcelHeader()
 *   const currentRow = addHeader(worksheet, config, maxColumns)
 */

import type ExcelJS from 'exceljs'

import { useDateFormat } from '@/composables/useDateFormat'
import type { IPdfConfig } from '@/types/print'

import {
  EXCEL_DEFAULTS,
  EXCEL_ALIGNMENT,
  EXCEL_SPACING,
  EXCEL_DATE_FORMATS,
  EXCEL_HEADER,
} from '../constants/excel/index'

import { useExcelCellFormatter, type ICellFormatOptions } from './useExcelCellFormatter'

/**
 * Excel header composable return type
 */
export interface IUseExcelHeaderReturn {
  addHeader: (
    worksheet: ExcelJS.Worksheet,
    config: Required<IPdfConfig>,
    maxColumns: number,
  ) => number
}

/**
 * Type guard to check if value is rich text
 * @param value - Value to check
 * @returns True if value is rich text object
 */
const isRichText = (value: unknown): value is { richText: ExcelJS.RichText[] } => {
  return typeof value === 'object' && value !== null && 'richText' in value
}

/**
 * Composable for Excel header generation
 * @returns Header generation utilities
 */
export const useExcelHeader = (): IUseExcelHeaderReturn => {
  const { formatDate } = useDateFormat()
  const { formatCell, createRichTextValue } = useExcelCellFormatter()

  /**
   * Adds a simple header item to worksheet
   * @param worksheet - Excel worksheet to add item to
   * @param value - Text value to add
   * @param currentRow - Current row position
   * @param formatOptions - Cell formatting options
   * @returns Updated row position
   *
   * Example:
   *   const newRow = addHeaderItem(worksheet, 'Sales Report', 1, { bold: true, fontSize: 16 })
   */
  const addHeaderItem = (
    worksheet: ExcelJS.Worksheet,
    value: string,
    currentRow: number,
    formatOptions: ICellFormatOptions,
  ): number => {
    const cell = worksheet.getCell(currentRow, EXCEL_HEADER.HEADER_COLUMN)
    cell.value = value
    formatCell(cell, formatOptions)
    return currentRow + EXCEL_SPACING.HEADER_SPACING
  }

  /**
   * Adds total items with rich text formatting support
   * @param worksheet - Excel worksheet to add total items to
   * @param totalItems - Total items text (may contain HTML formatting)
   * @param currentRow - Current row position
   * @returns Updated row position
   *
   * Example:
   *   const newRow = addTotalItems(worksheet, 'Total: <b>150</b> items', 3)
   */
  const addTotalItems = (
    worksheet: ExcelJS.Worksheet,
    totalItems: string,
    currentRow: number,
  ): number => {
    const cell = worksheet.getCell(currentRow, EXCEL_HEADER.HEADER_COLUMN)
    const richTextValue = createRichTextValue(totalItems)

    cell.value = richTextValue

    // Only apply formatting if it's not rich text
    if (!isRichText(richTextValue)) {
      formatCell(cell, {
        fontSize: EXCEL_DEFAULTS.TOTAL_ITEMS_FONT_SIZE,
      })
    }

    return currentRow + EXCEL_SPACING.HEADER_SPACING
  }

  /**
   * Adds generation date to the rightmost column
   * @param worksheet - Excel worksheet to add date to
   * @param currentRow - Current row position
   * @param maxColumns - Maximum number of columns for positioning
   * @returns Updated row position
   *
   * Example:
   *   const newRow = addGenerationDate(worksheet, 4, 6)
   */
  const addGenerationDate = (
    worksheet: ExcelJS.Worksheet,
    currentRow: number,
    maxColumns: number,
  ): number => {
    if (maxColumns <= EXCEL_HEADER.MIN_COLUMNS_FOR_DATE) {
      return currentRow
    }

    const cell = worksheet.getCell(currentRow, maxColumns)
    cell.value = formatDate(new Date(), { format: EXCEL_DATE_FORMATS.WITH_DAY })
    formatCell(cell, {
      alignment: EXCEL_ALIGNMENT.HORIZONTAL.RIGHT,
      verticalAlignment: EXCEL_ALIGNMENT.VERTICAL.MIDDLE,
      fontSize: EXCEL_DEFAULTS.BODY_FONT_SIZE,
    })

    return currentRow
  }

  /**
   * Adds header information to Excel worksheet
   * @param worksheet - Excel worksheet to add header to
   * @param config - Configuration containing header information
   * @param maxColumns - Maximum number of columns for positioning
   * @returns Current row number after header addition
   *
   * Example:
   *   const currentRow = addHeader(worksheet, {
   *     title: 'Sales Report',
   *     subtitle: 'Monthly Summary',
   *     dateRange: '2024-01-01 ~ 2024-01-31',
   *     totalItems: 'Total: <b>150</b> items'
   *   }, 6)
   */
  const addHeader = (
    worksheet: ExcelJS.Worksheet,
    config: Required<IPdfConfig>,
    maxColumns: number,
  ): number => {
    let currentRow = EXCEL_HEADER.STARTING_ROW

    // Add title
    if (config.title) {
      currentRow = addHeaderItem(worksheet, config.title, currentRow, {
        bold: true,
        fontSize: EXCEL_DEFAULTS.TITLE_FONT_SIZE,
      })
    }

    // Add subtitle
    if (config.subtitle) {
      currentRow = addHeaderItem(worksheet, config.subtitle, currentRow, {
        fontSize: EXCEL_DEFAULTS.SUBTITLE_FONT_SIZE,
      })
    }

    // Add date range
    if (config.dateRange) {
      currentRow = addHeaderItem(worksheet, config.dateRange, currentRow, {
        bold: true,
        fontSize: EXCEL_DEFAULTS.DATE_FONT_SIZE,
      })
    }

    // Add total items with rich text formatting
    if (config.totalItems) {
      currentRow = addTotalItems(worksheet, config.totalItems, currentRow)
    }

    // Add generation date to the rightmost column
    currentRow = addGenerationDate(worksheet, currentRow, maxColumns)

    // Add empty row for spacing
    currentRow += EXCEL_SPACING.HEADER_SPACING

    return currentRow
  }

  return {
    addHeader,
  }
}
