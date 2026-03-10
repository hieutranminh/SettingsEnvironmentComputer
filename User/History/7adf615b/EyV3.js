export const USER_ROLES = {
  SYSTEM_MASTER: 'SYSMASTER',
  ADMIN_MASTER:  'ADMMASTER',
}

export const MINUTES_OF_24H = 1440

export const VIEW_TABLE_TYPE = {
  BOARD: 1,
  OTHER: 2,
}

export const MESSAGE_MODAL_TYPE = {
  EDUCATION: 1,
  SHOP_LIST: 2,
  GENERAL:   3,
}

export const SERVICE_TYPES = {
  USER_ACCOUNT_AGGR:         9000,
  SHOP_AGGR:                 9001,
  RESELLER_AGGR:             9002,
  AUTH_AGGR:                 9003,
  ADMIN_SALES_AGGR:          9004,
  MESSAGE_AGGR:              9005,
  UPDATE_SHOP_SOLUTION_AGGR: 9006,
  REFUSE_MESSAGE_AGGR:       9007,
  MIGRATION_AGGR:            9008,
  REPORT_SHOP_AGGR:          9009,
  GOODS_AGGR:                9010,
  ADMIN_AGGR:                9011,
  MISC_CODE_AGGR:            9012,

  SHOP_CLIENTS_DATA_DOWNLOAD: 9111,

  // Identities
  IDENTITIES: {
    USER_ROLE_READ:          1001,
    USER_ROLE_CMD:           1002,
    USER_ACCOUNT_READ:       1003,
    USER_ACCOUNT_CMD:        1004,
    SHOP_USER_ROLE_READ:     1005,
    SHOP_USER_ROLE_CMD:      1006,
    USER_LOGIN_HISTORY_READ: 1007,
    USER_ACCESS_BLOCK_READ:  1008,
    AUTH_CMD:                1009,
    DROPDOWN_LIST:           1900,
  },

  // Admins
  ADMINS: {

    // Solution
    SOLUTION_READ:              2001,
    SOLUTION_CMD:               2002,
    MENU_READ:                  2003,
    MENU_CMD:                   2004,
    BUSINESS_TYPE_READ:         2005,
    BUSINESS_TYPE_CMD:          2006,
    SERVICE_TYPE_READ:          2007,
    SERVICE_TYPE_CMD:           2008,
    COUNTRY_READ:               2009,
    COUNTRY_CMD:                2010,
    COUNTRY_SOLUTION_READ:      2011,
    COUNTRY_SOLUTION_CMD:       2012,
    COUNTRY_BUSINESS_TYPE_READ: 2013,
    COUNTRY_BUSINESS_TYPE_CMD:  2014,
    COUNTRY_SERVICE_TYPE_READ:  2015,
    COUNTRY_SERVICE_TYPE_CMD:   2016,
    MENU_SHOP_USER_ROLE_CMD:    2017,

    // Shop
    SHOP_READ:                     2101,
    SHOP_CMD:                      2102,
    EDUCATION_READ:                2103,
    EDUCATION_CMD:                 2104,
    TAX_INVOICE_INFO_READ:         2105,
    TAX_INVOICE_INFO_CMD:          2106,
    CONSULT_READ:                  2107,
    CONSULT_CMD:                   2108,
    CONSULT_OPINION_CMD:           2109,
    SHOP_ENVIRONMENT_CMD:          2110,
    PAYMENT_INFO_CMD:              2111,
    PAYMENT_INFO_READ:             2112,
    CHAIN_READ:                    2113,
    CHAIN_CMD:                     2114,
    BRANCH_READ:                   2115,
    BRANCH_CMD:                    2116,
    MISC_CODE_CMD:                 2117,
    MISC_CODE_READ:                2118,
    RESELLER_CMD:                  2119,
    RESELLER_READ:                 2120,
    RESELLER_SUBSCRIBER_CMD:       2121,
    RESELLER_SUBSCRIBER_READ:      2122,
    TAX_INVOICE_INFO_HISTORY_READ: 2123,

    CID_ACCOUNT_CMD:  2125,
    CID_ACCOUNT_READ: 2126,

    CID_RECEIVING_HISTORY_CMD:  2127,
    CID_RECEIVING_HISTORY_READ: 2128,

    REPOERT_SHOP_READ: 2129,

    AUTO_TRANSFER_ARS_HISTORY_CMD:  2130,
    AUTO_TRANSFER_ARS_HISTORY_READ: 2131,

    // Homepages
    JOIN_CONSULT_CMD:     2210,
    JOIN_CONSULT_READ:    2211,
    ADDRESS_AREA_READ:    2220,
    RECEIVER_MOBILE_CMD:  2230,
    RECEIVER_MOBILE_READ: 2231,
    JOIN_CHAT_CMD:        2232,
    JOIN_CHAT_READ:       2233,

    //
    SOLUTION_DROPDOWN_LIST:    2900,
    MISCCODE_DROPDOWN_LIST:    2901,
    SHOP_DATA_MANAGEMENT_READ: 2902,
    EXTERNAL_SYSTEM_SHOP_READ: 2903,
  },

  ADMIN_SALES: {
    MISC_CODE_CMD:             3001,
    MISC_CODE_READ:            3002,
    SHOP_USAGE_READ:           3003,
    SHOP_USAGE_CMD:            3004,
    BASE_FEE_READ:             3005,
    BASE_FEE_CMD:              3006,
    BANK_TRANSFER_NOTICE_CMD:  3007,
    BANK_TRANSFER_NOTICE_READ: 3008,
    NETMONEY_HISTORY_READ:     3009,
    NETMONEY_HISTORY_CMD:      3010,
    ADMIN_SALES_READ:          3021,
    ADMIN_SALES_CMD:           3022,
    REPORTS_READ:              3023,
    CMS_CMD:                   3024,
    CMS_READ:                  3025,
    MISCCODE_DROPDOWN_LIST:    3901,
  },

  MESSAGES: {
    TEXT_FEE_CMD:             4001,
    TEXT_FEE_READ:            4002,
    TEXT_SAMPLE_CMD:          4003,
    TEXT_SAMPLE_READ:         4004,
    TEXT_MESSAGE_CMD:         4005,
    TEXT_MESSAGE_READ:        4006,
    TEXT_MY_MESSAGE_CMD:      4007,
    TEXT_MY_MESSAGE_READ:     4008,
    TEXT_SENDER_PHONE_CMD:    4009,
    TEXT_SENDER_PHONE_READ:   4010,
    REFUSE_TEXT_MESSAGE_CMD:  4011,
    REFUSE_TEXT_MESSAGE_READ: 4012,
    REPORTS_READ:             4013,

    MY_MESSAGE_CATEGORY_READ: 4014,
    MY_MESSAGE_CATEGORY_CMD:  4015,
  },
  MESSAGES_BKG_TASKS_KR: {
    SEND_MESSAGE_CMD:  4031,
    SEND_MESSAGE_READ: 4032,
  },
  MESSAGES_SENDER_KR: {
    SEND_MESSAGE_CMD:  4041,
    SEND_MESSAGE_READ: 4042,
  },

  MESSAGEAUTOS: {
    MESSAGE_SETUP_ADMIN_CMD:    4101,
    //MESSAGE_SETUP_READ:  4102,
    SCHEDULED_MESSAGE_LOG_READ: 4102,
  },

  BOARDS: {
    BOARD_MANAGEMENT_CMD:   5001,
    BOARD_MANAGEMENT_READ:  5002,
    NOTICE_CMD:             5003,
    NOTICE_READ:            5004,
    BOARD_CMD:              5005,
    BOARD_READ:             5006,
    FILE_ATTACHMENT_READ:   5007,
    POPUP_CMD:              5008,
    POPUP_READ:             5009,
    SYSTEM_BANNER_CMD:      5010,
    SYSTEM_BANNER_READ:     5011,
    MANUAL_MANAGEMENT_CMD:  5012,
    MANUAL_MANAGEMENT_READ: 5013,

    CHAIN_BOARD_SETUP_CMD:  5014,
    CHAIN_BOARD_SETUP_READ: 5015,
  },
  CLIENTS: {
    CLIENT_CMD:  6001,
    CLIENT_READ: 6002,
  },

  MIGRATIONS: {
    MIGRATION_CMD:               7001,
    CLIENT_CMD:                  7002,
    TASKS_CMD:                   7003,
    GOODS_CMD:                   7004,
    SALES_CMD:                   7005,
    PREPAID_CARD_CMD:            7006,
    PREPAID_SERVICE_CMD:         7007,
    SVC_SERVICE_CMD:             7008,
    GOODS_PREPAID_CARD_CODE_CMD: 7009,
    GOODS_PRODUCT_CMD:           7010,
    BOOKINGS_CMD:                7011,
    AHA_OLD_CMD:                 7015,
    MIGRATION_HISTORY_CMD:       7016,
  },

  STAFFS: {
    STAFF_READ: 8001,
  },

  EVENT_LOGS: {
    INTEGRATION_EVENT_LOGS_AGGR:          11000,
    RECEIVED_INTEGRATION_EVENT_LOGS_AGGR: 11001,
    INTEGRATION_EVENT_BACKUP:             11002,
    RECEIVED_INTEGRATION_EVENT_BACKUP:    11003,
    INTEGRATION_RESTORE_BACKUP:           11004,
  },

  BOOKINGS: {
    BOOKINGS_RESOURCES_SETUP_READ: 12001,
  },

  GOODS: {
    SERVICE_READ: 13001,
  },

  // Naver
  NAVER_AGG: 14001,
}

export const SERVICE_EXTEND_TYPES = {
  // Common
  CHANGE_ORDER_NO: '/ChangeOrderNo',
  LIST:            '/List',
  VERIFICATION:    '/Verification',
  EXCEL:           '/Excel',
  SHOP_LIST:       '/ShopList',
  SEARCH:          '/Search',
  GET_LIST:        '/GetList',
  UPDATE_STATUS:   '/UpdateStatus',
  CREATE:          '/Create',
  SEARCH_LIST:     '/SearchList',
  GET_TOKEN:       '/GetToken',
  SHOP:            '/Shop',
  READ:            '/Read',
  REPORT:          '/Report',
  GET_NAME:        '/GetName',
  DOWNLOAD:        '/Download',
  COUNT:           '/Count',
  STATE:           '/State',
  OLDSYS:          '/OldSys',
  ISSHOPEXIST:     '/IsShopExist',

  // Aggregeate
  AUTH_AGGR: {
    LOGIN_INTEGRATIONADMIN: '/Login/IntegrationAdmin',
  },

  ADMIN_SALES_AGGR: {
    ADMIN_SAELS_LIST:          '/AdminSales/List',
    ADMIN_SAELS_TAX_LIST:      '/AdminSales/TaxList',
    BANK_TRANSFER_NOTICE_LIST: '/BankTransferNotice/List',
  },
  IDENTITIES_AGGR: {
    UPDATE_TEMPORARY_PASSWORD: '/UpdateTemporaryPassword',
  },
  // Solutions
  SOLUTION:             '/Solution',
  BY_SERVICE_TYPE_CODE: '/ByServiceTypeCode',

  // Misc Codes
  SHOPRATING:          '/ShopRating',
  COMMONCODE:          '/CommonCode',
  COMMONCODES:         '/CommonCodes',
  VANMODEL:            '/VANModel',
  PAYMENTMETHOD:       '/PaymentMethod',
  MIGRATION_SOURCE:    '/MigrationSource',
  MIGRATION_DATA_TYPE: '/MigrationDataType',

  // Identities
  ADMIN_MASTER:          '/AdminMaster',
  CHANGE_PASSWORD:       '/Password',
  ADMIN_STAFF:           '/AdminStaff',
  CREATE_ADMIN_MASTER:   '/CreateAdminMaster',
  GET_ADMIN_MASTER:      '/GetAdminMaster',
  GET_ADMIN_MASTER_LIST: '/GetAdminMasters',
  USER_ROLE:             '/UserRole',
  ADMIN_USER_ROLE:       '/AdminUserRole',
  SHOP_ADMIN:            '/AdminShopList',
  ACCOUNT_LOCK:          '/AccountLock',
  NAME_LIST:             '/NameList',
  USER_ID:               '/UserID',

  // Shops
  EXPIRY_DATE:                                 '/ExpiryDate',
  MANAGER_INFO:                                '/ManagerInfo',
  SHOP_ENVIRONMENT:                            '/ShopEnvironmentSetup',
  SHOP_DATA_MANAGEMENT_MEMO:                   '/ShopDataManageMentMemo',
  SHOP_DATA_MANAGEMENT:                        '/ShopDataManagement',
  SHOP_DATA_MANAGEMENT_OLD_SYSTEM_INFORMATION: '/ShopDataManagementOldSystemInformation',
  SHOP_DATA_MANAGEMENT_OLD_SHOP_NUMBER:        '/ShopDataManagementOldShopNumber',

  REVIEW_POSTED:                       '/ReviewPosted',
  VAN:                                 '/VAN',
  CID:                                 '/CID',
  AUTO_TRANSFER_ARS:                   '/AutoTransferARS',
  AUTO_TRANSFER_INFO:                  '/AutoTransferInfo',
  CONTRACT_INFO:                       '/ContractInfo',
  OVERDUE_MONTHS:                      '/OverdueMonths',
  SHOP_EXTREA_FEES:                    '/ShopExtraFees',
  BILLING_SUBSCRIBER:                  '/BillingSubscriber',
  SEARCHED_BILLING_SUBSCRIBERS:        '/SearchedBillingSubscribers',
  SUBSCRIBERS:                         '/Subscribers',
  CREATE_SHOP:                         '/CreateShop',
  PENALTY:                             '/Penalty',
  BANK_ACCOUNT:                        '/BankAccount',
  CONSULT_TYPE:                        '/ConsultType',
  CONTRACT_TYPE:                       '/ContractType',
  EXTRA_FEES:                          '/ExtraFees',
  REFERRAL_SOURCE:                     '/ReferralSource',
  SALES_ITEM_TYPE:                     '/SalesItemType',
  INFO:                                '/Info',
  SHOP_NAME_LIST:                      '/ShopNameList',
  MONTHLY_FEE:                         '/MonthlyFee',
  BASIC:                               '/Basic',
  BASIC_SEARCH:                        '/BasicSearch',
  SUBSCRIPTION_BY_PERIOD:              '/SubscriptionByPeriod',
  SHOPS_BY_MONTHLY_FEE:                '/ShopsByMonthlyFee',
  SHOPS_BY_SOLUTION_AND_TYPES:         '/ShopsBySolutionAndTypes',
  SUBSCRIPTION_BY_SALES_STAFF:         '/SubscriptionBySalesStaffs',
  CHAIN_NAME_LIST:                     '/ChainNameList',
  GET_SHOP_DATA_COUNT:                 '/GetShopDataCount',
  GET_EXTERNAL_SYSTEM_CONNECTED_COUNT: '/GetExternalSystemConnectedDataCount',
  //CID
  SUBSCRIBER_NAME:                     '/SubscriberName',

  //AdminSales
  TAX_LIST:                    '/TaxList',
  IS_SAME_BANK_TRANSFER_SALES: '/IsSameBankTransferSales',
  ONLINE_PAYMENT_LIST:         '/OnlinePaymentList',
  VIRTUAL_ACCOUNT_LIST:        '/OnlinePayment/VirtualAccountList',
  ONLINE_PAYMENT_NOTES:        '/OnlinePayment/Notes',
  ONLINE_PAYMENT_ERROR_LIST:   '/OnlinePayment/OnlinePaymentSyncFailedLogList',
  ADMIN_SALES_BY_SHOPS:        '/AdminSalesByShops',
  NETMONEY_BALANCE:            '/NetMoneyBalance',
  CMS_PAYER:                   '/CMSPayer',
  CMS_BILLING:                 '/CMSBilling',
  CMS_RESULT:                  '/CMSResult',
  CMS_PAYLOG:                  '/CMSPayLog',
  MULTI:                       '/Multi',
  PAY:                         '/Pay',
  PAY_MANUAL:                  '/PayManual',
  COUNT_BY_STATUS:             '/CountByStatus',
  OUTSTANDING:                 '/Outstanding',
  GAVIA:                       '/Gavia',
  RESELLER_SETTLEMENT:         '/ResellerSettlement',
  BASE_FEE:                    '/BaseFee',
  ADMIN_SALES:                 '/AdminSales',

  // Messages
  MASTER: '/Master',
  DETAIL: '/Detail',

  SOLUTION_TEXT_FEE:           '/SolutionTextFee',
  CHAIN_TEXT_FEE:              '/ChainTextFee',
  SHOP_TEXT_FEE:               '/ShopTextFee',
  BY_SHOP:                     '/ByShop',
  TEXT_SAMPLE_AREA:            '/SampleArea',
  TEXT_ADMIN_SAMPLE_AREA:      '/Admin',
  TEXT_SAMPLE_BUSINESS_TYPE:   '/SampleBusinessType',
  TEXT_SAMPLE_GROUP:           '/SampleGroup',
  TEXT_SAMPLE:                 '/Sample',
  ALIMTALK_SAMPLE:             '/AlimTalkSample',
  LIST_BY_SHOP:                '/ListByShop',
  LIST_BY_MASTER:              '/ListByMaster',
  LIST_BY_TARGET_DATE:         '/ListByTargetDate',
  LIST_MISSING_BY_TARGET_DATE: '/ListMIssingByTargetDate',
  LIST_BY_RECEIVER:            '/ListByReceiver',
  LIST_BY_SHOP_RECEIVER_PHONE: '/ListByShopReceiverPhone',
  SUM_BY_TARGET_DATE:          '/SumByTargetDate',
  LIST_BY_RECEIVER_PHONE:      '/ListByReceiverPhone',
  DELETE_LIST:                 '/DeleteList',
  UPDATE_MISSING_LIST:         '/UpdateMissingList',
  VIEW_IMAGE:                  '/ViewImage',
  UPDATE_SENDER_PHONE:         '/UpdateSenderPhone',
  AS_AUTO_SENDER:              '/AsAutoSender',
  REFUSED_LIST_WITH_DETAIL:    '/RefusedListWithDetail',
  UPDATE_MESSAGE_REJECTED:     '/UpdateMessageRejected',
  MESSAGES_BY_SHOPS:           '/MessagesByShops',
  OWNER_MOBILE_VERIFY:         '/OwnerMobileVerify',

  // MessageAutos
  MESSAGE_SETUP_ADMIN: '/MessageSetupAdmin',
  GENERAL:             '/General',

  // Boards
  READ_COUNT:                 '/ReadCount',
  COUNT_BY_PROCESSING_STATUS: '/CountByProcessingStatus',

  // Clients
  UPDATE_ALLOWED_MESSAGE_TYPE: '/UpdateAllowedMessageType',
  MIGRATION_COUNT:             '/MigrationCount',

  // Migration Aggregate
  CONTINUE:             '/Continue',
  CANCEL:               '/Cancel',
  STOP_BY_MIGRATION_ID: '/StopByMigrationId',

  // Migrations
  DELETE_GOODS:             '/DeleteGoods',
  SALES:                    '/Sales',
  SALES_CODE:               '/SalesCode',
  SALES_CODE_WITH_CATEGORY: '/SalesCodeWithCategory',
  DELETE_SALES:             '/DeleteSales',
  TEMP_DATA:                '/TempData',
  SOURCE_CODE:              '/SourceCode',
  CLIENT_CODE:              '/ClientCode',
  CLIENT:                   '/Client',

  PREPAID_CARDS:        '/PrepaidCards',
  PREPAID_CARD:         '/PrepaidCard',
  PRE_CRD_PREPAID_CARD: '/PreCrdPrepaidCard',
  DELETE_PREPAID_CARD:  '/DeletePrepaidCard',

  PREPAID_SERVICES:         '/PrepaidServices',
  PREPAID_SERVICE:          '/PrepaidService',
  PRE_SVC_SERVICE:          '/PreSvcService',
  PRE_SVC_SERVICE_CATEGORY: '/PreSvcServiceCategory',
  PRE_SVC_PREPAID_SERVICE:  '/PreSvcPrepaidService',
  SVC_SERVICES:             '/SvcServices',
  SVC_SERVICE_CATEGORY:     '/SvcServiceCategory',
  SVC_PREPAID_SERVICE:      '/SvcPrepaidService',
  SVC_SERVICE:              '/SvcService',
  DELETE_PREPAID_SERVICE:   '/DeletePrepaidService',
  DELETE_CLIENT:            '/DeleteClient',
  DELETE_SVC_SERVICE:       '/DeleteSvcService',

  GOODS_PREPAID_CARD_CODES:       '/GoodsPrepaidCardCodes',
  GOODS_PREPAID_CARD_CODE:        '/GoodsPrepaidCardCode',
  DELETE_GOODS_PREPAID_CARD_CODE: '/DeleteGoodsPrepaidCardCode',

  GOODS_PRODUCTS:         '/GoodsProducts',
  GOODS_PRODUCT_CATEGORY: '/GoodsProductCategory',
  GOODS_PRODUCT:          '/GoodsProduct',
  DELETE_GOODS_PRODUCT:   '/DeleteGoodsProduct',

  BOOKINGS:        '/Bookings',
  BOOKINGS_CODE:   '/BookingsCode',
  DELETE_BOOKINGS: '/DeleteBookings',

  AHAOLD_CLIENTS:                 '/AhaOldClients',
  AHAOLD_GOODS:                   '/AhaOldGoods',
  AHAOLD_SALES:                   '/AhaOldSales',
  AHAOLD_MASTER:                  '/AhaOldMaster',
  AHAOLD_CODE_DELTE_AND_CONTINUE: '/AhaOldCodeDeleteAndContinue',
  CLIENTS:                        '/Clients',
  GOODS:                          '/Goods',

  NOTES:   '/Notes',
  HISTORY: '/History',

  // Staffs
  STAFF_COUNT: '/StaffCount',

  // Goods Aggregate
  DELETE_GOODS_BY_SHOP_ID: '/DeleteGoodsByShopId',

  // Goods , Sales, Clients, Staffs
  TOTAL_COUNT: '/TotalCount',

  // Sales, Clients. Staffs
  DELETE_MISC_CODES_BY_SHOP_ID: '/DeleteMiscCodesByShopId',
}

export const COOKIE_ACTION = {
  GET:    1,
  SET:    2,
  REMOVE: 3,
  EXIST:  4,
}

export const STATUS = {
  ALL:      0,
  ACTIVE:   1,
  INACTIVE: 2,
}
export const IS_ADMIN_ONLY = {
  FALSE: false,
  TRUE:  true,
}
export const PAGINATION = {
  ZERO:    0,
  DEFAULT: 10,
  MAX:     100,
}

export const FORM_ACTIONS = {
  ADD:    1,
  EDIT:   2,
  DELETE: 3,
  PRINT:  4,
}

export const STANDARD_DATE_FORMAT = {
  DMY:    'DD-MM-YYYY',
  DMYH:   'DD-MM-YYYY HH:mm',
  YMD:    'YYYY-MM-DD',
  YMDHMS: 'YYYY-MM-DD A HH:mm:ss',
  UTC:    'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MD:     'MMDD',
  HM:     'HH:mm',
}

export const TABLE_DRAG = {
  ON:  true,
  OFF: false,
}

export const TABLE_TYPE = {
  BUSINESS_TYPE:            'BusinessType',
  SERVICE_TYPE:             'ServiceType',
  MISC_COMMON_CODE:         'MiscCommonCode',
  MISC_SHOP_RATING:         'MiscShopRating',
  MISC_CID:                 'MiscCID',
  MISC_VAN:                 'MiscVAN',
  MISC_VAN_MODEL:           'MiscVANModel',
  MISC_BANK_ACCOUNT:        'MiscBankAccount',
  MISC_PAYMENT_METHOD:      'MiscPaymentMethod',
  MISC_SALES_ITEM_TYPE:     'MiscSalesItemType',
  MISC_MY_MESSAGE_CATEGORY: 'MiscMyMessageCategory',
  MANUAL_MANAGEMENT:        'ManualManagement',
  MISC_MIGRATION_SOURCE:    'MiscMigrationSource',
  MISC_MIGRATION_DATA_TYPE: 'MiscMigrationDataType',
}

export const VIEW_MODEL_TYPE = {
  ADMIN_MASTER:         'AdminMaster',
  VALID_PASSWORD:       'ValidPassword',
  SHOP_ADMIN_USER_ADD:  'ShopAdminUserAdd',
  SHOP_ADMIN_USER_EDIT: 'ShopAdminUserEdit',
}

export const DROPDOWN_LIST_TYPE = {
  // solutions
  COUNTRY:                   'CT',
  SERVICE_TYPE:              'SV',
  BUSINESS_TYPE:             'BS',
  COUNTRY_SERVICE_TYPE:      'CSV',
  COUNTRY_BUSINESS_TYPE:     'CBS',
  COUNTRY_SOLUTION:          'CSO',
  COUNTRY_ALL_SERVICE_TYPE:  'CASV',
  COUNTRY_ALL_BUSINESS_TYPE: 'CABS',

  // shops
  SHOP_RATING:         10,
  EXTRA_FEE:           20,
  REFERRAL_SOURCE:     21,
  CONTRACT_TYPE:       22,
  CONSULT_TYPE:        23,
  MIGRATION_SOURCE:    24,
  MIGRATION_DATA_TYPE: 25,
  CID:                 30,
  VAN:                 31,
  VAN_MODEL:           32,

  // AdminSales
  PAYMENT_METHOD:  1,
  BANK_ACCOUNT:    2,
  SALES_ITEM_TYPE: 3,
}

export const SHOP_STATUS = {
  CREATING:              0,
  UNDER_SUBSCRIPTION:    1,
  ACTIVE:                2,
  SUSPENDED:             3,
  MANUALLY_UNSUBSCRIBED: 4,
  DELETED:               5,
  AUTO_UNSUBSCRIBED:     6,
}

export const EMAIL_TYPE = {
  NAVER:   'naver.com',
  GMAIL:   'gmail.com',
  HANMAIL: 'hanmail.net',
  KAKAO:   'kakao.com',
  DAUM:    'daum.net',
  ICLOUD:  'icloud.com',
  NATE:    'nate.com',
  YAHOO:   'yahoo.com',
  HOTMAIL: 'hotmail.com',
  OUTLOOK: 'outlook.com',
}

export const EDUCATION_STATUS = {
  REQUIRED:     1,
  NOT_REQUIRED: 2,
  COMPLETED:    3,
}

export const EDUCATION_DETAIL_STATUS = {
  BEFORE_PROGRESS: 1,
  HOLDING:         2,
  COMPLETED:       3,
}

export const EDUCATION_HISTORY_SEARCH = {
  ALL:            0,
  SHOP_NUMBER:    1,
  SHOP_NAME:      2,
  EDUCATION_NOTE: 3,
}

export const SHOP_TAB_TYPE = {
  SHOP_INFO:            0,
  PAYMENT_INFO:         1,
  SHOP_ENVIRONMENT:     2,
  TAX_INVOICE_INFO:     3,
  MANAGER_CONSULT:      4,
  EDUCATION_MANAGEMENT: 5,
  DATA_MANAGEMENT:      6,
}

export const SEARCH_PURPOSE_TYPE = {
  SCREEN:        1,
  MESSAGE:       2,
  POPUP:         3,
  SYSTEM_BANNER: 4,
}

export const COMMON_CODE_TAB_TYPE = {
  COUNTRY:       0,
  BUSINESS_TYPE: 1,
}

export const TAX_INVOICE_REQUEST = {
  REQUIRED:     1,
  NOT_REQUIRED: 2,
  NOT_SELETED:  3,
}

export const ISSUE_BASE_ON_TYPE = {
  INPUT_BASE: 1,
  SALES_BASE: 2,
}

export const ORIGIN_DATA_TYPE = {
  SHOP_NAME: 1,
  ADDRESS:   2,
  EMAIL:     3,
}

export const REVIEW_POSTED = {
  POSTED:     true,
  NOT_POSTED: false,
}

export const AUTO_TRANSFER_ARS_STATUS = {
  NONE:                   1,
  ACCEPTING:              2,
  VERIFICATION_COMPLETED: 3,
  VERIFICATION_FAILURE:   4,
}

export const CONTRACT_DISCOUNT_TYPE = {
  NONE:              1,
  MONTHLY_DISCOUNT:  2,
  ONE_TIME_DISCOUNT: 3,
}

export const BILLING_TYPE = {
  EACH:         1,
  CONSOLIDATED: 2,
  DEPENDING:    3,
}

export const TERM_OF_CONTRACT = {
  MONTH_0:  0,
  MONTH_12: 12,
  MONTH_24: 24,
  MONTH_36: 36,
}

export const WAIVED_MONTHLY_FEE = {
  WAIVED:     1,
  NOT_WAIVED: 2,
}

export const INCLUDE_EXTRA_AMOUNT_OF_DEPENDENTS = {
  TRUE:  true,
  FALSE: false,
}

export const SHOP_ENVIRONMENT_UPDATE_TYPE = {
  REVIEW: 1,
  CID:    2,
  VAN:    3,
}

export const FEE_TRUNCATE = {
  10000: 10000,
  1000:  1000,
  100:   100,
  10:    10,
  1:     1,
  0.1:   0.1,
  0.01:  0.01,
}

export const SHOW_ITEM = {
  SHOW_10: 10,
  SHOW_20: 20,
  SHOW_30: 30,
  SHOW_50: 50,
}

export const AUTO_TRANSFER_TYPE = {
  ALL:      null,
  AUTO:     true,
  NOT_AUTO: false,
}

export const SEARCH_SHOP_INFO_TYPE = {
  MEMO:                  1,
  BUSINESS_ADDRESS:      2,
  ADDRESS:               3,
  ADDRESS_FORWARD_MATCH: 4,
}

export const SEARCH_SHOP_RADIO_TYPE = {
  SHOP:            1,
  PHONE:           2,
  ID:              3,
  OWNER_NAME:      5,
  BUSINESS_NUMBER: 6,
}

export const SEARCH_SHOP_TAB = {
  SUBSCRIBER:                     0,
  SUBSCRIBER_STATUS_AND_DATE:     1,
  SOLUTION_INFORMATION:           2,
  CHAIN_RESELLER:                 3,
  PAYMENT_INFORMATION:            4,
  CONTACT_DISCOUNT_INFORMATION:   5,
  ADDITIONAL_SERVICE_INFORMATION: 6,
  ETC:                            7,
}

export const SEARCH_SHOP_NO_SELECTION_TYPE = -1

export const ADMINS_ENUMS = {
  ALL:      999,
  SUM_TYPE: {
    BY_DATE:  1,
    BY_MONTH: 2,
  },
  REPORT_TAB_TYPE: {
    PERIOD:      0,
    MONTHLY_FEE: 1,
    SOLUTION:    2,
  },
  ORDER_BY_TYPE: {
    FEE:         1,
    SUBSCRIBERS: 2,
  },
  AUTO_TRANSFER_ARS_PROCESSING_STATUS: {
    WAITING:   1,
    COMPLETED: 2,
  },
  SEARCH_AUTO_TRANSFER_ARS_STATUS: {
    ACCEPTING_AND_VERIFICATION_FAILURE: 1,
    ALL:                                2,
    ACCEPTING:                          3,
    VERIFICATION_COMPLETED:             4,
    VERIFICATION_FAILURE:               5,
  },
  BILLING_SEARCH_TYPE: {
    CHAIN:    1,
    RESELLER: 2,
  },
}

export const SHOPS_ENUMS = {
  SHOP_JOIN_PATH_TYPE: {
    HOMEPAGE: 1,
    ADMIN:    2,
  },
  BOARD_TYPE: {
    SHARE_ALL_BRANCH:   1,
    HEAD_TO_ONE_BRANCH: 2,
    NO_BOARD:           3,
  },
  BRANCH_TYPE: {
    HEADQUATER: 1,
    BRANCH:     2,
    EACH:       0,
  },
  CHAIN_SHARE_TYPE: {
    SHARE_CLIENT:                   110,
    SHARE_SERVICE:                  210,
    // SHARE_PREPAID_SERVICE: 220,
    // SHARE_PREPAID_CARD: 230,
    SHARE_PRODUCT:                  240,
    USE_OTHER_SHOP_PREPAID_CARD:    310,
    USE_OTHER_SHOP_PREPAID_SERVICE: 320,
    //USE_OTHER_SHOP_PREPAID_CARD: 320,
    ALLOW_SHOP_SERVICE:             410,
    // ALLOW_SHOP_PREPAID_SERVICE: 420,
    // ALLOW_SHOP_PREPAID_CARD: 430,
    ALLOW_SHOP_PRODUCT:             440,
  },
  RESELLER_TYPE: {
    NONE:     0,
    COMPANY:  1,
    PERSONAL: 2,
  },
}

export const MISC_CODE_TYPE = {
  //Admins
  SHOP_RATING:         10,
  EXTRA_FEE:           20,
  REFERRAL_SOURCE:     21,
  CONTRACT_TYPE:       22,
  CONSULT_TYPE:        23,
  MIGRATION_SOURCE:    24,
  MIGRATION_DATA_TYPE: 25,

  CID:             30,
  VAN:             31,
  VAN_MODEL:       32,
  //AdminSales
  PAYMENT_METHOD:  1,
  BANK_ACCOUNT:    2,
  SALES_ITEM_TYPE: 3,

  //Messages
  TEXT_FEE:            401,
  TEXT_SAMPLE:         402,
  MY_MESSAGE_CATEGORY: 403,
}

export const CUSTOM_USER_ROLE_TYPE = {
  ADIN_USER_ROLE: 1,
}

export const FROM_CONSULT_ACTION_TYPE= {
  FROM_MANAGER_CONSULT:       1,
  FROM_CONSULT_HISTORY:       2,
  FROM_CID_RECEIVING_HISTORY: 3,
}

export const CONSULT_SOURCE_TYPE={
  MANUAL: 1,
  CID:    2,
}
export const SEARCH_DATE_RANGE_TYPE = {
  REGISTRATION_DATE: 1,
  EXPIRY_DATE:       2,
}

export const IDENTITIES_ENUMS = {
  ACCESS_BLOCK_REASON_TYPE: {
    WRONG_PASSWORD: 1,
  },
}

export const IDENTITES_USER_ROLE_CODE = {
  USER_ROLE_CODE: {
    ADMIN_STAFF: 'ADMSTAFF',
  },
}

export const ADMIN_SALES_ENUMS = {
  ADMIN_SALES_SOURCE_TYPE: {
    MANUAL: 1,
    ONLINE: 2,
    CMS:    3,
  },
  ADMIN_SALES_LINK_TYPE: {
    NOTHING:        0,
    NETMONEY:       1,
    SERVICE_PERIOD: 2,
  },
  SALES_DATE_SEARCH_TYPE: {
    SALES_DATE:   1,
    PAYMENT_DATE: 2,
  },
  SALES_TAX_SEARCH_ORDERBY_TYPE: {
    DATE: 1,
    SHOP: 2,
  },
  SALES_ITEM_TYPE_CODE: {
    NETMONEY:       'N',
    SERVICE_PERIOD: 'BF',
  },
  PAMENT_METHOD_CODE: {
    BANK_TRANSFER: 'BT',
  },
  BASE_FEE_LINK_TYPE: {
    NONE:             0,
    USE_NET_MONEY:    1,
    RESELLER_RECEIPT: 2,
    ETC:              3,
  },
  BASE_FEE_SOURCE_TYPE: {
    MANUAL:      1,
    ADMIN_SALES: 2,
    NET_MONEY:   3,
  },
  BASE_FEE_EXTEND_VALUE_TYPE: {
    MONTHS: 1,
    DAYS:   2,
  },
  NETMONEY_SOURCE_TYPE: {
    MANUAL:      1,
    ADMIN_SALES: 2,
    BASE_FEE:    3,
    TEXT_SEND:   4,
    TEXT_REFUND: 5,
  },
  BANK_TRANSFER_NOTICE_STATUS: {
    ALL:         -1,
    UNPROCESSED: 0,
    DEPOSIT:     30,
    SEND_TEXT:   32,
  },
  BANK_TRANSFER_NOTICE_LINK_TYPE: {
    NETMONEY:           1,
    BASEFEE:            2,
    BASEFEEANDNETMONEY: 3,
  },
  ONLIEN_PAYMENT_MEHTOD: {
    CREDIT_CARD:                'AC',
    REAL_TIME_ACCOUNT_TRANSFER: 'AA',
    VIRTUAL_ACCOUNT:            'AS',
  },
  ONLIEN_PAYMENT_STATUS: {
    PREPARED:   1,
    INPROGRESS: 2,
    AWAITING:   3,
    PAID:       4,
    FAILED:     5,
    CANCELLED:  6,
  },
  CMS_PAYER_ORDER_BY_TYPE: {
    REG_DATE_DESC:   1,
    SHOP_ID_DESC:    2,
    PAYER_CODE_DESC: 3,
  },
  CMS_BILLING_ORDER_BY_TYPE: {
    BILLING_DATE_DESC: 1,
    SHOP_ID_ASC:       2,
  },
  CMS_PAY_STATUS: {
    PAID:     1,
    NOT_PAID: 2,
    OTHER:    3,
  },
  CMS_PAY_SOURCE_TYPE: {
    CMS_RESULT:  1,
    CMS_BILLING: 2,
    MANUAL:      3,
  },
  CMS_RESULT_MASTER_DATE_SEARCH_TYPE: {
    REGISTRATION_DATE: 1,
    BILLING_DATE:      2,
  },
  CMS_RESULT_SEARCH_PAY_RESULT_TYPE: {
    WITHDRAWL: 1,
    FAIL:      2,
  },
  CMS_RESULT_SEARCH_PAY_PROCESS_RESULT_TYPE: {
    SUCCESS:      1,
    FAIL:         2,
    UN_PROCESSED: 3,
  },
  PAY_MANUAL_CMS_BILLING_STATUS: {
    PAID:     1,
    NOT_PAID: 2,
    OTHER:    3,
    NONE:     4,
  },
  CMS_PAY_PROCESS_RESULT_TYPE: {
    SUCCESS:                    1,
    NOT_EXISTS:                 -1,
    PROCESSED_ALREADY:          -10,
    NOT_SAME_CMS_OUTSTANDING:   -31,
    NOT_SAME_SALES_OUTSTANDING: -41,
    DB_ERROR:                   -3,
  },
  CMS_PAY_TARGET_TYPE: {
    CMS_THISMONTH:     1,
    CMS_OUTSTANDING:   2,
    SALES_OUTSTANDING: 3,
  },
  OUTSTANDING_TYPE: {
    ADMIN_SALES: 1,
    CMS_BILLING: 2,
  },
  RESELLER_SETTLMENT_TYPE: {
    SERVICE_HISTORY: 1,
    SALES_HISTORY:   2,
  },
}

export const MESSAGES_ENUMS = {
  TEXT_SAMPLE_GROUP_TYPE: {
    AREA:          1,
    BUSINESS_TYPE: 2,
  },
  MESSAGE_TYPE: {
    SMS: 1,
    LMS: 2,
    MMS: 3,
    KAO: 4,
  },
  MESSAGE_SOURCE_TYPE: {
    NONE:              0,
    BOOKINGS:          1,
    SALES:             2,
    CLIENT:            3,
    G_ORDER_BY_BRANCH: 4,
    LOGIN:             5,
    INTEGRATION_ADMIN: 6,
  },
  SEND_TYPE: {
    MANUAL: 1,
    AUTO:   2,
    BATCH:  3,
  },
  MESSAGE_STATUS: {
    NOT_SENT:       0,
    SEND_FAIL:      1,
    WAITING_RESULT: 2,
    RESULT_FAIL:    3,
    RESULT_SUCCESS: 4,
  },
  MESSAGE_STATISTIC_MONTH_TYPE: {
    MONTH:          1,
    PREVIOUS_MONTH: 2,
    NEXT_MONTH:     3,
  },
  HELP_SEND_TEXT: {
    CHARACTER:  1,
    EMOTICON:   2,
    MY_MESSAGE: 3,
    SAMPLE:     4,
    SETTING:    5,
  },
  SEND_PAGE: {
    PAGE:                 1,
    MODAL:                2,
    MULTI:                3,
    BANK_TRANSFER_NOTICE: 4,
  },
  MMS_TYPE: {
    TEXT:  1,
    IMAGE: 2,
  },
  SENDER_PHONE_CERTIFICATION_TYPE: {
    NONE:         1,
    MOBILE_PHONE: 2,
    ARS:          3,
    DOCUMENT:     4,
  },
  SENDER_PHONE_CERTIFICATION_STATUS: {
    APPROVED:  0,
    REQUESTED: 1,
    REJECTED:  2,
  },
  SENDER_PHONE_CERTIFICATION_SEND_TYPE: {
    NONE:  0,
    FILE:  1,
    FAX:   2,
    EMAIL: 3,
  },
  PROCESSING_STATUS: {
    REQUEST:    1,
    REFUSED:    2,
    NOTREFUSED: 3,
  },
  RECEIVER_TYPE: {
    SHOP:   1,
    CLIENT: 2,
  },
  MESSAGE_MISSING_TYPE: {
    SEND_MISSING:   1,
    RESULT_MISSING: 2,
  },
  DELETED_STATUS: {
    NONE:    0,
    DELETED: 1,
  },
  SEND_MESSAGE_AGGR_CAll_STATUS: {
    NONE:                   0,
    SEND_RESULT_FAIL:       11,
    SEND_RESULT_SUCCESS:    12,
    RECEIVE_RESULT_FAIL:    21,
    RECEIVE_RESULT_SUCCESS: 22,
  },
  MESSAGE_SOLUTION_TYPE: {
    MESSAGE_HUB:   'MessageHub',
    SEND_MESSAGES: 'SendMessages',
  },
  SAMPLE_TYPE: {
    TEXT_MESSAGE: 1,
    ALIMTALK:     2,
  },
}

export const MESSAGEAUTOS_ENUMS = {
  MESSAGE_SETUP_ADMIN_TYPE: {
    JOIN:      1,
    NOT_VISIT: 2,
    EXPIRY:    3,
  },
}

export const BOARDS_ENUMS = {
  POPUP_PREVIEW:    'popup-preview',
  BOARD_GROUP_TYPE: {
    NOTICE: 1,
    BOARD:  2,
  },
  SEARCH_BOARD_TYPE: {
    TITLE:  1,
    WRITER: 2,
  },
  LINK_TARGET: {
    PARENT: 1,
    NEW:    2,
  },
  NEVER_SEE_PERIOD: {
    DAY:  1,
    WEEK: 2,
    NO:   3,
  },
  NEVER_SEE_PERIOD_USE: {
    PROVIDED:     1,
    NOT_PROVIDED: 2,
  },
  MANUAL_TYPE: {
    BASIC:       1,
    APPLICATION: 2,
    VIDEO:       3,
  },
  BRANCH_BOARD_TYPE: {
    NONE:               0,
    HEAD_TO_ONE_BRANCH: 1,
    SHARE_ALL:          2,
  },
  HQ_NOTICE_OPTION_TYPE: {
    NONE:   1,
    CREATE: 0,
  },
  POPUP_TYPE: {
    SYSTEM: 1,
    CAHIN:  2,
  },
  POPUP_FILE_ACTION_TYPE: {
    NONE:   0,
    ADD:    1,
    DELETE: 2,
  },
  BOARD_CODE: {
    SYSBOARD:      'SYSBOARD',
    SYSNOTICE:     'SYSNOTICE',
    POPUP:         'POPUp',
    SYSTEM_BANNER: 'SystemBanner',
  },
  // Banner API constants
  BANNER_API: {
    // Applicable codes for banner target
    APPLICABLE_CODES: {
      BRANCH: 1,
      HQ:     2,
    },

    // Status values
    STATUS: {
      ACTIVE: 1,
    },

    // Link target values
    LINK_TARGET: {
      DEFAULT: 1,
    },

    // Banner type values
    BANNER_TYPE: {
      DEFAULT: 1,
    },

    // Default values
    DEFAULTS: {
      COUNTRY_CODE: 'KR',
      CHAIN_ID:     0,
      PAGE_SIZE:    10,
      PAGE_NUMBER:  1,
      SHOP_ID:      600002,
    },

    // String literals for code comparison
    CODE_STRINGS: {
      BRANCH: 'BRANCH',
      HEAD:   'HEAD',
      HQ:     'HQ',
    },

    // Display values
    DISPLAY: {
      ALL_APPLICABLE:     'ALL',
      BOTH_CODES_COUNT:   2,
      EMPTY_ARRAY_LENGTH: 0,
    },
  },
  PROCESSING_TYPE: {
    ALL:         0,
    NONE:        1,
    UNPROCESSED: 2,
    PROCESSED:   3,
  },
  RECEIVER_TYPE: {
    ADMIN: 1,
  },

}

export const HOMEPAGES_ENUMS={
  JOIN_CONSULT_STATUS: {
    BEFORE_CONSULT: 0,
    CONSULTING:     1,
    JOIN_NOT:       2,
    JOIN_PENDING:   3,
    JOIN_FINISH:    4,
  },
  JOIN_CONSULT_SEARCH_TYPE: {
    NONE:           0,
    CONTACT_NUMBER: 1,
    SHOP_NAME:      2,
    ASK_NOTES:      3,
    MANAGER_NOTES:  4,
  },
  JOIN_CONSULT_TYPE: {
    NONE:      -1,
    INQUIRY:   0,
    FREETRIAL: 1,
  },
  RECEIVER_MOBILE_IR_RECEIVE_TYPE: {
    YES: true,
    NO:  false,
  },
  RECEIVER_MOBILE_PATH_TYPE: {
    NONE:                  0,
    JOIN_CONSULT:          1,
    JOIN:                  2,
    JOIN_CONSULT_AND_JOIN: 3,
  },
}

export const CLIENTS_ENUMS={
  ALLOWED_MESSAGE_TYPE: {
    ALLOW_MESSAGE: 1,
    NOT_MARKETING: 2,
    NOT_MESSAGE:   3,
  },
  SEX: {
    NONE_INPUT: 0,
    MALE:       1,
    FEMALE:     2,
    NONE:       3,
  },
  MEMBER_TYPE: {
    MEMBER:     1,
    NON_MEMBER: 2,
  },
}

export const SIGNALR_ENUMS={
  SIGNALR_TYPE: {
    BOARDS:      1,
    ADMIN_SALES: 2,
  },
}

export const COUNTRY = {
  KR: 'KR',
  CN: 'CN',
  VN: 'VN',
}

export const MIGRATIONS_ENUMS = {
  MIGRATION_TYPE: {
    CLIENTS:             1,
    DELETE_GOODS:        2,
    // SERVICE              : 3,
    // PRODUCT              : 4,
    // PREPAID_CARD         : 5,
    // PREPAID_CARD_HAVE    : 6,
    // PREPAID_SERVICE_HAVE : 7
    SALES:               3,
    PREPAID_CARDS:       4,
    PREPAID_SERVICES:    5,
    SVC_SERVICES:        6,
    GOODS_PREPAID_CARDS: 7,
    GOODS_PRODUCTS:      8,
    BOOKINGS:            9,
    // AHAOLD_CLIENTS       : 10,
    // AHAOLD_GOODS         : 7,
    // AHAOLD_SALES         : 8,
    // AHAOLD               : 9,

    AHAOLD_CLIENTS: 17,
    AHAOLD_GOODS:   18,
    AHAOLD_SALES:   19,
    AHAOLD:         10,
  },
  MIGRATION_STATE: {
    NONE:        0,
    PROGRESSING: 1,
    DONE:        2,
  },
  MIGRATION_STATE_ACTION: {
    CREATE:          1,
    DELETE:          2,
    DELETE_CONTINUE: 3,
  },
  AHAOLD_MIGRATION_TYPE: {
    CLIENTS:         10,
    GOODS:           20,
    SALES:           40,
    PREPAIDHOLDINGS: 50,
  },
  AHAOLD_SAVE_TYPE: {
    SINGLE: 1,
    MULTI:  2,
  },
  AHAOLD_COUNT_MIGRATION_TYPE: {
    CLIENTS:         10,
    GOODS:           20,
    SALES:           40,
    PREPAIDHOLDINGS: 50,
  },
  AHAOLD_USE_FLAG_TYPE: {
    INACTIVE: 0,
    ACTIVE:   1,
  },
  AHAOLD_IS_CEO_TYPE: {
    ISNOTCEO: 0,
    ISCEO:    1,
  },
  AHAOLD_SAVE_STEP: {
    NONE:                    0,
    SAVE:                    1,
    VALIDATGE_KEY:           2,
    VALIDATE_DATA:           3,
    MATCH_EXISTING_CODES:    4,
    CREATE_MIGRATION_DETAIL: 5,
  },
  AHAOLD_TABLE_NAME: {
    CUSTINFO:      105,
    CUSTGRP:       106,
    CUSTGRPMEMBER: 107,
    CUGUBUN:       101,
    CUGRADE:       102,
    CUSTVISTIPATH: 103,
    HDINFO:        104,
    CUSTINTRO:     108,
    GCATEGO:       'gcateGo',
    GOODSINFO:     'goodsInfo',
    SCLASS:        'sclass',
    SVCINFO:       'svcInfo',
    CTICKET:       'cticket',
    SALESINFO:     'salesInfo',
    CUSTMISUMODI:  'custMisuModi',
    PAYMENT:       'payment',
    SALESTYPE:     'salesType',
    DISCOUNT:      'discount',
    CUSTCTICKET:   'custcTicket',
    PREPAYCNT:     'prepayCnt',
    FITM:          'fitM',
  },
  AHAOLD_CONVERT_ENV_TYPE: {
    REAL:   1,
    BACKUP: 2,
  },
  MIGRATION_STATUS_SEARCH_TYPE: {
    ALL:             0,
    BEFORE_PROGRESS: 1,
    PROGRESSING:     2,
    FINISH:          3,
    FAIL:            4,
    STOP:            5,
  },
  CANCEL_SEARCH_TYPE: {
    ALL:        null,
    CANCEL:     true,
    NOT_CANCEL: false,
  },
  DELETE_TEMP_DATA_SEARCH_TYPE: {
    ALL:         null,
    DELETED:     true,
    NOT_DELETED: false,
  },
  MIGRATION_DETAIL_TYPE: {
    NONE:                      0,
    CLIENTS:                   11,
    CLIENT_STAFFS:             12,
    CLIENT_RATINGS:            13,
    CLIENT_GROUPS:             14,
    CLIENT_SALES:              15,
    CLIENT_REFERRAL_SOURCES:   16,
    SALES:                     21,
    SALES_SERVICE_CATEGORIES:  22,
    SALES_SERVICES:            23,
    SALES_PRODUCT_CATEGORIES:  24,
    SALES_PRODUCTS:            25,
    SALES_PAYMENTS:            26,
    SALES_TYPES:               27,
    SALES_STAFFS:              28,
    PREPAID_CARDS:             31,
    PRECRD_PREPAIDCARDS:       32,
    PREPAID_SERVICES:          41,
    PRESVC_SERVICE_CATEGORIES: 42,
    PRESVC_SERVICES:           43,
    PRESVC_PREPAID_SERVICES:   44,
    SVC_SERVICES:              51,
    SVC_SERVICE_CATEGORIES:    52,
    SVC_PREPAID_SERVICES:      53,
    GOODS_PREPAIDCARD_CODES:   61,
    GOODS_PRODUCTS:            71,
    GOODS_PRODUCT_CATEGORIES:  72,
    BOOKINGS:                  81,
    BOOKING_RESOURCES:         82,

    AO_CLIENTS:            105,
    AO_CLIENTS_SALES:      109,
    AO_FAMILIES:           106,
    AO_FAMILYMEMBERS:      107,
    AO_CLIENTGROUPS:       101,
    AO_CLIENTRATINGS:      102,
    AO_CLIENTVISITPATHS:   103,
    AO_STAFFS:             104,
    AO_RECOMMENDERS:       108,
    AO_SERVICE_CATEGORIES: 121,
    AO_SERVICES:           122,
    AO_PREPAID_SERVICES:   123,
    AO_PREPAID_CARDS:      124,
    AO_PRODUCT_CATEGORIES: 125,
    AO_PRODUCTS:           126,
    AO_PACKAGES:           127,

    AO_SALESTYPES:            131,
    AO_PAYMENTMETHODS:        132,
    AO_DISCOUNT_CATEGORIES:   133,
    AO_SALES:                 141,
    AO_SALES_ITEMS:           142,
    AO_OUTSTANDING_HISTORIES: 143,
    AO_FITMASTER:             144,
    AO_FITDETAIL:             145,

    AO_CLIENTPREPAID_CARDS:         151,
    AO_CLIENTPREPAID_CARDS_HISTORY: 152,

    AO_CLIENTPREPAID_SERVICE_HISTORY: 153,
    AO_CLIENTPREPAID_SERVICE:         154,

    AO_BOOKING_RESOURCES: 161,
    AO_BOOKINGS:          162,
  },
  CLIENT_MATCHING_TYPE: {
    CLIENT_NUMBER:                 1,
    CLIENT_NUMBER_AND_CLIENT_NAME: 2,
    CLIENT_NAME_AND_MOBILE:        3,
    CLIENT_NAME:                   4,
  },
  EXTRACTED_CODE_INACTIVE: {
    PRODUCT:          1,
    PRODUCT_CATEGORY: 10,
    SERVICE:          2,
    SERVICE_CATEGORY: 20,
    PREPAID_SERVICE:  3,
    PREPAID_CARD:     4,
    PAYMENT_METHOD:   5,
    SALES_TYPE:       6,
    STAFF:            7,
  },
  SALES_OVER_BASE: {
    PRODUCT:          5000,
    PRODUCT_CATEGORY: 300,
    SERVICE:          3000,
    SERVICE_CATEGORY: 300,
    PREPAID_CARD:     3000,
    PAYMENT_METHOD:   4,
    SALES_TYPE:       300,
    STAFF:            3000,

    PRE_CRD_PREPAID_CARD: 3000,

    PRE_SVC_SERVICE:          3000,
    PRE_SVC_SERVICE_CATEGORY: 300,
    PRE_SVC_PREPAID_SERVICE:  3000,
  },
  CLIENT_MATCH_STATUS: {
    ALL:         0,
    MATCHED:     1,
    NOT_MATCHED: 2,
  },
  EXCEPT_STATUS: {
    ALL:        0,
    EXCEPT:     1,
    NOT_EXCEPT: 2,
  },
  SALES_KIND: {
    PRODUCT:      1,
    SERVICE:      2,
    PREPAID_CARD: 4,
  },
  EXTRACTED_CODE_SEARCH_TYPE: {
    SALES_SERVICE_CATEGORIES:   1,
    SALES_PRODUCT_CATEGORIES:   2,
    SALES_PAYMENTS:             3,
    SALES_TYPES:                4,
    SALES_STAFFS:               5,
    SALES_SERVICES:             6,
    SALES_PRODUCTS:             7,
    PRE_CRD_PREPAID_CARDS:      8,
    PRE_SVC_SERVICES:           9,
    PRE_SVC_SERVICE_CATEGORIES: 10,
    PRE_SVC_PREPAID_SERVICES:   11,
    SVC_SERVICES:               12,
    SVC_SERVICE_CATEGORIES:     13,
    SVC_PREPAID_SERVICES:       14,

    GOODS_PRE_CRD_CODES: 15,

    GOODS_PRODUCTS:           16,
    GOODS_PRODUCT_CATEGORIES: 17,

    BOOKINGS:           18,
    BOOKINGS_RESOURCES: 19,

    CLIENT_STAFFS:           1,
    CLIENT_RATINGS:          2,
    CLIENT_GROUPS:           3,
    CLIENT_REFERRAL_SOURCES: 4,
  },
  PREPAID_CARD_TYPE: {
    NONE:          0,
    DEPOSIT_CARD:  1,
    DISCOUNT_CARD: 2,
  },
  DISCOUNT_TYPE: {
    AMOUNT: 1,
    RATE:   2,
  },
  VALIDITY_TYPE: {
    MONTHS: 1,
    DAYS:   2,
  },
  BAD_DATA_TYPE: {
    STRINGLENGTHOVER: 2,
    NOTVALIDVALUE:    3,
    NUMBERNEGATIVE:   4,
    NUMBERBELOWMIN:   5,
    NUMBEROVERMAX:    6,
    DATEBELOWMIN:     7,
    DATEOVERMAX:      8,
  },
  CONVERT_STATUS: {
    ALL:                        0,
    BEFORE_CONSULTATION:        1,
    IN_CONSULTATION:            2,
    ON_HOLD:                    3,
    COMPLETE:                   4,
    CANCEL:                     5,
    BEFORE_AND_IN_CONSULTATION: 6,
    RE_TRANSFER:                7,
  },
  SEARCH_TYPE: {
    ALL:    1,
    PERIOD: 2,
  },
  SEARCH_SORTING: {
    REGISTERED: 1,
    SCHEDULED:  2,
    COMPLETED:  3,
    EDUCATION:  4,
  },
  SEARCH_DIRECTION: {
    SEARCH_ASCENDING:  1,
    SEARCH_DESCENDING: 2,
  },
}

export const INTEGRATION_EVENT_STATE_ENUMS = {
  ALL:                null,
  PUBLISHING:         0,
  PUBLISHING_SUCCESS: 1,
  PUBLISHING_FAILED:  2,
  PROCESSING_FAILED:  3,
  PROCESSING_SUCCESS: 4,
  CANCELLED:          5,
}

export const BACKUP_EVENT_ENUM = {
  PROCESSING:         0,
  PROCESSING_FAILED:  1,
  PROCESSING_SUCCESS: 2,
  RESTORING:          3,
  RESTORRING_FAILED:  4,
  RESTORING_SUCCESS:  5,
}

export const INTEGRATION_EVENT_PART_ENUMS = {
  ADMINS_CMD:      1,
  ADMIN_SALES_CMD: 2,
  BOOKINGS_CMD:    3,
  CLIENTS_CMD:     4,
  IDENTITIES_CMD:  5,
  MESSAGES_CMD:    6,
  MIGRATIONS_CMD:  7,
  SALES_CMD:       8,
  STAFFS_CMD:      9,
}

export const INTEGRATION_EVENT_BACKUP_ENUMS = {
  ADMIN_CMD:                1,
  ADMIN_SALES_CMD:          2,
  CLIENT_CMD:               3,
  GOOD_CMD:                 4,
  IDENTITIES_CMD:           5,
  INVENTORY_CMD:            6,
  MESSAGE_AUTO:             7,
  MIGRATION_CMD:            8,
  SALES_CMD:                9,
  SALES_READ_BACKGROUND:    10,
  STAFF_CMD:                11,
  BOOKING_CMD:              12,
  BOOKINGS_READ_BACKGROUND: 13,
  MESSAGE_CMD:              14,
  NAVER:                    15,
}

export const RECEIVED_INTEGRATION_EVENT_PROCESSING_STATE_ENUMS = {
  ALL:                null,
  PROCESSING:         0,
  PROCESSING_FAILED:  1,
  PROCESSING_SUCCESS: 2,
  CANCELLED:          3,
}

export const RECEIVED_INTEGRATION_EVENT_PART_ENUMS = {
  ADMINS_CMD:               1,
  ADMIN_SALES_CMD:          2,
  CLIENTS_CMD:              3,
  GOODS_CMD:                4,
  IDENTITIES_CMD:           5,
  INVENTORY_CMD:            6,
  MESSAGE_AUTOS_CMD:        7,
  MIGRATIONS_CMD:           8,
  SALES_CMD:                9,
  SALES_READ_BACKGROUND:    10,
  STAFFS_CMD:               11,
  BOOKINGS_CMD:             12,
  BOOKINGS_READ_BACKGROUND: 13,
}

export const MAX_DATERANGE_DIFF_IN_YEARS = 50

export const NOTIFICATON_TYPE = {
  NO_DEFINED:                  'NO_DEFINED',
  BANKTRANSFERNOTICES_CREATED: 'BANKTRANSFERNOTICES_CREATED',
  BANKTRANSFERNOTICES_UPDATED: 'BANKTRANSFERNOTICES_UPDATED',
  BANKTRANSFERNOTICES_DELETED: 'BANKTRANSFERNOTICES_DELETED',
  BOARDS_CREATED:              'BOARDS_CREATED',
  BOARDS_DELETED:              'BOARDS_DELETED',
  SYSTEM_NEW_VERSION:          'SYSTEM_NEW_VERSION',
  SYSTEM_MAINTAIN_MODE:        'SYSTEM_MAINTAIN_MODE',
}

export const SESSION_KEY = {
  APP_VERSION: 'app_version',
}

export const APP_API_STATUS = {
  SERVER_MAINTENANCE:  503,
  SERVICE_MAINTENANCE: 403,
}

export const ERROR_CODES = {
  GD08A:  'GD08A',
  MMT12C: 'MMT12C',
  MSA22C: 'MSA22C',
  MPS07C: 'MPS07C',
  MPC06C: 'MPC06C',
}

export const EXTERNAL_SYSTEM_CODES = {
  NONE:  0,
  NAVER: 1,
}
export const EXTERNAL_SYSTEM_STATE = {
  DISCONNECTED: 0,
  CONNECTED:    1,
}

export const LANGUAGE = {
  KOREAN:  'ko',
  ENGLISH: 'en',
}

export const FUNCTION_TYPE = {
  ALL:               -1,
  BOOK:              0,
  BOOK_SERVICE_ITEM: 1,
  CRM:               2,
  MESSAGE:           3,
  REPORT:            4,
}

export const AI_MODEL_OPTIONS = [
  { value: 0, text: 'GPT-4o-mini' },
  { value: 1, text: 'GPT-3.5-turbo' },
]
