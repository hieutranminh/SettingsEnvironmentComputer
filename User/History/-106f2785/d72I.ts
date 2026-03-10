// Components
export { default as PrintPreview } from './components/PrintPreview.vue'
export { default as PrintPreviewModal } from './components/PrintPreviewModal.vue'
export { default as PrintPreviewButton } from './components/PrintPreviewButton.vue'

// Composables
export { usePrintPreview } from './composables/usePrintPreview'

// Store
export { usePrintPreviewStore } from './stores/print-preview.store'

// Types
export type {
  PrintPreviewState,
  PrintDataOption,
  WorkerType,
  TableHeader,
  ReportHeader,
  WorkerMessage,
  WorkerResponse,
  PrintPreviewConfig,
  ProgressInfo,
  TableRowItem,
  TableIntro,
  CellStyle,
  ColumnStyle,
  CustomCellStyle,
  ReportGenerationOptions,
} from './types/print-preview.types'

export type {
  BaseHandlerConfig,
  HandlerContext,
  StreamResponse,
  ApiResponse,
  WorkerHandler,
  ProgressCallback,
  ErrorCallback,
  WorkerEventHandlers,
  WorkerTask,
  WorkerPool,
  WorkerMessageData,
  TaskMessage,
  ProgressMessage,
  ErrorMessage,
  CompleteMessage,
  TerminateMessage,
  WorkerMessage as WorkerMessageType,
} from './types/worker.types'

// Constants
export {
  PRINT_PREVIEW_CONFIG,
  WORKER_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PROGRESS_MESSAGES,
  FILE_EXTENSIONS,
  MIME_TYPES,
  HTTP_STATUS_CODES,
  WORKER_EVENTS,
  WORKER_MESSAGE_TYPES,
  TABLE_FORMATS,
  ALIGNMENT_OPTIONS,
  ORIENTATION_OPTIONS,
  DEFAULT_TABLE_STYLES,
} from './constants/print-preview.constants'

// Utils
export {
  formatDate,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatCellValue,
  getCellAlignment,
  getColumnWidth,
  generateFileName,
  calculateProgressPercentage,
  validateTableHeaders,
  validateTableData,
  applyCellStyles,
  getDefaultCellStyle,
  sanitizeHtml,
  truncateText,
  escapeHtml,
  unescapeHtml,
  formatFileSize,
  debounce,
  throttle,
} from './utils/format-helpers'

// Worker handlers
export { BaseHandler } from './workers/worker-handlers/base-handler'
export { SalesHistoryHandler } from './workers/worker-handlers/sales-history.handler' 