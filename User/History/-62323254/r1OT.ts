// ===============================
// COUNTRY & REGION CONSTANTS
// ===============================

import type { MenuStructure } from '@/types/menu'

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
  IDT09A: 'IDT09A', // Expired subscriber
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

export const menuData: MenuStructure = {
  branch: {
    text: 'branch-management', //지점관리
    link: '',
    code: 'SHQ_BMN_01',
    submenu: {
      sales_status: {
        text: 'sales-status', //매출현황
        link: '/branch/sales-status',
        code: 'SHQ_BMN_02',
      },
      sales_status_by_branch: {
        text: 'sales-status-by-branch', //지점별 매출현황
        link: '/branch/sales-status-by-branch',
        code: 'SHQ_BMN_03',
      },
      sales_trend_by_branch: {
        text: 'sales-trend-by-branch', //지점별 매출추이
        link: '/branch/sales-trend-by-branch',
        code: 'SHQ_BMN_04',
      },
      branch_sales: {
        text: 'branch-sales',
        link: '/branch-sales',
        code: 'SHQ_BMN_05',
      },
      branch_prepaid_goods: {
        text: 'branch-prepaid-goods',
        link: '/branch-prepaid-goods',
        code: 'SHQ_BMN_09',
      },
      sales_total_by_branch: {
        text: 'sales-total-by-branch',
        link: '/sales-total-by-branch/sales-total',
        code: 'SHQ_BMN_06',
      },
      report_by_branch: {
        text: 'report-by-branch',
        link: '/report',
        code: 'SHQ_BMN_07',
      },
      branches: {
        text: 'branches',
        link: '/branches',
        code: 'SHQ_BMN_08',
      },
    },
  },
  setup: {
    text: 'setup', //설정',
    link: '',
    code: 'SHQ_SET_01',
    submenu: {
      // ------------------------------------------LEVEL 2
      services_and_products: {
        text: 'service-and-product',
        link: '',
        code: 'SHQ_SET_02',
        submenu: {
          services: {
            text: 'services', //서비스
            link: '/goods/services',
            code: 'SHQ_SET_03',
            icon: 'pi pi-chart-bar',
          },
          prepaid_cards: {
            text: 'prepaid-cards', //정액권
            link: '/goods/prepaid-cards',
            code: 'SHQ_SET_04',
          },
          package: {
            text: 'package', // 패키지
            link: '/goods/packages',
            code: 'SHQ_SET_05',
          },
          product: {
            text: 'product', //제품
            link: '/goods/products',
            code: 'SHQ_SET_06',
          },
          product_category: {
            text: 'product-category', //제품분류
            link: '/goods/product-categories',
            code: 'SHQ_SET_07',
          },
        },
      },
      basic_setup: {
        text: 'basic-setup',
        link: '',
        code: 'SHQ_SET_09',
        submenu: {
          // ------------------------------------------LEVEL 3
          misc_codes: {
            text: 'setup-chain-logo',
            link: '/setup/setup-chain-logo',
            code: 'SHQ_SET_10',
          },
        },
      },
    },
  },
  account: {
    text: 'account', //내 계정
    link: '',
    code: 'SHQ_ACC_01',
    submenu: {
      user_management: {
        text: 'id-management', //사용자관리
        link: '/account/user-management',
        code: 'SHQ_ACC_02',
      },
      shop_information: {
        text: 'subscriber-information', //가입자정보
        link: '/account/subscriber-information',
        code: 'SHQ_ACC_03',
      },
    },
  },
  boards: {
    text: 'boards',
    link: '',
    code: 'SHQ_SUP_02',

    submenu: {
      head_notice: {
        text: 'head-notice', // 공지사항(체인)
        link: '/boards/CHNNOTICE',
        code: 'SHQ_SUP_03',
      },
      branch_board: {
        text: 'branch-board', //지점게시판
        link: '/boards/CHNBOARD',
        code: 'SHQ_SUP_04',
      },
      popup_management: {
        text: 'popup-management', //팝업관리
        link: '/popups',
        code: 'SHQ_SUP_05',
      },
    },
  },

  board: {
    text: 'board', //게시판
    link: '',
    code: 'SHQ_SUP_01',
    submenu: {
      system_notice: {
        text: 'system-notice', //시스템공지
        link: '/boards/SYSNOTICE',
        code: 'SHQ_SUP_02',
      },
      contact_chat: {
        text: 'contact-chat',
        link: null,
        code: 'SHQ_SUP_08',
      },
      remote_support: {
        text: 'remote-support',
        link: null,
        code: 'SHQ_SUP_07',
      },

      help_center_information: {
        text: 'help-center-information',
        link: null,
        code: 'SHQ_SUP_09',
      },
    },
  },
  payment: {
    text: 'payment', //결제
    link: '',
    code: 'SHQ_PAY_01',
    submenu: {
      netmoney_payment: {
        text: 'netmoney-payment',
        link: '/payments',
        code: 'SHQ_PAY_01',
      },
      service_fee_payment: {
        text: 'service-fee-payment',
        link: '/payments?type=service_fee',
        code: 'SHQ_PAY_02',
      },
      payment_history: {
        text: 'payment-history',
        link: '/payment-history',
        code: 'SHQ_PAY_03',
      },
      netmoney_history: {
        text: 'netmoney-history', //넷머니 내역
        link: '/netmoney-history',
        code: 'SHQ_PAY_04',
      },
      extension_expiry_date: {
        text: 'extension-expiry-date', //이용기간연장
        link: '/extension-expiry-date',
        code: 'SHQ_PAY_05',
      },
    },
  },
}
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
}
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

export const PREPAID_SALES_COUNTING_TYPE = {
  SOLD: 0,
  USED: 1,
} as const

export const DISPLAY_ITEM_TYPE = {
  ALL: 0,
  SERVICE: 1,
  PRODUCT: 2,
  PREPAID_CARD: 3,
  PREPAID_SERVICE: 4,
} as const

export const NETMONEY_SOURCE_TYPE_SELECT = [
  { value: 1, text: 'netmoney-histories.manual' },
  { value: 2, text: 'netmoney-histories.admin-sales' },
  { value: 3, text: 'netmoney-histories.base-fee' },
  { value: 4, text: 'netmoney-histories.text-send' },
  { value: 5, text: 'netmoney-histories.text-refund' },
]

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
