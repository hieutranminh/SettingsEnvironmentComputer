import {
  ENUM_NO_LIMIT,
  SALES_TRANSFER,
  STANDARD_DATE_FORMAT,
} from 'Constant'
import moment from 'moment'
import i18n from 'Translate'
import { options } from 'OptionsHelpers'

export function formatMoney(num, decimal_count = 2) {
  if (num === undefined || num === null || num === '' || isNaN(Number(num))) return ''

  num = Number(num).toFixed(decimal_count)
  num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  return num
}

export function formatNoLimitDateTs(dateTS) {
  let text = ''
  if (typeof dateTS !== 'number') return text
  if (dateTS < ENUM_NO_LIMIT) return text
  text = dateTS === ENUM_NO_LIMIT ? i18n.t('general.no-limit') : formatDateTSFromShopTimezone(dateTS)
  return text
}

export function formatNoLimitNumber(value, decimal_count){
  let text = ''
  if (typeof value != 'number') return text
  if (value < ENUM_NO_LIMIT) return text
  text = value == ENUM_NO_LIMIT ? i18n.t('general.no-limit') : formatMoney(value, decimal_count)
  return text
}

export function formatDateTSFromShopTimezone(dateTS) {
  return moment.unix(dateTS).utc().format(STANDARD_DATE_FORMAT.YMD)
}

export function formatExpiryDateTS(dateTS) {
  if(dateTS === -1) {
    return i18n.t('general.no-limit')
  }

  return formatDateTSFromShopTimezone(dateTS)
}

export function formatAmountOrBalance(value) {
  let result = formatMoney(value, 0)
  if (result == 0) {
    result = '-'
  }
  return result
}

export function formatPercentNumber (value) {
  return value ? (value + '%') : ''
}

export function formatBirthDay(year, month, day) {
  const arrDate = []

  if(year) {
    arrDate.push(year.toString().padStart(4, '0'))
  }

  if(month) {
    arrDate.push(month.toString().padStart(2, '0'))
  }

  if(day) {
    arrDate.push(day.toString().padStart(2, '0'))
  }

  return arrDate.join('-')
}

export function formatMobileAndPhoneNumber(phoneNumber, shopInfo) {
  if (!phoneNumber) return phoneNumber

  const country = shopInfo?.country

  if (country == options.country.kr) {
    return formatKRMobileAndPhoneNumber(phoneNumber)
  }

  if (country === options.country.vn) {
    return formatVNMobileAndPhoneNumber(phoneNumber)
  }

  return phoneNumber
}

const formatKRMobileAndPhoneNumber = function (phoneNumber) {
  if (phoneNumber.length == 10) { // 000-000-0000 or 02-0000-0000(PhonephoneNumber)
    if (phoneNumber.substring(0, 2) != '02') return phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6, 10)

    return phoneNumber.substring(0, 2) + '-' + phoneNumber.substring(2, 6) + '-' + phoneNumber.substring(6, 10)
  }

  if (phoneNumber.length == 9) // 00-000-0000
    return phoneNumber.substring(0, 2) + '-' + phoneNumber.substring(2, 5) + '-' + phoneNumber.substring(5, 9)

  if (phoneNumber.length == 8) // 0000-0000
    return phoneNumber.substring(0, 4) + '-' + phoneNumber.substring(4, 8)

  if (phoneNumber.length >= 11) //000-xxxxx-0000
    return phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, phoneNumber.length - 4) + '-' + phoneNumber.substring(phoneNumber.length - 4, phoneNumber.length)

  return phoneNumber
}

const formatVNMobileAndPhoneNumber = function (phoneNumber) {
  if (phoneNumber.length === 10) {
    return phoneNumber.substring(0, 4) + '-' + phoneNumber.substring(4, 7) + '-' + phoneNumber.substring(7, 10)
  }

  if (phoneNumber.length === 11) {
    return phoneNumber.substring(0, 4) + '-' + phoneNumber.substring(4, 7) + '-' + phoneNumber.substring(7, 11)
  }

  return phoneNumber
}

/**
 * Format yearMonth string from YYYYMM to YYYY-MM
 * @param {string} yearMonth - String in format YYYYMM (e.g., "202501")
 * @returns {string} Formatted string YYYY-MM (e.g., "2025-01")
 */
export function formatYearMonth(yearMonth) {
  if (!yearMonth || yearMonth.length !== 6) {
    return yearMonth
  }
  const year = yearMonth.substring(0, 4)
  const month = yearMonth.substring(4, 6)
  return `${year}-${month}`
}

/**
 * Format yearMonth string from YYYYMM to MM-YY (short format for charts)
 * @param {string} yearMonth - String in format YYYYMM (e.g., "202501")
 * @returns {string} Formatted string MM-YY (e.g., "01-25")
 */
export function formatYearMonthShort(yearMonth) {
  if (!yearMonth || yearMonth.length !== 6) {
    return yearMonth
  }
  const year = yearMonth.substring(2, 4)
  const month = yearMonth.substring(4, 6)
  return `${month}-${year}`
}

export function checkDeductionType(type) {
  let text = ''
  switch (type) {
    case SALES_TRANSFER.TYPE.ALL:
      text = i18n.t('general.all')
      break
    case SALES_TRANSFER.TYPE.PREPAID_CARD:
      text = i18n.t('report.prepaid-card')
      break
    case SALES_TRANSFER.TYPE.PREPAID_SERVICE:
      text = i18n.t('report.prepaid-service')
      break
    case SALES_TRANSFER.TYPE.ETC:
      text = i18n.t('sales-transfer-history.etc')
      break

    default:
      text = ''
      break
  }
  return text
}
