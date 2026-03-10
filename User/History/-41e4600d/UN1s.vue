<template>
  <main>
    <section class="sales-by-item-page">
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="ml-2">
                <input-date-range-by-date-types
                  ref="input_date_range_by_date_type"
                  :key="keyIndex"
                  v-model="table_filter"
                  :is_using_month="isUsingMonth"
                  have-arrow-button
                  @on-search="onSearch"
                />
              </div>
              <div class="ml-2 select-staff">
                <div class="select-box-wrapper">
                  <div class="select-box staff">
                    <label>{{ $t('general.staff') }}</label>
                    <b-form-select
                      v-model="table_filter.staff_id"
                      :options="list_staff_options"
                      :disabled="!allowViewDataOfOrderStaffs"
                      value-field="id"
                      text-field="aliasname"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="filter-search">
              <aha-button
                variant="blue"
                class="btn-search"
                @click.prevent="onSearch"
              >
                <i class="btn-search-white" /> <span>{{ $t('general.search') }}</span>
              </aha-button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <div class="row">
          <div class="table-sales-total col-12">
            <div class="table-header">
              <div class="sales-item-tabs">
                <span
                  v-for="tab in sales_item_type_options"
                  :key="tab.value"
                  class="sales-item-tabs__item"
                  :class="{ 'sales-item-tabs__item--active': table_filter.sales_item_type === tab.value }"
                  @click="onClickSalesItemTab(tab.value)"
                >
                  {{ tab.text }}
                </span>
                <b-form-checkbox
                  v-if="is_view_service || is_view_prepaid_service"
                  v-model="is_display_by_service_checkbox"
                  class="sales-item-tabs__checkbox"
                  @change="onInputDisplayByType"
                >
                  {{ view_by_checkbox_label }}
                </b-form-checkbox>
              </div>
            </div>

            <aha-table
              v-if="is_view_service"
              ref="report_table_ref"
              :key="`${sales_item_type_view}-${table_filter.display_by_type}`"
              :fixed-column-quantity="1"
              is-fixed-header
              class="table-sales-by-item"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th
                      rowspan="2"
                      width="13%"
                    >
                      {{ $t('report.category') }}
                    </th>
                    <th
                      v-if="can_display_by_service"
                      rowspan="2"
                      width="15%"
                    >
                      {{ $t('report.service') }}
                    </th>
                    <th
                      colspan="2"
                      width="13%"
                    >
                      {{ $t('report.sales') }}
                    </th>
                    <th
                      colspan="2"
                      width="13%"
                    >
                      {{ $t('sales.balance-deduction') }}
                    </th>
                    <th
                      colspan="2"
                      width="13%"
                    >
                      {{ $t('report.service-deduction') }}
                    </th>
                    <th
                      rowspan="2"
                      width="13%"
                    >
                      {{ $t('general.total') }}
                      <p>{{ `\r\n(A + B + C)` }}</p>
                    </th>
                    <th
                      rowspan="2"
                      width="10%"
                    >
                      {{ $t('report.average-unit-price') }}
                    </th>
                    <th
                      rowspan="2"
                      width="10%"
                    >
                      {{ $t('report.points-deduction') }}
                    </th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }} (A)</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }} (B)</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }} (C)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in table_rows"
                    :key="i"
                  >
                    <td
                      :class="{ 'sales-by-item-page__total': i === table_rows.length - 1 }"
                      class="category-name td--text-left"
                    >
                      {{ formatName(item.fields.category_name) }}
                    </td>
                    <td
                      v-if="can_display_by_service"
                      class="service-name td--text-left"
                    >
                      {{ formatName(item.fields.service_name) }}
                    </td>
                    <td
                      class="sales-quantity"
                      v-html="getCellHTML(item.fields.sales.quantity, item.fields.refund.quantity)"
                    />
                    <td
                      class="sales-amount report-amount"
                      v-html="getCellHTML(item.fields.sales.amount, item.fields.refund.amount)"
                    />
                    <td class="balance-deduction-quantity">
                      {{ formatNumber(item.fields.balance_deduction.quantity, 0) }}
                    </td>
                    <td class="balance-deduction-amount report-amount">
                      {{ formatNumber(item.fields.balance_deduction.amount, 0) }}
                    </td>
                    <td class="service-deduction-quantity">
                      {{ formatNumber(item.fields.service_deduction.quantity, 0) }}
                    </td>
                    <td class="service-deduction-amount report-amount">
                      {{ formatNumber(item.fields.service_deduction.amount, 0) }}
                    </td>
                    <td class="total-amount report-amount">
                      <span v-if="!isZero(item.fields.total.amount)">{{ formatNumber(item.fields.total.amount) }}</span>
                    </td>
                    <td class="average-unit-price report-amount">
                      {{ formatNumber(item.fields.average_unit_price) }}
                    </td>
                    <td class="points-deduction report-amount">
                      {{ formatNumber(item.fields.points_deduction) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </aha-table>

            <aha-table
              v-if="is_view_product"
              ref="report_table_ref"
              :key="`${sales_item_type_view}-${table_filter.display_by_type}`"
              :fixed-column-quantity="1"
              is-fixed-header
              class="table-sales-by-item"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th rowspan="2">
                      {{ $t('products.product-code') }}
                    </th>
                    <th rowspan="2">
                      {{ $t('products.product-name') }}
                    </th>
                    <th colspan="2">
                      {{ $t('report.sales') }}
                    </th>
                    <th colspan="2">
                      {{ $t('sales.sales-item-refund') }}
                    </th>
                    <th colspan="2">
                      {{ $t('sales.balance-deduction') }}
                    </th>
                    <th
                      colspan="2"
                      class="formula-col"
                      v-html="`
                        <span>${$t('sales.total')}(D)</span><br>
                        <span>( A - B + C )</span>
                      `"
                    />
                    <th rowspan="2">
                      {{ $t('report.points-deduction') }}
                    </th>
                    <th
                      v-if="!isStaffRole"
                      rowspan="2"
                    >
                      {{ $t('report.purchase-unit-price') }}
                    </th>
                    <th
                      v-if="!isStaffRole"
                      rowspan="2"
                    >
                      {{ $t('report.purchase-amount') }} <p>{{ `\r\n(E)` }}</p>
                    </th>
                    <th
                      v-if="!isStaffRole"
                      rowspan="2"
                    >
                      {{ $t('report.sales-profits') }} <p>{{ `\r\n(D - E)` }}</p>
                    </th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }} {{ `\r\n(A)` }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }}{{ `\r\n(B)` }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }}{{ `\r\n(C)` }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in table_rows"
                    :key="i"
                  >
                    <td class="product-code td--text-left">
                      {{ item.fields.product_code }}
                    </td>
                    <td
                      :class="{ 'sales-by-item-page__total': i === table_rows.length - 1 }"
                      class="product-name td--text-left"
                    >
                      {{ formatName(item.fields.product_name) }}
                    </td>
                    <td class="sales-quantity">
                      <span v-if="!isZero(item.fields.sales.quantity)">{{ formatNumber(item.fields.sales.quantity)
                      }}</span>
                    </td>
                    <td class="sales-amount report-amount">
                      <span v-if="!isZero(item.fields.sales.amount)">{{ formatNumber(item.fields.sales.amount) }}</span>
                    </td>
                    <td class="refund-quantity">
                      <span v-if="!isZero(item.fields.refund.quantity)">{{ formatNumber(item.fields.refund.quantity)
                      }}</span>
                    </td>
                    <td class="refund-amount report-amount">
                      <span v-if="!isZero(item.fields.refund.amount)">{{ formatNumber(item.fields.refund.amount)
                      }}</span>
                    </td>
                    <td class="balance-deduction-quantity">
                      <span v-if="!isZero(item.fields.balance_deduction.quantity)">{{
                        formatNumber(item.fields.balance_deduction.quantity) }}</span>
                    </td>
                    <td class="balance-deduction-amount report-amount">
                      <span v-if="!isZero(item.fields.balance_deduction.amount)">{{
                        formatNumber(item.fields.balance_deduction.amount) }}</span>
                    </td>

                    <td class="total-quantity">
                      {{ formatNumber(item.fields.total_quantity) }}
                    </td>
                    <td class="total-amount report-amount">
                      {{ formatNumber(item.fields.total_amount) }}
                    </td>
                    <td class="points-deduction report-amount">
                      {{ formatNumber(item.fields.points_deduction) }}
                    </td>
                    <td
                      v-if="!isStaffRole"
                      class="purchase-unit-price report-amount"
                    >
                      {{ formatNumber(item.fields.purchase_unit_price) }}
                    </td>
                    <td
                      v-if="!isStaffRole"
                      class="purchase-amount report-amount"
                    >
                      {{ formatNumber(item.fields.purchase_amount) }}
                    </td>
                    <td
                      v-if="!isStaffRole"
                      class="sales-profit report-amount"
                    >
                      {{ formatNumber(item.fields.sales_profit) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </aha-table>

            <aha-table
              v-if="is_view_prepaid_card"
              ref="report_table_ref"
              :key="`${sales_item_type_view}-${table_filter.display_by_type}`"
              :fixed-column-quantity="1"
              is-fixed-header
              class="table-sales-by-item"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th rowspan="2">
                      {{ $t('report.prepaid-card') }}
                    </th>
                    <th colspan="3">
                      {{ $t('report.sales') }}
                    </th>
                    <th colspan="3">
                      {{ $t('sales.sales-item-refund') }}
                    </th>
                    <th rowspan="2">
                      {{ $t('sales.sales-total') }}<p> (A-C)</p>
                    </th>
                    <th
                      rowspan="2"
                      class="formula-col"
                      v-html="`
                        <span>${$t('sales.earned-total')}</span><br>
                        <p>( B - D)</p>
                      `"
                    />
                    <th rowspan="2">
                      {{ $t('report.points-deduction') }}
                    </th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }} (A)</th>
                    <th>{{ $t('sales.earned-amount') }} (B)</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }} (C)</th>
                    <th>{{ $t('general.balance-deduction') }} (D)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in table_rows"
                    :key="i"
                  >
                    <td
                      :class="{ 'sales-by-item-page__total': i === table_rows.length - 1 }"
                      class="prepaid-card td--text-left"
                    >
                      {{ formatName(item.fields.prepaid_card_name) }}
                    </td>
                    <td class="sales-quantity">
                      <span v-if="!isZero(item.fields.sales.quantity)">{{ formatNumber(item.fields.sales.quantity)
                      }}</span>
                    </td>
                    <td class="sales-amount report-amount">
                      <span v-if="!isZero(item.fields.sales.amount)">{{ formatNumber(item.fields.sales.amount) }}</span>
                    </td>
                    <td class="report-amount">
                      <span v-if="!isZero(item.fields.sales.earned_amount)">{{
                        formatNumber(item.fields.sales.earned_amount) }}</span>
                    </td>
                    <td class="refund-quantity">
                      <span v-if="!isZero(item.fields.refund.quantity)">{{ formatNumber(item.fields.refund.quantity)
                      }}</span>
                    </td>
                    <td class="report-amount">
                      <span v-if="!isZero(item.fields.refund.amount)">{{ formatNumber(item.fields.refund.amount)
                      }}</span>
                    </td>
                    <td class="report-amount">
                      <span v-if="!isZero(item.fields.refund.balance_deduction)">{{
                        formatNumber(item.fields.refund.balance_deduction) }}</span>
                    </td>
                    <td class="total-amount report-amount">
                      {{ formatNumber(item.fields.total_amount) }}
                    </td>
                    <td class="report-amount">
                      {{ formatNumber(item.fields.earned_total) }}
                    </td>
                    <td class="points-deduction report-amount">
                      {{ formatNumber(item.fields.points_deduction) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </aha-table>

            <aha-table
              v-if="is_view_prepaid_service"
              ref="report_table_ref"
              :key="`${sales_item_type_view}-${table_filter.display_by_type}`"
              :fixed-column-quantity="1"
              is-fixed-header
              class="table-sales-by-item"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th rowspan="2">
                      {{ $t('report.category') }}
                    </th>
                    <th
                      v-if="can_display_by_service"
                      rowspan="2"
                    >
                      {{ $t('report.prepaid-service') }}
                    </th>
                    <th colspan="2">
                      {{ $t('report.sales') }}
                    </th>
                    <th colspan="2">
                      {{ $t('sales.sales-item-refund') }}
                    </th>
                    <th
                      rowspan="2"
                      class="formula-col"
                      v-html="`
                        <span>${$t('general.total')}</span><br>
                        <p>( A - B )</p>
                      `"
                    />
                    <th rowspan="2">
                      {{ $t('report.points-deduction') }}
                    </th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }} (A)</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }} (B)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in table_rows"
                    :key="i"
                  >
                    <td
                      :class="{ 'sales-by-item-page__total': i === table_rows.length - 1 }"
                      class="category td--text-left"
                    >
                      {{ formatName(item.fields.category_name) }}
                    </td>
                    <td
                      v-if="can_display_by_service"
                      class="prepaid-service td--text-left"
                    >
                      {{ formatName(item.fields.prepaid_service_name) }}
                    </td>
                    <td class="sales-quantity">
                      <span v-if="!isZero(item.fields.sales.quantity)">{{ formatNumber(item.fields.sales.quantity)
                      }}</span>
                    </td>
                    <td class="sales-amount report-amount">
                      <span v-if="!isZero(item.fields.sales.amount)">{{ formatNumber(item.fields.sales.amount) }}</span>
                    </td>
                    <td class="service-refund-quantity">
                      <span v-if="!isZero(item.fields.service_refund.quantity)">{{
                        formatNumber(item.fields.service_refund.quantity) }}</span>
                    </td>
                    <td class="service-refund-amount report-amount">
                      <span v-if="!isZero(item.fields.service_refund.amount)">{{
                        formatNumber(item.fields.service_refund.amount) }}</span>
                    </td>
                    <td class="total-amount report-amount">
                      {{ formatNumber(item.fields.total_amount) }}
                    </td>
                    <td class="points-deduction report-amount">
                      {{ formatNumber(item.fields.points_deduction) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </aha-table>
          </div>
        </div>
      </div>

      <aha-report-description
        :value="report_description"
        class="report-description"
      />
    </section>

    <report-print-preview-modal
      :print_sections="print_sections"
      :header_text="report_header_text"
      :modal_id="reportPrintPreviewModalId"
      @on-click-save-as-excel="saveReportAsExcel"
    />
  </main>
</template>

<script>

const ALL_STAFF = -1
const NOT_SELECT_STAFF = 0

// Utils
import {
  formatDateLocalized,
  formatMoney,
  formatMonthAndDateLocalized,
  getTypeNameOfArray,
} from 'CommonHelpers'

import {
  getDiffDateRange,
  getEndOfTimezoneDateTS,
  getStartOfTimezoneDateTS,
} from 'DatetimeHelpers'

import {
  excel_cells,
  setRowStyles,
  setCellAlignment,
} from 'Utils/report-export-excel.js'
import ExcelJS from 'exceljs'
import { cloneDeep } from 'lodash'
import { saveAs } from 'file-saver'
import { mapActions, mapMutations } from 'vuex'
import { ApiError } from 'HTTPHelpers'
import { isPermissionGranted } from 'PermissionHelpers'

// API
import ReportApi from 'API/sales/report-api.js'

// Mixins
import StaffMixin from 'Mixins/staff-mixin.js'
import SalesReportMixin from 'Mixins/sales-report-mixin.js'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache.js'
import InputDateRangeMixin from 'Mixins/input-date-range-mixin.js'

// Components
import AhaTable from 'CommonComponents/aha-table/aha-table.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import RadioGroup from 'CommonComponents/form/radio/radio-group/radio-group.vue'
import SalesTotalHeader from 'Components/sales/sales-total/sales-total-header.vue'
import AhaReportDescription from 'CommonComponents/aha-report-description/aha-report-description.vue'
import ReportPrintPreviewModal from 'CommonComponents/report-print-preview-modal/report-print-preview-modal.vue'
import InputDateRangeByDateTypes from 'CommonComponents/form/input/input-date-range-by-date-types/input-date-range-by-date-types.vue'

// Constants
import print_options from 'Options/print-options.js'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'
import {
  DISPLAY_TYPE,
  USER_ROLES,
  ENVIRONMENT,
  USER_ACCOUNT_ACTIONS,
  PERMISSION_TYPE,
} from 'Constant'

const TRANSACTION_WITH_COMMON_VALUE_FOR_SALE_BY_ITEM = [
  'balance_deduction', 'refund', 'sales', 'service_deduction', 'total',
]
const MAX_YEAR_RANGE = 1

export default {
  components: {
    AhaTable,
    RadioGroup,
    SalesTotalHeader,
    AhaReportDescription,
    ReportPrintPreviewModal,
    InputDateRangeByDateTypes,
  },

  extends: ComponentBase,

  mixins: [
    StaffMixin,
    SalesCacheMixin,
    SalesReportMixin,
    InputDateRangeMixin('table_filter', 'table_filter.date_type', 'input_date_range_by_date_type'),
  ],

  data() {
    return {
      ALL_STAFF,
      NOT_SELECT_STAFF,

      sales_options,

      table_filter: {
        shop_id:         0,
        to_date_ts:      getEndOfTimezoneDateTS(),
        from_date_ts:    getStartOfTimezoneDateTS(),
        staff_id:        ALL_STAFF,
        display_by_type: DISPLAY_TYPE.CATEGORY,
        sales_item_type: sales_options.sales_goods_type.service,

        // ui only
        to_date: {
          value: getEndOfTimezoneDateTS(),
        },
        from_date: {
          value: getStartOfTimezoneDateTS(),
        },
        date_type: common_options.date_type.date,
      },

      table_rows: [],

      staff_options:        [],
      sales_item_type_view: sales_options.sales_goods_type.service,

      searchDateRangeNumber:    0,
      data_protection_security: {},

      section_print: null,
      print_filter:  {
        to_date_ts:   0,
        from_date_ts: 0,
      },
      keyIndex: 0,

      userAccountData: {},
    }
  },

  computed: {
    sales_item_type_options() {
      return [
        { value: sales_options.sales_goods_type.service, text: this.$i18n.t('report.service') },
        { value: sales_options.sales_goods_type.product, text: this.$i18n.t('report.product') },
        { value: sales_options.sales_goods_type.prepaid_card, text: this.$i18n.t('report.prepaid-card') },
        { value: sales_options.sales_goods_type.prepaid_service, text: this.$i18n.t('report.prepaid-service') },
      ]
    },

    display_by_type_options() {
      return [
        { value: DISPLAY_TYPE.CATEGORY, text: 'report.category' },
        { value: DISPLAY_TYPE.SERVICE, text: 'report.service' },
      ]
    },

    text_sales_item_by() {
      if (this.is_view_service)
        return this.$t('report.sales-by-service')
      if (this.is_view_product)
        return this.$t('report.sales-by-product')
      if (this.is_view_prepaid_card)
        return this.$t('report.sales-by-prepaid-card')
      if (this.is_view_prepaid_service)
        return this.$t('report.sales-by-prepaid-service')

      return ''
    },

    is_view_service() {
      return this.sales_item_type_view === sales_options.sales_goods_type.service
    },

    is_view_product() {
      return this.sales_item_type_view === sales_options.sales_goods_type.product
    },

    is_view_prepaid_card() {
      return this.sales_item_type_view === sales_options.sales_goods_type.prepaid_card
    },

    is_view_prepaid_service() {
      return this.sales_item_type_view === sales_options.sales_goods_type.prepaid_service
    },

    is_display_by_category() {
      return this.table_filter.display_by_type === DISPLAY_TYPE.CATEGORY
    },

    is_display_by_service() {
      return this.table_filter.display_by_type === DISPLAY_TYPE.SERVICE
    },

    can_display_by_service() {
      return (this.is_view_service || this.is_view_prepaid_service) && this.is_display_by_service
    },

    is_display_by_service_checkbox: {
      get() {
        return this.table_filter.display_by_type === DISPLAY_TYPE.SERVICE
      },
      set(value) {
        this.table_filter.display_by_type = value ? DISPLAY_TYPE.SERVICE : DISPLAY_TYPE.CATEGORY
      },
    },

    view_by_checkbox_label() {
      if (this.is_view_prepaid_service) {
        return this.$t('report.view-by-prepaid-service')
      }
      return this.$t('report.view-by-service')
    },

    dateRangeCanNotExceedDays() {
      return this.$t('sales.date_range_can_not_exceed_staff_search_date_range', {
        'search-date-range': this.searchDateRangeNumber,
      })
    },

    dateRangeCanNotExceedMonth() {
      return this.$t('sales.date-range-can-not-exceed-months', {
        'search-date-range': this.monthNumber,
      })
    },

    report_description() {
      return [
        this.$t('report.sales-by-item-intro-1'),
        this.$t('report.sales-by-item-intro-2'),
        this.$t('report.sales-by-item-intro-3'),
        this.$t('report.sales-by-item-intro-4'),
      ]
    },

    list_staff_options() {
      if (!this.staff_options || !this.staff_options.length) {
        return []
      }

      return [
        { id: ALL_STAFF, aliasname: this.$t('general.all') },
        ...this.staff_options,
        { id: NOT_SELECT_STAFF, aliasname: this.$t('sales.not-select') },
      ]
    },

    selected_staff_filter_name() {
      const selectedStaff = this.list_staff_options.find(staff_option => staff_option.id === this.print_filter.staff_id) || {}
      return selectedStaff.aliasname || ''
    },

    date_filter_print_text() {
      switch (this.print_filter.date_type) {
        case common_options.date_type.date:
          return `(${formatDateLocalized(this.print_filter.to_date_ts, this.app_language)})`
        case common_options.date_type.month:
          return `(${formatMonthAndDateLocalized(this.print_filter.to_date_ts, this.app_language)})`
        case common_options.date_type.date_range:
          return `(${formatDateLocalized(this.print_filter.from_date_ts, this.app_language)} - ${formatDateLocalized(this.print_filter.to_date_ts, this.app_language)})`
        default:
          return ''
      }
    },

    report_sub_name() {
      return `${this.text_sales_item_by} - ${this.selected_staff_filter_name}`
    },

    report_header_text() {
      return [
        this.$t('report.sales-by-item'),
        this.report_sub_name,
        this.date_filter_print_text,
      ]
    },

    print_sections() {
      let print_table_ref = null
      if (this.section_print) {
        const tableWrapperDom = this.section_print
        print_table_ref = tableWrapperDom.getElementsByTagName('table')[0]
      }

      return [
        {
          ref_type: print_options.print_ref_type.table,

          section_ref:  print_table_ref,
          customStyles: this.tableSalesItemStyles,
        },
      ]
    },

    tableSalesItemStyles() {
      if (this.is_view_product) {
        return [
          { halign: 'center' },
          { halign: 'right' },
          {},
          { halign: 'right', cellWidth: 60 },
          {},
          { halign: 'right', cellWidth: 60 },
          {},
          { halign: 'right', cellWidth: 60 },
          {},
          { halign: 'right', cellWidth: 70 },
          { halign: 'right' },
          { halign: 'right', cellWidth: 70 },
          { halign: 'right', cellWidth: 70 },
          { halign: 'right', cellWidth: 70 },
        ]
      } else if (this.is_view_prepaid_card) {
        return [
          { halign: 'left' },
          {},
          { halign: 'right' },
          { halign: 'right' },
          {},
          { halign: 'right' },
          { halign: 'right' },
          { halign: 'right' },
          { halign: 'right' },
          { halign: 'right' },
        ]
      } else if (this.is_view_prepaid_service) {
        if (this.can_display_by_service) {
          return [
            { halign: 'left' },
            { halign: 'left' },
            {},
            { halign: 'right' },
            {},
            { halign: 'right' },
            { halign: 'right' },
            { halign: 'right' },
          ]
        }

        return [
          { halign: 'left' },
          {},
          { halign: 'right' },
          {},
          { halign: 'right' },
          { halign: 'right' },
          { halign: 'right' },
        ]
      }

      if (this.is_view_service && this.can_display_by_service) {
        return [
          { halign: 'left' },
          { halign: 'left' },
          {},
          { halign: 'right' },
          {},
          { halign: 'right' },
          {},
          { halign: 'right' },
          { halign: 'right' },
          { halign: 'right' },
          { halign: 'right' },
        ]
      }

      return [
        { halign: 'left' },
        {},
        { halign: 'right' },
        {},
        { halign: 'right' },
        {},
        { halign: 'right' },
        { halign: 'right' },
        { halign: 'right' },
        { halign: 'right' },
      ]

    },

    reportPrintPreviewModalId() {
      return 'report-print-preview-modal'
    },

    isStaffRole() {
      return this.x_user.user_role_code === USER_ROLES.STAFF
    },

    isManagerRole() {
      return this.x_user.user_role_code === USER_ROLES.MANAGER
    },

    isMasterRole() {
      return this.x_user.user_role_code === USER_ROLES.MASTER
    },

    isNoLimit() {
      return this.searchDateRangeNumber === ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.NO_LIMIT
    },

    isNotAllowed() {
      return this.searchDateRangeNumber === ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.NOT_ALLOWED
    },

    isMonths() {
      return (
        this.searchDateRangeNumber === ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.TWO_MONTHS ||
        this.searchDateRangeNumber === ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.THREE_MONTHS
      )
    },

    monthNumber() {
      return this.searchDateRangeNumber / ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.DAY_OF_MONTH
    },

    isUsingMonth() {
      return this.isMasterRole || this.isNoLimit
    },

    allowViewDataOfOrderStaffs() {
      if (!this.userAccountData.staff_id) {
        return true
      }

      if (this.isStaffRole || this.isManagerRole) {
        const permissionType = this.isStaffRole
          ? PERMISSION_TYPE.STAFF
          : PERMISSION_TYPE.MANAGER

        return isPermissionGranted(permissionType, this.data_protection_security.allow_view_data_of_order_staffs)
      }

      return true
    },
  },

  watch: {
    'selectedFilterDateMixin': {
      deep:      true,
      immediate: true,

      handler() {
        this.setSelectedFilterDate(this.selectedFilterDateMixin)
      },
    },
  },

  mounted() {
    this.initData()
  },

  methods: {
    ...mapMutations('salesReport', [
      'setSelectedFilterDate',
    ]),

    ...mapActions('user_account', [
      'setUserAccountActionDataAsync',
    ]),

    formatMoney,
    getTypeNameOfArray,

    async initData() {
      try {
        this.table_filter.shop_id = this.shop_data.shop_id

        this.preLoader()
        await this.loadEnvironmentSetup() // loadTableDataAsync need staff_search_date_range

        this.table_rows = this.generateDefaultForSalesByItemTableWithNoData()
        await this.loadStaffItemsAsync()
        await this.setDefaultFilterInputDateRangeMixin()
        await this.setDefaultFilterSelectedStaff()
        this.loadTableDataAsync()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async setDefaultFilterSelectedStaff() {
      try {
        this.preSubLoad()
        const payload = {
          action:  USER_ACCOUNT_ACTIONS.BASIC_INFO_EDIT,
          id:      this.x_user.user_id,
          shop_id: this.shop_data.shop_id,
        }

        const response = await this.setUserAccountActionDataAsync(payload)
        this.userAccountData = response.data

        this.table_filter.staff_id = this.isStaffRole
          ? (response.data.staff_id ? response.data.staff_id : -1)
          : -1
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preSubLoad(false)
      }
    },

    // filter
    async loadEnvironmentSetup() {
      const environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
        shopId:      this.shop_data.shop_id,
        countryCode: this.shop_data.country,
      })

      if (this.isNullObject(environmentSetup))
        this.showMissingSalesSetupAlert()
      else {
        this.data_protection_security = environmentSetup.data_protection_security.fields
        if (this.isManagerRole) {
          this.searchDateRangeNumber = this.data_protection_security.sales_report_and_invoices_date_range_manager_can_search
        }

        if (this.isStaffRole) {
          this.searchDateRangeNumber = this.data_protection_security.sales_report_and_invoices_date_range_staff_can_search
        }
      }
    },

    async loadStaffItemsAsync() {
      try {
        const response = await this.getStaffsAsyncMixin()
        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.staff_options = response.data.items
        this.table_filter.staff_id = this.$route.query.staffId || ALL_STAFF
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    generateDefaultForSalesByItemTableWithNoData() {
      const salesByItemInfo = {
        'points_deduction':   0,
        'average_unit_price': 0,
        'service_name':       this.table_filter.display_by_type === DISPLAY_TYPE.CATEGORY ? '' : 'TOTAL',
        'category_name':      this.table_filter.display_by_type === DISPLAY_TYPE.CATEGORY ? 'TOTAL' : '',
      }

      TRANSACTION_WITH_COMMON_VALUE_FOR_SALE_BY_ITEM.forEach(item => salesByItemInfo[item] = this.generateDefaultCommonValueForSaleByItemTableWithNoData())

      return [{
        fields: salesByItemInfo,
      }]
    },

    generateDefaultCommonValueForSaleByItemTableWithNoData() {
      return {
        amount:   0,
        quantity: 0,
      }
    },

    // table
    async loadTableDataAsync() {
      try {
        this.preLoader()

        // validate filter
        const errors = [...this.$refs.input_date_range_by_date_type.errors]
        if (this.isStaffRole || this.isManagerRole) {
          if (this.isNotAllowed) {
            errors.push(this.$t('sales.date-range-not-allowed'))
          } else {
            if (!this.isNoLimit) {
              let isInValidDateRange = getDiffDateRange(this.table_filter.from_date.value, getEndOfTimezoneDateTS()) > this.searchDateRangeNumber
              if (this.isMonths) {
                isInValidDateRange = getDiffDateRange(this.table_filter.from_date.value, getEndOfTimezoneDateTS(), 'month') > this.monthNumber
              }
              if (isInValidDateRange || (this.table_filter.to_date.value > getEndOfTimezoneDateTS())) {
                switch (this.searchDateRangeNumber) {
                  case 1:
                    errors.push(this.$t('sales.date-range-can-not-exceed-today'))
                    break
                  case ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.TWO_MONTHS:
                    errors.push(this.dateRangeCanNotExceedMonth)
                    break
                  case ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.THREE_MONTHS:
                    errors.push(this.dateRangeCanNotExceedMonth)
                    break
                  default:
                    errors.push(this.dateRangeCanNotExceedDays)
                    break
                }
              }
            }
          }
        }

        if (this.table_filter.date_type === common_options.date_type.date_range) {
          if (getDiffDateRange(this.table_filter.from_date.value, this.table_filter.to_date.value, 'year') > MAX_YEAR_RANGE) {
            errors.push(this.$t('report.date-range-cant-exceed-1-year'))
          }
        }

        if (errors.length > 0) {
          this.table_rows = this.generateDefaultForSalesByItemTableWithNoData()

          this._showDialogAlert(errors)
          return
        }

        const reportApi = new ReportApi()
        const response = await reportApi.getSalesTotalByItemReportAsync(this.table_filter)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.table_rows = response.data
        this.sales_item_type_view = cloneDeep(this.table_filter.sales_item_type)
        this.setPrintFilterData()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onSearch() {
      const query = {
        dateType:      this.table_filter.date_type,
        fromDateTS:    this.table_filter.from_date_ts,
        toDateTS:      this.table_filter.to_date_ts,
        staffId:       this.table_filter.staff_id,
        salesItemType: this.table_filter.sales_item_type,
      }

      await this.loadTableDataAsync()

      this.$router.replace({
        query,
        name: 'sales-by-item',
      })
    },

    async onInputDisplayByType() {
      await this.loadTableDataAsync()
    },

    // format
    isZero(number) {
      return number === 0
    },

    isZeroBoth(number1, number2) {
      return number1 === 0 && number2 === 0
    },

    formatName(name) {
      if (name === 'NONE') {
        return this.$t('report.no-category')
      }

      if (name === 'TOTAL') {
        return this.$t('general.total')
      }

      return name
    },

    formatNumber(value) {
      if (value === '-') {
        return value
      }
      else {
        if (value !== 0) {
          return formatMoney(value, 0)
        }
      }

      return ''
    },

    // print
    onClickPrintReport() {
      this.section_print = this.$refs.report_table_ref.$el
      this.showDialogById(this.reportPrintPreviewModalId)
    },

    setPrintFilterData() {
      this.print_filter = cloneDeep(this.table_filter)
    },

    async saveReportAsExcel({ file_name, print_date, header_text }) {
      // excel rows, cols start at 1

      // workbook
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet(this.$t('report.sales-by-item'))
      ws.properties.defaultColWidth = 25

      // worksheet title
      header_text.forEach((text, index) => {
        const rowTitle = ws.addRow([text])
        if (index === 0) {
          rowTitle.font = { bold: true, size: 16 }
        } else {
          rowTitle.font = { bold: true, size: 14 }
        }
      })

      const tableHeaders = (() => {
        if (this.is_view_service) {
          return [
            this.$t('report.category'),
            this.$t('report.sales'),
            '',
            this.$t('sales.balance-deduction'),
            '',
            this.$t('report.service-deduction'),
            '',
            `${this.$t('sales.total')}\r\n(A + B + C)`,
            this.$t('report.average-unit-price'),
            this.$t('report.points-deduction'),
          ]
        }

        if (this.is_view_product) {
          return [
            this.$t('products.product-code'),
            this.$t('products.product-name'),
            this.$t('report.sales'),
            '',
            this.$t('sales.sales-item-refund'),
            '',
            this.$t('sales.balance-deduction'),
            '',
            `${this.$t('sales.total')}(D)\r\n(A - B + C)`,
            '',
            this.$t('report.points-deduction'),
            this.$t('report.purchase-unit-price'),
            `${this.$t('report.purchase-amount')}\r\n(E)`,
            `${this.$t('report.sales-profits')}\r\n(D - E)`,

          ]
        }

        if (this.is_view_prepaid_card) {
          return [
            this.$t('report.prepaid-card'),
            this.$t('report.sales'),
            '',
            '',
            this.$t('sales.sales-item-refund'),
            '',
            '',
            `${this.$t('sales.sales-total')}\r\n(A - C)`,
            `${this.$t('sales.earned-total')}\r\n(B - D)`,
            this.$t('report.points-deduction'),
          ]
        }

        if (this.is_view_prepaid_service) {
          return [
            this.$t('report.category'),
            this.$t('report.sales'),
            '',
            this.$t('sales.sales-item-refund'),
            '',
            `${this.$t('sales.total')}\r\n(A - B)`,
            this.$t('report.points-deduction'),
          ]
        }
      })()

      if (this.can_display_by_service && this.is_view_service) {
        tableHeaders.splice(1, 0, this.$t('report.service'))
      }

      if (this.can_display_by_service && this.is_view_prepaid_service) {
        tableHeaders.splice(1, 0, this.$t('report.prepaid-service'))
      }

      // set print sections to excel
      ws.addRow() // for spacing
      this.setTableSectionToExcel(ws, tableHeaders, this.table_rows)

      // Add date/time at bottom right
      const maxColumns = tableHeaders.length
      const dateRow = [...new Array(maxColumns - 1).fill(''), print_date]
      const dateRowAdded = ws.addRow(dateRow)
      const dateCellAddress = `${excel_cells[maxColumns - 1]}${dateRowAdded.number}`
      setCellAlignment(dateCellAddress, ws, 'right')
      ws.getCell(dateCellAddress).font = { italic: true, color: { argb: 'FF808080' } }

      // Save
      const buf = await wb.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `${file_name}.xlsx`)
    },

    setTableSectionToExcel(ws, excelTableHeaders = [], excelTableRows = []) {
      // Table header
      const cellsHeaderRow = ws.addRow(excelTableHeaders)
      cellsHeaderRow.height = 30
      cellsHeaderRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, cellsHeaderRow.number, true)
      if (this.is_view_product) {
        // increase column width for this special column
        ws.getColumn(excel_cells[8]).width = 35
      }

      let startColumnToMerge = null
      const excelTableSubHeaders = []
      for (let i = 0; i < excelTableHeaders.length; i++) {
        let cellAddressBeMerged = null
        if (this.getColumnIndexsNotBeMerged().includes(i)) {
          // column will be merged cell in rows
          excelTableSubHeaders.push('')
        } else if (excelTableHeaders[i] !== '') {
          if (!startColumnToMerge) {
            startColumnToMerge = i
          }

          if (this.is_view_prepaid_card) {
            if (i === 1) {
              excelTableSubHeaders.push(
                `${this.$t('general.qty')}`,
                `${this.$t('sales.amount')}(${'A'})`,
                `${this.$t('sales.earned-amount')}(${'B'})`,
              )
            } else {
              excelTableSubHeaders.push(
                `${this.$t('general.qty')}`,
                `${this.$t('sales.amount')}(${'C'})`,
                `${this.$t('general.balance-deduction')}(${'D'})`,
              )
            }
          } else {
            const subHeaderMap = {
              1: `${this.$t('sales.amount')}(${'A'})`,
              2: `${this.$t('sales.amount')}(${'A'})`,
              3: `${this.$t('sales.amount')}(${'B'})`,
              4: `${this.$t('sales.amount')}(${'B'})`,
              6: `${this.$t('sales.amount')}(${'C'})`,
              8: `${this.$t('sales.amount')}`,
            }

            excelTableSubHeaders.push(
              `${this.$t('general.qty')}`,
              subHeaderMap[i] || `${this.$t('sales.amount')}(${'C'})`,
            )
          }

          const excelColumnStartMerging = excel_cells[startColumnToMerge]
          let excelColumnEndMerging = excel_cells[startColumnToMerge + 1]

          if (this.is_view_prepaid_card) {
            excelColumnEndMerging = excel_cells[startColumnToMerge + 2]
          }
          ws.getColumn(excelColumnStartMerging).width = 15
          ws.getColumn(excelColumnEndMerging).width = 15
          cellAddressBeMerged = `${excelColumnStartMerging}${cellsHeaderRow.number}:${excelColumnEndMerging}${cellsHeaderRow.number}`
          if (this.is_view_prepaid_card) {
            startColumnToMerge += 3 // Merge 3 cell each times
          } else {
            startColumnToMerge += 2
          }
        }

        if (cellAddressBeMerged) {
          // Merge header cells
          ws.mergeCells(cellAddressBeMerged)
        }
      }

      const subHeadersRow = ws.addRow(excelTableSubHeaders)
      subHeadersRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, subHeadersRow.number, true)

      // Merge header columns in rows
      this.getColumnIndexsNotBeMerged().forEach(column_index => {
        ws.mergeCells(`${excel_cells[column_index]}${cellsHeaderRow.number}:${excel_cells[column_index]}${cellsHeaderRow.number + 1}`)
      })

      // Table rows
      excelTableRows.forEach((row, index) => {
        const ws_row = ws.addRow(this.getExcelRowDataByViewType(row))
        if (index === excelTableRows.length - 1) {
          const temp = cloneDeep(this.tableSalesItemStyles)
          this.is_view_product ? temp[1].halign = 'center' : temp[0].halign = 'center'
          setRowStyles(ws, excelTableHeaders.length, ws_row.number, false, temp)
        } else {
          setRowStyles(ws, excelTableHeaders.length, ws_row.number, false, this.tableSalesItemStyles)
        }
      })
    },

    getExcelRowDataByViewType(item) {
      const rowData = []
      if (this.is_view_service) {
        rowData.push(this.formatName(item.fields.category_name))

        if (this.can_display_by_service) {
          rowData.push(this.formatName(item.fields.service_name))
        }

        rowData.push(this.getExcelFormatOfDisplaySalesRefundValues(item.fields.sales.quantity, item.fields.refund.quantity))
        rowData.push(this.getExcelFormatOfDisplaySalesRefundValues(item.fields.sales.amount, item.fields.refund.amount))
        rowData.push(this.formatNumber(item.fields.balance_deduction.quantity, 0))
        rowData.push(this.formatNumber(item.fields.balance_deduction.amount, 0))
        rowData.push(this.formatNumber(item.fields.service_deduction.quantity, 0))
        rowData.push(this.formatNumber(item.fields.service_deduction.amount, 0))

        let totalAmount = ''
        if (!this.isZero(item.fields.total.amount)) {
          totalAmount = this.formatNumber(item.fields.total.amount)
        }
        rowData.push(totalAmount)
        rowData.push(this.formatNumber(item.fields.average_unit_price))
        rowData.push(this.formatNumber(item.fields.points_deduction))
      }

      if (this.is_view_product) {
        rowData.push(item.fields.product_code)
        rowData.push(this.formatName(item.fields.product_name))
        rowData.push(this.formatNumber(item.fields.sales.quantity))
        rowData.push(this.formatNumber(item.fields.sales.amount))
        rowData.push(this.formatNumber(item.fields.refund.quantity))
        rowData.push(this.formatNumber(item.fields.refund.amount))
        rowData.push(this.formatNumber(item.fields.balance_deduction.quantity))
        rowData.push(this.formatNumber(item.fields.balance_deduction.amount))
        rowData.push(this.formatNumber(item.fields.total_quantity))
        rowData.push(this.formatNumber(item.fields.total_amount))
        rowData.push(this.formatNumber(item.fields.points_deduction))
        rowData.push(this.formatNumber(item.fields.purchase_unit_price))
        rowData.push(this.formatNumber(item.fields.purchase_amount))
        rowData.push(this.formatNumber(item.fields.sales_profit))
      }

      if (this.is_view_prepaid_card) {
        rowData.push(this.formatName(item.fields.prepaid_card_name))
        rowData.push(this.formatNumber(item.fields.sales.quantity))
        rowData.push(this.formatNumber(item.fields.sales.amount))
        rowData.push(this.formatNumber(item.fields.sales.earned_amount))
        rowData.push(this.formatNumber(item.fields.refund.quantity))
        rowData.push(this.formatNumber(item.fields.refund.amount))
        rowData.push(this.formatNumber(item.fields.refund.balance_deduction))
        rowData.push(this.formatNumber(item.fields.total_amount))
        rowData.push(this.formatNumber(item.fields.earned_total))
        rowData.push(this.formatNumber(item.fields.points_deduction))
      }

      if (this.is_view_prepaid_service) {
        rowData.push(this.formatName(item.fields.category_name))

        if (this.can_display_by_service) {
          rowData.push(this.formatName(item.fields.prepaid_service_name))
        }

        rowData.push(this.formatNumber(item.fields.sales.quantity))
        rowData.push(this.formatNumber(item.fields.sales.amount))
        rowData.push(this.formatNumber(item.fields.service_refund.quantity))
        rowData.push(this.formatNumber(item.fields.service_refund.amount))
        rowData.push(this.formatNumber(item.fields.total_amount))
        rowData.push(this.formatNumber(item.fields.points_deduction))
      }

      return rowData
    },

    getColumnIndexsNotBeMerged() {
      let columnIndexsNotBeMerged = []

      if (this.is_view_service) {
        columnIndexsNotBeMerged = [0, 7, 8, 9]

        if (this.can_display_by_service) {
          columnIndexsNotBeMerged = [0, 1, 8, 9, 10]
        }
      }

      if (this.is_view_product) {
        columnIndexsNotBeMerged = [0, 1, 10, 11, 12, 13, 14]
      }

      if (this.is_view_prepaid_card) {
        columnIndexsNotBeMerged = [0, 7, 8, 9]
      }

      if (this.is_view_prepaid_service) {
        columnIndexsNotBeMerged = [0, 5, 6]

        if (this.can_display_by_service) {
          columnIndexsNotBeMerged = [0, 1, 6, 7]
        }
      }

      return columnIndexsNotBeMerged
    },

    getExcelFormatOfDisplaySalesRefundValues(salesValue, refundValue) {
      let format = ''
      if (!this.isZeroBoth(salesValue, refundValue)) {
        format = this.formatNumber(salesValue)
        if (!this.isZero(refundValue)) {
          format += `\r\n(${this.formatNumber(refundValue)})`
        }
      }

      return format
    },

    getCellHTML(salesValue, refundValue) {
      // have to use this to avoid line not break when printing
      let temp = ''
      if (!this.isZeroBoth(salesValue, refundValue)) {
        temp += `<span>${this.formatNumber(salesValue)}</span>`
        if (!this.isZero(refundValue)) {
          temp += `<br><span>(${this.formatNumber(refundValue)})</span>`
        }
      }

      return temp
    },

    onChangeSalesItem() {
      this.onSearch()
    },

    onClickSalesItemTab(value) {
      if (this.table_filter.sales_item_type !== value) {
        this.table_filter.sales_item_type = value
        this.onSearch()
      }
    },
  },
}
</script>

<style lang="scss">
@import './sales-by-item.scss';
</style>
