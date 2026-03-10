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
import {
  getStartOfDate,
  getStartOfTimezoneDateTS,
  getEndOfTimezoneDateTS,
} from 'DatetimeHelpers'

// Components
import 'vue2-datepicker/index.css'
import ko from 'vue2-datepicker/locale/ko'
import en from 'vue2-datepicker/locale/en'
import DatePicker from 'vue2-datepicker'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

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

    disabledDate: {
      type:    Function,
      default: null,
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
  },

  created() {
    this.initializeRange()
  },

  methods: {
    initializeRange() {
      if (this.initialFromMonth && this.initialToMonth) {
        this.fromMonth = getStartOfDate(this.initialFromMonth, 'month')
        this.toMonth = getStartOfDate(this.initialToMonth, 'month')
      }
      else {
        // Default: current month for both
        const currentMonth = getStartOfDate(new Date(), 'month')
        this.fromMonth = currentMonth
        this.toMonth = currentMonth
      }

      this.emitValue()
    },

    isDateDisabled(date) {
      if (!this.disabledDate) return false
      return this.disabledDate(date)
    },

    onInputFromMonth(value) {
      if (!value) return

      if (value > this.toMonth) {
        this.toMonth = getStartOfDate(value, 'month')
      }

      this.emitValue()
    },

    onInputToMonth(value) {
      if (!value) return

      if (value < this.fromMonth) {
        this.fromMonth = getStartOfDate(value, 'month')
      }

      this.emitValue()
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
      this.fromMonth = getStartOfDate(fromDate, 'month')
      this.toMonth = getStartOfDate(toDate, 'month')
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

  &__separator {
    padding: 0 5px;
  }

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
