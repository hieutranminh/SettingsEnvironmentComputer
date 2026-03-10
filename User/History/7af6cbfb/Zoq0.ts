import * as XLSX from 'xlsx'

import type { PrintPreviewOptions } from '@/types/print-preview.types'

export const createExcelHeader = (options: PrintPreviewOptions): any[][] => {
  return [
    [options.reportName || 'BÁO CÁO'],
    [`Từ ngày: ${options.dateFrom || ''} - Đến ngày: ${options.dateTo || ''}`],
    [], // Empty row
  ]
}

export const styleExcelHeader = (ws: XLSX.WorkSheet, headerRowIndex: number, columnCount: number): void => {
  for (let col = 0; col < columnCount; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col })
    if (!ws[cellRef]) ws[cellRef] = { v: '' }
    ws[cellRef].s = {
      fill: { fgColor: { rgb: 'CCE5FF' } },
      font: { bold: true },
      alignment: { horizontal: 'center' },
    }
  }
}
