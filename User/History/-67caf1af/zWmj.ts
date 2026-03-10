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
 * Canvas processing parameters
 */
export interface ICanvasProcessingParams {
  worksheet: ExcelJS.Worksheet
  workbook: ExcelJS.Workbook
  canvasElement: HTMLElement
  startRow: number
  maxColumns: number
  title?: string
}

/**
 * Image addition parameters
 */
export interface IImageAdditionParams {
  worksheet: ExcelJS.Worksheet
  workbook: ExcelJS.Workbook
  canvas: HTMLCanvasElement
  startRow: number
  maxColumns: number
}

/**
 * Excel canvas composable return type
 */
export interface IUseExcelCanvasReturn {
  processCanvas: (params: ICanvasProcessingParams) => Promise<number>
  convertElementToCanvas: (element: HTMLElement) => Promise<HTMLCanvasElement>
  addImageToWorksheet: (params: IImageAdditionParams) => number
}

/**
 * Composable for Excel canvas processing
 * @returns Canvas processing utilities
 */
export const useExcelCanvas = (): IUseExcelCanvasReturn => {
  const { formatCell } = useExcelCellFormatter()

  /**
   * Processes an HTML canvas/element and adds it to Excel worksheet
   * @param params - Canvas processing parameters
   * @returns Row number after image insertion
   *
   * Example:
   *   const endRow = await processCanvas({ worksheet, workbook, canvasElement: chartElement, startRow: 5, maxColumns: 8, title: 'Sales Chart' })
   */
  const processCanvas = async (params: ICanvasProcessingParams): Promise<number> => {
    const { worksheet, workbook, canvasElement, startRow, maxColumns, title } = params
    
    try {
      // Convert element to canvas
      const canvas = await convertElementToCanvas(canvasElement)

      // Add image to worksheet
      return addImageToWorksheet({ worksheet, workbook, canvas, startRow, maxColumns })
    } catch {
      // Log error for debugging (using proper logging instead of console)
      // In production, this should use a proper logging service
      // const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      // console.error('Canvas processing failed:', errorMessage, { title, startRow })

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
   * @param params - Image addition parameters
   * @returns Row number after image placement
   *
   * Example:
   *   const endRow = addImageToWorksheet({ worksheet, workbook, canvas, startRow: 5, maxColumns: 8 })
   */
  const addImageToWorksheet = (params: IImageAdditionParams): number => {
    const { worksheet, workbook, canvas, startRow, maxColumns } = params
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
