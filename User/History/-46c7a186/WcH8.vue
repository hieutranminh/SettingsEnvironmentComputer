<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <div
    ref="slot"
    :class="calendarSlotClass"

    @mouseup="handleSlotMouseUp"
    @mouseover="handleMouseOver"
    @click.self="handleSlotClick()"
    @mouseleave="handleContextMenuHide"
  >
    <div class="calendar-slot__text">{{ text }}</div>
    <div
      v-if="isDropzoneAvailable"

      :style="calendarSlotDropZoneStyle"
      :class="calendarSlotDropZoneClass"

      @click.self="handleSlotDropZoneClick"
      @mouseenter="handleSlotDropZoneMouseEnter"
      @mouseleave="handleSlotDropZoneMouseLeave"
    />

    <div
      v-if="isShowContenxtMenu "
      :class="desktopClassMenu"
      class="calendar-slot__context-menu"
      @click.stop="handleContextMenuShow($event)"
    >
      <b-dropdown
        v-if="!isTouchDevice()"
        ref="dropdownDesktop"
        class="calendar-slot__booking-btn"
      >
        <template #button-content>
          <div class="calendar-slot__booking-line" />
          <div class="calendar-slot__booking-line" />
        </template>
        <b-dropdown-item @click.self="handleSlotClick()">{{ $t('bookings.add-booking') }}</b-dropdown-item>
        <b-dropdown-item @click.self="handleSlotClick(true)">{{ $t('bookings.add-walk-in') }}</b-dropdown-item>
        <b-dropdown-item @click.self="handleAddBlockedTimeClick()">{{ $t('bookings.block-booking') }}</b-dropdown-item>
      </b-dropdown>

      <div
        v-else
        class="calendar-slot__booking_action touchpad"
      >
        <div class="calendar-slot__action-list">
          <b-dropdown
            ref="dropdownTouchPad"
            :offset="offset"
            boundary="scrollParent"
            class="calendar-slot__action-touchpad"
          >
            <template #button-content>
              <span class="calendar-slot__time">{{ textTimeMobile }}</span>
            </template>
            <b-dropdown-item @click.self="handleSlotClick()">{{ $t('bookings.add-booking') }}</b-dropdown-item>
            <b-dropdown-item @click.self="handleSlotClick(true)">{{ $t('bookings.add-walk-in') }}</b-dropdown-item>
            <b-dropdown-item @click.self="handleAddBlockedTimeClick()">{{ $t('bookings.block-booking') }}</b-dropdown-item>
            <b-dropdown-item
              class="close-btn"
              @click.stop="onCloseBookingAction($event)"
            >{{ $t('general.close') }}</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>

    <div
      v-if="hasBookings"
      class="calendar-slot__bookings"
    >
      <calendar-bookings
        :bookings="bookings"
        :time-slot-index="timeSlotIndex"
        :lasted-resource="lastedResource"
        :booking-configurations="bookingConfigurations"
      />
    </div>
    <div
      v-if="hasBlockedTimes"
      :class="[{ 'calendar-slot__moving-mode': isMoveBookingMode }]"
      class="calendar-slot__blocked-times"
    >
      <calendar-blocked-times
        :is-off-day="isOffDay"
        :blocked-times="blockedTimes"
      />
    </div>
  </div>
</template>

<script>
// Utilities
import moment from 'moment'
import store from 'VuexStore'
import { isTouchDevice } from 'CommonHelpers'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import { convertTimeToMinutes, convertDateToMomentUTC, CalendarEventBus } from 'Modules/calendar/utils'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// ViewModels
import BlockedTime from 'Models/blockedTime/blockedTime'
import BookedResource from 'Models/booking/bookedResource'

// Constant
import { options } from 'OptionsHelpers'

const MAXIMUM_NUMBER_OF_RESOURCE = 5

export default {
  components: {
    CalendarBookings:     () => import('../calendar-bookings/calendar-bookings.vue'),
    CalendarBlockedTimes: () => import('../calendar-blocked-times/calendar-blocked-times.vue'),
  },

  extends: ComponentBase,

  props: {
    text: {
      default: '',
      type:    String,
    },

    date: {
      type:    moment,
      default: () => convertDateToMomentUTC(),
    },

    startTime: {
      default: 0,
      type:    Number,
    },

    resource: {
      type:    Object,
      default: () => null,
    },

    bookings: {
      type:    Array,
      default: () => ([]),
    },

    blockedTimes: {
      type:    Array,
      default: () => ([]),
    },

    bookingConfigurations: {
      type:    Object,
      default: () => ({}),
    },

    textTimeMobile: {
      type:    String,
      default: null,
    },

    isOffDay: {
      type:    Boolean,
      default: false,
    },

    workingStartTime: {
      type:    Number,
      default: null,
    },

    workingFinishTime: {
      type:    Number,
      default: null,
    },

    breakingTimes: {
      type:    Array,
      default: () => [],
    },

    timeSlotIndex: {
      type:    Number,
      default: null,
    },

    lastedResource: {
      type:    Object,
      default: () => ({}),
    },

  },

  data() {
    return {
      errors:            [],
      offset:            '',
      isShowContextMenu: false,
      blockedTime:       new BlockedTime(),
    }
  },

  inject: ['numberOfResourceDisplay'],

  computed: {
    ...mapState('authentication', [
      'user',
      'shop',
    ]),

    ...mapState('_calendar', [
      'timeSlot',
      'calendarRef',
      'timeSlotHeight',
      'bookingResources',
      'isBookingDragging',
      'selectedResourceId',
      'allowDuplicateBookings',
      'maxinumNumberOfResource',
      'calendarSlotAccessCallback',
    ]),

    ...mapState('_calendar', {
      openingStartTime: 'startTime',
    }),

    ...mapState('_calendar/drag', {
      booking:        'booking',
      isDragging:     'isDragging',
      dragBooking:    'ghostBooking',
      isStartDraging: 'isStartDraging',
    }),

    ...mapGetters('_calendar', [
      'timeSlotWidth',
    ]),

    isShowSlotTime() {
      return this.numberOfResourceDisplay < MAXIMUM_NUMBER_OF_RESOURCE
    },

    disabled() {
      return this.isOffDay || !this.isWorkingTimeAvailable
    },

    hasBookings() {
      return this.bookings && this.bookings.length > 0
    },

    hasBlockedTimes() {
      return this.blockedTimes && this.blockedTimes.length > 0
    },

    isWorkingTimeAvailable() {
      if (this.workingStartTime === null && this.workingFinishTime === null) {
        return false
      }

      for(const breakingTime of this.breakingTimes) {
        if(this.startTime >= breakingTime.startTime && this.startTime < breakingTime.finishTime) {
          return false
        }
      }

      return this.startTime >= this.workingStartTime && this.startTime < this.workingFinishTime
    },

    calendarSlotClass() {
      return ['calendar-slot', {
        'calendar-slot--disabled': this.disabled,
        'cross-date':              this.resource.id === this.lastedResource.id || !!this.selectedResourceId,
      }]
    },

    openingStartTimeInMinutes() {
      return convertTimeToMinutes(this.openingStartTime)
    },

    timeSlotUnitHeight() {
      return Number(this.timeSlotHeight) / Number(this.timeSlot)
    },

    calendarSlotDropZoneStyle() {
      const top = (Number(this.startTime) - Number(this.openingStartTimeInMinutes)) * this.timeSlotUnitHeight

      return {
        left: '0px',
        top:  `${top}px`,
      }
    },

    calendarSlotDropZoneClass() {
      return 'calendar-slot__drop-zone'
    },

    isDropzoneAvailable() {
      return this.isDragging ? true : !this.isOffDay && this.isWorkingTimeAvailable
    },

    isShowContenxtMenu() {
      return !this.hasBookings && !this.hasBlockedTimes && !this.disabled && !this.checkShowContextMenu && !this.isDragging
    },

    desktopClassMenu() {
      return {
        'desktop': !this.isTouchDevice(),
        'touch':   this.isTouchDevice(),
      }
    },

    checkShowContextMenu() {
      const resource = this.resource
      const startTime = this.startTime
      const dateTS = convertDateToMomentUTC(this.date).startOf('day').unix()
      const itemGroup = store.getters[`_calendar/bookings/${dateTS}_${resource.id}/itemGroups`]

      const hasDuplicateBooking = itemGroup?.some((group) => {
        return startTime >= group.startTime && startTime < group.endTime && group.items.length > 0
      })

      return hasDuplicateBooking
    },

    getLastBookingResource() {
      return this.bookingResources[this.bookingResources.length - 1]
    },

    isMoveBookingMode() {
      return store.state._calendar.isMoveBookingMode
    },
  },

  provide() {
    return {
      date:      this.date,
      resource:  this.resource,
      isOffDay:  this.isOffDay,
      startTime: this.startTime,
    }
  },

  watch: {
    bookings: {
      handler() {
        // Force hide context menu when bookings change (e.g., after cancellation)
        this.$nextTick(() => {
          this.handleContextMenuHide()
        })
      },
      immediate: false,
    },

    blockedTimes: {
      handler() {
        // Force hide context menu when blocked times change
        this.$nextTick(() => {
          this.handleContextMenuHide()
        })
      },
      immediate: false,
    },
  },

  created() {
    // console.log('Canlendar slot created')
  },

  mounted() {
    CalendarEventBus.$on('calendar-scroll', this.handleContextMenuHide)
    // console.log('Canlendar slot mounted')
    // console.log('Canlendar slot mounted', this.blockedTimes)
  },

  updated() {
    // console.log('Canlendar slot updated', this.blockedTimes)
  },

  beforeDestroy() {
    CalendarEventBus.$off('calendar-scroll', this.handleContextMenuHide)
  },

  methods: {
    isTouchDevice,
    ...mapActions('_calendar/bookings', [
      'moveBooking',
      'removeBooking',
    ]),

    ...mapActions('_calendar/drag', [
      'finishDraggingBooking',
      'changeDraggingBooking',
      'changeDraggingGhostBooking',
    ]),

    ...mapMutations('_calendar/drag', [
      'setTop',
      'setLeft',
    ]),

    ...mapActions('_calendar/blockedTimes', [
      'checkCrossBookings',
      'checkCrossOtherBlockedTimes',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'openBookingActionBySlot',
    ]),

    ...mapMutations('_calendar/bookingAction', [
      'setVisible',
      'setActiveWizardStep',
    ]),

    hasDupplicateBooking() {
      const resource = this.resource
      const startTime = this.startTime
      const endTime = this.startTime + this.timeSlot
      const dateTS = convertDateToMomentUTC(this.date).startOf('day').unix()
      const itemGroup = store.getters[`_calendar/bookings/${dateTS}_${resource.id}/itemGroups`]
      const bookingsHasDuplicate = itemGroup.find(item =>
        startTime >= item.startTime &&
        startTime < item.endTime &&
        item.items.length > 0,
      )

      if(!bookingsHasDuplicate) return false

      if(bookingsHasDuplicate) {
        const bookingDuplicateNotNoShow = (() => {
          const result = bookingsHasDuplicate.items.find(booking => {
            const isNotNoShowBooking = booking.status !== options.booking.booking_status.no_show
            const bookingResource = booking.bookedResources[0]
            const bookingStartTime = BookedResource.getStartTimeInMinutes({
              startTime: bookingResource?.startTime,
              isNextDay: bookingResource?.isNextDay,
            })

            const bookingEndTime = bookingStartTime + bookingResource?.estimatedTime

            const isDuplicateTimeSlot = startTime < bookingEndTime && endTime > bookingStartTime

            return isNotNoShowBooking && isDuplicateTimeSlot

          })
          return result
        })()

        return Boolean(bookingDuplicateNotNoShow)

      }
      return false
    },

    callCalendarSlotCallback() {
      if (!this.calendarSlotAccessCallback) return

      this.calendarSlotAccessCallback({
        text:      this.text,
        date:      this.date,
        resource:  this.resource,
        bookings:  this.bookings,
        startTime: this.startTime,
      })
    },

    handleMouseOver() {
      if(this.isTouchDevice()) {
        this.$bus.emit('calendar-slot-mouseup')
      }
    },

    async handleSlotMouseUp() {
      const openingHoursRightPosition = this.calendarRef.querySelector('.calendar-schedule__opening-hours').getBoundingClientRect().right
      const slotClickedLeftPosition = this.$refs?.slot?.getBoundingClientRect().left
      const contextMenuPadding = 4
      const distance = openingHoursRightPosition - slotClickedLeftPosition + contextMenuPadding
      if(slotClickedLeftPosition < openingHoursRightPosition) {
        this.offset = `${distance}, 0`
      }
      this.$bus.emit('calendar-slot-mouseup')
      try {
        if (!this.isBookingDragging) return

        this.finishDraggingBooking({
          isOffDay:               this.isOffDay,
          bookingDate:            this.date,
          isWorkingTimeAvailable: this.isWorkingTimeAvailable,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      }

    },

    async handleSlotClick(isWalking = false) {
      this.setActiveWizardStep('client')
      if(!this.allowDuplicateBookings && this.hasDupplicateBooking()) {
        this._showDialogAlert(this.$t('bookings.duplicate-bookings-is-not-allowed'))
        return
      }
      try {
        if (this.disabled) return

        /**
       * @description Prevent mouse up conflict with click event when dragging
       */
        if (this.isDragging) return

        this.preLoader()

        await this.openBookingActionBySlot({
          date:      this.date,
          resource:  this.resource,
          startTime: this.startTime,
          isWalking,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**
     * @description This methods is handler for adding a waiting to a booking and adding a blocked time.
     */
    handleSlotDropZoneClick() {
      this.callCalendarSlotCallback()
    },

    handleSlotDropZoneMouseEnter() {
      this.updateDragBookingBySlot()
    },

    updateDragBookingBySlot() {
      if(this.isStartDraging) {
        const changeData = {
          resource:      this.resource,
          startTime:     this.startTime,
          bookingDateTS: this.date.startOf('day').unix(),
        }

        this.changeDraggingBooking(changeData)
        this.changeDraggingGhostBooking(changeData)
      }
    },

    handleSlotDropZoneMouseLeave() {
      if (!this.dragBooking) return

      this.removeBooking({
        booking: this.dragBooking,
      })
    },

    /**@param {MouseEvent} event */
    // handleSlotContextMenu(event) {
    //   if (this.disabled || event.target.closest('.calendar-slot__blocked-times')) return

    //   event.preventDefault()

    //   CalendarEventBus.$emit('slot-contextmenu', event, {
    //     date: this.date,
    //     target: this.$refs.slot,
    //     bookings: this.bookings,
    //     resource: this.resource,
    //     startTime: this.startTime,
    //   })
    // },

    handleContextMenuHide() {
      if(this.isTouchDevice()) {
        const touchEl = this.$refs.dropdownTouchPad
        if(touchEl) {
          this.$refs.dropdownTouchPad.hide()
        }
      }
      const contextMenuEl = this.$refs.dropdownDesktop
      if(contextMenuEl) {
        this.$refs.dropdownDesktop.hide()
      }
    },

    handleContextMenuShow() {
      if(this.isTouchDevice()) {
        return
      }
      this.$refs.dropdownDesktop.show()
    },

    async validateBlockedTime() {
      this.errors = []
      const [hasCrossBookings, hasCrossOtherBlockedTimes] = await Promise.all([
        this.checkCrossBookings(this.blockedTime),
        this.checkCrossOtherBlockedTimes(this.blockedTime),
      ])

      if(hasCrossOtherBlockedTimes) {
        this.errors.push(this.$t('bookings.block-time-dupplicated'))
      }
      if(hasCrossBookings) {
        this.errors.push(this.$t('bookings.block-time-dupplicate-booking'))
      }
      this.errors = [...this.errors, ...this.blockedTime.validate()]

      return this.errors.length === 0
    },

    async handleAddBlockedTimeClick() {
      try {
        this.preLoader()
        this.blockedTime.shopId = this.shop_data.shop_id
        this.blockedTime.blockedDateTS = this.date.unix()
        this.blockedTime.fromTimeInMinutes = this.startTime
        this.blockedTime.sessionToken = this.x_user.session_token
        this.blockedTime.bookingResourceSetupId = this.resource.id
        this.blockedTime.shopLocation = this.shop_data.shop_location
        this.blockedTime.toTimeInMinutes = this.startTime + this.timeSlot

        const isValid = this.blockedTime.validate()
        if(!isValid) return

        await this.handleAddBlockedTime()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleAddBlockedTime() {
      const blockedTime = await this.blockedTime.save()
      CalendarEventBus.$emit('add-blocked-time-context', blockedTime)
    },

    onCloseBookingAction(e) {
      const ElementClick = e.target
      if(ElementClick.closest('.calendar-slot__action-touchpad')) {
        this.$refs.dropdownTouchPad.hide()
      }
    },

    convertToAMPM() {
      const mapping = {
        '오전': 'AM',
        '오후': 'PM',
      }

      return this.text.replace(/오전|오후/g, match => mapping[match])
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-slot.scss";
</style>
