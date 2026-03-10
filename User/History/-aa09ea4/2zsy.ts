/**
 * Excel text processing composable
 * Handles text sections in Excel worksheets
 *
 * Example usage:
 *   const { processText } = useExcelText()
 *   const endRow = processText(worksheet, textArray, startRow)
 */

import type ExcelJS from 'exceljs'

import { EXCEL_SPACING, EXCEL_ALIGNMENT } from '../constants/excel/index'

// Constants for text processing
const DEFAULT_TEXT_COLUMN = 1

import { useExcelCellFormatter } from './useExcelCellFormatter'

/**
 * Excel text composable return type
 */
export interface IUseExcelTextReturn {
  processText: (worksheet: ExcelJS.Worksheet, textElements: string[], startRow: number) => number
  addTextElement: (worksheet: ExcelJS.Worksheet, text: string, row: number, column: number) => void
}

/**
 * Composable for Excel text processing
 * @returns Text processing utilities
 */
export const useExcelText = (): IUseExcelTextReturn => {
  const { formatCell } = useExcelCellFormatter()

  /**
   * Processes an array of text elements and adds them to Excel worksheet
   * @param worksheet - Excel worksheet to add text to
   * @param textElements - Array of text strings to process
   * @param startRow - Starting row in worksheet
   * @returns Row number after text processing
   *
   * Example:
   *   const textArray = ['First paragraph', 'Second paragraph', 'Third paragraph']
   *   const endRow = processText(worksheet, textArray, 10)
   */
  const processText = (
    worksheet: ExcelJS.Worksheet,
    textElements: string[],
    startRow: number,
  ): number => {
    if (!textElements || textElements.length === 0) {
      return startRow
    }

    let currentRow = startRow

    // Process each text element
    textElements.forEach((text, index) => {
      addTextElement(worksheet, text, currentRow, DEFAULT_TEXT_COLUMN)

      // Add spacing between text elements (except for the last one)
      if (index < textElements.length - 1) {
        currentRow += EXCEL_SPACING.TEXT_ELEMENT_SPACING
      }

      currentRow++
    })

    return currentRow
  }

  /**
   * Adds a single text element to the worksheet
   * @param worksheet - Excel worksheet to add text to
   * @param text - Text content to add
   * @param row - Row number for text placement
   * @param column - Column number for text placement (defaults to DEFAULT_TEXT_COLUMN)
   *
   * Example:
   *   addTextElement(worksheet, 'This is a text element', 5, 1)
   */
  const addTextElement = (
    worksheet: ExcelJS.Worksheet,
    text: string,
    row: number,
    column: number = DEFAULT_TEXT_COLUMN,
  ): void => {
    const textCell = worksheet.getCell(row, column)
    textCell.value = text

    formatCell(textCell, {
      alignment: EXCEL_ALIGNMENT.HORIZONTAL.LEFT,
      verticalAlignment: EXCEL_ALIGNMENT.VERTICAL.MIDDLE,
      wrapText: true,
    })
  }

  return {
    processText,
    addTextElement,
  }
}
