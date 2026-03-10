import type { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'

// Header customization interface
export interface PrintHeaderConfig {
  title: string
  subtitle?: string
  dateRange?: {
    from: string
    to: string
  }
  customFields?: Array<{
    label: string
    value: string
    position: 'left' | 'center' | 'right'
  }>
  showCurrentDate?: boolean
  showPageNumber?: boolean
}

// Page dimensions and styling (all in pt units)
export interface PrintPageConfig {
  orientation: 'portrait' | 'landscape'
  paperSize: 'A4' | 'A3'
  margins: {
    top: number // pt
    bottom: number // pt
    left: number // pt
    right: number // pt
  }
  font: {
    family: string
    size: number // pt
    color: string
  }
  spacing: {
    section: number // pt
    line: number // pt
  }
}

// Main configuration interface
export interface PrintPreviewConfig {
  header: PrintHeaderConfig
  page: PrintPageConfig
  exportType: 'pdf' | 'excel' | 'both'
  customData?: Record<string, unknown>
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
  cellWidth?: number // pt
}

export interface PrintPreviewState {
  isLoading: boolean
  isProcessing: boolean
  progress: number
  pdfBlobUrl: string | null
  excelBlob: Blob | null
  error: Error | null
}
