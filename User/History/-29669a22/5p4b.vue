<template>
  <div class="calendar-date-picker">
    <div
      class="calendar-date-picker__count"
    >
      <div
        v-if="isShowCount"
        class="calendar-date-picker__count-text"
        @click="isShowCount = false"
      >
        {{ $t('bookings.hide-count') }}
      </div>
      <div
        v-else
        class="calendar-date-picker__count-text"
        @click="clickGetBookingsCountPerDay()"
      >
        {{ $t('bookings.show-count') }}
      </div>
    </div>
    <aha-calendar-picker-sidebar
      ref="calendar_sidebar"
      :month="month"
      :year="year"
      :value="dates"
      :initial-value="initialDate"
      :auto-trigger-input="false"
      :date-counts="dateCounts"
      :is-show-count="isShowCount"
      class="repeat-by-dates__calendar-picker"
      @dayclick="handleDayClick"
      @update:fromPage="handleFromPageUpdate"
      @visible-dates-change="handleVisibleDatesChange"
      @update:month="month = $event"
      @update:year="year = $event"
    />
  </div>
</template>

<script>
// Utilities
import { convertDateToTimeStamp } from 'CommonHelpers'
import { convertDateToMomentUTC } from 'Modules/calendar/utils'
import moment from 'moment'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

// Apis
import { getBookingsCountPerDay } from 'Modules/api/booking/waiting-api.js'

// Constants
import { NOTIFICATON_TYPE} from 'Constant'

// Components
import AhaCalendarPickerSidebar from 'CommonComponents/aha-calendar-picker-sidebar/aha-calendar-picker-sidebar.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

export default {
  components: {
    AhaCalendarPickerSidebar,
  },

  extends: ComponentBase,

  data() {
    return {
      initialValue:     null,
      isFirstLoad:      true,
      isShowCount:      sessionStorage.getItem('isShowCount') === 'true', // Restore value from sessionStorage
      dataCountsResult: [],
      dateCounts:       {},
      month:            null, // Initialize with null, will update via watch
      year:             null,
      isNavigating:     false, // Track if navigating via Vue Router
      isLoaded:         false,
    }
  },

  computed: {
    ...mapGetters('_calendar', [
      'toDate',
      'fromDate',
    ]),

    ...mapState('authentication', [
      'user',
    ]),

    ...mapState('_calendar', [
      'today',
      'crossDate',
      'finishTime',
      'selectedDate',
      'specificOffDays',
      'bookingResources',
      'isExcludeOffBookingResource',
    ]),

    dates() {
      return [this.selectedDate.toDate()]
    },

    initialDate() {
      return [this.initialValue]
    },

    currentMonth: {
      get() {
        return this.selectedDate.month() + 1
      },
      set(value) {
        this._currentMonth = value
      },
    },

    currentYear: {
      get() {
        return this.selectedDate.year()
      },
      set(value) {
        this._currentYear = value
      },
    },
  },

  watch: {
    selectedDate: {
      immediate: true, // Trigger on component mount
      handler(newVal) {
        if (!newVal) return
        this.initialValue = moment.isMoment(newVal) ?
          newVal.toDate() :
          moment(newVal).toDate()
        this.month = newVal.month() + 1 // Update local state
        this.year = newVal.year()
      },
    },

    today(newVal) {
      if (!newVal || !this.isFirstLoad) return
      this.initialValue = moment.isMoment(newVal) ?
        newVal.toDate() :
        moment(newVal).toDate()
    },

    isShowCount(newValue) {
      sessionStorage.setItem('isShowCount', newValue) // Save to sessionStorage when changed
    },
  },

  mounted() {
    this.$signalR.on(NOTIFICATON_TYPE.TOTAL_BOOKING_CHANGED, this.handleShowTotalBookingChanged)
    this.$nextTick(() => {
      const calendarRef = this.$refs?.calendar_sidebar
      calendarRef?.handleShowDefaultDateInCalendar()
    })
    this.isLoaded = true
    window.addEventListener('beforeunload', this.handlePageReload)
  },

  beforeDestroy() {
    this.$signalR.off(NOTIFICATON_TYPE.TOTAL_BOOKING_CHANGED, this.handleShowTotalBookingChanged)

    // Need to handle in app-header.vue > handleLinkClick() function when click to /sales page button
    if (this.$route.path !== '/calendar') {
      sessionStorage.removeItem('isShowCount')
    }
    window.removeEventListener('beforeunload', this.handlePageReload)
  },

  updated() {
    /**
     * @description If no use this.$nextTick, render calendar is empty when the month and year is different the current date
     */
    this.$nextTick(() => {
      const calendarRef = this.$refs?.calendar_sidebar
      calendarRef?.handleShowDefaultDateInCalendar()
    })

    this.isFirstLoad = false
  },

  methods: {
    ...mapMutations('_calendar', [
      'setSelectedDate',
    ]),

    ...mapActions('_calendar/bookings', [
      'getBookingCalendarLiveByDateRange',
    ]),

    async handleDayClick(day) {
      try {
        this.preLoader()

        const date = convertDateToMomentUTC(day.date)
        this.setSelectedDate(date)

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

    handleCalculationCustomizeSelectedTodayDay() {
      const movingCase = sessionStorage.getItem('onMovingCaseFromNaverNotifyListButton')
      if(!movingCase) {
        this.setSelectedDate(this.today)
      }
    },

    async handleShowTotalBookingChanged(data) {
      const sessionToken = data?.sessionToken
      if (sessionToken !== this.user.session_token && data?.shopId !== this.shop_data.shop_id) {
        return
      }

      if (this.isShowCount) this.getBookingsCountPerDay(this.year, this.month)
    },

    async getBookingsCountPerDay(currentYear, currentMonth) {
      try {
        const payload = {
          shopId: this.shop_data.shop_id,
          year:   currentYear,
          month:  currentMonth,
        }

        const result = await getBookingsCountPerDay(payload)
        this.dataCountsResult = result.data?.result || []

        this.dateCounts = this.formatDateCount(this.dataCountsResult)

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    formatDateCount(dataCountsResult) {
      const dateCounts = {}

      dataCountsResult.forEach((item) => {
        const formattedDate = moment.unix(item.bookingDateTS).format('YYYY-MM-DD') // Convert timestamp to YYYY-MM-DD
        dateCounts[formattedDate] = item.totalBookings // Store count
      })

      return dateCounts
    },

    handleVisibleDatesChange({ currentMonth, currentYear }) {
      this.currentMonth = currentMonth
      this.currentYear = currentYear
      if(this.isLoaded && this.isShowCount) this.getBookingsCountPerDay(currentYear, currentMonth)
    },

    handlePageReload() {
      // When the page is refreshed, keep isShowCount
      sessionStorage.setItem('isShowCount', this.isShowCount)
    },

    handleFromPageUpdate(newPage) {

      if (!newPage || !newPage.year || !newPage.month) {
        return
      }

      this.month = newPage.month
      this.year = newPage.year

      // Emit updates to maintain consistency
      this.$emit('update:month', this.month)
      this.$emit('update:year', this.year)

      // Call API to fetch data for the new month
      this.handleVisibleDatesChange({
        currentMonth: this.month,
        currentYear:  this.year,
      })
    },

    clickGetBookingsCountPerDay() {
      this.isShowCount = true
      if (this.isShowCount) {
        this.preLoader(true)
        this.getBookingsCountPerDay(this.year, this.month)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-date-picker.scss";
</style>
