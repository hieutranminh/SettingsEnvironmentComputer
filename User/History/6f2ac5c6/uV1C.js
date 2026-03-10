import {
  formatMoney,
  mapPagingFromApi,
} from 'CommonHelpers'
import moment from 'moment'
import Http from 'HTTPHelpers'
import { sumBy, cloneDeep, sortBy } from 'lodash'
import { getServiceUrl } from 'APIURLGeneratorHelpers'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'
import { booking_options } from 'Options/booking-options.js'
import SalesViewModel from 'ViewModels/sales/sales/sales-view-model.js'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES, DISPLAY_TYPE } from 'Constant'
import SalesByStaffViewModel from 'ViewModels/sales/report/sales-by-staff-view-model.js'
import BookingTotalViewModel from 'ViewModels/bookings/booking-total/booking-total-view-model'
import PaymentTotalViewModel from 'ViewModels/sales/report/sales-total/payment-total-view-model.js'
import SalesByItemServiceViewModel from 'ViewModels/sales/report/sales-by-item-service-view-model.js'
import SalesByItemProductViewModel from 'ViewModels/sales/report/sales-by-item-product-view-model.js'
import SalesTotalDetailViewModel from 'ViewModels/sales/report/sales-total/sales-total-detail-view-model.js'
import SalesTotalDetailViewModelByStaff from 'ViewModels/sales/report/sales-total/sales-total-detail-view-model-by-staff.js'
import PrepaidGoodsSalesViewModel from 'ViewModels/sales/report/sales-total/prepaid-goods-sales-view-model.js'
import SalesByItemPrepaidCardViewModel from 'ViewModels/sales/report/sales-by-item-prepaid-card-view-model.js'
import SalesByItemPrepaidServiceViewModel from 'ViewModels/sales/report/sales-by-item-prepaid-service-view-model.js'
import ReportPrepaidCardViewModel from 'ViewModels/sales/report/balance-and-loyalty-points/report-prepaid-card-view-model.js'
import ReportLoyaltyPointViewModel from 'ViewModels/sales/report/balance-and-loyalty-points/report-loyalty-point-view-model.js'
import ReportPrepaidServiceViewModel from 'ViewModels/sales/report/balance-and-loyalty-points/report-prepaid-service-view-model.js'
import ReportPrepaidCardSummaryViewModel from 'ViewModels/sales/report/balance-and-loyalty-points/report-prepaid-card-summary-view-model.js'
import StaffSalesPaymentTotals from 'ViewModels/sales/report/sales-total/sales-detail-payment-total-staff-model'

const url_read_sales_reports = getServiceUrl(SERVICE_TYPES.SALES_REPORTS_READ, 1)
const url_read_client_report = getServiceUrl(SERVICE_TYPES.REPORT_SALES_CLIENT_REPORT_READ, 1)
const url_read_balance_points = getServiceUrl(SERVICE_TYPES.REPORT_BALANCE_AND_LOYALTY_POINTS_READ, 1)
const urlCmdSetupReport = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)
const url_aggr_sales_report = getServiceUrl(SERVICE_TYPES.SALES_REPORT_AGGR, 1)

// sales total
const urlReadSalesTotalReport = url_read_sales_reports + '/SalesTotalReport' // /SalesReports/SalesTotalReport

const urlReadSalesTotalDetailByStaffReport = url_read_sales_reports + '/SalesTotalDetailByStaffReport'

const urlCmdUpdateHidePrepaidGoodSalesReport = urlCmdSetupReport + SERVICE_EXTEND_TYPES.SALES_TOTAL_HIDE_PREPAID_GOODS_REPORTS

const urlReadSalseTotalByStaffReport = url_read_sales_reports + '/SalesTotalByStaffReport' // /SalesReports/SalesTotalByStaffReport

const urlReadSalesTotalByItemServiceReport = url_read_sales_reports + '/SalesTotalByItemServiceReport' // /SalesReports/SalesTotalByItemServiceReport

const urlReadSalesTotalByItemProductReport = url_aggr_sales_report + '/SalesTotalByItemProductReport' // /SalesReports/SalesTotalByItemProductReport

const urlReadSalesTotalByItemPrepaidCardReport = url_read_sales_reports + '/SalesTotalByItemPrepaidCardReport' // /SalesReports/SalesTotalByItemPrepaidCardReport

const urlReadSalesTotalByItemPrepaidServiceReport = url_read_sales_reports + '/SalesTotalByItemPrepaidServiceReport' // /SalesReports/SalesTotalByItemPrepaidServiceReport

// sales analysis
let url_read_sales_by_date_report = url_read_sales_reports + SERVICE_EXTEND_TYPES.SALES_BY_DATE_REPORT
let url_read_sales_by_month_report = url_read_sales_reports + SERVICE_EXTEND_TYPES.SALES_BY_MONTH_REPORT
let url_read_service_sales = url_read_sales_reports + SERVICE_EXTEND_TYPES.SERVICE_SALES__REPORT

const urlReadServiceSalesByItem = url_read_sales_reports + '/ServiceSalesByItemReport' // /SalesReports/ServiceSalesByItemReport

const urlReadServiceSalesByMonths = url_read_sales_reports + '/ServiceSalesByMonthsReport' // /SalesReports/ServiceSalesByMonthsReport

const urlReadServiceSalesBySalesTypes = url_read_sales_reports + '/ServiceSalesBySalesTypes' // /SalesReports/ServiceSalesBySalesTypes

let urlReadProductSalesByMonths = url_read_sales_reports + SERVICE_EXTEND_TYPES.PRODUCT_SALES_BY_MONTHS

const urlReadProductSalesByItem = url_read_sales_reports + '/ProductSalesByItemFilterReport' // /SalesReports/ProductSalesByItemFilterReport

const urlReadSalesByDiscountCategory = url_read_sales_reports + '/SalesByDiscountCategoryReport' // /SalesReports/SalesByDiscountCategoryReport

const urlAggr = getServiceUrl(SERVICE_TYPES.SALES_AGGR, 1)
const urlReadIncomeStatement = urlAggr + '/IncomeStatementReport' // /Sales/IncomeStatementReport

// client analysis
const url_read_client = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_READ, 1)

const urlReadSalesByRepeatClients = url_read_client_report + '/GetSalesByRepeatClientsReport' // /ClientReport/GetSalesByRepeatClientsReport

const urlReadClientsSummary = url_read_client_report + '/GetClientsSummaryReport' // /ClientReport/GetClientsSummaryReport

const urlReadClientByPeriodReport = url_read_client_report + '/GetClientsByPeriodReport' // /ClientReport/GetClientsByPeriodReport

const urlClientByTypeReport = url_read_client_report + '/GetClientsByTypeReport' // /ClientReport/GetClientsByTypeReport

const urlNewClientRepeatReport = url_read_client_report + '/GetNewClientRepeatReport' // /ClientReport/GetNewClientRepeatReport

let url_new_client_by_months_report = url_read_client + SERVICE_EXTEND_TYPES.NEW_CLIENT_BY_MONTHS_REPORT

const urlRecommendedClientByMonth = url_read_client_report + '/GetRecommendedClientsByMonthReport' // /ClientReport/GetRecommendedClientsByMonthReport

let url_new_client_by_referral_source__date_range = url_read_client + SERVICE_EXTEND_TYPES.NEW_CLIENT_BY_REFERRAL_SOURCE__DATE_RANGE
let url_new_client_by_referral_source__month_range = url_read_client + SERVICE_EXTEND_TYPES.NEW_CLIENT_BY_REFERRAL_SOURCE__MONTH_RANGE

// booking analysis
const url_read_booking_report = getServiceUrl(SERVICE_TYPES.BOOKING_REPORT_READ, 1)
const url_aggr_booking_report = getServiceUrl(SERVICE_TYPES.BOOKING_REPORT_AGGR, 1)
// const url_aggr_booking_report                                          = getServiceUrl()
let url_booking_tally_detail_by_month = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_TALLY_DETAIL_BY_MONTH
let url_booking_tally_detail_by_date = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_TALLY_DETAIL_BY_DAY
let url_booking_ratio = url_aggr_booking_report + SERVICE_EXTEND_TYPES.BOOKING_RATIO
let url_utilization_ratio = url_read_booking_report + SERVICE_EXTEND_TYPES.UTILIZATION_RATIO
let url_bookings_summary_by_date = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_SUMMARY_BY_DATE
let url_bookings_by_date = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_BY_DATE
let url_bookings_by_month = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_BY_MONTH
let url_detailed_analysis_of_bookings__month__resource = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__RESOURCE
let url_detailed_analysis_of_bookings__month__day = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__DAY
let url_detailed_analysis_of_bookings__month__hour = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__HOUR
let url_detailed_analysis_of_bookings__month__booking_source = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__BOOKING_SOURCE
let url_detailed_analysis_of_bookings__date_range__resource = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__RESOURCE
let url_detailed_analysis_of_bookings__date_range__day = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__DAY
let url_detailed_analysis_of_bookings__date_range__hour = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__HOUR
let url_detailed_analysis_of_bookings__date_range__booking_source = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__BOOKING_SOURCE

// balance and loyalty points
let url_read_prepaid_cards_report = url_read_balance_points + SERVICE_EXTEND_TYPES.PREPAID_CARDS_REPORT
let url_read_prepaid_card_summary_report = url_read_balance_points + SERVICE_EXTEND_TYPES.PREPAID_CARD_SUMMARY_REPORT
let url_read_prepaid_services_report = url_read_balance_points + SERVICE_EXTEND_TYPES.PREPAID_SERVICES_REPORT
let url_read_loyalty_points_report = url_read_balance_points + SERVICE_EXTEND_TYPES.LOYALTY_POINTS_REPORT

export default class ReportApi {
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if(response.data.isOK) {
      let sales_vm = new SalesViewModel()
      sales_vm.mapSaleFromApi(response.data.result)
      this.result.data = sales_vm.getFields()
    }
    return this.result
  }

  // SalesByDate
  async getSalesByDateReportAsync(query){
    let query_map = {
      fromDateTS:               query.from_date_ts,
      toDateTS:                 query.to_date_ts,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      shopId:                   query.shop_id,
    }

    try{
      let response = await this.http.post(url_read_sales_by_date_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          for(let item of response.data.result.reportItems){
            let tmp_key = item.key.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let tmp_date = tmp_key.slice(6,8)
            let txt_date = `${tmp_year}`
            if(tmp_month.length > 0)
              txt_date += `-${tmp_month}`
            if(tmp_date.length > 0)
              txt_date += `-${tmp_date}`

            let tmp_item = {
              key:                    item.key,
              date:                   txt_date,
              from_date_ts:           item.fromDateTS,
              to_date_ts:             item.toDateTS,
              service_amount:         item.serviceAmount,
              product_amount:         item.productAmount,
              prepaid_card_amount:    item.prepaidCardAmount,
              prepaid_service_amount: item.prepaidServiceAmount,
              total_amount:           item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // SalesByMonth
  async getSalesByMonthReportAsync(query){
    let query_map = {
      fromDateTS:               query.from_date_ts,
      toDateTS:                 query.to_date_ts,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      shopId:                   query.shop_id,
    }

    try{
      let response = await this.http.post(url_read_sales_by_month_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          for(let item of response.data.result.reportItems){
            let tmp_key = item.key.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let tmp_date = tmp_key.slice(6,8)
            let txt_date = `${tmp_year}`
            if(tmp_month.length > 0)
              txt_date += `-${tmp_month}`
            if(tmp_date.length > 0)
              txt_date += `-${tmp_date}`

            let tmp_item = {
              key:                    item.key,
              date:                   txt_date,
              from_date_ts:           item.fromDateTS,
              to_date_ts:             item.toDateTS,
              service_amount:         item.serviceAmount,
              product_amount:         item.productAmount,
              prepaid_card_amount:    item.prepaidCardAmount,
              prepaid_service_amount: item.prepaidServiceAmount,
              total_amount:           item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getServiceSalesReportAsync(query){
    let query_map = {
      fromDateTs:   query.from_date_ts,
      toDateTs:     query.to_date_ts,
      reportByType: query.report_by_type,
      staffId:      query.staff_id,
      shopId:       query.shop_id,
      dateType:     query.date_type,
    }

    try{
      let response = await this.http.post(url_read_service_sales, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.serviceSalesItems != null){
          let total_amount = sumBy(response.data.result.serviceSalesItems, x=>x.amount)
          for(let item of response.data.result.serviceSalesItems){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              name:     item.key,
              quantity: item.quantity,
              amount:   item.amount,
              ratio:    tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getServiceSalesByItemReportAsync(query){
    let query_map = {
      shopId:       query.shop_id,
      serviceId:    query.service_id,
      categoryId:   query.category_id,
      reportByType: query.report_by_type,

      dateType:   query.date_type,
      toDateTs:   query.to_date_ts,
      fromDateTs: query.from_date_ts,
    }

    try{
      let response = await this.http.post(urlReadServiceSalesByItem, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          let total_amount = sumBy(response.data.result, x=>x.amount)
          for(let item of response.data.result){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              name:     item.itemName,
              quantity: item.quantity,
              amount:   item.amount,
              ratio:    tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getServiceSalesByMonthReportAsync(query){
    let query_map = {
      fromDateTs: query.from_date_ts,
      toDateTs:   query.to_date_ts,
      categoryId: query.category_id,
      serviceId:  query.service_id,
      staffId:    query.staff_id,
      shopId:     query.shop_id,
    }

    try{
      let response = await this.http.post(urlReadServiceSalesByMonths, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.serviceSalesByMonths != null){
          let total_amount = sumBy(response.data.result.serviceSalesByMonths, x=>x.amount)
          for(let item of response.data.result.serviceSalesByMonths){
            let tmp_key = item.monthOfYear.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`

            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              month:    txt_month,
              quantity: item.quantity,
              amount:   item.amount,
              ratio:    tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getServiceSalesBySalesTypeReportAsync(query){
    let query_map = {
      shopId:                   query.shop_id,
      staffId:                  query.staff_id,
      serviceId:                query.service_id,
      categoryId:               query.category_id,
      salesTypeIds:             query.sales_type_ids,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      isPointDeductionIncluded: query.isPointDeductionIncluded,

      dateType:   query.date_type,
      toDateTs:   query.to_date_ts,
      fromDateTs: query.from_date_ts,
    }

    try{
      let response = await this.http.post(urlReadServiceSalesBySalesTypes, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          for(let item of response.data.result){
            let tmp_staff = {
              staff_id:   item.staffId,
              staff_name: item.staff,
            }
            let tmp_types = []
            for(let type of item.reportByTypes){
              let tmp_type = {
                sales_type_id: type.typeId,
                quantity:      type.quantity,
                amount:        type.amount,
              }
              tmp_types.push(tmp_type)
            }

            let tmp_item = {
              staff:       tmp_staff,
              sales_types: tmp_types,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getProductSalesByMonthReportAsync(query){
    let query_map = {
      fromDateTs: query.from_date_ts,
      toDateTs:   query.to_date_ts,
      categoryId: query.product_category_id,
      productId:  query.product_id,
      staffId:    query.staff_id,
      shopId:     query.shop_id,
    }

    try{
      let response = await this.http.post(urlReadProductSalesByMonths, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.productSalesByMonths != null){
          let total_amount = sumBy(response.data.result.productSalesByMonths, x=>x.amount)
          for(let item of response.data.result.productSalesByMonths){
            let tmp_key = item.monthOfYear.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`

            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              month:    txt_month,
              quantity: item.quantity,
              amount:   item.amount,
              ratio:    tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getProductSalesByItemReportAsync(query){
    const query_map = {
      shopId:       query.shop_id,
      staffId:      query.staffId,
      dateType:     query.date_type,
      toDateTs:     query.to_date_ts,
      fromDateTs:   query.from_date_ts,
      reportByType: query.report_by_type,
    }

    try{
      let response = await this.http.post(urlReadProductSalesByItem, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.productSalesByItems != null){
          let total_amount = sumBy(response.data.result.productSalesByItems, x=>x.amount)
          for(let item of response.data.result.productSalesByItems){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              name:     item.key,
              quantity: item.quantity,
              amount:   item.amount,
              ratio:    tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getSalesByDiscountCategoryReportAsync(query) {
    try {
      const payload = {
        shopId:     query.shop_id,
        staffId:    query.staff_id,
        dateType:   query.date_type,
        toDateTS:   query.to_date_ts,
        fromDateTS: query.from_date_ts,
      }

      const response = await this.http.post(urlReadSalesByDiscountCategory, payload)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        const tmpItems = []

        if(response.data.result != null) {
          const totalAmount = sumBy(response.data.result, discountCategory => discountCategory.discountAmount)

          response.data.result.forEach(category => {
            const tmpRatio = (() => {
              if(totalAmount !== 0) {
                return category.discountAmount / totalAmount * 100
              }

              return 0
            })()

            const tmpItem = {
              ratio:              tmpRatio,
              quantity:           category.qty,
              discountAmount:     category.discountAmount,
              discountCategory:   category.discountCategory,
              discountCategoryId: category.discountCategoryId,
            }

            tmpItems.push(tmpItem)
          })
        }

        this.result.data = tmpItems
      }
    } catch(error) {
      return this.http.loadError(error)
    }

    return this.result
  }

  async getSalesByRepeatClientsReportAsync(query){
    let query_map = {
      shopId:       query.shop_id,
      reportByType: query.report_by_type,

      dateType:   query.date_type,
      fromDateTS: query.from_date_ts,
      toDateTS:   query.to_date_ts,
    }

    try {
      let response = await this.http.post(urlReadSalesByRepeatClients, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        if(response.data.result != null && response.data.result.reportItems != null){
          let tmp_items = []
          let col_total_quantity_new = 0
          let col_total_amount_new = 0
          let col_total_quantity_repeat = 0
          let col_total_amount_repeat = 0
          let col_total_quantity_unregistered = 0
          let col_total_amount_unregistered = 0
          for(let i in response.data.result.reportItems){
            let item = response.data.result.reportItems[i]
            let tmp_item = {
              item_type: item.itemType,
              key:       item.key,
              quantity:  item.quantity,
              amount:    item.amount,
            }
            if(i == 0){
              tmp_items.push({
                key:   tmp_item.key,
                types: [tmp_item],
              })
            }
            else {
              let same_key = tmp_items.filter(i => i.key == tmp_item.key)
              if(same_key.length == 0){
                tmp_items.push({
                  key:   tmp_item.key,
                  types: [tmp_item],
                })
              }
              else {
                same_key[0].types.push(tmp_item)
              }
            }
            // client_type_enum
            //   unregistered : 0
            //   new          : 1
            //   repeat       : 2
            if(tmp_item.item_type == 0){
              col_total_quantity_unregistered += tmp_item.quantity
              col_total_amount_unregistered += tmp_item.amount
            }
            if(tmp_item.item_type == 1){
              col_total_quantity_new += tmp_item.quantity
              col_total_amount_new += tmp_item.amount
            }
            if(tmp_item.item_type == 2){
              col_total_quantity_repeat += tmp_item.quantity
              col_total_amount_repeat += tmp_item.amount
            }
          }
          if(tmp_items.length > 0){
            tmp_items.push({
              key:   'TOTAL',
              types: [
                {
                  item_type: 1,
                  quantity:  col_total_quantity_new,
                  amount:    col_total_amount_new,
                },
                {
                  item_type: 2,
                  quantity:  col_total_quantity_repeat,
                  amount:    col_total_amount_repeat,
                },
                {
                  item_type: 0,
                  quantity:  col_total_quantity_unregistered,
                  amount:    col_total_amount_unregistered,
                },
              ],
            })
            for(let tmp_item of tmp_items){
              tmp_item.types.push({
                item_type: tmp_items.item_type,
                key:       tmp_items.key,
                quantity:  tmp_item.types.reduce((total, item) => total + item.quantity, 0),
                amount:    tmp_item.types.reduce((total, item) => total + item.amount, 0),
              })
            }
          }
          this.result.data = tmp_items
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getIncomeStatementReportAsync(query){
    let query_map = {
      shopId:     query.shop_id,
      toDateTS:   query.to_date_ts,
      fromDateTS: query.from_date_ts,
    }

    try {
      let response = await this.http.post(urlReadIncomeStatement, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        if(response.data.result != null && response.data.result.income != null && response.data.result.expenditure != null){
          let key = 0
          let tmp_incomes = []
          for(let income of response.data.result.income){
            let tmp_income = {
              name:   income.itemName,
              amount: income.amount,
              key:    key,
            }
            tmp_incomes.push(tmp_income)
            key++
          }
          tmp_incomes = sortBy(tmp_incomes, ['name'])
          tmp_incomes = tmp_incomes.reverse()

          let tmp_expenditures = []
          for(let income of response.data.result.expenditure){
            let tmp_expenditure = {
              name:   income.itemName,
              amount: income.amount,
              key:    key,
            }
            tmp_expenditures.push(tmp_expenditure)
            key++
          }
          this.result.data = {
            incomes:      tmp_incomes,
            expenditures: tmp_expenditures,
          }
        }
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getClientsSummaryReportAsync(query){
    let query_mapped = {
      shopId:                   query.shopId,
      currentDateTS:            query.currentDateTS,
      daysNotVisitedMoreThanTS: query.daysNotVisitedMoreThanTS,
    }

    try{
      let response = await this.http.post(urlReadClientsSummary, query_mapped)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        this.result.data = response.data.result
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getBookingTallyReportByMonth(query) {
    const payload = {
      shopId:        query.shopId,
      reportMonthTS: query.reportMothTS,
    }

    try {
      const response = await this.http.post(url_booking_tally_detail_by_month, payload)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        this.result.data = response.data.result
      }

    } catch (error) {
      return this.http.loadError(error)
    }
    return this.result
  }

  async getBookingTallyReportByDate(query) {
    const payload = {
      shopId:     query.shopId,
      fromDateTS: query.fromDateTS,
      toDateTS:   query.toDateTS,
    }

    try {
      const response = await this.http.post(url_booking_tally_detail_by_date, payload)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        this.result.data = response?.data?.result
      }
    } catch (error) {
      return this.http.loadError(error)
    }

    return this.result
  }

  async getBookingRatioReport(query) {
    const payload = {
      shopId:     query.shopId,
      fromDateTS: query.fromDateTS,
      toDateTS:   query.toDateTS,
    }
    try {
      const response = await this.http.post(url_booking_ratio, payload)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        this.result.data = response.data.result
      }
    } catch (error) {
      return this.http.loadError(error)
    }
    return this.result
  }

  async getUtilizationRateReport(query) {
    const payload = {
      shopId:         query.shopId,
      fromDateTS:     query.fromDateTS,
      toDateTS:       query.toDateTS,
      typeTime:       query.typeTime,
      resourceFilter: query.resourceFilter,
    }
    try {
      const response = await this.http.post(url_utilization_ratio, payload)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        this.result.data = response.data.result
      }
    } catch (error) {
      return this.http.loadError(error)
    }
    return this.result
  }

  async getClientsByPeriodReportAsync(query){
    let query_map = {
      shopId:  query.shop_id,
      chainId: query.chain_id,

      dateType:   query.date_type,
      toDateTS:   query.to_date_ts,
      fromDateTS: query.from_date_ts,
    }

    try{
      let response = await this.http.post(urlReadClientByPeriodReport, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        if(response.data.result != null){
          this.result.data = response.data.result
        }
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getClientsByTypeAsync(query){
    const queryMapped = {
      shopId:     query.shop_id,
      reportType: query.report_by_type,
    }
    try{
      let response = await this.http.post(urlClientByTypeReport, queryMapped)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          const totalNumberOfClients = response.data.result.reportItems.reduce((total, item) => total + item.totalClient, 0)
          for(let item of response.data.result.reportItems){
            let tmp_ratio = 0
            if(totalNumberOfClients > 0){
              tmp_ratio = item.totalClient / totalNumberOfClients * 100
            }
            let tmp_item = {
              id:           item.id,
              name:         item.name,
              total_client: item.totalClient,
              ratio:        tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getNewClientsRepeatReportAsync(query){
    let query_map = {
      shopId:     query.shop_id,
      toDateTS:   query.to_date_ts,
      fromDateTS: query.from_date_ts,
    }

    try{
      let response = await this.http.post(urlNewClientRepeatReport, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          let total_row_new_clients = 0
          let total_row_repeat_infos = []
          for(let item of response.data.result.reportItems){
            total_row_new_clients += item.totalNewClients
            let tmp_repeat_infos = []
            for(let i in item.repeatInfos){
              let repeat_info = item.repeatInfos[i]
              let tmp_repeat_info = {
                year_month:     repeat_info.repeatOfYearMonth,
                repeat_clients: repeat_info.totalRepeatClients,
              }
              tmp_repeat_infos.push(tmp_repeat_info)
              // total row
              if(total_row_repeat_infos.length == 0){
                total_row_repeat_infos.push(cloneDeep(tmp_repeat_info))
              }
              else {
                let same_repeat_info = total_row_repeat_infos.filter(ri => ri.year_month == tmp_repeat_info.year_month)
                if(same_repeat_info.length == 0){
                  total_row_repeat_infos.push(cloneDeep(tmp_repeat_info))
                }
                else {
                  same_repeat_info[0].repeat_clients += tmp_repeat_info.repeat_clients
                }
              }
            }
            // total col
            let total_col_repeat_info = {
              year_month:     0,
              repeat_clients: tmp_repeat_infos.reduce((total, item) => total + item.repeat_clients, 0),
            }
            tmp_repeat_infos.unshift(total_col_repeat_info)

            let tmp_item = {
              staff_name:   item.staffName,
              new_clients:  item.totalNewClients,
              repeat_infos: tmp_repeat_infos,
            }
            tmp_items.push(tmp_item)
          }
          if(tmp_items.length > 0){
            // total row
            total_row_repeat_infos.unshift({
              year_month:     0,
              repeat_clients: total_row_repeat_infos.reduce((total, item) => total + item.repeat_clients, 0),
            })
            let tmp_item_total = {
              staff_name:   'TOTAL',
              new_clients:  total_row_new_clients,
              repeat_infos: total_row_repeat_infos,
            }
            tmp_items.push(tmp_item_total)

            // calculate percentage
            for(let tmp_item of tmp_items){
              for(let tmp_repeat_info of tmp_item.repeat_infos){
                let tmp_percentage = (tmp_repeat_info.repeat_clients / tmp_item.new_clients) * 100
                tmp_repeat_info.percentage = formatMoney(tmp_percentage, 1)
              }
            }
          }
        }
        this.result.data = tmp_items
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getNewClientsByMonthReportAsync(query){
    let query_map = {
      referralSourceId: query.referral_source_id,
      fromDateTS:       query.from_date_ts,
      toDateTS:         query.to_date_ts,
      shopId:           query.shop_id,
    }

    try{
      let response = await this.http.post(url_new_client_by_months_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          for(let item of response.data.result.reportItems){
            let tmp_key = item.yearAndMonth.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`

            let tmp_item = {
              month:            txt_month,
              number_of_client: item.numberOfClients,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getRecommendedClientsByMonthAsync(query){
    const queryMapped = {
      shopId:     query.shop_id,
      toDateTS:   query.to_date_ts,
      fromDateTS: query.from_date_ts,
    }

    try{
      let response = await this.http.post(urlRecommendedClientByMonth, queryMapped)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.recommendedClientsByMonth != null){
          for(let item of response.data.result.recommendedClientsByMonth){
            let tmp_key = item.monthOfYear.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`
            let tmp_ratio = 0
            if(item.newClient > 0){
              tmp_ratio = item.recommendedClient / item.newClient * 100
            }

            let tmp_item = {
              month:               txt_month,
              recommended_clients: item.recommendedClient,
              new_clients:         item.newClient,
              ratio:               tmp_ratio,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getNewClientsByReferralSource(query){
    let query_map = {
      fromDateTS: query.from_date.value,
      toDateTS:   query.to_date.value,
      shopId:     query.shop_id,
    }
    let url_new_client_by_referral_source_report = ''
    if(query.date_type == common_options.date_type.month)
      url_new_client_by_referral_source_report = url_new_client_by_referral_source__month_range
    if(query.date_type == common_options.date_type.date_range)
      url_new_client_by_referral_source_report = url_new_client_by_referral_source__date_range

    try{
      let response = await this.http.post(url_new_client_by_referral_source_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.referralSources != null){
          for(let item of response.data.result.referralSources){
            let tmp_item = {
              referral_source_id:   item.referralSourceId,
              referral_source_name: item.referralSourceName,
              total_client:         item.totalClient,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // Bookings
  async getDetailedAnalysisOfBookingsReportAsync(query) {
    let query_map = {
      fromDateTS:                 query.from_date_ts,
      toDateTS:                   query.to_date_ts,
      includedBookingsClientType: query.included_bookings_client_type,
      shopId:                     query.shop_id,

      // by report
      reportMonthTS:          query.report_month_ts,
      reportTimeSlotInterval: query.report_time_slot_interval,
      includedBookingsStatus: query.included_bookings_status,
    }
    let url_detailed_analysis_of_bookings = ''

    if(query.date_type == common_options.date_type.month){
      if(query.report_by_type == booking_options.booking_report_by_type.resource)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__resource
      if(query.report_by_type == booking_options.booking_report_by_type.day_of_week)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__day
      if(query.report_by_type == booking_options.booking_report_by_type.hour_of_day)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__hour
      if(query.report_by_type == booking_options.booking_report_by_type.booking_source)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__booking_source
    }

    if(query.date_type == common_options.date_type.date_range){
      if(query.report_by_type == booking_options.booking_report_by_type.resource)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__resource
      if(query.report_by_type == booking_options.booking_report_by_type.day_of_week)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__day
      if(query.report_by_type == booking_options.booking_report_by_type.hour_of_day)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__hour
      if(query.report_by_type == booking_options.booking_report_by_type.booking_source)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__booking_source
    }

    try{
      let response = await this.http.post(url_detailed_analysis_of_bookings, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.items != null){
          const totalOfBooking = (() => {
            const totalBooking = response.data.result.items.reduce((total, item) => {
              return total += item.numbersOfBookings
            }, 0)

            return totalBooking
          })()
          for(let item of response.data.result.items){
            let tmp_name = ''
            if(query.report_by_type == booking_options.booking_report_by_type.resource)
              tmp_name = item.performingResource.resourceName
            if(query.report_by_type == booking_options.booking_report_by_type.day_of_week)
              tmp_name = item.dayOfWeek
            if(query.report_by_type == booking_options.booking_report_by_type.hour_of_day)
              tmp_name = item.hourOfDay

            let tmp_item = {
              name:               tmp_name,
              number_of_bookings: item.numbersOfBookings,
            }
            if(query.report_by_type === booking_options.booking_report_by_type.resource || query.report_by_type === booking_options.booking_report_by_type.day_of_week) {
              tmp_item = {...tmp_item, ratio: item.numbersOfBookings/response.data.result.totalBookings }
            }
            if(query.report_by_type === booking_options.booking_report_by_type.hour_of_day) {
              tmp_item = {...tmp_item, ratio: item.numbersOfBookings/totalOfBooking }
            }
            if (query.report_by_type == booking_options.booking_report_by_type.booking_source){
              tmp_item = {...tmp_item, booking_source: item.bookingSource, ratio: item.numbersOfBookings/response.data.result.totalBookings }
            }

            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getBookingsSummaryByDateReportAsync(payload) {
    try{
      let response = await this.http.post(url_bookings_summary_by_date, payload)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let booking_total_view_model = new BookingTotalViewModel()
        booking_total_view_model.mapFieldsFromApi(response.data.result)
        this.result.data = booking_total_view_model.getFields()
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getBookingsByDateReportAsync(query) {
    let query_map = {
      shopId:                     query.shop_id,
      toDateTS:                   query.to_date_ts,
      fromDateTS:                 query.from_date_ts,
      bookingResourceId:          query.resource_id,
      bookingsSource:             query.bookings_source,
      includedBookingsClientType: query.included_bookings_client_type,
    }

    try{
      let response = await this.http.post(url_bookings_by_date, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.items != null){
          for(let item of response.data.result.items){
            let txt_date = moment(item.reportDate, 'YYYYMMDD').format('YYYY-MM-DD')

            let tmp_item = {
              date:                                     txt_date,
              total:                                    item.totalBookings || 0,
              cancel:                                   item.totalCanceledBookings || 0,
              cancel_percentage:                        item.percentCanceledBookings || '',
              total_bookings_without_canceled_bookings: item.totalBookingsWithoutCanceledBookings || 0,
              no_show:                                  item.totalNoShowedBookings || 0,
              no_show_percentage:                       item.percentNoShowedBookings || '',
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getBookingsByMonthReportAsync(query) {
    let query_map = {
      shopId:                     query.shop_id,
      toDateTS:                   query.to_date_ts,
      fromDateTS:                 query.from_date_ts,
      bookingsSource:             query.bookings_source,
      bookingResourceId:          query.resource_id,
      includedBookingsClientType: query.included_bookings_client_type,
    }

    try{
      let response = await this.http.post(url_bookings_by_month, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.items != null){
          for(let item of response.data.result.items){
            let txt_month = moment(item.reportMonth, 'YYYYMMDD').format('YYYY-MM')

            let tmp_item = {
              month:                                    txt_month,
              total:                                    item.totalBookings || 0,
              cancel:                                   item.totalCanceledBookings || 0,
              cancel_percentage:                        item.percentCanceledBookings || '',
              total_bookings_without_canceled_bookings: item.totalBookingsWithoutCanceledBookings || 0,
              no_show:                                  item.totalNoShowedBookings || 0,
              no_show_percentage:                       item.percentNoShowedBookings || '',
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // PrepaidCards
  async getPrepaidCardsReportAsync(query) {
    let query_map = {
      pageSize:         query.page_size,
      pageNumber:       query.page_number,
      shopId:           query.shop_id,
      branchShopId:     query.branch_shop_id,
      preferredStaffId: query.preferred_staff_id,
      isMyShopSales:    query.is_my_shop_sales,
    }

    try{
      let response = await this.http.post(url_read_prepaid_cards_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportPrepaidCardViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items:         tmp_items,
          pagination:    mapPagingFromApi(response.data.result.pagingInfo),
          total_balance: response.data.result.totalBalance,
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // PrepaidCardSummary
  async getPrepaidCardSummaryReportAsync(query) {
    let query_map = {
      pageSize:   query.page_size,
      pageNumber: query.page_number,
      shopId:     query.shop_id,
    }

    try{
      let response = await this.http.post(url_read_prepaid_card_summary_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportPrepaidCardSummaryViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items:      tmp_items,
          pagination: mapPagingFromApi(response.data.result.pagingInfo),
          summary:    {
            total_clients:          response.data.result.summary.totalClients,
            total_remaining_amount: response.data.result.summary.totalRemainingAmount,
          },
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // PrepaidServices
  async getPrepaidServicesReportAsync(query) {
    let query_map = {
      pageSize:         query.page_size,
      pageNumber:       query.page_number,
      shopId:           query.shop_id,
      branchShopId:     query.branch_shop_id,
      preferredStaffId: query.preferred_staff_id,
      isMyShopSales:    query.is_my_shop_sales,
    }

    try{
      let response = await this.http.post(url_read_prepaid_services_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportPrepaidServiceViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items:                  tmp_items,
          pagination:             mapPagingFromApi(response.data.result.pagingInfo),
          total_remaining_amount: response.data.result.totalRemainingAmount,
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // LoyaltyPoints
  async getLoyaltyPointsReportAsync(query) {
    let query_map = {
      pageSize:   query.page_size,
      pageNumber: query.page_number,
      shopId:     query.shop_id,
    }

    try{
      let response = await this.http.post(url_read_loyalty_points_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportLoyaltyPointViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items:      tmp_items,
          pagination: mapPagingFromApi(response.data.result.pagingInfo),
          summary:    {
            total_client: response.data.result.summary.totalClient,
            total_points: response.data.result.summary.totalPoints,
          },
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  // SalesTotal
  async getSalesTotalReportAsync(query){
    let params = {
      shopId:  query.shop_id,
      staffId: query.staff_id,

      dateType:   query.date_type,
      toDateTS:   query.to_date.value,
      fromDateTS: query.from_date.value,
    }

    try{
      let response = await this.http.post(urlReadSalesTotalReport, params)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_payment_total = []
        let tmp_item_total = {}
        let tmp_sales_total_detail = []
        let tmp_prepaid_goods_sales = []

        if(response.data.result.salesTotal){
          // prepare data from api
          response.data.result.salesTotal = this.prepareSalesTotalDataFromApi(response.data.result.salesTotal)

          if(response.data.result.salesTotal.length > 0){
            // sales total detail
            let sales_total_detail_view_model = new SalesTotalDetailViewModel()
            tmp_sales_total_detail = sales_total_detail_view_model.mapFieldFromApi(response.data.result.salesTotal)

            // sales total detail
            let prepaid_goods_sales_view_model = new PrepaidGoodsSalesViewModel()
            tmp_prepaid_goods_sales = prepaid_goods_sales_view_model.mapFieldFromApi(response.data.result.salesTotal)
          }
        }

        if(response.data.result.paymentTotal){
          let total_booking_deposit_amount = 0
          let total_deposit_refund_amount = 0
          let total_outstanding_collection_amount = 0
          let total_sales_amount = 0
          let total_refund_amount = 0
          let total_all = 0
          for (let item of response.data.result.paymentTotal.items) {
            if(!item.paymentMethodName || item.paymentMethodName == 'Outstanding') {
              // Booking deposit Not paid would have empty paymentMethodName
              continue
            }

            let tmp_item_vm = new PaymentTotalViewModel()
            tmp_item_vm.mapFieldsFromApi(item)
            tmp_payment_total.push(tmp_item_vm)

            total_booking_deposit_amount += tmp_item_vm.fields.booking_deposit_amount
            total_outstanding_collection_amount += tmp_item_vm.fields.outstanding_collection_amount
            total_sales_amount += tmp_item_vm.fields.sales_amount
            total_refund_amount += tmp_item_vm.fields.refund_amount
            total_deposit_refund_amount += tmp_item_vm.fields.deposit_refund_amount
            total_all += tmp_item_vm.fields.total
          }

          if(response.data.result.paymentTotal.items.length > 0){
            // row total
            tmp_item_total = new PaymentTotalViewModel()
            tmp_item_total.fields.payment_method_name = 'TOTALAMOUNT'
            tmp_item_total.fields.booking_deposit_amount = total_booking_deposit_amount
            tmp_item_total.fields.deposit_refund_amount = total_deposit_refund_amount
            tmp_item_total.fields.outstanding_collection_amount = total_outstanding_collection_amount
            tmp_item_total.fields.sales_amount = total_sales_amount
            tmp_item_total.fields.refund_amount = total_refund_amount
            tmp_item_total.fields.total = total_all
            tmp_payment_total.push(tmp_item_total)
          }
        }

        let paymentTotals = {}
        if (response.data.result.paymentDetails) {
          response.data.result.staffPaymentTotal = response.data.result.paymentDetails
          const staffPaymentTotal = response.data.result
          paymentTotals = StaffSalesPaymentTotals.build(staffPaymentTotal)
        }

        this.result.data = {
          payment_total:       tmp_payment_total,
          sales_total_detail:  tmp_sales_total_detail,
          prepaid_goods_sales: tmp_prepaid_goods_sales,
          grand_total:         response.data.result.grandTotal,
          total_outstanding:   response.data.result.paymentTotal.totalOutstanding,
          paymentDetails:      paymentTotals.paymentTableRows,
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getSalesTotalDetailByStaffReport(query) {
    let params = {
      shopId:     query.shop_id,
      staffId:    query.staff_id,
      staffName:  query.staff_name,
      toDateTS:   query.to_date.value,
      fromDateTS: query.from_date.value,
    }

    try{
      let response = await this.http.post(urlReadSalesTotalDetailByStaffReport, params)
      console.log('response', response)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let tmp_sales_total_detail = []
        let tmp_prepaid_goods_sales = []

        if(response.data.result.staffSalesTotal) {
          // prepare data from api
          const staffSalesTotals = this.prepareSalesTotalDataFromApi(response.data.result.staffSalesTotal)

          if(staffSalesTotals.length > 0) {
            // sales total detail
            let sales_total_detail_view_model = new SalesTotalDetailViewModelByStaff()
            tmp_sales_total_detail = sales_total_detail_view_model.mapFieldFromApi(staffSalesTotals, query.isPointDeductionIncluded)

            // sales total detail
            let prepaid_goods_sales_view_model = new PrepaidGoodsSalesViewModel()
            tmp_prepaid_goods_sales = prepaid_goods_sales_view_model.mapFieldFromApi(staffSalesTotals)
          }
        }

        const staffPaymentTotal = response.data.result
        const paymentTotals = StaffSalesPaymentTotals.build(staffPaymentTotal)

        this.result.data = {
          sales_total_detail:  tmp_sales_total_detail,
          prepaid_goods_sales: tmp_prepaid_goods_sales,
          payment_total:       paymentTotals.paymentTableRows,
          grand_total:         response?.data?.result?.grandTotal,
        }
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  prepareSalesTotalDataFromApi(salesTotal){
    let salesTotalItems = []
    let salesItems = ['Service', 'Product', 'PrepaidCard', 'PrepaidService']
    for(let salesItem of salesItems){
      let salesTotalItem = salesTotal.find(i => i.salesItem == salesItem)
      if(salesTotalItem == undefined){
        salesTotalItem = {
          balanceDeduction:               {quantity: 0, amount: 0},
          amount:                         0,
          quantity:                       0,
          numberAmountOfProductDeduction: 0,
          numberAmountOfServiceDeduction: 0,
          numberSalesOfProduct:           0,
          numberSalesOfService:           0,
          numberTotalRefund:              0,
          numberTotalSales:               0,
          pointDeduction:                 {quantity: 0, amount: 0},
          refund:                         {quantity: 0, amount: 0},
          sales:                          {quantity: 0, amount: 0},
          salesItem:                      salesItem,
          serviceDeduction:               {quantity: 0, amount: 0},
        }
      }
      salesTotalItems.push(salesTotalItem)
    }
    return salesTotalItems
  }

  async getSalesTotalByStaffReportAsync(query){
    let params = {
      shopId: query.shop_id,

      dateType:                 query.date_type,
      toDateTS:                 query.to_date_ts,
      fromDateTS:               query.from_date_ts,
      isPointDeductionIncluded: query.isPointDeductionIncluded,
      staffId:                  query.staffId,
    }

    try{
      let response = await this.http.post(urlReadSalseTotalByStaffReport, params)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          for(let item of response.data.result){
            const tmp_item_vm = new SalesByStaffViewModel()
            tmp_item_vm.mapFieldsFromApi(item)
            tmp_items.push(tmp_item_vm)

          }
          // https://gitlab.com/aha.software.2018/aha-testing/-/issues/439
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async getSalesTotalByItemReportAsync(query){
    let params = {
      shopId:       query.shop_id,
      staffId:      query.staff_id,
      reportByType: query.display_by_type,

      dateType:   query.date_type,
      toDateTS:   query.to_date_ts,
      fromDateTS: query.from_date_ts,
    }

    let urlReadSalesTotalByItemReport = ''
    if(query.sales_item_type == sales_options.sales_goods_type.service) {
      urlReadSalesTotalByItemReport = urlReadSalesTotalByItemServiceReport
    }

    if(query.sales_item_type == sales_options.sales_goods_type.product){
      urlReadSalesTotalByItemReport = urlReadSalesTotalByItemProductReport
    }

    if(query.sales_item_type == sales_options.sales_goods_type.prepaid_card){
      urlReadSalesTotalByItemReport = urlReadSalesTotalByItemPrepaidCardReport
    }

    if(query.sales_item_type == sales_options.sales_goods_type.prepaid_service){
      urlReadSalesTotalByItemReport = urlReadSalesTotalByItemPrepaidServiceReport
    }

    const isServiceReportType = params.reportByType === DISPLAY_TYPE.SERVICE ? 'TOTAL' : ''
    const isCategoryReportType = params.reportByType === DISPLAY_TYPE.CATEGORY ? 'TOTAL' : ''

    try{
      let response = await this.http.post(urlReadSalesTotalByItemReport, params)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          if(query.sales_item_type == sales_options.sales_goods_type.service){
            let tmp_total_sales_quantity = 0
            let tmp_total_sales_amount = 0
            let tmp_total_refund_quantity = 0
            let tmp_total_refund_amount = 0
            let tmp_total_balance_deduction_quantity= 0
            let tmp_total_balance_deduction_amount = 0
            let tmp_total_service_deduction_quantity= 0
            let tmp_total_service_deduction_amount = 0
            let tmp_total_total_quantity = 0
            let tmp_total_total_amount = 0
            let tmp_total_points_deduction = 0
            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemServiceViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              tmp_total_sales_quantity += tmp_item_vm.fields.sales.quantity
              tmp_total_sales_amount += tmp_item_vm.fields.sales.amount
              tmp_total_refund_quantity += tmp_item_vm.fields.refund.quantity
              tmp_total_refund_amount += tmp_item_vm.fields.refund.amount
              tmp_total_balance_deduction_quantity+= tmp_item_vm.fields.balance_deduction.quantity
              tmp_total_balance_deduction_amount += tmp_item_vm.fields.balance_deduction.amount
              tmp_total_service_deduction_quantity+= tmp_item_vm.fields.service_deduction.quantity
              tmp_total_service_deduction_amount += tmp_item_vm.fields.service_deduction.amount
              tmp_total_total_quantity += tmp_item_vm.fields.total.quantity
              tmp_total_total_amount += tmp_item_vm.fields.total.amount
              tmp_total_points_deduction += tmp_item_vm.fields.points_deduction
            }
            let tmp_item_total = new SalesByItemServiceViewModel()
            let tmp_average_unit_price = 0
            if(tmp_total_total_quantity > 0)
              tmp_average_unit_price = tmp_total_total_amount / tmp_total_total_quantity

            tmp_item_total.fields.category_name = isCategoryReportType ? 'TOTAL' : ''
            tmp_item_total.fields.service_name = isServiceReportType ? 'TOTAL' : ''
            tmp_item_total.fields.sales.quantity = tmp_total_sales_quantity
            tmp_item_total.fields.sales.amount = tmp_total_sales_amount
            tmp_item_total.fields.refund.quantity = tmp_total_refund_quantity
            tmp_item_total.fields.refund.amount = tmp_total_refund_amount
            tmp_item_total.fields.balance_deduction.quantity= tmp_total_balance_deduction_quantity
            tmp_item_total.fields.balance_deduction.amount = tmp_total_balance_deduction_amount
            tmp_item_total.fields.service_deduction.quantity= tmp_total_service_deduction_quantity
            tmp_item_total.fields.service_deduction.amount = tmp_total_service_deduction_amount
            tmp_item_total.fields.total.quantity = tmp_total_total_quantity
            tmp_item_total.fields.total.amount = tmp_total_total_amount
            tmp_item_total.fields.average_unit_price = tmp_average_unit_price
            tmp_item_total.fields.points_deduction = tmp_total_points_deduction
            tmp_items.push(tmp_item_total)
          }
          if(query.sales_item_type == sales_options.sales_goods_type.product){
            let total_row_sales_quantity = 0
            let total_row_sales_amount = 0
            let total_row_refund_quantity = 0
            let total_row_refund_amount = 0
            let total_row_balance_deduction_quantity = 0
            let total_row_balance_deduction_amount = 0
            let total_row_points_deduction = 0
            let total_row_unitPrice_amount = 0
            let total_row_purchase_amount = 0
            let total_row_sales_profit = 0
            let total_row_amount = 0
            let total_row_qty = 0

            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemProductViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              total_row_sales_quantity += tmp_item_vm.fields.sales.quantity
              total_row_sales_amount += tmp_item_vm.fields.sales.amount
              total_row_refund_quantity += tmp_item_vm.fields.refund.quantity
              total_row_refund_amount += tmp_item_vm.fields.refund.amount
              total_row_balance_deduction_quantity += tmp_item_vm.fields.balance_deduction.quantity
              total_row_balance_deduction_amount += tmp_item_vm.fields.balance_deduction.amount
              total_row_points_deduction += tmp_item_vm.fields.points_deduction
              total_row_unitPrice_amount += tmp_item_vm.fields.purchase_unit_price
              total_row_purchase_amount += tmp_item_vm.fields.purchase_amount
              total_row_sales_profit += tmp_item_vm.fields.sales_profit
              total_row_amount += tmp_item_vm.fields.total_amount
              total_row_qty += tmp_item_vm.fields.total_quantity
            }

            const total_row_data = new SalesByItemProductViewModel()
            total_row_data.fields.product_code = ''
            total_row_data.fields.product_name = 'TOTAL'
            total_row_data.fields.sales.quantity = total_row_sales_quantity
            total_row_data.fields.sales.amount = total_row_sales_amount
            total_row_data.fields.refund.quantity = total_row_refund_quantity
            total_row_data.fields.refund.amount = total_row_refund_amount
            total_row_data.fields.balance_deduction.quantity = total_row_balance_deduction_quantity
            total_row_data.fields.balance_deduction.amount = total_row_balance_deduction_amount
            total_row_data.fields.points_deduction = total_row_points_deduction
            total_row_data.fields.total_amount = total_row_amount
            total_row_data.fields.total_quantity = total_row_qty
            total_row_data.fields.purchase_unit_price = total_row_unitPrice_amount
            total_row_data.fields.purchase_amount = total_row_purchase_amount
            total_row_data.fields.sales_profit = total_row_sales_profit
            tmp_items.push(total_row_data)
          }
          if(query.sales_item_type == sales_options.sales_goods_type.prepaid_card){
            let total_row_sales_quantity = 0
            let total_row_sales_amount = 0
            let total_row_sales_earned_amount = 0
            let total_row_refund_quantity = 0
            let total_row_refund_amount = 0
            let total_row_refund_balance_deduction = 0
            let total_row_points_deduction = 0
            let total_row_amount = 0
            let total_row_earned_total = 0

            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemPrepaidCardViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              total_row_sales_quantity += tmp_item_vm.fields.sales.quantity
              total_row_sales_amount += tmp_item_vm.fields.sales.amount
              total_row_sales_earned_amount += tmp_item_vm.fields.sales.earned_amount
              total_row_refund_quantity += tmp_item_vm.fields.refund.quantity
              total_row_refund_amount += tmp_item_vm.fields.refund.amount
              total_row_refund_balance_deduction += tmp_item_vm.fields.refund.balance_deduction
              total_row_points_deduction += tmp_item_vm.fields.points_deduction
              total_row_amount += tmp_item_vm.fields.total_amount
              total_row_earned_total += tmp_item_vm.fields.earned_total
            }

            const total_row_data = new SalesByItemPrepaidCardViewModel()
            total_row_data.fields.prepaid_card_name = 'TOTAL'
            total_row_data.fields.sales.quantity = total_row_sales_quantity
            total_row_data.fields.sales.amount = total_row_sales_amount
            total_row_data.fields.sales.earned_amount = total_row_sales_earned_amount
            total_row_data.fields.refund.quantity = total_row_refund_quantity
            total_row_data.fields.refund.balance_deduction = total_row_refund_balance_deduction
            total_row_data.fields.refund.amount = total_row_refund_amount
            total_row_data.fields.points_deduction = total_row_points_deduction
            total_row_data.fields.total_amount = total_row_amount
            total_row_data.fields.earned_total = total_row_earned_total
            tmp_items.push(total_row_data)
          }
          if(query.sales_item_type == sales_options.sales_goods_type.prepaid_service){
            let total_row_sales_quantity = 0
            let total_row_sales_amount = 0
            let total_row_service_refund_quantity = 0
            let total_row_service_refund_amount = 0
            let total_row_points_deduction = 0
            let total_row_amount = 0
            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemPrepaidServiceViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              total_row_sales_quantity += tmp_item_vm.fields.sales.quantity
              total_row_sales_amount += tmp_item_vm.fields.sales.amount
              total_row_service_refund_quantity += tmp_item_vm.fields.service_refund.quantity
              total_row_service_refund_amount += tmp_item_vm.fields.service_refund.amount
              total_row_points_deduction += tmp_item_vm.fields.points_deduction
              total_row_amount += tmp_item_vm.fields.total_amount
            }

            const total_row_data = new SalesByItemPrepaidServiceViewModel()
            total_row_data.fields.category_name = isCategoryReportType ? 'TOTAL' : ''
            total_row_data.fields.prepaid_service_name = isServiceReportType ? 'TOTAL' : ''
            total_row_data.fields.sales.quantity = total_row_sales_quantity
            total_row_data.fields.sales.amount = total_row_sales_amount
            total_row_data.fields.service_refund.quantity = total_row_service_refund_quantity
            total_row_data.fields.service_refund.amount = total_row_service_refund_amount
            total_row_data.fields.points_deduction = total_row_points_deduction
            total_row_data.fields.total_amount = total_row_amount
            tmp_items.push(total_row_data)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async setHidePrepaidGoodReport(query) {
    try {
      let response = await this.http.put(urlCmdUpdateHidePrepaidGoodSalesReport, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    } catch (error) {
      return this.http.loadError(error)
    }
    return this.result
  }
}
