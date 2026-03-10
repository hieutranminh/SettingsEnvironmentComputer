export const PRINT_PREVIEW_CONFIG = {
  A4_PAGE_WIDTH_PORTRAIT: 794, // A4 width in pixels at 96 DPI
  STANDARD_DATE_FORMAT: 'YYYY-MM-DD',
  STANDARD_HOUR_FORMAT: 'HH:mm:ss',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
  PROGRESS_UPDATE_INTERVAL: 100, // milliseconds
  WORKER_TIMEOUT: 300000, // 5 minutes in milliseconds
} as const

export const WORKER_TYPES = {
  PREPAID_CARD_SUMMARY: 'prepaid-card-summary',
  PREPAID_CARDS_BY_CLIENT: 'prepaid-cards-by-client',
  PRODUCTS: 'products',
  PREPAID_SERVICES_BY_CLIENT: 'prepaid-services-by-client',
  LOYALTY_POINTS_BY_CLIENT: 'loyalty-points-by-client',
  RECEIVINGS: 'receivings',
  TIME_CLOCK: 'time-clock',
  STOCK_STATUS: 'stock-status',
  STOCK_HISTORY: 'stock-history',
  STOCK_ADJUSTMENT: 'stock-adjustment',
  STOCK_INTERNAL_USE: 'stock-internal-use',
  CALENDAR_BOOKING_LIST_SUMMARY: 'calendar-booking-list-summary',
  CALENDAR_BOOKING_LIST_V2_SUMMARY: 'calendar-booking-list-v2-summary',
  PREPAID_GOODS_SALES: 'prepaid-goods-sales',
  SALES_HISTORY: 'sales-history',
  BOOKING_DEPOSIT_LIST: 'booking-deposit-list',
  BOOKING_DEPOSIT_BEFORE_PAYMENT: 'booking-deposit-before-payment',
  BOOKING_DEPOSIT_PAYMENT_HISTORY: 'booking-deposit-payment-history',
  STAFF_MISMATCH_HISTORY: 'staff-mismatch-history',
  SALES_TRANSFER_STAFF_HISTORY: 'sales-transfer-staff-history',
  SALES_TRANSFER_HISTORY: 'sales-transfer-history',
} as const

export const ERROR_MESSAGES = {
  WORKER_NOT_SUPPORTED: 'Web Workers are not supported in this browser',
  WORKER_INIT_FAILED: 'Failed to initialize print preview worker',
  WORKER_TERMINATED: 'Print preview worker was terminated',
  WORKER_TIMEOUT: 'Print preview worker timed out',
  WORKER_ERROR: 'An error occurred in the print preview worker',
  INVALID_WORKER_TYPE: 'Invalid worker type specified',
  NO_DATA_TO_PRINT: 'No data available to print',
  PDF_GENERATION_FAILED: 'Failed to generate PDF',
  EXCEL_GENERATION_FAILED: 'Failed to generate Excel file',
  NETWORK_ERROR: 'Network error occurred while fetching data',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'Access forbidden',
  SERVER_ERROR: 'Server error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const

export const SUCCESS_MESSAGES = {
  PDF_GENERATED: 'PDF generated successfully',
  EXCEL_GENERATED: 'Excel file generated successfully',
  PRINT_PREVIEW_READY: 'Print preview is ready',
  FILES_SAVED: 'Files saved successfully',
} as const

export const PROGRESS_MESSAGES = {
  INITIALIZING: 'Initializing print preview...',
  FETCHING_DATA: 'Fetching data...',
  GENERATING_PDF: 'Generating PDF...',
  GENERATING_EXCEL: 'Generating Excel file...',
  FINALIZING: 'Finalizing...',
  COMPLETED: 'Completed',
} as const

export const FILE_EXTENSIONS = {
  PDF: '.pdf',
  EXCEL: '.xlsx',
} as const

export const MIME_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

export const WORKER_EVENTS = {
  MESSAGE: 'message',
  ERROR: 'error',
  MESSAGEERROR: 'messageerror',
} as const

export const WORKER_MESSAGE_TYPES = {
  TASK: 'task',
  PROGRESS: 'progress',
  ERROR: 'error',
  COMPLETE: 'complete',
  TERMINATE: 'terminate',
} as const

export const TABLE_FORMATS = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
} as const

export const ALIGNMENT_OPTIONS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const

export const ORIENTATION_OPTIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const

export const DEFAULT_TABLE_STYLES = {
  HEADER: {
    backgroundColor: '#f8f9fa',
    color: '#212529',
    fontWeight: 'bold',
    fontSize: 12,
    alignment: 'center' as const,
  },
  ROW: {
    backgroundColor: '#ffffff',
    color: '#212529',
    fontWeight: 'normal',
    fontSize: 11,
    alignment: 'left' as const,
  },
  BORDER: {
    color: '#dee2e6',
    width: 1,
  },
} as const
