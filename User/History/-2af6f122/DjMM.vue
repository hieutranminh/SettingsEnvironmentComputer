<template>
  <div
    ref="booking"
    v-touch-outside="handleTouchOutside"
    :style="bookingStyle"
    :class="bookingClass"
    :data-booking-id="booking.bookingId"

    @click="handleBookingClick"
    @mouseup="handleBookingMouseUp"
    @mouseenter="handleBookingEnter"
    @wheel="handleBookingEnter"
    @mousedown="handleBookingMouseDown"
  >
    <div
      :style="bookingContainerStyle"
      class="calendar-booking__container"
    >
      <p
        v-if="booking.isGhostBooking"
        class="calendar-booking__dragging-start-time"
      >
        {{ startTimeText }}
      </p>

      <booking-summary
        :booking="booking"
        :is-one-line="isOneLine"
        :width-ratio="widthRatio"
        class="calendar-booking__header"
        @sales-draft-click="handleSalesDraftIconClick"
        @booking-deposit-click="handleBookingDepositIconClick"
      />

      <div class="calendar-booking__body">
        <booked-items
          v-if="serviceShowUp && isShowDetail"
          :booked-items="bookedResource.bookedItems"
          class="calendar-booking__booked-items"
        />

        <booking-estimate-time
          v-if="showEstimateTime"
          :start-time="startTimeInMinutes"
          :estimated-time="bookedResource.estimatedTime"
          class="calendar-booking__estimate-time"
        />

        <div
          v-if="isBookingNotesShown && isShowDetail"
          class="calendar-booking__notes"
          v-html="formattedMemoText(booking.notes)"
        />
      </div>

      <device-view
        is-desktop-device
        is-all-tablet-device
      >
        <booking-resize
          v-if="isShowResizeBarTablet"
          :booking="booking"
          :target="resizeTarget"
          :is-off-day="isOffDay"

          class="calendar-booking__resize"
          @stop-resize="handleBookingStopResize"
          @start-resize="handleBookingStartResize"
          @click-resize-icon="handleClickResizeIcon"
        />
      </device-view>
    </div>

    <booking-description
      v-if="isDescriptionShown && isShowBookingDescription"
      :booking="booking"
      :visible="isDescriptionShown"
      :booking-target="bookingTarget"
      :clicked-at-minutes="clickedAtMinutes"
      class="calendar-booking__description"
      @hide="handleBookingDescriptionHide"
      @mouseenter.native="onMouseenterBookingDescription"
    />

    <device-view
      is-desktop-device
      is-ipad
      is-tablet-device
    >
      <booking-menu
        v-if="isShowBookingActionMenu"
        :booking="booking"
        :is-addable="isAddableBooking"
        :style-position="stylePosition"
        :booking-status="booking.status"
        :booking-cancellation-fee="booking.cancellationFee"
        :resource="resource"
        :is-add-booking-depositable="isShowAddBookingDepositMenu"
        @hide="handleHide"
        @click-move-booking="isShowBookingActionMenu = false"
        @touchstart="handleBookingMenuTouchEvent"
        @add-booking="handleAddBooking"
        @move-booking="handleMoveBooking"
        @edit-booking="handleEditBooking"
        @cancel-booking="handleCancelBooking"
        @deleted-booking="handleDeleteBooking"
        @no-show-booking="handleNoShowBooking"
        @checkout-booking="handleCheckOutBooking"
        @view-sales-detail="handleViewSalesDetail"
        @add-booking-deposit="handleAddBookingDeposit"
        @view-client-information="handleViewClientInformation"
      />
    </device-view>
  </div>
</template>

<script>
// Constant
import { options } from 'OptionsHelpers'

// Utilities
import moment from 'moment'
import i18n from 'Translate'
import store from 'VuexStore'
import { debounce } from 'lodash'
import { isAmOrPm, checkNullAndEmpty, escapeHtml } from 'CommonHelpers'
import { BookingApiError } from 'Validators/booking/bookingValidator'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import { convertTimeToMinutes, CalendarEventBus, convertDateToMomentUTC, formatTimeSlot, formatTimeSlotAtMobile } from 'Modules/calendar/utils'
import { BOOKING_CLIENT_TYPE, BOOKING_EXTERNAL_SYSTEM_PAYMENT, CELL_HEIGHT_SETTING_NAME, CELL_HEIGHT_SETTING_DEFAULT, BOOKING_SOURCE } from 'Constant'

//Api
import { deleteBookingCanceled } from 'Modules/api/booking/booking-api'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import NaverBooking from 'Modules/calendar/mixins/naver_booking'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import { generateBookingRules } from 'Modules/calendar/mixins/booking'

// Components
import DeviceView from 'Modules/device/components/device-view'
import BookedItems from './components/booked-items/booked-items.vue'
import BookingResize from './components/booking-resize/booking-resize.vue'
import BookingSummary from './components/booking-summary/booking-summary.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import BookingEstimateTime from './components/booking-estimate-time/booking-estimate-time.vue'
import BookingMenu from './components/booking-description/components/booking-menu/booking-menu.vue'

const PerformanceResourceConfirm = () => import('Modules/calendar/components/common-form/performance-resource-confirm/performance-resource-confirm.vue')

// Models
// eslint-disable-next-line no-unused-vars
import Booking from 'Models/booking/booking'
import BookedResource from 'Models/booking/bookedResource.js'

// Constants
import { BOOKING_COLORS, BOOKING_STATUS } from 'Modules/calendar/constant'

const checkoutBookingStatus = [
  BOOKING_STATUS.CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_AUTO_CHECKED_OUT,
]

const MENU_WIDTH = 160
const MENU_HEIGHT = 247.5

const MENU_WIDTH_NO_SHOW_BOOKING = 160
const MENU_HEIGHT_NO_SHOW_BOOKING = 123.5

const MENU_WIDTH_ARRIVED_BOOKING = 160
const MENU_HEIGHT_ARRIVED_BOOKING = 158
const MENU_HEIGHT_ARRIVED_BOOKING_WITH_DRAFT = 71

const MENU_WIDTH_WALK_IN_BOOKING = 160
const MENU_HEIGHT_WALK_IN_BOOKING = 126

const MENU_WIDTH_NAVER_BOOKING = 160
const MENU_HEIGHT_NAVER_BOOKING = 217.5
const MENU_HEIGHT_NAVER_BOOKING_PAYMENT_IN_PROGRESS = 43.5
const MENU_TABLET_ADD_SPACE_CLOSE = 30
const MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING = 28
const MENU_TABLET_DESKTOP_SPACE_NO_ADD_DEPOSIT = 28
const MENU_TABLET_DESKTOP_PADDING_BOTTOM = 25 // Now Scroll bar is show
const MENU_SCREEN_MINIUM_HEIGHT = 700
const BOOKING_NAVER_WITOUT_DEPOSIT_TYPE = [
  BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL,
  BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON,
]

const LEFT_CONTAIN_MENU_POSITION = 10

const MAX_NUMBER_BOOKING_OF_CELL = 5
const MIN_NUMBER_CHECK_NO_SHOW_EXCLUDE_BOOKINGS = 1
const NEXT_DAY_BONUS_TIME = '24:00:00'
const BOOKING_MENU_OFFSET = 60 // Offset to account for [explain purpose]

export default {
  directives: {
    touchOutside: {
      bind(el, binding, vnode) {
        el.touchOutsideEvent = function(event) {
          // Check if the touch is outside the element
          if (!(el === event.target || el.contains(event.target))) {
            // If it is, call the method provided in the directive binding
            vnode.context[binding.expression](event)
          }
        }
        // Listen for touch events
        document.body.addEventListener('touchstart', el.touchOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('touchstart', el.touchOutsideEvent)
      },
    },
  },

  components: {
    DeviceView,
    BookedItems,
    BookingMenu,
    BookingResize,
    BookingSummary,
    BookingEstimateTime,

    BookingDescription: () => import('./components/booking-description/booking-description.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    NaverBooking,
    BookingCacheMixin,
    generateBookingRules('booking'),
  ],

  inject: ['date', 'resource', 'startTime', 'isOffDay'],

  props: {
    booking: {
      type:    Object,
      default: () => ({}),
    },

    bookingConfiguration: {
      type:    Object,
      default: () => null,
    },

    bookings: {
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
      bookingMenuTop:           0,
      bookingMenuLeft:          0,
      isBookingResizing:        false,
      isShowBookingActionMenu:  false,
      isShowBookingDescription: false,
      stylePosition:            { top: 0, left: 0 },

      clickedAtMinutes:            0,
      isFirstClick:                false,
      isAllowAddBooking:           false,
      isBookingMenuTouched:        false,
      isBookingDescriptionVisible: false,
      cellHeightPercentage:        localStorage.getItem(CELL_HEIGHT_SETTING_NAME) ?? CELL_HEIGHT_SETTING_DEFAULT,
      isExistDuplicateBooking:     false,
      allCalendarSetup:            null,
      isHiddenActionMenu:          false,
      isTargetOutCalendarSlots:    false,
      isShowResizeBarTablet:       true,
    }
  },

  computed: {
    ...mapState('_calendar', [
      'timeSlot',
      'timeShowUp',
      'notesShowUp',
      'serviceShowUp',
      'isMoveBookingMode',
      'timeSlotHeight',
      'calendarDatesRef',
      'allowDuplicateBookings',
      'bookedResourceNaverLink',
      'isShowQtyPrepaidService',
      'calendarSlotAccessOptions',
      'calendarDragPreviewElement',
      'isMouseMove',
    ]),

    ...mapGetters('_calendar', [
      'timeSlots',
      'timeSlotWidth',
      'resourcesBreakingTimesBySchedule',
    ]),

    ...mapState('_calendar', [
      'crossDate',

    ]),
    ...mapGetters('_calendar', [
      'defaultTimeSlotHeight',
    ]),

    ...mapState('_calendar', {
      openingStartTime: 'startTime',
      finishTime:       'finishTime',
    }),

    ...mapState('_calendar/drag', [
      'dragRef',
      'isDragging',
      'ghostBooking',
    ]),

    ...mapState('_calendar/drag', {
      draggingBooking: 'booking',

    }),

    ...mapState('_calendar/bookings', [
      'bookingSet',
    ]),

    ...mapGetters('_calendar/timeIndicator', [
      'nowInMinutes',
    ]),

    bookingRegistrationDate() {
      return moment(this.booking.registrationDate).format('YYYY-MM-DD')
    },

    showEstimateTime() {
      if(this.timeShowUp) {
        if(this.booking?.clientName){
          return this.isShowDetail
        }
        return true
      }
      return false
    },

    resizeTarget() {
      return () => this.$refs.booking.children[0]
    },

    bookingTarget() {
      return () => this.$refs.booking
    },

    isBookingMultiSlot() {
      return this.timeSlot < this.bookedResource.estimatedTime
    },

    openingStartTimeInMinutes() {
      return convertTimeToMinutes(this.openingStartTime)
    },

    startTimeText() {
      return isAmOrPm(this.startTime, false)
    },

    bookedResource() {
      return this.booking.bookedResources.find(bookedResource => {
        return bookedResource.bookingResourceSetupId === this.resource.id
      })
    },

    startTimeInMinutes() {
      return BookedResource.getStartTimeInMinutes({
        startTime: this.bookedResource.startTime,
        isNextDay: this.bookedResource.isNextDay,
      })
    },

    timeSlotUnitHeight() {
      return Number(this.timeSlotHeight) / Number(this.timeSlot)
    },

    bookingEstimatedTime() {
      return this.bookedResource.estimatedTime ?? this.timeSlot
    },

    offset() {
      return this.bookingConfiguration?.offset || 0
    },

    widthRatio() {
      return this.bookingConfiguration?.widthRatio || 1
    },

    isBookingDragging() {
      const [bookingResource] = this.booking?.bookedResources ?? []
      const [ghostBookedResource] = this.draggingBooking?.bookedResources ?? []

      return this.draggingBooking?.bookingId === this.booking?.bookingId
       && bookingResource?.bookingResourceSetupId === ghostBookedResource?.bookingResourceSetupId

    },

    bookingClass() {
      const bookingColors = (() => {
        if (BOOKING_COLORS?.[this.booking.status]) {
          return [`calendar-booking--${BOOKING_COLORS[this.booking.status]}`]
        }

        return []
      })()

      return [
        ...bookingColors,
        'calendar-booking',
        {
          'is-mobile': this.isMobileDevice,
        },
        {
          'calendar-booking--resizing':         this.isBookingResizing,
          'calendar-booking--no-hover':         this.isMoveBookingMode,
          'calendar-booking--dragging':         this.isBookingDragging,
          'calendar-booking--fade':             !this.booking.isGhostBooking,
          'calendar-booking--ghost':            this.booking.isGhostBooking,
          'calendar-booking--show-description': this.isBookingDescriptionVisible,
          'calendar-booking--show-menu':        this.isShowBookingActionMenu,
        }]
    },

    /**
     * Calculate booking visual style (position and dimensions)
     *
     * @description
     * Clips the booking display to the calendar opening hours.
     * If booking starts before opening time, only the visible portion is rendered.
     *
     * @example
     * - Opening time: 10:30 AM (630 minutes)
     * - Booking: 10:00 AM - 1:30 PM (600-810 minutes, estimated 180 minutes)
     *
     * Calculation:
     * - bookingStartTime = 600
     * - visibleStartTime = max(600, 630) = 630
     * - top = (630 - 630) * unitHeight = 0px (at the top of the first slot)
     *
     * @returns {Object} Style object with top, width, and left
     */
    bookingStyle() {
      const bookingStartTime = convertTimeToMinutes(this.booking?.bookedResources[0]?.startTime) +
        (this.booking?.bookedResources[0]?.isNextDay ? convertTimeToMinutes(NEXT_DAY_BONUS_TIME) : 0)

      // Clip to calendar opening time to prevent rendering outside visible area
      const visibleStartTime = Math.max(bookingStartTime, this.openingStartTimeInMinutes)
      const top = (visibleStartTime - this.openingStartTimeInMinutes) * this.timeSlotUnitHeight

      const isLastedResourceOfDay = this.lastedResource.id === this.resource.id
      return {
        top:   `${top}px`,
        width: `calc((100% / ${this.widthRatio}) - ${isLastedResourceOfDay ? 1 : 0}px)`,
        left:  `calc(100% / ${this.widthRatio} * ${this.offset})`,
      }
    },

    /**
     * Calculate booking container style (height)
     *
     * @description
     * Adjusts height to show only the visible portion if booking starts before opening time.
     *
     * @returns {Object} Style object with height
     */
    bookingContainerStyle() {
      const height = this.bookingEstimatedTime * this.timeSlotUnitHeight
      return {
        height: `${height}px`,
      }
    },

    bookingContainerClass() {
      return ['calendar-booking__container', {
        'calendar-booking__container--one-slot': !this.isBookingMultiSlot,
      }]
    },

    isDescriptionShown() {
      return this.isBookingDescriptionVisible && !this.isDragging
    },

    isBookingNotesShown() {
      return this.booking.notes && this.notesShowUp
    },

    isShowAddBookingDepositMenuNaverPrepayment() {
      return this.booking?.bookingDeposit?.status === options.booking_deposit_status.exist
    },

    isShowAddBookingDepositMenu() {
      const existedBookingDeposit = this.booking?.bookingDeposit?.status === options.booking_deposit_status.exist
      if(existedBookingDeposit) {
        return false
      }
      const hasSalesDraft = this.booking.draftDocumentId
      if(hasSalesDraft) {
        return false
      }

      const bookingNaverWithoutDeposit = BOOKING_NAVER_WITOUT_DEPOSIT_TYPE.includes(this.booking.extSystemBookingType)

      return this.isNaverBooking && bookingNaverWithoutDeposit
    },
    isAddableBooking() {
      if (!this.isAllowAddBooking) return false
      if (!this.allowDuplicateBookings && this.isExistDuplicateBooking) return false
      if (this.bookings.length === MAX_NUMBER_BOOKING_OF_CELL) return false

      const isNoShowBooking = this.booking.status === BOOKING_STATUS.NO_SHOW

      if (isNoShowBooking) {
        if (!this.hasDupplicateBooking() || this.isAllowAddBooking || this.allowDuplicateBookings) {
          return true
        }
        if (this.bookings.length === MIN_NUMBER_CHECK_NO_SHOW_EXCLUDE_BOOKINGS) {
          return true
        }
        if (this.noShowExcludeBookings?.length >= MIN_NUMBER_CHECK_NO_SHOW_EXCLUDE_BOOKINGS) {
          return false
        }
        return true
      }

      return this.allowDuplicateBookings
    },

    bookingHeight() {
      return this.bookingEstimatedTime * this.timeSlotUnitHeight
    },
    adjustedTimeSlotHeight() {
      return this.cellHeightPercentage * this.defaultTimeSlotHeight / CELL_HEIGHT_SETTING_DEFAULT
    },
    isShowDetail() {
      if(this.booking.status === BOOKING_STATUS.ARRIVED && checkNullAndEmpty(this.booking.clientName)) {
        return true
      }
      return this.cellHeightPercentage > CELL_HEIGHT_SETTING_DEFAULT || this.bookingHeight > this.adjustedTimeSlotHeight
    },
    isOneLine() {
      return this.cellHeightPercentage > CELL_HEIGHT_SETTING_DEFAULT || this.bookingHeight > this.adjustedTimeSlotHeight
    },

    dateTS() {
      return convertDateToMomentUTC(this.date).startOf('day').unix()
    },

    resourceWorkingHour() {
      const dates = this.date.day()
      const resourceBreakingTimeBySchedule = this.resourcesBreakingTimesBySchedule
      if(!resourceBreakingTimeBySchedule[this.resource.id]) {
        return {
          startTime:    null,
          finishTime:   null,
          breakingTime: [],
        }
      }

      const resourceWorkingHours = resourceBreakingTimeBySchedule[this.resource.id]
      const resourceWorkingHourOfDay = resourceWorkingHours.find(resourceWorkingHour => {
        return resourceWorkingHour.dayOfWeek === dates && resourceWorkingHour.timestamp === this.dateTS
      })
      return resourceWorkingHourOfDay?.workingHours
    },
  },

  watch: {
    isDragging(isDragging) {
      if (isDragging) {
        this.handleBookingDragStart()
      } else {
        this.handleBookingDragEnd()
      }
    },

    isDescriptionShown: {
      immediate: true,
      handler(isDescriptionShown) {
        if (isDescriptionShown) {

          window.addEventListener('mouseover', this.handleBookingOutsideClick)
          document.querySelector('.calendar-slots')?.addEventListener('wheel', this.handleBookingOutsideClick)
        } else {
          this.clickedAtMinutes = 0
          window.removeEventListener('mouseover', this.handleBookingOutsideClick)
          document.querySelector('.calendar-slots')?.removeEventListener('wheel', this.handleBookingOutsideClick)
        }
      },
    },

    isShowBookingActionMenu: {
      immediate: true,
      handler(isShowBookingActionMenu) {
        if (isShowBookingActionMenu) {
          window.addEventListener('mouseover', this.handleBookingOutsideClick)
          document.querySelector('.calendar-slots')?.addEventListener('wheel', this.handleBookingOutsideClick)
        } else {
          this.clickedAtMinutes = 0
          window.removeEventListener('mouseover', this.handleBookingOutsideClick)
          document.querySelector('.calendar-slots')?.removeEventListener('wheel', this.handleBookingOutsideClick)
        }
      },
    },

    isMouseMove(isMouseMove) {
      if (isMouseMove) {
        this.isShowResizeBarTablet = true
      } else {
        this.isShowResizeBarTablet = false
      }
    },
  },

  async mounted() {
    if(this.isAllTabletDevice) window.addEventListener('touchstart', this.handleBookingOutsideTouch)
    window.addEventListener('mouseup', this.handleMouseEventWhenDraggingBooking)
    CalendarEventBus.$on('stop-dragging', this.handleStopDragging)
    CalendarEventBus.$on('start-resize-booking', this.handleBookingStartResizeEventBus)
    CalendarEventBus.$on('booking-click', this.handleBookingClickEventBus)

    if(this.booking.bookingSource === BOOKING_SOURCE.NAVER) {
      this.allCalendarSetup = await this.$bookingCacheMixin_getAllCalendarSetup({
        shopId: this.shop_data.shop_id,
      })
    }

    this.isShowResizeBarTablet = this.isAllTabletDevice && !this.isIpad ? false : true
  },

  beforeDestroy() {
    if(this.isAllTabletDevice) window.removeEventListener('touchstart', this.handleBookingOutsideTouch)
    window.removeEventListener('mouseover', this.handleBookingOutsideClick)
    window.removeEventListener('mouseup', this.handleMouseEventWhenDraggingBooking)
    CalendarEventBus.$off('stop-dragging', this.handleStopDragging)
    CalendarEventBus.$off('start-resize-booking', this.handleBookingStartResizeEventBus)
    CalendarEventBus.$off('booking-click', this.handleBookingClickEventBus)
  },

  startDraggingTimeout: null,

  methods: {
    escapeHtml,
    ...mapActions('_calendar/drag', [
      'endDraggingBooking',
      'startDraggingBooking',
      'prepareDraggingBooking',
    ]),

    ...mapActions('_calendar', [
      'checkOffDay',
      'cancelCalendarSlotAccessible',
    ]),

    ...mapMutations('_calendar/drag', {
      setDragBooking: 'setBooking',
      setBookingRef:  'setBookingRef',
    }),

    ...mapActions('_calendar/bookings', [
      'moveBooking',
    ]),

    ...mapActions('_calendar/blockedTimes', [
      'checkBookingCrossBlockedTimes',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'openBookingActionBySlot',
      'openBookingActionForUpdating',
    ]),

    ...mapActions('_calendar/checkoutAction', [
      'checkoutBooking',
    ]),

    ...mapActions('_calendar/bookingDescription', [
      'openBookingDescription',
    ]),

    ...mapMutations('_calendar/bookings', [
      'setNaverProxyBooking',
      'setShowSelectSalesAssignment',
    ]),

    naverBookingTimeSlotOptions(calendarSetup) {
      const isMobileDevice = this.isMobileDevice
      const startTimeInMinutes = convertTimeToMinutes(this.openingStartTime)
      const finishTimeInMinutes = convertTimeToMinutes(this.finishTime) + Number(this.crossDate) * options.minutes_of_24h
      const naverBookingTimeSlots = calendarSetup.booking_naver_link_setup.bookingTimeSlot || 60

      const timeSlots = []
      const slots = (finishTimeInMinutes - startTimeInMinutes) / naverBookingTimeSlots

      for(let index = 0; index < slots; index++) {
        const minutes = startTimeInMinutes + (naverBookingTimeSlots * index)
        const text = (() => {
          if(isMobileDevice) {
            return formatTimeSlotAtMobile({ prefix: i18n.t('general.next-day-text'), minutes })
          }
          return formatTimeSlot({ prefix: i18n.t('general.next-day-text'), minutes })
        })()
        timeSlots.push({
          text,
          minutes,
        })
      }

      return timeSlots
    },

    formattedMemoText(text) {
      const truncText = escapeHtml(text)
      return truncText.replace(/\n/g, '<br>')
    },

    hasDupplicateBooking() {
      const resource = this.resource
      const startTime = this.startTime
      const endTime = this.startTime + this.timeSlot
      const dateTS = convertDateToMomentUTC(this.date).startOf('day').unix()
      const itemGroup = store.getters[`_calendar/bookings/${dateTS}_${resource.id}/itemGroups`]
      const bookingHasDuplicate = itemGroup.find(item =>
        startTime >= item.startTime &&
        startTime < item.endTime &&
        item.items.length > 0,
      )

      if(!bookingHasDuplicate || bookingHasDuplicate.items.length <= 1) return false

      if(bookingHasDuplicate) {
        const bookingDupplicateNotNoShow = (() => {
          const result = bookingHasDuplicate.items.find(booking => {
            const isNoShowBooking = booking.status !== options.booking.booking_status.no_show
            const duplicateTime = startTime >= convertTimeToMinutes(booking.bookedResources[0].startTime) && (endTime <= convertTimeToMinutes(booking.bookedResources[0].startTime) + booking.bookedResources[0].estimatedTime)

            return isNoShowBooking && duplicateTime
          })
          return result
        })()
        return Boolean(bookingDupplicateNotNoShow)

      }
      return false
    },

    setBookingDescriptionVisible() {
      this.isBookingDescriptionVisible = true
    },

    handleBookingDragEnd() {
      this.$refs.booking.classList.remove('calendar-booking--dragging')
      // document.body.removeEventListener('mousemove', this.handleDragBookingMoving)
    },

    handleBookingDragStart() {
      // Handle Start Dragging if needed
    },

    handleMouseEventWhenDraggingBooking(event) {
      if (this.isDragging) {
        const calendarSlots = document.getElementsByClassName('calendar-resource__slots')
        const isTargetInCalendarSlots = Array.from(calendarSlots).some(element => element.contains(event.target))

        // Check to show error message when drag booking outside of calendar + prevent check when click to loading spinner class
        if (!isTargetInCalendarSlots && !event.target.classList.contains('v-spinner')) {
          this.isTargetOutCalendarSlots = true
          this.handleBookingMouseUp(event)
          this.cancelCalendarSlotAccessible()
          this._showDialogAlert(i18n.t('bookings.can-not-move-out-calendar'))
        }
      }
    },

    /**@param {MouseEvent} */
    /**
     * @description Use debounce for handleBookingEnter because it will be called many times when
     * mouseover on booking
     */
    handleBookingEnter: debounce(function (event) {
      event.preventDefault()
      const bookingDepositIconEl = event?.target.querySelector('.booking-deposit')?.getBoundingClientRect()
      if(bookingDepositIconEl) {
        const clientX = event.clientX
        const clientY = event.clientY
        const isInsideIcon = () => {
          return (
            clientX >= bookingDepositIconEl.left &&
          clientX <= bookingDepositIconEl.right &&
          clientY >= bookingDepositIconEl.top &&
          clientY <= bookingDepositIconEl.bottom)
        }

        if(isInsideIcon() && this.isIpad) return
      }

      if(this.calendarSlotAccessOptions) {
        return
      }
      const { top } = this.$refs.booking.getBoundingClientRect()
      /**
       * @description clickedAtMinutes is used for calculate startTime when click Add Booking from
       * the booking. A new booking's startTime will be equal the clicked booking's startTime + clickedAtMinutes
       *
       * As a vuex state at:
       * - src/modules/calendar/store/bookingDescription.js
       *
       * As a props at:
       * - src/modules/calendar/components/calendar/calendar-booking/components/booking-description/components/booking-description-action/booking-description-action.vue
       */
      this.clickedAtMinutes = Math.floor((event.clientY - top) / this.timeSlotHeight) * this.timeSlot

      if (!this.isMobileDevice) {

        /**
         * @description
         * When mouseover the booking, give it a click event
         * to show the booking description and hide the booking action menu
         * because the calendar-slot will override the reservation description menu
         */

        if (this.isAllTabletDevice) this.$refs.booking.click()
        this.isShowBookingActionMenu = false
        this.isHiddenActionMenu = false
        this.isShowBookingDescription = true
        this.setBookingDescriptionVisible()
      }
    }, 10),

    handleBookingMouseUp(event) {
      event.preventDefault()

      /* Check condittions for Bug #2825 Case 11: check case Drag booking out of timeslot calendar at the bottom
      - isTargetOutCalendarSlots: to show only 1 alert
      - check calendar-slot__drop-zone class to check case Drag booking out of timeslot calendar at the bottom
      */
      if (!this.isTargetOutCalendarSlots && this.isDragging && !this.isBookingResizing && !event.target.classList.contains('calendar-slot__drop-zone')) {
        this._showDialogAlert(i18n.t('bookings.can-not-move-out-calendar'))
      }
      this.isTargetOutCalendarSlots = false

      this.endDraggingBooking()
      this.cancelCalendarSlotAccessible()
      clearTimeout(this.$options.startDraggingTimeout)

      this.$refs.booking?.classList?.remove('calendar-booking--dragging')
    },

    /**@param {TouchEvent} event */
    handleBookingOutsideTouch(event) {
      event.stopPropagation()
      if (!this.$refs.booking.contains(event.target)) {
        this.isFirstClick = false
      }
    },

    /**@param {MouseEvent} event */
    handleBookingOutsideClick: debounce(function (event) {
      let isLimitScrollToHideBookingMenu = false
      if (event.type === 'wheel') {
        const hoveredSlot = document.querySelector('.calendar-slot.calendar-slot--hovered')
        if (hoveredSlot) {
          const childOfHoveredSlot = hoveredSlot.querySelector('.calendar-booking__container')
          if(childOfHoveredSlot) {
            const { bottom } = childOfHoveredSlot.getBoundingClientRect()
            const bottomScreenY = bottom - BOOKING_MENU_OFFSET
            const mouseScreenY = event.clientY

            if (mouseScreenY > bottomScreenY) {
              isLimitScrollToHideBookingMenu = true
            }
          }
        }
      }

      event.stopPropagation()
      if (!this.$refs.booking.contains(event.target) || isLimitScrollToHideBookingMenu) {
        this.isBookingDescriptionVisible = false
        this.isShowBookingActionMenu = false
      }
    }, 10),

    checkCrossWorkingHours(resourceWorkingHour, newBookingDuration) {
      if (!resourceWorkingHour) return
      const { newStartTime, bookingDuration} = newBookingDuration
      const newBookingEndTime = newStartTime + bookingDuration
      const { finishTime, breakingTimes } = resourceWorkingHour

      if(newStartTime < finishTime && newBookingEndTime > finishTime) {
        return true
      }

      return breakingTimes.some(breakTime => {
        const breakStartTime = breakTime.startTime
        const breakEndTime = breakTime.finishTime
        if(newStartTime < breakStartTime && newBookingEndTime > breakEndTime) {
          return true
        }

        if(newStartTime > breakStartTime && newStartTime < breakEndTime) {
          return true
        }

        if(newBookingEndTime > breakStartTime && newStartTime < breakEndTime) {
          return true
        }

        return false
      })
    },

    /**
     * @param {Object} movingData
     * @param {Booking} movingData.booking
     * @param {Boolean} movingData.isOffDay
     * @param {Booking} movingData.movingBooking
     * @param {Boolean} movingData.isWorkingTimeAvailable
     */
    async handleMoveBooking(movingData, isConfirmed = false) {
      // because bookingResource of movingData allways have 1 item so we find this booking on bookingSet to take all the bookingResource of movingBooking
      const bookingSet = Booking.build(
        this.bookingSet[movingData.booking.bookingId],
      )
      try {
        const { isOffDay, isWorkingTimeAvailable, booking, movingBooking, bookingDate } = movingData
        const currentDateUTC = convertDateToMomentUTC(new Date()).startOf('day')

        const startTimeInMinutes = convertTimeToMinutes(movingBooking.bookedResources[0].startTime)

        const shouldUpdateBookingNaver = (() => {
          return startTimeInMinutes !== this.startTime
          || movingBooking.bookedResources[0].bookingResourceSetupId !== this.resource.id
          || !bookingDate.isSame(this.date)
        })()

        // if is naver booking and not the booking not drag to other position, we dont't need to update booking
        if(movingBooking.bookingSource ===BOOKING_SOURCE.NAVER && !shouldUpdateBookingNaver) {
          return
        }

        const isGeneralNaverBooking = movingBooking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL
        const isPastBookingDate = bookingDate.isBefore(currentDateUTC)
        const isTodayBookingDate = bookingDate.isSame(currentDateUTC)
        const isStartTimeInPast = startTimeInMinutes <= this.nowInMinutes

        if(booking.bookingSource === BOOKING_SOURCE.NAVER) {
          this.allCalendarSetup = await this.$bookingCacheMixin_getAllCalendarSetup({
            shopId: this.shop_data.shop_id,
          })
          const naverBookingTimeSlot = this.naverBookingTimeSlotOptions(this.allCalendarSetup)

          const convertTimeSlotMinuteToHour = naverBookingTimeSlot.map(timeSlot => timeSlot.minutes / 60)
          const isExistNaverTimeSlot = convertTimeSlotMinuteToHour.includes(startTimeInMinutes / 60)
          if(!isExistNaverTimeSlot) {
            this._showDialogAlert(i18n.t('bookings.the-start-time-for-naver-booking-only-available-in-minite', {
              minute: this.allCalendarSetup?.booking_naver_link_setup?.bookingTimeSlot || 60,
            }))
            return
          }
        }

        const isPreventMoveNaverBooking = isGeneralNaverBooking && ((isPastBookingDate) || (isTodayBookingDate && isStartTimeInPast))

        if(isPreventMoveNaverBooking) {
          this._showDialogAlert(i18n.t('bookings.you-can-not-change-the-booking-time-on-naver-booking-to-earlier-than-now'))
          return
        }

        const isMovingToSameDay = booking.bookingDateTS === movingBooking.bookingDateTS
        const bookingDateFormatted = moment(bookingDate).format(options.standard_date_format.ymd)
        const messageOffDate = i18n.t('bookings.off-date-can-not-make-booking', {'date-time': bookingDateFormatted})
        const messageForSpecificOffDate = i18n.t('bookings.selected-date-is-shop-specific-off-day').replace('#date', this.bookingRegistrationDate)

        const messageMultipleResourceOffDate = i18n.t('validate-message.specification.multi-resources-booking-can-not-moving-to-other-date', {
          date: bookingDateFormatted,
        })
        const isMultipleResource = bookingSet.bookedResources.length > 1

        /**@description Handle to prevent dragging a booking to off day */
        if (isOffDay) {
          let errorMessage = ''

          if (isMovingToSameDay) {
            errorMessage = messageForSpecificOffDate
          } else if (isMultipleResource) {
            errorMessage = messageMultipleResourceOffDate
          } else {
            errorMessage = messageOffDate
          }

          throw new Error(errorMessage)
        }
        if (!isWorkingTimeAvailable) {
          const bookingDateTemp = bookingDate.toDate()
          const bookingResourceSetupId = this.ghostBooking?.bookedResources[0].bookingResourceSetupId
          const data = {
            'bookingDate': bookingDateTemp,
            bookingResourceSetupId,
          }

          const isOffDayBooking = await this.checkOffDay(data)

          const errorMessage = isOffDayBooking
            ? messageOffDate
            : i18n.t('bookings.warning-start-time-exceeds-working-hours')

          throw new Error(errorMessage)
        }

        /**@description Handle to prevent dragging a booking to blocked time */
        const isCrossBlockedTimes = await this.checkBookingCrossBlockedTimes(movingBooking)
        if (isCrossBlockedTimes) {
          this._showDialogAlert(i18n.t('bookings.booking-move-duplicate-with-blocked-time'))
          return
        }

        const bookingNaverType = booking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL

        const isShowConfirmReschedule = (() => {

          if(movingBooking.bookingSource !== BOOKING_SOURCE.NAVER) return false

          const movedResource = this.bookedResourceNaverLink.find(resource => resource.resourceId === movingBooking.bookedResources[0].bookingResourceSetupId)

          if(movedResource) {
            const { externalSystemPaymentType } = movedResource
            return externalSystemPaymentType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL
          }

          return false
        })()

        const resourceWorkingHours = this.resourceWorkingHour
        const isCrossBreakingTimeHours = this.checkCrossWorkingHours(resourceWorkingHours, {newStartTime: startTimeInMinutes, bookingDuration: this.bookedResource.estimatedTime})

        if(bookingNaverType && !isCrossBreakingTimeHours && !isConfirmed && shouldUpdateBookingNaver && !movingBooking.isBookingExceedsWorkHours && movingBooking.mustCheckPerformanceResource && isShowConfirmReschedule) {
          this.handleBookingMovingError(movingData)
          return
        }

        await this.moveBooking({ booking, movingBooking, calendarSetup: this.allCalendarSetup})
      } catch(error) {
        if (error?.isApiError()) {
          this.handleDragBookingError(new BookingApiError(error), movingData, isConfirmed)
          return
        }

        this._showDialogAlert(error.message)
      }
    },

    /**
     * @param {BookingApiError} error
     *
     * @param {Object} movingData
     * @param {Booking} movingData.booking
     * @param {Booking} movingData.movingBooking
     */

    async handleBookingMovingError(movingData) {
      try {
        const clonedMovingBooking = movingData.movingBooking.clone()
        if(movingData.booking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL) {
          const message = [
            i18n.t('bookings.booking-naver-general-moving-confirm-message'),
          ]

          const isBookingNaverGeneralConfirmed = await this._showDialogConfirm(message, {
            cancelBtnText:  i18n.t('general.cancel'),
            confirmBtnText: i18n.t('general.confirm'),
          })

          if(!isBookingNaverGeneralConfirmed) return
          this.preLoader()
          this.handleMoveBooking({
            ...movingData,
            movingBooking: clonedMovingBooking,
          }, true)

        }
      } catch (error) {
        this._showDialogAlert(error.message)
      }

    },

    async handleDragBookingError(error = new BookingApiError(), movingData, isConfirmed = false) {
      if (error.hasUnacceptableErrors) {
        this._showDialogAlert(error.unacceptableErrorMessages)
        return
      }

      /**@type {Booking} */
      const clonedMovingBooking = movingData.movingBooking.clone()

      if (error.hasExceedWorkingHoursErrors) {
        const messages = [
          i18n.t('bookings.warning-booking-over-working-hours'),
          i18n.t('general.warning-really-save'),
        ]

        const isBookingExceedsWorkHoursConfirmed = await this._showDialogConfirm(messages, {
          cancelBtnText:  i18n.t('general.no'),
          confirmBtnText: i18n.t('general.yes'),
        })
        if (!isBookingExceedsWorkHoursConfirmed) return

        clonedMovingBooking.isBookingExceedsWorkHours = true
      }

      if (error.hasResourceNotPerformanceServiceErrors) {
        const isMustCheckPerformanceResourceConfirmed = await this._showDialogConfirm(error.resourceNotPerformanceServiceErrorsMessages, {
          title:          i18n.t('general.alert'),
          component:      PerformanceResourceConfirm,
          cancelBtnText:  i18n.t('general.no'),
          confirmBtnText: i18n.t('general.yes'),
        })
        if (!isMustCheckPerformanceResourceConfirmed) return

        clonedMovingBooking.mustCheckPerformanceResource = false
      }
      const bookingNaverType = movingData.booking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL

      if(bookingNaverType && !isConfirmed) {
        if(movingData.booking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL) {
          const message = [
            i18n.t('bookings.booking-naver-general-moving-confirm-message'),
          ]

          const isBookingNaverGeneralConfirmed = await this._showDialogConfirm(message, {
            cancelBtnText:  i18n.t('general.cancel'),
            confirmBtnText: i18n.t('general.confirm'),
          })

          if(!isBookingNaverGeneralConfirmed) return
        }
      }

      this.handleMoveBooking({
        ...movingData,
        movingBooking: clonedMovingBooking,
      }, true)
    },

    async handleDragBooking() {
      this.$refs.booking?.classList?.add('calendar-booking--dragging')

      /**
       * @description When drag booking exceeds work hours then always show confirm alert accept update exceed hours booking
      */
      const booking = this.booking
      booking.isBookingExceedsWorkHours = false
      booking.mustCheckPerformanceResource = true

      try {
        const movingData = await this.prepareDraggingBooking({
          booking,
          bookingRef: this.$refs.booking,
        })

        this.preLoader()

        await this.handleMoveBooking(movingData)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
        this.endDraggingBooking()
        this.cancelCalendarSlotAccessible()
      }
    },

    handleDocumentMouseUp() {
      this.endDraggingBooking()
      clearTimeout(this.$options.startDraggingTimeout)

      this.$refs.booking?.classList?.remove('calendar-booking--dragging')
    },

    async handleBookingMouseDown(event) {
      const bookingMenu = document.querySelector('.booking-menu')
      if (bookingMenu && bookingMenu.contains(event.target)) {
        return
      }

      if(this.calendarSlotAccessOptions) {
        return
      }
      if (checkoutBookingStatus.includes(this.booking.status)) {
        return
      }

      if (this.booking.draftDocumentId) {
        return
      }

      const { extSystemBookingType } = this.booking

      if (
        (this.isNaverBooking && extSystemBookingType !== BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL) ||
        (this.isNaverBooking && this.booking.status === BOOKING_STATUS.NO_SHOW)
      ) {
        return
      }

      const LEFT_MOUSE_BUTTON = 1
      if (event.which !== LEFT_MOUSE_BUTTON) return
      clearTimeout(this.$options.startDraggingTimeout)

      /**@description It's used for the user mouse down and move away booking then mouse up.
       * If there isn't document.addEventListener below, It keep starting drag booking process
       * while the user actually moused up
        */
      document.addEventListener('mouseup', this.handleDocumentMouseUp)

      this.$options.startDraggingTimeout = setTimeout(async () => {
        await this.startDraggingBooking()

        this.handleDragBooking()
        document.removeEventListener('mouseup', this.handleDocumentMouseUp)
        clearTimeout(this.$options.startDraggingTimeout)
      }, 300)
    },

    handleBookingDescriptionHide() {
      this.isBookingDescriptionVisible = false
    },

    onMouseenterBookingDescription() {
      if(!this.isMobileDevice) {
        this.isBookingDescriptionVisible = false
      }
    },

    handleBookingDepositIconClick() {
      this.isBookingDescriptionVisible = false
      this.isShowBookingActionMenu = false
      CalendarEventBus.$emit('booking-deposit-click', this.booking)
    },

    async handleSalesDraftIconClick() {
      CalendarEventBus.$emit('sales-draft-click', this.booking)
    },

    handleBookingStopResize() {
      this.isBookingResizing = false
    },

    handleBookingStartResize() {
      this.isBookingResizing = true
      this.isBookingDescriptionVisible = false
      this.isShowBookingActionMenu = false
    },

    handleBookingStartResizeEventBus() {
      this.isBookingMenuTouched = false
      this.isFirstClick = false
      this.isShowBookingActionMenu = false
      this.isShowBookingDescription = false
      this.isBookingDescriptionVisible = false
    },

    handleClickResizeIcon() {
      this.isBookingResizing = false
      this.isBookingDescriptionVisible = false
      this.isShowBookingActionMenu = false
    },

    handleBookingClickEventBus() {
      this.isShowBookingDescription = false
    },

    handleBookingMenuTouchEvent(event) {
      if(this.isTabletDevice) {
        event.stopPropagation()
        this.isBookingMenuTouched = true
        const bookingMenuTouchedResetTimeout = setTimeout(() => {
          this.isBookingMenuTouched = false
          clearTimeout(bookingMenuTouchedResetTimeout)
          this.isFirstClick = false
        }, 500)
      }
    },

    async handleBookingClick(event) {
      CalendarEventBus.$emit('booking-click')

      // Check the specific off day when adding a booking from the waiting list
      if (this.isOffDay) {
        const dateSelected = convertDateToMomentUTC(this.date).startOf('day').format(options.standard_date_format.ymd)
        const messageForSpecificOffDate = this.$t('bookings.selected-date-is-shop-specific-off-day').replace('#date', dateSelected)

        this._showDialogAlert(messageForSpecificOffDate)
        return
      }

      // Return if Accessible Mode OR Not-allowed click
      if(this.calendarSlotAccessOptions || this.checkNotAllowClick(event)) {
        return
      }

      const { clientX, clientY } = event
      const { top, left } = this.$refs.booking.getBoundingClientRect()

      let topPosition = clientY - top
      let leftPosition = clientX - left

      const clickedRowIndex = Math.floor(topPosition / this.timeSlotHeight)
      const clickIdexRow = this.timeSlotIndex + clickedRowIndex
      const findIndex = this.timeSlots.findIndex((_, index) => {
        return clickIdexRow === index
      })

      const clickedRowDuration = this.timeSlots[findIndex]
      const clickedRowStartTime = clickedRowDuration?.minutes
      const clickedRowEndTime = clickedRowDuration?.minutes + this.timeSlot

      const resource = this.resource
      const startTime = this.startTime
      const dateTS = convertDateToMomentUTC(this.date).startOf('day').unix()
      const itemGroup = store.getters[`_calendar/bookings/${dateTS}_${resource.id}/itemGroups`]
      const duplicateBookingsGroup = itemGroup.find(item =>
        startTime >= item.startTime &&
        startTime < item.endTime &&
        item.items.length > 0,
      )

      let isExistDuplicateBooking = false

      if (duplicateBookingsGroup?.items?.length === 1 && duplicateBookingsGroup.items[0].status === BOOKING_STATUS.NO_SHOW) {
        this.isAllowAddBooking = true
      } else {
        isExistDuplicateBooking = duplicateBookingsGroup?.items.some(booking => {
          const bookingResource = booking?.bookedResources[0]
          const bookingStartTime = BookedResource.getStartTimeInMinutes({
            startTime: bookingResource?.startTime,
            isNextDay: bookingResource?.isNextDay,
          })
          const bookingEndTime = bookingStartTime + bookingResource?.estimatedTime

          const isBookingDuringClickedRow = bookingStartTime === clickedRowStartTime && booking.status !== BOOKING_STATUS.NO_SHOW
          const overlapsWithClickedRow = bookingEndTime > clickedRowStartTime && bookingEndTime <= clickedRowEndTime && booking.status !== BOOKING_STATUS.NO_SHOW

          return isBookingDuringClickedRow || overlapsWithClickedRow
        })
      }

      this.isExistDuplicateBooking = isExistDuplicateBooking

      if(this.timeSlotIndex + clickedRowIndex + 1 <= this.timeSlots.length) {
        this.isAllowAddBooking = true
      } else {
        this.isAllowAddBooking = false
      }

      const getMenuDimensions = () => {
        if ((this.isNoShowBooking || this.isBookingCheckedOut) && this.isAddableBooking) {
          return { width: MENU_WIDTH_NO_SHOW_BOOKING, height: MENU_HEIGHT_NO_SHOW_BOOKING }
        } else if ((this.isNoShowBooking || this.isBookingCheckedOut) && !this.isAddableBooking ) {
          return { width: MENU_WIDTH_NO_SHOW_BOOKING, height: MENU_HEIGHT_NO_SHOW_BOOKING - MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING }
        }

        if (this.isArrivedBooking && this.booking?.bookingClientType === BOOKING_CLIENT_TYPE.BOOKED_CLIENT && !this.hasDraftDocument) {
          return { width: MENU_WIDTH_ARRIVED_BOOKING, height: MENU_HEIGHT_ARRIVED_BOOKING + (this.isAddableBooking ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING : 0) - (this.isNaverBooking ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING : 0)}
        } else if (this.isArrivedBooking && this.hasDraftDocument) {
          return { width: MENU_WIDTH_ARRIVED_BOOKING, height: MENU_HEIGHT_ARRIVED_BOOKING_WITH_DRAFT + (this.isAddableBooking ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING : 0)}
        }

        if (this.isNaverBooking && this.booking.status !== BOOKING_STATUS.PAYMENT_IN_PROGRESS) {
          return { width: MENU_WIDTH_NAVER_BOOKING, height: MENU_HEIGHT_NAVER_BOOKING + (this.isAddableBooking ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING : 0) - (this.isShowAddBookingDepositMenuNaverPrepayment ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_DEPOSIT : 0) }
        } else if (this.isNaverBooking && this.booking.status === BOOKING_STATUS.PAYMENT_IN_PROGRESS) {
          return { width: MENU_WIDTH_NAVER_BOOKING, height: MENU_HEIGHT_NAVER_BOOKING_PAYMENT_IN_PROGRESS }
        }

        if (this.isWalkInBooking && this.booking?.bookingClientType === BOOKING_CLIENT_TYPE.WALKING_CLIENT) {
          return { width: MENU_WIDTH_WALK_IN_BOOKING, height: MENU_HEIGHT_WALK_IN_BOOKING + (this.isAddableBooking ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING : 0) }
        }

        return { width: MENU_WIDTH, height: MENU_HEIGHT - (!this.isAddableBooking ? MENU_TABLET_DESKTOP_SPACE_NO_ADD_BOOKING : 0) }
      }

      // Get Menu width / height Booking Menu
      let { width, height } = getMenuDimensions()
      if (this.isAllTabletDevice && this.isPortraitMode) height = height + MENU_TABLET_ADD_SPACE_CLOSE

      // Get Top Height from Header Table
      const { top: topHeader = 0, height: heightHeader = 0 } = document.querySelector('.opening-hours__item--header')?.getBoundingClientRect() || {}

      // Additional check for bottom edge overflow in specific conditions
      const calendarPaddingNeedtoBeExcluded = this.isDesktopDevice || this.isAllTabletDevice ? MENU_TABLET_DESKTOP_PADDING_BOTTOM : 0

      // Adjust left and top position to ensure the menu does not overflow any edge of the window
      leftPosition = clientX + width > window.innerWidth ? leftPosition - width : leftPosition - LEFT_CONTAIN_MENU_POSITION // Add  pixel to contain menu
      topPosition = Math.max(0, clientY + height > window.innerHeight - calendarPaddingNeedtoBeExcluded && window.innerHeight >= MENU_SCREEN_MINIUM_HEIGHT ? topPosition - height : topPosition)

      // Get calendar ScrollTop
      const calendarScrollTop = document.querySelector('.calendar-schedule')?.scrollTop || 0
      const calendarScrollHeight = document.querySelector('.calendar-schedule')?.scrollHeight || 0
      const calendarClientHeight = document.querySelector('.calendar-schedule')?.clientHeight || 0

      const checkMenuAtBottom = clientY + height > window.innerHeight - calendarPaddingNeedtoBeExcluded

      // For Case Booking Menu at the bottom calendar & Small Screen
      if (checkMenuAtBottom && (window.innerHeight >= MENU_SCREEN_MINIUM_HEIGHT ||
      (window.innerHeight < MENU_SCREEN_MINIUM_HEIGHT && calendarScrollTop + calendarClientHeight + (clientY - topHeader - heightHeader) >= calendarScrollHeight ))) {
        // Set top position based on the conditions
        topPosition = clientY - top - height
      }

      this.stylePosition = {
        top:  `${topPosition}px`,
        left: `${leftPosition}px`,
      }

      if (!this.isMobileDevice && this.isNaverBooking && this.booking.status === BOOKING_STATUS.PAYMENT_IN_PROGRESS && !this.isAddableBooking) {
        if (this.booking.clientId) {
          this.isShowBookingActionMenu = true
        } else {
          this.isShowBookingActionMenu = false
        }

        this.isShowBookingDescription = false
        return
      }
      if(!this.isMobileDevice) {
        this.isShowBookingDescription = false
        if (this.isAllTabletDevice && !this.isFirstClick) {
          this.isFirstClick = true
          this.isShowBookingDescription = true
          this.isBookingDescriptionVisible = true
        } else {
          // isBookingMenuTouched is used for the case of Ipad, other cases will be set to true
          if (!this.isHiddenActionMenu) {
            this.isShowBookingActionMenu = !this.isBookingMenuTouched
          }
        }
      } else {
        this.openBookingDescription({
          booking:   this.booking,
          isAddable: this.isAddableBooking,
          options:   {
            clickedAtMinutes: this.clickedAtMinutes,
          },
        })
      }

      this.noShowExcludeBookings = this.bookings.filter((item) => {
        return item.status !== BOOKING_STATUS.NO_SHOW
      })
    },

    handleCancelBooking() {
      this.$emit('hide')
      CalendarEventBus.$emit('cancel-booking', this.booking)
    },

    handleViewSalesDetail() {
      this.$emit('hide')
      CalendarEventBus.$emit('view-sales-detail', this.booking)
    },

    handleAddBookingDeposit() {
      this.$emit('hide')
      CalendarEventBus.$emit('add-booking-deposit', this.booking)
    },

    handleViewClientInformation() {
      this.$emit('hide')
      CalendarEventBus.$emit('view-client-information', this.booking)
    },

    handleNoShowBooking() {
      this.$emit('hide')
      CalendarEventBus.$emit('no-show-booking', { booking: this.booking, isNaverBooking: this.isNaverBooking})
    },

    async handleCheckOutBooking() {
      try {
        this.preLoader()
        if(this.isNaverBookingRefund) {
          this.$emit('hide')
          throw new Error(i18n.t('bookings.cant-add-sales-for-refunded-naver-booking'))
        }

        const booking = Booking.build(
          this.bookingSet[this.booking.bookingId],
        )
        this.$emit('hide')

        /**
         * Condition to show Select Sales Assignment
         * - If is Naver proxy booking
         * - If not NPAY at salon and NPAY payment ( deposit & prepayment )
         */
        if (
          booking?.isNaverBooking
          && booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo
        ) {
          if (booking.draftDocumentId) {
            await this.handleSalesDraftIconClick()
          } else {
            this.setNaverProxyBooking(booking)
            this.setShowSelectSalesAssignment(true)
          }
        } else {
          if (booking.draftDocumentId) {
            await this.handleSalesDraftIconClick()
          } else {
            await this.checkoutBooking({
              booking,
              isAddBookingToSalesImmediate: true,
            })
          }
        }

        this.isShowBookingActionMenu = false
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleAddBooking() {
      try {
        this.preLoader()

        await this.openBookingActionBySlot({
          date:      this.date,
          resource:  this.resource,
          startTime: this.startTime + this.clickedAtMinutes,
        })

        this.$emit('hide')
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleEditBooking() {
      try {
        this.preLoader()

        const booking = Booking.build(
          this.bookingSet[this.booking.bookingId],
        )

        this.$emit('hide')

        const skipFetchingBookingDetail = this.isNaverBooking || this.isBookingCheckedOut || this.isNoShowBooking

        await this.openBookingActionForUpdating({
          booking,
          skipClient:             skipFetchingBookingDetail,
          skipBookedItems:        skipFetchingBookingDetail,
          bookingResourceSetupId: this.booking.bookedResources.at(0).bookingResourceSetupId,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleDeleteBooking() {
      try {
        const isConfirm = await this._showDialogConfirm(this.$t('bookings.confirm-delete-message'), {
          confirmBtnColor: 'red',
          confirmBtnText:  i18n.t('general.delete'),
        })

        if(isConfirm) {
          this.preLoader()

          const payload = {
            shopId:           this.shop_data.shop_id,
            bookingId:        this.booking.bookingId,
            deleteDataTimeTS: convertDateToMomentUTC().unix(),
          }

          await deleteBookingCanceled(payload)

          CalendarEventBus.$emit('load-booking-calendar', this.booking)
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleStopDragging() {
      this.$refs.booking?.classList?.remove('calendar-booking--dragging')
      this.endDraggingBooking()
      this.cancelCalendarSlotAccessible()
      clearTimeout(this.$options.startDraggingTimeout)
    },

    handleTouchOutside() {
      if (this.isAllTabletDevice) {
        this.isShowBookingActionMenu = false
        this.isShowBookingDescription = false
        this.isBookingDescriptionVisible = false
      }
    },

    checkNotAllowClick(event) {
      return event.target.classList.contains('booking-menu__link--disabled') || event.target.classList.contains('booking-menu__link-state') || event.target.classList.contains('booking-menu__list')
    },

    handleHide() {
      this.$emit('hide')
      this.isFirstClick = false
      this.isBookingMenuTouched = false
      this.isShowBookingActionMenu = false
      this.isShowBookingDescription = false
      this.isBookingDescriptionVisible = false
      this.isHiddenActionMenu = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-booking.scss";
</style>
