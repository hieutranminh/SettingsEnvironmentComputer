import i18n from 'Translate'
import store from '../../store/store'
import { options } from 'OptionsHelpers'
import { sales_options } from 'Options/sales-options'
import { common_options } from 'Options/common-options'
import { filter, sortBy, last, cloneDeep, find } from 'lodash'

import moment from 'moment'
import {
  escapeHtml,
  formatMoney,
  checkUndefined,
  convertTimeStampToUtcDate,
  convertDateToTimeStamp,
  convertDateToTimezone,
  convertTimeStampToDate,
  roundNumberByDecimal,
  checkNullAndEmptyAndUndefined,
  parseDateTSToMomentWithAddingShopSettingTimezone,
} from 'CommonHelpers'
import { getStartOfTimezoneDateTS } from 'DatetimeHelpers'
import { PERMISSION_TYPE, USER_ROLES } from 'Constant'
import { isPermissionGranted } from 'PermissionHelpers'

export default class SalesUtils {
  static getDiscountCardsToApply(expireDatetimeTS, salesItems) {

    const tmp_sales_action_helper = store.getters['sales/getSalesActionHelper']
    const tmp_client_prepaid_cards = tmp_sales_action_helper.client_prepaid_cards
    let tmp_discount_card_to_apply_product = []
    let tmp_discount_card_to_apply_service = []

    const currentDatetimeTs = parseDateTSToMomentWithAddingShopSettingTimezone({
      inputDateTS:       moment().unix(),
      inputDateTimezone: 0,
    }).unix()

    const isValidDiscountCard = ({
      prepaidCard,
      discountKey,
    }) => {
      const hasDiscountCardKey = prepaidCard?.[discountKey] > 0
      const isDiscountForClient = prepaidCard.discount_for_client
      const isPrepaidCardAvailable = (() => {
        if (prepaidCard.expiry_date_ts === -1) {
          return true
        }

        if (prepaidCard?.is_adding_temporarily) {
          return prepaidCard.expiry_date_ts > expireDatetimeTS
        }
        return prepaidCard.expiry_date_ts > currentDatetimeTs
      })()

      const isDiscountCard = prepaidCard.prepaid_card_type === options.prepaid_card_type.discount_card
      const isDepositCard = prepaidCard.prepaid_card_type === options.prepaid_card_type.deposit_card && prepaidCard.balance > 0

      return isDiscountForClient && hasDiscountCardKey && isPrepaidCardAvailable && (isDiscountCard || isDepositCard)
    }

    const isApplyServiceDiscount = salesItems.some(item => item.goods_type === sales_options.sales_goods_type.service && checkUndefined(item.isPackage))
    if(isApplyServiceDiscount) {
      tmp_discount_card_to_apply_service = filter(tmp_client_prepaid_cards, prepaidCard => isValidDiscountCard({
        prepaidCard,
        discountKey: 'discount_for_service',
      }))
      tmp_discount_card_to_apply_service = sortBy(tmp_discount_card_to_apply_service, ['discount_for_service'])
    }

    const isApplyProductDiscount = salesItems.some(item => item.goods_type === sales_options.sales_goods_type.product && checkUndefined(item.isPackage))

    if(isApplyProductDiscount) {
      tmp_discount_card_to_apply_product = filter(tmp_client_prepaid_cards, prepaidCard => isValidDiscountCard({
        prepaidCard,
        discountKey: 'discount_for_product',
      }))
      tmp_discount_card_to_apply_product = sortBy(tmp_discount_card_to_apply_product, ['discount_for_product'])
    }

    if(tmp_discount_card_to_apply_product.length) {
      tmp_discount_card_to_apply_product = tmp_discount_card_to_apply_product.reverse()
    }

    if(tmp_discount_card_to_apply_service.length) {
      tmp_discount_card_to_apply_service = tmp_discount_card_to_apply_service.reverse()
    }
    return {
      product: tmp_discount_card_to_apply_product,
      service: tmp_discount_card_to_apply_service,
    }
  }

  static updateStaffsAmountOfSalesItem(staffs, sales_item){
    const sales_item_amount = sales_item.amount

    const split_sales_type = sales_item?.split_sales_type ?? sales_options.split_sales_type.none

    const tmp_staff_amount = Math.floor(sales_item_amount / staffs.length)
    let tmp_staff_amount_remain = sales_item_amount % staffs.length

    if(split_sales_type == sales_options.split_sales_type.even){
      staffs.map(s => s.amount = tmp_staff_amount)
      if(tmp_staff_amount_remain > 0){
        last(staffs).amount += tmp_staff_amount_remain
      }
    }

    if(split_sales_type === sales_options.split_sales_type.duplicate || split_sales_type === sales_options.split_sales_type.none) {
      staffs.map(s=> s.amount = sales_item_amount)
    }

    if(split_sales_type == sales_options.split_sales_type.user_input){
      staffs.map(s => s.amount = 0)
    }

    return staffs
  }

  static getSplitSalesTypeOfSalesItem(staffs,totalAmount){
    const firstStaffAmount = Number(staffs[0]?.amount)
    const endStaffAmount = Number(staffs[staffs.length - 1]?.amount)
    const totalStaffAmount = staffs.reduce((amount, staff) => Number(staff?.amount) + amount, 0)
    const staffAmountRemain = totalStaffAmount % staffs.length
    const endStaffAmountIncludeRemainAmount = endStaffAmount - firstStaffAmount === staffAmountRemain

    const tmpStaffs = staffs.slice(1, staffs.length - 1)

    const isStaffSameAmount = tmpStaffs.every(staff => Number(staff.amount) === firstStaffAmount)

    const isStaffSameTotalAmount = staffs.every(staff => Number(staff.amount) === totalAmount)

    if(isStaffSameTotalAmount) {
      return sales_options.split_sales_type.duplicate
    }

    if (isStaffSameAmount && endStaffAmountIncludeRemainAmount && !isStaffSameTotalAmount) {
      return sales_options.split_sales_type.even
    }

    return sales_options.split_sales_type.user_input

  }

  static calPointsByPayments(ref_data, points_setups, decimal = 0){
    ref_data = cloneDeep(ref_data)
    ref_data.payments = this.getUniqPaymentsByPaymentMethod(ref_data.payments || [])
    let total_amount_remaining = ref_data.total_amount

    // re-define ref_items
    let tmp_sales_points = 0
    let tmp_payments = ref_data.payments
    let tmp_items = []
    let is_ref_sales = false
    if(ref_data.sales_items && ref_data.sales_items.length > 0){
      tmp_items = ref_data.sales_items
      is_ref_sales = true
      total_amount_remaining -= ref_data.deduction_points + ref_data.balance_deduction
    }
    if(ref_data.refund_items && ref_data.refund_items.length > 0){
      tmp_items = ref_data.refund_items
    }

    // calculate payment_amount convert to points in case in case total_payments_amount > total_amount
    let tmp_total_payments_amount_current = 0
    let tmp_total_payments_amount_payable = 0
    for(let tmp_payment of tmp_payments){
      tmp_total_payments_amount_payable += tmp_payment.payment_amount
      if(tmp_total_payments_amount_payable > total_amount_remaining){
        tmp_payment.payment_amount = total_amount_remaining - tmp_total_payments_amount_current
      }
      tmp_total_payments_amount_current += tmp_payment.payment_amount
    }

    if(tmp_items.length > 0 && tmp_payments.length > 0){
      let tmp_total_percentage = 0
      for(let i in tmp_items){
        let tmp_item = tmp_items[i]

        // calculate amount and percentage of item
        let tmp_item_amount_remaining = tmp_item.amount
        if(is_ref_sales){
          tmp_item_amount_remaining -= (parseInt(tmp_item.deduction_amount) + tmp_item.deduction_points)
        }
        let tmp_amount_percentage = 0
        if(total_amount_remaining > 0){
          tmp_amount_percentage = roundNumberByDecimal(tmp_item_amount_remaining / total_amount_remaining, 5)
        }
        tmp_item = {
          ...tmp_item,
          amount_remaining:  tmp_item_amount_remaining,
          amount_percentage: tmp_amount_percentage,
          points:            0,
        }

        // calculate percentage of last item
        if(i == tmp_items.length - 1){
          tmp_item.amount_percentage = 1 - tmp_total_percentage
        }
        tmp_total_percentage += tmp_amount_percentage
        // console.log('tmp_item.amount_percentage', tmp_item.amount_percentage, tmp_total_percentage, tmp_item)

        // calculate points
        // console.log('tmp_item', tmp_item.goods_name, tmp_item.amount_percentage)
        let points_setup = points_setups.loyalty_points_setups.find(ps => ps.goods_type == tmp_item.goods_type && ps.is_apply == true)

        if(points_setup){
          for(let tmp_payment of tmp_payments){
            let points_setup_item = points_setup.loyalty_points_setup_items.find(i => i.payment_method_setup_id == tmp_payment.payment_method_id)

            if (!points_setup_item) continue

            let tmp_item_points = tmp_payment.payment_amount * tmp_item.amount_percentage * points_setup_item.percentage / 100
            tmp_item.points += roundNumberByDecimal(tmp_item_points, decimal)
            // console.log('tmp_item_points', roundNumberByDecimal(tmp_item_points, decimal), '=', `${tmp_payment.payment_amount} * ${tmp_item.amount_percentage} * ${points_setup_item.percentage / 100}`)
          }
          tmp_sales_points += tmp_item.points
        }
      }
    }
    return roundNumberByDecimal(tmp_sales_points, decimal)
  }

  static getUniqPaymentsByPaymentMethod(payments = []) {
    let tmp_payments = []
    let tmp_payment_deposit_refund_amount = 0
    for(let payment of payments){
      if(payment.payment_type === sales_options.sales_payment_type.booking_deposit_refund){
        tmp_payment_deposit_refund_amount = payment.payment_amount
      }
      else {
        tmp_payments.push(payment)
      }
    }

    let tmp_uniq_payments = []
    for(let payment of tmp_payments){
      // booking_deposit
      if(payment.payment_type === sales_options.sales_payment_type.booking_deposit){
        payment.payment_amount -= tmp_payment_deposit_refund_amount
      }

      // uniq
      let tmp_uniq_payment_method_ids = tmp_uniq_payments.map(p => p.payment_method_id)
      if(tmp_uniq_payment_method_ids.includes(payment.payment_method_id)){
        let tmp_current_uniq_payment = tmp_uniq_payments.find(p => p.payment_method_id === payment.payment_method_id)
        if(tmp_current_uniq_payment){
          tmp_current_uniq_payment.payment_amount += payment.payment_amount
        }
      }
      else {
        tmp_uniq_payments.push(payment)
      }
    }
    return tmp_uniq_payments
  }

  static isExpiredCard(expiry_date_ts){
    console.log('expiry_date_ts', expiry_date_ts)
    let is_expired_card = false
    let today_ts = convertDateToTimeStamp(new Date())
    if(expiry_date_ts != options.enum_no_limit && today_ts > expiry_date_ts)
      is_expired_card = true
    return is_expired_card
  }

  static formatNoLimitNumber(value,decimal_count){
    let text = ''
    if (typeof value != 'number') return text
    if (value < sales_options.NO_LIMIT) return text
    text = value == sales_options.NO_LIMIT ? i18n.t('general.no-limit') : formatMoney(value,decimal_count)
    return text
  }

  /**
   * This function will be apply for Sales Prepaid Card and Sales Prepaid Service
   * If value is nolimit(-1) then return 'No Limit' text
   * otherwise return a utc date.
   */
  static formatNoLimitDateTs(value){
    let text = ''
    if(typeof value !== 'number') return text
    if(value < sales_options.NO_LIMIT) return text
    text = value == sales_options.NO_LIMIT ? i18n.t('general.no-limit') :
      moment(convertTimeStampToUtcDate(value)).format(common_options.standard_date_format.ymd)
    return text
  }

  static formatOutstandingHistoryType(value){
    let text = ''
    let outstanding_history_type = find(sales_options.outstanding_history_type,t=>t.value == value)
    if (outstanding_history_type != undefined){
      text = i18n.t(outstanding_history_type.text)
    }
    return text
  }

  static isPrepaidGoodItem(sales_item) {
    const is_prepaid_good_item = [options.sales_enum.goods_type.prepaid_card, options.sales_enum.goods_type.prepaid_service].includes(sales_item.goods_type)
    const is_deduct_prepaid_service = sales_item.goods_type === options.sales_enum.goods_type.prepaid_service && sales_item.deduction_type === sales_options.deduction_type.prepaid_service

    return is_prepaid_good_item && !is_deduct_prepaid_service
  }

  static formatSalesItemNameOnSalesTable(sales_items,is_view_all){
    let tmp_sales_item_names = []
    let is_summarized_content = false
    for(let i in sales_items){
      const quantity = sales_items[i]?.quantity || 0
      let tmp_sales_item_name = escapeHtml(`${sales_items[i].goods_name}${quantity > 1 ? ` x ${formatMoney(quantity, 0)}` : ''}`)

      const nameChunks = tmp_sales_item_name.match(/.{1,30}(?= |$)/g)
      if(!checkNullAndEmptyAndUndefined(tmp_sales_item_name)){
        if(i >= 10 && !is_view_all){
          tmp_sales_item_names.push('...')
          is_summarized_content = true
          break
        }
        if (this.isPrepaidGoodItem(sales_items[i])) {
          const tempChunks = nameChunks.map(item => `<span class="is-prepaid-good">${item}</span>`)
          tmp_sales_item_names.push(...tempChunks)
        } else {
          tmp_sales_item_names.push(...nameChunks)
        }
      }
    }

    return {
      is_summarized_content,
      formatted_text: tmp_sales_item_names.join('<br>'),
    }
  }

  static formatStaffsOnSalesTable(sales) {
    let tmpSalesItemStaff = []
    const tmpSalesItemStaffDescription = []
    let is_summarized_content = false
    for(let sales_item of sales) {
      const totalAmount = sales_item.amount

      const isMultipleStaff = sales_item.staffs.length > 1

      const totalStaffAmount = sales_item.staffs.reduce((amount,staff) => amount + staff.amount, 0)

      const isDifferentTotalAmount = totalAmount !== totalStaffAmount && sales_item.staffs.length > 0

      const displayName = sales_item.staffs.map(staff => staff.staff_name)
      sales_item.staffs.forEach(staff => {
        tmpSalesItemStaffDescription.push(`${staff.staff_name} (${formatMoney(staff.amount, 0)})`)
      })

      if(isDifferentTotalAmount || isMultipleStaff) {
        is_summarized_content = true
      }

      if(displayName.length === 0 && tmpSalesItemStaff.length < 10) {
        tmpSalesItemStaff.push('<span class="empty-item"></span>')

      } else if(displayName.length > 1 && !isDifferentTotalAmount && tmpSalesItemStaff.length < 10) {
        tmpSalesItemStaff.push(`<span>${sales_item.staffs[0].staff_name }${isMultipleStaff ? '+' : ''}</span>`)

      } else if(isDifferentTotalAmount && tmpSalesItemStaff.length < 10) {
        tmpSalesItemStaff.push(`<span class="bold">${sales_item.staffs[0].staff_name }${isMultipleStaff ? '+' : ''}</span>`)

      } else if(displayName.length !== 0) {
        if(tmpSalesItemStaff.length === 10) {
          is_summarized_content = true
          tmpSalesItemStaff.push('...')
        }

        tmpSalesItemStaff.push(`<span>${displayName}</span>`)
      }

    }
    if(sales.length > 10 && tmpSalesItemStaff.length <= 10) {
      tmpSalesItemStaff[tmpSalesItemStaff.length - 1] += '<br>'
    }

    const showMaximumItem = tmpSalesItemStaff.slice(0, 11)

    // tmpSalesItemStaff = showMaximumItem

    showMaximumItem[showMaximumItem.length - 1] += '<br>'

    return {
      is_summarized_content,
      formatted_text:         showMaximumItem.join('<br>'),
      formatted_text_tooltip: tmpSalesItemStaffDescription.join('<br>'),
    }
  }

  static formatDiscountOnSalesTable(sales_items, is_view_all) {
    let tmp_discounts = []
    let tmp_discounts_description = []
    for(let i in sales_items){
      let item = sales_items[i]
      let tmp_discount = ''
      if(item.discount_value === 0 && tmp_discounts.length < 10) {
        tmp_discounts.push('<span class="empty-items"></span>')
      }

      if(item.discount_value != null && item.discount_value != undefined && item.discount_value > 0){
        if(item.discount_type == sales_options.discount_type.percentage)
          tmp_discount = item.discount_value + '%'
        else
          tmp_discount = formatMoney(item.discount_value, 0)

        if(!checkNullAndEmptyAndUndefined(tmp_discount)){
          if(tmp_discounts.length == 10 && !is_view_all){
            tmp_discounts.push('...')
            break
          }
          tmp_discounts.push(tmp_discount)
          tmp_discounts_description.push(tmp_discount)
        }
      }
    }

    tmp_discounts[tmp_discounts.length - 1] += '<br>'

    if(sales_items.length > 10 && tmp_discounts.length <= 10) {
      tmp_discounts[tmp_discounts.length - 1] += '<br>'
    }

    return {
      formatted_text:         tmp_discounts.join('<br>'),
      formatted_text_tooltip: tmp_discounts_description.join('<br>'),
    }
  }

  static formatSalesTypeOnSalesTable(sales_items,is_view_all){
    let tmp_sales_types = []
    let is_summarized_content = false
    let tmp_sales_types_description = []

    for(let i in sales_items){
      let tmp_sales_type = sales_items[i].sales_type_name

      if((tmp_sales_type === '' || tmp_sales_type === null) && tmp_sales_types.length < 10) {
        tmp_sales_types.push('<span class="empty-items"></span>')
      }

      if(!checkNullAndEmptyAndUndefined(tmp_sales_type)){
        if(tmp_sales_types.length == 10 && !is_view_all){
          tmp_sales_types.push('...')
          is_summarized_content = true
          break
        }
        tmp_sales_types.push(escapeHtml(tmp_sales_type))
        tmp_sales_types_description.push(escapeHtml(tmp_sales_type))
      }
    }

    tmp_sales_types[tmp_sales_types.length - 1] += '<br>'

    if(sales_items.length > 10 && tmp_sales_types.length <= 10) {
      tmp_sales_types[tmp_sales_types.length - 1] += '<br>'
    }

    return {
      is_summarized_content,
      formatted_text:         tmp_sales_types.join('<br>'),
      formatted_text_tooltip: tmp_sales_types_description.join('<br>'),
    }
  }

  static formatItemAmountOnSalesTable(salesItems, isViewAll, refType){
    const tmpAmounts = []

    for(let index in salesItems) {
      const salesItem = salesItems[index]
      const tmpAmount = salesItem.amount
      const tmpInitialBalance = salesItem.initialBalance

      if(!checkNullAndEmptyAndUndefined(tmpAmount)) {
        if(tmpAmounts.length === 10 && !isViewAll) {
          tmpAmounts.push('...')
          break
        }

        const isDeductedService = salesItem.deduction_type === sales_options.deduction_type.prepaid_service
        const className = isDeductedService ? 'text-green-light' : ''
        const isPrepaidCard = salesItem.goods_type === sales_options.sales_goods_type.prepaid_card
        const isDepositCard = salesItem.prepaid_card_type === sales_options.prepaid_card_type.deposit_card
        const isRefund = refType === sales_options.sales_ref_type.refund

        if (isPrepaidCard && isDepositCard && !isRefund) {
          tmpAmounts.push(
            `<span class=${className}>${formatMoney(tmpAmount, 0)}</span>`,
            `<span class='is-prepaid-good'>(${formatMoney(tmpInitialBalance, 0)})</span>`,
          )
        } else {
          tmpAmounts.push(`<span class=${className}>${formatMoney(tmpAmount, 0)}</span>`)
        }
      }
    }
    return tmpAmounts.join('<br>')
  }

  static isShowFullContentOnSalesTable(content){
    return content.includes('...') || content.includes('+')
  }

  static isPermittedToEditSalesByEnvironmentSettings({ invoice_date_time_ts, allow_edit_today_sales_invoices_role, allow_edit_before_today_sales_invoices_role }) {
    const user = store.state.authentication.user

    const now = convertDateToTimezone(new Date())

    const invoice_date_moment = moment(convertTimeStampToDate(invoice_date_time_ts, true))

    const isSameDay = moment(now).isSame(invoice_date_moment, 'day')

    const environment_setting_checking = isSameDay ? allow_edit_today_sales_invoices_role : allow_edit_before_today_sales_invoices_role

    const isStaffRole = user.user_role_code === USER_ROLES.STAFF
    const isManagerRole = user.user_role_code === USER_ROLES.MANAGER
    if (isStaffRole || isManagerRole) {
      const permissionType = isStaffRole
        ? PERMISSION_TYPE.STAFF
        : PERMISSION_TYPE.MANAGER

      return isPermissionGranted(permissionType, environment_setting_checking)
    }

    return true
  }

  static getFormattedSalesItemStaffs(sales_item) {
    const isSalesItemDeductService = sales_item.deduction_type === sales_options.deduction_type.prepaid_service
    const deductionAmount = sales_item.unit_price * sales_item.quantity
    const splitSalesType = sales_item.split_sales_type ?? sales_options.split_sales_type.none
    const staffs = sales_item.staffs || []
    const totalStaffAmount = staffs.reduce((amount, staff) => amount + Number(staff.amount), 0)

    const formatTextClass = (() => {
      const shouldHighlight = !isSalesItemDeductService
        ? totalStaffAmount !== sales_item.amount
        : totalStaffAmount !== deductionAmount

      return shouldHighlight ? 'class="text-blue"' : ''
    })()

    return staffs.map(staff => {
      const { staff_name = '', amount = 0 } = staff
      if (staffs.length === 1 && splitSalesType === 0) {
        return staff_name
      }

      return staff_name + `<span ${formatTextClass}>(${formatMoney(amount, 0)})</span>`
    })
  }

  static getAmountCutRoundOffByEnum(discountAmountEnum){
    let value = 0

    switch(discountAmountEnum){
      case sales_options.discount_amount_cut_off_enum.cut_off_than_1:
      case sales_options.discount_amount_cut_off_enum.round_off_than_1:
        value = 1
        break

      case sales_options.discount_amount_cut_off_enum.cut_off_than_10:
      case sales_options.discount_amount_cut_off_enum.round_off_than_10:
        value = 10
        break

      case sales_options.discount_amount_cut_off_enum.cut_off_than_100:
      case sales_options.discount_amount_cut_off_enum.round_off_than_100:
        value = 100
        break

      case sales_options.discount_amount_cut_off_enum.cut_off_than_1000:
      case sales_options.discount_amount_cut_off_enum.round_off_than_1000:
        value = 1000
        break

      case sales_options.discount_amount_cut_off_enum.cut_off_than_10000:
      case sales_options.discount_amount_cut_off_enum.round_off_than_10000:
        value = 10000
        break

      default:
        break
    }

    return value
  }
}
