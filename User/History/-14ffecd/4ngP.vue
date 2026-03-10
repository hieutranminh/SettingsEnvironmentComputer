<template>
  <div class="report-filter">
    <div class="row">
      <div class="col-12 col-md-10">
        <div class="report-filter__form">
          <month-range-picker
            :label="$t('input-date-range.date-range')"
            :initial-from-month="initialFromMonth"
            :initial-to-month="initialToMonth"
            :disable-current-and-future="true"
            :max-month-range="12"
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

export default {
  components: {
    MonthRangePicker,
  },

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
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).subtract(6, 'months').startOf('month').toDate()
    },

    initialToMonth() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).subtract(1, 'month').startOf('month').toDate()
    },
  },

  methods: {
    onDateRangeChange(value) {
      this.filter.fromDateTs = value.fromDateTs
      this.filter.toDateTs = value.toDateTs
    },

    onSearch() {
      this.$emit('search', { ...this.filter })
    },
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis-filter.scss';
</style>
