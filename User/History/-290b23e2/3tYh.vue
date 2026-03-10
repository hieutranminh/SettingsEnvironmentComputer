<template>
  <div
    ref="slots"
    class="calendar-slots"
  >
    <ul class="calendar-slots__list">
      <li
        v-for="(timeSlot, index) in timeSlots"
        :key="`calendar_slot_${timeSlot.minutes}`"
        class="calendar-slots__item"
      >
        <calendar-slot-lazy
          :data-calendar-slot="slotId(timeSlot)"
          class="calendar-slots__slot"
        >
          <calendar-slot v-bind="slotAttributes(timeSlot, index)" />
          <template #placeholder>
            <div class="calendar-slots__slot--placeholder" />
          </template>
        </calendar-slot-lazy>
      </li>
    </ul>
  </div>
</template>

<script>
// Utilities
import moment from 'moment'
import i18n from 'Translate'
import store from 'VuexStore'
import { mapGetters, mapState } from 'vuex'
import { convertDateToMomentUTC, formatTimeSlot } from 'Modules/calendar/utils/index'

// Components
import CalendarSlot from '../calendar-slot/calendar-slot.vue'
import CalendarSlotLazy from './components/calendar-slot-lazy/calendar-slot-lazy.vue'

// Models
import BlockedTime from 'Models/blockedTime/blockedTime.js'
import BookedResource from 'Models/booking/bookedResource.js'

// Constant
/** @description DEFAULT_EMPTY_BOOKINGS using for preventing canlendar-slot updated */
const DEFAULT_EMPTY_BOOKINGS = []

// Constant
/** @description DEFAULT_EMPTY_BLOCKED_TIMES using for preventing canlendar-slot updated */
const DEFAULT_EMPTY_BLOCKED_TIMES = []

// Constant
/** @description DEFAULT_EMPTY_BOOKING_CONFIGURATIONS using for preventing canlendar-slot updated */
const DEFAULT_EMPTY_BOOKING_CONFIGURATIONS = {}

export default {
  components: {
    CalendarSlot,
    CalendarSlotLazy,
  },

  props: {
    date: {
      type:    moment,
      default: () => convertDateToMomentUTC(),
    },

    resource: {
      type:    Object,
      default: () => null,
    },

    isOffDay: {
      type:    Boolean,
      default: false,
    },

    lastedResource: {
      type:    Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapState('_calendar', [
      'timeSlot',
    ]),

    ...mapGetters('_calendar', [
      'timeSlots',
      'resourcesBreakingTimesBySchedule',
    ]),

    dateTS() {
      return convertDateToMomentUTC(this.date).startOf('day').unix()
    },

    bookings() {
      return store.getters[`_calendar/bookings/${this.dateTS}_${this.resource.id}/availableBookings`]
    },

    blockedTimes() {
      return store.state._calendar?.blockedTimes?.[`${this.dateTS}_${this.resource.id}`]?.items
    },

    availableEndTime() {
      return store.state._calendar?.bookings?.[`${this.dateTS}_${this.resource.id}`]?.availableEndTime
    },

    availableStartTime() {
      return store.state._calendar?.bookings?.[`${this.dateTS}_${this.resource.id}`]?.availableStartTime
    },

    itemGroups() {
      return store.getters[`_calendar/bookings/${this.dateTS}_${this.resource.id}/itemGroups`]
    },

    itemConfigurations() {
      return store.getters[`_calendar/bookings/${this.dateTS}_${this.resource.id}/itemConfigurations`]
    },

    dayOfWeek() {
      return this.date.day()
    },

    resourceWorkingHour() {
      const resourcesBreakingTimesBySchedule = this.resourcesBreakingTimesBySchedule

      if (!resourcesBreakingTimesBySchedule[this.resource.id]) {
        return {
          startTime:     null,
          finishTime:    null,
          breakingTimes: [],
        }
      }

      const resourceWorkingHours = resourcesBreakingTimesBySchedule[this.resource.id]
      const resourceWorkingHourOfDay = resourceWorkingHours.find(resourceWorkingHour => {
        return resourceWorkingHour.dayOfWeek === this.dayOfWeek && resourceWorkingHour.timestamp === this.dateTS
      })

      return resourceWorkingHourOfDay?.workingHours
    },
  },

  mounted() {
    // console.log('calendar slots mounted')
  },

  updated() {
    // console.log(`Updated ${this.dateTS}_${this.resource.id}`, this.blockedTimes)
    // console.log(`calendar slots updated ${this.dateTS}_${this.resource.id}`, this.itemConfigurations)
  },

  methods: {
    slotId({ minutes }) {
      return `${this.date.unix()}_${this.resource.id}_${minutes}`
    },

    slotAttributes({ minutes, text }, index) {
      const bookings = this.getBookingsByTimeSlot(this.bookings, minutes)
      const bookingConfigurations = this.getBookingConfigurations(bookings)

      const blockedTimes = this.getBlockedTimesByTimeSlot(this.blockedTimes, minutes)
      const textTimeMobile = formatTimeSlot({ prefix: i18n.t('general.next-day-text'), minutes })

      return {
        timeSlotIndex: index,
        text,
        bookings,
        blockedTimes,
        // isInWorkingHour,
        textTimeMobile,
        bookingConfigurations,

        date:              this.date,
        startTime:         minutes,
        resource:          this.resource,
        isOffDay:          this.resource.isOffDay,
        lastedResource:    this.lastedResource,
        breakingTimes:     this.resourceWorkingHour?.breakingTimes,
        workingStartTime:  this.resourceWorkingHour?.startTime,
        workingFinishTime: this.resourceWorkingHour?.finishTime,
      }
    },

    /**
     * Filter bookings that should be rendered in the current time slot.
     *
     * @description
     * Booking is rendered only at the first overlapping slot within the calendar opening hours.
     * Similar logic to getBlockedTimesByTimeSlot.
     *
     * @example
     * - Opening time: 10:30 AM (630 minutes)
     * - Booking: 10:00 AM - 1:30 PM (600-810 minutes)
     * - TimeSlot: 30 minutes
     *
     * Result:
     * - First slot (10:30-11:00): Renders booking (effectiveRenderStart = max(600, 630) = 630, which falls in [630-660])
     * - Second slot (11:00-11:30): Does NOT render (effectiveRenderStart = 630, which does NOT fall in [660-690])
     *
     * @param {Array} bookings - List of bookings for this resource and date
     * @param {Number} startTime - Start time of current slot in minutes
     * @returns {Array} Filtered bookings that should render in this slot
     */
    getBookingsByTimeSlot(bookings, startTime) {
      if (!bookings || bookings.length === 0) {
        return DEFAULT_EMPTY_BOOKINGS
      }

      const slotEndTime = startTime + Number(this.timeSlot)

      if (slotEndTime < this.availableStartTime || startTime > this.availableEndTime) {
        return DEFAULT_EMPTY_BOOKINGS
      }

      const calendarOpeningTime = this.timeSlots[0]?.minutes ?? 0

      const filteredBookings = bookings.filter(booking => {
        return booking.bookedResources?.find(bookedResource => {
          const bookingStartTime = BookedResource.getStartTimeInMinutes({
            startTime: bookedResource.startTime,
            isNextDay: bookedResource.isNextDay,
          })
          const bookingEndTime = bookingStartTime + bookedResource.estimatedTime

          // Check overlap: booking must intersect with this slot
          const hasOverlap = bookingStartTime < slotEndTime && bookingEndTime > startTime
          if (!hasOverlap) return false

          // Render only at the first visible slot
          // If booking starts before opening time, it will render at the first slot (opening time)
          const effectiveRenderStart = Math.max(bookingStartTime, calendarOpeningTime)
          return effectiveRenderStart >= startTime && effectiveRenderStart < slotEndTime
        })
      })

      return filteredBookings.length > 0 ? filteredBookings : DEFAULT_EMPTY_BOOKINGS
    },

    /**
     * Filter blocked times that should be rendered in the current time slot.
     *
     * @description
     * BlockedTime is rendered only at the first overlapping slot within the calendar opening hours.
     *
     * @example
     * - Opening time: 10:30 AM (630 minutes)
     * - BlockedTime: 10:00 AM - 9:00 PM (600-1260 minutes)
     * - TimeSlot: 30 minutes
     *
     * Result:
     * - First slot (10:30-11:00): Renders blockedTime (effectiveRenderStart = max(600, 630) = 630, which falls in [630-660])
     * - Second slot (11:00-11:30): Does NOT render (effectiveRenderStart = 630, which does NOT fall in [660-690])
     *
     * @param {Array} blockedTimes - List of blocked times for this resource and date
     * @param {Number} startTime - Start time of current slot in minutes
     * @returns {Array} Filtered blocked times that should render in this slot
     */
    getBlockedTimesByTimeSlot(blockedTimes, startTime) {
      if (!blockedTimes || blockedTimes.length === 0) {
        return DEFAULT_EMPTY_BLOCKED_TIMES
      }

      const slotEndTime = startTime + Number(this.timeSlot)
      const calendarOpeningTime = this.timeSlots[0]?.minutes ?? 0

      const filteredBlockedTimes = blockedTimes.filter(blockedTime => {
        const blockedStartTime = BlockedTime.getFromTimeInMinutes({
          fromTime:  blockedTime.fromTime,
          isNextDay: blockedTime.isNextDay,
        })
        const blockedEndTime = BlockedTime.getToTimeInMinutes({
          toTime:    blockedTime.toTime,
          fromTime:  blockedTime.fromTime,
          isNextDay: blockedTime.isNextDay,
        })

        // Check overlap: blockedTime must intersect with this slot
        const hasOverlap = blockedStartTime < slotEndTime && blockedEndTime > startTime
        if (!hasOverlap) return false

        // Render only at the first visible slot
        // If blockedTime starts before opening time, it will render at the first slot (opening time)
        const effectiveRenderStart = Math.max(blockedStartTime, calendarOpeningTime)
        return effectiveRenderStart >= startTime && effectiveRenderStart < slotEndTime
      })

      return filteredBlockedTimes.length > 0 ? filteredBlockedTimes : DEFAULT_EMPTY_BLOCKED_TIMES
    },

    getBookingConfigurations(bookings) {
      const bookingConfigurations = bookings.reduce((bookingConfigurations, booking) => {
        if (this.itemConfigurations?.[booking.bookingId]) {
          bookingConfigurations[booking.bookingId] = this.itemConfigurations?.[booking.bookingId]
        }

        return bookingConfigurations
      }, {})

      if (Object.keys(bookingConfigurations).length === 0) {
        return DEFAULT_EMPTY_BOOKING_CONFIGURATIONS
      }

      return bookingConfigurations
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-slots.scss";
</style>
