<template>
  <!-- ibsf: Incentives By Staff Filter -->
  <div class="ibsf">
    <form
      class="ibsf__form"
      @submit.prevent="submitForm"
    >
      <div class="form__inner">
        <!-- #️⃣ Visible on statement -->
        <span
          v-if="!isfilterDefault"
          class="form__title"
          :class="{'form__title--kr': app_language === options.language.korean}"
        >{{ $t("payroll.payroll-year-month") }}</span>

        <!-- Date Filter: Month or Date Range -->
        <div class="form__selection">
          <ul class="selection__list">
            <li class="selection__item">
              <b-radio
                v-model="filter.dateType"
                :value="filterByMonth"
                class="selection__control"
                @change="handleChangeFilterDateType"
              >
                {{ $t('general.month') }}
              </b-radio>
            </li>

            <li class="selection__item">
              <b-radio
                v-model="filter.dateType"
                :value="filterByDateRange"
                class="selection__control"
                @change="handleChangeFilterDateType"
              >
                {{ $t('general.date-range') }}
              </b-radio>
            </li>
          </ul>

          <template>
            <date-picker
              v-if="filter.dateType === filterByMonth"
              v-model="filter.payrollYearMonth"
              type="month"
              :lang="locale[app_language]"
              :editable="false"
              :clearable="false"
              input-class="select-month"
              popup-class="date-picker-popup"
              @input="handleChangeFilterDateMonth"
            />

            <!-- Date Range -->
            <div
              v-else
              class="selection__date-range"
            >
              <aha-date-picker
                v-model="filter.fromDate"
                :popover-align="isMobileDevice ? 'left' : 'right'"
                @input="(value) => handleChangeFilterDateRange(value, 'start')"
              />
              <span class="mx-1">~</span>
              <aha-date-picker
                v-model="filter.toDate"
                :popover-align="isMobileDevice ? 'right' : 'left'"
                @input="(value) => handleChangeFilterDateRange(value, 'end')"
              />
            </div>
          </template>
        </div>

        <!-- Select Staff -->
        <select-staff @selected-staff="onSelectedStaff" />
      </div>

      <div class="ibsf__search">
        <aha-button
          type="submit"
          variant="blue"
          class="search__btn"
        >
          <i class="btn-search-white" />
          <span>{{ $t("general.search") }}</span>
        </aha-button>
      </div>
    </form>
  </div>
</template>

<script>
// Utils
import moment from 'moment'
import { ApiError } from 'HTTPHelpers'
import { mapGetters } from 'vuex'
import {
  getDiffDateRange,
  convertDateToTimezone,
  convertTimestampToUTCDate,
  getEndOfMonthTSBySubtract,
  getStartOfMonthTSBySubtract,
  getStartOfTimezoneDateTS,
  getEndOfTimezoneDateTS,
  convertDateToMomentUTC,
} from 'DatetimeHelpers'
import { convertDateToTimeStamp, convertDateFromLocalToTimezone } from 'CommonHelpers'

// Mixins
import StaffMixin from 'Mixins/staff-mixin.js'

// Constants
import { options } from 'OptionsHelpers'
import { common_options } from 'Options/common-options'

// Components
import 'vue2-datepicker/index.css'
import ko from 'vue2-datepicker/locale/ko'
import en from 'vue2-datepicker/locale/en'
import DatePicker from 'vue2-datepicker'
import ComponentBase from 'Components/common/component-base/component-base.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import InputDateRangeTs from 'CommonComponents/form/input/input-date-range-ts/input-date-range-ts.vue'
import SelectStaff from 'Modules/staff/components/payroll-statement/components/filter/select-staff/select-staff.vue'
import InputDateRangeByDateType from 'Components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'

export default {
  components: {
    DatePicker,
    SelectStaff,
    AhaDatePicker,
    InputDateRangeTs,
    InputDateRangeByDateType,
  },

  extends: ComponentBase,

  mixins: [StaffMixin],

  props: {
    filterType: {
      type:    String,
      default: 'default',
    },
  },

  data() {
    return {
      options,
      filter: {
        staffId:           -1,
        payrollYearMonth:  convertDateFromLocalToTimezone(new Date()),
        dateType:          common_options.date_type.month,
        fromDateByMonth:   convertTimestampToUTCDate(getStartOfMonthTSBySubtract(0)),
        toDateByMonth:     convertTimestampToUTCDate(getEndOfMonthTSBySubtract(0)),
        fromDateTsByMonth: getStartOfMonthTSBySubtract(0),
        toDateTsByMonth:   getEndOfMonthTSBySubtract(0),
        fromDate:          convertTimestampToUTCDate(getStartOfMonthTSBySubtract(0)),
        toDate:            convertTimestampToUTCDate(getEndOfTimezoneDateTS(new Date())),
        fromDateTs:        getStartOfMonthTSBySubtract(0),
        toDateTs:          getEndOfTimezoneDateTS(new Date()),
      },
      staffs:                 [],
      filterDateRangeisValid: true,
      locale:                 {
        'en': en,
        'ko': ko,
      },
    }
  },

  computed: {
    ...mapGetters('device', [
      'isMobileDevice',
    ]),

    language() {
      return this.app_language
    },

    isfilterDefault() {
      return this.filterType === 'default'
    },

    filterByMonth() {
      return common_options.date_type.month
    },

    filterByDateRange() {
      return common_options.date_type.date_range
    },

    staffOptions() {
      return [{ id: 0, aliasname: this.$t('general.all') }, ...this.staffs]
    },

    monthOptions() {
      return Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        text:  String(i + 1).padStart(2, '0'),
      }))
    },

    yearOptions() {
      const currentYear = convertDateToTimezone(new Date()).getFullYear()
      return Array.from({ length: 11 }, (_, i) => ({
        value: currentYear - i,
        text:  currentYear - i,
      }))
    },

    isDateRangeExceed1Month() {
      if(this.filter.dateType === this.filterByMonth) {
        return getDiffDateRange(convertDateToTimeStamp(this.filter.fromDateByMonth), convertDateToTimeStamp(this.filter.toDateByMonth), 'month') > 1
      }
      return getDiffDateRange(convertDateToTimeStamp(this.filter.fromDate), convertDateToTimeStamp(this.filter.toDate), 'month') > 1
    },

    dateRangeValidations() {
      let errors = []
      if (this.$refs.inputDateRangeByDateType?.errors) {
        const inputDateRangeByDateTypeErrors = this.$refs.inputDateRangeByDateType.errors || []

        errors = [...inputDateRangeByDateTypeErrors]
      }

      if (this.isDateRangeExceed1Month) {
        errors.push(this.$t('report.error_date_range_can_not_exceed_1_month'))
      }

      if (!this.filterDateRangeisValid) {
        errors.push(this.$t('input-date-range.end-date-can-not-before-start-date'))
      }

      return errors
    },

    isInValidDateRange() {
      return !!this.dateRangeValidations.length
    },

    payrollYearMonthOptions() {
      const localDate = convertDateFromLocalToTimezone(new Date())
      const currentYear = localDate.getFullYear()
      const currentMonth = localDate.getMonth() // 0-indexed
      let months = []

      for (let i = 0; i < 12; i++) {
        const date = moment(localDate).year(currentYear).month(currentMonth - i)
        months.push(date.format('YYYY-MM'))
      }

      return months
    },
  },

  created() {
    this.loadStaffItemsAsync()
  },

  mounted() {
    this.$nextTick(() => {
      this.emitInitialFilter()
    })
  },

  methods: {
    emitInitialFilter() {
      this.$emit('update-filter', { ...this.filter })
    },

    async loadStaffItemsAsync() {
      try {
        const response = await this.getStaffsAsyncMixin()
        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.staffs = response.data?.items || []
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleChangeFilterDateType() {
      this.$emit('update-filter', this.filter)
    },

    handleChangeFilterDateMonth(value) {
      this.filter.fromDateByMonth = value
      this.filter.toDateByMonth = moment(value).endOf('day').toDate()

      this.filter.fromDateTsByMonth = getStartOfTimezoneDateTS(value, 'month')
      this.filter.toDateTsByMonth = getEndOfTimezoneDateTS(value, 'month')

      this.$emit('update-filter', this.filter)
    },

    setFilterDateRangeStatus(isValid) {
      this.filterDateRangeisValid = isValid
    },

    validateDateRange(value, isStart) {
      //by date range
      if(isStart) {
        this.setFilterDateRangeStatus(value <= this.filter.toDateTs)
      } else {
        this.setFilterDateRangeStatus(this.filter.fromDateTs < value)
      }
    },

    handleChangeFilterDateRange(value, type) {
      const isStart = type === 'start'
      const convertedValueToTs = isStart ? getStartOfTimezoneDateTS(value) : getEndOfTimezoneDateTS(value)
      if (isStart) {
        this.validateDateRange(convertedValueToTs, isStart)
        this.filter.fromDateTs = convertedValueToTs
      } else {
        this.validateDateRange(convertedValueToTs, isStart)
        this.filter.toDateTs = convertedValueToTs
      }

      this.$emit('update-filter', this.filter)
    },

    onSelectedStaff({ staffId }) {
      if (!staffId) {
        return
      }

      this.filter.staffId = staffId
      this.$emit('update-filter', this.filter)
    },

    submitForm() {
      if (this.filter.dateType === common_options.date_type.date_range && this.isInValidDateRange) {
        this._showDialogAlert(this.dateRangeValidations)
        return
      }
      this.$emit('search-payroll')
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./incentives-by-staff-filter.scss";
</style>
