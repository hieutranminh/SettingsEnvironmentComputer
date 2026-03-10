import type ExcelJS from 'exceljs'

import type { PRINT_TYPE } from '@/constants'

export interface TableStyles {
  headStyles?: Record<string, unknown>
  footStyles?: Record<string, unknown>
  bodyStyles?: Record<string, unknown>
  columnStyles?: Record<string, Record<string, unknown>>
  styles?: Record<string, unknown>
  didParseCell?: (data: { column: { index: number }; section: string; cell: { styles: { halign?: string } } }) => void
}

export interface PrintSection {
  refType: (typeof PRINT_TYPE)[keyof typeof PRINT_TYPE]
  sectionRef?: HTMLElement | null
  sectionTexts?: string[]
  tableStyles?: TableStyles
  title?: string
  titleAlignment?: 'left' | 'center' | 'right'
  excelColumnAlignments?: { [columnIndex: number]: 'left' | 'center' | 'right' }
}

export interface PrintPreviewState {
  isVisible: boolean
  sections: PrintSection[]
  pdfBlobUrl: string | null
  isLoading: boolean
  error: string | null
  config: PdfConfig | null
}

export interface PdfConfig {
  format?: 'a3' | 'a4' | 'a5' | 'letter' | 'legal'
  unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc'
  orientation?: 'portrait' | 'landscape'
  title?: string
  subtitle?: string
  dateRange?: string
  printDate?: string
  totalItems?: string
  skipExcelDownload?: boolean
}

export interface CellTracker {
  occupiedCells: Map<string, boolean>
  isCellOccupied: (row: number, col: number) => boolean
  markCellsOccupied: (startRow: number, startCol: number, rowspan: number, colspan: number) => void
}

export interface ProcessingContext {
  worksheet: ExcelJS.Worksheet
  cellTracker: CellTracker
  columnAlignments?: { [columnIndex: number]: 'left' | 'center' | 'right' }
}
