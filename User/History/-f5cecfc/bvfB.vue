<template>
  <div class="month-range-picker">
    <label
      v-if="showLabel"
      class="month-range-picker__label"
    >
      {{ label }}
    </label>
    <div class="month-range-picker__inputs">
      <date-picker
        v-model="fromMonth"
        type="month"
        :lang="locale[language]"
        :editable="false"
        :clearable="false"
        :disabled-date="isDateDisabled"
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
        :disabled-date="isDateDisabled"
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
const DEFAULT_MAX_MONTH_RANGE = 12

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

    initialFromMonth: {
      type:    Date,
      default: null,
    },

    initialToMonth: {
      type:    Date,
      default: null,
    },

    disableCurrentAndFuture: {
      type:    Boolean,
      default: true,
    },

    // 0 = no limit
    maxMonthRange: {
      type:    Number,
      default: DEFAULT_MAX_MONTH_RANGE,
    },
  },

  data() {
    return {
      fromMonth: null,
      toMonth:   null,
      locale:    {
        en,
        ko,
      },
    }
  },

  computed: {
    language() {
      return this.app_language
    },

    currentMonthStart() {
      const now = convertDateFromLocalToTimezone(new Date())
      return moment(now).startOf('month').toDate()
    },
  },

  created() {
    this.initializeRange()
  },

  methods: {
    initializeRange() {
      if (this.initialFromMonth && this.initialToMonth) {
        this.fromMonth = moment(this.initialFromMonth).startOf('month').toDate()
        this.toMonth = moment(this.initialToMonth).startOf('month').toDate()
      }
      else {
        // Default: last month for both
        const lastMonth = moment(this.currentMonthStart).subtract(1, 'month').toDate()
        this.fromMonth = lastMonth
        this.toMonth = lastMonth
      }

      this.emitValue()
    },

    isDateDisabled(date) {
      if (!this.disableCurrentAndFuture) return false
      return date >= this.currentMonthStart
    },

    onInputFromMonth(value) {
      if (!value) return

      if (!this.validateMonthRange(value, this.toMonth)) {
        this.$nextTick(() => {
          this.fromMonth = moment(this.toMonth).subtract(this.maxMonthRange - 1, 'months').startOf('month').toDate()
        })
        return
      }

      if (value > this.toMonth) {
        this.toMonth = moment(value).startOf('month').toDate()
      }

      this.emitValue()
    },

    onInputToMonth(value) {
      if (!value) return

      if (!this.validateMonthRange(this.fromMonth, value)) {
        this.$nextTick(() => {
          this.toMonth = moment(this.fromMonth).add(this.maxMonthRange - 1, 'months').startOf('month').toDate()
          if (this.disableCurrentAndFuture && this.toMonth >= this.currentMonthStart) {
            this.toMonth = moment(this.currentMonthStart).subtract(1, 'month').startOf('month').toDate()
          }
        })
        return
      }

      if (value < this.fromMonth) {
        this.fromMonth = moment(value).startOf('month').toDate()
      }

      this.emitValue()
    },

    validateMonthRange(fromDate, toDate) {
      if (!fromDate || !toDate) return true
      if (this.maxMonthRange === 0) return true

      const monthsDiff = moment(toDate).startOf('month').diff(moment(fromDate).startOf('month'), 'months') + 1

      if (monthsDiff > this.maxMonthRange) {
        this._showDialogAlert(this.$i18n.t('month-range-picker.max-range-exceeded', { max: this.maxMonthRange }))
        return false
      }

      return true
    },

    emitValue() {
      this.$emit('input', {
        fromDate:   this.fromMonth,
        toDate:     this.toMonth,
        fromDateTs: getStartOfTimezoneDateTS(this.fromMonth, 'month'),
        toDateTs:   getEndOfTimezoneDateTS(this.toMonth, 'month'),
      })
    },

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
