<template>
  <b-modal
    ref="modalAhaAiSearchAvailableTimes"
    :visible="visible"
    :modal-class="modalClass"
    :title="$t('aha-ai.title')"

    static
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @show="onShow"
    @hide="onHide"
  >
    <!-- Top Header -->
    <div class="modal-aha-ai-search-available-times-top">
      <b>{{ $t('aha-ai.search-available-times') }}</b>
      <span
        :class="actionVoiceClass"
        @click.prevent="onShowAhaAi"
      >
        <b-icon-mic />
      </span>
    </div>

    <!-- Body -->
    <div class="modal-aha-ai-search-available-times-body">
      <!-- Left: Calendar -->
      <div class="modal-aha-ai-search-available-times-body__left">
        <div class="booking-date-section">
          <b>{{ $t('aha-ai.booking-date') }}</b>
          <a-checkbox
            v-model="filters.isPeriodSelection"
            @change="onChangeIsPeriodSelection"
          >
            {{ $t('aha-ai.select-period') }}
          </a-checkbox>
        </div>

        <!-- Calendar -->
        <calendar-booking-date
          :key="calendarKey"
          :is-period-selection="filters.isPeriodSelection"
          :from-date-ts="filters.fromDateTS"
          :to-date-ts="filters.toDateTS"
          :booking-dates="filters.bookingDates"
          @update:fromDateTs="filters.fromDateTS = $event"
          @update:toDateTs="filters.toDateTS = $event"
          @update:bookingDates="filters.bookingDates = $event"
        />
      </div>

      <!-- Right: Filters -->
      <div class="modal-aha-ai-search-available-times-body__right">
        <!-- Resource Filter -->
        <div class="filter-group">
          <b>{{ $t('aha-ai.resource') }}</b>
          <select-multi-resource-checkbox
            v-model="filters.bookingResourceSetupIds"
            class="select-resource-checkbox"
            :placeholder="$t('aha-ai.select-resource')"
            :options="resourcesOptions"
            :disabled="isDisabledResourceSelection"
          />
        </div>

        <!-- Booking Start Time Filter -->
        <div class="filter-group">
          <b>{{ $t('aha-ai.booking-start-time') }}</b>
          <a-multi-select
            v-model="bookingStartTimeOfDayModel"
            :options="bookingStartTimeOfDayOptions"
            :multiple="false"
            :searchable="false"
            :show-labels="false"
            :allow-empty="false"
            label="text"
            track-by="value"
            @select="onChangeBookingStartTime"
          />

          <div
            v-if="filters.bookingStartTime.timeOfDay === TIME_OF_DAY.MANUAL_SELECTION"
            class="booking-start-time-manual-selection"
          >
            <a-multi-select
              v-model="startTimeModel"
              :options="timeOptions"
              :multiple="false"
              :searchable="false"
              :show-labels="false"
              :allow-empty="false"
              label="text"
              track-by="value"
            />
            <span>~</span>
            <a-multi-select
              v-model="endTimeModel"
              :options="timeOptions"
              :multiple="false"
              :searchable="false"
              :show-labels="false"
              :allow-empty="false"
              label="text"
              track-by="value"
            />
          </div>
        </div>

        <!-- Estimated Time Filter -->
        <div class="filter-group">
          <b>{{ $t('aha-ai.estimated-time') }}</b>
          <estimated-time v-model="filters.estimatedTime" />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="modal-footer modal-aha-ai-search-available-times-footer">
      <a-button
        variant="primary"
        @click="onConfirm"
      >
        {{ $t('general.confirm') }}
      </a-button>

      <a-button
        variant="blue-light"
        @click="onCancel"
      >
        {{ $t('general.cancel') }}
      </a-button>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import multiselect from 'vue-multiselect'
// Utils
import { formatTimeBasedOnMinutes, roundDownTo60Minutes, roundUpEstimatedTime } from 'Modules/calendar/utils/index'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// APIs
import { getAvailableTimes } from 'Modules/api/aha-ai/aha-ai-api'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ACheckbox from 'Modules/aha/a-checkbox/a-checkbox.vue'
import AMultiSelect from 'Modules/aha/a-multi-select/a-multi-select.vue'
import SelectMultiResourceCheckbox from 'CommonComponents/form/select/select-multi-resource-checkbox/select-multi-resource-checkbox.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import EstimatedTime from './partials/estimated-time/estimated-time.vue'
import CalendarBookingDate from './partials/calendar-booking-date/calendar-booking-date.vue'
import { BIconMic } from 'bootstrap-vue'
// Constants
import { TIME_OF_DAY, MINUTES_OF_24H } from 'Constant'
// Helpers
import { convertHoursToMinutes } from 'CommonHelpers'

const DEFAULT_TIME_SLOT = 60
const NEXT_DAY_12H_IN_MINUTES = 2160

export default {
  components: {
    multiselect,
    BIconMic,
    AButton,
    ACheckbox,
    AMultiSelect,
    SelectMultiResourceCheckbox,
    EstimatedTime,
    CalendarBookingDate,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
    savedFilters: {
      type:    Object,
      default: null,
    },
    isSearchAvailableTimesFromBookingItems: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      TIME_OF_DAY,
      calendarKey: 0,

      filters: {
        shopId:            0,
        isPeriodSelection: false,
        fromDateTS:        0,
        toDateTS:          0,
        bookingDates:      [],
        estimatedTime:     0,
        bookingStartTime:  {
          timeOfDay: TIME_OF_DAY.ALL,
          startTime: 0,
          endTime:   0,
        },
        bookingResourceSetupIds: [],
      },
    }
  },

  computed: {
    ...mapState('_calendar', [
      'bookingResources',
    ]),

    ...mapState('_calendar/bookingAction', [
      'booking',
    ]),

    ...mapGetters('cache/booking', [
      'allCalendarSetup',
    ]),

    shopOpeningHours() {
      return this.allCalendarSetup?.booking_opening_hours_setup?.opening_hours ?? []
    },

    shopEarliestStartTimeInMinutes() {
      if (!this.shopOpeningHours.length) {
        return this.firstMinutesTimeSlot
      }

      const sortedStartTimes = this.shopOpeningHours
        .map(item => convertHoursToMinutes(item.start_time))
        .sort((a, b) => a - b)

      return roundDownTo60Minutes(sortedStartTimes[0])
    },

    shopLatestFinishTimeInMinutes() {
      if (!this.shopOpeningHours.length) {
        return this.firstMinutesTimeSlot + DEFAULT_TIME_SLOT
      }

      const finishTimesInMinutes = this.shopOpeningHours.map(item => {
        const finishTimeInMinutes = convertHoursToMinutes(item.finish_time)
        return item.cross_date ? finishTimeInMinutes + MINUTES_OF_24H : finishTimeInMinutes
      })

      const sortedFinishTimes = finishTimesInMinutes.sort((a, b) => b - a)
      return roundDownTo60Minutes(sortedFinishTimes[0])
    },

    modalClass() {
      return ['modal-aha-ai-search-available-times', {
        'modal-aha-ai-search-available-times--mobile': this.isMobileDevice,
      }]
    },

    resourcesOptions() {
      return this.bookingResources.map(resource => ({ value: resource.id, text: resource.resource_name }))
    },

    bookingStartTimeOfDayOptions() {
      return [
        { text: this.$t('general.all'), value: TIME_OF_DAY.ALL },
        { text: this.$t('aha-ai.morning'), value: TIME_OF_DAY.MORNING },
        { text: this.$t('aha-ai.afternoon'), value: TIME_OF_DAY.AFTERNOON },
        { text: this.$t('aha-ai.evening'), value: TIME_OF_DAY.EVENING },
        { text: this.$t('aha-ai.manual-selection'), value: TIME_OF_DAY.MANUAL_SELECTION },
      ]
    },

    bookingStartTimeOfDayModel: {
      get() {
        return this.bookingStartTimeOfDayOptions.find(option => option.value === this.filters.bookingStartTime.timeOfDay)
      },
      set(option) {
        this.filters.bookingStartTime.timeOfDay = option.value
      },
    },

    startTimeModel: {
      get() {
        const value = this.filters.bookingStartTime.startTime
        if (value === null || value === undefined || value === '') {
          return null
        }
        return this.timeOptions.find(option => option.value === value) || null
      },
      set(option) {
        this.filters.bookingStartTime.startTime = option ? option.value : 0
      },
    },

    endTimeModel: {
      get() {
        const value = this.filters.bookingStartTime.endTime
        if (value === null || value === undefined || value === '') {
          return null
        }
        return this.timeOptions.find(option => option.value === value) || null
      },
      set(option) {
        this.filters.bookingStartTime.endTime = option ? option.value : 0
      },
    },

    timeOptions() {
      return this.generateTimeOptionsFromRange()
    },

    firstMinutesTimeSlot() {
      return this.timeOptions?.length > 0 ? this.timeOptions[0].value : 0
    },

    bookedResources() {
      return this.booking?.bookedResources ?? []
    },

    isDisabledResourceSelection() {
      const filteredBookedResources = this.bookedResources.filter(bookedResource => bookedResource.bookingResourceSetupId)
      return this.isSearchAvailableTimesFromBookingItems && filteredBookedResources.length > 1
    },

    actionVoiceClass() {
      return ['action action--voice', {
        'action--disabled': this.isDisabledResourceSelection,
      }]
    },
  },

  methods: {
    onShow() {
      this.initialFilters()
      // Force re-mount calendar to recalculate disabledDates with current date
      this.calendarKey += 1
    },

    onHide() {
      this.$emit('cancel')
    },

    onCancel() {
      this.$refs.modalAhaAiSearchAvailableTimes.hide()
    },

    validateFilters() {
      if (!this.filters.bookingResourceSetupIds.length) {
        return this.$t('bookings.resource-is-required')
      }

      const { startTime, endTime, timeOfDay } = this.filters.bookingStartTime
      const isInvalidTimeRange = startTime >= endTime && endTime !== 0
      if (timeOfDay === TIME_OF_DAY.MANUAL_SELECTION && isInvalidTimeRange) {
        return this.$t('validate_messages.start_to_finish')
      }

      if (!this.filters.estimatedTime) {
        return this.$t('aha-ai.validate-please-select-an-estimated-time')
      }

      const isDateInvalid = this.filters.isPeriodSelection
        ? (!this.filters.fromDateTS || !this.filters.toDateTS)
        : !this.filters.bookingDates.length
      if (isDateInvalid) {
        return this.$t('aha-ai.validate-please-select-a-booking-date')
      }

      return null
    },

    async onConfirm() {
      const validationError = this.validateFilters()
      if (validationError) {
        this._showDialogAlert(validationError)
        return
      }

      try {
        this.preLoader()

        const bookingResourceSetupIds = this.filters.bookingResourceSetupIds.map(resource => resource.value)
        const payload = { ...this.filters, bookingResourceSetupIds }
        const response = await getAvailableTimes(payload)

        if(!response.data.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return
        }

        this.$emit('confirm-search-available-times', response.data.result, this.filters)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onShowAhaAi() {
      if (this.isDisabledResourceSelection) {
        return
      }

      this.$emit('show-aha-ai')
    },

    onChangeBookingStartTime(option) {
      if(option.value !== TIME_OF_DAY.MANUAL_SELECTION) {
        this.filters.bookingStartTime.startTime = 0
        this.filters.bookingStartTime.endTime = 0
      } else {
        this.filters.bookingStartTime.startTime = this.shopEarliestStartTimeInMinutes
        this.filters.bookingStartTime.endTime = this.shopLatestFinishTimeInMinutes
      }
    },

    onChangeIsPeriodSelection() {
      if(this.filters.isPeriodSelection) {
        this.filters.bookingDates = []
      } else {
        this.filters.fromDateTS = 0
        this.filters.toDateTS = 0
      }
    },

    generateTimeOptionsFromRange() {
      const startTimeInMinutes = 0
      const finishTimeInMinutes = NEXT_DAY_12H_IN_MINUTES
      const options = []

      for(let time = startTimeInMinutes; time <= finishTimeInMinutes; time = time + DEFAULT_TIME_SLOT) {
        const timeText = formatTimeBasedOnMinutes({ minutes: time, prefix: this.$t('general.next-day-text') })
        options.push({
          value: time,
          text:  timeText,
        })
      }

      return options
    },

    getClampedEndTime(endTime) {
      const maxEndTime = this.timeOptions[this.timeOptions.length - 1]?.value
      if (endTime > maxEndTime) {
        return maxEndTime
      }
      return roundDownTo60Minutes(endTime)
    },

    getDefaultFilters() {
      return {
        shopId:            this.shop_data.shop_id,
        isPeriodSelection: false,
        estimatedTime:     0,
        bookingStartTime:  {
          timeOfDay: TIME_OF_DAY.ALL,
          startTime: 0,
          endTime:   0,
        },
        bookingResourceSetupIds: this.resourcesOptions.length > 0 ? [...this.resourcesOptions] : [],
        fromDateTS:              0,
        toDateTS:                0,
        bookingDates:            [],
      }
    },

    initialFilters() {
      if (!this.savedFilters) {
        this.filters = this.getDefaultFilters()
        return
      }

      const { bookingStartTime, bookingDates, estimatedTime } = this.savedFilters
      this.filters = {
        ...this.savedFilters,
        bookingDates:     [...bookingDates].sort((a, b) => a - b),
        estimatedTime:    roundUpEstimatedTime(estimatedTime),
        bookingStartTime: {
          ...bookingStartTime,
          startTime: roundDownTo60Minutes(bookingStartTime.startTime),
          endTime:   this.getClampedEndTime(bookingStartTime.endTime),
        },
      }
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai-search-available-times.scss';
</style>
