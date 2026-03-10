import * as XLSX from 'xlsx'

import type { PrintPreviewOptions } from '@/types/print-preview.types'

import { createExcelHeader, styleExcelHeader } from '../utils/excel-utils'

export interface ExcelGeneratorConfig {
  columns: Array<{ header: string; dataKey: string; width?: number }>
  mainSheetName?: string
}

export const generateReportExcel = async (
  options: PrintPreviewOptions,
  data: unknown[],
  config: ExcelGeneratorConfig,
): Promise<Blob> => {
  const wb = XLSX.utils.book_new()

  // Main sheet data
  const headerRows = createExcelHeader(options)
  const tableHeaders = config.columns.map((col) => col.header)
  const tableData = data.map((row) => config.columns.map((col) => row[col.dataKey]))

  const mainData = [...headerRows, tableHeaders, ...tableData]

  const ws = XLSX.utils.aoa_to_sheet(mainData)

  // Style header row
  styleExcelHeader(ws, headerRows.length, config.columns.length)

  // Set column widths
  ws['!cols'] = config.columns.map((col) => ({
    wch: col.width || 15,
  }))

  // Add main sheet
  XLSX.utils.book_append_sheet(wb, ws, config.mainSheetName || 'Chi tiết')

  // Generate file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
