import moment from 'moment'
import i18n from 'Translate'
import store from 'VuexStore'
import { Buffer } from 'buffer'
import SalesUtils from 'Utils/sales-utils'
import ImageCompressor from 'compressorjs'
import { cache_session } from '../helpers/cache-session'
import { getDataDeviceInfo } from 'Modules/device/utils/index'
// import { getAllCalendarSetupCache } from 'Modules/cache/utils/booking'
import ClientPrivacyLogApi from 'API/clients/client-privacy-log-api.js'
import { MOBILE_PORTRAIT_MAX_WIDTH, CELL_HEIGHT_SETTING_NAME, NAVER_TALKTALK_URL, MONTHOFYEAR } from 'Constant'
import { find, includes, uniq, last, head, cloneDeep, isEqual, sortBy, reject, filter, groupBy } from 'lodash'

// View Models
import BookingDepositViewModel from 'Modules/view-model/booking/booking-deposit-view-model'

// Constants
import { options } from 'OptionsHelpers'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'
// import heic2any from 'heic2any'
const KR_TIME_ZONE = 9
const COUNTRY_CODE_VN = 'en'

// polyfill
// For browsers that do not support Element.closest(), but carry support for element.matches() (or a prefixed equivalent, meaning IE9+)
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector
}

if (typeof Element !== 'undefined' && !Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this

    do {
      if (Element.prototype.matches.call(el, s)) return el
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}
//check Touch Device
export function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
}

// mapPaging
export function mapPagingToApi(query) {
  return {
    pageSize:   query.page_size,
    pageNumber: query.page_number,
    shopId:     query.shop_id,
    status:     query.status,
  }
}

export function mapPagingFromApi(paging) {
  let total_page = 1
  if (paging && paging.totalItems > 0) {
    total_page = Math.ceil(paging.totalItems / paging.pageSize)
  }
  else {
    paging = {
      pageNumber: 1,
      pageSize:   options.pagination.default,
      totalItems: options.pagination.zero,
    }
  }
  return {
    page_number: paging.pageNumber,
    page_size:   paging.pageSize,
    total_items: paging.totalItems,
    total_pages: total_page,
  }
}

export function calculateTotalPagesFromApiResponse(pagingInfo){
  let totalPages = 0
  if(pagingInfo.totalItems > 0){
    totalPages = Math.ceil(pagingInfo.totalItems / pagingInfo.pageSize)
  }
  return totalPages
}

export function mapFileFromApi(file) {
  return {
    file_attachment_id: file.fileAttachmentId,
    name:               file.originalFileName,
    storage_file_name:  file.storageFileName,
    size:               file.fileSize,
    board_code:         file.boardCode,
    related_id:         file.relatedId,
    related_type:       file.relatedType,
    order_no:           file.orderNo,
  }
}

// check type & format data value
export function checkUndefined(value) {
  if (value === undefined) return true
}
export function checkNull(value) {
  if (value === null) return true
}
export function checkStringEmpty(value) {
  if (value === '') return true
}
export function checkNullAndEmpty(value) {
  if (value === '' || value === null) return true
}
export function checkNullAndEmptyAndUndefined(value) {
  if (value === '' || value === null || value == undefined) return true
}
export function formatMoney(num, decimal_count = 2) {
  if (num === undefined || num === null || num === '' || isNaN(Number(num))) return ''

  num = Number(num).toFixed(decimal_count)
  num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  return num
}
export function formatMoneyForReport(num, is_decimal) {
  let tmp = ''
  if (num == 0 || Math.abs(num) >= 50)
    tmp = formatMoney(num, 0)
  else {
    if (is_decimal)
      tmp = formatMoney(num, 2)
    else
      tmp = formatMoney(num, 0)
  }
  return tmp
}

export function formatTime(time, str_format = '') {
  //time = new Date('08:00:00')
  if (time == undefined || time === null || time === '') return ''
  try {
    if (str_format == '') str_format = options.standard_hour_format.default
    let arr_time = time.split(':')
    let duration = ''
    if (arr_time.length == 3)
      duration = moment({ h: arr_time[0], m: arr_time[1], s: arr_time[2] }).format(str_format)
    else if (arr_time.length == 2)
      duration = moment({ h: arr_time[0], m: arr_time[1] }).format(str_format)
    return duration
  } catch (e) {
    return ''
  }
}
export function loadWeekOfMonth(weeks) {
  let arr_week = [
    { name: i18n.t('general.first'), value: options.repeated_weeks_options.first },
    { name: i18n.t('general.second'), value: options.repeated_weeks_options.second },
    { name: i18n.t('general.third'), value: options.repeated_weeks_options.third },
    { name: i18n.t('general.fourth'), value: options.repeated_weeks_options.fourth },
  ]

  let str_week = ''
  for (let week in weeks) {
    for (let index in arr_week) {
      if (weeks[week] == arr_week[index].value) {
        str_week += arr_week[index].name + ', '
      }
    }
  }

  return i18n.t('general.every') + ' ' + str_week.substr(0, str_week.length - 2) + ' ' + i18n.t('general.week')
}
export function loadDayOfWeek(days, is_short = false) {
  // [1, 2] -> Monday, Tuesday
  days = uniq(days)
  let arr_day = []
  if (is_short) {
    arr_day = [
      i18n.t('general.sun'),
      i18n.t('general.mon'),
      i18n.t('general.tue'),
      i18n.t('general.wed'),
      i18n.t('general.thur'),
      i18n.t('general.fri'),
      i18n.t('general.sat'),
    ]
  } else {
    arr_day = [
      i18n.t('general.sunday'),
      i18n.t('general.monday'),
      i18n.t('general.tuesday'),
      i18n.t('general.wednesday'),
      i18n.t('general.thursday'),
      i18n.t('general.friday'),
      i18n.t('general.saturday'),
    ]
  }

  let str_day = ''
  for (let index in days) {
    let day = arr_day[days[index]]
    if (index > 0) str_day = str_day + ', ' + day
    else str_day = day
  }
  return str_day
}
export function loadTextOfWeek(days) {
  // [1] -> general.monday
  let arr_day = [
    'general.sunday',
    'general.monday',
    'general.tuesday',
    'general.wednesday',
    'general.thursday',
    'general.friday',
    'general.saturday',
  ]

  let str_day = ''
  for (let index in days) {
    if (index > 0) str_day = str_day + ', ' + arr_day[days[index]]
    else str_day = arr_day[days[index]]
  }
  return str_day
}

export function formatMonthYear(date, country) {
  const month = date.split('-')[0]
  const year = date.split('-')[1]
  if(country === COUNTRY_CODE_VN) {
    return `${MONTHOFYEAR[month - 1]} ${year}`
  }
  return `${year}년 ${month}월`
}

export function formatMonthAndDateLocalized(ts, language) {
  if(!ts) return ''
  const momentDate = moment.unix(ts).utcOffset(0)
  const month = momentDate.month() + 1
  const year = momentDate.year()
  if(language === options.language.korean) {
    return `${year}${i18n.t('general.year')} ${month}${i18n.t('general.mon')}`
  }
  return `${MONTHOFYEAR[month - 1]} ${year}`

}

export function formatDateLocalized(ts, language) {
  if (ts == undefined || ts === null || ts === '') return ''

  try {
    const momentDate = moment.unix(ts).utcOffset(0)
    // Korean format: "2025년 10월 15일"
    if (language === options.language.korean) {
      return `${momentDate.year()}${i18n.t('general.year')} ${momentDate.month() + 1}${i18n.t('general.month')} ${momentDate.date()}${i18n.t('general.day')}`
    }

    // English format: "Oct 15, 2025"
    const month = momentDate.month() + 1
    const year = momentDate.year()
    const date = momentDate.date()
    return `${MONTHOFYEAR[month - 1]} ${date}, ${year}`

  } catch (e) {
    return ''
  }
}

export function convertTextToTime(text_time) {
  let date = new Date()
  let time = text_time.split(':')
  let hours = time[0]
  let minutes = time[1]

  if (text_time.substr(-2) == 'PM' && Number(hours) == 12) hours = Number(hours)
  else if (text_time.substr(-2) == 'PM') hours = Number(hours) + 12

  date.setHours(hours)
  date.setMinutes(minutes)
  return date
}

export function convertDatesToUTCs(dates) {
  let utcs = []
  if (dates) utcs = dates.map(date => {
    let utc = moment(date).format(options.standard_date_format.ymd)
    return utc
  })
  return utcs
}

export function convertHoursToMinutes(hours_string) {
  if (hours_string) {
    let temp = hours_string.split(':')
    let hour = Number(temp[0])
    let minute = Number(temp[1])
    return hour * 60 + minute
  }

  // hours_string is null
  return -1
}

export function isOver24Hours(hours_string) {
  return (convertHoursToMinutes(hours_string) >= options.minutes_of_24h)
}

export function convertMinutesToHours(minutes, has_second = false, zero_in_hour = true) {
  let temp = minutes / 60
  let hour = Math.floor(temp)
  let minute = minutes - (hour * 60)
  if (zero_in_hour && hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute

  let time = hour + ':' + minute
  if (has_second) time += ':00'
  return time
}

export function convertMinutesToHeightOnCalendar(minutes, booking_time_slot) {
  const cellHeight = options.booking.table_cell_height * ((+localStorage.getItem(CELL_HEIGHT_SETTING_NAME) || 100)/100)
  return (minutes * cellHeight) / booking_time_slot // prevent surplus
}

export function calculateStartTime(booked_items, action, start_time_default, booking_time_slot) {
  let tmp_groups = groupBy(booked_items, 'booking_resource_setup_id')

  let groups = []
  for (let i in tmp_groups) {
    let group = {
      resource_id:  tmp_groups[i][0].booking_resource_setup_id,
      start_time:   '',
      booked_items: tmp_groups[i],
    }
    let last_item = {
      booking_resource_setup_id: null,
      start_time:                '',
      estimated_time:            0,
      is_next_day:               false,
    }
    // calculate start_time
    if (action == options.form_actions.add)
      last_item.start_time = start_time_default
    else if (action == options.form_actions.edit || action == options.form_actions.delete) {
      last_item.start_time = tmp_groups[i][0].start_time
      last_item.is_next_day = tmp_groups[i][0].is_next_day
    }
    if (last_item.start_time == undefined)
      last_item.start_time = start_time_default

    for (let ii in group.booked_items) {
      let item = group.booked_items[ii]
      item.estimated_time = item.lead_time

      let duration = last_item.estimated_time
      let time_slot = booking_time_slot
      let duration_time_slots = Math.ceil(duration / time_slot)
      let calculated_duration = duration_time_slots * time_slot
      let is_start_time_out_of_range = !(duration === calculated_duration)

      let start_time_minutes = convertHoursToMinutes(last_item.start_time) + (is_start_time_out_of_range ? duration : calculated_duration)
      item.start_time = convertMinutesToHours(start_time_minutes)

      if (ii == 0) {
        group.start_time = convertHoursToMinutes(item.start_time)
        item.disabled = false
      }
      else {
        item.disabled = true
      }

      // last item
      last_item = item
    }
    groups.push(group)
  }

  // sortby start_time & view
  groups = sortBy(groups, ['start_time'])
  let list = []
  for (let i in groups) {
    list = list.concat(groups[i].booked_items)
  }
  for (let i in list) {
    list[i].order_number = i
  }
  return list
}

export function getClientHeaderParameters() {
  const user = store.state.authentication.user
  const shop = store.state.authentication.shop

  let header_parameters = []
  header_parameters.push('countryCode')
  header_parameters.push(shop.country)

  header_parameters.push('shopId')
  header_parameters.push(shop.shop_id)

  header_parameters.push('solutionId')
  header_parameters.push(shop.solution_id)

  header_parameters.push('userID')
  header_parameters.push(user.user_id)

  header_parameters.push('name')
  header_parameters.push(user.user_name)

  header_parameters.push('userRole')
  header_parameters.push(user.role)

  return header_parameters.join()
}

export function mapSecurityInfo(model) {
  const user = store.state.authentication.user
  const shop = store.state.authentication.shop

  model.created_by_id = user.user_id
  model.created_by_name = user.user_name
  model.session_token = user.session_token
  model.shop_location = shop.shop_location
  model.country = shop.country

  return model
}

export function mapActionSecurityInfo(model, action) {
  const user = store.state.authentication.user
  const shop = store.state.authentication.shop
  let tmp_date_time_ts = convertDateToTimeStamp(new Date(), true)

  if (action == options.form_actions.add) {
    model.created_by_id = user.user_id
    model.created_by_name = user.user_name
    model.created_date_time_ts = tmp_date_time_ts
  }
  if (action == options.form_actions.edit) {
    model.edited_by_id = user.user_id
    model.edited_by_name = user.user_name
    model.edited_date_time_ts = tmp_date_time_ts
  }
  if (action == options.form_actions.delete) {
    model.deleted_by_id = user.user_id
    model.deleted_by_name = user.user_name
    model.deleted_date_time_ts = tmp_date_time_ts
  }
  model.session_token = user.session_token
  model.shop_location = shop.shop_location
  model.shop_id = shop.shop_id

  return model
}

export function getCurrentSettingDateTimeTS() {
  return convertTimeStampPlusLocalzone(convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true))
}

export function convertDateToTimeStamp(date, is_convert_timezone, has_hours) {
  if (is_convert_timezone) date = convertDateToTimezone(date)

  let timestamp = ''
  if (has_hours) {
    timestamp = Date.parse(date) / 1000
  }
  else {
    if (moment(date).isValid()) {
      let tmp_date = moment(date).format(options.standard_date_format.ymd)
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
      // For ISO 8601 standart: For example, "2011-10-10" (date-only form), "2011-10-10T14:48:00" (date-time form),
      // or "2011-10-10T14:48:00.000+09:00" (date-time form with milliseconds and time zone)
      // can be passed and will be parsed. When the time zone offset is absent,
      // date-only forms are interpreted as a UTC time and date-time forms are interpreted as local time.
      // For Non-standard date strings: if GMT is not declared in the date string, it will parse based on local timezone
      timestamp = Date.parse(tmp_date) / 1000
    }
  }
  return timestamp
}
export function convertTimeStampPlusSettingzone(timestamp) {
  let zone = store.state.authentication.shop.timezone
  zone = Number(zone.slice(0, 3))
  timestamp += zone * 3600
  return timestamp
}
export function convertTimeStampPlusLocalzone(timestamp) {
  let zone = new Date().getTimezoneOffset() * -1
  timestamp += zone * 60
  return timestamp
}
export function convertTimeStampMinusLocalzone(timestamp) {
  let zone = new Date().getTimezoneOffset() * -1
  timestamp -= zone * 60
  return timestamp
}
export function convertTimeStampMinusSettingzone(timestamp) {
  let zone = store.state.authentication.shop.timezone
  zone = Number(zone.slice(0, 3))
  timestamp -= zone * 3600
  return timestamp
}
export function convertTimeStampToUtcDate(timestamp) {
  let tmp_date = ''
  if (timestamp == null || timestamp == '') {
    tmp_date = new Date()
    return tmp_date
  }
  else {
    tmp_date = new Date(timestamp * 1000)
    return new Date(tmp_date.getUTCFullYear(), tmp_date.getUTCMonth(), tmp_date.getUTCDate())
  }
}

export function convertTimeStampToUtcDatetime(timestamp) {
  let tmp_date = ''
  if (timestamp == null || timestamp == '') {
    tmp_date = new Date()
    return tmp_date
  } else {
    tmp_date = new Date(timestamp * 1000)
    return new Date(tmp_date.getUTCFullYear(), tmp_date.getUTCMonth(), tmp_date.getUTCDate(), tmp_date.getUTCHours(), tmp_date.getUTCMinutes(), tmp_date.getUTCSeconds())
  }
}

export function convertDateFromTimezoneToTimestamp(d, zone_from, has_hours) {
  if (!moment(d).isValid) return null
  if (zone_from == null) zone_from = store.state.authentication.shop.timezone

  let s = ''
  if (has_hours) s = moment(d).format('YYYY-MM-DDTHH:mm:ss') + zone_from
  else s = moment(d).format('YYYY-MM-DDT00:00:00') + zone_from

  return Date.parse(s) / 1000
}
export function convertTimeStampToDate(timestamp, is_convert_timezone) {
  let date = ''
  if (timestamp == null || timestamp == '') date = new Date()
  else date = new Date(timestamp * 1000)
  if (is_convert_timezone) date = convertDateToTimezone(date)
  return date
}
export function convertDateToTimezone(date_local) {
  let timezone = store.state.authentication.shop.timezone
  let tmp = moment(date_local).utcOffset(timezone)
  let date_timezone = new Date(tmp.year(), tmp.month(), tmp.date(), tmp.hour(), tmp.minute(), tmp.second())
  return date_timezone
}
export function convertFirstDateToTimezone(date_local) {
  let timezone = store.state.authentication.shop.timezone
  let tmp = moment(date_local).utcOffset(timezone)
  let date_timezone = new Date(tmp.year(), tmp.month(), 1, tmp.hour(), tmp.minute(), tmp.second())

  return date_timezone
}
export function convertDateFromUtcToTimezone(d, zone_to) {
  let tmp = moment.utc(d).utcOffset(zone_to)
  if (!tmp.isValid) return null
  let toD = new Date(tmp.year(), tmp.month(), tmp.date(), tmp.hour(), tmp.minute(), tmp.second())
  return toD
}
export function convertHourToTimezone(date) {
  let date_settting = convertDateToTimezone(new Date())
  let hour_settting = new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date_settting.getHours(), date_settting.getMinutes(), date_settting.getSeconds(),
  )
  return hour_settting
}

export function convertDateFromLocalToTimezone(date) {
  let date_settting = convertDateToTimezone(date)
  return new Date(date_settting.getFullYear(), date_settting.getMonth(), date_settting.getDate())
}

export function convertDatetimeFromLocalToTimezone(date) {
  let date_settting = convertDateToTimezone(date)
  return new Date(date_settting.getFullYear(), date_settting.getMonth(), date_settting.getDate(), date_settting.getHours(), date_settting.getMinutes(), date_settting.getSeconds())
}

export function parseDateTSToMomentWithAddingCustomTimezone({
  inputDateTS,
  customTimezone,
  inputDateTimezone,
}) {
  // use when you want to get datetime in unix timestamp at other timezone
  // based on a specific datetime of a specific timezone
  // For Example: what's datetime in unix timestamp in Seoul (UTC+9)
  // if datetime in Hanoi (UTC+7) is 2021/16/07 07:00:00?
  // So: inputDateTS = valueof 2021/16/07 07:00:00 in unix timestamp, inputDateTimezone = "7|+07:00|420", customTimezone = "9|+09:00|540"
  const inputDateTimezoneUTCOffset = moment().utcOffset(inputDateTimezone).utcOffset()
  const customTimezoneUTCOffset = moment().utcOffset(customTimezone).utcOffset()
  const utcOffsetDiffByInputDateTZAndCustomTZ = customTimezoneUTCOffset - inputDateTimezoneUTCOffset
  return moment.unix(inputDateTS + (utcOffsetDiffByInputDateTZAndCustomTZ * 60))
}

export function parseDateTSToMomentWithAddingShopSettingTimezone({
  inputDateTS,
  inputDateTimezone,
}) {
  return parseDateTSToMomentWithAddingCustomTimezone({
    inputDateTS,
    inputDateTimezone,
    customTimezone: store.state.authentication.shop.timezone || KR_TIME_ZONE,
  })
}

export function parseDateTSToMomentByCustomTimezone({
  inputDateTS,
  customTimezone,
}) {
  return moment.unix(inputDateTS).utcOffset(customTimezone)
}

export function parseDateTSToMomentByZeroTimezone(inputDateTS) {
  return parseDateTSToMomentByCustomTimezone({ inputDateTS, customTimezone: 0 })
}

export function parseDateTSToMomentByShopSettingTimezone(inputDateTS) {
  return moment.unix(inputDateTS).utcOffset(store.state.authentication.shop.timezone)
}

export function parseDateTSWithSubtractLocalTimezone(inputDateTS) {
  return moment.unix(inputDateTS - (moment().utcOffset() * 60))
}

export function getCurrentTimeShopTS() {
  const timeStamp = parseDateTSToMomentWithAddingShopSettingTimezone({
    inputDateTS:       moment().unix(),
    inputDateTimezone: 0,
  }).unix()
  return timeStamp
}

export function formatUtcTsToSettingTime(UtcTs, format) {
  return moment.unix(UtcTs).utcOffset(store.state.authentication.shop.timezone).format(format)
}

export function guid() {
  return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
}

export function guidNumeric() {
  // Get last 3 digits of current timestamp
  const timeDigits = new Date().getTime() % 1000

  // Add a random number between 0-9 to reduce collision chance
  const randomDigit = Math.floor(Math.random() * 10)

  // Combine for a number between 100-9999
  return timeDigits * 10 + randomDigit
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function differentObject(object_1, object_2) {
  return !isEqual(object_1, object_2)
}
export function showCommonAlert(vue, alerts, option = undefined) {
  vue.$store.dispatch('alert/setAlertsData', alerts)
  if (option != undefined)
    vue.$store.dispatch('alert/setOptionsData', Object.assign(option, { vue: vue }))
  vue.$root.$emit('bv::show::modal', 'alert-modal')
}

// todo - Change country setting
export function formatDateBySetting(date = new Date(), has_hours = false) {
  let tmp_shop_data = store.state.authentication.shop
  if (has_hours)
    return moment(date).format(tmp_shop_data.format_date + ' HH:mm')
  else
    return moment(date).format(tmp_shop_data.format_date)
}

export function formatDate(date) {
  if (date != null) {
    let d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }
  else
    return null
}

export function formatDateByString(date, str_format = '', language = '') {
  let momnetDate = null
  if(language !== '') {
    momnetDate = moment(date).locale(language)
  } else {
    momnetDate = moment(date)
  }

  if (date == undefined || date === null || date === '') return ''
  try {
    if (str_format == '') str_format = options.standard_date_format.default
    return momnetDate.format(str_format)
  } catch (e) {
    return ''
  }
}

export function formatHourShort(time) {
  if (time != null) {
    let arrTime = time.split(':')
    return [arrTime[0], arrTime[1]].join(':')
  }
  else
    return ''
}

export function formatDateHourMin(invoice_date_time_ts) {
  return moment.unix(invoice_date_time_ts).utc().format(options.standard_date_format.ymdh)
}

export function formatByDate(invoice_date_time_ts) {
  return moment.unix(invoice_date_time_ts).utc().format(options.standard_date_format.ymd)
}

export function addDateZero(date) {
  if (!checkUndefined(date) && !checkNull(date)) {
    if (date.toString().length == 1)
      date = '0' + date
    return date
  }
  else {
    return null
  }
}

export function isNullObject(object) {
  if (object && object != null && object != undefined) {
    return false
  }
  else {
    return true
  }
}

export function isEmptyObject(object) {
  return object && !Object.keys(object).length
}

export function convertHoursToRow(hours_string, booking_setup, is_get_row_real) {
  let booking_table_time_start = convertHoursToMinutes(head(sortBy(booking_setup.booking_opening_hours_setup.opening_hours, 'start_time')).start_time)
  let row = (convertHoursToMinutes(hours_string) - booking_table_time_start) / booking_setup.booking_calendar_setup.booking_time_slot
  if(is_get_row_real){
    return row
  }
  return row > 0 ? row : 0
}

export { cache_session }

export function checkDuplicateViewGroup(group, booking_view_groups, blocked_time_view_groups, is_check_all_same_col_view_groups = false) {
  let duplicated_groups = [group]
  let view_groups = [...booking_view_groups, ...blocked_time_view_groups]

  // check same col group
  let same_col_view_groups = filter(view_groups, {
    booking_resource_setup_id: group.booking_resource_setup_id,
    calendar_date_ts:          group.calendar_date_ts,
  })

  // remove itself
  if (group.booking_id > 0) same_col_view_groups = reject(same_col_view_groups, ['booking_id', group.booking_id])
  else if (group.blocked_time_id > 0) same_col_view_groups = reject(same_col_view_groups, ['blocked_time_id', group.blocked_time_id])

  // check duplication between group and same_col_view_groups
  if (same_col_view_groups.length > 0) {
    for (let same_col_view_group of same_col_view_groups) {
      let is_duplicated = !(group.row >= same_col_view_group.row_end || group.row_end <= same_col_view_group.row)
      if (is_duplicated) {
        duplicated_groups.push(same_col_view_group)
        if (!is_check_all_same_col_view_groups) {
          break
        }
      }
    }
  }

  return duplicated_groups
}

export function checkValidateDuplicateViewGroup(group, booking_view_groups, blocked_time_view_groups, is_check_all_same_col_view_groups = false) {
  let duplicated_groups = [group]
  let view_groups = [...booking_view_groups, ...blocked_time_view_groups]

  // check same col group
  let same_col_view_groups = filter(view_groups, {
    booking_resource_setup_id: group.booking_resource_setup_id,
    calendar_date_ts:          group.calendar_date_ts,
  })

  // remove itself
  if (group.booking_id > 0) same_col_view_groups = reject(same_col_view_groups, ['booking_id', group.booking_id])
  else if (group.blocked_time_id > 0) same_col_view_groups = reject(same_col_view_groups, ['blocked_time_id', group.blocked_time_id])

  // check duplication between group and same_col_view_groups
  if (same_col_view_groups.length > 0) {
    for (let same_col_view_group of same_col_view_groups) {
      let is_duplicated = !(group.row >= same_col_view_group.row_end || group.row_end <= same_col_view_group.row)
      let isDuplicatedAsGroupItem = duplicated_groups.some(duplicated_group => same_col_view_group.row >= duplicated_group.row_end || same_col_view_group.row_end <= duplicated_group.row)

      if (is_duplicated) {
        if (!is_check_all_same_col_view_groups) {
          break
        }
        if (!isDuplicatedAsGroupItem || same_col_view_group.blocked_time_id) {
          duplicated_groups.push(same_col_view_group)
        }
      }
    }
  }
  return duplicated_groups
}

export function calculateMenuViewGroupPosition(group, e) {
  const clonedGroup = cloneDeep(group)
  // 1. calculate menu position from convert click position
  // 2. calculate menu max position vs viewport / calendar
  // getBoundingClientRect: position / direct parent's viewport
  let table_object = document.getElementById('calendar-table')
  let table_rect = table_object.getBoundingClientRect()

  let el_clicked = e.target.closest('.calendar-cell-view-group')
  if (e && el_clicked) {
    const leftSpaceForEasyUI = 10
    const topSpaceForEasyUI = 6
    let el_object = document.getElementById(el_clicked.id)
    // Discard the layerY usage due to it's not recommended and may be deprecated/changed in the future
    // if click at the end of element, offsetY(position relative to target element) can be reset
    const targetDomRect = e.currentTarget.getBoundingClientRect()
    const calculatedOffsetY = e.clientY - targetDomRect.y
    let menu_top = calculatedOffsetY + el_object.offsetTop
    let menu_left = e.offsetX
    let menu_id = 'menu-' + clonedGroup.getKey()
    let menu_object = document.querySelector('#' + menu_id + ' .dropdown-menu')
    let menu_right_max = Math.floor(e.pageX + menu_object?.offsetWidth)
    let menu_bottom_max = Math.floor(e.pageY + menu_object?.offsetHeight)
    // view menu at the right
    let calendar_right_max = Math.ceil(table_rect.left + table_rect.width - options.browser_scroll)
    if (menu_right_max > calendar_right_max) {
      if( window.innerWidth <= MOBILE_PORTRAIT_MAX_WIDTH) {
        menu_left = menu_left - (menu_right_max - calendar_right_max)
      }
      else {
        menu_left = menu_left - menu_object?.offsetWidth + leftSpaceForEasyUI * 2
      }
      menu_object?.classList.add('left-side')
    }
    else {
      menu_left -= leftSpaceForEasyUI
      menu_object?.classList.remove('left-side')
    }

    // view menu at the bottom
    // viewport is space window of browser
    // calendar is space of calendar on viewport
    let viewport_bottom_max = window.scrollY + window.innerHeight
    let calendar_bottom_max = (window.scrollY + table_rect.bottom) - (options.browser_scroll - 2)

    //// viewport_bottom above calendar_bottom
    if (viewport_bottom_max < calendar_bottom_max) {
      if (menu_bottom_max > viewport_bottom_max) {
        menu_top = menu_top - (menu_bottom_max - viewport_bottom_max)
      }
    }
    //// calendar_bottom above viewport_bottom
    else {
      if (menu_bottom_max > calendar_bottom_max) {
        menu_top = menu_top - (menu_bottom_max - calendar_bottom_max)
      }
    }
    // cursor be in menu for easy ui
    menu_top -= topSpaceForEasyUI

    clonedGroup.updateMenuPosition(menu_left, menu_top, menu_right_max, menu_bottom_max)
  }

  return clonedGroup
}

export function calculateClickedPositionOnViewGroup(e) {
  let position = {
    top:  0,
    left: 0,
  }

  const elClicked = e.target.closest('.block-info')

  if (elClicked) {
    const elObject = document.getElementById(elClicked.id)
    const isDetailClass = e.target.classList.contains('block-info-detail')
    let height = e.offsetY
    if(!isDetailClass){
      height += e.target.offsetTop
    }

    position.top = height + elObject.offsetTop
    position.left = e.offsetX
  }

  return position
}

export async function isBookingStartTimeExceedWorkHour(booking_date, booked_resources, booking_setup) {
  // let tmp_shop_data = store.state.authentication.shop
  // let booking_setup = await getAllCalendarSetupCache({
  //   shopId: tmp_shop_data.shop_id
  // })

  // one booking has many view-groups
  for (let booked_resource of booked_resources) {
    let tmp_booked_resource = cloneDeep(booked_resource)
    let tmp_group = {
      row:                       0,
      row_end:                   0,
      booking_resource_setup_id: 0,
    }
    let tmp_start_time = tmp_booked_resource.is_next_day ? getTimeInclude24(tmp_booked_resource.start_time) : tmp_booked_resource.start_time
    tmp_group.row = convertHoursToRow(tmp_start_time, booking_setup)
    tmp_group.row_end = tmp_group.row + (options.booking.calendar_time_slot_min / booking_setup.booking_calendar_setup.booking_time_slot) // just need to check start-time of group
    tmp_group.booking_resource_setup_id = tmp_booked_resource.booking_resource_setup_id

    if (await exceedWorkHourViewGroup(booking_date, tmp_group, booking_setup)) {
      return true
    }
  }
  return false
}

export async function exceedWorkHourViewGroup(date, group, booking_setup) {
  // let shop = store.state.authentication.shop
  // let booking_setup = await getAllCalendarSetupCache({
  //   shopId: shop.shop_id
  // })
  let day_picker = Number(moment(date).format('d'))
  let date_picker = Number(moment(date).format('D'))
  let week_picker = Math.ceil(date_picker / 7)
  let date_format = moment(date).format(options.standard_date_format.ymd)
  let booking_opening_hours_setup = booking_setup.booking_opening_hours_setup
  let exceed = false

  const workingDayResourceIds = getWorkingDayResourceIds(booking_setup.booking_resources_setup.items, convertDateToTimeStamp(date))
  const hasSpecificWorkingDay = workingDayResourceIds.includes(group.booking_resource_setup_id)

  if (!isNullObject(booking_setup) && !isNullObject(booking_opening_hours_setup) && !isNullObject(group)) {
    if (!isNullObject(date)) {
      // workhour_shop: repeat off days
      let repeated_off_days = booking_opening_hours_setup.repeated_off_days
      if (repeated_off_days.repeat_type == options.repeat_type.every_week) {
        if (repeated_off_days.repeated_days_of_week.indexOf(day_picker) > -1) {
          exceed = true
          // console.log('workhour_shop: repeat off days & specific off days every_week')
        }
      }
      if (repeated_off_days.repeat_type == options.repeat_type.monthly) {
        if (repeated_off_days.repeated_weeks.indexOf(week_picker) > -1) {
          if (repeated_off_days.repeated_days_of_week.indexOf(day_picker) > -1) {
            exceed = true
            // console.log('workhour_shop: repeat off days & specific off days monthly')
          }
        }
      }
      // workhour_shop: specific off days
      let specific_off_days = booking_opening_hours_setup.specific_off_days
      for (let off_day of specific_off_days) {
        if (date_format == moment.utc(off_day).format(options.standard_date_format.ymd)) {
          exceed = !hasSpecificWorkingDay
          // console.log(' workhour_shop: specific_off_days')
        }
      }

      // workhour_shop: day in shop_opening_day
      let shop_opened_days = []
      let workhours_shop = []
      let opening_hours = booking_opening_hours_setup.opening_hours
      for (let i in opening_hours) {
        let opening_hour = opening_hours[i]
        let opened_days_of_week = opening_hour.opened_days_of_week

        if (opened_days_of_week.indexOf(day_picker) > -1) {
          let exceeds = []
          workhours_shop = generateWorkHourInDate(opening_hours, date, booking_setup)
          // console.log('workhours_shop: ', workhours_shop)
          for (let ii in workhours_shop) {
            let workhour_shop = workhours_shop[ii]

            // console.log('workhour_shop: workhour in day', group.row, group.row_end,' | ', workhour_shop.start_row, workhour_shop.finish_row)
            if (group.row >= workhour_shop.start_row && group.row_end <= workhour_shop.finish_row) {
              exceeds.push(false)
            }
            else {
              exceeds.push(true)
            }
          }

          let exceeds_false = exceeds.filter(e => e == false)
          if (exceeds_false.length == 0 && !hasSpecificWorkingDay) {
            exceed = true
            // console.log('workhour_shop: day in shop_opening_day', exceeds)
          }
        }
        shop_opened_days = shop_opened_days.concat(opened_days_of_week)
      }

      // workhour_shop: days not in shop_opened_days
      if (shop_opened_days.indexOf(day_picker) == -1 && !hasSpecificWorkingDay) {
        exceed = true
        // console.log('workhour_shop: days not in shop_opened_days')
      }

      // workhour_resource
      let resources = booking_setup.booking_resources_setup.items.filter(r => r.id == group.booking_resource_setup_id)
      if (!isNullObject(resources) && resources.length > 0) {
        let resource = resources[0]

        // workhour_resource: specific off days
        for (let resource_off_day of resource.specific_off_days) {
          let resource_off_day_format = moment(resource_off_day).format(options.standard_date_format.ymd)
          if (date_format == resource_off_day_format) {
            exceed = true
            // console.log('workhour_resource: specific off days')
          }
        }

        // workhour_resource: day in shop_opening_day
        let resource_opened_days = []
        let workhours_resource = []
        let opening_hours = resource.opening_hours
        if(hasSpecificWorkingDay) {
          opening_hours = getOpeningHours(resource, convertDateToTimeStamp(date))
        }
        for (let ii in opening_hours) {
          let opening_hour = opening_hours[ii]
          let opened_days_of_week = opening_hour.opened_days_of_week

          if (opened_days_of_week.indexOf(day_picker) > -1 || hasSpecificWorkingDay) {
            let exceeds = []
            workhours_resource = generateWorkHourInDate(opening_hours, date, booking_setup)
            // console.log('workhours_resource: ', workhours_resource)

            for (let iii in workhours_resource) {
              let workhour_resource = workhours_resource[iii]

              if (group.row >= workhour_resource.start_row && group.row_end <= workhour_resource.finish_row) {
                // console.log(group.row, group.row_end, workhour_resource.start_row, workhour_resource.finish_row)
                exceeds.push(false)
              }
              else {
                exceeds.push(true)
              }
            }
            let exceeds_false = exceeds.filter(e => e == false)
            if (exceeds_false.length == 0) {
              exceed = true
              // console.log('workhour_resource: day in shop_opening_day')
            }
          }
          resource_opened_days = resource_opened_days.concat(opened_days_of_week)
        }

        // workhour_resource: days not in resource_opened_days
        if (resource_opened_days.indexOf(day_picker) == -1 && !hasSpecificWorkingDay) {
          exceed = true

          // console.log('workhour_resource: days not in resource_opened_days')
        }
      }
    }
    return exceed
  }
}

export function generateWorkHourInDate(opening_hours, date, booking_setup) {
  let workhours = []
  let day_of_calendar_date = Number(moment(date).format('d'))

  for (let i in opening_hours) {
    let opening_hour = opening_hours[i]
    let opened_days_of_week = opening_hour.opened_days_of_week
    if (opened_days_of_week.indexOf(day_of_calendar_date) > -1 || opening_hour.hasSpecificWorkingHour) {
      let tmp_finish_time = opening_hour.finish_time
      let tmp_finish_time_minutes = convertHoursToMinutes(tmp_finish_time)
      let tmp_start_time_minutes = convertHoursToMinutes(opening_hour.start_time)
      if (opening_hour.cross_date || tmp_finish_time_minutes < tmp_start_time_minutes) {
        tmp_finish_time = convertMinutesToHours(tmp_finish_time_minutes + options.minutes_of_24h)
      }
      let workhour = {
        start_row:  convertHoursToRow(opening_hour.start_time, booking_setup),
        finish_row: convertHoursToRow(tmp_finish_time, booking_setup),
      }
      workhours.push(workhour)
    }
  }
  return workhours
}

export function getTimeOptionsByDate(date, resource_id, booking_setup) {
  let booking_opening_hours_setup = booking_setup.booking_opening_hours_setup.opening_hours
  let day = Number(moment(date).format('d'))
  let opening_hours_by_day = []
  let work_hours = {}

  for (let tmp_opening_hour of booking_opening_hours_setup) {
    for (let tmp_day of tmp_opening_hour.opened_days_of_week) {
      if (tmp_day == day) {
        opening_hours_by_day.push(tmp_opening_hour)
      }
    }
  }
  if (opening_hours_by_day.length > 0) {
    work_hours = generateWorkHourOfShop(opening_hours_by_day, booking_opening_hours_setup, booking_setup.booking_calendar_setup.booking_time_slot)
  }

  return work_hours
}
export function generateWorkHourOfShop(opening_hours_by_day, booking_opening_hours_setup, booking_time_slot) {
  let work_hours = {
    time_start:  '00:00',
    time_finish: '00:00',
  }

  // start-time
  let tmp_time_start = head(sortBy(opening_hours_by_day, 'start_time')).start_time
  let tmp_start_minutes = convertHoursToMinutes(tmp_time_start)

  // finish-time
  let tmp_time_finish = ''
  let time_finish_minutes = 0
  let opening_cross_date = opening_hours_by_day.filter(opening => opening.cross_date == true)
  if (opening_cross_date.length > 0) {
    time_finish_minutes = convertHoursToMinutes(last(sortBy(opening_cross_date, 'finish_time')).finish_time)
    time_finish_minutes += options.minutes_of_24h
  }
  else {
    time_finish_minutes = (convertHoursToMinutes(last(sortBy(opening_hours_by_day, 'finish_time')).finish_time))
  }
  tmp_time_finish = convertMinutesToHours(time_finish_minutes)

  // special case: happen when time-slot = 60
  // start-time: opening-hour-start-time has 30 minutes
  let calendar_time_start_minutes = convertHoursToMinutes(head(sortBy(booking_opening_hours_setup, 'start_time')).start_time)
  let tmp_calendar_surplus_minutes = calendar_time_start_minutes % booking_time_slot
  let tmp_day_surplus_minutes = tmp_start_minutes % booking_time_slot
  if (tmp_calendar_surplus_minutes == 0 && tmp_day_surplus_minutes > 0) {
    tmp_time_start = convertMinutesToHours(tmp_start_minutes + tmp_day_surplus_minutes)
  }
  if (tmp_calendar_surplus_minutes > 0 && tmp_day_surplus_minutes == 0) {
    tmp_time_start = convertMinutesToHours(tmp_start_minutes + tmp_calendar_surplus_minutes)
  }

  // finish-time: opening-hour-finish-time has 30 minutes
  // reference: https://gitlab.com/aha.software.2018/aha-testing/-/issues/563

  work_hours.time_start = tmp_time_start
  work_hours.time_finish = tmp_time_finish
  return work_hours
}

export function getTimeInclude24(time) {
  let to_time_minutes = convertHoursToMinutes(time)
  if (to_time_minutes < options.minutes_of_24h)
    to_time_minutes += options.minutes_of_24h
  return convertMinutesToHours(to_time_minutes)
}
export function getTimeSubtract24(time) {
  let to_time_minutes = convertHoursToMinutes(time)
  if (to_time_minutes >= options.minutes_of_24h)
    to_time_minutes -= options.minutes_of_24h
  return convertMinutesToHours(to_time_minutes)
}
export function isOffDay(date, resource_setup_id, booking_setup) {
  let booking_opening_hours_setup = booking_setup.booking_opening_hours_setup.opening_hours
  let booking_repeated_off_days_setup = booking_setup.booking_opening_hours_setup.repeated_off_days
  let booking_specific_off_days_setup = booking_setup.booking_opening_hours_setup.specific_off_days
  let booking_resources_setup = booking_setup.booking_resources_setup.items

  let day_picker = Number(moment(date).format('d'))
  let date_picker = Number(moment(date).format('D'))
  let date_formated = moment(date).format(options.standard_date_format.ymd)
  let week_picker = Math.ceil(date_picker / 7)
  let is_off_day = false

  const workingDayResourceIds = getWorkingDayResourceIds(booking_resources_setup, convertDateToTimeStamp(date))

  // shop: repeat off days
  if (booking_repeated_off_days_setup.repeat_type == options.repeat_type.every_week) {
    if (booking_repeated_off_days_setup.repeated_days_of_week.indexOf(day_picker) > -1) {
      is_off_day = true
      // console.log('shop: repeat off days - every_week')
    }
  }
  if (booking_repeated_off_days_setup.repeat_type == options.repeat_type.monthly) {
    if (booking_repeated_off_days_setup.repeated_weeks.indexOf(week_picker) > -1) {
      if (booking_repeated_off_days_setup.repeated_days_of_week.indexOf(day_picker) > -1) {
        is_off_day = true
        // console.log('shop: repeat off days - monthly')
      }
    }
  }
  // shop: specific off days
  for (let i in booking_specific_off_days_setup) {
    let off_day = booking_specific_off_days_setup[i]
    if (date_formated == moment.utc(off_day).format(options.standard_date_format.ymd)) {
      is_off_day = !workingDayResourceIds.includes(resource_setup_id)
      // console.log('shop: specific off days')
    }
  }

  // shop: workhour of day in shop_opening_day
  let shop_opened_days = []
  for (let i in booking_opening_hours_setup) {
    let opening_hour = booking_opening_hours_setup[i]
    let opened_days_of_week = opening_hour.opened_days_of_week
    shop_opened_days = shop_opened_days.concat(opened_days_of_week)
  }

  // shop: days not in shop_opened_days
  if (shop_opened_days.indexOf(day_picker) == -1) {
    is_off_day = true
    // console.log('shop: days not in shop_opened_days')
  }

  // resource
  if (resource_setup_id != null && resource_setup_id != undefined && resource_setup_id != 0) {
    for (let i in booking_resources_setup) {
      let resource = booking_resources_setup[i]
      if (resource_setup_id === resource.id) {
        // resource: specific off days
        for (let resource_off_day of resource.specific_off_days) {
          let resource_off_day_format = moment(resource_off_day).format(options.standard_date_format.ymd)
          if (date_formated == resource_off_day_format) {
            is_off_day = true
            // console.log('resource: specific off days')
          }
        }

        // resource: workhour of day in shop_opening_day
        let resource_opened_days = []
        for (let ii in resource.opening_hours) {
          let opening_hour = resource.opening_hours[ii]
          let opened_days_of_week = opening_hour.opened_days_of_week
          resource_opened_days = resource_opened_days.concat(opened_days_of_week)
        }

        // resource: days not in resource_opened_days
        if (resource_opened_days.indexOf(day_picker) == -1) {
          is_off_day = !workingDayResourceIds.includes(resource_setup_id)

          // console.log('resource: days not in resource_opened_days')
        }
      }
    }
  }

  return is_off_day
}

export function getBranchNumber(branchNumber, shopId) {
  const shopData = store.state.authentication.shop
  if(shopId === shopData.shop_id || branchNumber === 0) {
    return ''
  }
  return branchNumber
}

export function isHasSpecificAllowedBooking (date, resource_setup_id, booking_resources_setup) {
  const bookingResources = booking_resources_setup.find(item => item.id === resource_setup_id)

  return bookingResources ? bookingResources.specific_working_days.some(item => item.specificWorkingDayTS === convertDateToTimeStamp(date)) : {}
}

export function calculateMinute(totalMinutes) {
  let minutes = totalMinutes
  if (totalMinutes >= options.minutes_of_24h) {
    minutes -= options.minutes_of_24h
  }

  if (minutes >= options.minutes_of_12h + 60 ) return minutes - options.minutes_of_12h

  return minutes
}

export function isAmOrPm(total_minutes, zero_in_hour = true, has_time_subfix = true) {
  let minutes_of_half_day = 720
  let tmp_total_minutes = total_minutes

  if (tmp_total_minutes >= options.minutes_of_24h)
    tmp_total_minutes -= options.minutes_of_24h

  let total_half_day_minute = tmp_total_minutes
  if (tmp_total_minutes >= minutes_of_half_day + 60) {
    total_half_day_minute -= minutes_of_half_day
  }

  let time_text = convertMinutesToHours(total_half_day_minute, false, zero_in_hour)

  if(!has_time_subfix) {
    return time_text
  }

  if (tmp_total_minutes < minutes_of_half_day) time_text += ' AM'
  if (minutes_of_half_day <= tmp_total_minutes) time_text += ' PM'
  return time_text
}
export function logTime() { // event_name
  let date = new Date()
  let time = date.getSeconds() + '.' + date.getMilliseconds()
  // console.log(event_name, time)
  return time
}
export function getDatePickerMin(date_picked) {
  return moment(date_picked).subtract(1, 'month').toDate()
}
export function getDatePickerMax(date_picked) {
  return moment(date_picked).add(1, 'year').toDate()
}
export async function calculatePaymentMethodName(booking) {
  const bookingDeposit = new BookingDepositViewModel(booking?.fields?.booking_deposit)

  const shop = store.state.authentication.shop
  const paymentMethodOptions = await cache_session.getPaymentMethodSetupCache(shop.shop_id)
  for (let paymentMethodOption of paymentMethodOptions) {
    if (paymentMethodOption?.id === bookingDeposit?.fields?.bookingDepositPayment?.paymentMethodId) {
      return paymentMethodOption?.name
    }
  }

  return ''
}

export function isExceedMaxCalendarCols(dates_on_calendar, resources_by_date) {
  let max_calendar_col = options.calendar_max_cols
  let tmp_calendar_col = dates_on_calendar * resources_by_date
  if (dates_on_calendar > 1 && tmp_calendar_col > max_calendar_col)
    return true

  return false
}
export function getLastTimeSlotToBooking(work_hour_start, work_hour_finish, booking_time_slot) {
  let tmp_finish_minutes = convertHoursToMinutes(work_hour_finish)
  let tmp_surplus_minutes = (work_hour_finish - work_hour_start) % booking_time_slot
  if (tmp_surplus_minutes > 0) {
    tmp_finish_minutes += tmp_surplus_minutes
  }
  return convertMinutesToHours(tmp_finish_minutes - booking_time_slot)
}

export function emptyValue(value) {
  let empty = false

  if (value === undefined || value === null || value === '') empty = true
  else if (typeof value == 'object' && value.length == 0) empty = true
  else empty = false

  return empty
}

/*
  Input  : array, value
  Output : text
  Exp : arr = [
    {value :  1 , text : 'value 1'},
    {value :  2 , text : 'value 2'}
  ]
  (arr,1) => 'value 1'
*/
export function getTypeNameOfArray(arr, value) {
  let text = ''
  let type = find(arr, x => x.value == value)
  if (type != undefined) {
    text = i18n.t(type.text)
  }
  return text
}

export function formatSize(size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
}

export function cookieAction(vue, cookie_action, key, expiry_date = null, value = null) {
  if (cookie_action == options.cookie_action.exist)
    return vue.$cookies.isKey(key)
  else if (cookie_action == options.cookie_action.set)
    vue.$cookies.set(key, value, expiry_date)
  else if (cookie_action == options.cookie_action.remove)
    vue.$cookies.remove(key)
  else if (cookie_action == options.cookie_action.get)
    return vue.$cookies.get(key)
}

export function gotoLoginPageWhenPossibble(vue, countryCode) {
  const getEnvLoginURL = (countryCode) => {
    if (countryCode == 'KR')
      // eslint-disable-next-line no-undef
      return process.env.LOGIN_URL_KR
      //return 'login'
      //return 'http://192.168.0.37:8066/login/login_form_salon.asp'
    else
      // eslint-disable-next-line no-undef
      return process.env.LOGIN_URL_DEFAULT
      //return 'login'
      //return 'http://192.168.0.37:8066/login/login_form_salon.asp'
  }
  const isMobileApp = checkMobileApp()
  const isAspPage = checkAspPage()
  let login_page = getEnvLoginURL(countryCode)
  const deviceInfo = getDataDeviceInfo()
  if(isMobileApp) {
    if((deviceInfo?.isIphone || deviceInfo?.isIpad) && !isAspPage) {
      login_page = 'login'
    } else {
      login_page = login_page + process.env.PARAM_TO_CHECK_MOBILE_APP + process.env.PARAM_TO_CHECK_VERSION // eslint-disable-next-line no-undef
    }
  }

  if (login_page) {
    if (login_page.startsWith('http')) {
      //window.location.href = login_page
      window.location.replace(login_page)
    }
    else vue.$router.push({ path: login_page })
    return true
  }
  return false
}

export function roundNumberByDecimal(number, decimal = 0) {
  let factor = Math.pow(10, decimal)
  let tmp_number = Math.round(number * factor) / factor
  return tmp_number
}

export function hideMobilePhone(phoneNumber, visibleLength = 4) {
  if (phoneNumber == null || phoneNumber.length <= visibleLength) return phoneNumber
  if (phoneNumber.length > visibleLength) return phoneNumber.substring(phoneNumber.length - visibleLength, phoneNumber.length).padStart(phoneNumber.length, '*')
}

export function hiddenInformation() {
  return '**********'
}

export function getHideClientInfoPermission(contactInfoToManager, contactInfoToStaff, registrationDate) {
  const user = store.state.authentication.user
  const shop = store.state.authentication.shop
  let isHide = false

  if (user.user_role_code == options.user_roles.manager) {
    if (contactInfoToManager == options.clients_enums.contact_info_hiding_type.hideall) isHide = true

    if (contactInfoToManager == options.clients_enums.contact_info_hiding_type.hide_except_registered_today) {
      if (!isClientRegisteredToday(registrationDate, shop.timezone)) isHide = true
    }
  }
  if (user.user_role_code == options.user_roles.staff) {
    if (contactInfoToStaff == options.clients_enums.contact_info_hiding_type.hideall) isHide = true

    if (contactInfoToStaff == options.clients_enums.contact_info_hiding_type.hide_except_registered_today) {
      if (!isClientRegisteredToday(registrationDate, shop.timezone)) isHide = true
    }
  }
  return isHide
}

export function isClientRegisteredToday(registration_date, timezone) {
  let is_registered_today = true
  let today_date = formatDate(convertDateFromUtcToTimezone(new Date(), timezone))
  let new_format_registration_date = formatDate(convertDateFromUtcToTimezone(registration_date, timezone))
  if (registration_date == undefined || today_date != new_format_registration_date)
    is_registered_today = false
  return is_registered_today
}

export function showUserRoles(user_role) {
  if (user_role == options.user_roles.admin_master || user_role == options.user_roles.admin_staff)
    return i18n.t('user-roles.admin-master')
  if (user_role == options.user_roles.master)
    return i18n.t('user-roles.master')
  if (user_role == options.user_roles.staff)
    return i18n.t('user-roles.staff')
  if (user_role == options.user_roles.manager)
    return i18n.t('user-roles.manager')
}

export function calculateShopTotalMonthlyFee(shop_solution_amount
  , shop_total_extra_amount
  , shop_discount_amount
  , dependent_total_fee
  , waived_monthly_fee
  , billing_type
  , include_extra_amount_of_dependents
  , is_include_extra_fees = true) {

  let totalAmount = 0

  if (billing_type === options.admin_enums.billing_type.each) {
    totalAmount = shop_solution_amount - shop_discount_amount
    if (is_include_extra_fees)
      totalAmount += shop_total_extra_amount
  }

  else if (billing_type == options.admin_enums.billing_type.consolidated) {
    if (waived_monthly_fee === options.admin_enums.waived_monthly_fee.not_waived)
      totalAmount = shop_solution_amount - shop_discount_amount
    if (is_include_extra_fees)
      totalAmount += shop_total_extra_amount

    totalAmount += dependent_total_fee
  }

  else if (billing_type == options.admin_enums.billing_type.depending) {
    if (!include_extra_amount_of_dependents)
      totalAmount = shop_total_extra_amount
  }

  return totalAmount
}

export function equalObject(object_1, object_2) {
  return isEqual(object_1, object_2)
}

export function isMobileNumber(phoneNum) {
  var regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/
  if (regExp.test(phoneNum)) {
    regExp.exec(phoneNum)
    return true
  } else return false
}

export function isKrMobileNumber(phoneNum) {
  const regExp = /^\d{0,11}$/
  return regExp.test(phoneNum)
}

export function getClientImageURL(image_path, image_name) {
  // eslint-disable-next-line no-undef
  return process.env.AZURE_STORAGE_CLIENT_URL + image_path + '/' + image_name
}

export function getAdminsImageURL(image_path, image_name) {
  // eslint-disable-next-line no-undef
  return process.env.AZURE_STORAGE_ADMINS_URL + image_path + '/' + image_name
}

export function getBoardImageURL(file_path, storage_file_name) {
  if (!file_path || !storage_file_name) return null

  // eslint-disable-next-line no-undef
  const baseUrl = process.env.AZURE_STORAGE_BOARD_URL
  if (!baseUrl) {
    return null
  }
  // Remove leading slash from file_path if exists
  const cleanFilePath = file_path.startsWith('/') ? file_path.substring(1) : file_path
  return baseUrl + cleanFilePath + '/' + storage_file_name
}

export function convertTimeStampToTime(timestamp) {
  let hours = parseInt(parseInt(timestamp / 60) / 60)
  let miuntes = parseInt(parseInt(timestamp / 60) % 60)
  return hours + ' ' + i18n.t('general.hour') + ' ' + miuntes + ' ' + i18n.t('general.minutes')
}

export function replaceLineBreaks(contents) {
  if (contents != undefined)
    return contents.replace(/(?:\r\n|\r|\n)/g, '<br />')
  else return contents
}

export function isPermittedBySetupRole(role_level) {
  const user = store.state.authentication.user

  let permissions = []
  if (role_level == sales_options.security_level_enum.master) {
    permissions.push(options.user_roles.master)
  } else if (role_level == sales_options.security_level_enum.manager_or_higher) {
    permissions.push(options.user_roles.master)
    permissions.push(options.user_roles.manager)
  } else {
    permissions.push(options.user_roles.master)
    permissions.push(options.user_roles.manager)
    permissions.push(options.user_roles.staff)
  }

  return permissions.includes(user.user_role_code)
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

export function formatMobileAndPhoneNumber(phoneNumber, hide = false) {
  if (checkNullAndEmptyAndUndefined(phoneNumber)) return phoneNumber

  const shop = store.state.authentication.shop
  const country = shop.country

  if (hide) {
    const visibleLength = (function () {
      if (country == options.country.kr) return 4
      if (country === options.country.vn) return 3
    })()

    phoneNumber = hideMobilePhone(phoneNumber, visibleLength)
  }

  if (country == options.country.kr) {
    return formatKRMobileAndPhoneNumber(phoneNumber)
  }

  if (country === options.country.vn) {
    return formatVNMobileAndPhoneNumber(phoneNumber)
  }

  return phoneNumber
}

export function formatMobileAndPhoneNumberByCountryCode(phoneNumber, countryCode = options.country.kr) {
  if (checkNullAndEmptyAndUndefined(phoneNumber)) return phoneNumber

  if (countryCode == options.country.kr) {
    return formatKRMobileAndPhoneNumber(phoneNumber)
  }

  if (countryCode === options.country.vn) {
    return formatVNMobileAndPhoneNumber(phoneNumber)
  }

  return phoneNumber
}

export function replaceAll(str, search_str, replace_str) {
  return str.split(search_str).join(replace_str)
}

export function formatQuantityOfPrepaidService(refund_item_prepaid_service) {
  const quantity = formatMoney(refund_item_prepaid_service.quantity, 0)
  const deduction_quantity = formatMoney(refund_item_prepaid_service.deduction_amount, 0)
  let tmp_txt = `${quantity}`
  if (refund_item_prepaid_service.quantity_before_changed != options.enum_no_limit) {
    tmp_txt += ` (-${deduction_quantity})`
  }
  return tmp_txt
}

export function clientAddPrivacyLog(privacyWorkType, pageSize, pageNumber) {
  const shop = store.state.authentication.shop
  if (shop.country === options.country.kr) {
    const payload = {
      privacy_work_type: privacyWorkType,
      page_size:         pageSize,
      page_number:       pageNumber,
    }
    const clientPrivacyLogApi = new ClientPrivacyLogApi()
    clientPrivacyLogApi.addPrivacyLogAsync(payload)
  }
}

export function checkValidMobilePhoneKR(mobile) {
  if (/^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/.test(mobile) == false)
    return false
  else return true
}

export function hasThirtyFirstInMonth(month){
  let months_string = month.toString()
  const months = [ '1', '3', '5', '7', '8', '10', '12' ] // has 31 in month
  if(months.includes(months_string)) return true
  else return false
}

export function isLeapYear(year){
  if (year % 400 === 0) return true
  if (year % 100 === 0) return false
  return year % 4 === 0
}

export function checkYearOfBirth(year, month, day){
  const date = convertDateToTimeStamp(new Date(year, month, day))
  if(date > getCurrentSettingDateTimeTS())
    return false
  return true
}

export async function compressFileAsync(fileUpload, limitFileSize, options) {
  const old_file = fileUpload.file
  let tmpImageWidth = 0

  return new Promise(async (resolve) => {
    let file = fileUpload.file
    // compress by quality
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      const base64data = reader.result
      const image = new Image()
      image.src = base64data
      image.onload = function() {
        new ImageCompressor(file, {
          ...options,
          quality:     common_options.imageCompressConfig.quality,
          convertSize: common_options.imageCompressConfig.convertSize,
          drew(context, canvas) {
            context.drawImage(image, 0, 0, 200, 200)
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
            tmpImageWidth = canvas.width
          },
          success(result) {
            const newFile = new File([result], old_file.name, old_file)
            const compressedFile = {
              ...fileUpload,
              file: newFile,
            }
            // compress by scale
            if(compressedFile.file.size > limitFileSize) {
              tmpImageWidth = tmpImageWidth * common_options.imageCompressConfig.scale
              resolve(compressFileAsync(compressedFile, limitFileSize, {
                width: tmpImageWidth,
              }))
            }
            resolve(compressedFile)
          },
        })

      }
    }
  })
}

export function checkMenuRole(userRoles, code){
  return userRoles?.length > 0 && includes(userRoles, code)
}

export function decodeChunkValue(chunk_value){
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(chunk_value)
}

export function isResponseAsJsonString(string){
  return string.indexOf('{') == 0 &&
         string.lastIndexOf('}') == string.length - 1 &&
         string.includes('isOK')
}

export function formatEstimatedTime(estimatedTimeMinutes) {
  let formatedEstimatedTime = ''

  const addPrefixZero = estimatedTime => {
    if (estimatedTime < 10) {
      return `0${estimatedTime}`
    }
    return estimatedTime
  }

  if (estimatedTimeMinutes <= 0) {
    formatedEstimatedTime += i18n.tc('general.estimated-time-minutes', estimatedTimeMinutes, { minutes: addPrefixZero(estimatedTimeMinutes) })
    return formatedEstimatedTime
  }

  const hours = Math.floor(estimatedTimeMinutes / 60)
  const minutes = estimatedTimeMinutes % 60

  if (hours !== 0) {
    formatedEstimatedTime += i18n.tc('general.estimated-time-hours', hours, { hours })
  }

  if (minutes !== 0) {
    if (hours !== 0) {
      formatedEstimatedTime += ' '
    }

    formatedEstimatedTime += i18n.tc('general.estimated-time-minutes', minutes, { minutes: addPrefixZero(minutes) })
  }

  return formatedEstimatedTime
}

export function formatMinutesToHourTime(totalMinutes) {
  let formatedEstimatedTime = ''

  const addPrefixZero = estimatedTime => {
    if (estimatedTime < 10) {
      return `0${estimatedTime}`
    }
    return estimatedTime
  }

  if (totalMinutes <= 0) {
    formatedEstimatedTime += i18n.tc('general.time-minutes', totalMinutes, { minutes: addPrefixZero(totalMinutes) })
    return formatedEstimatedTime
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours !== 0) {
    formatedEstimatedTime += i18n.tc('general.estimated-time-hours', hours, { hours })
  }

  if (minutes !== 0) {
    if (hours !== 0) {
      formatedEstimatedTime += ' '
    }

    formatedEstimatedTime += i18n.tc('general.time-minutes', minutes, { minutes: addPrefixZero(minutes) })
  }

  return formatedEstimatedTime
}

export function getDateRangeFromBeginningToCurrentValue() {
  const currentDatetimeByShopSettingMoment = parseDateTSToMomentWithAddingShopSettingTimezone({
    inputDateTS:       moment().unix(),
    inputDateTimezone: 0,
  })

  return {
    from_date_ts: currentDatetimeByShopSettingMoment.clone().utc().startOf('month').unix(),
    to_date_ts:   currentDatetimeByShopSettingMoment.clone().utc().endOf('day').unix(),
  }
}

export function parseNumberExcludeDecimal(number){
  const decimalValue = number % 1
  if(decimalValue > 0){
    return number - decimalValue
  }
  return number
}

export function parseNumberToStringExcludeDecimal(number){
  return parseNumberExcludeDecimal(number).toString()
}

export function validNumberFromEmptyString(value){
  return value === '' ? 0 : value
}

export function encodeWithBase64UTF8(string) {
  return Buffer.from(string, 'utf8').toString('base64')
}

export function decodeFromBase64UTF8(string) {
  return Buffer.from(string, 'base64').toString('utf8')
}

export function generatePrepaidServiceName({
  quantity = 0,
  serviceName = '',
  isNoLimit = false,
}) {
  if (isNoLimit) {
    return `${serviceName} ${i18n.t('prepaid-services.no-limit')}`
  }
  return `${serviceName} ${quantity} ${i18n.t('report.times')}`
}

export async function checkHasNewAppVersionByFile() {
  const appVersionLastModified = store.state.app.appVersionLastModified

  const response = await fetch('', { 'cache': 'reload' }) // fetch current domain and checking its last-modified

  const headersLastModified = response?.headers?.get('Last-Modified') ?? ''
  const currentAppVersionLastModified = JSON.stringify(headersLastModified)

  return {
    currentAppVersionLastModified,
    hasNewAppVersion: appVersionLastModified && currentAppVersionLastModified !== appVersionLastModified,
  }
}

export function autoSelectInput(vue, ref) {
  vue.$nextTick(() => {
    vue.$refs[ref].select()
  })
}

export function formatHistoryNotes(history, isSpan, row, isCamelType, shopId) {
  if (isCamelType) {
    history.notes.system_notes = history.notes.systemNotes
    history.notes.user_notes = history.notes.userNotes
    row.ref_shop_name = row.refClientShopName
    row.ref_shop_id = row.refClientShopId
    row.ref_client_name = row.refClientName
  }

  let notes = ''
  let tag = isSpan ? 'span' : 'p'
  if(history.notes && history.notes.system_notes && history.notes.system_notes.length > 0){
    notes += `<${tag}>${escapeHtml(history.notes.system_notes || '')}</${tag}>`
  }
  if(history.notes && history.notes.user_notes && history.notes.user_notes.length > 0){
    notes += `<p class="history-note">${escapeHtml(history.notes.user_notes || '')}</p>`
  }
  if(history.notes && isSpan){
    if(row.ref_shop_id === shopId) row.ref_shop_name = null
    notes += `<${tag} class="shop-and-family-info__detail">${escapeHtml(row && (row.ref_shop_name || row.ref_client_name) ? (' (' + ((row.ref_shop_name ? row.ref_shop_name : '') + ( row.ref_shop_name && row.ref_client_name ? ', ' : '') + (row.ref_client_name ? row.ref_client_name : '') ) + ')' ) : '' )}</${tag}>`
  }
  return notes
}

export function showRemoteSupportPopup() {
  window.open('https://988.co.kr','popup','width=1000,height=800')
}

export function showContactChatPopup() {
  window.open(NAVER_TALKTALK_URL, 'popup', 'width=400,height=600')
}

export function escapeHtml(htmlStr) {
  return htmlStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function getBrowserScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer)

  return scrollbarWidth || 0
}

export function trimStringData(stringData = '') {
  if (typeof stringData === 'string') {
    return stringData.trim()
  }
  return stringData
}

export function encryptSHA512(value){
  var sha512 = require('js-sha512')
  return sha512(value)
}

export function isValidMinMaxDate(date) {
  const date_in_moment = moment(date)
  return date_in_moment.year() >= 1970 && date_in_moment.year() <= 2100
}

export function isDisableForStaff(registrationDate, contactInfoToStaff){
  const isDisableWhenHideAll = contactInfoToStaff == options.clients_enums.contact_info_hiding_type.hideall
  const registerDay = moment(registrationDate).format('YYYY-MM-DD')
  const nowDay = moment().format('YYYY-MM-DD')
  const isDisableWhenHideExeptToday = contactInfoToStaff == options.clients_enums.contact_info_hiding_type.hide_except_registered_today && !moment(registerDay).isSame(nowDay)
  return isDisableWhenHideAll || isDisableWhenHideExeptToday
}

export function isDisableForManager(registrationDate, contactInfoToManager){
  const isDisableWhenHideAll = contactInfoToManager == options.clients_enums.contact_info_hiding_type.hideall
  const registerDay = moment(registrationDate).format('YYYY-MM-DD')
  const nowDay = moment().format('YYYY-MM-DD')
  const isDisableWhenHideExeptToday = contactInfoToManager == options.clients_enums.contact_info_hiding_type.hide_except_registered_today && !moment(registerDay).isSame(nowDay)
  return isDisableWhenHideAll || isDisableWhenHideExeptToday
}

export function isDisableInputByUserRole(registrationDate, { contactInfoToStaff, contactInfoToManager }, userRoleCode){
  // Prevent Staff And Manager modify phone number, mobile number, address, postcode
  if (userRoleCode === options.user_roles.staff) {
    return isDisableForStaff(registrationDate, contactInfoToStaff)
  }
  else if (userRoleCode === options.user_roles.manager) {
    return isDisableForManager(registrationDate, contactInfoToManager)
  }
  else{
    return false
  }
}

export function hasJong(string){
  string = string.charCodeAt(string.length - 1)
  return (string - 0xac00) % 28 > 0
}

export function krTopicParticles(noun){
  if(hasJong(noun))
    return '은'
  else
    return '는'
}

export function getVibilityChangeConfigure() {
  let hidden = 'hidden'
  let visibilityChange = 'visibilitychange'

  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  return { hidden, visibilityChange }
}

export function getCashText() {
  return String(store?.state?.authentication?.shop?.country).toLowerCase() === 'kr' ? '현금' : 'Cash'
}

export function getAnswerText(supplement) {
  const answerListId = supplement.consentAnswers.map(answer => {
    return answer.consentQuestionChoiceId
  })

  const answerText = supplement.consentQuestionChoices.filter(choice => {
    return answerListId.includes(choice.consentQuestionChoiceId)
  })
  return answerText.map(text => text.choiceText).join(', ')
}

export function getCutOffEnum() {
  return [
    sales_options.discount_amount_cut_off_enum.cut_off_than_1,
    sales_options.discount_amount_cut_off_enum.cut_off_than_10,
    sales_options.discount_amount_cut_off_enum.cut_off_than_100,
    sales_options.discount_amount_cut_off_enum.cut_off_than_1000,
    sales_options.discount_amount_cut_off_enum.cut_off_than_10000,
  ]
}

export function getRoundOffEnum() {
  return [
    sales_options.discount_amount_cut_off_enum.round_off_than_1,
    sales_options.discount_amount_cut_off_enum.round_off_than_10,
    sales_options.discount_amount_cut_off_enum.round_off_than_100,
    sales_options.discount_amount_cut_off_enum.round_off_than_1000,
    sales_options.discount_amount_cut_off_enum.round_off_than_10000,
  ]
}

export function calculateCutRound({ value = 0, type = 0 }) {
  const valueCutRoundOff = SalesUtils.getAmountCutRoundOffByEnum(type)
  const multiplierCutRoundOffNumber = (() => {
    if(getCutOffEnum().includes(type)){
      return Math.floor(value / valueCutRoundOff)
    }

    if(getRoundOffEnum().includes(type)){
      return Math.round(value / valueCutRoundOff)
    }

    return 1
  })()

  return valueCutRoundOff ? valueCutRoundOff * multiplierCutRoundOffNumber : value
}

export function getShopId() {
  return store?.state?.authentication?.shop?.shop_id
}

export function getShopCountry() {
  return store?.state?.authentication?.shop?.country
}

export function isKrShop() {
  return String(getShopCountry()).toLowerCase() === 'kr'
}

export function dataBase64toFile(base64, filename) {
  const arr = base64.split(',')
  const fileType = arr[0].match(/:(.*?);/)[1]
  const stringArray = atob(arr[arr.length - 1])
  let n = stringArray.length
  const u8arr = new Uint8Array(n)
  while(n--) {
    u8arr[n] = stringArray.charCodeAt(n)
  }
  return new File([u8arr], filename, {type: fileType})
}

export function checkMobileApp() {
  return sessionStorage.getItem('isMobileApp') === 'true'
}
export function checkAspPage() {
  return sessionStorage.getItem('isAspPage') === 'true'
}

export function getWorkingDayResourceIds(bookingResourcesSetup, calendarDateTs) {
  const workingDayResourceIds = []
  bookingResourcesSetup.forEach(item => {
    const temp = item?.specificWorkingDays?.find(element => {
      return element.specificWorkingDayTS === calendarDateTs
    })

    if(temp) {
      workingDayResourceIds.push(temp.bookingResourceSetupId)
    }
  })
  return workingDayResourceIds
}

export function getOpeningHours(resource, calendarDateTs) {
  const result = resource?.specificWorkingDays?.find(item => item.specificWorkingDayTS === calendarDateTs)
  let openingHours = resource.opening_hours
  if(result) {
    openingHours = result.allowedBookingHours.map(item => {return {
      start_time:             item.startTime,
      finish_time:            item.finishTime,
      cross_date:             item.crossDate,
      hasSpecificWorkingHour: true,
      opened_days_of_week:    resource.opening_hours[0].opened_days_of_week,
    }})
  }

  return openingHours
}

export function getStartAndFinishTime(openingHours) {
  const sortedByStartTime = sortBy(openingHours, 'startTime')
  const startTime = head(sortedByStartTime)?.startTime

  const crossDates = openingHours.filter(item => item.crossDate)
  const notCrossDates = openingHours.filter(item => !item.crossDate)

  const finishTime = crossDates.length > 0
    ? last(sortBy(crossDates, 'finishTime'))?.finishTime
    : last(sortBy(notCrossDates, 'finishTime'))?.finishTime

  return {
    startTime,
    finishTime,
    crossDate: crossDates.length > 0,
  }
}

export function getReplacedEmoticonAlimTalkContents(contents) {
  let tmpContents = replaceLineBreaks(contents)

  const group = [
    { variable: '하트뿅', class: 'kao-a-01' }, { variable: '하하', class: 'kao-a-02' }, { variable: '우와', class: 'kao-a-03' }, { variable: '심각', class: 'kao-a-04' }, { variable: '힘듦', class: 'kao-a-05' },
    { variable: '흑흑', class: 'kao-a-06' }, { variable: '아잉', class: 'kao-a-07' }, { variable: '찡긋', class: 'kao-a-08' }, { variable: '뿌듯', class: 'kao-a-09' }, { variable: '깜짝', class: 'kao-a-10' },
    { variable: '빠직', class: 'kao-a-11' }, { variable: '짜증', class: 'kao-a-12' }, { variable: '제발', class: 'kao-a-13' }, { variable: '씨익', class: 'kao-a-14' }, { variable: '신나', class: 'kao-a-15' },
    { variable: '헉', class: 'kao-a-16' }, { variable: '열받아', class: 'kao-a-17' }, { variable: '흥', class: 'kao-a-18' }, { variable: '감동', class: 'kao-a-19' }, { variable: '뽀뽀', class: 'kao-a-20' },
    { variable: '멘붕', class: 'kao-a-21' }, { variable: '정색', class: 'kao-a-22' }, { variable: '쑥스', class: 'kao-a-23' }, { variable: '꺄아', class: 'kao-a-24' }, { variable: '좋아', class: 'kao-a-25' },
    { variable: '굿', class: 'kao-a-26' }, { variable: '훌쩍', class: 'kao-a-27' }, { variable: '허걱', class: 'kao-a-28' }, { variable: '부르르', class: 'kao-a-29' }, { variable: '푸하하', class: 'kao-a-30' },
    { variable: '발그레', class: 'kao-a-31' }, { variable: '수줍', class: 'kao-a-32' }, { variable: '컴온', class: 'kao-a-33' }, { variable: '졸려', class: 'kao-a-34' },

    { variable: '미소', class: 'kao-b-01' }, { variable: '윙크', class: 'kao-b-02' }, { variable: '방긋', class: 'kao-b-03' }, { variable: '반함', class: 'kao-b-04' }, { variable: '눈물', class: 'kao-b-05' },
    { variable: '절규', class: 'kao-b-06' }, { variable: '크크', class: 'kao-b-07' }, { variable: '메롱', class: 'kao-b-08' }, { variable: '잘자', class: 'kao-b-09' }, { variable: '잘난척', class: 'kao-b-10' },
    { variable: '헤롱', class: 'kao-b-11' }, { variable: '놀람', class: 'kao-b-12' }, { variable: '아픔', class: 'kao-b-13' }, { variable: '당황', class: 'kao-b-14' }, { variable: '풍선껌', class: 'kao-b-15' },
    { variable: '버럭', class: 'kao-b-16' }, { variable: '부끄', class: 'kao-b-17' }, { variable: '궁금', class: 'kao-b-18' }, { variable: '흡족', class: 'kao-b-19' }, { variable: '깜찍', class: 'kao-b-20' },
    { variable: '으으', class: 'kao-b-21' }, { variable: '민망', class: 'kao-b-22' }, { variable: '곤란', class: 'kao-b-23' }, { variable: '잠', class: 'kao-b-24' }, { variable: '행복', class: 'kao-b-25' },
    { variable: '안도', class: 'kao-b-26' }, { variable: '우웩', class: 'kao-b-27' }, { variable: '외계인', class: 'kao-b-28' }, { variable: '외계인녀', class: 'kao-b-29' }, { variable: '공포', class: 'kao-b-30' },
    { variable: '근심', class: 'kao-b-31' }, { variable: '악마', class: 'kao-b-32' }, { variable: '썩소', class: 'kao-b-33' }, { variable: '쳇', class: 'kao-b-34' }, { variable: '야호', class: 'kao-b-35' },
    { variable: '좌절', class: 'kao-b-36' }, { variable: '삐짐', class: 'kao-b-37' }, { variable: '하트', class: 'kao-b-38' }, { variable: '실연', class: 'kao-b-39' }, { variable: '별', class: 'kao-b-40' },

    { variable: '브이', class: 'kao-c-01' }, { variable: '오케이', class: 'kao-c-02' }, { variable: '최고', class: 'kao-c-03' }, { variable: '최악', class: 'kao-c-04' }, { variable: '그만', class: 'kao-c-05' },
    { variable: '땀', class: 'kao-c-06' }, { variable: '알약', class: 'kao-c-07' }, { variable: '밥', class: 'kao-c-08' }, { variable: '커피', class: 'kao-c-09' }, { variable: '맥주', class: 'kao-c-10' },
    { variable: '소주', class: 'kao-c-11' }, { variable: '와인', class: 'kao-c-12' }, { variable: '치킨', class: 'kao-c-13' }, { variable: '축하', class: 'kao-c-14' }, { variable: '음표', class: 'kao-c-15' },
    { variable: '선물', class: 'kao-c-16' }, { variable: '케익', class: 'kao-c-17' }, { variable: '촛불', class: 'kao-c-18' }, { variable: '컵케익a', class: 'kao-c-19' }, { variable: '컵케익b', class: 'kao-c-20' },
    { variable: '해', class: 'kao-c-21' }, { variable: '구름', class: 'kao-c-22' }, { variable: '비', class: 'kao-c-23' }, { variable: '눈', class: 'kao-c-24' }, { variable: '똥', class: 'kao-c-25' },
    { variable: '근조', class: 'kao-c-26' }, { variable: '딸기', class: 'kao-c-27' }, { variable: '호박', class: 'kao-c-28' }, { variable: '입술', class: 'kao-c-29' }, { variable: '야옹', class: 'kao-c-30' },
    { variable: '돈', class: 'kao-c-31' }, { variable: '담배', class: 'kao-c-32' }, { variable: '축구', class: 'kao-c-33' }, { variable: '야구', class: 'kao-c-34' }, { variable: '농구', class: 'kao-c-35' },
    { variable: '당구', class: 'kao-c-36' }, { variable: '골프', class: 'kao-c-37' }, { variable: '카톡', class: 'kao-c-38' }, { variable: '꽃', class: 'kao-c-39' }, { variable: '총', class: 'kao-c-40' },
    { variable: '크리스마스', class: 'kao-c-41' }, { variable: '콜', class: 'kao-c-42' },
  ]

  group.forEach(e => {
    tmpContents = replaceAll(tmpContents, '(' + e.variable + ')', '<i class="'+ e.class + ' dib"></i>')
  })

  tmpContents = replaceAll(tmpContents, /#{/, '((')
  tmpContents = replaceAll(tmpContents, /}/, '))')

  return tmpContents
}

export async function convertImageToJPEG(imageFullPath, imageType, options = {}) {
  const { maxWidth = 0, maxHeight = 0, quality = 0.8 } = options

  try {
    const response = await fetch(imageFullPath)
    const blob = await response.blob()
    const objectURL = URL.createObjectURL(blob)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const image = new Image()
    image.src = objectURL

    await imageLoaded(image)

    // Calculate dimensions (resize if maxWidth/maxHeight provided)
    let { width, height } = image
    if (maxWidth > 0 && width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }
    if (maxHeight > 0 && height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(image, 0, 0, width, height)

    URL.revokeObjectURL(objectURL)

    if (imageType === 'png') {
      return new Promise(resolve => {
        canvas.toBlob(blob => {
          resolve(blob)
        }, 'application/octet-stream')
      })
    }

    // Return Blob URL instead of base64
    return new Promise(resolve => {
      canvas.toBlob(resultBlob => {
        const blobUrl = URL.createObjectURL(resultBlob)
        resolve({
          url:    blobUrl,
          revoke: () => URL.revokeObjectURL(blobUrl),
        })
      }, 'image/jpeg', quality)
    })

  } catch (err) {
    return null
  }
}

export async function imageLoaded(image) {
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve()
    }

    image.onerror = (error) => {
      reject(error)
    }
  })
}

export function moveElement(arr, fromIndex, toIndex) {
  const element = arr.splice(fromIndex, 1)[0]
  arr.splice(toIndex, 0, element)
}

export function isFutureSaleDate(salesDate, currentDate) {
  return salesDate > currentDate
}

export function convertDateTSToYMDHLocalized(dateTs) {
  return moment(new Date(convertTimeStampMinusLocalzone(dateTs) * 1000)).format(options.standard_date_format.ymdh)
}

export const DIRECTION_ENUM = {
  ASC:  'asc',
  DESC: 'desc',
}

export const sortDataByDate = (data, direction = DIRECTION_ENUM.ASC) =>
  data.sort((a, b) => (direction === 'desc' ? b.createdDateTimeTS - a.createdDateTimeTS : a.createdDateTimeTS - b.createdDateTimeTS))

export const getDeductionPaymentMethodName = paymentMethodId => {
  const deductionPaymentMethodMap = {
    [options.deductionPaymentMethodId.pointDeduction]:          i18n.t('payroll.payroll-setup.amonut-recognized-as-sales-setup.point-deduction'),
    [options.deductionPaymentMethodId.balanceDeduction]:        i18n.t('sales.balance-deduction'),
    [options.deductionPaymentMethodId.prepaidServiceDeduction]: i18n.t('sales.service-deduction'),
    [options.deductionPaymentMethodId.outstanding]:             i18n.t('payroll.payroll-setup.amonut-recognized-as-sales-setup.outstanding'),
  }

  return deductionPaymentMethodMap[paymentMethodId] || ''
}

export const isValidStringSearchValue = (str) => {
  // Empty string check
  if (!str) return false

  // If string starts with 4 digits, it's valid
  if (/^[0-9]{4}/.test(str)) {
    return true
  }

  // If string starts with 1-3 digits, it needs at least one letter
  if (/^[0-9]{1,3}/.test(str)) {
    return /[^0-9]/.test(str)
  }

  return true
}

// eslint-disable-next-line no-unused-vars
export const initialIsDisabledCacheBooking = (name) => {// This name has value passed but only use for debug.
  // get from session:
  let isDisabledCacheBookingRaw = sessionStorage.getItem('isDisabledCacheBooking')

  // save to session:
  let isDisabledCacheBooking = JSON.parse(isDisabledCacheBookingRaw)
  if(isDisabledCacheBooking === null) {
    isDisabledCacheBooking = false
    sessionStorage.setItem('isDisabledCacheBooking', JSON.stringify(isDisabledCacheBooking))
  }

  return isDisabledCacheBooking
}

export const getSecondOutOfMs = (msStartAt, buffer = 2) => Math.floor((Date.now() - msStartAt) / 1000) - buffer

let lastTimerId = null
export function storeSecondInSessionStorage(name, msStartAt, LIMIT = 8000) {
  lastTimerId = JSON.parse(sessionStorage.getItem('lastTimerId'))
  const lastCachedName = `${name}-${msStartAt}`
  if (lastTimerId) {
    sessionStorage.removeItem(lastCachedName)
  }
  lastTimerId = setInterval(() => {
    const seconds = getSecondOutOfMs(msStartAt)
    sessionStorage.setItem(lastCachedName, seconds)
  }, 1000)

  setTimeout(() => clearInterval(lastTimerId), LIMIT)
  return lastTimerId
}

export const getCacheData = (cacheData, cacheKey, DURATION) => {
  // Check cache
  if (cacheData.has(cacheKey)) {
    const cached = cacheData.get(cacheKey)
    const second = getSecondOutOfMs(cached.timestamp)

    if (second < DURATION / 1000) {
      return cached.data
    } else {
      cacheData.delete(cacheKey)
    }
  }
  return null
}

export const ArrayUtilities = {
  isAnEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0
  },
}

export const VariableUtilities = {
  // Checking variable:
  isNullOrUndefined(variable) {
    return variable === null || variable === undefined
  },
  isAnEmptyArrayOrFalsyValue(variable) {
    return this.isNullOrUndefined(variable) || ArrayUtilities.isAnEmptyArray(variable)
  },

  // Replace value instead of falsy:
  zeroIfLessThanZero(variable) {
    return variable < 0 ? 0 : variable
  },

  // Rounding value:
  roundOneUnit(variable) {
    return Math.round((variable + Number.EPSILON) * 10) / 10
  },

  addDecimalPoint(num) {
    return num >= 100 ? `${num}` : `${num}.0`
  },
}

export function isExternal(link) {
  return /^https?:\/\//.test(link)
}

export function isInternal(link) {
  return link && !isExternal(link)
}

export function isValidInternalLink(url) {
  if (typeof url !== 'string') return false

  const lowerUrl = url.toLowerCase()

  // Danh sách các slug nội bộ không cho phép
  const disallowedSlugs = [
    '/debug',
    '/env',
    '/internal-api',
    '/server-status',
    '/phpmyadmin',
    '/system/logs',
    '/hidden-page',
    '/reset-db',
    '/logout',
    '/delete-account',
    '/api',
    '/dev-tools',
  ]

  return (
    lowerUrl.startsWith('/') &&
    !lowerUrl.startsWith('//') &&
    !lowerUrl.startsWith('/javascript:') &&
    !lowerUrl.startsWith('/data:') &&
    !lowerUrl.startsWith('/file:') &&
    !disallowedSlugs.includes(lowerUrl.split('?')[0].split('#')[0]) // kiểm tra path thuần
  )
}

function isBlockedIpUrl(url) {
  const blockedPrefixes = [
    '0.',
    '127.', // Loopback (localhost)
    '169.254.', // Link-local (auto-assigned IP)
    '192.0.2.', // Reserved for documentation
    '198.51.100.', // Reserved for documentation
    '203.0.113.', // Reserved for documentation
    '224.', '225.', '226.', '227.', '228.', '229.', '230.', '231.',
    '232.', '233.', '234.', '235.', '236.', '237.', '238.', '239.', // Multicast
    '255.', // Broadcast
  ]

  try {
    const { hostname } = new URL(url)

    // Check if it's an IPv4 address
    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
    if (!isIp) return false

    // Allow common private IP ranges used in LAN (salon/shop)
    if (
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) // 172.16.x.x to 172.31.x.x
    ) {
      return false // Allowed
    }

    // Block if it matches known bad/reserved IP prefixes
    return blockedPrefixes.some(prefix => hostname.startsWith(prefix))
  } catch {
    return false // Not a valid URL – treat as safe in this context
  }
}

export function isSafeUrl(url) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) && !isBlacklistedUrl(url) && !isBlockedIpUrl(url)
  } catch (e) {
    return false
  }
}

export const blacklistedDomains = [
  'malicious-site.com',
  'phishing-login.net',
  'free-gift.ru',
  'fakebank-login.com',
  'get-rich-quick.xyz',
  'virus-download.net',
  'xn--oogle-vwa.com',
  'redirector.com',
  'suspicious-files.com',
]

export function isBlacklistedUrl(url) {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace(/^www\./, '')
    return blacklistedDomains.includes(hostname)
  } catch (e) {
    return false // URL is not valid, so it is not safe
  }
}

export function normalizeTextSafe(text) {
  if (text == null) return text

  let processedText = text.replace(/\r\n?/g, '\n')

  // U+200B ZWSP, U+2060 WJ, U+FEFF BOM
  processedText = processedText.replace(/[\u200B\u2060\uFEFF]/g, '')

  // NNBSP(U+202F), U+2000–U+200A
  processedText = processedText.replace(/[\u202F\u2000-\u200A]/g, ' ')

  return processedText
}

export function calculateClientAge(birthYear, birthMonth, birthDD, birthdayString) {
  if (!birthdayString) return ''
  const y = Number(birthYear)
  if (!Number.isFinite(y) || y <= 0) return `(${birthdayString})`

  let m = birthMonth == null ? 1 : Math.trunc(birthMonth)
  let d = birthDD == null ? 1 : Math.trunc(birthDD)
  m = Math.min(12, Math.max(1, m))
  const daysInMonth = new Date(y, m, 0).getDate()
  d = Math.min(daysInMonth, Math.max(1, d))

  const today = convertDateToTimezone(new Date())
  let age = today.getFullYear() - y

  const hasBirthdayPassed =
    (today.getMonth() + 1 > m) || ((today.getMonth() + 1 === m) && (today.getDate() >= d))

  if (!hasBirthdayPassed) age -= 1
  let ageText = i18n.t('clients.age-text')
  return `${age}${ageText} (${birthdayString})`
}

export function realSubstring(str, start, end, countryCode = 'KR') {
  const currentLanguage = countryCode === 'KR' ? 'ko-KR' : 'en-US'
  const segmenter = new Intl.Segmenter(currentLanguage, { granularity: 'grapheme' })
  const segments = [...segmenter.segment(str)]

  const slicedSegments = end !== undefined
    ? segments.slice(start, end)
    : segments.slice(start)

  return slicedSegments.map(s => s.segment).join('')
}

export function realLength(str, countryCode = 'KR') {
  const currentLanguage = countryCode === 'KR' ? 'ko-KR' : 'en-US'
  const segmenter = new Intl.Segmenter(currentLanguage, { granularity: 'grapheme' })

  return [...segmenter.segment(str)].length
}
