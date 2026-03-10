export interface PrintData {
  title: string
  printType: 'table' | 'chart' | 'mixed' | 'content'
  printData?: any[]
  content?: any
  sectionRef?: any
  enablePagination?: boolean
  rowsPerPage?: number
  printSections?: PrintSection[]
  columns?: TableColumn[]
}

export interface PrintSection {
  type: 'chart' | 'table' | 'content'
  title?: string
  element?: any
  data?: any[]
  columns?: TableColumn[]
  content?: any
}

export interface TableColumn {
  field: string
  header: string
  width?: number
  align?: 'left' | 'center' | 'right'
  colspan?: number
  rowspan?: number
}

export interface PrintConfiguration {
  pageSize: 'A4' | 'A3' | 'Letter' | 'Legal'
  orientation: 'landscape' | 'portrait'
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export interface PrintState {
  isVisible: boolean
  isProcessing: boolean
  currentPage: number
  totalPages: number
  printData: PrintData | null
  configuration: PrintConfiguration
}

export interface PrintActions {
  openPrintPreview: (data: PrintData) => void
  closePrintPreview: () => void
  print: () => Promise<void>
  downloadPDF: () => Promise<void>
  downloadExcel: () => Promise<void>
  downloadCSV: () => Promise<void>
  setPage: (page: number) => void
  setConfiguration: (config: Partial<PrintConfiguration>) => void
}
