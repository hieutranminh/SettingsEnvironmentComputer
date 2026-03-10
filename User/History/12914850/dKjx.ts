export interface PrintPreviewState {
  pdfBlobUrl: string
  excelBlob: Blob | null
  isWorkerDone: boolean
  isWorkerError: boolean
  isWorkerProcessing: boolean
  progressPercentage: number
  printPreviewWorker: Worker | null
  reportPrintDate: Date | null
  isLandscapePrintContent: boolean
  printDataOption: PrintDataOption | null
}

export interface PrintDataOption {
  workerType: WorkerType
  tableHeaders: TableHeader[]
  reportHeaders: ReportHeader[]
  additionalOptions: Record<string, any>
  requestPayload: Record<string, any>
}

export interface TableHeader {
  key: string
  label: string
  width?: number
  align?: 'left' | 'center' | 'right'
  format?: 'text' | 'number' | 'date' | 'currency' | 'percentage'
}

export interface ReportHeader {
  title: string
  subtitle?: string
  logo?: string
  date?: string
}

export type WorkerType =
  | 'prepaid-card-summary'
  | 'prepaid-cards-by-client'
  | 'products'
  | 'prepaid-services-by-client'
  | 'loyalty-points-by-client'
  | 'receivings'
  | 'time-clock'
  | 'stock-status'
  | 'stock-history'
  | 'stock-adjustment'
  | 'stock-internal-use'
  | 'calendar-booking-list-summary'
  | 'calendar-booking-list-v2-summary'
  | 'prepaid-goods-sales'
  | 'sales-history'
  | 'booking-deposit-list'
  | 'booking-deposit-before-payment'
  | 'booking-deposit-payment-history'
  | 'staff-mismatch-history'
  | 'sales-transfer-staff-history'
  | 'sales-transfer-history'

export interface WorkerMessage {
  workerType: WorkerType
  tableHeaders: TableHeader[]
  reportHeaders: ReportHeader[]
  requestPayload: Record<string, any>
  additionalOptions: Record<string, any>
  locale: string
  printDate: string
  requestHeaders: Record<string, string>
  isLandscapePrintContent: boolean
}

export interface WorkerResponse {
  isDone: boolean
  errors: string[]
  isError: boolean
  excelBlob: Blob | null
  pdfBlobUrl: string | null
  progressPercentage: number
  status: number
}

export interface PrintPreviewConfig {
  a4PageWidthPortrait: number
  standardDateFormat: string
  standardHourFormat: string
  maxRetries: number
  retryDelay: number
}

export interface ProgressInfo {
  totalItems: number
  totalProgressedItems: number
  percentage: number
}

export interface TableRowItem {
  [key: string]: any
}

export interface TableIntro {
  title?: string
  subtitle?: string
  description?: string
  metadata?: Record<string, any>
}

export interface CellStyle {
  backgroundColor?: string
  color?: string
  fontWeight?: string
  fontSize?: number
  alignment?: 'left' | 'center' | 'right'
  border?: {
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
  }
}

export interface ColumnStyle {
  columnKey: string
  styles: CellStyle
}

export interface CustomCellStyle {
  rowIndex: number
  columnKey: string
  styles: CellStyle
}

export interface ReportGenerationOptions {
  hasRowspan?: boolean
  mergeRowspan?: boolean
  customCellStyles?: CustomCellStyle[]
  customColumnStyles?: ColumnStyle[]
  formatLargerNumberCols?: string[]
  isDifferenceExcelPdfColumn?: boolean
  getRowHeight?: () => number | null
  getTableIntro?: () => TableIntro
  getTableRowItem?: (rowItem: any) => TableRowItem
  isValidResponseChecker?: (response: any) => boolean
  isInvalidResponseChecker?: (response: any) => boolean
}
