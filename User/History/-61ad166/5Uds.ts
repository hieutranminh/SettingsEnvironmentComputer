import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import type { PrintPreviewOptions } from '@/types/print-preview.types'

import { addPdfHeader, addPdfFooter } from '../utils/pdf-utils'

// Import font files - these are self-executing scripts that register fonts
import '../fonts/NanumGothic-Regular-normal.js'
import '../fonts/NanumGothic-ExtraBold-bold.js'

export interface TableColumn {
  header: string
  dataKey: string
  width?: number
  align?: 'left' | 'center' | 'right'
}

export interface PdfGeneratorConfig {
  orientation?: 'portrait' | 'landscape'
  tableColumns: TableColumn[]
}

export const generateReportPdf = async (
  options: PrintPreviewOptions,
  data: unknown[],
  config: PdfGeneratorConfig,
): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: options.config.page.orientation,
    unit: 'pt',
    format: options.config.page.paperSize.toLowerCase(),
  })

  // Fonts are automatically loaded by the imported font files
  // No need to manually addFont as they're self-registering

  // Add header and get the Y position where content should start
  const headerEndY = addPdfHeader(doc, options)

  // Calculate available width for table (page width minus margins)
  const pageWidth = doc.internal.pageSize.width
  const availableWidth = pageWidth - options.config.page.margins.left - options.config.page.margins.right

  // Calculate column widths in pt
  const defaultWidth = availableWidth / config.tableColumns.length

  const columnStyles: Record<string, { cellWidth: number; halign: 'left' | 'center' | 'right' }> = {}
  config.tableColumns.forEach((col, index) => {
    columnStyles[index.toString()] = {
      cellWidth: col.width ? col.width * 2.83465 : defaultWidth, // Convert mm to pt if width is provided in mm
      halign: col.align || 'left',
    }
  })

  // Add table
  autoTable(doc, {
    head: [config.tableColumns.map((col) => col.header)],
    body: (data as Record<string, unknown>[]).map((row) =>
      config.tableColumns.map((col) => String(row[col.dataKey] || '')),
    ),
    startY: headerEndY + 20, // Add some spacing after header
    theme: 'grid',
    columnStyles,
    didDrawPage: (pageData: { pageNumber: number }) => {
      addPdfFooter(doc, pageData.pageNumber, options.config.header.showPageNumber)
    },
  })

  return doc.output('blob')
}
