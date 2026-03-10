// ===============================
// COUNTRY & REGION CONSTANTS
// ===============================

export const COUNTRY_CODES = {
  KR: 'KR',
  VN: 'VN',
} as const

export const COUNTRY_CONFIG = {
  kr: COUNTRY_CODES.KR,
  vi: COUNTRY_CODES.VN,
} as const

export const STANDARD_DATE_FORMAT = {
  MY: 'MM-YYYY',
  DMY: 'DD-MM-YYYY',
  DMYH: 'DD-MM-YYYY HH:mm',
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
  IDT09A: 'idt09a', // Expired subscriber
  UA14C: 'ua14c', // API Error
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
  UNKNOWN_ERROR: 'Unknown error occurred',
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
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NUMBER: 1,
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
