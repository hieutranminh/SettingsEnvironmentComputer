// types/print-preview.types.ts
export interface PrintPreviewOptions {
  reportName: string
  reportHeaders: string[]
  tableHeaders: TableHeader[]
  isLandscape?: boolean
  customStyles?: CustomCellStyle[]
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

export enum PrintPreviewWorkerAction {
  SALES_HISTORY = 'SALES_HISTORY',
  BOOKING_LIST = 'BOOKING_LIST',
}
