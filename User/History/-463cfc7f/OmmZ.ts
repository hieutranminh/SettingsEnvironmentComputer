import type { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'

// Header customization interface
export interface HeaderConfig {
  title: string
  subtitle?: string
  dateRange?: string[]
  showCurrentDate?: boolean
  customStyles?: {
    titleFontSize?: number
    subtitleFontSize?: number
    dateFontSize?: number
    titleFontFamily?: string
    subtitleFontFamily?: string
    dateFontFamily?: string
  }
}

// Fake data configuration for development/testing
export interface FakeDataConfig {
  enabled: boolean
  recordCount?: number
  customData?: unknown[]
}

// types/print-preview.types.ts
export interface PrintPreviewConfig {
  title: string
  subtitle?: string
  date?: string[]
  orientation?: 'portrait' | 'landscape'
  exportType: 'pdf' | 'excel'
  paperSize?: 'A4' | 'A3'
  includeHeader?: boolean
  includeFooter?: boolean
  margins?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  fontSize?: number
  fontFamily?: string
  header?: HeaderConfig
  fakeData?: FakeDataConfig
  [key: string]: unknown
}

export interface PrintPreviewOptions {
  type: keyof typeof PRINT_PREVIEW_WORKER_ACTIONS
  data?: unknown[]
  config: PrintPreviewConfig
}

// Standardized data structure for branch sales
export interface BranchSalesData {
  branchName: string
  totalSales: number
  totalQuantity: number
  totalAmount: number
  totalDiscount: number
  totalTax: number
  totalNet: number
}

export interface TableHeader {
  header: string
  styles?: CellStyle
  hideInPdf?: boolean
  hideInExcel?: boolean
}

export interface CellStyle {
  halign?: 'left' | 'center' | 'right'
  valign?: 'top' | 'middle' | 'bottom'
  cellWidth?: number
}

export interface PrintPreviewState {
  isLoading: boolean
  isProcessing: boolean
  progress: number
  pdfBlobUrl: string | null
  excelBlob: Blob | null
  error: Error | null
}
