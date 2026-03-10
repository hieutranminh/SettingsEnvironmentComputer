export const USER_ROLES = {
  CHAIN_HEAD:   'chain-head',
  // CHAIN_HEAD: 'MASTER',
  CHAIN_SHOP:   'chain-shop',
  SINGLE_SHOP:  'single-shop',
  ADMIN_MASTER: 'ADMMASTER',
  ADMIN_STAFF:  'ADMSTAFF',
  MASTER:       'MASTER',
  STAFF:        'STAFF',
  MANAGER:      'MANAGER',
}

export const PERMISSION = {
  GOODS: 'goods',
}

export const SERVICE_TYPES = {
  CLIENT_AGGR:       5000,
  STAFF_AGGR:        5001,
  USER_ACCOUNT_AGGR: 5500,
  GOODS_AGGR:        5501,
  AUTH_AGGR:         5502,
  MESSAGE_AGGR:      5503,
  STAFFS_AGGR:       5504,

  // Goods
  PRODUCT_READ:            1,
  PRODUCT_CMD:             2,
  PRODUCT_CATEGORY_READ:   3,
  PRODUCT_CATEGORY_CMD:    4,
  PREPAID_CARD_READ:       5,
  PREPAID_CARD_CMD:        6,
  SERVICE_READ:            7,
  SERVICE_CMD:             8,
  PACKAGE_READ:            9,
  PACKAGE_CMD:             10,
  SERVICE_CATEGORY_READ:   12,
  SERVICE_CATEGORY_CMD:    13 ,
  PREPAID_SERVICE_READ:    14,
  PREPAID_SERVICE_CMD:     15 ,
  PACKAGE_ITEM_READ:       16 ,
  PACKAGE_ITEM_CMD:        17 ,
  PRODUCT_CODE_SETUP_READ: 18,
  PRODUCT_CODE_SETUP_CMD:  19,

  //Clients
  CLIENTS: {
    CLIENT_CODESETUP_READ:           3001,
    CLIENT_CODESETUP_CMD:            3002,
    CLIENT_READ:                     3003,
    CLIENT_CMD:                      3004,
    CLIENT_FIELD_SETUP_READ:         3005,
    CLIENT_FIELD_SETUP_CMD:          3006,
    CLIENT_ENVIRONMENT_SETUP_READ:   3007,
    CLIENT_ENVIRONMENT_SETUP_CMD:    3008,
    RECOMMENDATION_POINT_SETUP_READ: 3009,
    RECOMMENDATION_POINT_SETUP_CMD:  3010,
    FAMILY_READ:                     3011,
    FAMILY_CMD:                      3012,
    CID_RECEIVING_HISTORY_READ:      3013,
    CID_RECEIVING_HISTORY_CMD:       3014,
    CLIENT_IMAGE_CMD:                3015,
    CLIENT_SALES_IMAGE_READ:         3016,
    CLIENT_SALES_IMAGE_CMD:          3017,

    CLEINT_PRIVACY_LOG_CMD: 3019,
  },

  // Bookings
  BOOKINGS_OPENING_HOURS_SETUP_READ: 21,
  BOOKINGS_OPENING_HOURS_SETUP_CMD:  22,

  BOOKINGS_RESOURCES_SETUP_READ: 23,
  BOOKINGS_RESOURCES_SETUP_CMD:  24,

  BOOKINGS_CALENDAR_SETUP_READ: 25,
  BOOKINGS_CALENDAR_SETUP_CMD:  26,

  BOOKINGS_ITEMS_SETUP_READ: 27,
  BOOKINGS_ITEMS_SETUP_CMD:  28,
  BOOKINGS_ITEM_SETUP_CMD:   29,

  BOOKINGS_ONLINE_BOOKING_SETUP_READ: 30,
  BOOKINGS_ONLINE_BOOKING_SETUP_CMD:  31,

  BOOKING_DEPOSIT_SETUP_READ: 32,
  BOOKING_DEPOSIT_SETUP_CMD:  33,

  BOOKING_READ: 34,
  BOOKING_CMD:  35,
  BOOKING_AGG:  6200,

  // Naver Link
  BOOKING_RESOURCES_SETUP_NAVER_LINK:    9000,
  BOOKING_UPCOMING_BOOKINGS_OF_RESOURCE: 9001,
  BOOKING_RESOURCE_NAVER_LINK:           9002,

  BLOCKED_TIME_READ: 36,
  BLOCKED_TIME_CMD:  37,

  //waiting
  WAITING_READ:           38,
  WAITING_CMD:            39,
  BKG_TASKS_BOOKING_READ: 40,

  // Goods
  SERVICE_CMD_AGG: 41,

  // Booking Report
  BOOKING_REPORT_READ: 42,
  BOOKING_REPORT_AGGR: 44,

  // Print Booking List
  PRINT_BOOKING_LIST: 43,

  // Staffs
  STAFF_READ:            2001,
  STAFF_CMD:             2002,
  STAFF_STAFF_GOAL_READ: 2003,
  STAFF_STAFF_GOAL_CMD:  2004,
  STAFF_PAYROLL_READ:    2005,
  STAFF_PAYROLL_CMD:     2006,
  TIME_CLOCK_READ:       2007,
  TIME_CLOCK_CMD:        2008,

  // Sales Setup
  SALES_SETUP_READ: 4001,
  SALES_SETUP_CMD:  4002,
  SALES_AGGR:       4003,
  SALES_READ:       4004,
  SALES_CMD:        4005,

  // Sales
  SALES_CLIENT_PREPAID_CARD_READ:            4006,
  SALES_CLIENT_PREPAID_CARD_CMD:             4007,
  SALES_CLIENT_PREPAID_CARD_HISTORY_READ:    4008,
  SALES_BALANCE_MOVE_CMD:                    4009,
  SALES_CLIENT_PREPAID_SERVICE_READ:         4010,
  SALES_CLIENT_PREPAID_SERVICE_CMD:          4011,
  SALES_CLIENT_PREPAID_SERVICE_HISTORY_READ: 4012,
  SALES_OUTSTANDING_PAYMENT_CMD:             4013,
  SALES_OUTSTANDING_PAYMENT_READ:            4014,
  SALES_OUTSTANDING_HISTORY_READ:            4015,
  SALES_OUTSTANDING_PAYMENT_HISTORY_READ:    6100,
  SALES_CLIENT_ACCOUNT_READ:                 4016,
  SALES_CLIENT_ACCOUNTS_READ:                4444,
  SALES_CLIENT_HISTORY_READ:                 4017,
  SALES_CLIENT_FAMILY_READ:                  4018,
  SALES_CLIENT_FAMILY_CMD:                   4019,
  SALES_CLIENT_CMD:                          4020,
  SALES_CLIENT_SEARCH_WITH_FAMILY_INFO:      4021,
  RECOMMENDATION_POINT_SETUP_CMD:            4022,
  RECOMMENDATION_POINT_SETUP_READ:           4023,
  SALES_DRAFT_DOCUMENT_AGGR:                 4060,
  SALES_DRAFT_DOCUMENT_READ:                 4061,
  SALES_DRAFT_DOCUMENT_CMD:                  4062,

  // Report
  REPORT_SALES_CLIENT_REPORT_READ:        4024,
  REPORT_BALANCE_AND_LOYALTY_POINTS_READ: 4025,

  // Board Home
  SALES_BOARD_HOME_READ:         4026,
  SALES_REPORTS_BOARD_HOME_READ: 4027,

  // Refund
  REFUND_READ: 4030,
  REFUND_CMD:  4031,

  // Inventory
  SUPPLIER_READ:           4040,
  SUPPLIER_CMD:            4041,
  RECEIVING_READ:          4042,
  RECEIVING_CMD:           4043,
  STOCK_INTERNAL_USE_READ: 4044,
  STOCK_INTERNAL_USE_CMD:  4045,
  STOCK_HISTORY_READ:      4046,
  STOCK_STATUS_CMD:        4047,
  STOCK_STATUS_READ:       4048,
  INVENTORY_PRODUCT_READ:  4049,

  // Expenditure
  EXPENDITURE_READ: 4101,
  EXPENDITURE_CMD:  4102,

  // // Account
  // ACCOUNT : {
  //   SHOP_INFO_READ : 5001,
  //   SHOP_INFO_CMD  : 5002,
  //   //SHOP_INFO_AGGR : 5003,
  //   USER_ACCOUNT_READ : 5101,
  //   USER_ACCOUNT_CMD : 5102,
  // },

  // Identities
  IDENTITIES: {
    //USER_ROLE_READ: 1001,
    //USER_ROLE_CMD: 1002,
    USER_ACCOUNT_READ:       1003,
    USER_ACCOUNT_CMD:        1004,
    USER_ROLE_READ:          1005,
    USER_LOGIN_HISTORY_READ: 1007,
    AUTH_READ:               1009,
    //SHOP_USER_ROLE_READ: 1005,
    //SHOP_USER_ROLE_CMD: 1006,
    //DROPDOWN_LIST: 1900,
  },

  // Admins
  ADMINS: {
    SHOP_READ:             1101,
    SHOP_CMD:              1102,
    TAX_INVOICE_INFO_READ: 1103,
    TAX_INVOICE_INFO_CMD:  1104,
    MENU_READ:             1105,
    SHOP_ENVIRONMENT_CMD:  1108,

    CID_ACCOUNT_READ: 1109,
    CID_ACCOUNT_CMD:  1110,

    COUNTRY_SERVICE_TYPE_READ:      1111,
    AUTO_TRANSFER_ARS_HISTORY_READ: 11121,
    AUTO_TRANSFER_ARS_HISTORY_CMD:  1112,
    PAYMENT_INFO_READ:              1113,

    CID_FUNCTIONS_CMD: 1114,
  },
  // AdminSales
  ADMIN_SALES: {
    BANK_TRANSFER_NOTICE_CMD:  1201,
    BANK_TRANSFER_NOTICE_READ: 1202,
    SHOP_USAGE_READ:           1204,
    MISC_CODE_READ:            1206,
    NETMONEY_HISTORY_READ:     1207,
    ADMIN_SALES_READ:          1209,
    ADMIN_SALES_CMD:           1210,
    BASE_FEE_READ:             1211,
    BASE_FEE_CMD:              1212,
  },
  // Boards
  BOARDS: {
    NOTICE_READ:            1301,
    NOTICE_CMD:             1302,
    BOARD_READ:             1303,
    BOARD_CMD:              1304,
    BOARD_MANAGEMENT_READ:  1305,
    MANUAL_MANAGEMENT_READ: 1306,
    POPUP_READ:             1307,
    FILE_ATTACHMENT_READ:   1308,
    BOARD_HOMEPAGE_READ:    1309,
  },
  // Messages
  MESSAGES: {
    TEXT_MESSAGE_READ:        1401,
    TEXT_FEE_READ:            1402,
    TEXT_SAMPLE_READ:         1403,
    TEXT_MY_MESSAGE_CMD:      1404,
    TEXT_MY_MESSAGE_READ:     1405,
    TEXT_SENDER_PHONE_CMD:    1406,
    TEXT_SENDER_PHONE_READ:   1407,
    REFUSE_TEXT_MESSAGE_READ: 1408,
    MY_MESSAGE_CATEGORY_READ: 1409,
    MY_MESSAGE_CATEGORY_CMD:  1410,
  },
  MESSAGE_AUTOS: {
    MESSAGE_SETUP_LOGIN_CMD:      1501,
    MESSAGE_SETUP_CLIENT_CMD:     1502,
    MESSAGE_SETUP_SALES_CMD:      1503,
    MESSAGE_SETUP_BOOKING_CMD:    1504,
    MESSAGE_SETUP_POST_VISIT_CMD: 1505,
  },
  // Campaigns
  CLIENT_CAMPAIGN_CMD:  6001,
  CLIENT_CAMPAIGN_READ: 6000,

  // Sales Report
  SALES_REPORT_AGGR:   7003,
  SALES_REPORT_READ:   7000,
  SALES_REPORTS_READ:  7002,
  SALES_HISTORY_PRINT: 7001,

  // Naver
  NAVER_AGG:                        8000,
  NAVER_EXTERNAL_SYSTEM_GOODS_READ: 8001,
  NAVER_EXTERNAL_SYSTEM_CMD:        8002,

  // Clients Download Data
  CLIENTS_DOWNLOAD_DATA: {
    CLIENTS_INFORMATION_READ: 9901,
  },

  // Clients Download History
  CLIENTS_DOWNLOAD_HISTORY: {
    CLIENTS_INFORMATION_READ: 10000,
  },
}

export const SERVICE_EXTEND_TYPES = {
  // Common
  LIVE:            '/Live',
  LIST:            '/List',
  CHANGE_ORDER_NO: '/ChangeOrderNo',
  SHOP_LIST:       '/ShopList',
  CREATE:          '/Create',
  UPDATE:          '/Update',
  READ:            '/Read',
  EXPIRY_DATE:     '/ExpiryDate',
  SEARCH_LIST:     '/SearchList',

  // Aggr
  SALON:                             '/Salon',
  GET_LIST:                          '/GetList',
  LOGIN_SUBSCRIBER:                  '/Login/Subscriber',
  FIND_OWNER_USER_ID:                '/FindOwnerUserID',
  FIND_OWNER_USER_PASSWORD:          '/FindOwnerUserPassword',
  CHECK_OWNER_USER_ID:               '/CheckOwnerUserID',
  CHECK_OWNER_INFO:                  '/CheckOwnerInfo',
  MOBILE_CERTIFICATION_VERIFICATION: '/MobileCertification/Verification',
  USER_LOGIN_HISTORY:                '/UserLoginHistory',
  LOGIN_LOGINKEY:                    '/Login/LoginKey?key=',
  REFRESH_TOKEN:                     '/RefreshToken',

  // Goods
  UPDATE_STATUS:                  '/UpdateStatus',
  SHARE_TO_SHOP:                  '/ShareToShop',
  UNSHARE_TO_SHOP:                '/UnshareToshop',
  NAME:                           '/Name',
  NEXT_PRODUCT_CODE:              '/NextProductCode',
  CHECK_ALL_PRODUCT_CODE_NUMERIC: '/CheckAllProductCodeNumeric',

  // Bookings
  OPENING_HOURS:                  '/OpeningHours',
  OPENING_HOUR:                   '/OpeningHour',
  REPEAT_OFF_DAY:                 '/RepeatOffDay',
  SPECIFIC_OFF_DAY:               '/SpecificOffDay',
  BOOKING_HISTORY_BY_CLIENT:      '/BookingHistoryByClient',
  CALENDAR:                       '/Calendar',
  All_CALENDAR_SETUPS:            '/AllCalendarSetups/Live',
  MOVE_BOOKING:                   '/MoveBooking',
  CHANGE_WAITING_TO_BOOKING:      '/ChangingWaitingToBooking',
  CANCEL_BOOKING:                 '/CancelRepeatBooking',
  UPDATE_BOOKING_CLIENT:          '/ConnectClient',
  UPDATE_BOOKING_STATUS:          '/UpdateStatus',
  BOOKING_DEPOSIT:                '/BookingDeposit',
  GET_TOKEN:                      '/GetToken',
  UPCOMING_REPEATED_BOOKINGS:     '/UpcomingRepeatedBookings',
  BOOKINGS_SUMMARY_BY_CLIENT:     '/BookingsSummaryByClient',
  GET_SERVICES_AND_BOOKING_ITEMS: '/GetServicesAndBookingItems',
  SEND_SMS:                       '/SendSms',
  UPDATE_NOTES:                   '/UpdateNotes',
  ADD_OPENING_HOUR:               '/AddOpeningHour',

  // Sales
  ALL_SALES_SETUP_LIVE:                        '/AllSalesSetups/Live',
  PAYMENT_METHOD:                              '/PaymentMethod',
  PAYMENT_METHOD_LIVE:                         '/PaymentMethod/Live',
  SALES_TYPE:                                  '/SalesType',
  SALES_TYPE_LIVE:                             '/SalesType/Live',
  DISCOUNT_CATEGORY:                           '/DiscountCategory',
  DISCOUNT_CATEGORY_LIVE:                      '/DiscountCategory/Live',
  LOYALTY_POINTS:                              '/LoyaltyPoints',
  LOYALTY_POINTS_LIVE:                         '/LoyaltyPoints/Live',
  RECOMMENDATION_POINT_SETUP:                  '/RecommendationPointSetup',
  RECOMMENDATION_POINT_SETUP_LIVE:             '/RecommendationPointSetup/Live',
  SALES_GENERAL_SETUP:                         '/SalesGeneralSetup',
  GENERAL:                                     '/General',
  DATA_PROTECTION_AND_SECURITY_SETUP:          '/DataProtectionAndSecuritySetup',
  DATA_PROTECTION_AND_SECURITY:                '/DataProtectionAndSecurity',
  GET_ENVIRONMENT_SETUP_LIVE:                  '/GetEnvironmentSetup/Live',
  SALES_HISTORIES:                             '/SalesHistories',
  SALES_HISTORIES_LIVE:                        '/SalesHistories/Live',
  SALES_HISTORIES_BY_CREATE_USER:              '/SalesHistoriesByCreatedUser',
  SALES_HISTORIES_BY_CLIENT:                   '/SalesHistoriesByClient/Live',
  SALES_NOTES:                                 '/UpdateNotes',
  SALES_ADD_PAYMENT:                           '/AddPayment',
  SALES_ADD_BY_CHECKOUT_BOOKING:               '/AddSalesByCheckoutBooking',
  ADD_SALES_BY_CHECKOUT_PAY_AT_SALON:          '/AddSalesByCheckoutPayAtSalon',
  EDIT_SALES_BY_PAY_AT_SALON:                  '/EditSalesByPayAtSalon',
  CANCEL_CHECKOUT_PAY_AT_SALON:                '/CancelCheckoutPayAtSalon',
  SALES_CLIENT_CHANGE_POINT:                   '/ChangePoint',
  SALES_CLIENT_SEARCH_WITH_FAMILY:             '/SearchWithFamilyInfo',
  CLIENT_PREPAID_CARDS_LIVE:                   '/ClientPrepaidCards/Live',
  CLIENT_PREPAID_SERVICES_LIVE:                '/ClientPrepaidServices/Live',
  BALANCE_POINT_EDIT_HISTORIES_LIVE:           '/BalancePointEditHistories/Live',
  CLIENT_LOYALTY_POINT_HISTORIES_LIVE:         '/LoyaltyPointHistories/Live',
  CLIENT_ACCOUNT_LIVE:                         '/ClientAccounts/Live',
  CLIENT_OUTSTANDINGS_LIVE:                    '/ClientReceivables/Live',
  CLIENT_ACCOUNT_AND_VALID_PREPAID_GOODS_LIVE: '/ClientAccountAndValidPrepaidGoods/Live',
  SALES_LIVE:                                  '/Sales/Live',
  SALES_BY_ID_LIVE:                            '/SalesById/Live',
  SALES_BY_BOOKING_ID_LIVE:                    '/SalesByBookingId/Live',
  DELETE_QUANTITY_EDIT_CLIENT_PREPAID_SERVICE: '/DeleteQuantityEditClientPrepaidService',
  PRIORITY_PREPAID_GOODS_DISPLAY:              '/PriorityPrepaidGoodsDisplay/Live',
  SALES_BOARD_HOME_REPORT:                     '/SalesBoardHomeReport',
  CLIENT_BOARD_HOME_REPORT:                    '/ClientBoardHomeReport',

  // Report Sales
  SALES_TOTAL_REPORT__DATE:       '/SalesTotalByDateReport',
  SALES_TOTAL_REPORT__MONTH:      '/SalesTotalByMonthReport',
  SALES_TOTAL_REPORT__DATE_RANGE: '/SalesTotalByDateRangeReport',

  SALES_TOTAL_BY_STAFF__DATE:       '/SalesTotalByStaffByDateReport',
  SALES_TOTAL_BY_STAFF__MONTH:      '/SalesTotalByStaffByMonthReport',
  SALES_TOTAL_BY_STAFF__DATE_RANGE: '/SalesTotalByStaffByDateRangeReport',

  SALES_TOTAL_HIDE_PREPAID_GOODS_REPORTS: '/SalesReport/ChangeSetup',

  SALES_TOTAL_BY_ITEM__SERVICE__DATE:               '/SalesTotalByItemServiceByDateReport',
  SALES_TOTAL_BY_ITEM__SERVICE__MONTH:              '/SalesTotalByItemServiceByMonthReport',
  SALES_TOTAL_BY_ITEM__SERVICE__DATE_RANGE:         '/SalesTotalByItemServiceByDateRangeReport',
  SALES_TOTAL_BY_ITEM__PRODUCT__DATE:               '/SalesTotalByItemProductByDateReport',
  SALES_TOTAL_BY_ITEM__PRODUCT__MONTH:              '/SalesTotalByItemProductByMonthReport',
  SALES_TOTAL_BY_ITEM__PRODUCT__DATE_RANGE:         '/SalesTotalByItemProductByDateRangeReport',
  SALES_TOTAL_BY_ITEM__PREPAID_CARD__DATE:          '/SalesTotalByItemPrepaidCardByDateReport',
  SALES_TOTAL_BY_ITEM__PREPAID_CARD__MONTH:         '/SalesTotalByItemPrepaidCardByMonthReport',
  SALES_TOTAL_BY_ITEM__PREPAID_CARD__DATE_RANGE:    '/SalesTotalByItemPrepaidCardByDateRangeReport',
  SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__DATE:       '/SalesTotalByItemPrepaidServiceByDateReport',
  SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__MONTH:      '/SalesTotalByItemPrepaidServiceByMonthReport',
  SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__DATE_RANGE: '/SalesTotalByItemPrepaidServiceByDateRangeReport',

  SERVICE_SALES__REPORT:             '/ServiceSalesReport',
  SERVICE_SALES_BY_ITEM__DATE:       '/ServiceSalesByItemByDateFilterReport',
  SERVICE_SALES_BY_ITEM__DATE_RANGE: '/ServiceSalesByItemByDateRangeFilterReport',
  SERVICE_SALES_BY_ITEM__MONTH:      '/ServiceSalesByItemByMonthFilterReport',

  SERVICE_SALES_BY_MONTHS: '/ServiceSalesByMonthsReport',

  SERVICE_SALES_BY_SALES_TYPES__DATE:       '/ServiceSalesBySalesTypesByDateReport',
  SERVICE_SALES_BY_SALES_TYPES__DATE_RANGE: '/ServiceSalesBySalesTypesByDateRangeReport',
  SERVICE_SALES_BY_SALES_TYPES__MONTH:      '/ServiceSalesBySalesTypesByMonthReport',

  PRODUCT_SALES_BY_MONTHS:            '/ProductSalesByMonthsReport',
  PRODUCT_SALES_BY_ITEM__DATE:        '/ProductSalesByItemByDateFilterReport',
  PRODUCT_SALES_BY_ITEM__DATE_RANGE:  '/ProductSalesByItemByDateRangeFilterReport',
  PRODUCT_SALES_BY_ITEM__MONTH_RANGE: '/ProductSalesByItemByMonthRangeFilterReport',

  SALES_BY_DISCOUNT_CATEGORY__DATE:       '/SalesByDiscountCategoryByDateReport',
  SALES_BY_DISCOUNT_CATEGORY__DATE_RANGE: '/SalesByDiscountCategoryByDateRangeReport',
  SALES_BY_DISCOUNT_CATEGORY__MONTH:      '/SalesByDiscountCategoryByMonthReport',

  SALES_BY_REPEAT_CLIENTS__DATE:       '/SalesByRepeatClientsByDate',
  SALES_BY_REPEAT_CLIENTS__DATE_RANGE: '/SalesByRepeatClientsByDateRange',
  SALES_BY_REPEAT_CLIENTS__MONTH:      '/SalesByRepeatClientsByMonth',

  INCOME_STATEMENT__DATE:       '/IncomeStatementByDateFilterReport',
  INCOME_STATEMENT__DATE_RANGE: '/IncomeStatementByDateRangeFilterReport',
  INCOME_STATEMENT__MONTH:      '/IncomeStatementByMonthFilterReport',

  // Report Client
  CLIENTS_SUMMARY:                            '/ClientsSummary',
  CLIENTS_BY_PERIOD__DATE:                    '/ClientsByPeriodByDate',
  CLIENTS_BY_PERIOD__DATE_RANGE:              '/ClientsByPeriodByDateRange',
  CLIENTS_BY_PERIOD__MONTH:                   '/ClientsByPeriodByMonth',
  CLIENTS_BY_TYPE:                            '/ClientsByType',
  NEW_CLIENT_REPEAT:                          '/NewClientRepeat',
  NEW_CLIENT_BY_MONTHS_REPORT:                '/NewClientByMonthsReport',
  RECOMMENDED_CLIENTS_BY_MONTH:               '/RecommendedClientsByMonth',
  NEW_CLIENT_BY_REFERRAL_SOURCE__DATE_RANGE:  '/ClientReferralSourceByDateRangeFilterReport',
  NEW_CLIENT_BY_REFERRAL_SOURCE__MONTH_RANGE: '/ClientReferralSourceByMonthRangeFilterReport',

  // Report Booking
  BOOKING_TALLY_DETAIL_BY_MONTH:                 '/BookingTallyDetailsAnalysisByMonth',
  BOOKING_TALLY_DETAIL_BY_DAY:                   '/BookingTallyDetailsAnalysisByDate',
  BOOKING_SUMMARY_BY_DATE:                       '/BookingsSummaryByDate',
  BOOKING_RATIO:                                 '/BookingRatioReport',
  BOOKING_BY_DATE:                               '/BookingsByDate',
  BOOKING_BY_MONTH:                              '/BookingsByMonth',
  UTILIZATION_RATIO:                             '/BookingUtilizationRate',
  DETAILED_ANALYSIS_OF_BOOKING__MONTH__RESOURCE: '/ResourcesDetailedAnalysisByMonth',
  DETAILED_ANALYSIS_OF_BOOKING__MONTH__DAY:      '/DayOfWeekDetailedAnalysisByMonth',
  DETAILED_ANALYSIS_OF_BOOKING__MONTH__HOUR:     '/HourOfDayDetailedAnalysisByMonth',

  DETAILED_ANALYSIS_OF_BOOKING__MONTH__BOOKING_SOURCE: '/BookingSourceDetailedAnalysisByMonth',

  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__RESOURCE: '/ResourcesDetailedAnalysisByDate',
  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__DAY:      '/DayOfWeekDetailedAnalysisByDate',
  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__HOUR:     '/HourOfDayDetailedAnalysisByDate',

  DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__BOOKING_SOURCE: '/BookingSourceDetailedAnalysisByDate',

  // Report Balance & Point
  SALES_BY_DATE_REPORT:        '/SalesByDateReport',
  SALES_BY_MONTH_REPORT:       '/SalesByMonthReport',
  PREPAID_CARDS_REPORT:        '/PrepaidCards',
  PREPAID_CARD_SUMMARY_REPORT: '/PrepaidCardSummary',
  PREPAID_SERVICES_REPORT:     '/PrepaidServices',
  LOYALTY_POINTS_REPORT:       '/LoyaltyPoints',
  PRINT_PREPAID_CARD_SUMMARY:  '/PrintPrepaidCardSummary',
  PRINT_PREPAID_CARDS:         '/PrintPrepaidCards',
  PRINT_PREPAID_SERVICES:      '/PrintPrepaidServices',
  PRINT_LOYALTY_POINTS:        '/PrintLoyaltyPoints',

  // ADMINS - shop
  CONTACT:          '/Contact',
  BASIC:            '/Basic',
  MONTHLY_FEE:      '/MonthlyFee',
  SHOP_ENVIRONMENT: '/ShopEnvironmentSetup',

  SHOP_NAME_LIST:        '/ShopNameList',
  NETMONEY_ALARM:        '/NetmoneyAlarm',
  VAT_RATE:              '/VATRate',
  TEXT_SENDER_PHONE_USE: '/TextSenderPhoneUse',

  MAX_STAFFS_BY_SHOP: '/MaxStaffsByShop',
  ARS_NOTES:          '/ARSNotes',

  CID_DIAL:              '/CIDDial',
  CID_HANGUP:            '/CIDHangup',
  CID_GET_RING_CALLBACK: '/GetRingCallback',

  // Identities
  CHANGE_PASSWORD: '/Password',

  // Admin sales
  MISC_CODE:                               '/MiscCode',
  LIST_BY_SHOP:                            '/ListByShop',
  ONLINE_PAYMENT_PREPARED:                 '/OnlinePayment/Prepared',
  ONLINE_PAYMENT:                          '/OnlinePayment',
  VALID_VIRTUAL_ACCOUNT:                   '/ValidVirtualAccountByShopId',
  FOR_NETMONEY_WITH_CMS_OUTSTANDING:       '/ForNetmoneyWithCMSOutstanding',
  OUTSTANDING_AMOUNT_SUM_OF_SHOP_CMS_ABLE: '/outstanding/AmountSumOfShopCMSable',

  // Boards
  READ_COUNT: '/ReadCount',

  USER_ROLE: '/UserRole',

  // Messages
  MASTER:                    '/Master',
  DETAIL:                    '/Detail',
  LIST_BY_RECEIVER:          '/ListByReceiver',
  VIEW_IMAGE:                '/ViewImage',
  DELETE_LIST:               '/DeleteList',
  BY_SHOP:                   '/ByShop',
  TEXT_SAMPLE:               '/Sample',
  MAIN:                      '/Main',
  TEXT_SAMPLE_BUSINESS_TYPE: '/SampleBusinessType',
  TEXT_SAMPLE_GROUP:         '/SampleGroup',
  LIST_BY_MASTER:            '/ListByMaster',
  AS_AUTO_SENDER:            '/AsAutoSender',
  ARS_AUTHENTICATION:        '/ARSAuthentication',
  AUTO:                      '/Auto',
  REFUSED_LIST_BY_SHOP:      '/RefusedListByShop',
  BY_CATEGORY_ID:            '/ByCategoryId',
  TEXT_MESSAGE:              '/TextMessage',
  CONSENT_TEXT_MESSAGE:      '/ConsentTextMessage',
  WITHOUT_CATEGORY:          '/WithoutCategory',
  REVISIT_ENCOURAGEMENT:     '/RevisitEncouragement',
  ALL:                       '/All',

  //CID
  SUBSCRIBER_NAME:          '/SubscriberName',
  UPDATE_RECEIVED_FALG:     '/UpdateReceivedFlag',
  UPDATE_CALL_CONFIRMATION: '/UpdateCallConfirmation',

  // Campaigns
  // CAMPAIGN_ADD_CLIENTS  : '/AddClients',
  CAMPAIGN_ADD_CLIENTS:   '/AddClientsToCampaign',
  CAMPAIGN_VIEW_CLIENTS:  '/ViewClientsCampaign',
  CAMPAIGN_REPORT:        '/CampaignReport',
  CAMPAIGN_VIEW_REPORT:   '/ViewReport',
  CAMPAIGN_ADD_REPORT:    '/AddCampaignReport',
  CAMPAIGN_DELETE_REPORT: '/DeleteCampaignReport',

  // Staffs
  DAYS_WORKED:       '/DaysWorked',
  TIME_CLOCK:        '/TimeClock',
  WORKING_HOUR:      '/WorkingHour',
  ACTIVE:            '/Active',
  STAFF_COUNT:       '/StaffCount',
  NEXT_STAFF_NUMBER: '/NextStaffNumber',
}

export const PAGINATION = {
  HOME:               3,
  ZERO:               0,
  SMALL:              5,
  DEFAULT:            10,
  BIG:                50,
  MAX:                100,
  NOTIFICATION:       10,
  PHOTO_LIST_DESKTOP: 16,
  PHOTO_LIST_MOBILE:  12,
}

export const SORT = {
  NONE:       0,
  ASCENDING:  1,
  DESCENDING: 2,
}

export const SORT_BY_CELL_NAME = {
  NONE:            0,
  CLIENT_NUMBER:   1,
  CLIENT_NAME:     2,
  PREFERRED_STAFF: 3,
  BALANCE:         4,
  TOTAL_SALES:     5,
  REGISTERED_DATE: 6,
}

export const FORM_ACTIONS = {
  ADD:                 1,
  EDIT:                2,
  VIEW:                4,
  PART:                6,
  DELETE:              3,
  CREATE:              5,
  RE_ADD:              7,
  EDIT_NOTE:           9,
  ADD_PAYMENT:         8,
  ADD_BOOKING_DEPOSIT: 10,
}

export const COOKIE_ACTION = {
  GET:    1,
  SET:    2,
  REMOVE: 3,
  EXIST:  4,
}

export const GOODS_TYPE = {
  PRODUCT:         1,
  SERVICE:         2,
  PREPAID_SERVICE: 3,
  PREPAID_CARD:    4,
}

export const GOODS_STATUS = {
  LIST_DEFAULT: 1,
  ALL:          0,
  ACTIVE:       1,
  INACTIVE:     2,
}

export const USAGE_STATUS = {
  ALL:                    '',
  SALES:                  1,
  INTERNAL_USE:           2,
  SALES_AND_INTERNAL_USE: 3,
  SALES_ALL:              '1,3',
  INTERNAL_USE_ALL:       '2,3',
}

export const VALIDITY_TYPE = {
  MONTHS: 1,
  DAYS:   2,
}
export const SALARY_TYPE = {
  PERCENT: 1,
  AMOUNT:  2,
}

export const ENUM_NO_LIMIT = -1

export const GOODS_TABLE_DRAG = {
  ALL:      true,
  UNSHARED: 'unshared',
  OFF:      false,
  SHARED:   'shared',
}

export const REPEAT_TYPE = {
  NONE:       1,
  EVERY_WEEK: 2,
  BIWEEKLY:   3,
  MONTHLY:    4,
}

export const REPEATED_WEEKS = {
  FIRST:  1,
  SECOND: 2,
  THIRD:  3,
  FOURTH: 4,
}

export const DAYS_OF_WEEK = {
  SUNDAY:    0,
  MONDAY:    1,
  TUESDAY:   2,
  WEDNESDAY: 3,
  THURSDAY:  4,
  FRIDAY:    5,
  SATURDAY:  6,
}

export const STANDARD_DATE_FORMAT = {
  MY:     'MM-YYYY',
  DMY:    'DD-MM-YYYY',
  DMYH:   'DD-MM-YYYY HH:mm',
  YM:     'YYYY-MM',
  YMD:    'YYYY-MM-DD',
  YMDH:   'YYYY-MM-DD HH:mm',
  YMDHms: 'YYYY-MM-DD HH:mm:ss',
  MDY:    'MM-DD-YYYY',
  UTC:    'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MD:     'MM-DD',
  HM:     'HH:mm',
  HMS:    'HH:mm:ss',
  YMDd:   'YYYY-MM-DD (ddd)',
}

export const STANDARD_DAY_FORMAT = {
  SHORT: 'ddd',
  LONG:  'dddd',
}

export const STANDARD_HOUR_FORMAT = {
  H12:         'hh:mm A',
  H24:         'HH:mm',
  H24_SECONDS: 'HH:mm:ss',
  H12_SECONDS: 'hh:mm:ss A',
}

export const BOOKING_APPROVAL_TYPE = {
  MANUAL: 1,
  AUTO:   2,
}

export const TIME_ZONE = {
  VN: 'Asia/Ho_Chi_Minh',
  KR: 'Asia/Seoul',
}

export const RESOURCE_TYPE = {
  STAFF:    1,
  NO_STAFF: 2,
}

export const STAFF_CONNECTIONS = {
  CONNECT:    1,
  DISCONNECT: 2,
}

export const BOOKING_CLIENT_TYPE = {
  ALL:            -1,
  BOOKED_CLIENT:  1,
  WALKING_CLIENT: 2,
}

export const BOOKING_SOURCE = {
  ALL:           null,
  ADMINISTRATOR: 1,
  ONLINE:        2,
  NAVER:         3,
  KAKAO:         4,
}

export const BOOKING_STATUS = {
  ALL:                       null,
  ALL_NO_CANCELD:            0,
  REQUESTED:                 1,
  COMPLETED:                 2,
  ARRIVED:                   3,
  CANCELED:                  4,
  NO_SHOW:                   5,
  CHECKED_OUT:               6,
  NO_BOOKING:                7,
  EXTERNAL_AUTO_CHECKED_OUT: 8,
  EXTERNAL_CHECKED_OUT:      9,
  PAYMENT_IN_PROGRESS:       10,
}

export const BOOKING_CLIENT_COLOR = {
  NONE:   0,
  RED:    1,
  ORANGE: 2,
  YELLOW: 3,
  GREEN:  4,
  BLUE:   5,
  INDIGO: 6,
  PURPLE: 7,
}

export const BOOKING_EXTERNAL_SYSTEM_PAYMENT = {
  NAVER_GENERAL:              1,
  NAVER_PREPAYMENT:           2,
  NAVER_PAY_AT_SALON:         3,
  NAVER_PAY_AT_SALON_DEPOSIT: 4,
}

export const BOOKING_EXTERNAL_SYSTEM_SELECTED_PAYMENT_PROVIDER = {
  NONE:      0,
  NAVER_PAY: 1,
}

export const NAVER_PAYMENT_METHOD_TEXT = '네이버 페이'

export const REPEAT_BY = {
  WEEK_OF_DAY: 1,
  DATE:        2,
}

export const DEPOSIT_TYPE = {
  NOT_PAID_YET:   1,
  PAID:           2,
  PAY_BY_BALANCE: 3,
}

export const BOOKING_DEPOSIT_STATUS = {
  EXIST:  0,
  DELETE: 2,
}

export const BOOKING_CANCEL_TYPE = {
  BOOKING_ONLY:           1,
  ALL_UPCOMMING_BOOKINGS: 2,
}

export const BOOKING_REASON = {
  NO_CANCEL:                1,
  NOT_SELECTED:             2,
  CLIENT_REQUEST:           3,
  BOOKING_MADE_BY_MISTAKE:  4,
  DUPLICATE_BOOKING:        5,
  CANCEL_ETC:               6,
  BOOKING_DEPOSIT_NOT_PAID: 7,
}

export const BOOKING_CALENDAR_GROUP_TYPE = {
  BOOKING:      1,
  BLOCKED_TIME: 2,
}

export const ALERT_TYPE_CONFIRM = {
  BOOKING:      1,
  BLOCKED_TIME: 2,
}

export const SESSION_KEY = {
  // setup info
  STAFFS:                'staffs',
  CURRENT_USER:          'currentUser',
  ALL_SALES_SETUP:       'all_sales_setup',
  STAFF_GOAL_SETUP:      'staff_goal_setup',
  ENVIRONMENT_SETUP:     'environment_setup',
  All_CALENDAR_SETUPS:   'all_calendar_setups',
  STAFF_PAYROLL_SETUP:   'staff_payroll_setup',
  PAYMENT_METHOD_SETUP:  'payment_method_setup',
  BOOKING_DEPOSIT_SETUP: 'booking_deposit_setup',

  // others
  SHOP_ID:                               'shop_id',
  APP_VERSION:                           'app_version',
  SELECTED_CLIENTS:                      'selected_clients',
  RECENTLY_SELECTED_CLIENT:              'recently_selected_client',
  IS_SHOW_TOP_HEADER_ON_CALENDAR_VIEW:   'is_show_top_header_on_calendar_view',
  IS_SHOW_LEFT_SIDEBAR_ON_CALENDAR_VIEW: 'is_show_left_sidbar_on_calendar_view',
}

export const LOCAL_KEY = {
  LAST_VISITED_PAGE: 'last_visited_page',
}

export const COOKIE_KEY = {
  REFRESH_TOKEN: 'refresh_token',
}

export const SECOND_OF_1M = 60
export const MINUTES_OF_1H = 60
export const MINUTES_OF_12H = 720
export const MINUTES_OF_24H = 1440
export const MAX_BOOKING_SHOW_CLIENT_INFOR = 100

export const NOTIFICATON_TYPE = {
  NO_DEFINED:                        'NO_DEFINED',
  GOODS_CHANGED:                     'GOODS_CHANGED',
  PACKAGE_CHANGED:                   'PACKAGE_CHANGED',
  SERVICE_CHANGED:                   'SERVICE_CHANGED',
  BOOKINGS_CREATED:                  'BOOKINGS_CREATED',
  BOOKINGS_UPDATED:                  'BOOKINGS_UPDATED',
  WAITINGS_CREATED:                  'WAITINGS_CREATED',
  WAITINGS_UPDATED:                  'WAITINGS_UPDATED',
  LOGOUT_USER_ACCESS:                'LOGOUT_USER_ACCESS',
  BOOKINGS_CANCELLED:                'BOOKINGS_CANCELLED',
  SYSTEM_NEW_VERSION:                'SYSTEM_NEW_VERSION',
  SALES_DRAFT_DELETED:               'SALES_DRAFT_DELETED',
  PREPAID_CARD_CHANGED:              'PREPAID_CARD_CHANGED',
  STAFF_STATUS_CHANGED:              'STAFF_STATUS_CHANGED',
  SYSTEM_MAINTAIN_MODE:              'SYSTEM_MAINTAIN_MODE',
  BLOCKED_TIME_CREATED:              'BLOCKED_TIME_CREATED',
  BLOCKED_TIME_UPDATED:              'BLOCKED_TIME_UPDATED',
  BLOCKED_TIME_DELETED:              'BLOCKED_TIME_DELETED',
  CID_RECEIVING_HISTORY:             'CID_RECEIVING_HISTORY',
  PREPAID_SERVICE_CHANGED:           'PREPAID_SERVICE_CHANGED',
  SPECIFIC_OFF_DAY_CREATE:           'SPECIFIC_OFF_DAY_CREATED',
  SPECIFIC_WORKING_DAY_CREATED:      'SPECIFICWORKINGDAY_CREATED',
  SPECIFIC_WORKING_DAY_UPDATED:      'SPECIFICWORKINGDAY_UPDATED',
  SPECIFIC_WORKING_DAY_DELETED:      'SPECIFICWORKINGDAY_DELETED',
  PRODUCT_CATEGORY_CHANGED:          'PRODUCT_CATEGORY_CHANGED',
  SERVICE_CATEGORY_CHANGED:          'SERVICE_CATEGORY_CHANGED',
  PRODUCT_INVENTORY_CHANGED:         'PRODUCT_INVENTORY_CHANGED',
  WAITINGS_CHANGED_TO_BOOKINGS:      'WAITINGS_CHANGED_TO_BOOKINGS',
  SHOP_SPECIFIC_OFF_DAY_CHANGED:     'SHOP_SPECIFIC_OFF_DAY_CHANGED',
  EXT_SYSTEM_BOOKING_PAYMENT_PAID:   'EXTSYSTEM_BOOKING_PAYMENT_PAID',
  EXTSYSTEM_BOOKING_PAYMENT_UPDATED: 'EXTSYSTEM_BOOKING_PAYMENT_UPDATED',
  RESOURCE_SPECIFIC_OFF_DAY_CREATED: 'SPECIFIC_OFF_DAY_CREATED',
  RESOURCE_SPECIFIC_OFF_DAY_DELETED: 'SPECIFIC_OFF_DAY_DELETED',

  SPECIFIC_DAY_CREATED: 'SPECIFIC_DAY_CREATED',

  LOYALTY_POINT_CHANGED:                            'LOYALTY_POINT_CHANGED',
  SALES_GENERAL_SETUP_UPDATED:                      'SALES_GENERAL_SETUP_UPDATED',
  SHOP_ENVIRONMENT_SETUP_UPDATED:                   'SHOP_ENVIRONMENT_SETUP_UPDATED',
  CLIENT_ENVIRONMENT_SETUP_UPDATED:                 'CLIENT_ENVIRONMENT_SETUP_UPDATED',
  SALES_DATA_PROTECTION_AND_SECURITY_SETUP_UPDATED: 'SALES_DATA_PROTECTION_AND_SECURITY_SETUP_UPDATED',
  TOTAL_ALARM_CHANGED:                              'TOTAL_ALARM_CHANGED',
  SHOW_ALARM_CHANGED:                               'SHOW_ALARM_CHANGED',
  BOOKING_ALARM_LIST_CHANGED:                       'BOOKING_ALARM_LIST_CHANGED',
  TOTAL_BOOKING_CHANGED:                            'TOTAL_BOOKING_CHANGED',
  CALENDAR_NOTE_CHANGED:                            'CALENDAR_NOTE_CHANGED',
  SALES_TRANSFER_CLIENT:                            'CLIENT_TRANSFER_COMPLETED',
}

export const SELECTED_RESOURCES_OPTIONS = {
  ALL:            -1,
  WORKING_STAFFS: -2,
}

//--- clients ---
export const CLIENT_TYPE = {
  ACTIVE:              '/Active',
  DUPLICATED:          '/Duplicated',
  DUPLICATED_BY_VALUE: '/DuplicatedByValue',
  SEARCH:              '/Search',
  UPDATE_STATUS:       '/UpdateStatuses',
  UPDATE_TO_DELETE:    '/UpdateToDeleted',
  DELETED:             '/Deleted',
  DELETE_COMPLETELY:   '/DeleteCompletely',
  NEXT_MEMBER_NUMBER:  '/NextMemberNumber',
}

export const AGGREGATE_TYPE = {
  CLIENT: '/Client',
}
//client enum
export const CLIENTS_ENUMS = {
  PAGE: {
    RECOMMEND_CLIENTS:    'RecommendClients',
    SALES_CLIENTS:        'SalesClients',
    FAMILY_MEMBER_SEARCH: 'FamilyMemberSearch',
    FAMILY_MEMBER_LIST:   'FamilyMemberList',
    ADD_BOOKING:          'AddBooking',
  },
  APPLY_RECOMMENDATION_POINT_TYPE: {
    ON:  1,
    OFF: 2,
  },
  CLIENT_SEARCH_CONDITION_TYPE: {
    NAME_OR_PHONE:  1,
    NAME_OR_NUMBER: 2,
    NOTES:          3,
  },
  CONTACT_INFO_HIDING_TYPE: {
    SHOWALL:                      1,
    HIDE_EXCEPT_REGISTERED_TODAY: 2,
    HIDEALL:                      3,
  },
  CLIENT_EDIT_PERMISSION_TYPE: {
    MANAGER_OR_HIGHER: 1,
    STAFF_OR_HIGHER:   2,
  },
  MEMBER_NUMBER_TYPE: {
    AUTO:   1,
    MANUAL: 2,
  },
  CLIENT_TYPE: {
    CREATE_CLIENT:             '/CreateClient',
    EDIT_CLIENT:               '/EditClient',
    GETCLIENT:                 '/GetClient',
    GET_CLIENT_FOR_AHACALL:    '/GetClientAccountByClientId',
    ACTIVE:                    '/Active',
    DUPLICATED:                '/Duplicated',
    DUPLICATED_BY_VALUE:       '/DuplicatedByValue',
    SEARCH:                    '/Search',
    UPDATE_STATUS:             '/UpdateStatuses',
    DELETED:                   '/Deleted',
    DELETE_COMPLETELY:         '/DeleteCompletelyClients',
    NEXT_MEMBER_NUMBER:        '/NextMemberNumber',
    SHOP_INFO:                 '/GetShopInfo',
    UPDATE_NOTE:               '/UpdateNote',
    FAMILY_MEMBER:             '/FamilyMember',
    FAMILY:                    '/Family',
    CHANGE_FAMILY_POINT:       '/ChangeFamilyPoint',
    UPDATE_CLIENT:             '/UpdateClient',
    CLIENT_REFERRAL_SOURCE:    '/ClientReferralSource',
    CLIENT_RATING:             '/ClientRating',
    CLIENT_GROUP:              '/ClientGroup',
    UPDATE_CLIENT_TO_DELETED:  '/UpdateClientToDeleted',
    UPDATE_CLIENTS_TO_DELETED: '/UpdateClientsToDeleted',
    CLIENT_SHOP_INFO:          '/ShopInfo',
    CONNECTABLE:               '/Connectable',
    TEXT_UNSUBSCRIBE_LIST:     '/TextUnsubscribeList',
    TEXT_SUBSCRIBE_LIST:       '/TextSubscribeList',
    ADD_PRIVACY_LOG:           '/AddPrivacyLog',
  },
  SEX: {
    NONE_INPUT: 0,
    MALE:       1,
    FEMALE:     2,
    NONE:       3,
  },
  BIRTHDAY_TYPE: {
    SOLAR: 1,
    LUNAR: 2,
  },
  ALLOWED_MESSAGE_TYPE: {
    ALLOW_MESSAGE: 1,
    NOT_MARKETING: 2,
    NOT_MESSAGE:   3,
  },
  CLIENT_MEMBER_TYPE: {
    MEMBER:     1,
    NON_MEMBER: 2,
  },
  DUPLICATED_CLIENT_SEARCH_TYPE: {
    NAME_MOBILE: 1,
    NAME:        2,
    MOBILE:      3,
  },
  DUPLICATED_CLIENT_SEARCH_TYPE_VALUES: {
    NAME:           1,
    MOBILE:         2,
    NAME_AND_PHONE: 3,
  },
  CLIENT_SEARCH_TYPE: {
    NAME_MOBILE_PHONE:  1,
    NAME_MEMBER_NUMBER: 2,
    NOTES:              3,
  },
  CLIENT_STATUS: {
    ACTIVE:  1,
    DELETED: 2,
  },
  MEMBER_NUMBER_SETUP_TYPE: {
    AUTO:   1,
    MANUAL: 2,
  },
  ENVIRONMENT_SETUP_TYPE: {
    ALLOW_DELETE_CLIENT:                     1,
    ALLOW_EDIT_CLIENT:                       2,
    CLIENT_SEARCH_CONDITION:                 3,
    CONTACT_INFO_TO_MANAGER:                 4,
    CONTACT_INFO_TO_STAFF:                   5,
    MEMBER_NUMBER_SETUP:                     6,
    ALLOW_SEND_TEXT_MESSAGE_TO_STAFF:        7,
    ALLOW_CALLING_CLIENTS_FROM_MOIBLE_PHONE: 8,
  },
  PRIVACY_WORK_TYPE: {
    ADD_CLIENT:      1,
    EDIT_CLIENT:     2,
    DELETE_CLIENT:   3,
    GET_CLIENT:      4,
    GET_CLIENT_LIST: 5,
    SEARCH_CLIENTS:  6,

    SEARCH_DUPLICATED_CLIENTS:    11,
    DELETE_OF_DUPLICATED_CLIENTS: 12,

    SEARCH_DELETED_CLIENTS: 21,
    RECOVER_CLIENT:         22,
    CLIENT_COMPLETELY:      23,

    SEARCH_CLIENT_MANAGEMENT:            31,
    EXCEL_DOWNLOAD_OF_CLIENT_MANAGEMENT: 32,

    SEARCH_TARGET_CLIENT_OF_CAMPAIGN: 41,

    OUTSTANDING_BY_CLIENTS:                51,
    EXCEL_DOWNLOAD_OF_DOWNLOAD_MANAGEMENT: 52,
  },
  DOWNLOAD_TYPE: {
    NONE:    0,
    DATA:    1,
    HISTORY: 2,
  },
}

export const STAFFS_ENUMS = {
  STAFF_TYPE: {
    WORKING_HOUR: '/WorkingHour',
    ACTIVE:       '/Active',
  },
  SEARCH_CONDITION: {
    ALIAS:     1,
    FULL_NAME: 2,
  },
  STATUS: {
    LIST_DEFAULT: 0,
    ALL:          0,
    ACTIVE:       1,
    INACTIVE:     2,
  },
  FULLNAME: {
    SAME_AS_ALIAS:    1,
    NO_SAME_AS_ALIAS: 2,
  },
  TIME_CLOCK_IN_TYPE: {
    NONE:    0,
    ON_TIME: 1,
    TARDY:   2,
  },
  TIME_CLOCK_OUT_TYPE: {
    NONE:        0,
    ON_TIME:     1,
    LEAVE_EARLY: 2,
  },
  TIME_CLOCK_ATTEND_TYPE: {
    CHECK_IN:  1,
    CHECK_OUT: 2,
    ABSENT:    3,
  },
}

export const SALES_ERROR_CODES = {
  SA101C: 'SA101C',
}

export const SALES_ENUMS = {
  CLIENT_SEARCH_CONDITION: {
    NAME_OR_MOBILE:   1,
    NAME_OR_MEMER_NO: 2,
    NOTES:            3,
  },
  DISCOUNT_TYPE: {
    PERCENT: 1,
    AMOUNT:  2,
  },
  GOODS_TYPE: {
    PRODUCT:         1,
    SERVICE:         2,
    PREPAID_SERVICE: 3,
    PREPAID_CARD:    4,
    OUTSTANDING:     5,
  },

}

export const PAGE_MODAL_CHECK = {
  PAGE:  1,
  MODAL: 2,
}

export const COUNTRY = {
  KR: 'KR',
  CN: 'CN',
  VN: 'VN',
}
export const COUNTRY_CODE_TYPE = {
  KOREA:   { NAME: 'KOREA', CODE: 'KR' },
  VIETNAM: { NAME: 'VIETNAM', CODE: 'VN' },
  CHINA:   { NAME: 'CHINA', CODE: 'CN' },
}
export const TYPE_DATE = {
  DATE:       1,
  DATE_RANGE: 2,
}
export const WAITING_STATUS = {
  NEW_WAITING:    1,
  ADD_TO_BOOKING: 2,
  CANCELED:       3,
}
export const NUMBER_ITEM_WAITING = {
  IN_CALENDAR: 5,
}
export const CALENDAR_VIEW_MODE = {
  DAILY:                1,
  RESOURCE_ONE_WEEK:    4,
  VIEW_ALL:             1,
  VIEW_BY_RESOURCE:     4,
  VIEW_RESOURCE_1_WEEK: 7,
}
export const CALENDAR_CELL_MODE = {
  ADD_BOOKING:              1,
  MOVE_BOOKING:             2,
  ADD_BLOCKED_TIME:         3,
  ADD_BOOKING_FROM_WAITING: 4,
}
export const CALENDAR_MAX_COLS = 21
export const CALENDAR_FIRST_COL_WIDTH = 80
export const CALENDAR_FIRST_COL_WIDTH_MOBILE = 50
export const TIME_SLOT_WIDTH = 150
export const TIME_SLOT_WIDTH_MOBILE = 24
export const BROWSER_SCROLL = 17
export const IPAD_MAX_WIDTH = 991.98
export const MOBILE_MAX_WIDTH = 767.98
export const MOBILE_PORTRAIT_MAX_WIDTH = 575.98
export const DESKTOP_MIN_WIDTH = 1199.98

export const MISC_CODE = {
  PAYMENT_METHOD:         1,
  SALES_TYPE:             2,
  DISCOUNT_CATEGORY:      3,
  CLIENT_GROUP:           4,
  CLIENT_RATING:          5,
  CLIENT_REFERRAL_SOURCE: 6,
  MY_MESSAGE_CATEGORY:    7,
}
export const CAN_NOT_CANCEL_REASON = {
  CHECKED_OUT_BOOKING:          0,
  PAID_DEPOSIT_BOOKING:         1,
  PAID_AND_CHECKED_OUT_BOOKING: 2,
}
export const ERROR_VALUE_TYPES = {
  DATE:         1,
  START_TIME:   2,
  END_TIME:     3,
  RESOURCES:    4,
  PERFORMANCES: 5,
}

export const CLIENTS_DATA_MANAGEMENT = {
  ACTION: {
    DOWNLOAD:   2,
    CHECK_DATA: 1,
  },

  OPTION: {
    SALES_HISTORY:                2,
    CLIENT_INFORMATION:           1,
    CLIENT_WITH_PREPAID_CARDS:    3,
    CLIENT_WITH_PREPAID_SERVICES: 4,
  },
}

export const CLIENT_ERROR_CODES = {
  CDS01R: 'CDS01R',
  CDS02R: 'CDS02R',
  CDS04R: 'CDS04R',
  CLN02R: 'CLN02R',
}

export const BOOKING_ERROR_CODES = {
  BK15C: 'BK15C',
  BK45C: 'BK45C',
  BK44C: 'BK44C',
  BK36C: 'BK36C',
  BK35C: 'BK35C',
  BK46C: 'BK46C',
  BK48C: 'BK48C',
  BK47C: 'BK47C',
  BK49C: 'BK49C',
  BK30C: 'BK30C',
  BK31C: 'BK31C',
  BK52C: 'BK52C',
  BK43C: 'BK43C',
}

export const BLOCKED_TIME_ERROR_CODES = {
  BT11C: 'BT11C',
  BT12C: 'BT12C',
  BT13C: 'BT13C',
  BT14C: 'BT14C',
  BT17C: 'BT17C',
  BT18C: 'BT18C',
  BT19C: 'BT19C',
}
export const WAITING_ERROR_CODES = {
  WT15C: 'WT15C',
  WT16C: 'WT16C',
  WT17C: 'WT17C',
  WT18C: 'WT18C',
  WT19C: 'WT19C',
  WT20C: 'WT20C',
  WT21C: 'WT21C',
}
export const BOOKING_SETUP_ERROR_CODES = {
  RS05C:  'RS05C',
  BDD01R: 'BDD01R',
  RS08C:  'RS08C',
}

export const LOGIN_ERROR_CODES = {
  UA14C:  'UA14C',
  UA01R:  'UA01R',
  UA28C:  'UA28C',
  UA29C:  'UA29C',
  TLS02R: 'TLS02R',
  IDT04A: 'IDT04A',
  IDT05A: 'IDT05A',
  IDT06A: 'IDT06A',
  IDT07A: 'IDT07A',
  IDT08A: 'IDT08A',
  IDT09A: 'IDT09A',
  IDT11A: 'IDT11A',
}

export const STAFF_ERROR_CODES = {
  TMC04C:    'TMC04C',
  STFERC005: 'STFERC005',
  STFERC006: 'STFERC006',
}

export const FIND_ID_PASSWORD_ERROR_CODES = {
  SHP01R: 'SHP01R',
  SHP03R: 'SHP03R',
  IDT13A: 'IDT13A',
  UA01R:  'UA01R',
  IDT18A: 'IDT18A',
}

export const PAYROLL_ERROR_CODES = {
  /**@description staff not exist payroll */
  SBS03C: 'SBS03C',
}

export const ADMIN_ENUMS = {
  TAX_INVOICE_REQUEST: {
    REQUIRED:     1,
    NOT_REQUIRED: 2,
    NOT_SELETED:  3,
  },
  ISSUE_BASE_ON_TYPE: {
    INPUT_BASE: 1,
    SALES_BASE: 2,
  },
  SALES_TYPE: {
    NONE:           1,
    INBOUND_CHAIN:  2,
    INBOUND_SHOP:   3,
    OUTBOUNT_CHAIN: 4,
    OUTBOUNT_SHOP:  5,
    NOT_SELECTED:   6,
  },
  AUTO_TRANSFER_ARS_STATUS: {
    NONE:                   1,
    ACCEPTING:              2,
    VERIFICATION_COMPLETED: 3,
    VERIFICATION_FAILURE:   4,
  },
  CONTRACT_DISCOUNT_TYPE: {
    NONE:              1,
    MONTHLY_DISCOUNT:  2,
    ONE_TIME_DISCOUNT: 3,
  },
  BILLING_TYPE: {
    EACH:         1,
    CONSOLIDATED: 2,
    DEPENDING:    3,
  },
  WAIVED_MONTHLY_FEE: {
    WAIVED:     1,
    NOT_WAIVED: 2,
  },
}

export const ADMIN_SALES_ENUMS = {
  PAYMENT_PURPOSE: {
    NETMONEY_CHARGE: 1,
    BASE_FEE:        2,
  },
  PAYMENT_METHOD: {
    DEPOSITLESS_VIRTUAL:     1,
    DEPOSITLESS:             2,
    CARD:                    3,
    REAL_TIME_BANK_TRANSFER: 4,
    KAKAO_PAY:               5,
    AUTOMATIC_TRANSFER:      6,
    NETMONEY:                7,
  },
  PG: {
    LGUPLUS: 'uplus',
  },
  ONLINE_PAYMETHOD: {
    CARD:                       'AC',
    REAL_TIME_ACCOUNT_TRANSFER: 'AA',
    VIRTUAL_ACCOUNT:            'AS',
  },
  ONLINE_PAYMENT_STATUS: {
    PREPARED:    1,
    IN_PROGRESS: 2,
    AWAITING:    3,
    PAID:        4,
    FAILED:      5,
    CANCELLED:   6,
  },
  IAMPORT_PAY_METHOD: {
    CARD:                       'card',
    REAL_TIME_ACCOUNT_TRANSFER: 'tran',
    VIRTUAL_ACCOUNT:            'vbank',
  },
  BANK_TRANSFER_NOTICE_LINK_TYPE: {
    NETMONEY:           1,
    BASEFEE:            2,
    BASEFEEANDNETMONEY: 3,
  },
  DROPDOWN_LIST_TYPE: {
    // AdminSales
    PAYMENT_METHOD:  1,
    BANK_ACCOUNT:    2,
    SALES_ITEM_TYPE: 3,
  },
  NETMONEY_VARIATION: {
    CHARGE: 1,
    USED:   2,
  },
  NETMONEY_SOURCE_TYPE: {
    MANUAL:      1,
    ADMIN_SALES: 2,
    BASE_FEE:    3,
    TEXT_SEND:   4,
    TEXT_REFUND: 5,
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
}

export const BOARDS_ENUMS = {
  POPUP_VIEW: 'popup-view',
  BOARD_TYPE: {
    SYS_NOTICE: 'SYSNOTICE',
    SYS_BOARD:  'SYSBOARD',
    CHN_NOTICE: 'CHNNOTICE',
    CHN_BOARD:  'CHNBOARD',
  },
  LINK_TYPE: {
    SYS_NOTICE: '/boards/SYSNOTICE',
    SYS_BOARD:  '/boards/SYSBOARD',
    CHN_NOTICE: '/boards/CHNNOTICE',
    CHN_BOARD:  '/boards/CHNBOARD',
  },
  BOARD_GROUP_TYPE: {
    NOTICE:     1,
    BOARD:      2,
    CHN_NOTICE: 3,
    CHN_BOARD:  4,
  },
  SEARCH_BOARD_TYPE: {
    TITLE:  1,
    WRITER: 2,
  },
  MANUAL_TYPE: {
    ALL:         0,
    BASIC:       1,
    APPLICATION: 2,
    VIDEO:       3,
  },
  NEVER_SEE_PERIOD: {
    DAY:     1,
    WEEK:    2,
    NO:      3,
    FOREVER: 4,
  },
  LINK_TARGET: {
    PARENT: 1,
    NEW:    2,
  },
  BRANCH_BOARD_TYPE: {
    NONE:               0,
    HEAD_TO_ONE_BRANCH: 1,
    SHARE_ALL:          2,
  },
  BOARD_CODE: {
    SYSBOARD:  'SYSBOARD',
    SYSNOTICE: 'SYSNOTICE',
    POPUP:     'POPUp',
  },
  BRANCH_TYPE: {
    HEADQUATER: 1,
    BRANCH:     2,
  },
  POPUP_NEVER_USE: {
    PROVIDED:     1,
    NOT_PROVIDED: 2,
  },
}

export const MESSAGES_ENUMS = {
  SPAM_INFO_POPUP_VIEW: 'spam-info-popup',
  MESSAGE_TYPE:         {
    SMS: 1,
    LMS: 2,
    MMS: 3,
    KAO: 4,
  },
  MESSAGE_STATUS: {
    NOT_SENT:       0,
    SEND_FAIL:      1,
    WAITING_RESULT: 2,
    RESULT_FAIL:    3,
    RESULT_SUCCESS: 4,
  },
  MESSAGE_STATUS_SEARCH: {
    ALL:     0,
    SUCCESS: 1,
    FAIL:    2,
  },
  MESSAGE_RESULT_COL: {
    WAITING_SENDING: 0,
    SUCCESS:         1,
    FAIL:            2,
    WAITING_RESULT:  3,
  },
  MMS_TYPE: {
    TEXT:  1,
    IMAGE: 2,
  },
  MESSAGE_SOURCE_TYPE: {
    NONE:              0,
    BOOKING:           1,
    SALES:             2,
    CLIENT:            3,
    G_ORDER_BY_BRANCH: 4,
  },
  SEND_TYPE: {
    MANUAL: 1,
    AUTO:   2,
    BATCH:  3,
  },
  SEND_PAGE: {
    CLIENT:                  1,
    UNREGISTER_CLIENTS:      2,
    CID_UNREGISTER_CLIENT:   3,
    MULTI_BOOKING:           4,
    CLIENT_MANAGEMENT:       5,
    UNREGISTER_CLIENT:       6,
    CAMPAIGN:                7,
    DEPOSIT_GUIDE:           8,
    DEPOSIT_PAYMENT_CONFIRM: 9,
    CONSENT_FORM:            10,
  },
  TEXT_SAMPLE_GROUP_TYPE: {
    AREA:          1,
    BUSINESS_TYPE: 2,
  },
  HELP_SEND_TEXT: {
    CHARACTER:  1,
    EMOTICON:   2,
    MY_MESSAGE: 3,
    SAMPLE:     4,
    VARIABLE:   5,
    SETTING:    6,
    PREVIEW:    7,
  },
  LIST_TYPE: {
    SAMPLE:     1,
    MY_MESSAGE: 2,
  },
  SETUP_AUTOMATIC_MESSAGING_TAB: {
    BOOKING:           0,
    SALES:             1,
    VISIT_THANK_YOU:   2,
    POST_VISIT:        3,
    // REVISIT_ENCOURAGEMENT : 4,
    POST_SERVICE_CARE: 4,
    CLIENT:            5,
  },
  SETUP_AUTOMATIC_MESSAGING_TAB_NAME: {
    BOOKING:               'Booking',
    SALES:                 'Sales',
    POST_VISIT:            'PostVisit',
    CLIENT:                'Client',
    VISIT_THANK_YOU:       'VisitThankYou',
    REVISIT_ENCOURAGEMENT: 'ReVisitEncouragement',
    POST_SERVICE_CARE:     'PostServiceCare',
  },
  SETUP_AUTOMATIC_MESSAGING_TYPE: {
    BIRTHDAY_GREETINGS:                          51,
    POINTS_ADD:                                  1,
    POINTS_DEDUCTION:                            2,
    BALANCE_ADD:                                 3,
    BALANCE_DEDUCTION:                           4,
    PREPAID_CARD_EXPIRY_DATE_REMINDER_FIRST:     5,
    PREPAID_CARD_EXPIRY_DATE_REMINDER_SECOND:    6,
    PREPAID_CARD_EXPIRY_DATE_REMINDER_THIRD:     7,
    PREPAID_SERVICE_QUANTITY_ADD:                8,
    PREPAID_SERVICE_QUANTITY_DEDUCTION:          9,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER_FIRST:  10,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER_SECOND: 11,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER_THIRD:  12,
    PREPAID_CARD_EXPIRY_DATE_REMINDER:           20,
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER:        21,
    BOOKING:                                     {
      THE_DAY_BEFORE:              1,
      ON_THE_DAY:                  2,
      HOURS_BEFORE:                3,
      REGISTERED:                  4,
      ONLINE_CONFIRM:              5,
      CANCELED:                    6,
      ONLINE_CANCEL:               7,
      SELECTION_DATE_NOTIFICATION: 8,
      DEPOSIT_GUIDE:               9,
      DEPOSIT_PAYMENT_CONFIRM:     10,
    },
  },
  SETUP_AUTOMATIC_MESSAGING_SAMPLES_CODE: {
    CONSENT_SETUP: 'A_CL_CN',

    BIRTHDAY_GREETINGS: 'A_CL_B',

    POINTS_ADD:                           'A_SL_PA',
    POINTS_DEDUCTION:                     'A_SL_PD',
    BALANCE_ADD:                          'A_SL_PCA',
    BALANCE_DEDUCTION:                    'A_SL_PCD',
    PREPAID_SERVICE_QUANTITY_ADD:         'A_SL_PSA',
    PREPAID_SERVICE_QUANTITY_DEDUCTION:   'A_SL_PSD',
    PREPAID_CARD_EXPIRY_DATE_REMINDER:    'A_SL_PCE',
    PREPAID_SERVICE_EXPIRY_DATE_REMINDER: 'A_SL_PSE',
    BOOKING:                              {
      THE_DAY_BEFORE:              'A_BK_RB',
      ON_THE_DAY:                  'A_BK_RD',
      HOURS_BEFORE:                'A_BK_RT',
      REGISTERED:                  'A_BK_I',
      ONLINE_CONFIRM:              'A_BK_OI',
      CANCELED:                    'A_BK_C',
      ONLINE_CANCEL:               'A_BK_OC',
      SELECTION_DATE_NOTIFICATION: 'A_BK_SD',
      DEPOSIT_GUIDE:               'A_BK_DG',
      DEPOSIT_PAYMENT_CONFIRM:     'A_BK_DP',
    },

    VISIT_THANK_YOU:   'A_PV_VT',
    POST_VISIT:        'A_PV_PV',
    POST_SERVICE_CARE: 'A_PV_SC',
  },
  LINK_TYPE:                       '/messages/setup-automatic',
  SENDER_PHONE_CERTIFICATION_TYPE: {
    NONE:         1,
    MOBILE_PHONE: 2,
    ARS:          3,
    DOCUMENT:     4,
  },
  SENDER_PHONE_CERTIFICATION_SEND_TYPE: {
    NONE:  0,
    FILE:  1,
    FAX:   2,
    EMAIL: 3,
  },
  SENDER_PHONE_CERTIFICATION_STATUS: {
    APPROVED:  0,
    REQUESTED: 1,
    REJECTED:  2,
  },
  VISIT_TYPE: {
    BY_SALES_CATEGORY: 1,
    BY_SALES:          2,
  },
  VISIT_COUNT_TYPE: {
    NONE:           0,
    FIRST_VISIT:    1,
    RE_VISIT:       2,
    FIRST_RE_VISIT: 3,
  },
  TEXT_UNSUBSCRIBE_SEARCH_TYPE: {
    SEARCH_IN_CLIENT:    1,
    REFUSE_TEXT_MESSAGE: 2,
  },
  SPAM_TYPE: {
    FILTERING_INFO: 1,
    HOW_TO_WRITE:   2,
  },
  SPAM_IMAGE_PATH: {
    FILTERING_INFO: '../../../template/images/spam/pop_msgspam.jpg',
    HOW_TO_WRITE:   '../../../template/images/spam/pop_msgguide.jpg',
  },
  ALERT_TYPE: {
    NONE:                0,
    DELETE:              1,
    CHECK_CHANGES:       2,
    MESSAGE_TYPE_CHANGE: 3,
    DUPLICATED_CREATE:   4,
  },
  MESSAGE_SOLUTION_TYPE: {
    MESSAGE_HUB:   'MessageHub',
    SEND_MESSAGES: 'SendMessages',
  },
  SEND_SYSTEM_TYPE: {
    TEXT_MESSAGE: 1,
    ALIMTALK:     2,
  },
  REPLACE_TYPE: {
    NONE:     0,
    ORIGINAL: 1,
    REPLACED: 2,
  },
  POST_VISIT_TYPE: {
    VISIT_THANK_YOU:            0,
    RE_VISIT_BY_SALES:          1,
    RE_VISIT_BY_SALES_CATEGORY: 2,
    SERVICE_CARE:               3,
  },
}

export const COMMON_STATUS = {
  ALL:      0,
  ACTIVE:   1,
  INACTIVE: 2,
}

export const LANGUAGE_TYPE = {
  ENGLISH: { NAME: 'English', LANGUAGE: 'EN' },
  KOREAN:  { NAME: 'Korean', LANGUAGE: 'KO' },
}

export const CULTURE_TYPE = {
  ENGLISH: 'culture=en-US&ui-culture=en-US',
  KOREAN:  'culture=ko-KR&ui-culture=ko-KR',
}

export const CID_USAGE_STATUS = {
  ACTIVE:   1,
  INACTIVE: 2,
}

export const CID_ENUMS={
  CID_POPUP_VIEW:    'cid-receive-call-popup',
  CID_CLIENT_ACTION: 'add-client-from-cid',
}

export const CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS = {
  SELECT:                           0,
  ALL_CLIENTS:                      1,
  DORMANT_CLIENTS:                  2,
  CLIENTS_BY_SALES_SERVICE:         3,
  CLIENTS_BY_SALES_PRODUCT:         4,
  CLIENTS_BY_SALES_AMOUNT:          5,
  CLIENTS_BY_PREPAID_CARDS:         6,
  CLIENTS_BY_PREPAID_SERVICES:      7,
  BIRTHDAY_CLIENTS:                 8,
  RECOMMENDED_CLIENTS:              9,
  CLIENTS_WITH_VALID_PREPAID_GOODS: 10,
  CLIENTS_WITH_NO_PREPAID_GOODS:    11,
}

export const CLIENTS_WITH_VALID_PREPAID_GOODS_ENUMS = {
  ALL:             -1,
  PREPAID_CARD:    1,
  PREPAID_SERVICE: 2,
}

export const CLIENTS_WITH_NO_VALID_PREPAID_GOODS_ENUMS = {
  ALL:                   -1,
  WITH_PREPAID_GOODS:    1,
  WITH_NO_PREPAID_GOODS: 2,
}

export const CLIENT_MANAGEMENT_SALES_DATE_TYPE = {
  ALL:        1,
  DATE_RANGE: 2,
}

export const CLIENT_MANAGEMENT_RECENT_VISITED_DATE_TYPE = {
  NOT_VISITED_MORE_THAN: 0,
  VISITED_FOR_LAST:      1,
  DATE_RANGE:            2,
  NO_RECENT_VISIT_DAY:   3,
}

export const LOCAL_TIME_ZONE = {
  KR: 9,
  VN: 7,
}

export const PRIORITY_DISPLAY_CLIENT_PREPAID_GOODS = {
  DO_NOT_APPLY:                         0,
  APPLY_PREPAID_SERVICE_ONLY:           1,
  APPLY_PREPAID_CARD_ONLY:              2,
  PREPAID_SERVICE_FIRST:                3,
  PREPAID_CARD_FIRST:                   4,
  SAME_AS_CLIENT_WITH_NO_PREPAID_GOODS: 5,
}

export const CONNECT_CLIENT_TYPE = {
  SALE:    1,
  BOOKING: 2,
}

export const BOOKING_ITEM_TYPE = {
  SERVICE_ITEM: 1,
  BOOKING_ITEM: 2,
}

export const USER_ACCOUNT_ACTIONS = {
  PASSWORD_EDIT:   1,
  BASIC_INFO_EDIT: 2,
}

// UI
export const MINIMUM_LOADING_ANIMATION_TIME = 200

export const DISPLAY_TYPE = {
  CATEGORY: 1,
  SERVICE:  2,
}

export const FIND_LOGIN_INFO_TYPE = {
  USERID:   'USERID',
  PASSWORD: 'PASSWORD',
}

export const CALL_CENTER_NUMBER = {
  KOREA:   '1544-4634',
  VIETNAM: '1234-5678',
}

export const MAX_NUMBER_OF_COSMOS_DB = 9007199254740991

export const MOBILE_CERTIFICATION_VERIFICATION_ERROR_CODES = {
  IMC01R: 'IMC01R',
  IMC02R: 'IMC02R',
  IMC03R: 'IMC03R',
}
export const CHECK_OWNER_USER_ID_ERROR_CODES= {
  IDT17A: 'IDT17A',
}

export const CLIENT_STATUS = {
  ACTIVE:             1,
  UNCOMPLETED_DELETE: 2,
}

export const PRINT_PREVIEW_WORKER_ACTION_TYPES = {
  PREPAID_CARDS_BY_CLIENTS:        1,
  PREPAID_CARD_SUMMARY:            2,
  PREPAID_SERVICES_BY_CLIENT:      3,
  LOYALTY_POINTS_BY_CLIENT:        4,
  BOOKING_LIST_CALENDAR:           5,
  SALES_HISTORY:                   6,
  BOOKING_DEPOSIT_LIST:            7,
  STAFF_MISMATCH_HISTORY:          8,
  SALES_TRANSFER_HISTORY:          9,
  PREPAID_GOODS_SALES:             10,
  STOCK_INTERNAL_USE:              11,
  STOCK_ADJUSTMENT:                12,
  STOCK_HISTORY:                   13,
  STOCK_STATUS:                    14,
  RECEIVINGS:                      15,
  BOOKING_DEPOSIT_BEFORE_PAYMENT:  16,
  BOOKING_DEPOSIT_PAYMENT_HISTORY: 17,
  BOOKING_LIST_CALENDAR_V2:        18,
  TIME_CLOCK:                      19,
  SALES_TRANSFER_STAFF_HISTORY:    20,
  PREPAID_SERVICES_SUMNARY:        21,
  PRODUCTS:                        22,
  CLIENT_TRANSFER:                 23,
  EXPENDITURE_HISTORY:             24,
}

export const PRINT_WORKER_ACTION_TYPE = {
  SALES_HISTORY:                2,
  CLIENT_MANAGEMENT:            5,
  CLIENTS_INFORMATION:          1,
  CLIENT_WITH_PREPAID_CARDS:    3,
  CLIENT_WITH_PREPAID_SERVICES: 4,
}

export const VIEW_TABLE_TYPES = {
  OTHER:  1,
  CLIENT: 2,
}

export const PRODUCT_CODE_SETUP_TYPE = {
  AUTO:   1,
  MANUAL: 2,
}

export const APP_API_STATUS = {
  SERVER_MAINTENANCE:   503,
  SERVICE_MAINTENANCE:  403,
  SERVICE_UNAUTHORIZED: 401,
}

export const API_ERROR_CODES = {
  API_SERVICE_UNAUTHORIZED:    'API_SERVICE_UNAUTHORIZED',
  ERR_INVALID_REQUEST_CONTENT: 'ERR_INVALID_REQUEST_CONTENT',
}

export const MENU_CODE = {
  // Sales codes
  SA_SAL_01: 'SA_SAL_01',
  SA_SAL_02: 'SA_SAL_02',
  SA_SAL_03: 'SA_SAL_03',
  SA_SAL_04: 'SA_SAL_04',
  SA_SAL_05: 'SA_SAL_05',
  SA_SAL_06: 'SA_SAL_06',
  SA_SAL_07: 'SA_SAL_07',
  SA_SAL_09: 'SA_SAL_09',
  SA_SAL_10: 'SA_SAL_10',
  SA_SAL_11: 'SA_SAL_11',
  SA_SAL_12: 'SA_SAL_12',
  SA_SAL_13: 'SA_SAL_13',

  // Client codes
  SA_CLN_01: 'SA_CLN_01',
  SA_CLN_02: 'SA_CLN_02',
  SA_CLN_03: 'SA_CLN_03',
  SA_CLN_04: 'SA_CLN_04',
  SA_CLN_05: 'SA_CLN_05',
  SA_CLN_06: 'SA_CLN_06',
  SA_CLN_07: 'SA_CLN_07',
  SA_CLN_09: 'SA_CLN_09',
  SA_CLN_10: 'SA_CLN_10',
  SA_CLN_11: 'SA_CLN_11',
  SA_CLN_12: 'SA_CLN_12',
  SA_CLN_13: 'SA_CLN_13',
  SA_CLN_14: 'SA_CLN_14',
  SA_CLN_15: 'SA_CLN_15',

  // Staff codes
  SA_STF_01: 'SA_STF_01',
  SA_STF_02: 'SA_STF_02',
  SA_STF_03: 'SA_STF_03',
  SA_STF_04: 'SA_STF_04',
  SA_STF_05: 'SA_STF_05',
  SA_STF_06: 'SA_STF_06',

  // Inventory codes
  SA_INT_01: 'SA_INT_01',
  SA_INT_02: 'SA_INT_02',
  SA_INT_03: 'SA_INT_03',
  SA_INT_04: 'SA_INT_04',
  SA_INT_05: 'SA_INT_05',
  SA_INT_06: 'SA_INT_06',
  SA_INT_07: 'SA_INT_07',
  SA_INT_08: 'SA_INT_08',
  SA_INT_09: 'SA_INT_09',

  // Expenditure codes
  SA_EXP_01: 'SA_EXP_01',
  SA_EXP_02: 'SA_EXP_02',
  SA_EXP_04: 'SA_EXP_04',
  SA_EXP_05: 'SA_EXP_05',
  SA_EXP_06: 'SA_EXP_06',

  // Report codes
  SA_REP_01: 'SA_REP_01',
  SA_REP_02: 'SA_REP_02',
  SA_REP_03: 'SA_REP_03',

  // Setup codes
  SA_SET_01: 'SA_SET_01',
  SA_SET_02: 'SA_SET_02',
  SA_SET_03: 'SA_SET_03',
  SA_SET_04: 'SA_SET_04',
  SA_SET_05: 'SA_SET_05',
  SA_SET_06: 'SA_SET_06',
  SA_SET_07: 'SA_SET_07',
  SA_SET_08: 'SA_SET_08',
  SA_SET_09: 'SA_SET_09',
  SA_SET_10: 'SA_SET_10',
  SA_SET_11: 'SA_SET_11',
  SA_SET_12: 'SA_SET_12',
  SA_SET_13: 'SA_SET_13',
  SA_SET_14: 'SA_SET_14',
  SA_SET_15: 'SA_SET_15',

  // Account codes
  SA_ACC_01: 'SA_ACC_01',
  SA_ACC_02: 'SA_ACC_02',
  SA_ACC_03: 'SA_ACC_03',
  SA_ACC_04: 'SA_ACC_04',
  SA_ACC_05: 'SA_ACC_05',
  SA_ACC_06: 'SA_ACC_06',
  SA_ACC_07: 'SA_ACC_07',
  SA_ACC_08: 'SA_ACC_08',
  SA_ACC_09: 'SA_ACC_09',
  SA_ACC_10: 'SA_ACC_10',

  // Support codes
  SA_SUP_01: 'SA_SUP_01',
  SA_SUP_02: 'SA_SUP_02',
  SA_SUP_03: 'SA_SUP_03',
  SA_SUP_04: 'SA_SUP_04',
  SA_SUP_05: 'SA_SUP_05',
  SA_SUP_06: 'SA_SUP_06',
  SA_SUP_07: 'SA_SUP_07',
  SA_SUP_08: 'SA_SUP_08',
  SA_SUP_09: 'SA_SUP_09',
  SA_SUP_10: 'SA_SUP_10',
  SA_SUP_11: 'SA_SUP_11',

  // Help code
  SA_HELP_01: 'SA_HELP_01',
}

export const SALES_MISC_CODE_SOURCE_TYPE = {
  USER_DEFINED:    0,
  SYSTEM_RESERVED: 1,
}

export const PREPAID_CARD_HISTORY_STATUS = {
  NONE:    0,
  DELETED: 2,
}

export const LOCAL_STORAGE_NAME = {
  CID_IS_USE_ALL_BROWSER:       'cidIsUseAllBrowser',
  CID_SET_SEPECIFIC_BROWSER:    'cidSetSpecificBrowser',
  HOME_TAX_INVOICE_MODAL:       'home-tax-invoice-modal',
  HOME_TEXT_SENDER_PHONE_MODAL: 'home-text-sender-phone-modal',
}
export const CID_LG_CENTREX_ERROR_CODES = {
  LGC1: 'LGC1',
  LGC2: 'LGC2',
  LGC3: 'LGC3',
  LGC4: 'LGC4',
  LGC5: 'LGC5',
}

export const NAVER_LINK = {
  CONNECTED_STATE: {
    CONNECTED:    1,
    DISCONNECTED: 0,
  },
  VALID_BOOKING_TIMESLOT_INTERVALS:   [10, 15, 30],
  INVALID_BOOKING_TIMESLOT_INTERVALS: 5,
  API_ERROR_CODES:                    {
    ALREADY_CONNECTED_BUSINESS_SHOP:    'BNE07C',
    ALREADY_DISCONNECTED_BUSINESS_SHOP: 'BNE09C',
    ALREADY_CONNECTED_RESOURCE:         'BNE08C',
    ALREADY_DISCONNECTED_RESOURCE:      'BNE10C',
    ALREADY_CONNECTED_SERVICE_EXACTLY:  'NV08C',
    ALREADY_DISCONNECTED_SERVICE:       'NV09C',
    ALREADY_CONNECTED_SERVICE:          'NV10C',
    ALREADY_CONNECTED_SERVICES:         'NVEC09A',
  },
  UNSPECIFIED_CATEGORY_TYPE_CODE: 'NONE',
}

export const AUTOMATIC_MERGE_BALANCE = {
  DO_NOT_AUTOMATIC_MERGE: 0,
  AUTOMATIC_MERGE:        1,
}

export const EXTERNAL_SYSTEM_REFUND_TYPE = {
  NAVER_STANDARD: 0,
  NAVER_RATE:     1,
  NAVER_PRICE:    2,
  NAVER_ALL:      3,
}

export const EXTERNAL_SYSTEM_REFUND_PAYMENT = {
  API_ERROR_CODES: {
    REFUND_RATE_HAS_NOT_SETUP_YET: 'NVEC18A',
  },
}

export const EXTERNAL_SYSTEM_BUSINESS_CATEGORY = {
  HAIR_SHOP: 'DL07',
}

export const EXTERNAL_STYLE_KEYWORD = {
  GENDER: {
    MALE:   'MALE',
    FEMALE: 'FEMALE',
  },
  MALE_HAIR_LENGTH_DEFAULT_VALUE:   '미디움',
  FEMALE_HAIR_LENGTH_DEFAULT_VALUE: '롱',
  HAIR_LENGTH_CATEGORY_CODE:        'REQUIRED',
}

export const EXTERNAL_PAYMENT_REQUEST = {
  API_ERROR_CODES: {
    PAYMENT_PROCESSING_HAS_FAILED: 'PROCESS_PAYMENT_FAILED',
  },
}

export const EXTERNAL_SYSTEM_BOOKING_STATUS = {
  CONFIRMED:     1,
  PAID:          2,
  PAY_FAILED:    3,
  PAY_COMPLETED: 4,
  CANCELLED:     5,
  NO_SHOW:       6,
  COMPLETED:     7,
}

export const EXTERNAL_SYSTEM_PAYMENT_STATUS = {
  REGISTERED:               1, //Payment registration
  REQUESTED:                2, //Payment request
  CANCELED:                 3, //Cancel payment request
  CHARGED:                  4, //Payment request (user action)
  DEPOSIT_WAITING:          5, //Deposit without bankbook
  DEPOSIT_WAITING_CANCELED: 6, //Cancellation of waiting for deposit without bankbook
  PAID:                     7, //Complete payment
  REFUNDED:                 8, //Refund completed
  REPAYMENT_REQUESTED:      9,//Request for repayment
  REFUNDED_BY_REPAYMENT:    10, //Refund due to re-payment
  COMPLETED:                11, //purchase confirmation
}

export const BOOKING_RESOURCE_STATUS = {
  ACTIVE:   1,
  INACTIVE: 2,
}

export const SERVICE_TYPE = {
  'SV_PRO': 'booking-resources.professional',
  'SV_PRE': 'booking-resources.premium',
  'SV_ECO': 'booking-resources.economy',
}

export const NO_LIMIT_BOOKING_RESOURCE = -1

export const CELL_HEIGHT_SETTING_DEFAULT = 100
export const CELL_HEIGHT_SETTING_NAME = 'cell-height-percentage'

export const STORAGE_INCLUDE_NAVER_PREPAYMENT = 'includeNaverPrepayment'

export const PAYROLL_SETUP_STAFF_TYPE = {
  LEVEL:   2,
  GENERAL: 1,
}

export const SEARCH_DATE_TYPE = {
  DUE_DATE:            1,
  BOOKING_DATE:        2,
  PAYMENT_DATE:        3,
  BEFORE_PAYMENT_DATE: 4,
}

export const SALES_DISCOUNT_TYPE = {
  NONE:       0,
  AMOUNT:     2,
  PERCENTAGE: 1,
}

export const VALIDATOR_VALUE = {
  MIN_DATE: new Date(1970,0,1),
  /**
   * @description Max date allow 31/12/2100 by the system
   */
  MAX_DATE: new Date(2101,0,1),

  MAX_PHONE_NUMBER:    20,
  MAX_PHONE_NUMBER_KR: 13,

  MAX_MOBILE_PHONE_NUMBER:    12,
  MAX_MOBILE_PHONE_NUMBER_KR: 11,

  MAX_NUMBER_OF_COSMOS_DB: 9007199254740991,
}

export const DATE_FILTER_TYPE = {
  DATE:       1,
  MONTH:      2,
  DATE_RANGE: 3,
}

export const ENVIRONMENT = {
  STAFF_MANAGER_CAN_SEARCH: {
    TODAY_ONLY:  1,
    NO_LIMIT:    9999,
    NOT_ALLOWED: -1,

    TWO_MONTHS:   60,
    THREE_MONTHS: 90,

    DAY_OF_MONTH: 30,
  },
}

export const OPTIONS_CONNECT_CLIENT_SEARCH_CONDITION = {
  ALL:    0,
  NAME:   1,
  MOBILE: 2,
}

export const FILE_IMG_UPLOAD = {
  MILISECONDS_TWO_SECOND: 2000,
  NAME_DEFAULT_IMG:       'image.jpg',
}

export const CONSENT_STATUS_ENUM = {
  ACTIVE:    1,
  IN_ACTIVE: 2,
}

export const CONSENT = {
  MAX_LENGTH_TITLE: 50,
  MAX_LENGTH_NOTE:  5000,
  MAX_ROW_TEXTAREA: 10,
}

export const CONSENT_MESSAGE_STATUS_ENUM = {
  BEFORE_SIGNING: 0,
  MESSAGE_SENT:   1,
  SIGNED:         2,
}

export const NAVER_COUPON_TYPE = {
  AMOUNT: 1,
  RATE:   2,
  GIFT:   3,
}

export const TYPE_ALERT_MODAL = {
  SUCCESS:   'success',
  FAIL:      'fail',
  NOT_VALID: 'not-valid',
}

export const ICON_NAMES = {
  CIRCLE_CHECK: 'circle-check',
  CIRCLE_XMARK: 'circle-xmark',
  TRIANGLE:     'triangle',
}
export const SALES_TRANSFER = {
  TYPE: {
    ALL:             -1,
    PREPAID_CARD:    1,
    PREPAID_SERVICE: 2,
    ETC:             3,
  },

  MAX_VALUE: {
    ROWS:   5,
    RATIO:  100,
    NUMBER: 12,
    NOTES:  500,
  },

  QUANTITY: {
    NO_LIMIT: -1,
  },
}

export const DEDUCTION_TYPE = {
  NONE:            0,
  PREPAID_CARD:    1,
  PREPAID_SERVICE: 2,
  LOYALTY_POINTS:  4,
}

export const SALES_TRANSFER_STAFF_OPTIONS = {
  NEW_STAFF:       1,
  OLD_STAFF:       2,
  SALES_STAFF:     3,
  PREFERRED_STAFF: 4,
}

export const LOGOUT_REASON_ENUM =
{
  CHANGE_PASSWORD:      0,
  SHOP_CHANGED_STATUS:  1,
  SHOP_CHANGED_EXPIRED: 2,
}

export const PREPAID_GOODS_SALES_ENUM = {
  ALL:              -1,
  SALES:            0,
  MY_SHOP:          0,
  DEDUCTION:        1,
  HQ_BRANCH:        1,
  NOT_SELECTED:     0,
  ALL_OTHER_BRANCH: -2,
}

export const LIMIT_CALENDAR_COLS = {
  PC:     21,
  MOBILE: 12,
}

export const NUMBER_OF_DAYS_VIEW_ALL_SETTING_NAME = 'number-of-days-view-all'

export const NUMBER_OF_DAYS_VIEW_BY_RESOURCE_SETTING_NAME = 'number-of-days-view-by-resource'

export const CALENDAR_VIEW_MODE_BY_SHOP_DESKTOP = 'calendar_view_mode_by_shop_desktop'

export const PREPAID_GOODS_TABS = {
  MY_SHOP_SALES:                      'my-shop-sales',
  OTHER_BRANCHES_SALES_TO_MY_CLIENTS: 'other-branches-sales-to-my-clients',
}

export const DEFAULT_FILTER_OPTIONS = {
  ALL_OTHER_BRANCHES: -2,
  ALL:                -1,
  NOT_SELECTED:       0,
  MY_SHOP:            0,
}

export const BRANCH_TYPE = {
  HEADQUARTER: 1,
  BRANCH:      2,
}

export const VIEW_TYPE = {
  ALLOW:     1,
  NOT_ALLOW: 0,
}
export const FAMILY_SORT_FIELD = {
  REGISTRATION_DATE: 1,
  FAMILY_POINTS:     3,
  FAMILY_BALANCE:    2,
}

export const ERROR_CODES = {
  NOT_OLD_SHOP: 'AOS01A',
}

export const SUPPLEMENT_TYPE = {
  CONTENT:         0,
  OPENED_ENDED:    1,
  SINGLE_CHOICE:   2,
  MULTIPLE_CHOICE: 3,
}
export const PREPAID_SERVICE_ACTION = {
  SELECT:   'select',
  UNSELECT: 'unselect',
}
export const CONSENT_TARGET_TYPE = {
  CONTENT: null,
  CLIENT:  0,
  STORE:   1,
}

export const CONSENT_SUPPLEMENT_TYPE = {
  CONTENT:         0,
  OPEN_ENDED:      1,
  SINGLE_CHOICE:   2,
  MULTIPLE_CHOICE: 3,
}

export const CONSENT_QUESTION_TYPE = {
  CONTENT:         0,
  SHOP_INPUT:      1,
  CLIENT_QUESTION: 2,
}

export const CONSENT_INPUT = {
  MAX_LENGTH_TITLE:           50,
  MAX_LENGTH_CONTENT:         5000,
  MAX_LENGTH_QUESTION:        500,
  MAX_LENGTH_QUESTION_CHOICE: 200,
  MAX_LENGTH_ANSWER:          500,
  MAX_ROW_TEXTAREA:           5,
}

export const CONSENT_STATUS = {
  ACTIVE:    1,
  IN_ACTIVE: 2,
}

export const CONSENT_ACTION_AREA = {
  UP:   'UP',
  DOWN: 'DOWN',
}

export const REFUND_TYPE = {
  NONE:         0,
  NAVER_RATE:   1,
  DIRECT_INPUT: 2,
  WHOLE_AMOUNT: 3,
}

export const BOOKING_REPORT_SOURCE = {
  ALL:          -1,
  ADMINISTATOR: 1,
  NAVER:        3,
}

export const ACTIVE_TAB = {
  PAID:     'paid',
  NOT_PAID: 'not-paid',
  SETUP:    'setup',
}

// Feature type enum
export const FEATURE_TYPE = Object.freeze({
  USER_ACCOUNT:      1,
  CLIENT_MANAGEMENT: 2,
})

// Section keys
export const KEYS = Object.freeze({
  SECTIONS: {
    CLIENTS:             'clients' ,
    CLIENT_MANAGEMENT:   'menu.client-management' ,
    USER_ACCOUNTS:       'user-accounts' ,
    USER_ACCOUNTS_TITLE: 'menu.id-management' ,
  },
})

export const DOWNLOAD_FEATURE_NAME_ENUM = Object.freeze({
  None:                                       0 ,
  UserAccount_DownloadData:                   1 ,
  ClientManagement_AllClients:                2 ,
  ClientManagement_DormantClients:            3 ,
  ClientManagement_ClientsbySalesService:     4 ,
  ClientManagement_ClientsbySalesProduct:     5 ,
  ClientManagement_ClientsbySalesAmount:      6 ,
  ClientManagement_ClientswithPrepaidGoods:   7 ,
  ClientManagement_ClientsbyPrepaidCard:      8 ,
  ClientManagement_ClientsbyPrepaidService:   9 ,
  ClientManagement_ClientswithnoPrepaidGoods: 10,
  ClientManagement_BirthdayClients:           11,
  ClientManagement_RecommendedClients:        12,
})

const FEATURE_NAME_MAP = {
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.ALL_CLIENTS                     ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_AllClients ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.DORMANT_CLIENTS                 ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_DormantClients ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_SALES_SERVICE        ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbySalesService ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_SALES_PRODUCT        ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbySalesProduct ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_SALES_AMOUNT         ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbySalesAmount ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_WITH_VALID_PREPAID_GOODS]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientswithPrepaidGoods ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_PREPAID_CARDS        ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbyPrepaidCard ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_BY_PREPAID_SERVICES     ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbyPrepaidService ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.CLIENTS_WITH_NO_PREPAID_GOODS   ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientswithnoPrepaidGoods,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.BIRTHDAY_CLIENTS                ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_BirthdayClients ,
  [CLIENT_MANAGEMENT_TARGET_TYPE_ENUMS.RECOMMENDED_CLIENTS             ]: DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_RecommendedClients ,
}

export const getDownloadFeatureNameEnumByTargetType = targetType =>
  FEATURE_NAME_MAP[targetType] || DOWNLOAD_FEATURE_NAME_ENUM.None

export const DOWNLOAD_FEATURE_NAME_ENUM_KEY = {
  [KEYS.SECTIONS.CLIENTS]: {
    [DOWNLOAD_FEATURE_NAME_ENUM.None                                      ]: 'none' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.UserAccount_DownloadData                  ]: 'download-data' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_AllClients               ]: 'all-clients' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_DormantClients           ]: 'dormant-clients' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbySalesService    ]: 'clients-by-sales-service' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbySalesProduct    ]: 'clients-by-sales-product' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbySalesAmount     ]: 'clients-by-sales-amount' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientswithPrepaidGoods  ]: 'clients-with-valid-prepaid-goods',
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbyPrepaidCard     ]: 'clients-by-prepaid-cards' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientsbyPrepaidService  ]: 'clients-by-prepaid-services' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_ClientswithnoPrepaidGoods]: 'clients-with-no-prepaid-goods' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_BirthdayClients          ]: 'birthday-clients' ,
    [DOWNLOAD_FEATURE_NAME_ENUM.ClientManagement_RecommendedClients       ]: 'recommended-clients' ,
  },
}

export const DOWNLOAD_DATA_CATEGORY_TYPE = Object.freeze({
  None:                      0,
  ClientInformation:         1,
  SalesHistory:              2,
  ClientsWithPrepaidCard:    3,
  ClientsWithPrepaidService: 4,
})

export const DOWNLOAD_DATA_CATEGORY_KEY = {
  [KEYS.SECTIONS.USER_ACCOUNTS]: {
    [DOWNLOAD_DATA_CATEGORY_TYPE.None]:                      'none' ,
    [DOWNLOAD_DATA_CATEGORY_TYPE.ClientInformation]:         'client-information' ,
    [DOWNLOAD_DATA_CATEGORY_TYPE.SalesHistory]:              'sales-history' ,
    [DOWNLOAD_DATA_CATEGORY_TYPE.ClientsWithPrepaidCard]:    'clients-with-prepaid-card' ,
    [DOWNLOAD_DATA_CATEGORY_TYPE.ClientsWithPrepaidService]: 'clients-with-prepaid-service',
  },
}

export const getDownloadDataCategoryKey = categoryType => {
  const categoryKey = DOWNLOAD_DATA_CATEGORY_KEY[KEYS.SECTIONS.USER_ACCOUNTS][categoryType]
  return categoryKey ? `${KEYS.SECTIONS.USER_ACCOUNTS}.${categoryKey}` : 'N/A'
}

export const getMenuDownloadFeatureNameKey = featureNameNum =>
  featureNameNum === FEATURE_TYPE.USER_ACCOUNT ? KEYS.SECTIONS.USER_ACCOUNTS_TITLE : KEYS.SECTIONS.CLIENT_MANAGEMENT

export const getDownloadFeatureNameKey = featureNameNum => {
  const featureNameKey = DOWNLOAD_FEATURE_NAME_ENUM_KEY[KEYS.SECTIONS.CLIENTS][featureNameNum]
  return featureNameKey
    ? `${featureNameNum === FEATURE_TYPE.USER_ACCOUNT ? KEYS.SECTIONS.USER_ACCOUNTS : KEYS.SECTIONS.CLIENTS}.${featureNameKey}`
    : 'N/A'
}

export const DEFAULT_TABLE_OPTIONS = {
  pagination:   true,
  fixed_header: true,
}

export const DEFAULT_PAGINATION = {
  page_number: 1,
  total_items: 0,
  total_pages: 1,
}

export const PAYROll_SALARY_SALES_TYPE = {
  PERCENTAGE: 1,
  AMOUNT:     2,
}

export const MANAGER_ROLE_URL_NOT_ACCESSIBLE = ['report-sales-by-date', 'report-sales-by-month', 'report-service-sales', 'report-service-sales-by-item', 'report-service-sales-by-month'
  ,'report-service-sales-by-sales-type','report-product-sales-by-item', 'report-product-sales-by-month', 'report-sales-by-discount-category','report-sales-by-repeat-clients',
  'report-prepaid-goods-repurchase', 'report-income-statement','report-clients-summary', 'report-clients-by-period', 'report-clients-by-type', 'report-new-clients-repeat',
  'report-new-clients-by-month', 'report-recommended-clients-by-month', 'report-new-clients-by-referral-source', 'report-tally-bookings', 'report-bookings-by-date', 'report-bookings-by-month',
  'report-booking-by-resource','report-booking-by-date-of-week', 'report-booking-by-time', 'report-booking-by-source','report-bookings-ratio', 'report-prepaid-cards-by-client',
  'report-prepaid-card-summary', 'report-prepaid-services-by-client', 'report-loyalty-points-by-client', 'user-accounts', 'shop-information','environment-setup',
  'report-menu', 'login-histories', 'report-staff-sales-by-month', 'report-utilization-rate', 'report-prepaid-service-summary', 'report-prepaid-goods-expired-balance', 'report-expired-balance-by-month',
]

export const STAFF_ROLE_URL_NOT_ACCESSIBLE = [
  'sales-edit-delete-history', 'clients', 'families', 'duplicated-clients', 'deleted-clients', 'client-management-new', 'client-management-filter', 'setup-automatic-messaging',
  'message-sender-numbers', 'alimtalk-setup', 'staffs', 'staff-goal-management', 'suppliers', 'receivings', 'stock-adjustment', 'stock-history', 'stock-adjustment-history', 'stock-status',
  'expenditure-items', 'expenditure-summary', 'expenditure-history', 'report-sales-by-date', 'report-sales-by-date', 'report-sales-by-month', 'report-service-sales', 'report-service-sales-by-item', 'report-service-sales-by-month'
  ,'report-service-sales-by-sales-type','report-product-sales-by-item', 'report-product-sales-by-month', 'report-sales-by-discount-category','report-sales-by-repeat-clients',
  'report-prepaid-goods-repurchase', 'report-income-statement','report-clients-summary', 'report-clients-by-period', 'report-clients-by-type', 'report-new-clients-repeat',
  'report-new-clients-by-month', 'report-recommended-clients-by-month', 'report-new-clients-by-referral-source', 'report-tally-bookings', 'report-bookings-by-date', 'report-bookings-by-month',
  'report-booking-by-resource','report-booking-by-date-of-week', 'report-booking-by-time', 'report-booking-by-source','report-bookings-ratio', 'report-prepaid-cards-by-client',
  'report-prepaid-card-summary', 'report-prepaid-services-by-client', 'report-loyalty-points-by-client', 'services', 'prepaid-cards', 'packages', 'products', 'product-categories',
  'misc-codes', 'loyalty-points-setup', 'environment-setup', 'consent-management', 'cid-setup', 'cid-history', 'user-accounts', 'shop-information', 'booking-items', 'booking-opening-hours', 'booking-resources',
  'naver-link-settings', 'send-message-histories', 'text-unsubscribe-histories', 'report-menu', 'staff-goal-setup', 'login-histories', 'balance-point-edit-history', 'setup-automatic-messaging-info', 'message-sender-numbers-guide',
  'naver-resource-link-settings', 'naver-each-service-link-settings', 'new-booking-alarm', 'payroll-setup', 'report-staff-sales-by-month', 'setup-automatic-messaging-post-visit-info',
  'consent-action', 'consent-message-setup', 'consent-action', 'report-utilization-rate', 'report-prepaid-service-summary', 'report-prepaid-goods-expired-balance', 'report-expired-balance-by-month', 'sales-statement-setup',
  'client-transfer-my-shop', 'client-transfer-other-branch',
]

export const PREPAID_SALES_COUNTING_TYPE = {
  SOLD: 0,
  USED: 1,
}

export const STAFF_SEARCH_OPTION_ENUM = {
  NONE:            0,
  PREFERRED_STAFF: 1,
  SALES_STAFF:     2,
}
export const REQUESTING_NPAY_PAYMENT = {
  storage_name_controlled_modal_duplicated_rendering: 'handleRequestingNotYetMounted',
}

export const SALES_STATEMENT_MESSAGE_CONTENT = '[아하힐림]\n안녕하세요, 고객님.\n저희 매장에서 이용하신 \'판매내역서\' 를 보내드립니다.\n아래 버튼을 눌러 상세 내역을 확인해주세요.\n감사합니다.\n\n☎ 전화번화'
export const ORDER_STATEMENT_MESSAGE_CONTENT = '[아하힐림]\n안녕하세요, 고객님.\n저희 매장에서 이용하실 \'상세주문 내역서\' 를 보내드립니다.\n아래 버튼을 눌러 상세 내역을 확인해주세요.\n감사합니다.\n\n☎ 전화번화'
export const WORK_CALENDAR_DATE_TYPE = {
  SHOP_REGULAR_OFF_DAY:               'shop_regular_off_day',
  SHOP_SPECIFIC_OFF_DAY:              'shop_specific_off_day',
  RESOURCE_REGULAR_OFF_DAY:           'resource_regular_off_day',
  RESOURCE_SPECIFIC_OFF_DAY:          'resource_specific_off_day',
  RESOURCE_SPECIFIC_WORKING_DAY:      'resource_specific_working_day',
  SHOP_AND_RESOURCE_REGULAR_OFF_DAY:  'shop_and_resource_regular_off_day',
  SHOP_AND_RESOURCE_SPECIFIC_OFF_DAY: 'shop_and_resource_specific_off_day',
}

export const SPECIFIC_DAY_TYPE = {
  OFF_DAY:     'SpecificOffDay',
  WORKING_DAY: 'SpecificWorkingDay',
}

export const SALES_STATEMENT_TYPE = {
  ORDER_STATEMENT: 1,
  SALES_STATEMENT: 2,
}

export const REPORT_VIEW_TYPE = {
  EXPIRED_BALANCE:          0,
  EXPIRED_BALANCE_BY_MONTH: 1,
}

export const WEEKDAY_TRANSLATION_KEYS = [
  'general.sunday',
  'general.monday',
  'general.tuesday',
  'general.wednesday',
  'general.thursday',
  'general.friday',
  'general.saturday',
]

export const DATE_FORMATS = {
  WITH_TIME:    'YYYY-MM-DDTHH:mm:ss',
  WITHOUT_TIME: 'YYYY-MM-DDT00:00:00',
}

export const STATUS_CODES = {
  _200_OK:                                 200,
  _201_CREATED:                            201,
  _204_NO_CONTENT:                         204,
  _400_BAD_REQUEST:                        400,
  _401_UNAUTHORIZED:                       401,
  _402_PAYMENT_REQUIRED:                   402,
  _403_FORBIDDEN:                          403,
  _404_NOT_FOUND:                          404,
  _405_METHOD_NOT_ALLOWED:                 405,
  _406_NOT_ACCEPTABLE:                     406,
  _407_PROXY_AUTHENTICATION_REQUIRED:      407,
  _408_REQUEST_TIMEOUT:                    408,
  _409_CONFLICT:                           409,
  _410_GONE:                               410,
  _411_LENGTH_REQUIRED:                    411,
  _412_PRECONDITION_FAILED:                412,
  _413_PAYLOAD_TOO_LARGE:                  413,
  _414_URI_TOO_LONG:                       414,
  _415_UNSUPPORTED_MEDIA_TYPE:             415,
  _416_REQUESTED_RANGE_NOT_SATISFIABLE:    416,
  _417_EXPECTATION_FAILED:                 417,
  _418_IM_A_TEAPOT:                        418,
  _421_MISDIRECTED_REQUEST:                421,
  _422_UNPROCESSABLE_ENTITY:               422,
  _423_LOCKED:                             423,
  _424_FAILED_DEPENDENCY:                  424,
  _425_UNORDERED_COLLECTION:               425,
  _426_UPGRADE_REQUIRED:                   426,
  _428_PRECONDITION_REQUIRED:              428,
  _429_TOO_MANY_REQUESTS:                  429,
  _431_REQUEST_HEADER_FIELDS_TOO_LARGE:    431,
  _444_CONNECTION_CLOSED_WITHOUT_RESPONSE: 444,
  _451_UNAVAILABLE_FOR_LEGAL_REASONS:      451,
  _499_CLIENT_CLOSED_REQUEST:              499,
  _500_INTERNAL_SERVER_ERROR:              500,
  _501_NOT_IMPLEMENTED:                    501,
  _502_BAD_GATEWAY:                        502,
  _503_SERVICE_UNAVAILABLE:                503,
  _504_GATEWAY_TIMEOUT:                    504,
  _505_HTTP_VERSION_NOT_SUPPORTED:         505,
  _506_VARIANT_ALSO_NEGOTIATES:            506,
  _507_INSUFFICIENT_STORAGE:               507,
  _508_LOOP_DETECTED:                      508,
  _510_NOT_EXTENDED:                       510,
  _511_NETWORK_AUTHENTICATION_REQUIRED:    511,
  _599_NETWORK_CONNECT_TIMEOUT_ERROR:      599,
}
export const RETRY_TIMEOUT = 1000
export const RETRY_COUNT_DOWN_TIME = 5
export const RETRY_POPUP_OPEN_COUNT = 3
export const CONTACT_INFO_TYPE = {
  SHOW_ALWAYS: 1,
  SHOW_ONLY:   2,
  HIDE_ALWAYS: 3,
}

export const PERMISSION_TYPE = {
  MANAGER: 2,
  STAFF:   1,
}

export const PERMISSION_MANAGER_TYPE = {
  ALLOW:        2,
  DO_NOT_ALLOW: 0,
  ALLOW_ONLY:   3,
}

export const PERMISSION_STAFF_TYPE = {
  ALLOW:        1,
  DO_NOT_ALLOW: 0,
  ALLOW_ONLY:   3,
}

export const VALUE_MANAGER_TODAY = {
  [PERMISSION_MANAGER_TYPE.ALLOW]:        2,
  [PERMISSION_MANAGER_TYPE.ALLOW_ONLY]:   2,
  [PERMISSION_MANAGER_TYPE.DO_NOT_ALLOW]: 0,
}

export const VALUE_MANAGER_BEFORE_TODAY = {
  [PERMISSION_MANAGER_TYPE.ALLOW]:        2,
  [PERMISSION_MANAGER_TYPE.ALLOW_ONLY]:   0,
  [PERMISSION_MANAGER_TYPE.DO_NOT_ALLOW]: 0,
}

export const VALUE_STAFF_TODAY = {
  [PERMISSION_STAFF_TYPE.ALLOW]:        1,
  [PERMISSION_STAFF_TYPE.ALLOW_ONLY]:   1,
  [PERMISSION_STAFF_TYPE.DO_NOT_ALLOW]: 0,
}

export const VALUE_STAFF_BEFORE_TODAY = {
  [PERMISSION_STAFF_TYPE.ALLOW]:        1,
  [PERMISSION_STAFF_TYPE.ALLOW_ONLY]:   0,
  [PERMISSION_STAFF_TYPE.DO_NOT_ALLOW]: 0,
}

export const ENVIRONMENT_SETUP_TYPE = {
  ALLOW_DELETE_CLIENT:                     1,
  ALLOW_EDIT_CLIENT:                       2,
  CLIENT_SEARCH_CONDITION:                 3,
  CONTACT_INFO_TO_MANAGER:                 4,
  CONTACT_INFO_TO_STAFF:                   5,
  MEMBER_NUMBER_SETUP:                     6,
  ALLOW_SEND_TEXT_MESSAGE_TO_STAFF:        7,
  ALLOW_CALLING_CLIENTS_FROM_MOBILE_PHONE: 8,
  ALLOW_DELETE_CLIENT_REGISTERED_TODAY:    9,
  ALLOW_EDIT_CLIENT_REGISTERED_TODAY:      10,

  // CUSTOMIZE to be extended to use for ALLOW_DELETE_CLIENT_REGISTERED_TODAY & ALLOW_DELETE_CLIENT
  CUSTOMIZE_ALLOW_DELETE_CLIENT_INFORMATION: 11,
  // CUSTOMIZE to be extended to use for ALLOW_EDIT_CLIENT_REGISTERED_TODAY & ALLOW_EDIT_CLIENT
  CUSTOMIZE_ALLOW_EDIT_CLIENT_INFORMATION:   12,
}

export const DATA_PROTECTION_SETUP_TYPE = {
  ALLOW_EDIT_BALANCE_ROYALTY_POINTS_PREPAID_SERVICES_REMAINING: 1,
  ALLOW_EDIT_BEFORE_TODAY_SALES_INVOICES:                       2,
  ALLOW_EDIT_TODAY_SALES_INVOICES:                              3,
  ALLOW_EDIT_INVOICE_DATE:                                      4,
  SALES_REPORT_AND_INVOICES_DATE_RANGE_MANAGER_CAN_SEARCH:      5,
  SALES_REPORT_AND_INVOICES_DATE_RANGE_STAFF_CAN_SEARCH:        6,
  ALLOW_MANAGER_PRINT_INVOICES_AND_SALES_REPORT:                7,
  IS_PREPAID_GOODS_HIDDEN_IN_SALES_REPORT:                      8,
  USE_ID_RATING_TO_SEE_PAYROLL:                                 9,
  ALLOW_VIEW_DATA_OF_ORDER_STAFFS:                              10,

  // CUSTOMIZE to be extended to use for ALLOW_EDIT_BEFORE_TODAY_SALES_INVOICES & ALLOW_EDIT_TODAY_SALES_INVOICES
  CUSTOMIZE_ALLOW_EDIT_SALES_HISTORY: 11,
}

export const DISCOUNT_TYPE = {
  PERCENT:  0,
  AMOUNT:   1,
  CATEGORY: 2,
}
// Some Payslips constants:
export const TAX_RATES = { BUSINESS_INCOME: 3.3, OTHER_INCOME: 4.4 }
export const NOT_BUSINESS_OR_OTHER_INCOME_TAX = -1
export const INCOME_CLASSIFICATION = { BUSINESS_INCOME: 34, OTHER_INCOME: 35 }
export const SLICE_INDEX = { START: 25, END: 30 }
export const PAGE_SIZE = 10
export const BUSINESS_TYPE_HAIR = 'BS_HAI'
export const BUSINESS_TYPE_MASSAGE = 'BS_MAS'

export const DEFAULT_DESKTOP_LOGO_URL = '/template/images/applogo-ahaplus.png'
export const DEFAULT_MOBILE_LOGO_URL = '/template/images/logo_ahaplus.svg'
export const NAVER_TALKTALK_URL='https://talk.naver.com/WSYF626'
export const DEFAULT_BASE_TIME = {
  selected: 1,
  hour:     '05',
  minute:   '00',
}

export const ALLOW_PREPAID_CARD_HISTORY_NOTE_EDIT = [
  12, // BALANCE_EDITED
  13, // EXPIRY_DATE_EDITED
]

export const ALLOW_PREPAID_SERVICE_HISTORY_NOTE_EDIT = [
  8, // QUANTITY_EDITED,
  9, // EXPIRY_DATE_EDITED
  13, // REVENUE_PER_SERVICE_EDITED,
]

export const ALLOW_OUTSTANDING_HISTORY_NOTE_EDIT = [
  6, // EDITED,
]

export const MODE_AI_ACTION = {
  IDLE:            'idle',
  TYPING:          'typing',
  VOICE_LISTENING: 'voice-listening',
}
