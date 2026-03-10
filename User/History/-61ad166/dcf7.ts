import { jsPDF } from 'jspdf'

import 'jspdf-autotable'
import type { PrintPreviewOptions } from '../../types/print-preview.types'
import { addPdfHeader, addPdfFooter, addPdfSummary } from '../utils/pdf-utils'

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
  data: any[],
  config: PdfGeneratorConfig,
): Promise<string> => {
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

  const columnStyles: any = {}
  config.tableColumns.forEach((col, index) => {
    columnStyles[index] = {
      cellWidth: col.width || defaultWidth,
      halign: col.align || 'left',
    }
  })

  // Add table
  ;(doc as any).autoTable({
    head: [config.tableColumns.map((col) => col.header)],
    body: data.map((row) => config.tableColumns.map((col) => row[col.dataKey])),
    startY: 40,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles,
    didDrawPage: (pageData: any) => {
      addPdfFooter(doc, pageData.pageNumber)
    },
  })

  // Add summary if provided
  if (config.summaryData) {
    addPdfSummary(doc, config.summaryData)
  }

  const pdfBlob = doc.output('blob')
  return URL.createObjectURL(pdfBlob)
}
