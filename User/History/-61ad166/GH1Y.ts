import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import type { PrintPreviewOptions } from '@/types/print-preview.types'

import { addPdfHeader, addPdfFooter, addPdfSummary } from '../utils/pdf-utils'
import { addFontsToDocument } from '../utils/font-utils'

export interface TableColumn {
  header: string
  dataKey: string
  width?: number
  align?: 'left' | 'center' | 'right'
}

export interface PdfGeneratorConfig {
  orientation?: 'portrait' | 'landscape'
  tableColumns: TableColumn[]
  summaryData?: Array<{ label: string; value: string | number }>
}

export const generateReportPdf = async (
  options: PrintPreviewOptions,
  data: unknown[],
  config: PdfGeneratorConfig,
): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: config.orientation || 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  // Add header
  addPdfHeader(doc, options)

  // Calculate column widths
  const totalWidth = config.orientation === 'portrait' ? 170 : 250
  const defaultWidth = totalWidth / config.tableColumns.length

  const columnStyles: Record<string, { cellWidth: number; halign: 'left' | 'center' | 'right' }> = {}
  config.tableColumns.forEach((col, index) => {
    columnStyles[index.toString()] = {
      cellWidth: col.width || defaultWidth,
      halign: col.align || 'left',
    }
  })
  // Add table
  autoTable(doc, {
    head: [config.tableColumns.map((col) => col.header)],
    body: (data as Record<string, unknown>[]).map((row) =>
      config.tableColumns.map((col) => String(row[col.dataKey] || '')),
    ),
    startY: 100,
    theme: 'grid',
    columnStyles,
    didDrawPage: (pageData: { pageNumber: number }) => {
      addPdfFooter(doc, pageData.pageNumber)
    },
  })

  // Add summary if provided
  if (config.summaryData) {
    addPdfSummary(doc, config.summaryData)
  }

  return doc.output('blob')
}
