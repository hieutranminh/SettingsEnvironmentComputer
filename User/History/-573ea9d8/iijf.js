import { GOODS_STATUS, PAGINATION } from '../../config/constant'

export const common_options = {
  yes_no: {
    yes: true,
    no:  false,
  },
  optionsYesNo: [
    { value: true, text: 'general.yes'},
    { value: false, text: 'general.no'},
  ],

  good_status: {
    all:          GOODS_STATUS.ALL,
    active:       GOODS_STATUS.ACTIVE,
    inactive:     GOODS_STATUS.INACTIVE,
    list_default: GOODS_STATUS.LIST_DEFAULT,
  },

  form_actions: {
    add:    1,
    edit:   2,
    delete: 3,
    view:   4,
    create: 5,
    part:   6,
    re_add: 7,
  },
  pagination: {
    zero:         PAGINATION.ZERO,
    small:        PAGINATION.SMALL,
    default:      PAGINATION.DEFAULT,
    big:          PAGINATION.BIG,
    max:          PAGINATION.MAX,
    notification: PAGINATION.NOTIFICATION,
  },
  standard_date_format: {
    default: 'DD-MM-YYYY',
    dmy:     'DD-MM-YYYY',
    dmyh:    'DD-MM-YYYY HH:mm',
    dymd:    'dddd, YYYY-MM-DD',
    ymd:     'YYYY-MM-DD',
    ymdh:    'YYYY-MM-DD HH:mm',
    mdy:     'MM-DD-YYYY',
    utc:     'YYYY-MM-DDTHH:mm:ss.SSSZ',
  },
  standard_hour_format: {
    default:     'HH:mm',
    h12:         'hh:mm A',
    h24:         'HH:mm',
    h24_seconds: 'HH:mm:ss',
  },
  date_type: {
    date:       1,
    month:      2,
    date_range: 3,
  },
  uploadFileValidationRules: {
    maxNameLength: 100,
    maxFileSize:   10485760, // 10 MB
    maxFile:       9,
  },
  imageCompressConfig: {
    convertSize:              Infinity, // PNG files over this value will be converted to JPEGs. To disable this, just set the value to Infinity.
    //The quality of the output image. It must be a number between 0 and 1.
    // If this argument is anything else, the default values 0.92 and 0.80 are used for image/jpeg and image/webp respectively.
    // Other arguments are ignored. Be careful to use 1 as it may make the size of the output image become larger.
    quality:                  0.9,
    scale:                    0.8,
    maxImageCompressFileSize: 1024 * 300, // around 300 KB
  },
  imageCropConfig: {
    minimumWidth:  105,
    minimumHeight: 140,
  },

  dateTransferType: {
    requestDate:  0,
    transferDate: 1,
  },
}
