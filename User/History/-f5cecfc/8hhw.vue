<template>
  <div class="month-range-picker">
    <label
      v-if="showLabel"
      class="month-range-picker__label"
    >{{ label }}</label>
    <div class="month-range-picker__inputs">
      <date-picker
        v-model="fromMonth"
        type="month"
        :lang="locale[language]"
        :editable="false"
        :clearable="false"
        :disabled-date="disabledFromDate"
        input-class="month-range-picker__input"
        popup-class="date-picker-popup"
        @input="onInputFromMonth"
      />
      <span class="month-range-picker__separator">~</span>
      <date-picker
        v-model="toMonth"
        type="month"
        :lang="locale[language]"
        :editable="false"
        :clearable="false"
        :disabled-date="disabledToDate"
        input-class="month-range-picker__input"
        popup-class="date-picker-popup"
        @input="onInputToMonth"
      />
    </div>
  </div>
</template>

<script>
// Utilities
import moment from 'moment'
import { convertDateFromLocalToTimezone } from 'CommonHelpers'
import { getEndOfTimezoneDateTS, getStartOfTimezoneDateTS } from 'DatetimeHelpers'

// Components
import 'vue2-datepicker/index.css'
import ko from 'vue2-datepicker/locale/ko'
import en from 'vue2-datepicker/locale/en'
import DatePicker from 'vue2-datepicker'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Constants
const MAX_MONTH_RANGE = 12

export default {
  components: {
    DatePicker,
  },

  extends: ComponentBase,

  props: {
    label: {
      type:    String,
      default: '',
    },

    showLabel: {
      type:    Boolean,
      default: true,
    },

    value: {
      type:    Object,
      default: null,
    },

    // Initial from month (Date object or null)
    initialFromMonth: {
      type:    Date,
      default: null,
    },

    // Initial to month (Date object or null)
    initialToMonth: {
      type:    Date,
      default: null,
    },

    // Whether to disable current month and future months
    disableCurrentAndFuture: {
      type:    Boolean,
      default: true,
    },

    // Maximum months range allowed (0 = no limit)
    maxMonthRange: {
      type:    Number,
      default: MAX_MONTH_RANGE,
    },
  },

  data() {
    return {
      fromMonth: null,
      toMonth:   null,
      locale:    {
        'en': en,
        'ko': ko,
      },
    }
  },

  computed: {
    language() {
      return this.app_language
    },

    // Current month start (for disabling)
    currentMonthStart() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).startOf('month').toDate()
    },

    // Last month (for default value)
    lastMonth() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).subtract(1, 'month').startOf('month').toDate()
    },
  },

  created() {
    this.initializeRange()
  },

  methods: {
    initializeRange() {
      // Use initial props if provided, otherwise use last month as default
      if (this.initialFromMonth && this.initialToMonth) {
        this.fromMonth = moment(this.initialFromMonth).startOf('month').toDate()
        this.toMonth = moment(this.initialToMonth).startOf('month').toDate()
      }
      else {
        // Default: last month for both from and to
        this.fromMonth = this.lastMonth
        this.toMonth = this.lastMonth
      }

      this.emitValue()
    },

    // Disable current month and later for From picker
    disabledFromDate(date) {
      if (!this.disableCurrentAndFuture) return false
      return date >= this.currentMonthStart
    },

    // Disable current month and later for To picker
    disabledToDate(date) {
      if (!this.disableCurrentAndFuture) return false
      return date >= this.currentMonthStart
    },

    onInputFromMonth(value) {
      if (!value) return

      if (!this.validateMonthRange(value, this.toMonth)) {
        // Revert to previous valid value
        this.$nextTick(() => {
          this.fromMonth = moment(this.toMonth).subtract(this.maxMonthRange - 1, 'months').startOf('month').toDate()
        })
        return
      }

      // If from > to, adjust to = from
      if (value > this.toMonth) {
        this.toMonth = moment(value).toDate()
      }

      this.emitValue()
    },

    onInputToMonth(value) {
      if (!value) return

      if (!this.validateMonthRange(this.fromMonth, value)) {
        // Revert to previous valid value
        this.$nextTick(() => {
          this.toMonth = moment(this.fromMonth).add(this.maxMonthRange - 1, 'months').startOf('month').toDate()
          // Make sure toMonth doesn't exceed last month if disabled
          if (this.disableCurrentAndFuture && this.toMonth >= this.currentMonthStart) {
            this.toMonth = moment(this.currentMonthStart).subtract(1, 'month').startOf('month').toDate()
          }
        })
        return
      }

      // If to < from, adjust from = to
      if (value < this.fromMonth) {
        this.fromMonth = moment(value).toDate()
      }

      this.emitValue()
    },

    validateMonthRange(fromDate, toDate) {
      if (!fromDate || !toDate) return true
      if (this.maxMonthRange === 0) return true // No limit

      const fromMoment = moment(fromDate).startOf('month')
      const toMoment = moment(toDate).startOf('month')

      // Calculate months difference
      const monthsDiff = toMoment.diff(fromMoment, 'months') + 1

      if (monthsDiff > this.maxMonthRange) {
        this._showDialogAlert(this.$i18n.t('month-range-picker.max-range-exceeded', { max: this.maxMonthRange }))
        return false
      }

      return true
    },

    emitValue() {
      const fromDateTs = getStartOfTimezoneDateTS(this.fromMonth, 'month')
      const toDateTs = getEndOfTimezoneDateTS(this.toMonth, 'month')

      const result = {
        from_date:    this.fromMonth,
        to_date:      this.toMonth,
        from_date_ts: fromDateTs,
        to_date_ts:   toDateTs,
      }

      this.$emit('input', result)
    },

    // Public method to set range programmatically
    setRange(fromDate, toDate) {
      this.fromMonth = moment(fromDate).startOf('month').toDate()
      this.toMonth = moment(toDate).startOf('month').toDate()
      this.emitValue()
    },
  },
}
</script>

<style lang="scss">
.month-range-picker {
  display: flex;
  align-items: center;
  gap: 10px;

  &__label {
    font-weight: 500;
    white-space: nowrap;
  }

  &__inputs {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  &__input {
    height: 30px;
    width: 110px;
    padding: 0 5px;
    border: 1px solid $gray;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;

    &:focus {
      outline: none;
      border-color: $blue;
    }
  }

  &__separator {
    padding: 0 5px;
    color: $dark-gray;
  }
}

// Override date picker styles
.month-range-picker {
  .mx-datepicker {
    width: auto;
  }

  .mx-input-wrapper {
    .mx-input {
      height: 30px;
      width: 110px;
      padding: 0 30px 0 10px;
      border: 1px solid $gray;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: $blue;
      }
    }

    .mx-icon-calendar {
      right: 8px;
    }
  }
}
</style>
