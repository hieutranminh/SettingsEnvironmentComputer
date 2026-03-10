<template>
  <div class="report-filter">
    <div class="row">
      <div class="col-12 col-md-10">
        <div class="report-filter__form">
          <month-range-picker
            :label="$t('input-date-range.date-range')"
            :initial-from-month="initialFromMonth"
            :initial-to-month="initialToMonth"
            :disabled-date="isDateDisabled"
            @input="onDateRangeChange"
          />
        </div>
      </div>
      <div class="col-12 col-md-2">
        <div class="report-filter__actions">
          <aha-button
            variant="blue"
            class="report-filter__btn-search"
            @click.prevent="onSearch"
          >
            <i class="btn-search-white" />
            <span>{{ $t('general.search') }}</span>
          </aha-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Utilities
import {
  getStartOfDate,
  subtractMonths,
  getDiffDateRange,
  getStartOfTimezoneDateTS,
  getEndOfTimezoneDateTS,
} from 'DatetimeHelpers'

// Components
import MonthRangePicker from 'CommonComponents/month-range-picker/month-range-picker.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Constants
const MAX_MONTH_RANGE = 12

export default {
  components: {
    MonthRangePicker,
  },

  extends: ComponentBase,

  data() {
    return {
      filter: {
        fromDateTs: 0,
        toDateTs:   0,
      },
    }
  },

  computed: {
    // Default: Last Month ~ (Last Month - 5)
    initialFromMonth() {
      return getStartOfDate(subtractMonths(new Date(), 6), 'month')
    },

    initialToMonth() {
      return getStartOfDate(subtractMonths(new Date(), 1), 'month')
    },

    currentMonthStart() {
      return getStartOfDate(new Date(), 'month')
    },
  },

  created() {
    this.initDefaultFilter()
  },

  methods: {
    initDefaultFilter() {
      this.filter.fromDateTs = getStartOfTimezoneDateTS(this.initialFromMonth, 'month')
      this.filter.toDateTs = getEndOfTimezoneDateTS(this.initialToMonth, 'month')
      this.$emit('init', {
        fromDateTs: this.filter.fromDateTs,
        toDateTs:   this.filter.toDateTs,
      })
    },

    // Disable current month and future
    isDateDisabled(date) {
      return date >= this.currentMonthStart
    },

    onDateRangeChange(value) {
      this.filter.fromDateTs = value.fromDateTs
      this.filter.toDateTs = value.toDateTs
    },

    validateMonthRange() {
      if (!this.filter.fromDateTs || !this.filter.toDateTs) return true

      const monthsDiff = getDiffDateRange(this.filter.fromDateTs, this.filter.toDateTs, 'months')

      if (monthsDiff >= MAX_MONTH_RANGE) {
        this._showDialogAlert(this.$t('report.error_date_range_can_not_exceed_1_year'))
        return false
      }

      return true
    },

    onSearch() {
      if (!this.validateMonthRange()) return

      this.$emit('search', {
        fromDateTs: this.filter.fromDateTs,
        toDateTs:   this.filter.toDateTs,
      })
    },
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis-filter.scss';
</style>
