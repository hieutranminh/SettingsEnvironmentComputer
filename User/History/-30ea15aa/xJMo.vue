<template>
  <div>
    <!-- Range Selection Mode -->
    <v-date-picker
      v-if="isPeriodSelection"
      :key="datePickerKey"
      v-model="rangeModel"
      :locale="app_language"
      :class="calendarClass"
      :disabled-dates="disabledDates"
      :from-page="currentPage"
      is-range
      @update:from-page="onPageChange"
    />

    <!-- Multiple Dates Selection Mode -->
    <v-calendar
      v-else
      :locale="app_language"
      :class="calendarClass"
      :attributes="attributes"
      :disabled-dates="disabledDates"
      :from-page="currentPage"
      @dayclick="onDayClick"
      @update:from-page="onPageChange"
    >
      <!-- Nav left arrow -->
      <template #nav-left-button>
        <nav-arrow-icon name="left-arrow" />
      </template>

      <!-- Nav right arrow -->
      <template #nav-right-button>
        <nav-arrow-icon name="right-arrow" />
      </template>
    </v-calendar>
  </div>
</template>

<script>
import { DatePicker, Calendar } from 'v-calendar-v2'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import NavArrowIcon from 'Modules/calendar/components/work-calendar/partials/nav-arrow-icon/nav-arrow-icon.vue'
import { convertDateToTimeStamp } from 'CommonHelpers'
import { getDiffDateRange } from 'DatetimeHelpers'

const MAX_DAYS_SELECTED = 30
const LIMIT_DAYS_PERIOD_SELECTION = 29

export default {
  components: {
    'v-date-picker': DatePicker,
    'v-calendar':    Calendar,
    NavArrowIcon,
  },

  extends: ComponentBase,

  data() {
    return {
      datePickerKey: 0,
      currentPage:   this.getInitialPage(),
    }
  },

  props: {
    isPeriodSelection: {
      type:    Boolean,
      default: false,
    },
    fromDateTs: {
      type:    Number,
      default: 0,
    },
    toDateTs: {
      type:    Number,
      default: 0,
    },
    bookingDates: {
      type:    Array,
      default: () => [],
    },
  },

  computed: {
    calendarClass() {
      return ['calendar-booking-date', {
        'calendar-booking-date--mobile': this.isMobileDevice,
      }]
    },

    attributes() {
      return [
        {
          key:       'multiple-dates',
          highlight: {
            color:        'blue',
            fillMode:     'solid',
            contentStyle: {
              fontWeight: '500',
            },
          },
          // Because the v-calendar component expects milliseconds,
          // we need to convert the timestamp to milliseconds
          dates: this.bookingDates.map(dateTS => dateTS * 1000),
        },
      ]
    },

    disabledDates() {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(23, 59, 59, 999)

      return { start: null, end: yesterday }
    },

    isMaxDaysSelected() {
      return this.bookingDates.length >= MAX_DAYS_SELECTED
    },

    rangeModel: {
      get() {
        if (!this.fromDateTs || !this.toDateTs) {
          return null
        }

        return {
          start: this.fromDateTs * 1000,
          end:   this.toDateTs * 1000,
        }
      },
      set(value) {
        const fromDateTs = value?.start ? convertDateToTimeStamp(value.start) : 0
        const toDateTs = value?.end ? convertDateToTimeStamp(value.end) : 0

        // Validate range if both dates are provided
        if (fromDateTs && toDateTs) {
          const daysDifference = getDiffDateRange(fromDateTs, toDateTs, 'day')

          if (daysDifference > LIMIT_DAYS_PERIOD_SELECTION) {
            this._showDialogAlert(this.$t('aha-ai.validate-you-can-select-up-to-30-days-at-once'))
            // Force re-render by changing key to reset v-date-picker to previous state
            this.datePickerKey += 1
            return
          }
        }

        this.$emit('update:fromDateTs', fromDateTs)
        this.$emit('update:toDateTs', toDateTs)
      },
    },
  },

  watch: {
    bookingDates: {
      handler(newBookingDates) {
        // Update currentPage when bookingDates changes and has data
        if (newBookingDates && newBookingDates.length > 0) {
          const firstDate = new Date(newBookingDates[0] * 1000)
          this.currentPage = { month: firstDate.getMonth() + 1, year: firstDate.getFullYear() }
        }
      },
      immediate: false,
    },
  },

  methods: {
    getInitialPage() {
      // If bookingDates has data, use the first date to set the initial page
      if (this.bookingDates && this.bookingDates.length > 0) {
        const firstDate = new Date(this.bookingDates[0] * 1000)
        return { month: firstDate.getMonth() + 1, year: firstDate.getFullYear() }
      }

      // Otherwise, use the current date
      const now = new Date()
      return { month: now.getMonth() + 1, year: now.getFullYear() }
    },

    onDayClick(day) {
      if (!day || !day.date || day.isDisabled) return

      const selectedDateTS = convertDateToTimeStamp(day.date)
      const updatedBookingDates = [...this.bookingDates]
      const index = updatedBookingDates.findIndex(dateTS => dateTS === selectedDateTS)

      if (index > -1) {
        updatedBookingDates.splice(index, 1)
      } else {
        if (this.isMaxDaysSelected) {
          this._showDialogAlert(this.$t('aha-ai.validate-you-can-select-up-to-30-days-at-once'))
          return
        }

        updatedBookingDates.push(selectedDateTS)
      }

      this.$emit('update:bookingDates', updatedBookingDates)
    },

    onPageChange(page) {
      this.currentPage = { month: page.month, year: page.year }
    },
  },
}
</script>

<style lang="scss">
@import './calendar-booking-date.scss';
</style>
