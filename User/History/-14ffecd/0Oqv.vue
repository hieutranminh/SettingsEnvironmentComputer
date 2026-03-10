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
import moment from 'moment'
import { convertDateFromLocalToTimezone } from 'CommonHelpers'

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
        fromDate:   null,
        toDate:     null,
        fromDateTs: 0,
        toDateTs:   0,
      },
    }
  },

  computed: {
    // Default: Last Month ~ (Last Month - 5)
    initialFromMonth() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).subtract(6, 'months').startOf('month').toDate()
    },

    initialToMonth() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).subtract(1, 'month').startOf('month').toDate()
    },

    currentMonthStart() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).startOf('month').toDate()
    },
  },

  methods: {
    // Disable current month and future
    isDateDisabled(date) {
      return date >= this.currentMonthStart
    },

    onDateRangeChange(value) {
      console.log('value', value)
      this.filter.fromDate = value.fromDate
      this.filter.toDate = value.toDate
      this.filter.fromDateTs = value.fromDateTs
      this.filter.toDateTs = value.toDateTs
    },

    validateMonthRange() {
      if (!this.filter.fromDate || !this.filter.toDate) return true

      const monthsDiff = moment(this.filter.toDate).diff(moment(this.filter.fromDate), 'months') + 1

      if (monthsDiff > MAX_MONTH_RANGE) {
        this._showDialogAlert(this.$i18n.t('month-range-picker.max-range-exceeded', { max: MAX_MONTH_RANGE }))
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
