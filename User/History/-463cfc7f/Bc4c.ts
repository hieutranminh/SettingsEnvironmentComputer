import type { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'

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
  [key: string]: unknown
}

export interface PrintPreviewOptions {
  type: keyof typeof PRINT_PREVIEW_WORKER_ACTIONS
  data?: unknown[]
  config: PrintPreviewConfig
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
