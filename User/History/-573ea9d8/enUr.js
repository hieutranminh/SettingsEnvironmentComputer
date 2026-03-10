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

/**
 * Get estimated time options for Aha AI
 * @param {Function} $t - Translation function
 * @returns {Array} Array of estimated time options with text and value
 */
export function getEstimatedTimeOptions($t) {
  return [
    { text: `30 ${$t('aha-ai.minutes')}`, value: 30 },
    { text: `60 ${$t('aha-ai.minutes')}`, value: 60 },
    { text: `90 ${$t('aha-ai.minutes')}`, value: 90 },
    { text: `120 ${$t('aha-ai.minutes')}`, value: 120 },
    { text: `150 ${$t('aha-ai.minutes')}`, value: 150 },
    { text: `180 ${$t('aha-ai.minutes')}`, value: 180 },
    { text: `3 ${$t('aha-ai.hours')} 30 ${$t('aha-ai.minutes')}`, value: 210 },
    { text: `4 ${$t('aha-ai.hours')}`, value: 240 },
    { text: `4 ${$t('aha-ai.hours')} 30 ${$t('aha-ai.minutes')}`, value: 270 },
    { text: `5 ${$t('aha-ai.hours')}`, value: 300 },
    { text: `6 ${$t('aha-ai.hours')}`, value: 360 },
    { text: `7 ${$t('aha-ai.hours')}`, value: 420 },
    { text: `8 ${$t('aha-ai.hours')}`, value: 480 },
    { text: `9 ${$t('aha-ai.hours')}`, value: 540 },
    { text: `10 ${$t('aha-ai.hours')}`, value: 600 },
  ]
}