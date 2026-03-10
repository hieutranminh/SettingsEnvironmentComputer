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
    <pre>{{ fromDateTS }}</pre>
    <pre>{{ toDateTS }}</pre>
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
    fromDateTS: {
      type:    Number,
      default: 0,
    },
    toDateTS: {
      type:    Number,
      default: 0,
    },
    bookingDates: {
      type:    Array,
      default: () => [],
    },
  },

  data() {
    return {
      localRangeModel: null,
      test:            {
        start: 1762992000000,
        end:   1763596800000,
      },
    }
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
        if (this.localRangeModel !== null) {
          return this.localRangeModel
        }

        if (!this.fromDateTS || !this.toDateTS) {
          return null
        }

        return {
          start: 1762992000000,
          end:   1763596800000,
        }
      },
      set(value) {
        console.log('value', value)
        this.localRangeModel = value
      },
    },
  },

  methods: {
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
