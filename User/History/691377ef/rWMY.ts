/**
 * Excel workbook management composable
 * Handles workbook and worksheet creation, configuration
 *
 * Example usage:
 *   const { createWorkbook, createWorksheet } = useExcelWorkbook()
 *   const workbook = createWorkbook()
 *   const worksheet = createWorksheet(workbook, 'Report')
 */

import ExcelJS from 'exceljs'

import { EXCEL_DEFAULTS } from '../constants/excel/index'

/**
 * Excel workbook composable return type
 */
export interface IUseExcelWorkbookReturn {
  createWorkbook: () => ExcelJS.Workbook
  createWorksheet: (workbook: ExcelJS.Workbook, title: string) => ExcelJS.Worksheet
  configureWorksheet: (worksheet: ExcelJS.Worksheet) => void
}

/**
 * Composable for Excel workbook management
 * @returns Workbook management utilities
 */
export const useExcelWorkbook = (): IUseExcelWorkbookReturn => {
  /**
   * Creates a new Excel workbook
   * @returns New ExcelJS workbook instance
   *
   * Example:
   *   const workbook = createWorkbook()
   */
  const createWorkbook = (): ExcelJS.Workbook => {
    return new ExcelJS.Workbook()
  }

  /**
   * Creates a new worksheet in the workbook
   * @param workbook - ExcelJS workbook instance
   * @param title - Worksheet title/name
   * @returns New worksheet instance
   *
   * Example:
   *   const worksheet = createWorksheet(workbook, 'Sales Report')
   */
  const createWorksheet = (workbook: ExcelJS.Workbook, title: string): ExcelJS.Worksheet => {
    const worksheet = workbook.addWorksheet(title)
    configureWorksheet(worksheet)
    return worksheet
  }

  /**
   * Configures worksheet with default settings
   * @param worksheet - Worksheet to configure
   *
   * Example:
   *   configureWorksheet(worksheet)
   */
  const configureWorksheet = (worksheet: ExcelJS.Worksheet): void => {
    worksheet.properties.defaultColWidth = EXCEL_DEFAULTS.COLUMN_WIDTH
  }

  return {
    createWorkbook,
    createWorksheet,
    configureWorksheet,
  }
}
