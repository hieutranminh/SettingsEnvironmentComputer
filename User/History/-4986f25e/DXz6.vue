<template>
  <div :class="calendarDateClass">
    <div class="calendar-date__pagination">
      <ul class="calendar-date__pagination-list">
        <li
          v-if="!isMobileDevice"
          class="calendar-date__pagination-item calendar-date__pagination-item--today"
        >
          <a
            class="calendar-date__pagination-link calendar-date__pagination-link--today"
            @click="handleTodayClick"
          >
            {{ $t('general.today') }}
          </a>
        </li>
        <li class="calendar-date__pagination-item">
          <a
            class="calendar-date__pagination-link"
            @click="handlePrevDayClick"
          >
            <b-icon-chevron-left />
          </a>
        </li>
        <li class="calendar-date__pagination-item">
          <a
            class="calendar-date__pagination-link"
            @click="handleNextDayClick"
          >
            <b-icon-chevron-right />
          </a>
        </li>
      </ul>
    </div>

    <a-calendar-dropdown
      ref="calendarDropdown"
      :value="dates"
      :auto-trigger-input="false"
      @dayclick="handleDayClick"
    >
      <template #toggle="{ toggle }">
        <a
          v-if="oneDayView"
          class="calendar-date__selected"
          @click="toggle"
        >
          <span class="calendar-date__selected-text">{{ selectedDateText }}xx</span>
        </a>

        <a
          v-if="multiDayView"
          class="calendar-date__selected"
        >
          <span
            class="calendar-date__selected-text calendar-date__selected-text-from-date"
            @click="toggle"
          >{{ formatedFromDate }}</span>
          <span
            v-if="isShowToDate"
            class="calendar-date__selected-text"
          > ~ </span>
          <span
            v-if="isShowToDate"
            class="calendar-date__selected-text"
          >{{ formattedToDate }}</span>
        </a>
      </template>
    </a-calendar-dropdown>
  </div>
</template>

<script>
// Utilities
import { convertDateToTimeStamp } from 'CommonHelpers'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { convertDateToMomentUTC } from 'Modules/calendar/utils/index'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Components
import { BIconChevronLeft, BIconChevronRight } from 'bootstrap-vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ACalendarDropdown from 'Modules/aha/a-calendar-dropdown/a-calendar-dropdown.vue'

export default {
  components: {
    BIconChevronLeft,
    BIconChevronRight,
    ACalendarDropdown,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  data() {
    return {
      is_mobile: this.isMobile(),
    }
  },

  computed: {
    ...mapState('_calendar', [
      'today',
      'crossDate',
      'finishTime',
      'numberOfDay',
      'selectedDate',
      'specificOffDays',
      'bookingResources',
      'isExcludeOffBookingResource',
    ]),

    ...mapGetters('_calendar', [
      'toDate',
      'fromDate',
    ]),

    dates() {
      if (!this.selectedDate) return []
      return [this.selectedDate.toDate()]
    },

    oneDayView() {
      return this.numberOfDay === 1
    },

    multiDayView() {
      return this.numberOfDay > 1
    },

    selectedDateText() {
      return this.convertToDateText(this.selectedDate)
    },

    calendarDateClass() {
      return ['calendar-date', {
        'calendar-date--mobile': this.isMobileDevice,
      }]
    },

    formattedToDate() {
      const formatter = this.is_mobile ? 'YYYY-MM' : 'MM-DD'
      return convertDateToMomentUTC(this.toDate).format(formatter)
    },

    formatedFromDate() {
      const formatter = this.is_mobile ? 'YYYY-MM' : 'YYYY-MM-DD'
      return convertDateToMomentUTC(this.fromDate).format(formatter)
    },

    datesDisplayingFormatted() {
      return [this.formatedFromDate, this.formattedToDate]
    },

    isShowToDate() {
      return this.datesDisplayingFormatted.length > 1 && !this.is_mobile
    },
  },

  mounted() {
    this.handleLastestApiEmitForTodayReady()
    this.$bus.on('calendar-slot-mouseup', this.handlerCalendarShotMounseUp)
  },

  beforeDestroy() {
    this.$bus.off('waiting-api-for-today-ready-emit', this.handleLastestApiEmit)
  },

  methods: {
    ...mapActions('_calendar', [
      'gotoNextDate',
      'gotoPrevDate',
    ]),

    ...mapMutations('_calendar', [
      'setSelectedDate',
    ]),

    ...mapActions('_calendar/bookings', [
      'getBookingCalendarLiveByDateRange',
    ]),

    handlerCalendarShotMounseUp() {
      if(this.$refs.calendarDropdown) {
        this.$refs.calendarDropdown?.hideMenu()
      }
    },

    handleLastestApiEmit() {
      const movingCase = sessionStorage.getItem('onMovingCaseFromNaverNotifyListButton')
      if(!movingCase) {
        this.setSelectedDate(this.today)
      } else {
        sessionStorage.removeItem('onMovingCaseFromNaverNotifyListButton')
      }
    },

    handleLastestApiEmitForTodayReady() {
      try {
        this.preLoader()
        this.$bus.on('waiting-api-for-today-ready-emit', this.handleLastestApiEmit)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    convertToDateText(input) {
      return input ? convertDateToMomentUTC(input).format('YYYY-MM-DD [(]ddd[)]') : ''
    },

    async handleDayClick(day) {
      try {
        const date = convertDateToMomentUTC(day.date)
        this.setSelectedDate(date)
        await this.loadBookingCalendarLiveByDateRange()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async handlePrevDayClick() {
      await this.gotoPrevDate()
      await this.loadBookingCalendarLiveByDateRange()
    },

    async handleNextDayClick() {
      await this.gotoNextDate()
      await this.loadBookingCalendarLiveByDateRange()
    },

    async handleTodayClick() {
      this.setSelectedDate(this.today)
      await this.loadBookingCalendarLiveByDateRange()
    },

    async loadBookingCalendarLiveByDateRange() {
      try {
        this.preLoader()

        await this.getBookingCalendarLiveByDateRange({
          toDateTS:   convertDateToTimeStamp(this.toDate),
          fromDateTS: convertDateToTimeStamp(this.fromDate),
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-date.scss";
</style>
