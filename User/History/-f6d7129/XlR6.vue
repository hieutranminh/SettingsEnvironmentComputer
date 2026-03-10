<template>
  <div>
    <!-- SEARCH BLOCK -->
    <div class="filter-wrapper">
      <div class="filter-wrapper__header">
        <!-- Group Period & Date -->
        <div class="filter-wrapper__group-period-date">
          <!-- Working Period -->
          <div class="filter-wrapper__working-period">
            {{ $t('payroll.payroll-statement-v2.working-period') }}
          </div>

          <!-- Date Range -->
          <div class="filter-wrapper__date-range">
            <aha-date-picker
              v-show="!disabledWorkingPeriod"
              v-model="formAddPayrollStatement.startDate"
              :popover-align="isMobileDevice ? 'left' : 'right'"
              @input="(value) => handleChangeFilterDateRange(value, 'start')"
            />
            <input
              v-if="disabledWorkingPeriod"
              type="text"
              disabled
              class="form-control"
              :value="formatDateToYYYYMMDD(formAddPayrollStatement.startDate)"
            >
            <span class="mx-1">~</span>
            <aha-date-picker
              v-show="!disabledWorkingPeriod"
              v-model="formAddPayrollStatement.endDate"
              :popover-align="isMobileDevice ? 'right' : 'left'"
              @input="(value) => handleChangeFilterDateRange(value, 'end')"
            />
            <input
              v-if="disabledWorkingPeriod"
              type="text"
              disabled
              class="form-control"
              :value="formatDateToYYYYMMDD(formAddPayrollStatement.endDate)"
            >
          </div>
        </div>

        <!-- Staff -->
        <div class="filter-wrapper__staff">
          <div class="label-staff">
            {{ $t('general.staff') }}
          </div>
          <b-form-select
            v-model="formAddPayrollStatement.staffId"
            :options="staffOptions"
            :disabled="disabledStaffSelection"

            value-field="id"
            text-field="aliasname"
            @change="(value) => handleChangeFilterDateRange(value, 'staff-select')"
          />
        </div>

        <!-- Search Button -->
        <div class="filter-wrapper__search">
          <aha-button
            variant="blue"
            class="btn-search ml-2"
            @click="handleSearchButtonClick"
          >
            {{ createPayrollText }}
          </aha-button>
        </div>
      </div>
    </div>

    <transition
      name="fade"
      mode="out-in"
    >
      <div
        class="change-staff"
        :class="{ 'is-hiding-result-payroll-calculation-block': isNeedToHidePayrollCalculationBlock }"
      >
        <!-- PAYROLL AND DEDUCTION ITEMS -->
        <div
          v-show="!isHidePayrollCalculationBlock"
          class="payroll-deduction-items-wrapper"
        >
          <div class="payroll-deduction-items-wrapper__title">
            {{ $t('payroll.payroll-statement-v2.payroll-and-deduction-items') }}
            <aha-tooltip
              target="payroll-setup-icon-tooltip"
              placement="bottom"
            >
              {{ $t('payroll.payroll-item-setup') }}
            </aha-tooltip>
            <img
              id="payroll-setup-icon-tooltip"
              :src="payrollItemSetupIcon"
              class="payroll-item-setup-icon"
              @click="openPayrollItemSetupModal"
            >
          </div>
          <div class="payroll-deduction-items-wrapper__income-classification mr-3">
            <div class="mr-1">
              {{ $t('payroll.payroll-statement-v2.income-classification') }}
            </div>

            <b-form-select
              v-model="formAddPayrollStatement.taxClassification"
              :options="incomeClassificationOptions"
              text-field="name"
              value-field="id"
              @change="handleTaxClassificationChange"
            />
          </div>
        </div>

        <div
          v-show="!isHidePayrollCalculationBlock"
          class="table-wrapper mt-2"
        >
          <div class="table-contain w-100">
            <aha-table class="table-combined">
              <table class="staff-payment-total__table">
                <thead>
                  <tr>
                    <th width="25%">
                      {{ $t('payroll.payroll-statement-v2.payroll-items') }}
                    </th>
                    <th
                      class="table-combined__amount"
                      width="25%"
                    >
                      {{ $t('payroll.payroll-statement-v2.amount') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in payrollItem"
                    :key="index"
                  >
                    <td>{{ getPayrollItemName(index) }}</td>
                    <td>
                      <custom-input-number
                        v-if="hasPayrollItem(index)"
                        v-model="item.amount"
                        :max-length="maxLengthInputNumber"
                        @input="calculatePayrollItemAmount"
                      />
                    </td>
                  </tr>
                  <tr
                    v-for="(_, index) in maxLenghtColPayrollItem"
                    :key="'key' + index"
                  >
                    <td />
                    <td />
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>{{ $t('payroll.payroll-statement-v2.total-payroll') }}</strong></td>
                    <td class="text-right">
                      <strong>{{ formAddPayrollStatement.totalPayrollAmount | formatMoney }}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </aha-table>

            <aha-table class="table-combined">
              <table class="table-deduction">
                <thead>
                  <tr>
                    <th width="25%">
                      {{ $t('payroll.payroll-statement-v2.deduction-item') }}
                    </th>
                    <th width="25%">
                      {{ $t('payroll.payroll-statement-v2.amount') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in deductionItem"
                    :key="index"
                  >
                    <td>{{ getDeductionItemName(index) }}</td>
                    <td>
                      <custom-input-number
                        v-if="hasDeductionItem(index)"
                        v-model="item.amount"
                        :max-length="maxLengthInputNumber"
                        @input="calculateDeductionItemAmount(item.payrollItemAmountType)"
                      />
                    </td>
                  </tr>
                  <tr
                    v-for="(_, i) in maxLengthColDeductionItem"
                    :key="'key' + i"
                  >
                    <td />
                    <td />
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>{{ $t('payroll.payroll-statement-v2.total-deduction') }}</strong></td>
                    <td class="text-right">
                      <strong>{{ formAddPayrollStatement.totalDeductionAmount | formatMoney }}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </aha-table>
          </div>
        </div>

        <div
          v-show="!isHidePayrollCalculationBlock"
          class="summary-table mt-3"
        >
          <aha-table>
            <table class="payment-table">
              <tbody>
                <tr>
                  <td width="50%">
                    <strong>
                      {{ $t('payroll.payroll-statement-v2.actual-payment') }}
                    </strong>
                  </td>
                  <td class="text-right">
                    {{ actualPayment | formatMoney }}
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <strong>{{ $t('payroll.payroll-statement-v2.advance-payment') }}</strong>
                  </td>
                  <td class="payment-table__advance-payment">
                    <aha-input-money
                      v-model="formAddPayrollStatement.advancePayment"
                      :max-length="12"
                      prevent-input-zero-value
                      class="form-control text-right"
                    />
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <strong>
                      {{ $t('payroll.payroll-statement-v2.net-payable-amount') }}
                    </strong>
                  </td>
                  <td class="text-right">
                    <strong>{{ netPayableAmount | formatMoney }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </aha-table>
        </div>

        <!-- Incentive Details -->
        <div
          v-show="!isHidePayrollCalculationBlock"
          class="incentive-details-wrapper mt-3"
        >
          <div class="incentive-details-wrapper__title ml-3">
            {{ $t('payroll.payroll-statement-v2.incentive-details') }}
          </div>
          <aha-table class="incentive-details-wrapper__table mt-2">
            <table>
              <thead>
                <tr>
                  <th colspan="2">
                    {{ $t('report.service') }}
                  </th>
                  <th colspan="2">
                    {{ $t('report.product') }}
                  </th>
                  <th rowspan="2">
                    {{ $t('payroll.prepaid-card-sales') }}
                  </th>
                  <th rowspan="2">
                    {{ $t('payroll.prepaid-service-sales') }}
                  </th>
                  <th rowspan="2">
                    {{ $t('general.total') }}
                  </th>
                </tr>
                <tr>
                  <th>
                    {{ $t('payroll.sales') }}
                  </th>
                  <th>
                    {{ $t('sales.deduction') }}
                  </th>
                  <th>
                    {{ $t('payroll.sales') }}
                  </th>
                  <th>
                    {{ $t('sales.deduction') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{ incentivesSearchData.salaryForServicesSales | formatMoney }}
                  </td>
                  <td>
                    {{ incentivesSearchData.salaryForServicesSalesDeduction | formatMoney }}
                  </td>
                  <td>
                    {{ incentivesSearchData.salaryForProductSales | formatMoney }}
                  </td>
                  <td>
                    {{ incentivesSearchData.salaryForProductSalesDeduction | formatMoney }}
                  </td>
                  <td>
                    {{ incentivesSearchData.salaryForPrepaidCardSales | formatMoney }}
                  </td>
                  <td>
                    {{ incentivesSearchData.salaryForPrepaidServicesSales | formatMoney }}
                  </td>
                  <td>
                    {{ incentivesSearchData.total | formatMoney }}
                  </td>
                </tr>
              </tbody>
            </table>
          </aha-table>
        </div>
        <div
          v-show="isHidePayrollCalculationBlock"
          class="change-staff__title"
        >
          <p class="text-center">
            {{ placeholderWhenSelectionStaffChange }}
          </p>
        </div>
      </div>
    </transition>

    <div class="button-wrapper mt-3">
      <aha-button
        variant="blue"
        :disabled="isDisableButton"
        @click="handleSaveButtonClick"
      >
        {{ $t('general.save') }}
      </aha-button>
      <aha-button
        variant="blue"
        :disabled="isDisableButton"
        @click="handleSaveAndContinueButtonClick"
      >
        {{ $t('general.save-and-continue') }}
      </aha-button>
      <aha-button
        variant="blue-light"
        @click="handleCancelButtonClick"
      >
        {{ $t('general.cancel') }}
      </aha-button>
    </div>
  </div>
</template>
<script>

// Utilities
import moment from 'moment'
import i18n from 'Translate'
import { cloneDeep } from 'lodash'
import { options } from 'OptionsHelpers'
import { PAYROLL_SETUP_RULE } from 'SystemDataRules'
import { formatMoney } from 'CommonHelpers'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getDiffDateRange, getCurrentTimezoneTS, convertDateToMomentUTC } from 'DatetimeHelpers'
import { BUSINESS_TYPE_HAIR, BUSINESS_TYPE_MASSAGE, INCOME_CLASSIFICATION, NOT_BUSINESS_OR_OTHER_INCOME_TAX, SLICE_INDEX, TAX_RATES } from 'Constant'

// Components
import AhaTable from 'CommonComponents/aha-table/aha-table.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import AhaGridTable from 'CommonComponents/aha-grid-table/aha-grid-table.vue'
import ComponentBase from 'Components/common/component-base/component-base.vue'
import AhaInputMoney from 'CommonComponents/aha-input-money/aha-input-money.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import SelectControl from 'CommonComponents/form/select/select-control/select-control.vue'
import CustomInputNumber from 'CommonComponents/form/input/custom-input-number/custom-input-number'

// Mixins
import StaffMixin from 'Mixins/staff-mixin.js'

export default {
  filters: {
    formatMoney(value) {
      return formatMoney(value, 0)
    },
  },

  components: {
    AhaTable,
    AhaTooltip,
    AhaGridTable,
    AhaDatePicker,
    SelectControl,
    AhaInputMoney,
    CustomInputNumber,
  },

  extends: ComponentBase,

  mixins: [
    StaffMixin,
  ],

  data() {
    return {
      PayrollPayrollItemTypeEnum: {
        0:  i18n.t('payroll.payroll-item.base-salary'),
        1:  i18n.t('payroll.payroll-item.incentive'),
        2:  i18n.t('payroll.payroll-item.meal-allowance'),
        3:  i18n.t('payroll.payroll-item.position-allowance'),
        4:  i18n.t('payroll.payroll-item.qualification-allowance'),
        5:  i18n.t('payroll.payroll-item.overtime-pay'),
        6:  i18n.t('payroll.payroll-item.holiday-pay'),
        7:  i18n.t('payroll.payroll-item.annual-leave-pay'),
        8:  i18n.t('payroll.payroll-item.additional-pay-1'),
        9:  i18n.t('payroll.payroll-item.additional-pay-2'),
        10: i18n.t('payroll.payroll-item.additional-pay-3'),
      },

      PayrollDeductItemTypeEnum: {
        21: i18n.t('payroll.payroll-item.product-use'),
        22: i18n.t('payroll.payroll-item.tardiness'),
        23: i18n.t('payroll.payroll-item.early-leave'),
        24: i18n.t('payroll.payroll-item.absence'),
        25: i18n.t('payroll.payroll-item.income-tax'),
        26: i18n.t('payroll.payroll-item.resident-tax'),
        27: i18n.t('payroll.payroll-item.health-insurance'),
        28: i18n.t('payroll.payroll-item.national-pension'),
        29: i18n.t('payroll.payroll-item.employment-insurance'),
        30: i18n.t('payroll.payroll-item.industrial-accident-insurance'),
        31: i18n.t('payroll.payroll-item.other-deduction-1'),
        32: i18n.t('payroll.payroll-item.other-deduction-2'),
        33: i18n.t('payroll.payroll-item.other-deduction-3'),
        34: i18n.t('payroll.payroll-item.business-income-tax'),
        35: i18n.t('payroll.payroll-item.other-income-tax'),
      },

      staffsList:              [],
      formAddPayrollStatement: {
        staffId:              0,
        payrollItems:         [],
        advancePayment:       0,
        deductionItems:       [],
        taxClassification:    1,
        totalPayrollAmount:   0,
        totalDeductionAmount: 0,
        payrollYearMonth:     moment().format('YYYY-MM'),
        endDate:              null,
        startDate:            null,
        startDateTs:          null,
        endDateTs:            null,
      },
      listItemSetup:                       [],
      businessIncomeField:                 null,
      otherIncomeField:                    null,
      searchFilter:                        {},
      isDisableButton:                     true,
      isNeedToHidePayrollCalculationBlock: false,
      disabledWorkingPeriod:               false,
      disabledStaffSelection:              false,
      isPayslipCreated:                    false,
      payrollItem:                         [],
      deductionItem:                       [],
    }
  },

  computed: {
    ...mapState('payrollStatement', [
      'payrollStatement',
      'incentivesSearchData',
      'payrollStatementData',
    ]),

    ...mapGetters('payrollStatement', [
      'getListFieldsAddPayrollStatement',
    ]),

    ...mapGetters('device', [
      'isMobileDevice',
    ]),

    createPayrollText() {
      return this.isPayslipCreated ? this.$t('payroll.payroll-statement-v2.select-again') : this.$t('payroll.payroll-statement-v2.calculate-payroll')
    },

    payrollItemSetupIcon() {
      return '/template/images/setting.png'
    },

    staffOptions() {
      return [
        { id: 0, aliasname: this.$t('general.select') },

        ...this.staffsList,
      ]
    },

    maxRows() {
      return Math.max(
        Array.isArray(this.payrollItems) ? this.payrollItems.length : 0,
        Array.isArray(this.deductionItems) ? this.deductionItems.length : 0,
      )
    },

    payrollItems() {
      return this.listItemSetup
        ?.filter(item => item?.payrollType === 0 && item.status)
        .map(item => ({
          ...item,
          amount:   item?.amount || 0,
          itemName: item.itemName || this.PayrollPayrollItemTypeEnum[item.payrollItemAmountType] || '',
        })) || []
    },

    deductionItems() {
      return this.listItemSetup
        ?.filter(item => item?.payrollType === 1 && item.status)
        .map(item => ({
          ...item,
          amount:   item.amount || 0,
          itemName: item.itemName || this.PayrollDeductItemTypeEnum[item.payrollItemAmountType] || '',
        })) || []
    },

    maxLengthInputNumber() {
      return PAYROLL_SETUP_RULE.INPUT_NUMBER_LENGTH
    },

    payrollYearMonthOptions() {
      const currentYear = moment().year()
      return Array.from({ length: 12 }, (_, i) =>
        moment(`${currentYear}-${i + 1}`, 'YYYY-M').format('YYYY-MM'),
      )
    },

    incomeClassificationOptions() {
      return [
        {
          id:   options.taxClassification.earnedIncome,
          name: this.$t('payroll.tax-classification.earned-income'),
        },
        {
          id:   options.taxClassification.businessIncome,
          name: this.$t('payroll.tax-classification.business-income'),
        },
        {
          id:   options.taxClassification.otherIncome,
          name: this.$t('payroll.tax-classification.other-income'),
        },
      ]
    },

    actualPayment() {
      return (this.formAddPayrollStatement.totalPayrollAmount - this.formAddPayrollStatement.totalDeductionAmount) || 0
    },

    netPayableAmount() {
      return this.actualPayment - this.formAddPayrollStatement.advancePayment || 0
    },

    isIncomeClassificationType() {
      return this.isBusinessIncome || this.isOtherIncome
    },

    isBusinessIncome() {
      return this.formAddPayrollStatement.taxClassification === options.taxClassification.businessIncome
    },

    isOtherIncome() {
      return this.formAddPayrollStatement.taxClassification === options.taxClassification.otherIncome
    },

    isBusinessType() {
      return this.shop_data.business_type_code === BUSINESS_TYPE_HAIR || this.shop_data.business_type_code === BUSINESS_TYPE_MASSAGE
    },

    isHidePayrollCalculationBlock() {
      return this.formAddPayrollStatement.staffId === 0 || this.isNeedToHidePayrollCalculationBlock
    },

    placeholderWhenSelectionStaffChange() {
      if(this.formAddPayrollStatement.staffId !== 0) {
        return this.$t('payroll.payroll-statement-v2.placeholder-when-switching-to-another-staff-while-one-is-already-selected')
      } else {
        return this.$t('payroll.payroll-statement-v2.placeholder-when-no-staff-is-selected')
      }
    },

    maxLenghtColPayrollItem() {
      return this.maxRows - this.payrollItem.length
    },

    maxLengthColDeductionItem() {
      return this.maxRows - this.deductionItem.length
    },
  },

  async created() {
    await this.initializeComponent()
    this.payrollItem = cloneDeep(this.payrollItems)
    this.deductionItem = cloneDeep(this.deductionItems)
  },

  watch: {
    payrollItems: {
      handler(oldVal, newVal) {

        if(!this.arrayEqual(this.payrollItem, newVal)) {
          const clonedPayrollItem = cloneDeep(this.payrollItem)
          this.payrollItem = cloneDeep(this.payrollItems)
          this.payrollItem.forEach(item => {
            const match = clonedPayrollItem.find(item2 => item2.payrollItemAmountType === item.payrollItemAmountType)
            if(match) {
              item.amount = match.amount
            }
          })
        }

        this.calculatePayrollItemAmount()
        this.calculateDeductionItemAmount()
        this.calculateIncomeTax()

      },
      deep: true,
    },

    deductionItems: {
      handler(oldVal, newVal) {
        if(!this.arrayEqual(this.deductionItems, newVal)) {
          const clonedDeductionItem = cloneDeep(this.deductionItem)
          this.deductionItem = cloneDeep(this.deductionItems)
          this.deductionItem.forEach(item => {
            const match = clonedDeductionItem.find(item2 => item2.payrollItemAmountType === item.payrollItemAmountType)
            if(match) {
              item.amount = match.amount
            }
          })
        }
        this.calculatePayrollItemAmount()
        this.calculateDeductionItemAmount()
        this.calculateIncomeTax()
      },
    },
  },

  methods: {
    ...mapActions('payrollStatement', [
      'addPayrollStatement',
      'fetchIncentiveDetailsByStaffReport',
    ]),

    ...mapMutations('payrollStatement', [
      'setIncentivesSearchData',
    ]),

    arrayEqual(a, b) {
      if(a.length !== b.length) return false
      return a.every((val, index) => {
        return JSON.stringify(val) === JSON.stringify(b[index])
      })
    },

    async initializeComponent() {
      await this.loadStaffItemsAsync()
      this.initializeItemSetup()
      this.initializeTaxFields()
      this.handleBusinessTypeSetup()
    },

    formatDateToYYYYMMDD(date) {
      return moment(date).format('YYYY-MM-DD')
    },

    initializeItemSetup() {
      // Remove last 2 items from list fields
      this.listItemSetup = [...this.getListFieldsAddPayrollStatement].slice(0, -2)
    },

    initializeTaxFields() {
      this.businessIncomeField = this.findTaxField(INCOME_CLASSIFICATION.BUSINESS_INCOME)
      this.otherIncomeField = this.findTaxField(INCOME_CLASSIFICATION.OTHER_INCOME)
    },

    findTaxField(classificationType) {
      return this.getListFieldsAddPayrollStatement.find(
        item => item.payrollItemAmountType === classificationType,
      )
    },

    handleBusinessTypeSetup() {
      const type = this.isBusinessType ? options.taxClassification.businessIncome : options.taxClassification.earnedIncome
      const value = this.formAddPayrollStatement?.taxClassification || type
      this.formAddPayrollStatement.taxClassification = value

      this.updateListItemSetup()
    },

    async loadStaffItemsAsync() {
      try {
        const response = await this.getStaffsAsyncMixin()
        if (!response.is_ok) {
          this._showDialogAlert(response.message)
        }

        this.staffsList = response.data?.items || []
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleKeepDataFilter(data) {
      this.formAddPayrollStatement.staffId = data.staffId
      this.formAddPayrollStatement.taxClassification = this.incentivesSearchData.taxClassification //Income Classification
    },

    setTaxClassification(taxClassification = null, isBusinessType) {
      if(taxClassification === null) {
        this.formAddPayrollStatement.taxClassification = isBusinessType
          ? options.taxClassification.businessIncome
          : options.taxClassification.earnedIncome
      } else {

        this.formAddPayrollStatement.taxClassification = taxClassification
      }
    },

    async loadInitPayrollData() {
      try {
        this.preLoader()
        const payload = this.createSearchPayload()

        this.validateSearchCriteria(payload)
        await this.fetchIncentiveDetailsByStaffReport(payload)
        this.handleKeepDataFilter(payload)
        this.assignPayrollStatementData()
        this.setSearchFilter()
        this.isDisableButton = false
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleSearchButtonClick() {
      try {
        if(this.isPayslipCreated) {
          this.handleResetForm()
          this.setStateWhenPayslipCreated(this.isPayslipCreated)
          return
        }
        this.preLoader()
        const payload = this.createSearchPayload()
        this.validateSearchCriteria(payload)
        await this.fetchIncentiveDetailsByStaffReport(payload)
        this.payrollItem[0].amount = this.incentivesSearchData.baseSalary
        this.payrollItem[1].amount = this.incentivesSearchData.total

        if (this.hasSearchCriteriaChanged()) {
          this.handleResetForm()
        } else {
          this.preserveFormData()
        }

        this.handleKeepDataFilter(payload)
        this.assignPayrollStatementData()
        this.setSearchFilter()
        this.isDisableButton = false

        // case success create:
        this.setStateWhenPayslipCreated(this.isPayslipCreated)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    setStateWhenPayslipCreated(isPaySlipCreated) {
      if(!isPaySlipCreated) {
        this.isPayslipCreated = true
        this.isNeedToHidePayrollCalculationBlock = false
        this.toDisableWorkingPeriodAndStaff(true)
        this.setTaxClassification(this.incentivesSearchData.taxClassification, this.isBusinessType)
      } else {
        this.isPayslipCreated = false
        this.isNeedToHidePayrollCalculationBlock = true
        this.toDisableWorkingPeriodAndStaff(false)
        this.cancelStaffSelection()
      }
    },

    toDisableWorkingPeriodAndStaff(status) {
      this.disabledWorkingPeriod = status
      this.disabledStaffSelection = status
    },

    cancelStaffSelection() {
      this.formAddPayrollStatement.staffId = 0
    },

    assignPayrollStatementData() {
      this.payrollItems[0].amount = this.incentivesSearchData.baseSalary
      this.payrollItems[1].amount = this.incentivesSearchData.total
      this.setTaxClassification(this.formAddPayrollStatement.taxClassification, this.isBusinessType)

      this.updateListItemSetup()
      this.calculatePayrollItemAmount()
      this.calculateDeductionItemAmount()
    },

    handleResetForm() {
      this.formAddPayrollStatement.staffId = 0
      this.formAddPayrollStatement.advancePayment = 0
      this.setTaxClassification(this.incentivesSearchData?.taxClassification, this.isBusinessType)
      this.formAddPayrollStatement.totalPayrollAmount = 0
      this.formAddPayrollStatement.totalDeductionAmount = 0
      this.formAddPayrollStatement.payrollYearMonth = moment().format('YYYY-MM')

      this.resetAmounts(this.payrollItems, ['amount'])
      this.resetAmounts(this.deductionItems, ['amount'])

      const payrollItemSlice = this.payrollItem.slice(2)
      this.resetAmounts(payrollItemSlice, ['amount'])
      this.resetAmounts(this.deductionItem, ['amount'])
    },

    handleTaxClassificationChange() {

      this.updateListItemSetup()
      this.calculatePayrollItemAmount()
      this.calculateDeductionItemAmount()
    },

    openPayrollItemSetupModal() {
      this.$emit('on-show-payroll-item')
    },

    updateAmountAndRemoveDuplicates(arrayOne, arrayTwo) {
      const amountMap = new Map(arrayTwo.map(item => [item.payrollItemAmountType, item.amount]))

      const updatedArray = arrayOne.map(item => ({
        ...item,
        amount: amountMap.has(item.payrollItemAmountType) ? amountMap.get(item.payrollItemAmountType) : item.amount,
      }))

      return updatedArray
    },

    updateListItemSetup() {
      const originalItems = this.getListFieldsAddPayrollStatement
        ?.filter(item => item?.payrollType === 1 && item.status)
        .map(item => ({
          ...item,
          amount:   item.amount || 0,
          itemName: item.itemName || this.PayrollDeductItemTypeEnum[item.payrollItemAmountType] || '',
        })).slice(0, -2) || []

      if (!this.isIncomeClassificationType) {
        this.listItemSetup = [...this.payrollItems, ...this.updateAmountAndRemoveDuplicates(originalItems, this.deductionItems)]
        return
      }

      const filteredDeductions = this.deductionItems.filter(item =>
        !(item.payrollItemAmountType >= SLICE_INDEX.START &&
          item.payrollItemAmountType <= SLICE_INDEX.END),
      )

      const incomeField = this.isBusinessIncome ? this.businessIncomeField : this.otherIncomeField
      const excludeField = this.isBusinessIncome ? this.otherIncomeField : this.businessIncomeField

      this.listItemSetup = [
        ...this.payrollItems,
        ...filteredDeductions,
        incomeField,
      ].filter(item => item.payrollItemAmountType !== excludeField.payrollItemAmountType)

      this.listItemSetup = [...this.removeDuplicates(this.listItemSetup)]
    },

    removeDuplicates(array) {
      const seen = new Map()
      return array.filter(item => {
        if (!seen.has(item.payrollItemAmountType)) {
          seen.set(item.payrollItemAmountType, true)
          return true
        }
        return false
      })
    },

    resetAmounts(items, fields) {
      items?.forEach(item => {
        fields.forEach(field => item[field] = 0)
      })
    },

    async handleSaveButtonClick(isHideModel = true) {
      try {
        this.preLoader()
        const payload = this.createPayload()
        this.showAlertCanNotBeforeStartDate(payload.workingPeriodFromTS, payload.workingPeriodToTS)
        this.showAlertCanNotStaff(payload.staffId)

        await this.addPayrollStatement(payload)

        if (isHideModel) {
          this.$emit('cancel')
        } else {
          this.setStateWhenPayslipCreated(true)
        }

        this.handleResetForm()
        this.setIncentivesSearchData({})
        this.isDisableButton = true
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    createPayload() {
      return {
        shopId:                             this.shop_data.shop_id,
        payrollItemAmounts:                 [ ...this.payrollItem, ...this.deductionItem ],
        staffId:                            this.formAddPayrollStatement.staffId,
        incentiveTotal:                     this.incentivesSearchData.total,
        netPayableAmount:                   this.netPayableAmount,
        advancePayment:                     this.formAddPayrollStatement.advancePayment,
        totalPayroll:                       this.formAddPayrollStatement.totalPayrollAmount,
        deductionTotal:                     this.formAddPayrollStatement.totalDeductionAmount,
        incomeClassificationType:           this.formAddPayrollStatement.taxClassification,
        workingPeriodFromTS:                this.formAddPayrollStatement.startDateTs,
        workingPeriodToTS:                  this.formAddPayrollStatement.endDateTs,
        payrollYearMonth:                   moment(this.formAddPayrollStatement.payrollYearMonth).format('YYYYMM'),
        // Incentive details
        incentiveForProductSales:           this.incentivesSearchData.salaryForProductSales,
        incentiveForServicesSales:          this.incentivesSearchData.salaryForServicesSales,
        incentiveForPrepaidCardSales:       this.incentivesSearchData.salaryForPrepaidCardSales,
        incentiveForPrepaidServicesSales:   this.incentivesSearchData.salaryForPrepaidServicesSales,
        incentiveForProductSalesDeduction:  this.incentivesSearchData.salaryForProductSalesDeduction,
        incentiveForServicesSalesDeduction: this.incentivesSearchData.salaryForServicesSalesDeduction,
      }
    },

    showAlertCanNotBeforeStartDate(workingPeriodFromTS, workingPeriodToTS) {
      if (!workingPeriodFromTS || !workingPeriodToTS) {
        throw new Error(this.$t('input-date-range.please-select-working-period'))
      }

      if (workingPeriodFromTS > workingPeriodToTS) {
        throw new Error(this.$t('input-date-range.end-date-can-not-before-start-date'))
      }

      if (getDiffDateRange(workingPeriodFromTS, workingPeriodToTS, 'month') > 1) {
        throw new Error(this.$t('report.error_date_range_can_not_exceed_1_month'))
      }
    },

    showAlertCanNotStaff(staffId) {
      if (staffId === 0) {
        throw new Error(this.$t('sales.warning-sales-goods-not-have-staffs'))
      }
    },

    async handleSaveAndContinueButtonClick() {
      await this.handleSaveButtonClick(false)
    },

    handleCancelButtonClick() {
      this.$emit('cancel')
      this.handleResetForm()
    },

    calculateIncomeTax(editingFieldType = NOT_BUSINESS_OR_OTHER_INCOME_TAX) {
      const totalDeductionsWithoutTax = this.deductionItem
        .filter(item =>
          item.payrollItemAmountType !== INCOME_CLASSIFICATION.BUSINESS_INCOME &&
          item.payrollItemAmountType !== INCOME_CLASSIFICATION.OTHER_INCOME,
        )
        .reduce((total, item) => {
          const amount = item.amount === '' ? 0 : item.amount
          return total + amount
        }, 0)

      const taxableAmount = this.formAddPayrollStatement.totalPayrollAmount - totalDeductionsWithoutTax

      const isOtherField = editingFieldType !== INCOME_CLASSIFICATION.BUSINESS_INCOME && editingFieldType !== INCOME_CLASSIFICATION.OTHER_INCOME

      if(this.isBusinessIncome) {
        const businessIncomeItem = this.deductionItem.find(item => item.payrollItemAmountType === INCOME_CLASSIFICATION.BUSINESS_INCOME)
        if (businessIncomeItem) {
          businessIncomeItem.amount = isOtherField ? Math.round((taxableAmount * TAX_RATES.BUSINESS_INCOME) / 100) : businessIncomeItem.amount
          this.formAddPayrollStatement.totalDeductionAmount = Math.round(totalDeductionsWithoutTax + businessIncomeItem.amount)
        }
      } else if(this.isOtherIncome) {
        const otherIncomeItem = this.deductionItem.find(item => item.payrollItemAmountType === INCOME_CLASSIFICATION.OTHER_INCOME)

        if (otherIncomeItem) {
          otherIncomeItem.amount = isOtherField ? Math.round((taxableAmount * TAX_RATES.OTHER_INCOME) / 100) : otherIncomeItem.amount
          this.formAddPayrollStatement.totalDeductionAmount = Math.round(totalDeductionsWithoutTax + otherIncomeItem.amount)
        }
      } else {
        this.formAddPayrollStatement.totalDeductionAmount = Math.round(this.deductionItem.reduce((total, item) => total + (item.amount || 0), 0))
      }
    },

    calculatePayrollItemAmount() {
      this.formAddPayrollStatement.totalPayrollAmount = Math.round(this.payrollItem.reduce((total, item) => total + (item.amount || 0), 0))
      this.calculateDeductionItemAmount()
      this.calculateIncomeTax()
    },

    calculateDeductionItemAmount(editingFieldType) {
      this.calculateIncomeTax(editingFieldType)
    },

    hasPayrollItem(index) {
      return this.payrollItem && index < this.payrollItem.length
    },

    hasDeductionItem(index) {
      return this.deductionItem && index < this.deductionItem.length
    },

    getPayrollItemName(index) {
      return this.hasPayrollItem(index) ? this.payrollItem[index].itemName : ''
    },

    getDeductionItemName(index) {
      return this.hasDeductionItem(index) ? this.deductionItem[index].itemName : ''
    },

    setSearchFilter() {
      this.searchFilter = {
        staffId:   this.formAddPayrollStatement.staffId,
        startDate: this.formAddPayrollStatement.startDate,
        endDate:   this.formAddPayrollStatement.endDate,
      }
    },
    createSearchPayload() {
      return {
        staffId:           this.formAddPayrollStatement.staffId,
        shopId:            this.shop_data.shop_id,
        dateTimeSettingTS: getCurrentTimezoneTS(),
        fromDateTs:        this.formAddPayrollStatement.startDateTs,
        toDateTs:          this.formAddPayrollStatement.endDateTs,
        businessType:      this.shop_data.business_type_code,
      }
    },

    validateSearchCriteria(payload) {
      this.showAlertCanNotBeforeStartDate(payload.fromDateTs, payload.toDateTs)
      this.showAlertCanNotStaff(payload.staffId)
    },

    preserveFormData() {
    // Store current form values that should persist
      const preservedData = {
        advancePayment:    this.formAddPayrollStatement.advancePayment,
        taxClassification: this.formAddPayrollStatement.taxClassification,
        payrollYearMonth:  this.formAddPayrollStatement.payrollYearMonth,
        payrollItems:      cloneDeep(this.payrollItems),
        deductionItems:    cloneDeep(this.deductionItems),
      }

      return preservedData
    },

    hasSearchCriteriaChanged() {
      const currentForm = this.formAddPayrollStatement
      const previousSearch = this.searchFilter

      return [
        'staffId',
        'startDate',
        'endDate',
      ].some(field => currentForm[field] !== previousSearch[field])
    },

    handleChangeFilterDateRange(value, type) {
      this.isDisableButton = true
      this.isNeedToHidePayrollCalculationBlock = true

      // Skip date conversion for staff-select type
      if (type === 'staff-select') {
        return
      }

      const isStart = type === 'start'
      // Use convertDateToMomentUTC directly because date picker already returns the selected date
      // Using getStartOfTimezoneDateTS/getEndOfTimezoneDateTS would cause double timezone conversion
      const convertedValueToTs = isStart
        ? convertDateToMomentUTC(value).startOf('day').unix()
        : convertDateToMomentUTC(value).endOf('day').unix()

      if (isStart && value) {
        this.formAddPayrollStatement.startDateTs = convertedValueToTs

        // if the start date(the value) is before this month, set the end of the end date of the month of the start date
        if (moment(value).isBefore(moment().startOf('month'))) {
          const endDate = moment(value).endOf('month').toDate()
          this.formAddPayrollStatement.endDate = endDate
          this.formAddPayrollStatement.endDateTs = convertDateToMomentUTC(endDate).endOf('day').unix()
        }

        // if the start date(the value) is this month or later, set today
        if (moment(value).isSameOrAfter(moment().startOf('month'))) {
          const timezone = this.shop_data?.timezone
          const formatDate = moment().utcOffset(timezone).format('YYYY/MM/DD HH:mm:ss')
          const dateTimezone = new Date(formatDate)
          this.formAddPayrollStatement.endDate = dateTimezone
          this.formAddPayrollStatement.endDateTs = convertDateToMomentUTC(dateTimezone).endOf('day').unix()
        }
      } else if (!isStart && value) {
        this.formAddPayrollStatement.endDateTs = convertedValueToTs
      }
    },

    async onLoadBaseSetup() {
      await this.initializeItemSetup()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './statement-add.scss';
</style>
