import type { PrintType } from '@/constants'

export interface ITableStyles {
  headStyles?: Record<string, unknown>
  footStyles?: Record<string, unknown>
  bodyStyles?: Record<string, unknown>
  columnStyles?: Record<string, Record<string, unknown>>
  styles?: Record<string, unknown>
  didParseCell?: (data: {
    column: { index: number }
    section: string
    cell: { styles: { halign?: string } }
  }) => void
}

export interface IPrintSection {
  refType: PrintType
  sectionRef?: HTMLElement | null
  // The purpose of sectionRefExcel is to handle special cases
  // where the print preview differs from the tables used for Excel downloads.
  // Example : BranchSales, BranchPrepaidGoods
  sectionRefExcel?: HTMLElement | null
  sectionTexts?: string[]
  tableStyles?: ITableStyles
  title?: string
  titleAlignment?: 'left' | 'center' | 'right'
  excelColumnAlignments?: { [columnIndex: number]: 'left' | 'center' | 'right' }
}

export interface IPrintPreviewState {
  isVisible: boolean
  sections: IPrintSection[]
  pdfBlobUrl: string | null
  isLoading: boolean
  error: string | string[] | null
  config: IPdfConfig | null
  customExcelHandler: (() => Promise<void>) | null
}

export interface IPdfConfig {
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

export interface IPdfProcessingContext {
  currentY: number
  headerEndPosition: number
  pagesWithHeaders: Set<number>
  config: Required<IPdfConfig>
}
