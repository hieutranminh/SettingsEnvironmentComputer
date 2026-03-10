/**
 * Excel canvas processing composable
 * Handles HTML canvas/element conversion to Excel images
 *
 * Example usage:
 *   const { processCanvas } = useExcelCanvas()
 *   const endRow = await processCanvas(worksheet, workbook, canvasElement, startRow, maxColumns)
 */

import type ExcelJS from 'exceljs'
import html2canvas from 'html2canvas'

import { EXCEL_IMAGE, EXCEL_CANVAS_CONFIG, EXCEL_DEFAULTS } from '../constants/excel/index'
import { calculateImageDimensions } from '../utils/excelUtils'

import { useExcelCellFormatter } from './useExcelCellFormatter'

/**
 * Excel canvas composable return type
 */
export interface IUseExcelCanvasReturn {
  processCanvas: (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    canvasElement: HTMLElement,
    startRow: number,
    maxColumns: number,
    title?: string,
  ) => Promise<number>
  convertElementToCanvas: (element: HTMLElement) => Promise<HTMLCanvasElement>
  addImageToWorksheet: (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    canvas: HTMLCanvasElement,
    startRow: number,
    maxColumns: number,
  ) => number
}

/**
 * Composable for Excel canvas processing
 * @returns Canvas processing utilities
 */
export const useExcelCanvas = (): IUseExcelCanvasReturn => {
  const { formatCell } = useExcelCellFormatter()

  /**
   * Processes an HTML canvas/element and adds it to Excel worksheet
   * @param worksheet - Excel worksheet to add image to
   * @param workbook - Excel workbook for image management
   * @param canvasElement - HTML element to convert to image
   * @param startRow - Starting row in worksheet
   * @param maxColumns - Maximum columns for sizing calculations
   * @param title - Optional title for error fallback
   * @returns Row number after image insertion
   *
   * Example:
   *   const endRow = await processCanvas(worksheet, workbook, chartElement, 5, 8, 'Sales Chart')
   */
  const processCanvas = async (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    canvasElement: HTMLElement,
    startRow: number,
    maxColumns: number,
    title?: string,
  ): Promise<number> => {
    try {
      // Convert element to canvas
      const canvas = await convertElementToCanvas(canvasElement)

      // Add image to worksheet
      return addImageToWorksheet(worksheet, workbook, canvas, startRow, maxColumns)
    } catch (error) {
      // Log error for debugging
      console.error('Canvas processing failed:', error, { title, startRow })

      // Fallback: add a text placeholder
      const errorCell = worksheet.getCell(startRow, 1)
      const placeholderText = `[Canvas Image - ${title ?? 'Untitled'}]`
      errorCell.value = placeholderText

      formatCell(errorCell, {
        italic: true,
      })

      return startRow + 1
    }
  }

  /**
   * Converts HTML element to canvas using html2canvas
   * @param element - HTML element to convert
   * @returns Canvas element with rendered content
   *
   * Example:
   *   const canvas = await convertElementToCanvas(chartElement)
   */
  const convertElementToCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return html2canvas(element, {
      scale: EXCEL_CANVAS_CONFIG.SCALE,
      useCORS: EXCEL_CANVAS_CONFIG.USE_CORS,
      allowTaint: EXCEL_CANVAS_CONFIG.ALLOW_TAINT,
      logging: EXCEL_CANVAS_CONFIG.LOGGING,
      backgroundColor: EXCEL_CANVAS_CONFIG.BACKGROUND_COLOR,
    })
  }

  /**
   * Adds canvas image to Excel worksheet
   * @param worksheet - Excel worksheet to add image to
   * @param workbook - Excel workbook for image management
   * @param canvas - Canvas element with image data
   * @param startRow - Starting row for image placement
   * @param maxColumns - Maximum columns for sizing
   * @returns Row number after image placement
   *
   * Example:
   *   const endRow = addImageToWorksheet(worksheet, workbook, canvas, 5, 8)
   */
  const addImageToWorksheet = (
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    canvas: HTMLCanvasElement,
    startRow: number,
    maxColumns: number,
  ): number => {
    // Convert canvas to base64
    const imageBase64 = canvas.toDataURL('image/png')

    // Add image to workbook
    const imageId = workbook.addImage({
      base64: imageBase64,
      extension: 'png',
    })

    // Calculate optimal dimensions
    const dimensions = calculateImageDimensions(
      canvas.width,
      canvas.height,
      maxColumns,
      worksheet.properties?.defaultColWidth ?? EXCEL_DEFAULTS.COLUMN_WIDTH,
      EXCEL_IMAGE.MAX_HEIGHT,
    )

    // Add image to worksheet
    worksheet.addImage(imageId, {
      tl: { col: 0, row: startRow - 1 }, // Top-left position (0-based)
      ext: {
        width: dimensions.width,
        height: dimensions.height,
      },
    })

    return startRow + dimensions.rowsNeeded
  }

  return {
    processCanvas,
    convertElementToCanvas,
    addImageToWorksheet,
  }
}
