<template>
  <main>
    <section class="sales-by-staff-page">
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row filter">
              <input-date-range-by-date-types
                ref="input_date_range_by_date_type"
                :key="keyIndex"
                v-model="table_filter"
                :is_using_month="isUsingMonth"
                class="ml-3"
                have-arrow-button
                @on-search="onSearch"
              />

              <div class="ml-3 select-staff">
                <div class="select-box-wrapper">
                  <div class="select-box staff">
                    <label>{{ $t('general.staff') }}</label>
                    <b-form-select
                      v-model="table_filter.staffId"
                      :options="list_staff_options"
                      :disabled="!allowViewDataOfOrderStaffs"
                      value-field="id"
                      text-field="aliasname"
                      @change="onStaffIdChange"
                    />
                  </div>
                </div>
              </div>

              <div
                v-if="!isStaffMode"
                class="ml-3 sales-by-staff-page__include-point-checkbox"
              >
                <b-form-checkbox
                  v-model="table_filter.isPointDeductionIncluded"
                  :value="true"
                  @change="onSearch"
                >
                  {{ $t('payroll.include-point-deduction') }}
                </b-form-checkbox>
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

      <div
        id="table-wrapper"
        class="table-wrapper"
      >
        <aha-table
          v-if="!isStaffMode"
          ref="report_table_ref"
          :fixed-column-quantity="1"
          is-fixed-header
        >
          <table>
            <thead>
              <tr>
                <th rowspan="2">
                  {{ staff_text }}
                </th>
                <th rowspan="2">
                  {{ $t('payroll.sales') }} / {{ $t('report.deduction') }}
                </th>
                <th colspan="2">
                  {{ service_sales_text }}
                </th>
                <th colspan="2">
                  {{ product_sales_text }}
                </th>
                <th rowspan="2">
                  {{ $t('report.sub-total') }}
                  <p>{{ '\r\n(A + B)' }}</p>
                </th>
                <th colspan="2">
                  {{ prepaid_card_text }}
                </th>
                <th colspan="2">
                  {{ prepaid_service_text }}
                </th>
                <th rowspan="2">
                  {{ $t('general.total') }}
                  <p>{{ '\r\n(A + B + C + D)' }}</p>
                </th>
              </tr>
              <tr>
                <th>{{ quantity_text }}</th>
                <th>{{ amount_text }} (A)</th>
                <th>{{ quantity_text }}</th>
                <th>{{ amount_text }} (B)</th>
                <th>{{ quantity_text }}</th>
                <th>{{ amount_text }} (C)</th>
                <th>{{ quantity_text }}</th>
                <th>{{ amount_text }} (D)</th>
              </tr>
            </thead>

            <tbody v-if="table_rows && table_rows.length">
              <template v-for="(row, index) in table_rows">
                <tr :key="'0' + index">
                  <td rowspan="3">
                    {{ formatName(row.fields.staff.staff_name) }}
                  </td>
                  <td>
                    <span>{{ $t('payroll.sales') }}</span>
                  </td>
                  <td>
                    <span>{{ displayDataSalesByStaff(row.fields.services.sales_quantity) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.services.sales_amount) }}</span>
                  </td>
                  <td>
                    <span>{{ displayDataSalesByStaff(row.fields.products.sales_quantity) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.products.sales_amount) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.sub_total.sales) }}</span>
                  </td>
                  <td>
                    <span>{{ displayDataSalesByStaff(row.fields.prepaid_cards.sales_quantity) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.prepaid_cards.sales_total_amount) }}</span>
                  </td>
                  <td>
                    <span>{{ displayDataSalesByStaff(row.fields.prepaid_services.sales_quantity) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.prepaid_services.sales_total_amount) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.total) }}</span>
                  </td>
                </tr>
                <tr :key="'1' + index">
                  <td>
                    <span>{{ $t('payroll.prepaid-goods-deduction') }}</span>
                  </td>
                  <td>
                    <span>{{ displayDataSalesByStaff(row.fields.services.deduction_total_quantity) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.services.deduction_total_amount) }}</span>
                  </td>
                  <td>
                    <span>{{ displayDataSalesByStaff(row.fields.products.deduction_total_quantity) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.products.deduction_total_amount) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.sub_total.deduction) }}</span>
                  </td>
                  <td class="disabled" />
                  <td class="disabled" />
                  <td class="disabled" />
                  <td class="disabled" />
                  <td class="disabled" />
                </tr>
                <tr
                  :key="'2' + index"
                  class="total-amount"
                >
                  <td>
                    <span>{{ $t('general.total') }}</span>
                  </td>
                  <td>
                    <span>-</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.services.grand_total_amount) }}</span>
                  </td>
                  <td>
                    <span>-</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.products.grand_total_amount) }}</span>
                  </td>
                  <td class="report-amount">
                    <span>{{ displayDataSalesByStaff(row.fields.sub_total.total) }}</span>
                  </td>
                  <td class="disabled" />
                  <td class="disabled" />
                  <td class="disabled" />
                  <td class="disabled" />
                  <td class="disabled" />
                </tr>
              </template>
              <!-- <tr>
                <td class="disabled"/>
                <td>
                  <span>{{ $t('sales.grand-total') }}</span>
                </td>
                <td>
                  <span>{{ displayDataSalesByStaff(totalItem.serviceQuantity) }}</span>
                </td>
                <td class="report-amount">
                  <span>{{ displayDataSalesByStaff(totalItem.serviceAmount) }}</span>
                </td>
                <td>
                  <span>{{ displayDataSalesByStaff(totalItem.productQuantity) }}</span>
                </td>
                <td class="report-amount">
                  <span>{{ displayDataSalesByStaff(totalItem.productAmount) }}</span>
                </td>
                <td class="report-amount">
                  <span>{{ displayDataSalesByStaff(totalItem.subTotal) }}</span>
                </td>

                <td>
                  <span>-</span>
                </td>

                <td class="report-amount">
                  <span>{{ displayDataSalesByStaff(totalItem.prepaidCardSalesAmount) }}</span>
                </td>

                <td>
                  <span>-</span>
                </td>
                <td class="report-amount">
                  <span>{{ displayDataSalesByStaff(totalItem.prepaidServiceSalesAmount) }}</span>
                </td>

                <td class="report-amount">
                  <span>{{ displayDataSalesByStaff(totalItem.total) }}</span>
                </td>
                <td class="disabled" />

              </tr> -->
            </tbody>
            <tbody v-else>
              <tr>
                <td
                  colspan="13"
                  class="table-no-data"
                >
                  {{ $t('general.no-data-for-table') }}
                </td>
              </tr>
            </tbody>
          </table>
        </aha-table>
        <div
          v-else
          class="staff-table-wrapper"
        >
          <div class="sales-total-wrapper">
            <div class="sales-total-wrapper__header">
              <div
                ref="sales_total_report_title_ref1"
                class="table-sales-title"
              >
                <h3 class="table-sales-title__text">
                  {{ report_sales_total_detail_title }}
                </h3>
                <span class="based-text">({{ $t('report-total.based-on-prepaid-goods-sales') }})</span>
              </div>
              <div class="payment-total__header payment-total__header-pc">
                <div class="col sales-by-staff-page__include-point-checkbox">
                  <b-form-checkbox
                    v-if="isStaffMode"
                    v-model="table_filter.isPointDeductionIncluded"
                    :value="true"
                    @change="onSearch"
                  >
                    {{ $t('payroll.include-point-deduction') }}
                  </b-form-checkbox>
                </div>
                <div class="col sales-by-staff-page__view-by-payment-method-checkbox">
                  <b-form-checkbox v-model="isPaymentTotalTableShow">
                    {{ $t('report.view-by-payment-method') }}
                  </b-form-checkbox>
                </div>
              </div>
            </div>

            <div class="payment-total__header payment-total__header-mobile">
              <div class="col sales-by-staff-page__include-point-checkbox">
                <b-form-checkbox
                  v-if="isStaffMode"
                  v-model="table_filter.isPointDeductionIncluded"
                  :value="true"
                  @change="onSearch"
                >
                  {{ $t('payroll.include-point-deduction') }}
                </b-form-checkbox>
              </div>
              <div class="col sales-by-staff-page__view-by-payment-method-checkbox">
                <b-form-checkbox v-model="isPaymentTotalTableShow">
                  {{ $t('report.view-by-payment-method') }}
                </b-form-checkbox>
              </div>
            </div>
            <sales-total-detail-table-by-staff
              ref="sales_total_detail_report_ref1"
              :key="is_modal_detail_shown"
              :is-sales-total="true"
              :sales_total_detail="sales_total_detail_filtered"
              :is-point-deduction-included="table_filter.isPointDeductionIncluded"
            />
          </div>

          <div class="payment-total">
            xxxxx
            <sales-payment-total-table
              v-if="isPaymentTotalTableShow"
              ref="paymentTotalReportTableRef2"
              :payment-totals="paymentTotals"
            />
          </div>

          <div class="revenue-total-wrapper">
            <div class="sales-total-wrapper__head            <sales-payment-total-table
              v-if="isPaymentTotalTableShow"
              ref="paymentTotalReportTableRef2"
              :payment-totals="paymentTotals"
            />
          </div>

          <div class="revenue-total-wrapper">
            <div class="sales-total-wrapper__header">
              <div class="sales-total-wrapper__header-items">
                <div
                  ref="sales_total_report_title_ref3"
                  class="table-sales-title"
                >
                  <h3 class="table-sales-title__text">
                    {{ report_revenue_total_detail_title }}
                  </h3>
                  <span class="based-text">({{ $t('report-total.based-on-prepaid-goods-deduction') }})</span>
                </div>
              </div>
            </div>
            <sales-total-detail-table-by-staff
              ref="sales_total_detail_report_ref3"
              :key="is_modal_detail_shown"
              :is-revenue-total="true"
              :sales_total_detail="sales_total_detail_filtered"
              :is-point-deduction-included="table_filter.isPointDeductionIncluded"
            />
          </div>

          <div class="sales-by-service-wrapper">
            <h3
              ref="sales_by_service_title_ref4"
              class="table-title"
            >
              {{ report_sales_by_service_title }}
            </h3>
            <div class="col sales-by-staff-page__hide-sales-by-service-checkbox">
              <b-form-checkbox v-model="isHideSalesByService">
                {{ $t('report.hide') }}
              </b-form-checkbox>
            </div>
          </div>

          <aha-table
            v-if="!isHideSalesByService"
            ref="report_table_service_ref4"
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
                    {{ $t('report-total.service-deduction') }}
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
                  v-for="(item, i) in tableSalesByService"
                  :key="i"
                  class="table-row"
                >
                  <td
                    :class="{ 'sales-by-item-page__total': i === tableSalesByService.length - 1 }"
                    class="category-name td--text-left"
                  >
                    {{ formatName(item.fields.category_name) }}
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

          <div class="sales-history">
            <div class="sales-history-wrapper">
              <h3
                ref="sales_history_title_ref"
                class="table-title"
              >
                {{ salesHistoryTitle }}
              </h3>
              <div
                class="d-none d-md-block table-result"
                v-html="totalRecordsText"
              />
              <div class="filter d-flex justify-content-between align-items-center">
                <div class="filter-group">
                  <div class="filter-group__items">
                    <label>{{ $t('sales-invoice-tab.items') }}</label>
                    <select-multi-sales-item-type
                      ref="select_multi_sales_item_type"
                      v-model="itemTypes"
                      @input="onInputItemTypes"
                      @mouseleave-event="onMouseLeaveBlurItemTypes"
                    />
                  </div>

                  <div class="filter-group__items payment-method view-pc">
                    <label>{{ $t('sales-invoice-tab.payment-method') }}</label>
                    <b-form-select
                      v-model="salesHistoyFilter.payment_method_id"
                      :options="paymentOptions"
                      value-field="id"
                      text-field="name"
                      @change="onChangePaymentMethod"
                    >
                      <template #first>
                        <option :value="allPaymentMethodValue">
                          {{ $t('general.all') }}
                        </option>
                      </template>
                    </b-form-select>
                  </div>

                  <div class="filter-group__items payment-method view-mobile">
                    <label>{{ $t('sales-invoice-tab.payment-method') }}</label>
                    <b-form-select
                      v-model="salesHistoyFilter.payment_method_id"
                      :options="paymentOptions"
                      value-field="id"
                      text-field="name"
                      @change="onChangePaymentMethod"
                    >
                      <template #first>
                        <option :value="allPaymentMethodValue">
                          {{ $t('general.all') }}
                        </option>
                      </template>
                    </b-form-select>
                  </div>
                </div>
              </div>
            </div>
            <aha-button-print-report
              class="button-print"
              @click="onClickPrintReportSalesHistory"
            />
          </div>

          <!-- BEGIN TABLE -->
          <div
            ref="saleHistoryRef"
            class="table"
          >
            <sales-table
              :is_readonly="true"
              :is-sales-by-staff="true"
              :is-readonly-can-click-view-sale="true"
              :is_show_client_name="true"
              :custom_sales_data="sales_data"
              :is_connect_client_to_sales="true"
              :mobile_header_text="totalRecordsText"
              :is-show-deleted="payload.include_deleted"
              :is-show-selected="false"
              :is-from-sales-total-by-staff="true"
              @change-page="onChangePage"
              @show-deleted="onShowDeleted"
              @sales-added="reloadSalesHistoriesAsync"
              @sales-edited="reloadSalesHistoriesAsync"
              @refund-added="reloadSalesHistoriesAsync"
              @sales-deleted="reloadSalesHistoriesAsync"
              @updated-notes="reloadSalesHistoriesAsync"
              @refund-deleted="reloadSalesHistoriesAsync"
              @sales-transfer-added="reloadSalesHistoriesAsync"
            />
          </div>

          <div
            v-if="isShowSalesTransferHistory"
            class="sales-transfer-history-wrapper"
          >
            <div class="d-flex align-items-center justify-content-between w-100">
              <div class="sales-transfer-history-title">
                <h3
                  ref="sales_transfer_history_title_ref"
                  class="table-title"
                >
                  {{ salesTransferHistoryTitle }}
                </h3>
                <div
                  class="table-result"
                  v-html="totalRecordsSaleTransferHistoryText"
                />
              </div>

              <aha-button-print-report
                v-if="isShowSalesTransferHistory"
                @click="onClickPrintReportSalesTransferHistory"
              />
            </div>
          </div>
          <div
            v-if="isShowSalesTransferHistory"
            class="sales-transfer-table-wrapper"
          >
            <sales-transfer-table
              :is-show-result-text="true"
              :total-items="tableTransferData.pagination.total_items"
            >
              <template #tableHistory>
                <view-table
                  :data="tableTransferData"
                  @change-page="changeSalesTransferHistoryPage"
                >
                  <template
                    slot="transferDate"
                    slot-scope="{row}"
                  >
                    {{ row.transferDateTimeTS | formatUTCDate }}
                  </template>

                  <template
                    slot="type"
                    slot-scope="{row}"
                  >
                    {{ checkDeductionType(row.staffSalesTransferHistoryType) }}
                  </template>

                  <template
                    slot="prepaidGoodsSalesStaff"
                    slot-scope="{row}"
                  >
                    <p>{{ row.oldStaffName }}</p>
                    <span
                      v-if="isShowShopNameOfPrepaidGoodsStaff(row)"
                      class="text-primary"
                    >{{ row.oldStaffShopName ?
                      '(' + row.oldStaffShopName + ')' : '' }}</span>
                  </template>

                  <template
                    slot="serviceStaff"
                    slot-scope="{row}"
                  >
                    <p>{{ row.newStaffName }}</p>
                    <span
                      v-if="isShowShopNameOfServiceStaff(row)"
                      class="text-primary"
                    >{{ row.newStaffShopName ? '(' +
                      row.newStaffShopName + ')' : '' }}</span>
                  </template>

                  <template
                    slot="amount"
                    slot-scope="{row}"
                  >
                    {{ row.amount | formatNumber(0) }}
                  </template>

                  <template
                    slot="notes"
                    slot-scope="{row}"
                  >
                    <a-note-with-tooltip
                      :value="row.notes"
                      :content-tooltip="getContentTooltip(row.notes)"
                      boundary="vgt-responsive"
                      custom-class="sales-transfer-history__tooltip"
                      placement="'left'"
                      container="sales-transfer-id"
                    />
                  </template>
                  <template
                    v-if="row.salesId"
                    slot="view"
                    slot-scope="{row}"
                  >
                    <aha-button @click="() => viewDetail(row)">
                      {{ $t('general.view') }}
                    </aha-button>
                  </template>
                </view-table>
              </template>
            </sales-transfer-table>
          </div>

          <sales-detail
            v-if="isVisibleSalesDetailDialog"
            :visible="isVisibleSalesDetailDialog"
            :is-view-sales-transfer-history="true"
            :is-view-sales-by-staff="true"
            @hidden="handleHiddenSalesDetail"
          />
        </div>
      </div>

      <aha-report-description
        v-if="!isStaffMode"
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

    <report-print-preview-with-worker-modal
      :is-error="isWorkerErrorMixin"
      :pdf-blob-url="pdfBlobUrlMixin"
      :is-processing="!isWorkerDoneMixin"
      :modal-id="reportPrintPreviewModal"
      :percentage="progressPercentageMixin"
      :is-landscape="isLandscapePrintContentMixin"
      @hide="onHidePreviewModalMixin"
      @on-click-retry="onClickPrintReport"
      @on-click-save-as-pdf="onClickSaveAsPdfMixin(reportName)"
      @on-click-save-as-excel="onClickSaveAsExcelMixin(reportName)"
    />
  </main>
</template>

<script>

const SALES_BY_STAFF_REPORT_PRINT = 1
const SALES_TOTAL_DEATAIL_REPORT_PRINT = 2

// Utils
import {
  convertTimeStampToDate,
  formatDateLocalized,
  formatMoney,
  formatMonthAndDateLocalized,
  getTypeNameOfArray,
  moveElement,
} from 'CommonHelpers'
import { isPermissionGranted } from 'PermissionHelpers'

import {
  getDiffDateRange,
  getEndOfTimezoneDateTS,
  getStartOfTimezoneDateTS,
} from 'DatetimeHelpers'

import { excel_cells, setCellAlignment, setRowStyles } from 'Utils/report-export-excel.js'
import moment from 'moment'
import i18n from 'Translate'
import ExcelJS from 'exceljs'
import { cloneDeep } from 'lodash'
import { saveAs } from 'file-saver'
import { mapActions, mapMutations } from 'vuex'
import { ApiError } from 'HTTPHelpers'
import { checkDeductionType } from 'Utils/format-data.js'
import {
  displayDataDetailSalesTotal,
  displayDataNoSalesAndAmountPerSale,
} from 'Utils/report-sales-total.js'

// API
import ReportApi from 'API/sales/report-api'
import SalesApi from 'API/sales/sales-api.js'

// Mixins
import StaffMixin from 'Mixins/staff-mixin.js'
import SalesMixin from 'Mixins/sales-mixin.js'
import DeviceMixin from 'Modules/device/mixins/device'
import SalesReportMixin from 'Mixins/sales-report-mixin.js'
import PrintPreviewMixin from 'Mixins/print-preview-mixin.js'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import InputDateRangeMixin from 'Mixins/input-date-range-mixin.js'
import SalesTransferMixin from 'Modules/sales-transfer-history/mixins/sales-transfer-mixin.js'

// Constant
import { options } from 'OptionsHelpers'
import print_options from 'Options/print-options.js'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'
import {
  DISPLAY_TYPE,
  ENVIRONMENT,
  PERMISSION_TYPE,
  PRINT_PREVIEW_WORKER_ACTION_TYPES,
  SALES_ENUMS,
  SALES_TRANSFER,
  USER_ACCOUNT_ACTIONS,
  USER_ROLES,
} from 'Constant'

// Components
import AhaTable from 'CommonComponents/aha-table/aha-table.vue'
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import AhaButton from 'Components/common/aha-button/aha-button.vue'
import SalesTable from 'Components/sales/sales-table/sales-table.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import SalesDetail from 'Components/sales/sales-detail/sales-detail.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SalesTotalHeader from 'Components/sales/sales-total/sales-total-header.vue'
import GrandTotalTable from 'Components/sales/grand-total-table/grand-total-table.vue'
import ANoteWithTooltip from 'Modules/aha/a-note-with-tooltip/a-note-with-tooltip.vue'
import AhaButtonPrintReport from 'CommonComponents/aha-button/aha-button-print-report.vue'
import AhaReportDescription
  from 'CommonComponents/aha-report-description/aha-report-description.vue'
import ClientInformationModal
  from 'Components/clients/client-information/client-information-modal.vue'
import PrepaidGoodsSalesTable
  from 'Components/sales/prepaid-goods-sales-table/prepaid-goods-sales-table.vue'
import SalesPaymentTotalTable
  from 'Components/sales/sales-payment-total-table/sales-payment-total-table.vue'
import ReportPrintPreviewModal
  from 'CommonComponents/report-print-preview-modal/report-print-preview-modal.vue'
import SelectMultiSalesItemType
  from 'CommonComponents/form/select/select-multi-sales-item-type/select-multi-sales-item-type.vue'
import InputDateRangeByDateType
  from 'CommonComponents/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import SalesTotalDetailTableByStaff
  from 'Components/sales/sales-total-detail-table-by-staff/sales-total-detail-table-by-staff.vue'
import InputDateRangeByDateTypes
  from 'CommonComponents/form/input/input-date-range-by-date-types/input-date-range-by-date-types.vue'
import ReportPrintPreviewWithWorkerModal
  from 'CommonComponents/report-print-preview-with-worker-modal/report-print-preview-with-worker-modal.vue'
import SalesTransferTable
  from 'Modules/sales-transfer-history/components/sales-transfer-history/components/sales-transfer-table/sales-transfer-table.vue'

// Viewmodels
import SalesBriefViewModel from 'ViewModels/sales/sales/sales-brief-view-model'
import SalesTransferViewModel from 'Modules/view-model/sales-transfer/sales-transfer-view-model'

const GOODS = ['products', 'services']
const PREPAID_GOODS = ['prepaid_cards', 'prepaid_services']
const ALL_STAFF = -1
const ALL_PAYMENT_METHOD_VALUE = -1
const NOT_SELECT_STAFF = 0
const NOT_SELECT_STAFF_INFO = { staff_id: 0, staff_name: 'NONE' }
const DEFAULT_NUMBER_PAGE = 1
const ADDITIONAL_PAYMENT_METHOD_IDS = {
  LP: {
    VALLUE: 'LP',
    ENUM:   sales_options.deduction_type.loyalty_point,
  },

  PS: {
    VALLUE: 'PS',
    ENUM:   sales_options.deduction_type.prepaid_service,
  },

  PC: {
    VALLUE: 'PC',
    ENUM:   sales_options.deduction_type.prepaid_card,
  },
}

const ALL = -1
const PAGE_SIZE = 10

const tableFields = [
  { field: 'salesDate', label: 'sales.sales-date', width: '110px', sortable: false, expand: true, thClass: 'sales-transfer-history__sales-date' },
  { field: 'clientName', label: 'sales.client-name', width: '10%', sortable: false, expand: true },
  { field: 'salesItem', label: 'report.sales-item', width: '25%', sortable: false, expand: true },
  { field: 'salesType', label: 'sales.sales-type', width: '5%', sortable: false, expand: true },
  { field: 'preferredStaff', label: 'sales-transfer-history.preferred-staff', width: '10%', sortable: false, expand: true },
  { field: 'salesStaff', label: 'sales-transfer-history.sales-staff', width: '10%', sortable: false, expand: true },
  { field: 'amount', label: 'sales.amount', width: '10%', sortable: false, expand: true },
  { field: 'staffSales', label: 'sales-transfer-history.staff-sales-amount', width: '10%', sortable: false, expand: true },
  { field: 'balanceDeduct', label: 'sales.balance-deduct', width: '10%', sortable: false, expand: true },
  { field: 'salesTransfer', label: 'sales-transfer-history.sales-transfer', width: '5%', sortable: false, expand: true },
  { field: 'salesDetail', label: 'sales-transfer-history.sales-detail', width: '5%', sortable: false, expand: true },
]

const tableTransferFields = [
  { field: 'transferDate', label: 'sales-transfer-history.transfer-date', width: '110px', sortable: false, expand: true, thClass: 'sales-transfer-history__sales-date' },
  { field: 'type', label: 'sales-transfer-history.type', width: '20%', sortable: false, expand: true },
  { field: 'prepaidGoodsSalesStaff', label: 'sales.prepaid-goods-sales-staff', width: '20%', sortable: false, expand: true },
  { field: 'serviceStaff', label: 'sales.service-staff', width: '20%', sortable: false, expand: true },
  { field: 'amount', label: 'sales.amount', width: '15%', sortable: false, expand: true },
  { field: 'notes', label: 'general.notes', width: '15%', sortable: false, expand: true, tdClass: 'sales-transfer-history__notes' },
  { field: 'view', label: 'general.view', width: '10%', sortable: false, expand: true },
]

export default {
  components: {
    AhaTable,
    ViewTable,
    AhaButton,
    SalesTable,
    AhaTooltip,
    SalesDetail,
    AlertConfirm,
    GrandTotalTable,
    SalesTotalHeader,
    ANoteWithTooltip,
    SalesTransferTable,
    AhaButtonPrintReport,
    AhaReportDescription,
    PrepaidGoodsSalesTable,
    SalesPaymentTotalTable,
    ClientInformationModal,
    ReportPrintPreviewModal,
    SelectMultiSalesItemType,
    InputDateRangeByDateType,
    InputDateRangeByDateTypes,
    SalesTotalDetailTableByStaff,
    ReportPrintPreviewWithWorkerModal,
  },

  extends: ComponentBase,

  mixins: [
    StaffMixin,
    SalesMixin,
    DeviceMixin,
    SalesCacheMixin,
    SalesReportMixin,
    SalesTransferMixin,
    PrintPreviewMixin('saleHistoryRef'),
    InputDateRangeMixin('table_filter', 'table_filter.date_type', 'input_date_range_by_date_type'),
  ],

  data() {
    return {
      sales_options,

      table_filter: {
        shop_id:                  0,
        to_date_ts:               getEndOfTimezoneDateTS(),
        from_date_ts:             getStartOfTimezoneDateTS(),
        staffId:                  ALL_STAFF,
        isPointDeductionIncluded: true,
        display_by_type:          DISPLAY_TYPE.CATEGORY,
        sales_item_type:          sales_options.sales_goods_type.service,

        // ui only
        to_date: {
          value: getEndOfTimezoneDateTS(),
        },
        from_date: {
          value: getStartOfTimezoneDateTS(),
        },
        date_type: common_options.date_type.date,
      },

      sales_item_type_view: sales_options.sales_goods_type.service,

      table_rows:                [],
      sales_total_detail_filter: {
        staff_id:  0,
        to_date:   {},
        from_date: {},

        // ui only
        staff_name: '',
      },
      paymentTotals: [],

      sales_total_detail:    [],
      prepaid_goods_sales:   [],
      is_modal_detail_shown: false,

      data_protection_security: {},
      searchDateRangeNumber:    0,

      print_sections:       [],
      report_printing_type: null,
      print_filter:         {
        to_date_ts:   0,
        from_date_ts: 0,
      },
      keyIndex: 0,

      isPaymentTotalTableShow: false,
      isHideSalesByService:    false,

      grand_sales_total:   {},
      staff_options:       [],
      isStaffMode:         false,
      tableSalesByService: [],

      items:         [],
      total_records: 0,

      salesHistoyFilter: {
        to_date:                 {},
        staff_id:                ALL_STAFF,
        from_date:               {},
        include_service:         true,
        include_product:         true,
        payment_method_id:       ALL_PAYMENT_METHOD_VALUE,
        include_prepaid_card:    true,
        include_prepaid_service: true,
        date_type:               common_options.date_type.date,
        deduction_type_code:     sales_options.deduction_type.none,
      },

      payload: {
        shop_id:         0,
        include_deleted: false,
        page_number:     DEFAULT_NUMBER_PAGE,
        page_size:       common_options.pagination.default,
      },

      sales_data: {
        items:      [],
        pagination: {},
      },

      client_info_id: 0,

      printFilter:    {},
      itemTypes:      [],
      paymentOptions: [],

      // Sales Transfer History
      tablePagination: {
        total_pages: 0,
        page_number: 1,
        page_size:   PAGE_SIZE,
        total_items: 0,
      },

      tableTransferPagination: {
        total_pages: 0,
        page_number: 1,
        page_size:   PAGE_SIZE,
        total_items: 0,
      },

      isEdit:                        false,
      clientInfoId:                  0,
      tableRowsData:                 [],
      newStaffValue:                 ALL,
      isAddWithData:                 false,
      tableRowsTransferData:         [],
      isVisibleSalesDetailDialog:    false,
      clientInformationModalShow:    false,
      typeValue:                     SALES_TRANSFER.TYPE.ALL,
      isShowAddSalesTransferModal:   false,
      salesTransfer:                 new SalesTransferViewModel(),
      searchInfo:                    {},
      sales_api:                     new SalesApi(),
      // Print
      // printFilter: {},
      printSalesTransferFilter:      {},
      staffSalesTransferHistoryType: SALES_TRANSFER.TYPE.ALL,
      isPrepaidGoodsSales:           false,
      isServiceSales:                false,
      searchType:                    0,
      oldStaffValue:                 ALL,

      oldStaffId:          ALL,
      newStaffId:          ALL,
      salesDetail:         null,
      salesItem:           null,
      isPrintSalesHistory: false,

      userAccountData: {},
    }
  },

  computed: {
    totalItem() {
      const total = {
        serviceQuantity:           '-',
        serviceAmount:             0,
        productQuantity:           '-',
        productAmount:             0,
        subTotal:                  0,
        prepaidCardSalesAmount:    0,
        prepaidServiceSalesAmount: 0,
        total:                     0,
      }

      for (let item of this.table_rows) {
        total.serviceAmount += item.fields.services.grand_total_amount
        total.productAmount += item.fields.products.grand_total_amount
        total.prepaidCardSalesAmount += item.fields.prepaid_cards.sales_total_amount
        total.prepaidServiceSalesAmount += item.fields.prepaid_services.sales_total_amount
        total.subTotal = total.productAmount + total.serviceAmount
        total.total = total.productAmount + total.serviceAmount + total.prepaidCardSalesAmount + total.prepaidServiceSalesAmount
      }
      return total
    },

    reportName() {
      if (this.isPrintSalesHistory) {
        return this.$t('report.sales-history-to-staff', {
          staff_name: this.translateStaffName(this.sales_total_detail_filter.staff_id, this.sales_total_detail_filter.staff_name),
        })
      } else {
        return this.$t('report.sales-transfer-to-staff', {
          staff_name: this.translateStaffName(this.sales_total_detail_filter.staff_id, this.sales_total_detail_filter.staff_name),
        })
      }
    },

    reportPrintPreviewModal() {
      return 'report-print-preview-with-worker-modal'
    },

    reportPrintPreviewSalesTransferModal() {
      return 'report-print-preview-sales-transfer-modal'
    },

    staff_text() {
      return this.$t('report.staff')
    },

    service_sales_text() {
      return this.$t('report.service-sales-for-report-sales-by-staff')
    },

    product_sales_text() {
      return this.$t('report.product-sales')
    },

    prepaid_card_text() {
      return this.$t('report.prepaid-card-sales-by-staff')
    },

    prepaid_service_text() {
      return this.$t('report.prepaid-service-sales-by-staff')
    },

    quantity_text() {
      return this.$t('general.qty')
    },

    amount_text() {
      return this.$t('general.amount')
    },

    sales_total_detail_filtered() {
      if (this.table_filter.isPointDeductionIncluded && this.sales_total_detail.length > 0) {
        this.changeSalesTotalAmount()
        moveElement(this.sales_total_detail, 8, 2)
      }
      // return this.sales_total_detail?.filter(item => item.name !== 'number-of-sales-&-amount-per-sale')
      return this.sales_total_detail
    },

    sales_total_detail_staff() {
      return this.$t('report.sales-of-staff', {
        staff_name: this.translateStaffName(this.sales_total_detail_filter.staff_id, this.sales_total_detail_filter.staff_name),
      })
    },

    sales_total_detail_period_text() {
      const dateTypeFilter = this.sales_total_detail_filter.date_type
      const toDateMoment = this.formatTimeStampToMoment(this.sales_total_detail_filter.to_date.value)
      const fromDateMoment = this.formatTimeStampToMoment(this.sales_total_detail_filter.from_date.value)

      const dateFilterText = (() => {
        if (dateTypeFilter === common_options.date_type.date) {
          return toDateMoment.format(common_options.standard_date_format.ymd)
        }

        if (dateTypeFilter === common_options.date_type.month) {
          return toDateMoment.format('YYYY-MM')
        }

        if (dateTypeFilter === common_options.date_type.date_range) {
          return `${fromDateMoment.format(common_options.standard_date_format.ymd)} ~ ${toDateMoment.format(common_options.standard_date_format.ymd)}`
        }

        return ''
      })()

      return `${this.$t('clients.period')}: ${dateFilterText}`
    },

    dateRangeCanNotExceedDays() {
      return this.$t('sales.date_range_can_not_exceed_staff_search_date_range').replace('{search-date-range}', this.searchDateRangeNumber)
    },

    dateRangeCanNotExceedMonth() {
      return this.$t('sales.date-range-can-not-exceed-months', {
        'search-date-range': this.monthNumber,
      })
    },

    report_description() {
      return [
        this.$t('report.sales-by-staff-intro-1'),
        this.$t('report.sales-by-staff-intro-2'),
        this.$t('report.sales-by-staff-intro-3'),
        this.$t('report.sales-by-staff-intro-4'),
      ]
    },

    reportStaffSaleTotalDescription() {
      return this.$t('report.staff-sales-total-description')
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

    is_sales_by_staff_report_print_type() {
      return this.report_printing_type === SALES_BY_STAFF_REPORT_PRINT
    },

    is_sales_total_detail_report_print_type() {
      return this.report_printing_type === SALES_TOTAL_DEATAIL_REPORT_PRINT
    },

    report_sales_total_detail_title() {
      return this.$t('report.sales-total-staff')
    },

    report_revenue_total_detail_title() {
      return this.$t('report.revenue-total')
    },

    report_sales_by_service_title() {
      return this.$t('report.sales-by-service')
    },

    report_prepaid_goods_sales_title() {
      return this.$t('report.prepaid-goods-sales')
    },

    report_name() {
      if (!this.isStaffMode) {
        return this.$t('report.sales-by-staff')
      }

      return this.sales_total_detail_staff
    },

    report_header_text() {
      return [
        this.report_name,
        this.date_filter_print_text,
      ]
    },

    salesTotalTableStyles() {
      return [{}, {}, { halign: 'right' }, {}, { halign: 'right' }, {}, { halign: 'right' }, {}, { halign: 'right' }, { halign: 'right' }]
    },

    revenueTotalTableStyles() {
      return [{}, {}, { halign: 'right' }, {}, { halign: 'right' }, { halign: 'right' }]
    },

    staffPaymentTotalStyles() {
      return [{}, { halign: 'right' }, { halign: 'right' }, { halign: 'right' }, { halign: 'right' }, { halign: 'right' }]
    },

    salesByStaffTableStyles() {
      return [{}, {}, {}, { halign: 'right' }, {}, { halign: 'right' }, { halign: 'right' }, {}, { halign: 'right' }, {}, {}, { halign: 'right' }]
    },

    tableSalesItemStyles() {
      return [
        { halign: 'center' },
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

    paymentTotalTitle() {
      return this.$t('report-total.sales-total-by-payment-method')
    },

    grandTotalTitle() {
      return i18n.t('report-grand-total.grand-total')
    },

    grandSalesTotal() {
      return {
        salesRevenueTotal: this.grand_sales_total.salesRevenueTotal,
        salesGrandTotal:   this.table_filter.isPointDeductionIncluded ? this.grand_sales_total.salesGrandTotalWithPointDeductionIncluded : this.grand_sales_total.salesGrandTotal,
      }
    },

    prepaidGoodsSalesTotal() {
      return this.prepaid_goods_sales.reduce((prepaidGoodsSalesTotal, prepaidGood) => {
        if (prepaidGood.name === 'sales') {
          prepaidGoodsSalesTotal += prepaidGood.fields.total.amount || 0
        }

        if (prepaidGood.name === 'refund') {
          prepaidGoodsSalesTotal -= prepaidGood.fields.total.amount || 0
        }

        return prepaidGoodsSalesTotal
      }, 0)
    },

    excelPaymentTotalRows() {
      return this.paymentTotals.map(payment => ([
        payment.paymentMethodName,
        payment.servicesPaymentAmount ? formatMoney(payment.servicesPaymentAmount, 0) : '',
        payment.productPaymentAmount ? formatMoney(payment.productPaymentAmount, 0) : '',
        payment.prepaidCardPaymentAmount ? formatMoney(payment.prepaidCardPaymentAmount, 0) : '',
        payment.prepaidServicePaymentAmount ? formatMoney(payment.prepaidServicePaymentAmount, 0) : '',
        payment.paymentAmountTotal ? formatMoney(payment.paymentAmountTotal, 0) : '',
      ]))
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

    salesHistoryTitle() {
      return this.$t('sales-invoice-tab.sales-history')
    },

    salesTransferHistoryTitle() {
      return this.$t('sales-transfer-history.sales-transfer-history')
    },

    totalRecordsText() {
      return this.$t('sales-invoice-tab.all-result',
        {
          total_records: formatMoney(this.total_records, 0),
        },
      )
    },

    totalRecordsSaleTransferHistoryText() {
      return this.$t('sales-invoice-tab.all-result',
        {
          total_records: formatMoney(this.tableTransferPagination?.total_items, 0),
        },
      )
    },

    routeQueryItemTypes() {
      return {
        [SALES_ENUMS.GOODS_TYPE.SERVICE]:         Number(this.routeQuery?.isService ?? 1),
        [SALES_ENUMS.GOODS_TYPE.PRODUCT]:         Number(this.routeQuery?.isProduct ?? 1),
        [SALES_ENUMS.GOODS_TYPE.PREPAID_CARD]:    Number(this.routeQuery?.isPCard ?? 1),
        [SALES_ENUMS.GOODS_TYPE.PREPAID_SERVICE]: Number(this.routeQuery?.isPService ?? 1),
      }
    },

    allPaymentMethodValue() {
      return ALL_PAYMENT_METHOD_VALUE
    },

    additionalPaymentMethod() {
      return [
        {
          id:   ADDITIONAL_PAYMENT_METHOD_IDS.PC.VALLUE,
          name: this.$t('sales.balance-deduction'),
        },
        {
          id:   ADDITIONAL_PAYMENT_METHOD_IDS.PS.VALLUE,
          name: this.$t('sales.service-deduction'),
        },
        {
          id:   ADDITIONAL_PAYMENT_METHOD_IDS.LP.VALLUE,
          name: this.$t('sales.points-deduction'),
        },
      ]
    },

    tableData() {
      return {
        fields:     tableFields,
        rows:       this.tableRowsData,
        pagination: this.tablePagination,
        options:    { pagination: true },
      }
    },

    tableTransferData() {
      return {
        fields:     tableTransferFields,
        rows:       this.tableRowsTransferData,
        pagination: this.tableTransferPagination,
        options:    { pagination: true },
      }
    },

    isShowSalesTransferHistory() {
      return this.tableRowsTransferData?.length > 0
    },

    initialFilter() {
      const initialFilter = {
        dateType:   parseInt(this.$route.query.dateType || 1),
        fromDateTS: parseInt(this.$route.query.fromDateTS || getStartOfTimezoneDateTS()),
        toDateTS:   parseInt(this.$route.query.toDateTS || getEndOfTimezoneDateTS()),
        fromDate:   {
          value: parseInt(this.$route.query.fromDateTS || getStartOfTimezoneDateTS()),
        },
        toDate: {
          value: parseInt(this.$route.query.fromDateTS || getEndOfTimezoneDateTS()),
        },
        newStaffId:                    parseInt(this.$route.query.staffId || ALL),
        oldStaffId:                    parseInt(this.$route.query.oldStaffId || ALL),
        staffSalesTransferHistoryType: parseInt(this.$route.query.staffSalesTransferHistoryType) || -1,
        searchType:                    parseInt(this.$route.query.searchType) || 0,

      }
      return initialFilter

    },

    salseTransferHistoryTableHeaders() {
      return [
        i18n.t('sales-transfer-history.transfer-date'),
        i18n.t('sales-transfer-history.type'),
        i18n.t('sales.prepaid-goods-sales-staff'),
        i18n.t('sales.service-staff'),
        i18n.t('sales.amount'),
        i18n.t('general.notes'),
      ]
    },

    reportHeaderText() {
      return [
        this.report_sales_history_title,
        this.dateFilterPrintText,
      ]
    },

    dateFilterPrintText() {
      if (this.printFilter.dateType === common_options.date_type.date) {
        return `(${formatDateLocalized(this.printFilter.toDateTS, this.app_language)})`
      }

      if (this.printFilter.dateType === common_options.date_type.month) {
        return `(${formatMonthAndDateLocalized(this.printFilter.toDateTS, this.app_language)})`
      }

      if (this.printFilter.dateType === common_options.date_type.date_range) {
        return `(${formatDateLocalized(this.printFilter.fromDateTS, this.app_language)} - ${formatDateLocalized(this.printFilter.toDateTS, this.app_language)})`
      }
    },

    hiddenRows() {
      return [
        'revenue-total',
        'deduction-total',
        'service-deduction',
        'number-of-sales-&-amount-per-sale',
      ]
    },

    report_sales_transfer_history_title() {
      return this.$t('report.sales-transfer-to-staff', {
        staff_name: this.translateStaffName(this.sales_total_detail_filter.staff_id, this.sales_total_detail_filter.staff_name),
      })
    },

    report_sales_history_title() {
      return this.$t('report.sales-history-to-staff', {
        staff_name: this.translateStaffName(this.sales_total_detail_filter.staff_id, this.sales_total_detail_filter.staff_name),
      })
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

    'table_filter.isPointDeductionIncluded': {
      handler(newVal) {
        localStorage.setItem('isPointDeductionIncludedByStaff', JSON.stringify(newVal))
      },
    },

    isPaymentTotalTableShow: {
      handler(newVal) {
        localStorage.setItem('isPaymentTotalTableShowByStaff', JSON.stringify(newVal))
      },
    },

    isHideSalesByService: {
      handler(newVal) {
        localStorage.setItem('isHideSalesByServiceByStaff', JSON.stringify(newVal))
      },
    },
  },

  mounted() {
    this.table_filter.isPointDeductionIncluded = JSON.parse(localStorage.getItem('isPointDeductionIncludedByStaff') || 'true')
    this.isPaymentTotalTableShow = JSON.parse(localStorage.getItem('isPaymentTotalTableShowByStaff') || 'false')
    this.isHideSalesByService = JSON.parse(localStorage.getItem('isHideSalesByServiceByStaff') || 'false')
    this.initData()
  },

  methods: {
    ...mapMutations('salesReport', [
      'setSelectedFilterDate',
    ]),

    ...mapMutations('client', [
      'resetState',
    ]),

    ...mapActions('user_account', [
      'setUserAccountActionDataAsync',
    ]),

    formatMoney,
    getTypeNameOfArray,
    checkDeductionType,

    async initData() {
      try {
        this.table_filter.shop_id = this.shop_data.shop_id
        this.preLoader()
        await this.loadEnvironmentSetup() // loadTableDataAsync need staff_search_date_range

        await this.loadPaymentsAsync()
        await this.loadStaffItemsAsync()
        await this.setDefaultFilterInputDateRangeMixin()
        await this.setDefaultFilterSelectedStaff()
        await this.loadTableDataAsync(true)
        await this.onStaffIdChange(this.table_filter.staffId)
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

        this.table_filter.staffId = this.isStaffRole
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
      if (this.isNullObject(environmentSetup)) {
        this.showMissingSalesSetupAlert()
      } else {
        this.data_protection_security = environmentSetup.data_protection_security.fields

        if (this.isManagerRole) {
          this.searchDateRangeNumber = this.data_protection_security.sales_report_and_invoices_date_range_manager_can_search
        }

        if (this.isStaffRole) {
          this.searchDateRangeNumber = this.data_protection_security.sales_report_and_invoices_date_range_staff_can_search
        }
      }
    },

    generateDefaultSalesByStaffTableWithNoData() {
      const salesByStaffInfo = {
        'staff': {
          staff_id:   null,
          staff_name: 'TOTAL',
        },
      }
      PREPAID_GOODS.forEach(item => salesByStaffInfo[item] = this.generateDefaultPrepaidGoodWithNoData())
      GOODS.forEach(item => salesByStaffInfo[item] = this.generateDefaultGoodWithNoData())
      return [{
        fields: salesByStaffInfo,
      }]
    },

    generateDefaultPrepaidGoodWithNoData() {
      return {
        sales_quantity:       '-',
        sales_total_amount:   0,
        sales_total_quantity: 0,
      }
    },

    generateDefaultGoodWithNoData() {
      return {
        sales_total_amount:   0,
        sales_total_quantity: '-',
      }
    },

    // table
    async loadTableDataAsync(isGetData) {
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

        if (errors.length > 0) {
          this._showDialogAlert(errors)
          return false
        }

        const reportApi = new ReportApi()
        const response = await reportApi.getSalesTotalByStaffReportAsync(this.table_filter)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.table_rows = isGetData ? response.data : []

        this.setPrintFilterData()
        this.setTotalSalesDetailFilter()
        return true
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onSearch() {
      const query = {
        dateType:                 this.table_filter.date_type,
        fromDateTS:               this.table_filter.from_date_ts,
        toDateTS:                 this.table_filter.to_date_ts,
        isPointDeductionIncluded: this.table_filter.isPointDeductionIncluded,
        staffId:                  this.table_filter.staffId,
      }

      if (!this.isStaffMode) await this.loadTableDataAsync(true)

      this.$router.replace({
        query,
        name: 'sales-by-staff',
      })

      if (this.isStaffMode) {
        if (this.itemTypes?.length === 0) {
          this._showDialogAlert(this.$t('sales-invoice-tab.there-must-at-least-one-item'))
          return
        }
        const currentStaffOption = this.staff_options.map(staff => ({
          staff_id:   staff.id,
          staff_name: staff.aliasname,
        }))
        const currentStaff = this.table_filter.staffId !== NOT_SELECT_STAFF ? currentStaffOption.find(staff => staff.staff_id === this.table_filter.staffId) : NOT_SELECT_STAFF_INFO
        this.table_rows = []
        const checkValidate = await this.loadTableDataAsync(false)
        if (!checkValidate) return

        const isPassedCondittion = await this.getSalesTotalByStaffReport()
        if (isPassedCondittion) {
          if (this.itemTypes?.length === 0) {
            this._showDialogAlert(this.$t('sales-invoice-tab.there-must-at-least-one-item'))
            return
          }
          this.setTotalSalesDetailFilter()
          this.onClickViewSalesTotalDetail(currentStaff)
        }
      }
    },

    async onClickViewSalesTotalDetail(staff) {
      const query = {
        dateType:                 this.table_filter.date_type,
        fromDateTS:               this.table_filter.from_date_ts,
        toDateTS:                 this.table_filter.to_date_ts,
        isPointDeductionIncluded: this.table_filter.isPointDeductionIncluded,
        staffId:                  this.table_filter.staffId,
      }

      this.$router.replace({
        query,
        name: 'sales-by-staff',
      })

      this.salesHistoyFilter.staff_id = staff.staff_id
      this.table_filter.staff_id = staff.staff_id
      this.sales_total_detail_filter.staff_id = staff.staff_id
      this.sales_total_detail_filter.staff_id = staff.staff_id
      this.sales_total_detail_filter.staff_name = staff.staff_name
      this.sales_total_detail_filter.isPointDeductionIncluded = this.table_filter.isPointDeductionIncluded
      this.loadSalesTotalDetailByStaff()
      this.tableSalesByService = this.loadSalesByService()

      this.payload = { ...this.payload, ...this.salesHistoyFilter }
      this.payload.page_number = DEFAULT_NUMBER_PAGE
      await this.loadSalesHistory()

      await this.$salesTransferMixin_loadEnvironmentSetup()
      this.searchData()
    },

    async loadSalesHistory() {
      try {
        const checkValidate = await this.loadTableDataAsync(false)
        if (!checkValidate) return

        this.resetState()
        this.payload.shop_id = this.shop_data.shop_id

        this.preSubLoad()

        await this.loadEnvironmentSetup()

        this.salesHistoyFilter.date_type = this.table_filter.date_type
        this.salesHistoyFilter.from_date.value = this.table_filter.from_date_ts
        this.salesHistoyFilter.to_date.value = this.table_filter.to_date_ts

        this.payload = { ...this.payload, ...this.salesHistoyFilter }

        await this.loadDataTableSalesHistoryAsync()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preSubLoad(false)
      }
    },

    async loadDataTableSalesHistoryAsync() {
      try {
        if (this.payload.deduction_type_code) {
          this.payload.payment_method_id = ALL_PAYMENT_METHOD_VALUE
        }

        this.preLoader()
        const salesApi = new SalesApi()
        const response = await salesApi.getSalesHistoriesLiveAsync(this.payload)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.total_records = response.data.pagination.total_items
        this.sales_data = response.data
        this.setPrintFilterDataSalesHistory(this.payload)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onShowDeleted(includeDeleted) {
      this.payload.include_deleted = includeDeleted
      this.payload.page_number = DEFAULT_NUMBER_PAGE
      const checkValidate = await this.loadTableDataAsync(false)
      if (!checkValidate) return
      await this.loadDataTableSalesHistoryAsync()
    },

    async onChangePage(pageNumber) {
      this.payload.page_number = pageNumber
      await this.loadDataTableSalesHistoryAsync()
    },

    async onInputItemTypes(itemTypes, itemTypesValue) {
      this.salesHistoyFilter.include_service = itemTypesValue.includes(options.sales_enum.goods_type.service)
      this.salesHistoyFilter.include_product = itemTypesValue.includes(options.sales_enum.goods_type.product)
      this.salesHistoyFilter.include_prepaid_card = itemTypesValue.includes(options.sales_enum.goods_type.prepaid_card)
      this.salesHistoyFilter.include_prepaid_service = itemTypesValue.includes(options.sales_enum.goods_type.prepaid_service)
      this.salesHistoyFilter.include_outstanding = itemTypesValue.includes(5)
    },

    async onMouseLeaveBlurItemTypes() {
      if (this.itemTypes?.length === 0) {
        this._showDialogAlert(this.$t('sales-invoice-tab.there-must-at-least-one-item'))
        return
      }
      await this.loadSalesHistory()
    },

    async onChangePaymentMethod(val) {
      if (val === ADDITIONAL_PAYMENT_METHOD_IDS.PC.VALLUE) {
        this.salesHistoyFilter.payment_method_id = ADDITIONAL_PAYMENT_METHOD_IDS.PC.VALLUE
        this.salesHistoyFilter.deduction_type_code = ADDITIONAL_PAYMENT_METHOD_IDS.PC.ENUM
      } else if (val === ADDITIONAL_PAYMENT_METHOD_IDS.PS.VALLUE) {
        this.salesHistoyFilter.payment_method_id = ADDITIONAL_PAYMENT_METHOD_IDS.PS.VALLUE
        this.salesHistoyFilter.deduction_type_code = ADDITIONAL_PAYMENT_METHOD_IDS.PS.ENUM
      } else if (val === ADDITIONAL_PAYMENT_METHOD_IDS.LP.VALLUE) {
        this.salesHistoyFilter.payment_method_id = ADDITIONAL_PAYMENT_METHOD_IDS.LP.VALLUE
        this.salesHistoyFilter.deduction_type_code = ADDITIONAL_PAYMENT_METHOD_IDS.LP.ENUM
      } else {
        this.salesHistoyFilter.payment_method_id = val
        this.salesHistoyFilter.deduction_type_code = sales_options.deduction_type.none
      }
      if (this.itemTypes?.length === 0) {
        this._showDialogAlert(this.$t('sales-invoice-tab.there-must-at-least-one-item'))
        return
      }
      await this.loadSalesHistory()
    },

    // sales detail by staff
    async loadSalesTotalDetailByStaff() {
      try {
        this.preLoader()
        const reportApi = new ReportApi()
        const response = await reportApi.getSalesTotalDetailByStaffReport(this.sales_total_detail_filter)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }
        this.paymentTotals = response && response.data && response.data.payment_total || []
        this.sales_total_detail = response && response.data && response.data.sales_total_detail || []
        this.grand_sales_total = response && response.data && response.data.grand_total || {}
        this.prepaid_goods_sales = response && response.data && response.data.prepaid_goods_sales || []
his.initialFilter.searchType

      this.searchInfo = {
        pageNumber:                    1,
        pageSize:                      PAGE_SIZE,
        shopId:                        this.shop_data.shop_id,
        dateType:                      this.initialFilter.dateType,
        toDateTS:                      this.initialFilter.toDateTS,
        fromDateTS:                    this.initialFilter.fromDateTS,
        staffId:                       this.initialFilter.newStaffId,
        searchType:                    this.initialFilter.searchType,
        staffSalesTransferHistoryType: this.initialFilter.staffSalesTransferHistoryType,
      }

      const query = this.$route.query
      this.searchInfo.pageNumber = 1
      this.searchInfo.dateType = Number(query?.dateType || common_options.date_type.date)
      this.searchInfo.fromDateTS = Number(query?.fromDateTS || getStartOfTimezoneDateTS())
      this.searchInfo.toDateTS = Number(query?.toDateTS || getEndOfTimezoneDateTS())
      this.searchInfo.searchType = this.searchType
      this.searchInfo.staffSalesTransferHistoryType = this.staffSalesTransferHistoryType
      this.searchInfo.staffId = this.table_filter.staffId

      await this.loadSalesTransferList()
    },

    async loadSalesTransferList() {
      try {
        this.preLoader()
        const result = await SalesTransferViewModel.getSalesTransferHistoryTotalList(this.searchInfo)
        this.tableRowsTransferData = result.items
        this.tableTransferPagination = result.pagination
        this.printSalesTransferFilter = { ...this.searchInfo, totalItems: result.pagination.total_items }

        if (!(this.newStaffValue === ALL && this.oldStaffValue === ALL)) {
          this.newStaffId = this.table_filter.staffId
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async changeSalesTransferHistoryPage(page) {
      this.tableTransferPagination.page_number = page
      this.searchInfo.pageNumber = page

      await this.loadSalesTransferList()
    },

    setTotalSalesDetailFilter() {
      const clonedTableFitlerData = cloneDeep(this.table_filter)
      this.sales_total_detail_filter = {
        ...this.sales_total_detail_filter,
        shop_id:   clonedTableFitlerData.shop_id,
        to_date:   clonedTableFitlerData.to_date,
        from_date: clonedTableFitlerData.from_date,
        date_type: clonedTableFitlerData.date_type,
      }
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
        return this.$t('report.no-input')
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

    formatTimeStampToMoment(dateTs) {
      return moment.utc(convertTimeStampToDate((dateTs)))
    },

    displayDataSalesByStaff(value) {
      if (value === '-') {
        return value
      }

      if (!this.isZero(value)) {
        return this.formatMoney(value, 0)
      }

      return ''
    },

    translateStaffName(staffId, staffName) {
      if (staffId === 0) {
        return this.$t('report.no-input')
      }

      return staffName
    },

    // print
    setPrintSections() {
      const tempPrintSections = []

      const salesTotalTableDom = this.$refs?.sales_total_detail_report_ref1?.$el
      const paymentTableDom = this.$refs?.paymentTotalReportTableRef2?.$el
      const revenueTotalTableDom = this.$refs?.sales_total_detail_report_ref3?.$el
      const serviceTableDom = this.$refs?.report_table_service_ref4?.$el
      if (this.isStaffMode) {
        if (this.isPaymentTotalTableShow) {
          tempPrintSections.push(
            {
              ref_type: print_options.print_ref_type.text,

              section_excel_text: '',
              section_ref:        this.$refs.sales_total_report_title_ref1,
              alignment:          print_options.text_ref_type_alignment.left,
            },

            {
              ref_type: print_options.print_ref_type.table,

              customStyles: this.salesTotalTableStyles,
              section_ref:  salesTotalTableDom.getElementsByTagName('table')[0],
            },

            {
              ref_type:     print_options.print_ref_type.table,
              customStyles: this.staffPaymentTotalStyles,
              section_ref:  paymentTableDom.getElementsByTagName('table')[0],
            },

            {
              ref_type: print_options.print_ref_type.text,

              section_excel_text: '',
              alignment:          print_options.text_ref_type_alignment.left,
              section_ref:        this.$refs.sales_total_report_title_ref3,
            },
            {
              ref_type:     print_options.print_ref_type.table,
              customStyles: this.revenueTotalTableStyles,
              section_ref:  revenueTotalTableDom.getElementsByTagName('table')[0],
            },

          )
        } else {
          tempPrintSections.push(
            {
              ref_type: print_options.print_ref_type.text,

              section_excel_text: '',
              section_ref:        this.$refs.sales_total_report_title_ref1,
              alignment:          print_options.text_ref_type_alignment.left,
            },

            {
              ref_type: print_options.print_ref_type.table,

              customStyles: this.salesTotalTableStyles,
              section_ref:  salesTotalTableDom.getElementsByTagName('table')[0],
            },

            {
              ref_type: print_options.print_ref_type.text,

              section_excel_text: '',
              alignment:          print_options.text_ref_type_alignment.left,
              section_ref:        this.$refs.sales_total_report_title_ref3,
            },
            {
              ref_type:     print_options.print_ref_type.table,
              customStyles: this.revenueTotalTableStyles,
              section_ref:  revenueTotalTableDom.getElementsByTagName('table')[0],
            },
          )
        }

        if (!this.isHideSalesByService) {
          tempPrintSections.push(
            {
              ref_type: print_options.print_ref_type.text,

              section_excel_text: '',
              alignment:          print_options.text_ref_type_alignment.left,
              section_ref:        this.$refs.sales_by_service_title_ref4,
            },

            {
              ref_type:     print_options.print_ref_type.table,
              customStyles: this.tableSalesItemStyles,
              section_ref:  serviceTableDom.getElementsByTagName('table')[0],
            },
          )
        }
      }

      if (!this.isStaffMode) {
        tempPrintSections.push(
          {
            ref_type: print_options.print_ref_type.table,

            customStyles: this.salesByStaffTableStyles,
            section_ref:  this.$refs.report_table_ref && this.$refs.report_table_ref.$el.getElementsByTagName('table')[0],
          },
        )
      }
      this.print_sections = tempPrintSections
    },

    onClickPrintReportSalesTransferHistory() {
      this.isPrintSalesHistory = false
      if (this.isNotAllowed && this.isStaffRole) {
        this._showDialogAlert(this.$t('sales.date-range-not-allowed'))
        return
      }
      this.reportType = PRINT_PREVIEW_WORKER_ACTION_TYPES.SALES_TRANSFER_STAFF_HISTORY
      this.showDialogById(this.reportPrintPreviewModal)
      const reportHeaders = [
        this.report_sales_transfer_history_title,
        this.dateFilterPrintText,
      ]

      const requestPayload = {
        shopId:     this.printSalesTransferFilter.shopId,
        pageNumber: this.printSalesTransferFilter.pageNumber,
        staffId:    this.table_filter.staffId,
        fromDateTS: this.table_filter.from_date_ts,
        toDateTS:   this.table_filter.to_date_ts,
        pageSize:   this.printSalesTransferFilter.pageSize,
        totalItems: this.printSalesTransferFilter.totalItems,
      }
      this.postMessageToPrintPreviewWorkerMixin({
        reportHeaders:     reportHeaders,
        requestPayload:    requestPayload,
        tableHeaders:      this.salseTransferHistoryTableHeaders,
        additionalOptions: {
          shopId: this.shop_data.shop_id,
        },
        workerType: PRINT_PREVIEW_WORKER_ACTION_TYPES.SALES_TRANSFER_STAFF_HISTORY,
      })
    },

    onClickPrintReportSalesHistory() {
      this.isPrintSalesHistory = true
      this.showDialogById(this.reportPrintPreviewModal)
      const data = {
        requestPayload: this.printFilter,
        reportHeaders:  this.reportHeaderText,
        workerType:     PRINT_PREVIEW_WORKER_ACTION_TYPES.SALES_HISTORY,
      }

      this.postMessageToPrintPreviewWorkerMixin(data)
    },

    onClickPrintReport() {
      this.report_printing_type = SALES_BY_STAFF_REPORT_PRINT
      this.onPrint()
    },

    onClickPrintReportSalesTotalDetail() {
      this.report_printing_type = SALES_TOTAL_DEATAIL_REPORT_PRINT
      this.onPrint()
    },

    onPrint() {
      this.$nextTick(() => {
        this.setPrintSections()
        this.showDialogById(this.reportPrintPreviewModalId)
      })
    },

    setPrintFilterDataSalesHistory(params) {
      this.printFilter = {
        shopId:                this.payload.shop_id,
        totalItems:            this.total_records,
        staffId:               this.payload.staff_id,
        dateType:              this.payload.date_type,
        pageSize:              this.payload.page_size,
        pageNumber:            this.payload.page_number,
        toDateTS:              this.payload.to_date.value,
        fromDateTS:            this.payload.from_date.value,
        paymentMethodId:       params.payment_method_id,
        deductionTypes:        params.deduction_type_code,
        includeService:        this.payload.include_service,
        includeProduct:        this.payload.include_product,
        includeDeleted:        this.payload.include_deleted,
        includePrepaidCard:    this.payload.include_prepaid_card,
        includePrepaidService: this.payload.include_prepaid_service,
      }
    },

    setPrintFilterData() {
      this.print_filter = cloneDeep(this.table_filter)
    },

    showRow(row) {
      if (this.hiddenRows.includes(row.name) ||
        (row.name === 'points-deduction' && !row.fields.service.quantity && !row.fields.product.quantity && !row.fields.prepaid_card.quantity && !row.fields.prepaid_service.quantity && !this.table_filter.isPointDeductionIncluded) ||
        (row.name === 'balance-deduction' && !row.fields.prepaid_service.quantity)) {
        return false
      }
      return true
    },

    async saveReportAsExcel({ file_name, print_date, header_text }) {
      // excel rows, cols start at 1

      // workbook
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet(this.report_name)
      ws.properties.defaultColWidth = 25

      // worksheet title
      const rowTitle = ws.addRow([header_text[0]])
      rowTitle.font = { bold: true, size: 16 }

      const rowSubTitle = ws.addRow([header_text[1]])
      rowSubTitle.font = { bold: true, size: 14 }
      if (!this.isStaffMode) {
        const tableHeaders = [
          this.staff_text,
          `${this.$t('payroll.sales')}/${this.$t('report.deduction')}`,
          this.service_sales_text,
          '',
          this.product_sales_text,
          '',
          `${this.$t('report.sub-total')}\r\n(A + B)`,
          this.prepaid_card_text,
          '',
          this.prepaid_service_text,
          '',
          `${this.$t('general.total')}\r\n(A + B + C + D)`,
        ]

        // set print sections to excel
        ws.addRow() // for spacing
        this.setTableSectionSalesReportToExcel(ws, tableHeaders)
        // insert Sales By Staff table data
        this.setSalesByStaffDataToExcelTable(ws, tableHeaders, this.table_rows)
      } else {
        const salesTotalFilterTableData = ['sale', 'refund', 'points-deduction', 'prepaid-service', 'sales-total', 'balance-deduction']
        const salesTotalTableDataExcel = this.sales_total_detail_filtered.filter(item => salesTotalFilterTableData.includes(item.name))

        let totalFieldsShowOnExcel = (() => {
          const validFields = salesTotalTableDataExcel.map(item => {
            if (this.showRow(item)) {
              return item
            }

            return null
          }).filter(item => item !== null)

          return validFields
        })()

        // if data has balance-deduction, move it to the last row
        const isContainBalanceDeduction = totalFieldsShowOnExcel.some(item => item.name === 'balance-deduction')
        if (isContainBalanceDeduction && totalFieldsShowOnExcel[totalFieldsShowOnExcel.length - 1].name !== 'balance-deduction') {
          const filterItem = totalFieldsShowOnExcel.filter(item => item.name === 'balance-deduction')
          filterItem[0].fields.service.quantity = 0
          filterItem[0].fields.service.amount = 0
          filterItem[0].fields.product.quantity = 0
          filterItem[0].fields.product.amount = 0
          filterItem[0].fields.prepaid_card.quantity = 0
          filterItem[0].fields.prepaid_card.amount = 0
          totalFieldsShowOnExcel = totalFieldsShowOnExcel.filter(item => item.name !== 'balance-deduction')
          totalFieldsShowOnExcel.push(...filterItem)
        }

        const salesTotalTableHeaders = [
          this.$t('general.type'),
          this.$t('report.service'),
          '',
          this.$t('report.product'),
          '',
          this.$t('report.prepaid-card'),
          '',
          this.$t('report.prepaid-service'),
          '',
          this.$t('report-total.total'),
        ]

        // set print sections to excel
        ws.addRow() // for spacing
        const reportSalesTotalTitleRow = ws.addRow([this.report_sales_total_detail_title + ' (' + this.$t('report-total.based-on-prepaid-goods-sales') + ')'])
        reportSalesTotalTitleRow.font = { bold: true, size: 13 }
        this.setTableSectionToExcel(ws, salesTotalTableHeaders, 'sales')
        // insert Sales Total table data
        this.setSalesTotalDataToExcelTable(ws, salesTotalTableHeaders, totalFieldsShowOnExcel)

        if (this.isPaymentTotalTableShow) {
          ws.addRow()
          const paymentTotalTableHeaders = [
            this.$t('sales.payment-method'),
            this.$t('report.service'),
            this.$t('report.product'),
            this.$t('report-total.prepaid-card'),
            this.$t('report-total.prepaid-service'),
            this.$t('report-total.total'),
          ]

          const cellsHeaderRow = ws.addRow(paymentTotalTableHeaders)
          cellsHeaderRow.font = { bold: true, size: 12 }
          setRowStyles(ws, paymentTotalTableHeaders.length, cellsHeaderRow.number, true)

          if (this.paymentTotals.length == 0) {
            const contentRow = ws.addRow([this.$t('general.no-data-for-table')])
            this.mergeCells(ws, contentRow, 0, cellsHeaderRow._cells.length - 1)
            setRowStyles(ws, paymentTotalTableHeaders.length, contentRow.number)

          } else {
            this.excelPaymentTotalRows.forEach(row => {
              const contentRow = ws.addRow(row)
              setRowStyles(ws, paymentTotalTableHeaders.length, contentRow.number, false, this.staffPaymentTotalStyles)
            })
          }
        }
        ws.addRow()

        const revenueTableHeaders = [
          this.$t('general.type'),
          this.$t('report.service'),
          '',
          this.$t('report.product'),
          '',
          this.$t('report-total.total'),
        ]

        const revenueTotalFilterTableData = ['sale', 'refund', 'points-deduction', 'prepaid-service', 'deduction-total']
        const reportRevenueTotalTitleRow = ws.addRow([this.report_revenue_total_detail_title + ' (' + this.$t('report-total.based-on-prepaid-goods-deduction') + ')'])
        reportRevenueTotalTitleRow.font = { bold: true, size: 13 }
        this.setTableSectionToExcel(ws, revenueTableHeaders, 'revenue')
        const revenueTotalTableDataExcel = this.sales_total_detail_filtered.filter(item => !revenueTotalFilterTableData.includes(item.name))
        this.setRevenueTotalDataToExcelTable(ws, revenueTableHeaders, revenueTotalTableDataExcel)

        if (!this.isHideSalesByService) {
          ws.addRow()
          const salesByServiceTableHeaders = [
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

          const reportSalesByServiceTitleRow = ws.addRow([this.report_sales_by_service_title])
          reportSalesByServiceTitleRow.font = { bold: true, size: 13 }
          this.setTableSalesByServiceDataToExcelTable(ws, salesByServiceTableHeaders, this.tableSalesByService)
          // this.setSalesByServiceDataToExcelTable(ws, salesByServiceTableHeaders, this.tableSalesByService)
        }
      }

      // Add date/time at bottom right
      let maxColumns = 0
      if (!this.isStaffMode) {
        // Non-staff mode: tableHeaders has 12 columns
        maxColumns = 12
      } else {
        // Staff mode: calculate max from all table headers
        // salesTotalTableHeaders: 10, revenueTableHeaders: 6, paymentTotalTableHeaders: 6, salesByServiceTableHeaders: 10
        maxColumns = Math.max(
          10, // salesTotalTableHeaders.length
          6, // revenueTableHeaders.length
          this.isPaymentTotalTableShow ? 6 : 0, // paymentTotalTableHeaders.length
          !this.isHideSalesByService ? 10 : 0, // salesByServiceTableHeaders.length
        )
      }
      const dateRow = [...new Array(maxColumns - 1).fill(''), print_date]
      const dateRowAdded = ws.addRow(dateRow)
      const dateCellAddress = `${excel_cells[maxColumns - 1]}${dateRowAdded.number}`
      setCellAlignment(dateCellAddress, ws, 'right')
      ws.getCell(dateCellAddress).font = { italic: true, color: { argb: 'FF808080' } }

      // Save
      const buf = await wb.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `${file_name}.xlsx`)
    },

    getColumnIndexsNotBeMerged() {
      let columnIndexsNotBeMerged = []
      columnIndexsNotBeMerged = [0, 7, 8, 9]
      return columnIndexsNotBeMerged
    },

    setTableSalesByServiceDataToExcelTable(ws, excelTableHeaders = [], excelTableRows = []) {
      // Table header
      const cellsHeaderRow = ws.addRow(excelTableHeaders)
      cellsHeaderRow.height = 30
      cellsHeaderRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, cellsHeaderRow.number, true)

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

          const excelColumnStartMerging = excel_cells[startColumnToMerge]
          let excelColumnEndMerging = excel_cells[startColumnToMerge + 1]

          ws.getColumn(excelColumnStartMerging).width = 15
          ws.getColumn(excelColumnEndMerging).width = 15
          cellAddressBeMerged = `${excelColumnStartMerging}${cellsHeaderRow.number}:${excelColumnEndMerging}${cellsHeaderRow.number}`
          startColumnToMerge += 2
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
          temp[0].halign = 'center'
          setRowStyles(ws, excelTableHeaders.length, ws_row.number, false, temp)
        } else {
          setRowStyles(ws, excelTableHeaders.length, ws_row.number, false, this.tableSalesItemStyles)
        }
      })
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

    getExcelRowDataByViewType(item) {
      const rowData = []
      rowData.push(this.formatName(item.fields.category_name))

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

      return rowData
    },

    setTableSectionToExcel(ws, excelTableHeaders = [], tableName) {
      // Table header
      const cellsHeaderRow = ws.addRow(excelTableHeaders)
      cellsHeaderRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, cellsHeaderRow.number, true)

      let startColumnToMerge = null
      const excelTableSubHeaders = []
      for (let i = 0; i < excelTableHeaders.length; i++) {
        let cellAddressBeMerged = null
        const subHeaderMap = (() => {
          if (tableName === 'sales') {
            return i === 0 || i === 9
          }
          if (tableName === 'revenue') {
            return i === 0 || i === 5
          }

          return i === 0
        })()
        if (subHeaderMap) {
          // first column will be merged cell in rows
          excelTableSubHeaders.push('')

        } else if (excelTableHeaders[i] !== '') {
          if (!startColumnToMerge) {
            startColumnToMerge = i
          }

          excelTableSubHeaders.push(this.quantity_text)
          excelTableSubHeaders.push(this.amount_text)

          const excelColumnStartMerging = excel_cells[startColumnToMerge]
          const excelColumnEndMerging = excel_cells[startColumnToMerge + 1]
          ws.getColumn(excelColumnStartMerging).width = 15
          ws.getColumn(excelColumnEndMerging).width = 15
          cellAddressBeMerged = `${excelColumnStartMerging}${cellsHeaderRow.number}:${excelColumnEndMerging}${cellsHeaderRow.number}`
          startColumnToMerge += 2 // Merge 2 cell each times
        }

        if (cellAddressBeMerged) {
          // Merge header cells
          ws.mergeCells(cellAddressBeMerged)
        }
      }

      const subHeadersRow = ws.addRow(excelTableSubHeaders)
      subHeadersRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, subHeadersRow.number, true)

      // Merge first header column
      ws.mergeCells(`${excel_cells[0]}${cellsHeaderRow.number}:${excel_cells[0]}${cellsHeaderRow.number + 1}`)
      if (tableName === 'sales') {
        ws.mergeCells(`${excel_cells[9]}${cellsHeaderRow.number}:${excel_cells[9]}${cellsHeaderRow.number + 1}`)
      } else if (tableName === 'revenue') {
        ws.mergeCells(`${excel_cells[5]}${cellsHeaderRow.number}:${excel_cells[5]}${cellsHeaderRow.number + 1}`)
      }
    },
    setTableSectionSalesReportToExcel(ws, excelTableHeaders = []) {
      // Table header
      const cellsHeaderRow = ws.addRow(excelTableHeaders)
      cellsHeaderRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, cellsHeaderRow.number, true)

      // let startColumnToMerge = null
      const excelTableSubHeaders = []
      const excelHeaderCharacter = ['A', 'B', 'C', 'D']
      let count = 0
      for (let i = 0; i < excelTableHeaders.length; i++) {
        let cellAddressBeMerged = null
        if (i === 0 || i === 1 || i === 6 || i === 11) {
          // first column will be merged cell in rows
          excelTableSubHeaders.push('')
        } else if (excelTableHeaders[i] !== '') {
          // if (!startColumnToMerge) {
          //   startColumnToMerge = i
          // }

          excelTableSubHeaders.push(this.quantity_text)
          excelTableSubHeaders.push(`${this.amount_text}(${excelHeaderCharacter[count]})`)
          count++

          const excelColumnStartMerging = excel_cells[i]
          const excelColumnEndMerging = excel_cells[i + 1]
          ws.getColumn(excelColumnStartMerging).width = 15
          ws.getColumn(excelColumnEndMerging).width = 15
          cellAddressBeMerged = `${excelColumnStartMerging}${cellsHeaderRow.number}:${excelColumnEndMerging}${cellsHeaderRow.number}`
          // startColumnToMerge += 2 // Merge 2 cell each times
        }

        if (cellAddressBeMerged) {
          // Merge header cells
          ws.mergeCells(cellAddressBeMerged)
        }
      }

      const subHeadersRow = ws.addRow(excelTableSubHeaders)
      subHeadersRow.font = { bold: true, size: 12 }
      setRowStyles(ws, excelTableHeaders.length, subHeadersRow.number, true)

      // Merge first header column
      ws.mergeCells(`${excel_cells[0]}${cellsHeaderRow.number}:${excel_cells[0]}${cellsHeaderRow.number + 1}`)
      ws.mergeCells(`${excel_cells[1]}${cellsHeaderRow.number}:${excel_cells[1]}${cellsHeaderRow.number + 1}`)
      ws.mergeCells(`${excel_cells[6]}${cellsHeaderRow.number}:${excel_cells[6]}${cellsHeaderRow.number + 1}`)
      ws.mergeCells(`${excel_cells[11]}${cellsHeaderRow.number}:${excel_cells[11]}${cellsHeaderRow.number + 1}`)
    },

    setSalesByStaffDataToExcelTable(ws, excelTableHeaders = [], excelTableRows = []) {
      excelTableRows.forEach((row) => {
        const rowData1 = [
          this.formatName(row.fields.staff.staff_name),
          this.$t('report.sales'),
          this.displayDataSalesByStaff(row.fields.services.sales_quantity),
          this.displayDataSalesByStaff(row.fields.services.sales_amount),
          this.displayDataSalesByStaff(row.fields.products.sales_quantity),
          this.displayDataSalesByStaff(row.fields.products.sales_amount),
          this.displayDataSalesByStaff(row.fields.sub_total.sales),
          this.displayDataSalesByStaff(row.fields.prepaid_cards.sales_quantity),
          this.displayDataSalesByStaff(row.fields.prepaid_cards.sales_total_amount),
          this.displayDataSalesByStaff(row.fields.prepaid_services.sales_quantity),
          this.displayDataSalesByStaff(row.fields.prepaid_services.sales_total_amount),
          this.displayDataSalesByStaff(row.fields.total),
        ]
        const rowData2 = [
          this.formatName(row.fields.staff.staff_name),
          this.$t('payroll.prepaid-goods-deduction'),
          this.displayDataSalesByStaff(row.fields.services.deduction_total_quantity),
          this.displayDataSalesByStaff(row.fields.services.deduction_total_amount),
          this.displayDataSalesByStaff(row.fields.products.deduction_total_quantity),
          this.displayDataSalesByStaff(row.fields.products.deduction_total_amount),
          this.displayDataSalesByStaff(row.fields.sub_total.deduction),
          '',
          '',
          '',
          '',
          '',
        ]
        const rowData3 = [
          this.formatName(row.fields.staff.staff_name),
          this.$t('general.total'),
          '',
          this.displayDataSalesByStaff(row.fields.services.grand_total_amount),
          '',
          this.displayDataSalesByStaff(row.fields.products.grand_total_amount),
          this.displayDataSalesByStaff(row.fields.sub_total.total),
          '',
          '',
          '',
          '',
          '',
        ]
        const wsRow1 = ws.addRow(rowData1)
        const wsRow2 = ws.addRow(rowData2)
        const wsRow3 = ws.addRow(rowData3)
        setRowStyles(ws, excelTableHeaders.length, wsRow1.number, false, this.salesByStaffTableStyles)
        setRowStyles(ws, excelTableHeaders.length, wsRow2.number, false, this.salesByStaffTableStyles)
        setRowStyles(ws, excelTableHeaders.length, wsRow3.number, false, this.salesByStaffTableStyles)

        ws.mergeCells(`${excel_cells[0]}${wsRow1.number}:${excel_cells[0]}${wsRow1.number + 2}`)

      })

    },

    setRevenueTotalDataToExcelTable(ws, excelTableHeaders = [], excelTableRows = []) {
      // Table rows
      excelTableRows.forEach(row => {
        const wsRow = ws.addRow([
          row.name === 'sales-total' ? this.$t('report.sales-total-staff-no-prepaid-goods') : this.$t(`report.${row.name}`),
          displayDataDetailSalesTotal(
            row.fields.service.quantity,
            row.name,
            'service-quantity',
          ),
          displayDataDetailSalesTotal(
            row.fields.service.amount,
            row.name,
            'service-amount',
          ),
          displayDataDetailSalesTotal(
            row.fields.product.quantity,
            row.name,
            'product-quantity',
          ),
          displayDataDetailSalesTotal(
            row.fields.product.amount,
            row.name,
            'product-amount',
          ),
          displayDataNoSalesAndAmountPerSale(
            row.fields.totalNoPrepaidGoods,
          ),
        ])
        setRowStyles(ws, excelTableHeaders.length, wsRow.number, false)

      })
    },

    setSalesTotalDataToExcelTable(ws, excelTableHeaders = [], excelTableRows = []) {
      // Table rows
      excelTableRows.forEach(row => {
        const wsRow = ws.addRow([
          this.$t(`report-sales-by-staff.${row.name}`),
          displayDataDetailSalesTotal(
            row.fields.service.quantity,
            row.name,
            'service-quantity',
          ),
          displayDataDetailSalesTotal(
            row.fields.service.amount,
            row.name,
            'service-amount',
          ),
          displayDataDetailSalesTotal(
            row.fields.product.quantity,
            row.name,
            'product-quantity',
          ),
          displayDataDetailSalesTotal(
            row.fields.product.amount,
            row.name,
            'product-amount',
          ),
          displayDataDetailSalesTotal(
            row.fields.prepaid_card.quantity,
            row.name,
            'prepaid-card-quantity',
          ),
          displayDataDetailSalesTotal(
            row.fields.prepaid_card.amount,
            row.name,
            'prepaid-card-amount',
          ),
          displayDataDetailSalesTotal(
            row.fields.prepaid_service.quantity,
            row.name,
            'prepaid-service-quantity',
          ),
          displayDataDetailSalesTotal(
            row.fields.prepaid_service.amount,
            row.name,
            'prepaid-service-amount',
          ),
          displayDataDetailSalesTotal(
            row.fields.total.amount,
            row.name,
            'total-amount',
          ),
        ])
        setRowStyles(ws, excelTableHeaders.length, wsRow.number, false, this.salesTotalTableStyles)
      },
      )
    },

    mergeCells(ws, row, startMergePosition, endMergePosition) {
      const rowNumber = row._number

      const endMergeCells = excel_cells[endMergePosition] + rowNumber
      const firstMergeCells = excel_cells[startMergePosition] + rowNumber

      ws.mergeCells(`${firstMergeCells}:${endMergeCells}`)
    },

    setOutputDateRowToExcel(ws, excelTableHeader = [], printDate) {
      const outputDateRow = [...new Array(excelTableHeader.length - 1), printDate]
      const tmpRow = ws.addRow(outputDateRow)
      setCellAlignment(`${excel_cells[outputDateRow.length - 1]}${tmpRow.number}`, ws, 'right')
    },

    changeSalesTotalAmount() {
      const totalIndex = this.sales_total_detail.findIndex((e) => e.name === 'sales-total')
      const pointsDeductionIndex = this.sales_total_detail.findIndex((e) => e.name === 'points-deduction')
      const revenueIndex = this.sales_total_detail.findIndex((e) => e.name === 'revenue-total')
      this.sales_total_detail[totalIndex].fields.service.amount += this.sales_total_detail[pointsDeductionIndex].fields.service.amount
      this.sales_total_detail[totalIndex].fields.product.amount += this.sales_total_detail[pointsDeductionIndex].fields.product.amount
      this.sales_total_detail[revenueIndex].fields.service.amount += this.sales_total_detail[pointsDeductionIndex].fields.service.amount
      this.sales_total_detail[revenueIndex].fields.product.amount += this.sales_total_detail[pointsDeductionIndex].fields.product.amount
    },

    changeSalesTotalPrepaidGood() {
      const totalIndex = this.prepaid_goods_sales.findIndex((e) => e.name === 'sales-total')
      const pointsDeductionIndex = this.prepaid_goods_sales.findIndex((e) => e.name === 'points-deduction')
      this.prepaid_goods_sales[totalIndex].fields.prepaid_card.amount += this.prepaid_goods_sales[pointsDeductionIndex].fields.prepaid_card.amount
      this.prepaid_goods_sales[totalIndex].fields.prepaid_service.amount += this.prepaid_goods_sales[pointsDeductionIndex].fields.prepaid_service.amount
    },

    async loadStaffItemsAsync() {
      try {
        const response = await this.getStaffsAsyncMixin()
        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.staff_options = response.data.items
        this.table_filter.staff_id = ALL_STAFF
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async onStaffIdChange(newStaffId) {
      this.isStaffMode = newStaffId !== ALL_STAFF
      if (this.isStaffMode) {
        const currentStaffOption = this.staff_options.map(staff => ({
          staff_id:   staff.id,
          staff_name: staff.aliasname,
        }))

        const currentStaff = newStaffId !== NOT_SELECT_STAFF ? currentStaffOption.find(staff => staff.staff_id === newStaffId) : NOT_SELECT_STAFF_INFO

        this.table_rows = []
        this.$nextTick(() => {
          this.itemTypes = (this.$refs.select_multi_sales_item_type?.item_type_options || []).filter(itemType => {
            return !!this.routeQueryItemTypes[itemType?.value]
          }) || []
        })

        const checkValidate = await this.loadTableDataAsync(false)
        if (!checkValidate) return

        const isPassedCondittion = await this.getSalesTotalByStaffReport()
        if (isPassedCondittion) {
          this.salesHistoyFilter.payment_method_id = ALL_PAYMENT_METHOD_VALUE
          this.setTotalSalesDetailFilter()
          this.onClickViewSalesTotalDetail(currentStaff)
        }
      } else {
        const query = {
          dateType:                 this.table_filter.date_type,
          fromDateTS:               this.table_filter.from_date_ts,
          toDateTS:                 this.table_filter.to_date_ts,
          isPointDeductionIncluded: this.table_filter.isPointDeductionIncluded,
          staffId:                  this.table_filter.staffId,
        }

        await this.loadTableDataAsync(true)

        this.$router.replace({
          query,
          name: 'sales-by-staff',
        })

        this.paymentTotals = []
        this.sales_total_detail = []
        this.tableSalesByService = []
        this.sales_data = {}
        this.tableRowsTransferData = []
      }
    },

    async getSalesTotalByStaffReport() {
      try {
        this.preLoader()
        const reportApi = new ReportApi()
        const response = await reportApi.getSalesTotalByStaffReportAsync(this.table_filter)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        } else {
          this.setPrintFilterData()
          return true
        }
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      } finally {
        this.preLoader(false)
      }
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

    getContentTooltip(note) {
      if (typeof note !== 'string') {
        return note
      }

      if (note.length <= SALES_TRANSFER.MAX_VALUE.NOTES) {
        return note
      }

      return note.substring(0, SALES_TRANSFER.MAX_VALUE.NOTES) + '...'
    },

    isShowShopNameOfPrepaidGoodsStaff(row) {
      if (row.oldStaffId === null) return false
      return row.oldStaffShopId !== this.shop_data.shop_id
    },

    isShowShopNameOfServiceStaff(row) {
      if (row.newStaffId === null) return false
      return row.newStaffShopId !== this.shop_data.shop_id
    },
  },
}
</script>

<style lang="scss" scoped>
@import './sales-by-staff.scss';
</style>
