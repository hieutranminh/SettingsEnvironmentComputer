import type { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'

// types/print-preview.types.ts
export interface PrintPreviewOptions {
  workerType: keyof typeof PRINT_PREVIEW_WORKER_ACTIONS
  headerTitle: string
  headerSubtitle: string
  headerDate: string[]
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
