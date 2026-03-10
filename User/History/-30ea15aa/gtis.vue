<template>
  <div>
    <!-- Range Selection Mode -->
    <v-date-picker
      v-if="isPeriodSelection"
      v-model="rangeModel"
      :locale="app_language"
      :class="calendarClass"
      :disabled-dates="disabledDates"
      is-range
      @change="onRangeInput"
    />

    <!-- Multiple Dates Selection Mode -->
    <v-calendar
      v-else
      :locale="app_language"
      :class="calendarClass"
      :attributes="attributes"
      :disabled-dates="disabledDates"
      @dayclick="onDayClick"
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
    <br>
    <pre>{{ rangeModel }}</pre>
    <pre>{{ fromDateTs }}</pre>
    <pre>{{ toDateTs }}</pre>
  </div>
</template>

<script>
import { DatePicker, Calendar } from 'v-calendar-v2'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import NavArrowIcon from 'Modules/calendar/components/work-calendar/partials/nav-arrow-icon/nav-arrow-icon.vue'
import { convertDateToTimeStamp } from 'CommonHelpers'

const MAX_DAYS_SELECTED = 30

export default {
  components: {
    'v-date-picker': DatePicker,
    'v-calendar':    Calendar,
    NavArrowIcon,
  },

  extends: ComponentBase,

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
        console.log('value', value)
        this.$emit('update:fromDateTs', value?.start ? convertDateToTimeStamp(value.start) : 0)
        this.$emit('update:toDateTs', value?.end ? convertDateToTimeStamp(value.end) : 0)
      },
    },
  },

  methods: {
    onRangeInput(value) {
      console.log('1', value)
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
          return this._showDialogAlert(this.$t('aha-ai.validate-you-can-select-up-to-30-days-at-once'))
        }

        updatedBookingDates.push(selectedDateTS)
      }

      this.$emit('update:bookingDates', updatedBookingDates)
    },
  },
}
</script>

<style lang="scss">
@import './calendar-booking-date.scss';
</style>
