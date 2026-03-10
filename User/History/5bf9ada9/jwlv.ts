/**
 * Excel cell formatting composable
 * Handles cell styling, formatting, and rich text processing
 *
 * Example usage:
 *   const { formatCell, createRichText } = useExcelCellFormatter()
 *   formatCell(cell, { bold: true, alignment: 'center' })
 */

import type ExcelJS from 'exceljs'

import { EXCEL_STYLES, EXCEL_ALIGNMENT, EXCEL_FONT } from '../constants/excel/index'
import type { ColumnAlignments } from '../utils/excelUtils'
import { parseHtmlToRichText, type HtmlToExcelResult } from '../utils/htmlParser'
import { parseCellValue, type ParsedCellValue } from '../utils/tableUtils'

/**
 * Helper function to check if font object has properties
 * @param font - Font object to check
 * @returns True if font has properties
 */
const hasFontProperties = (font: Partial<ExcelJS.Font>): boolean => {
  return Object.keys(font).length > 0
}

/**
 * Helper function to check if alignment object has properties
 * @param alignment - Alignment object to check
 * @returns True if alignment has properties
 */
const hasAlignmentProperties = (alignment: Partial<ExcelJS.Alignment>): boolean => {
  return Object.keys(alignment).length > 0
}

/**
 * Helper function to check if cell format options have alignment properties
 * @param options - Cell format options to check
 * @returns True if options have alignment properties
 */
const hasAlignmentOptions = (options: ICellFormatOptions): boolean => {
  return !!(options.alignment ?? options.verticalAlignment ?? options.wrapText !== undefined)
}

/**
 * Cell formatting options
 */
export interface ICellFormatOptions {
  bold?: boolean
  italic?: boolean
  fontSize?: number
  alignment?: 'left' | 'center' | 'right'
  verticalAlignment?: 'top' | 'middle' | 'bottom'
  fillColor?: string
  border?: boolean
  wrapText?: boolean
  numberFormat?: string
}

/**
 * Cell formatting parameters
 */
interface ICellFormattingParams {
  cell: ExcelJS.Cell
  text: string
  columnIndex: number
  columnAlignments?: ColumnAlignments
  isFooter?: boolean
}

/**
 * Excel cell formatter composable return type
 */
export interface IUseExcelCellFormatterReturn {
  formatCell: (cell: ExcelJS.Cell, options: ICellFormatOptions) => void
  formatHeaderCell: (cell: ExcelJS.Cell, text: string) => void
  formatDataCell: (
    cell: ExcelJS.Cell,
    text: string,
    columnIndex: number,
    columnAlignments?: ColumnAlignments,
  ) => void
  formatFooterCell: (
    cell: ExcelJS.Cell,
    text: string,
    columnIndex: number,
    columnAlignments?: ColumnAlignments,
  ) => void
  createRichTextValue: (htmlString: string) => ExcelJS.CellRichTextValue | string
}

/**
 * Composable for Excel cell formatting
 * @returns Cell formatting utilities
 */
export const useExcelCellFormatter = (): IUseExcelCellFormatterReturn => {
  /**
   * Applies font formatting to a cell
   * @param cell - Excel cell to format
   * @param options - Font formatting options
   */
  const applyFontFormatting = (cell: ExcelJS.Cell, options: ICellFormatOptions): void => {
    const font: Partial<ExcelJS.Font> = {}
    if (options.bold !== undefined) font.bold = options.bold
    if (options.italic !== undefined) font.italic = options.italic
    if (options.fontSize !== undefined) font.size = options.fontSize

    if (hasFontProperties(font)) {
      cell.font = { ...cell.font, ...font }
    }
  }

  /**
   * Applies alignment formatting to a cell
   * @param cell - Excel cell to format
   * @param options - Alignment formatting options
   */
  const applyAlignmentFormatting = (cell: ExcelJS.Cell, options: ICellFormatOptions): void => {
    if (hasAlignmentOptions(options)) {
      const alignment: Partial<ExcelJS.Alignment> = {}
      if (options.alignment) alignment.horizontal = options.alignment
      if (options.verticalAlignment) alignment.vertical = options.verticalAlignment
      if (options.wrapText !== undefined) alignment.wrapText = options.wrapText

      if (hasAlignmentProperties(alignment)) {
        cell.alignment = { ...cell.alignment, ...alignment }
      }
    }
  }

  /**
   * Applies fill color formatting to a cell
   * @param cell - Excel cell to format
   * @param options - Fill formatting options
   */
  const applyFillFormatting = (cell: ExcelJS.Cell, options: ICellFormatOptions): void => {
    if (options.fillColor) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: options.fillColor },
      }
    }
  }

  /**
   * Applies border formatting to a cell
   * @param cell - Excel cell to format
   * @param options - Border formatting options
   */
  const applyBorderFormatting = (cell: ExcelJS.Cell, options: ICellFormatOptions): void => {
    if (options.border) {
      cell.border = {
        top: { style: EXCEL_STYLES.BORDER_STYLE },
        left: { style: EXCEL_STYLES.BORDER_STYLE },
        bottom: { style: EXCEL_STYLES.BORDER_STYLE },
        right: { style: EXCEL_STYLES.BORDER_STYLE },
      }
    }
  }

  /**
   * Applies number format to a cell
   * @param cell - Excel cell to format
   * @param options - Number format options
   */
  const applyNumberFormatting = (cell: ExcelJS.Cell, options: ICellFormatOptions): void => {
    if (options.numberFormat) {
      cell.numFmt = options.numberFormat
    }
  }

  /**
   * Applies formatting options to an Excel cell
   * @param cell - Excel cell to format
   * @param options - Formatting options to apply
   *
   * Example:
   *   formatCell(cell, { bold: true, alignment: 'center', fillColor: 'FFCCCCCC' })
   */
  const formatCell = (cell: ExcelJS.Cell, options: ICellFormatOptions): void => {
    applyFontFormatting(cell, options)
    applyAlignmentFormatting(cell, options)
    applyFillFormatting(cell, options)
    applyBorderFormatting(cell, options)
    applyNumberFormatting(cell, options)
  }

  /**
   * Formats a header cell with standard header styling
   * @param cell - Excel cell to format
   * @param text - Text content for the cell
   *
   * Example:
   *   formatHeaderCell(cell, 'Column Header')
   */
  const formatHeaderCell = (cell: ExcelJS.Cell, text: string): void => {
    cell.value = text
    formatCell(cell, {
      bold: EXCEL_FONT.BOLD,
      alignment: EXCEL_ALIGNMENT.HORIZONTAL.CENTER,
      verticalAlignment: EXCEL_ALIGNMENT.VERTICAL.MIDDLE,
      fillColor: EXCEL_STYLES.HEADER_FILL_COLOR,
      border: true,
      wrapText: true,
    })
  }

  /**
   * Parses and sets cell value with error handling
   * @param cell - Excel cell to set value
   * @param text - Text content to parse
   * @returns Parsed cell value information
   */
  const parseAndSetCellValue = (cell: ExcelJS.Cell, text: string): ParsedCellValue => {
    try {
      const parsedValue: ParsedCellValue = parseCellValue(text)
      cell.value = parsedValue.value
      return parsedValue
    } catch {
      // Fallback to original text when parsing fails
      cell.value = text
      return { value: text, isNumeric: false }
    }
  }

  /**
   * Creates format options for cell based on parsed value and styling requirements
   * @param parsedValue - Parsed cell value information
   * @param columnIndex - Column index for alignment
   * @param columnAlignments - Optional column alignment configuration
   * @param isFooter - Whether this is a footer cell (affects styling)
   * @returns Cell format options
   */
  const createFormatOptions = (
    parsedValue: ParsedCellValue,
    columnIndex: number,
    columnAlignments?: ColumnAlignments,
    isFooter = false,
  ): ICellFormatOptions => {
    const alignment = columnAlignments?.[columnIndex] ?? EXCEL_ALIGNMENT.HORIZONTAL.CENTER

    const formatOptions: ICellFormatOptions = {
      alignment,
      verticalAlignment: EXCEL_ALIGNMENT.VERTICAL.MIDDLE,
      border: true,
      wrapText: true,
      numberFormat: parsedValue.isNumeric ? EXCEL_STYLES.NUMBER_FORMAT : undefined,
    }

    // Add footer-specific styling
    if (isFooter) {
      formatOptions.bold = EXCEL_FONT.BOLD
      formatOptions.fillColor = EXCEL_STYLES.HEADER_FILL_COLOR
    }

    return formatOptions
  }

  /**
   * Common function to format cell with value and alignment
   * @param params - Cell formatting parameters
   *
   * Example:
   *   formatCellWithValue({ cell, text: '1,234.56', columnIndex: 3, columnAlignments: { 3: 'right' }, isFooter: false })
   */
  const formatCellWithValue = (params: ICellFormattingParams): void => {
    const { cell, text, columnIndex, columnAlignments, isFooter = false } = params
    const parsedValue = parseAndSetCellValue(cell, text)
    const formatOptions = createFormatOptions(parsedValue, columnIndex, columnAlignments, isFooter)
    formatCell(cell, formatOptions)
  }

  /**
   * Formats a data cell with appropriate data type formatting
   * @param cell - Excel cell to format
   * @param text - Text content for the cell
   * @param columnIndex - Column index for alignment
   * @param columnAlignments - Optional column alignment configuration
   *
   * Example:
   *   formatDataCell(cell, '1,234.56', 3, { 3: 'right' })
   */
  const formatDataCell = (
    cell: ExcelJS.Cell,
    text: string,
    columnIndex: number,
    columnAlignments?: ColumnAlignments,
  ): void => {
    formatCellWithValue({ cell, text, columnIndex, columnAlignments, isFooter: false })
  }

  /**
   * Formats a footer cell with standard footer styling
   * @param cell - Excel cell to format
   * @param text - Text content for the cell
   * @param columnIndex - Column index for alignment
   * @param columnAlignments - Optional column alignment configuration
   *
   * Example:
   *   formatFooterCell(cell, 'Total: 1,000', 4, { 4: 'right' })
   */
  const formatFooterCell = (
    cell: ExcelJS.Cell,
    text: string,
    columnIndex: number,
    columnAlignments?: ColumnAlignments,
  ): void => {
    formatCellWithValue({ cell, text, columnIndex, columnAlignments, isFooter: true })
  }

  /**
   * Creates a rich text value from HTML string
   * @param htmlString - HTML string with formatting tags
   * @returns Excel rich text value or plain string
   *
   * Example:
   *   const richText = createRichTextValue('Total: <b>1,000</b> items')
   *   // Returns: { richText: [...] } or plain string
   */
  const createRichTextValue = (htmlString: string): ExcelJS.CellRichTextValue | string => {
    try {
      const result: HtmlToExcelResult = parseHtmlToRichText(htmlString)

      if (result.isRichText && result.richText) {
        return { richText: result.richText }
      }

      return result.plainText ?? htmlString
    } catch {
      // Fallback to original string when parsing fails
      return htmlString
    }
  }

  return {
    formatCell,
    formatHeaderCell,
    formatDataCell,
    formatFooterCell,
    createRichTextValue,
  }
}
