// ===============================
// COUNTRY & REGION CONSTANTS

import type { ICardLimitConfig } from '@/types/payment/payment'

// ===============================
export const COUNTRY_CODES = {
  KR: 'KR',
  VN: 'VN',
} as const

export const COUNTRY_LANGUAGE = {
  KR: 'ko',
  EN: 'en',
} as const
export const COUNTRY_CONFIG = {
  kr: COUNTRY_CODES.KR,
  vi: COUNTRY_CODES.VN,
} as const

export const STANDARD_DATE_FORMAT = {
  MY: 'MM-YYYY',
  DMY: 'DD-MM-YYYY',
  DMYH: 'DD-MM-YYYY HH:mm',
  YYYY: 'YYYY',
  YM: 'YYYY-MM',
  YMD: 'YYYY-MM-DD',
  YMDH: 'YYYY-MM-DD HH:mm',
  YMDHms: 'YYYY-MM-DD HH:mm:ss',
  MDY: 'MM-DD-YYYY',
  UTC: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MD: 'MM-DD',
  HM: 'HH:mm',
  HMS: 'HH:mm:ss',
}

export const FILE_NAME_FORMATS = {
  PRINT_PREVIEW: 'YYYY-MM-DD_HH_mm_ss',
}

export const LOCALE_FORMATS = {
  KO: 'ko-KR',
  EN: 'en-US',
} as const

// ===============================
// PRIMEVUE DATE FORMATS
// ===============================

export const PRIMEVUE_DATE_FORMATS = {
  // Day formats
  DAY_NO_ZERO: 'd', // day of month (no leading zero)
  DAY_TWO_DIGIT: 'dd', // day of month (two digit)
  DAY_OF_YEAR_NO_ZERO: 'o', // day of the year (no leading zeros)
  DAY_OF_YEAR_THREE_DIGIT: 'oo', // day of the year (three digit)
  DAY_NAME_SHORT: 'D', // day name short
  DAY_NAME_LONG: 'DD', // day name long

  // Month formats
  MONTH_NO_ZERO: 'm', // month of year (no leading zero)
  MONTH_TWO_DIGIT: 'mm', // month of year (two digit)
  MONTH_NAME_SHORT: 'M', // month name short
  MONTH_NAME_LONG: 'MM', // month name long

  // Year formats
  YEAR_TWO_DIGIT: 'y', // year (two digit)
  YEAR_FOUR_DIGIT: 'yy', // year (four digit)

  // Special formats
  UNIX_TIMESTAMP: '@', // Unix timestamp (ms since 01/01/1970)
  WINDOWS_TICKS: '!', // Windows ticks (100ns since 01/01/0001)

  // Common combinations
  DEFAULT: 'mm/dd/yy', // PrimeVue default format
  YMD: 'yy-mm-dd',
  YM: 'yy-mm',
} as const
// ===============================
// TIMEZONE CONSTANTS
// ===============================

export const TIME_ZONE_OFFSETS = {
  seoul: -540, // UTC+9 in minutes
  ho_chi_minh: -420, // UTC+7 in minutes
} as const

export const TIMEZONE_CONFIG = [
  {
    country_code: COUNTRY_CODES.KR,
    timezone: '+09:00',
    date_format: 'YYYY-MM-DD',
    culture: 'ko',
    offset_minutes: TIME_ZONE_OFFSETS.seoul,
  },
  {
    country_code: COUNTRY_CODES.VN,
    timezone: '+07:00',
    date_format: 'YYYY-MM-DD',
    culture: 'en',
    offset_minutes: TIME_ZONE_OFFSETS.ho_chi_minh,
  },
] as const

// ===============================
// LOGIN ERROR CODES
// ===============================

export const LOGIN_ERROR_CODES = {
  IDT09A: 'IDT09A', // Expired subscriber
  UA14C: 'UA14C', // API Error
  UA01R: 'UA01R',
} as const

// ===============================
// DEFAULT VALUES
// ===============================

export const DEFAULT_VALUES = {
  SOLUTION_ID: 3003,
  LANGUAGE: 'korean',
  COUNTRY: COUNTRY_CODES.KR,
  DATE_FORMAT: 'yyyy-MM-DD',
} as const

export const SHOP_STATUS = {
  OVERDUE_MONTHS_THRESHOLD: 2,
  AUTO_TRANSFER_ENABLED: true,
} as const

// ===============================
// ROUTE NAMES
// ===============================

export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  LOGIN_D: 'login-d',
  PAYMENTS: 'payments',
  FIND_LOGIN_INFO: 'find-login-info',
} as const

// ===============================
// AUTH STORAGE KEYS
// ===============================

export const STORAGE_KEYS = {
  SHOP_ID: 'shopId',
  USER_NAME: 'userName',
  API_TOKEN: 'apiToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRED_DATE_TIME_TS: 'tokenExpiredDateTimeTS',
  REFRESH_TOKEN_EXPIRED_DATE_TIME_TS: 'refreshTokenExpiredDateTimeTS',
  REMEMBER_ID: 'id',
  LOGIN_COUNTRY: 'loginCountry',
  LOGIN_PATH: 'loginPath',
  CURRENT_USER: 'currentUser',
  // Sales Report UI States
  IS_PAYMENT_TOTAL_TABLE_SHOW_TOTAL: 'isPaymentTotalTableShowTotal',
  IS_PAYMENT_TOTAL_TABLE_SHOW_BY_STAFF: 'isPaymentTotalTableShowByStaff',
  IS_INCLUDE_POINTS_DEDUCTION_BY_STAFF: 'isIncludePointsDeductionByStaff',
  IS_HIDE_SALES_BY_SERVICE_BY_STAFF: 'isHideSalesByServiceByStaff',
} as const

// ====================
// TIME CONSTANTS
// ====================
export const TIME_CONSTANTS = {
  SECONDS_PER_MINUTE: 60,
  SECONDS_PER_HOUR: 3600,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  MILLISECONDS_PER_SECOND: 1000,
  MILLISECONDS_PER_MINUTE: 60000,
  MILLISECONDS_PER_HOUR: 3600000,
} as const

// ====================
// DATE FORMATS
// ====================
export const DATE_FORMATS = {
  YMD: 'YYYY/MM/DD',
  YMD_HMS: 'YYYY/MM/DD HH:mm:ss',
  YMD_HM: 'YYYY/MM/DD HH:mm',
  DMY: 'DD/MM/YYYY',
  DMY_HMS: 'DD/MM/YYYY HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  ISO_DATE: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  TIME_SHORT: 'HH:mm',
} as const

// ====================
// TIMEZONE CONSTANTS
// ====================
export const TIMEZONE_CONSTANTS = {
  DEFAULT_TIMEZONE: '+09:00', // Korea timezone
  UTC_OFFSET_KOREA: 9,
  UTC_OFFSET_JAPAN: 9,
  UTC_OFFSET_CHINA: 8,
  UTC_OFFSET_VIETNAM: 7,
} as const

// ====================
// DATE MANIPULATION TYPES
// ====================
export const DATE_UNITS = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
} as const

// ====================
// VALIDATION CONSTANTS
// ====================
export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 254,
  MAX_NAME_LENGTH: 100,
  OTP_LENGTH: 6,
  MAX_FILE_SIZE_MB: 10,
  MAX_UPLOAD_SIZE_BYTES: 10 * 1024 * 1024,
  SESSION_TIMEOUT_MINUTES: 30,
  PAGINATION_DEFAULT_LIMIT: 10,
  PAGINATION_MAX_LIMIT: 100,
} as const

// ====================
// ERROR MESSAGES
// ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  VALIDATION_ERROR: 'Validation failed',
  AUTH_ERROR: 'Authentication failed',
  SERVER_ERROR: 'Server error occurred',
  TIMEOUT_ERROR: 'Request timeout',
  UNKNOWN_ERROR: 'An unknown error occurred',
  INVALID_DATE: 'Invalid date provided',
  INVALID_TIMESTAMP: 'Invalid timestamp provided',
  INVALID_TIMEZONE: 'Invalid timezone provided',
} as const

// ====================
// BREAKPOINTS
// ====================
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
} as const

// ====================
// HTTP STATUS CODES
// ====================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

export const SHOP_LOCATIONS = {
  KR: 'kr-ko',
  VN: 'vi-vn',
}

export const DATE_TYPE = {
  DATE: 1,
  MONTH: 2,
  RANGE: 3,
} as const

export const DATE_RANGE_PRESETS = {
  FROM_FIRST_DAY_OF_MONTH_TO_TODAY: 1,
  FROM_TODAY_TO_NEXT_6_DAYS: 2,
  FROM_FIRST_DAY_OF_YEAR_TO_END_OF_CURRENT_MONTH: 3,
} as const

export const DATE_RANGE_OFFSETS = {
  NEXT_6_DAYS: 6,
  NEXT_30_DAYS: 30,
} as const

export const DATE_VIEW_MODE = {
  DATE: 'date',
  MONTH: 'month',
  YEAR: 'year',
} as const

// ====================
// EXPORTED TYPES
// ====================
export type DateUnit = (typeof DATE_UNITS)[keyof typeof DATE_UNITS]
export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS]
export type PrimeVueDateFormat = (typeof PRIMEVUE_DATE_FORMATS)[keyof typeof PRIMEVUE_DATE_FORMATS]
export type TimeConstant = (typeof TIME_CONSTANTS)[keyof typeof TIME_CONSTANTS]
export type ValidationConstant = (typeof VALIDATION_CONSTANTS)[keyof typeof VALIDATION_CONSTANTS]
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
export type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
export type DateRangePresetType = (typeof DATE_RANGE_PRESETS)[keyof typeof DATE_RANGE_PRESETS]
// ====================
// EXPORTED TYPES
// ====================
export const GOODS_STATUS = {
  LIST_DEFAULT: 1,
  ALL: 0,
  ACTIVE: 1,
  INACTIVE: 2,
}

export const API_ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  API_SERVICE_UNAUTHORIZED: 'API_SERVICE_UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const

export const COMMON_STATUS = {
  ALL: 0,
  ACTIVE: 1,
  INACTIVE: 2,
}

export const BOARD_GROUP_TYPE = {
  NOTICE: 1,
  BOARD: 2,
  CHN_NOTICE: 3,
  CHN_BOARD: 4,
}

export const PAGINATION = {
  HOME: 3,
  ZERO: 0,
  SMALL: 5,
  DEFAULT: 10,
  BIG: 50,
  MAX: 100,
  NOTIFICATION: 10,
  DEFAULT_PAGE_NUMBER: 1,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZE_MAX: 100,
  DEFAULT_PAGE_SIZE_MAX_500: 500,
}

export const SEARCH_BOARD_TYPE = {
  TITLE: 1,
  WRITER: 2,
}

export const USER_ROLES = {
  ADMIN_MASTER: 'ADMMASTER',
  ADMIN_STAFF: 'ADMSTAFF',
  MASTER: 'MASTER',
}

export const BOARD_CODE = {
  SYSBOARD: 'SYSBOARD',
  SYSNOTICE: 'SYSNOTICE',
  POPUP: 'POPUp',
}

export const BOARD_TYPE = {
  SYS_NOTICE: 'SYSNOTICE',
  SYS_BOARD: 'SYSBOARD',
  CHN_NOTICE: 'CHNNOTICE',
  CHN_BOARD: 'CHNBOARD',
}

export const POPUP_TYPE = {
  SYSTEM: 1,
  CHAIN: 2,
}

export const FORM_ACTION = {
  ADD: 1,
  EDIT: 2,
  DELETE: 3,
  VIEW: 4,
  CREATE: 5,
  PART: 6,
  RE_ADD: 7,
}
// ====================
// FILTER CONSTANTS
// ====================
export const FILTER_VALUES = {
  ALL: -1,
  NONE: 0,
} as const

export const TIMEZONE_TYPE = {
  UTC: 'UTC',
  LOCAL: 'local',
  KR: 'Asia/Seoul',
} as const

export const LANGUAGE_TYPE = {
  ENGLISH: { NAME: 'English', LANGUAGE: 'EN' },
  KOREAN: { NAME: 'Korean', LANGUAGE: 'KO' },
} as const

export const LANGUAGE = {
  language: {
    korean: 'ko',
    english: 'en',
  },
} as const
export const DOWNLOAD_TYPE = {
  PDF: 'pdf',
  EXCEL: 'excel',
} as const

export const A4_PAGE_WIDTH = {
  PORTRAIT: 595.28,
  LANDSCAPE: 841.89,
} as const

export const FILTER_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
} as const

export const PRINT_TYPE = {
  TABLE: 'TABLE',
  CANVAS: 'CANVAS',
  TEXT: 'TEXT',
} as const

export const ADMIN_SALES_ENUMS = {
  PAYMENT_PURPOSE: {
    NETMONEY_CHARGE: 1,
    BASE_FEE: 2,
  },
  PAYMENT_METHOD: {
    DEPOSITLESS_VIRTUAL: 1,
    DEPOSITLESS: 2,
    CARD: 3,
    REAL_TIME_BANK_TRANSFER: 4,
    KAKAO_PAY: 5,
    AUTOMATIC_TRANSFER: 6,
    NETMONEY: 7,
  },
  NETMONEY_CHARGE_AMOUNT_CARD: [
    { value: 10000, text: '10,000' },
    { value: 20000, text: '20,000' },
    { value: 30000, text: '30,000' },
    { value: 50000, text: '50,000' },
    { value: 100000, text: '100,000' },
  ],

  NETMONEY_CHARGE_AMOUNT: [
    { value: 10000, text: '10,000' },
    { value: 20000, text: '20,000' },
    { value: 30000, text: '30,000' },
    { value: 50000, text: '50,000' },
    { value: 100000, text: '100,000' },
    { value: 150000, text: '150,000' },
    { value: 200000, text: '200,000' },
  ],
  PG: {
    LGUPLUS: 'lguplus',
  },

  ONLINE_PAYMETHOD: {
    CARD: 'AC',
    REAL_TIME_ACCOUNT_TRANSFER: 'AA',
    VIRTUAL_ACCOUNT: 'AS',
  },

  ONLINE_PAYMENT_STATUS: {
    PREPARED: 1,
    IN_PROGRESS: 2,
    AWAITING: 3,
    PAID: 4,
    FAILED: 5,
    CANCELLED: 6,
  },

  PAYMENT_PURPOSE_TYPE: [
    { value: 1, text: 'N' }, // NETMONEY_CHARGE
    { value: 2, text: 'BF' }, // BASE_FEE
  ],

  BASE_FEE_SOURCE_TYPE: {
    MANUAL: 1,
    ADMIN_SALES: 2,
    NET_MONEY: 3,
  },

  BASE_FEE_EXTEND_VALUE_TYPE_ENUMS: {
    MONTHS: 1,
    DAYS: 2,
  },

  BASE_FEE_LINK_TYPE: {
    NONE: 0,
    USE_NET_MONEY: 1,
    RESELLER_RECEIPT: 2,
    ETC: 3,
  },
  IAMPORT_PAY_METHOD: {
    CARD: 'card',
    REAL_TIME_ACCOUNT_TRANSFER: 'tran',
    VIRTUAL_ACCOUNT: 'vbank',
  },

  ONLINE_PAYMENT_TYPES: [
    { value: 3, text: 'AC' },
    {
      value: 4,
      text: 'AA',
    },
    {
      value: 1,
      text: 'AS',
    },
  ],
  BASE_FEE_EXTEND_VALUE_TYPE: [
    { value: 1, text: 'base-fees.months' },
    { value: 2, text: 'base-fees.days' },
  ],
} as const
export const BASE_PAYMENT_METHOD_OPTIONS_KR = [
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL,
    text: 'payments.depositless-payment',
  }, // #177 change text
  { value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD, text: 'payments.card' },
]

export const NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR_WITH_AUTO_TRANSFER = [
  ...BASE_PAYMENT_METHOD_OPTIONS_KR,
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.AUTOMATIC_TRANSFER,
    text: 'payments.automatic-transfer',
  },
]

export const NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR = [...BASE_PAYMENT_METHOD_OPTIONS_KR]

export const NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS = [...BASE_PAYMENT_METHOD_OPTIONS_KR]

export const BASE_FEE_PAYMENT_METHOD_OPTIONS_KR = [
  ...BASE_PAYMENT_METHOD_OPTIONS_KR,
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.NETMONEY,
    text: 'payments.using-netmoney',
  },
]

export const BASE_FEE_PAYMENT_METHOD_OPTIONS = [
  ...BASE_PAYMENT_METHOD_OPTIONS_KR,
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_METHOD.NETMONEY,
    text: 'payments.using-netmoney',
  },
]

export const PAYMENT_PURPOSE_OPTIONS_FOR_AUTO_TRANSFER = [
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE,
    text: 'payments.netmoney-charge-texting',
  },
]

export const ADMIN_ENUMS_OPTIONS = {
  TAX_INVOICE_REQUEST: [
    { value: 1, text: 'tax-invoice-info.required' },
    { value: 2, text: 'tax-invoice-info.not-required' },
  ],
  CONTRACT_DISCOUNT_TYPE: {
    NONE: 1,
    MONTHLY_DISCOUNT: 2,
    ONE_TIME_DISCOUNT: 3,
  },
}
export type PrintType = (typeof PRINT_TYPE)[keyof typeof PRINT_TYPE]

export const PRINT_ORIENTATION = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const

export const PREPAID_SALES_COUNTING_TYPE = {
  SOLD: 0,
  USED: 1,
} as const

export type PrepaidSalesCountingType =
  (typeof PREPAID_SALES_COUNTING_TYPE)[keyof typeof PREPAID_SALES_COUNTING_TYPE]

export const DISPLAY_ITEM_TYPE = {
  ALL: 0,
  SERVICE: 1,
  PRODUCT: 2,
  PREPAID_CARD: 3,
  PREPAID_SERVICE: 4,
} as const

export const BOOKING_BY_MONTH_DISPLAY_ITEM = {
  TOTAL_BOOKING: 0,
  TOTAL_EXCLUDE_CANCELLATION: 1,
  CANCELLATION: 2,
  NO_SHOW: 3,
} as const

export const NETMONEY_SOURCE_TYPE_SELECT = [
  { value: 1, text: 'netmoney-histories.manual' },
  { value: 2, text: 'netmoney-histories.admin-sales' },
  { value: 3, text: 'netmoney-histories.base-fee' },
  { value: 4, text: 'netmoney-histories.text-send' },
  { value: 5, text: 'netmoney-histories.text-refund' },
]

export const MENU_CODE = {
  SHQ_SUP_07: 'SHQ_SUP_07',
  SHQ_SUP_08: 'SHQ_SUP_08',
  SHQ_SUP_09: 'SHQ_SUP_09',
  SHQ_PAY_02: 'SHQ_PAY_02',
} as const

export const LINK_TYPE = {
  SYS_NOTICE: '/ahasoft-notice/SYSNOTICE',
  SYS_BOARD: '/system-board/SYSBOARD',
  CHN_NOTICE: '/chain-notice/CHNNOTICE',
  CHN_BOARD: '/branch-board/CHNBOARD',
  POPUPS: '/popups',
} as const

export const REPORT_BY_TYPE = {
  STAFF: 1,
  CATEGORY: 2,
  SERVICE: 3,
  DATE_OF_WEEK: 4,
  HOUR_OF_DAY: 5,
  CLIENT_RATING: 6,
  SEX: 7,
  SALES_TYPE: 8,
} as const

export type ReportByType = (typeof REPORT_BY_TYPE)[keyof typeof REPORT_BY_TYPE]

export const REPORT_BY_TYPE_PRODUCT = {
  PRODUCT: 0,
  PRODUCT_CATEGORY: 1,
  STAFF: 2,
} as const

export type ReportByTypeProduct =
  (typeof REPORT_BY_TYPE_PRODUCT)[keyof typeof REPORT_BY_TYPE_PRODUCT]

export const CHART_DISPLAY_TYPE = {
  LINE: 'line',
  BAR: 'bar',
  BAR_LINE: 'bar-line',
  PIE: 'pie',
} as const

export type ChartDisplayType = (typeof CHART_DISPLAY_TYPE)[keyof typeof CHART_DISPLAY_TYPE]

export const CHART_DISPLAY_VALUE = {
  QTY: 1,
  AMOUNT: 2,
}

export const FILE_ACTION_TYPE = {
  NONE: 0,
  ADD: 1,
  DELETE: 2,
}
// Error keys messages:
export const ERROR_KEYS = {
  UNKNOWN_ERROR: 'common.unknown-error',
} as const

export const BOARD_ENUM = {
  BOARD_TYPE,
  POPUP_TYPE,
  FILE_ACTION_TYPE,
} as const

export const BOARD_TYPE_OPTION = {
  CREATE: 0,
  DONT_CREATE: 1,
} as const

export const BOARD_TYPE_OPTIONS = {
  SHARE_ALL: 2,
  HEAD_TO_BRANCH: 1,
  DONT_CREATE: 0,
}

export const HQ_NOTICE_OPTIONS = {
  CREATE: 0,
  DONT_CREATE: 1,
} as const

export const MAX_IMAGE_SIZE = 1 * 1024 * 1024 // 1MB
export const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
export const MAX_IMAGE_SIZE_POPUP = 4 * 1024 * 1024 // 4MB
export const LIMIT_FILE = 3
export const NOTICE_LIMIT_DEFAULT = 5
export const ALLOWED_FILE_EXTENSIONS = /\.(gif|png|jpeg|jpg|pdf|zip|xls|xlsx|docx|txt|csv)$/i
export const FORM_STATUS = [
  { value: 1, text: 'general.active' },
  { value: 2, text: 'general.inactive' },
]

export const NEVER_SEE_PERIOD_SELECT = [
  { value: 1, text: 'popups.never-see-provided' },
  { value: 2, text: 'popups.never-see-not-provided' },
]

export const IMAGE_COMPRESS_CONFIG = {
  CONVERT_SIZE: Infinity,
  QUALITY: 0.9,
  SCALE: 0.8,
  MAX_IMAGE_COMPRESS_FILE_SIZE: 1024 * 300,
}

export const NEVER_SEE_PERIOD = {
  DAY: 1,
  WEEK: 2,
  NO: 3,
  FOREVER: 4,
} as const

export const NETMONEY_VARIATION = {
  SAVING: 1,
  DEDUCTION: 2,
}
export type ChartDisplayValue = (typeof CHART_DISPLAY_VALUE)[keyof typeof CHART_DISPLAY_VALUE]

export const ITEM_TYPE = {
  UNREGISTERED: 0,
  NEW: 1,
  REPEAT: 2,
} as const

export type ItemType = (typeof ITEM_TYPE)[keyof typeof ITEM_TYPE]

export const REPORT_BY_TYPE_IN_PREPAID_GOODS_REPURCHASE = {
  NONE: 0,
  ALL: 1,
  SERVICE: 2,
  CARD: 3,
} as const

export const DEFAULT_DATE_FORMAT = PRIMEVUE_DATE_FORMATS.YMD
export const DATE_RANGE_SEPARATOR = '~'
export const REPORT_TYPE_IN_CLIENTS_BY_TYPE = {
  SEX: 1,
  CLIENT_RATING: 2,
  CLIENT_GROUP: 3,
} as const

export type ReportTypeInClientsByType =
  (typeof REPORT_TYPE_IN_CLIENTS_BY_TYPE)[keyof typeof REPORT_TYPE_IN_CLIENTS_BY_TYPE]

export const CONTACT_NUMBER = '1544-4634'

export const NEVER_SEE_PERIOD_USE = {
  PROVIDED: 1,
  NOT_PROVIDED: 2,
} as const

export const FOREVER_YEARS_AHEAD = 100
// ====================
// UI CONSTANTS
// ====================
export const POPUP_PREVIEW_UI = {
  MIN_MODAL_WIDTH: 320,
  MAX_MODAL_WIDTH: 900,
  STACK_COLUMN_THRESHOLD: 350,
} as const
export const DECIMAL_PLACES = 1

export const CARD_LIMITS_CONFIG: ReadonlyArray<ICardLimitConfig> = [
  {
    translationKey: 'payments.shinhan-card',
    maxAmountPerCase: 5,
    numberPerDay: 1,
    totalPayableAmount: 5,
    isMonth: false,
  },
  {
    translationKey: 'payments.nonghyup-card',
    maxAmountPerCase: 10,
    numberPerDay: 10,
    totalPayableAmount: 50,
    isMonth: false,
  },
  {
    translationKey: 'payments.hyundai-card',
    maxAmountPerCase: 11,
    numberPerDay: 5,
    totalPayableAmount: 55,
    isMonth: false,
  },
  {
    translationKey: 'payments.lotte-card',
    maxAmountPerCase: 50,
    numberPerDay: null,
    totalPayableAmount: 50,
    isMonth: false,
  },
  {
    translationKey: 'payments.samsung-card',
    maxAmountPerCase: 50,
    numberPerDay: null,
    totalPayableAmount: 50,
    isMonth: true,
  },
  {
    translationKey: 'payments.kookmin-card',
    maxAmountPerCase: 100,
    numberPerDay: null,
    totalPayableAmount: 100,
    isMonth: true,
  },
  {
    translationKey: 'payments.jeonbuk-card',
    maxAmountPerCase: 100,
    numberPerDay: null,
    totalPayableAmount: 100,
    isMonth: true,
  },
  {
    translationKey: 'payments.kakao-card',
    maxAmountPerCase: 100,
    numberPerDay: null,
    totalPayableAmount: 100,
    isMonth: true,
  },
  {
    translationKey: 'payments.hana-card',
    maxAmountPerCase: 100,
    numberPerDay: null,
    totalPayableAmount: 100,
    isMonth: false,
  },
]
export const SLICE_INDEX = {
  YEAR_START: 0,
  YEAR_END: 4,
  MONTH_START: 4,
  MONTH_END: 6,
  DATE_START: 6,
  DATE_END: 8,
} as const

export const GROUP_BTN_ENUM = {
  yes: 1,
  no: 2,
  confirm: 3,
  save: 4,
  add: 5,
  delete: 6,
  cancel: 7,
  close: 8,
} as const

export const COMMON_MAX_LENGTH = 12
export const PAGE_SIZE = 100
export const UNIT_TIME = 60
export const DEBOUNCE_TIME = 300 // milliseconds

export const GOODS_PRODUCTS_CATEGORIES_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
}

// File size conversion constants
export const BYTES_PER_KB = 1024
export const KB_PER_MB = 1024
export const MB_PER_GB = 1024
export const GB_PER_TB = 1024
export const DECIMAL_PRECISION = 2

// Phone number formatting constants
export const PHONE_LENGTH_8 = 8
export const PHONE_LENGTH_9 = 9
export const PHONE_LENGTH_10 = 10
export const PHONE_LENGTH_11 = 11
export const SEOUL_AREA_CODE_LENGTH = 2
export const SEOUL_AREA_CODE_START = '02'
export const REGIONAL_AREA_CODE_LENGTH = 3
export const SEOUL_PHONE_MIDDLE_START = 2
export const SEOUL_PHONE_MIDDLE_END = 6
export const REGIONAL_PHONE_MIDDLE_START = 3
export const REGIONAL_PHONE_MIDDLE_END = 6
export const PHONE_LAST_DIGITS_START = 6
export const SEOUL_PHONE_MIDDLE_START_ALT = 2
export const SEOUL_PHONE_MIDDLE_END_ALT = 5
export const PHONE_LAST_DIGITS_START_ALT = 5
export const LOCAL_PHONE_START = 4
export const LOCAL_PHONE_END = 8
export const LONG_PHONE_AREA_CODE_LENGTH = 3
export const LONG_PHONE_MIDDLE_START = 3
export const LONG_PHONE_LAST_DIGITS_LENGTH = 4

// Vietnamese phone formatting constants
export const VN_PHONE_AREA_CODE_LENGTH = 4
export const VN_PHONE_MIDDLE_START = 4
export const VN_PHONE_MIDDLE_END = 7
export const VN_PHONE_LAST_DIGITS_START = 7

// Time conversion constants
export const MILLISECONDS_PER_SECOND = 1000
export const MINUTES_PER_DAY = 1440
export const MINUTES_PER_HOUR = 60
export const TEN_MINUTES = 10
export const TIME_PART_PAD_LENGTH = 2
export const PERCENTAGE_MAX_WITH_DECIMAL = '100.0'
export const PERCENTAGE_MAX_WITHOUT_DECIMAL = '100'

// Threshold for treating values as zero (handles floating point precision issues)
export const ZERO_THRESHOLD = 0.001

export type GoodsProductsCategoriesStatus =
  (typeof GOODS_PRODUCTS_CATEGORIES_STATUS)[keyof typeof GOODS_PRODUCTS_CATEGORIES_STATUS]

export const GOODS_PRODUCTS_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
}

export const GOODS_SERVICE_CATEGORY_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
}

export const GOODS_SERVICE_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
}

export type GoodsProductsStatus = (typeof GOODS_PRODUCTS_STATUS)[keyof typeof GOODS_PRODUCTS_STATUS]

export const GOODS_PRODUCTS_UPDATE_STATUS = {
  ENABLE: 1,
  DISABLE: 2,
}

export type GoodsProductsUpdateStatus =
  (typeof GOODS_PRODUCTS_UPDATE_STATUS)[keyof typeof GOODS_PRODUCTS_UPDATE_STATUS]

export const USAGE_STATUS = {
  SALES: 1,
  INTERNAL_USE: 2,
  ALL: 3,
}

export const SALARY_SALE_TYPE = {
  PERCENT: 1,
  AMOUNT: 2,
}

export type UsageStatus = (typeof USAGE_STATUS)[keyof typeof USAGE_STATUS]

export const PRODUCT_CODE_SETUP_TYPE = {
  AUTO: 1,
  MANUAL: 2,
} as const

export type ProductCodeSetupType =
  (typeof PRODUCT_CODE_SETUP_TYPE)[keyof typeof PRODUCT_CODE_SETUP_TYPE]

export const PRIME_VUE_LOCALE_MAP = {
  en: {
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yy',
    firstDayOfWeek: 0,
    chooseDate: 'Choose Date',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    prevYear: 'Previous Year',
    nextYear: 'Next Year',
  },
  ko: {
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    today: '오늘',
    clear: '지우기',
    dateFormat: 'yy-mm-dd',
    firstDayOfWeek: 0,
    chooseDate: '날짜 선택',
    prevMonth: '이전 달',
    nextMonth: '다음 달',
    prevYear: '이전 해',
    nextYear: '다음 해',
  },
} as const

export const TAX_INVOICE_REQUEST = {
  REQUIRED: 1,
  NOT_REQUIRED: 2,
  NOT_SELETED: 3,
} as const

export const TAX_INVOICE_REQUEST_OPTIONS = [
  { value: 1, text: 'tax-invoice-info.required' },
  { value: 2, text: 'tax-invoice-info.not-required' },
]

export const SALES_ITEM_TYPE = {
  SERVICE: 2,
  PRODUCT: 1,
  PREPAID_CARD: 4,
  PREPAID_SERVICE: 3,
} as const

export const DEDUCTION_TYPE = {
  none: 0,
  PREPAID_CARD: 1,
  PREPAID_SERVICE: 2,
  LOYALTY_POINT: 4,
} as const

export type SalesItemType = (typeof SALES_ITEM_TYPE)[keyof typeof SALES_ITEM_TYPE]

export const REPORT_BY_TYPE_SALES_BY_ITEM = {
  CATEGORY: 1,
  SERVICE: 2,
} as const

export type ReportByTypeSalesByItem =
  (typeof REPORT_BY_TYPE_SALES_BY_ITEM)[keyof typeof REPORT_BY_TYPE_SALES_BY_ITEM]

export const PREPAID_CARD_TYPE = {
  DEPOSIT: 1,
  DISCOUNT: 2,
} as const

export const SALES_REF_TYPE = {
  SALES: 1,
  REFUND: 2,
} as const

export const SALES_PAYMENT_TYPE = {
  SALES: 1,
  ADD_PAYMENT: 2,
  BOOKING_DEPOSIT: 3,
  BOOKING_DEPOSIT_REFUND: 4,
  ADD_EXTERNAL_SYSTEM_PAYMENT: 5,
}

export const DEPOSIT_PAYMENT_TYPES = [
  SALES_PAYMENT_TYPE.BOOKING_DEPOSIT,
  SALES_PAYMENT_TYPE.BOOKING_DEPOSIT_REFUND,
] as const

export const SALES_STATUS = {
  COMPLETED: 0,
  DELETED: 2,
  EDITED: 3,
} as const

export const NAVER_COUPON_TYPE = {
  AMOUNT: 1,
  RATE: 2,
  GIFT: 3,
} as const

export const BOOKING_EXTERNAL_SYSTEM_PAYMENT = {
  NAVER_GENERAL: 1,
  NAVER_PREPAYMENT: 2,
  NAVER_PAY_AT_SALON: 3,
  NAVER_PAY_AT_SALON_DEPOSIT: 4,
}

export const GIFT_CARD_TYPE = {
  NONE: 0,
  SALES: 1,
  REDEEM: 2,
}

export const SALES_GOODS_TYPE = {
  PRODUCT: 1,
  SERVICE: 2,
  PREPAID_SERVICE: 3,
  PREPAID_CARD: 4,
  PACKAGE: 5,
  DEDUCT_PREPAID_SERVICE: 6,
  SALE_PREPAID_SERVICE: 7,
  CUSTOMIZE_PREPAID_SERVICE: 8,
}
export const ENUM_NO_LIMIT = -1

export const VALIDITY_TYPE = {
  MONTH: 1,
  DAY: 2,
} as const

export const SALARY_TYPE = {
  PERCENT: 1,
  AMOUNT: 2,
}

export const SALES_ENUM = {
  GOOD_TYPE: {
    SERVICE: 2,
    PRODUCT: 1,
    PREPAID_CARD: 4,
    PREPAID_SERVICE: 3,
  },
  PERCENT: 1,
  AMOUNT: 2,
}
export const LOGO_TYPE = {
  PC: 0,
  MOBILE: 1,
}

export const MOBILE_SCREEN_BREAKPOINT = 767.98

export const CHAIN_IMAGE_ERROR_CODES = [
  'CI01C',
  'CI02C',
  'CI03C',
  'CI04C',
  'CI05C',
  'CI06C',
  'CI07C',
  'CI08C',
  'CI09C',
  'CI10C',
  'CI11C',
  'CI12C',
  'CI000',
]

export const FIND_LOGIN_INFO_TYPE = {
  USER_ID: 'USER_ID',
  PASSWORD: 'PASSWORD',
} as const

export const CALL_CENTER_NUMBER = {
  KOREA: '1544-4634',
  VIETNAM: '1234-5678',
}

export const FIND_ID_PASSWORD_ERROR_CODES = {
  SHP01R: 'SHP01R',
  SHP03R: 'SHP03R',
  IDT13A: 'IDT13A',
  UA01R: 'UA01R',
  IDT18A: 'IDT18A',
}

export const GOODS_DISPLAY_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
}

export type GoodsDisplayStatus = (typeof GOODS_DISPLAY_STATUS)[keyof typeof GOODS_DISPLAY_STATUS]

export const GOODS_DISPLAY_TABLE_STATUS = {
  INACTIVE: 2,
  ACTIVE: 1,
}

export type GoodsDisplayTableStatus =
  (typeof GOODS_DISPLAY_TABLE_STATUS)[keyof typeof GOODS_DISPLAY_TABLE_STATUS]

export const PACKAGE_TABS = {
  SERVICES: 0,
  PRODUCTS: 1,
  PREPAID_CARDS: 2,
  PREPAID_SERVICES: 3,
} as const

export type PackageTabs = (typeof PACKAGE_TABS)[keyof typeof PACKAGE_TABS]

export const SIGNALR_HUB_NAME = 'salonheadquarter'

export const NOTIFICATION_TYPE = {
  SYSTEM_NEW_VERSION: 'SYSTEM_NEW_VERSION',
  SYSTEM_MAINTAIN_MODE: 'SYSTEM_MAINTAIN_MODE',
  LOGOUT_USER_ACCESS: 'LOGOUT_USER_ACCESS',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

export const COUNTDOWN_DEFAULT = 8
export const SESSION_KEY = {
  APP_VERSION_CACHE: 'app_version',
}

export const LOGOUT_REASON_ENUM = {
  CHANGE_PASSWORD: 0,
  SHOP_CHANGED_EXPIRED: 1,
  SHOP_CHANGED_STATUS: 2,
} as const

export const ADDITIONAL_PAYMENT_METHOD_IDS = {
  LP: {
    VALLUE: 'LP',
    ENUM: DEDUCTION_TYPE.LOYALTY_POINT,
  },

  PS: {
    VALLUE: 'PS',
    ENUM: DEDUCTION_TYPE.PREPAID_SERVICE,
  },

  PC: {
    VALLUE: 'PC',
    ENUM: DEDUCTION_TYPE.PREPAID_CARD,
  },
}

export const MAX_VISIBLE_ITEMS = 11 as const

export const SALES_TRANSFER_TYPE = {
  TYPE: {
    ALL: -1,
    PREPAID_CARD: 1,
    PREPAID_SERVICE: 2,
    ETC: 3,
  },
}

export type LogoutReason = (typeof LOGOUT_REASON_ENUM)[keyof typeof LOGOUT_REASON_ENUM]

// New Clients Repeat Table Constants
export * from './newClientsRepeat'

// Report by Branch Constants
export * from './reportByBranch'

// Service Constants
export * from './service'

// Service Constants
export * from './findPostcode'

// Input Money Constants
export * from './inputMoney'
