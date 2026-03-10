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

    getBookingsByTimeSlot(bookings, startTime) {
      if (!bookings || bookings?.length === 0) {
        return DEFAULT_EMPTY_BOOKINGS
      }

      const endTime = startTime + Number(this.timeSlot)

      if (endTime < this.availableStartTime || startTime > this.availableEndTime) {
        return DEFAULT_EMPTY_BOOKINGS
      }

      const filteredBookings = bookings.filter(booking => {
        return booking.bookedResources?.find(bookedResource => {
          const startTimeInMinutes = BookedResource.getStartTimeInMinutes({
            startTime: bookedResource.startTime,
            isNextDay: bookedResource.isNextDay,
          })
          return startTimeInMinutes >= startTime && startTimeInMinutes < endTime
        })
      })

      if (filteredBookings.length === 0) {
        return DEFAULT_EMPTY_BOOKINGS
      }

      return filteredBookings
    },

    getBlockedTimesByTimeSlot(blockedTimes, startTime) {
      if (!blockedTimes || blockedTimes?.length === 0) {
        return DEFAULT_EMPTY_BLOCKED_TIMES
      }

      const endTime = startTime + Number(this.timeSlot)
      const openingStartTime = this.timeSlots[0]?.minutes ?? 0

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

        // Check if blockedTime overlaps with this slot
        const hasOverlap = blockedStartTime < endTime && blockedEndTime > startTime
        if (!hasOverlap) return false

        // Render only at the first overlapping slot
        // Effective render start = max(blockedStartTime, openingStartTime)
        const effectiveRenderStart = Math.max(blockedStartTime, openingStartTime)
        return effectiveRenderStart >= startTime && effectiveRenderStart < endTime
      })

      if (filteredBlockedTimes.length === 0) {
        return DEFAULT_EMPTY_BLOCKED_TIMES
      }

      return filteredBlockedTimes
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
