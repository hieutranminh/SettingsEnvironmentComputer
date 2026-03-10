<template>
  <div
    ref="calendarSchedule"
    :class="calendarScheduleClass"
    @scroll="handleCalendarScroll"
  >
    <div
      id="calendarScheduleContainer"
      class="calendar-schedule__container"
    >
      <!-- <calendar-time-indicator /> -->

      <div
        ref="openingHours"
        class="calendar-schedule__opening-hours"
      >
        <opening-hours
          :time-slots="timeSlots"
          :is-multi-dates="isMultiDates"
          :time-slot-height="timeSlotHeight"
        />

        <calendar-hour-indicator v-if="displayCurrentTime" />
      </div>

      <div class="calendar-schedule__main">
        <div
          ref="dates"
          :class="calendarScheduleDatesClass"
        >
          <div
            v-for="({ date, isOffDay, bookingResources }) in schedule"
            :key="`calendar_date_${date.format('DDMMYYHHmm')}`"
            class="calendar-schedule__date date"
          >
            <div
              v-if="isMultiDates || getSelectedResourceMobileDevice"
              :class="dateTitleClass"
            >
              <div class="calendar-schedule__date-view">
                <calendar-dates
                  :number-resource-display="numberResourceDisplay"
                  :date="date"
                />
              </div>
            </div>

            <div class="calendar-schedule__resources">
              <div
                v-for="bookingResource in bookingResources"
                :key="`calendar_resource_${bookingResource.id}`"
                class="calendar-schedule__resource resource"
              >
                <calendar-resource
                  :date="date"
                  :resource="bookingResource"
                  :lasted-resource="lastedResource(bookingResources)"
                  :is-off-day="checkOffDay({ isOffDay, bookingResource })"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <calendar-drag-booking />

    <calendar-context-menu />
  </div>
</template>

<script>
// Utilities
import store from 'VuexStore'
import { options } from 'OptionsHelpers'
import moment from 'moment'
import { convertDateToTimeStamp , formatDateByString } from 'CommonHelpers'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'

import { CalendarEventBus, convertTimeToMinutes, convertTimestampToMomentUTC } from 'Modules/calendar/utils'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Calendar Components
import CalendarDates from '../calendar-dates/calendar-dates.vue'
import OpeningHours from './components/opening-hours/opening-hours.vue'
import CalendarResource from '../calendar-resource/calendar-resource.vue'
import CalendarDragBooking from '../calendar-drag-booking/calendar-drag-booking.vue'
import CalendarContextMenu from '../../calendar-context-menu/calendar-context-menu.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import CalendarViewMixin from 'Modules/calendar/mixins/calendar-view'

const MAX_NUMBER_COLUMN_SHOW = 3
const SIDE_BAR_WIDTH_AND_BORDER_Y = 60 //the width of side bar and the border the border between the resource
// const RESOURCE_MORE_THEN_4_COLUMN = 4
const STATUS_CANCEL = 2
const REMOVE_ANIMATION_TIME = 5000
const NAVER_LIST = 'naver-list'
const BOOKING_LIST = 'booking-list'
const DEFAULT_NUMBER_OF_RESOURCE = 3
const RETRY_ANIMATION_TIME = 500

export default {
  components: {
    OpeningHours,
    CalendarDates,
    CalendarResource,
    CalendarDragBooking,
    CalendarContextMenu,

    // CalendarLineIndicator: () => import('Modules/calendar/components/calendar-time-indicator/components/calendar-line-indicator/calendar-line-indicator.vue'),
    CalendarHourIndicator: () => import('Modules/calendar/components/calendar-time-indicator/components/calendar-hour-indicator/calendar-hour-indicator.vue'),
  },

  extends: ComponentBase,

  mixins: [DeviceMixin, CalendarViewMixin],

  data() {
    return {
      oldBookingElement:  null,
      isMoveNaverBooking: false,
      naverMoveBooking:   null,
      options,
      tableContetWidth:   0,
      isTouchEvent:       false,
      resourceWidth:      0,
    }
  },

  computed: {
    ...mapState('_calendar', [
      'timeSlot',
      'resourceRef',
      'timeSlotHeight',
      'bookingResources',
      'isBookingDragging',
      'selectedResourceId',
      'displayCurrentTime',
      'isCalendarSlotAccessible',
    ]),

    ...mapGetters('_calendar', [
      'toDate',
      'fromDate',
      'schedule',
      'timeSlots',
      'isMultiDates',
      'timeSlotWidth',
      'defaultTimeSlotHeight',
      'maxinumNumberOfResource',
      'getSelectedResourceMobileDevice',
    ]),

    ...mapGetters('device', [
      'isMobileDevice',
    ]),

    ...mapState('_calendar/drag', [
      'isDragging',
    ]),

    ...mapState('_calendar', {
      openingStartTime: 'startTime',
    }),

    calendarScheduleClass() {
      return ['calendar-schedule', {
        'calendar-schedule--dragging': this.isDragging,
      }]
    },

    numberResourceDisplay() {
      const shopId = this.shop_data.shop_id
      const numberDisplayResourceOfShop = this.maxinumNumberOfResource.find(item => item.shopId === shopId)
      if(numberDisplayResourceOfShop) {
        return numberDisplayResourceOfShop.numberOfResource
      }
      return DEFAULT_NUMBER_OF_RESOURCE
    },

    dateTitleClass() {
      return ['date__title', {
        'date__title--multi-dates':   this.isMultiDates,
        'date__title--resource-view': this.selectedResourceId,
      }]
    },

    calendarScheduleDatesClass() {
      return ['calendar-schedule__dates', {
        'calendar-schedule__dates--dragging':   this.isDragging,
        'calendar-shcedule__dates--accessible': this.isCalendarSlotAccessible,
      }]
    },

    calendarProperties() {
      return {
        width:     this.timeSlotWidth,
        timeSlots: this.timeSlots,
        height:    this.timeSlotHeight,
      }
    },

    openingStartTimeInMinutes() {
      return convertTimeToMinutes(this.openingStartTime)
    },

    timeSlotUnitHeight() {
      return Number(this.timeSlotHeight) / Number(this.timeSlot)
    },

    getTimeSlotWidthByDevice() {
      if(this.isMobileDevice) {
        return options.time_slot_width_mobile
      }

      return options.time_slot_width
    },
  },

  provide() {
    return {
      numberOfResourceDisplay: this.numberResourceDisplay,
    }
  },

  watch: {
    calendarProperties: {
      deep:      true,
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.setCalendarStyleProperty()
        })
      },
    },

    selectedResourceId: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.setCalendarStyleProperty()
        })
      },
    },

    resourceRef: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.setCalendarStyleProperty()
        })
      },
    },

    isDragging: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            const calendarEl = this.$refs.calendarSchedule
            if (!calendarEl) return

            let startMouseX = 0
            let startMouseY = 0
            let lastMouseX = 0
            let lastMouseY = 0
            const BASE_SCROLL_SPEED = 5
            const MAX_SCROLL_SPEED = 30
            const EDGE_THRESHOLD = 100
            let scrollInterval = null
            let firstMove = true

            const calculateScrollSpeed = (distance, isNearEdge) => {
              // Calculate initial speed using logarithmic scaling
              let speed = Math.min(
                BASE_SCROLL_SPEED + Math.log10(Math.abs(distance) + 1) * BASE_SCROLL_SPEED,
                MAX_SCROLL_SPEED,
              )

              // If the mouse is near the edge, reduce the speed
              if (isNearEdge) {
                speed *= 0.5 // Reduce speed by half
              }
              return speed
            }

            const handleDragScroll = (e) => {
              const mouseX = e.clientX
              const mouseY = e.clientY
              const rect = calendarEl.getBoundingClientRect()

              // Calculate maximum scroll position
              const maxScrollLeft = calendarEl.scrollWidth - calendarEl.clientWidth
              const maxScrollTop = calendarEl.scrollHeight - calendarEl.clientHeight

              // Check mouse position and scroll limit
              const isNearTop = mouseY - rect.top < EDGE_THRESHOLD && calendarEl.scrollTop > 0
              const isNearBottom = rect.bottom - mouseY < EDGE_THRESHOLD && calendarEl.scrollTop < maxScrollTop
              const isNearLeft = mouseX - rect.left < EDGE_THRESHOLD && calendarEl.scrollLeft > 0
              const isNearRight = rect.right - mouseX < EDGE_THRESHOLD && calendarEl.scrollLeft < maxScrollLeft

              if (firstMove) {
                startMouseX = mouseX
                startMouseY = mouseY
                firstMove = false
              }

              const distanceX = mouseX - startMouseX
              const distanceY = mouseY - startMouseY

              const movingDown = mouseY > lastMouseY
              const movingUp = mouseY < lastMouseY
              const movingRight = mouseX > lastMouseX
              const movingLeft = mouseX < lastMouseX

              if (scrollInterval) {
                clearInterval(scrollInterval)
              }

              scrollInterval = setInterval(() => {
                // Scroll vertically with limit check
                if (movingDown && isNearBottom) {
                  const newScrollTop = calendarEl.scrollTop + calculateScrollSpeed(distanceY, isNearBottom)
                  calendarEl.scrollTop = Math.min(newScrollTop, maxScrollTop)
                } else if (movingUp && isNearTop) {
                  const newScrollTop = calendarEl.scrollTop - calculateScrollSpeed(Math.abs(distanceY), isNearTop)
                  calendarEl.scrollTop = Math.max(newScrollTop, 0)
                }

                // Scroll horizontally with limit check
                if (movingRight && isNearRight) {
                  const newScrollLeft = calendarEl.scrollLeft + calculateScrollSpeed(distanceX, isNearRight)
                  calendarEl.scrollLeft = Math.min(newScrollLeft, maxScrollLeft)
                } else if (movingLeft && isNearLeft) {
                  const newScrollLeft = calendarEl.scrollLeft - calculateScrollSpeed(Math.abs(distanceX), isNearLeft)
                  calendarEl.scrollLeft = Math.max(newScrollLeft, 0)
                }
              }, 16)

              lastMouseX = mouseX
              lastMouseY = mouseY
            }

            calendarEl.addEventListener('mousemove', handleDragScroll)

            // Cleanup
            const cleanup = () => {
              if (scrollInterval) {
                clearInterval(scrollInterval)
              }
              calendarEl.removeEventListener('mousemove', handleDragScroll)
            }

            document.addEventListener('mouseup', cleanup, { once: true })
            this.$once('hook:beforeDestroy', cleanup)
          })
        }
      },
    },
  },

  created() {
    CalendarEventBus.$on('view-booking-on-calendar', this.handleViewBookingOnCalendar)
    CalendarEventBus.$on('scroll-to-top', this.handleScrollTop)
  },

  mounted() {
    this.tableContentWidth = this.$refs.calendarSchedule.offsetWidth
    this.setCalendarDatesRef(this.$refs.dates)
    if(this.isAllTabletDevice && !this.isIpad) window.addEventListener('mousemove', this.handleBookingMouseMove)
    if(this.isAllTabletDevice && !this.isIpad) window.addEventListener('touchstart', this.handleBookingTouchStart)
    if(this.isAllTabletDevice && !this.isIpad) window.addEventListener('touchend', this.handleBookingTouchEnd)
  },

  beforeDestroy() {
    CalendarEventBus.$off('view-booking-on-calendar', this.handleViewBookingOnCalendar)
    CalendarEventBus.$off('scroll-to-top', this.handleScrollTop)
    if(this.isAllTabletDevice && !this.isIpad) window.removeEventListener('mousemove', this.handleBookingMouseMove)
    if(this.isAllTabletDevice && !this.isIpad) window.removeEventListener('touchstart', this.handleBookingTouchStart)
    if(this.isAllTabletDevice && !this.isIpad) window.removeEventListener('touchend', this.handleBookingTouchEnd)
  },

  methods: {
    formatDateByString,

    ...mapMutations('_calendar', [
      'setCalendarDatesRef',
      'setTimeSlotWidth',
      'setSelectedResourceId',
    ]),

    ...mapMutations('_calendar', [
      'setSelectedDate',
      'setIsMouseMove',
    ]),

    ...mapActions('_calendar/bookings', [
      'getBookingCalendarLiveByDateRange',
    ]),

    checkOffDay({ isOffDay, bookingResource }) {
      return isOffDay || bookingResource.isOffDay
    },

    setCalendarStyleProperty() {
      if (this.$refs.calendarSchedule) {
        this.$refs.calendarSchedule.style.setProperty('--time-slot', this.timeSlot)
        this.$refs.calendarSchedule.style.setProperty('--time-slots', this.timeSlots.length)
        this.$refs.calendarSchedule.style.setProperty('--time-slot-width', `${this.calculateTimeSlotWidth()}px`)
        this.$refs.calendarSchedule.style.setProperty('--time-slot-height', `${this.timeSlotHeight}px`)
        this.$refs.calendarSchedule.style.setProperty('--default-time-slot-height', `${this.defaultTimeSlotHeight}px`)
      }
    },

    calculateTimeSlotWidth() {
      let resourceColumnWidth = 0
      if(this.resourceRef) {
        resourceColumnWidth = this.resourceRef?.offsetWidth
      }

      let timeSlotWidth = this.getTimeSlotWidthByDevice
      const totalCalendarCols = this.schedule.reduce((acc, { bookingResources }) => acc + bookingResources.length, 0)
      const tableContentWidth = this.tableContentWidth - SIDE_BAR_WIDTH_AND_BORDER_Y
      if(this.isMobileDevice && totalCalendarCols > MAX_NUMBER_COLUMN_SHOW) {
        if(!this.getSelectedResourceMobileDevice) {
          timeSlotWidth = tableContentWidth / this.numberResourceDisplay
        } else {
          timeSlotWidth = tableContentWidth / (this.numberResourceDisplay + 0.2)
        }
      }

      if(this.isMobileDevice && totalCalendarCols <= MAX_NUMBER_COLUMN_SHOW && this.resourceRef) {
        const resourceColumnPadding = 10
        timeSlotWidth = resourceColumnWidth - resourceColumnPadding
      }

      this.setTimeSlotWidth(timeSlotWidth)

      return timeSlotWidth
    },

    handleCalendarScroll(event) {
      CalendarEventBus.$emit('calendar-scroll', event)
    },

    async handleViewBookingOnCalendar(payload) {
      const data = payload.data
      try {
        this.preLoader()
        let isMoveToDate = false
        let bookingDate = new moment()
        if (payload.type === BOOKING_LIST) {
          isMoveToDate = true
          bookingDate = convertTimestampToMomentUTC(data.bookingDateTS)
        } else if (payload.type === NAVER_LIST) {
          this.isMoveNaverBooking = true
          this.naverMoveBooking = data
          CalendarEventBus.$emit('click-move-naver-notify')
          bookingDate = moment.utc(data.bookingDateTimeTS * 1000).startOf('day')
        } else return
        this.setSelectedResourceId(0) // Mode ALL Resource
        this.handleAllViewClick()
        this.setSelectedDate(bookingDate)

        await this.getBookingCalendarLiveByDateRange({
          toDateTS:       convertDateToTimeStamp(this.toDate),
          fromDateTS:     convertDateToTimeStamp(this.fromDate),
          isMoveCalendar: this.naverMoveBooking?.isMoveToDate || isMoveToDate ? true : false,
        })

        await this.$nextTick()
        if (this.isMoveNaverBooking && (this.naverMoveBooking.status === STATUS_CANCEL || !this.naverMoveBooking?.isMoveToDate)) return
        const bookedResource = payload.isUpcomingBooking
          ? data
          : data.bookedResources.at(0)
        const startTimeInMinutes = convertTimeToMinutes(bookedResource.startTime)
        const roundedStartTimeInMinutes = Math.floor(startTimeInMinutes / this.timeSlot) * this.timeSlot
        const calendarSlotElement = this.$refs.calendarSchedule.querySelector(`[data-calendar-slot="${bookingDate.unix()}_${bookedResource.bookingResourceSetupId}_${roundedStartTimeInMinutes}"]`)
        if (!calendarSlotElement) return

        calendarSlotElement.scrollIntoView({
          block:    'center',
          inline:   'center',
          behavior: 'smooth',
        })

        const newspaperSpinning = [
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(0)', offset: 0.2 },
          { transform: 'translateY(-4px)', offset: 0.4 },
          { transform: 'translateY(0)', offset: 0.6 },
          { transform: 'translateY(-4px)', offset: 0.8 },
          { transform: 'translateY(0)', offset: 1 },
        ]

        const newspaperTiming = {
          duration:   500,
          iterations: 2,
        }

        const clearOldBookingAnimation = () => {
          this.oldBookingElement?.forEach(bookingElement => {
            bookingElement?.parentElement?.classList.remove('animation')
          })
        }

        const animateBookingElements = (bookingElements) => {
          this.oldBookingElement = bookingElements
          bookingElements.forEach(bookingElement => {
            bookingElement.animate(newspaperSpinning, newspaperTiming)
            if (bookingElement?.parentElement && this.isMoveNaverBooking) {
              bookingElement.parentElement.classList.add('animation')
              this.isMoveNaverBooking = false
            }
          })
        }

        const findBookingElements = () => {
          const bookingElements = this.$refs.calendarSchedule.querySelectorAll(`[data-booking-id="${data.bookingId}"]`)
          if (bookingElements.length > 0) {
            animateBookingElements(bookingElements)
          } else {
            const retryTimeout = setTimeout(() => {
              const retryElements = this.$refs.calendarSchedule.querySelectorAll(`[data-booking-id="${data.bookingId}"]`)
              if (retryElements.length > 0) animateBookingElements(retryElements)
              clearTimeout(retryTimeout) // Clear timeout after retry
            }, RETRY_ANIMATION_TIME)
          }
        }

        // Start the process
        setTimeout(() => {
          clearOldBookingAnimation() // Clear animations on old elements
          findBookingElements() // Attempt to find and animate new elements
        }, newspaperTiming.duration)

        const removeAnimationTimer = setTimeout(() => {
          if (this.oldBookingElement?.length) {
            this.oldBookingElement.forEach(bookingElement => {
              if (bookingElement && bookingElement.parentElement) {
                bookingElement.parentElement.classList.remove('animation')
              }
            })
          }
          clearTimeout(removeAnimationTimer)
        }, REMOVE_ANIMATION_TIME)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    currentTotalBookingDisplay() {
      let totalCalendarBookingCurrentDate = []
      for(let i = 0; i < this.schedule.length; i++) {
        const bookingResource = this.schedule[i].bookingResources
        const dateTS = moment(this.schedule[i].date).unix()

        bookingResource.forEach((item) => {
          const bookingData = store.getters[`_calendar/bookings/${dateTS}_${item.id}/availableBookings`]

          if(bookingData.length) {
            totalCalendarBookingCurrentDate = [...totalCalendarBookingCurrentDate, ...bookingData]
          }
        })
      }

      return totalCalendarBookingCurrentDate
    },

    lastedResource(resource) {
      return resource[resource.length - 1]
    },

    handleScrollTop() {
      if (this.$refs.calendarSchedule?.scrollTo) {
        this.$refs.calendarSchedule.scrollTo(0, 0)
      }
    },

    handleBookingMouseMove() {
      if (this.isTouchEvent) {
        // Ignore mousemove events generated by touch
        return
      }
      this.setIsMouseMove(true)
    },

    handleBookingTouchStart() {
      this.isTouchEvent = true // Set the flag on touch
      this.setIsMouseMove(false)
    },

    handleBookingTouchEnd() {
      setTimeout(() => {
        this.isTouchEvent = false // Reset the flag after touch ends
      }, 100) // Small delay to ensure mousemove isn't immediately reactivated
    },

    async handleAllViewClick() {
      await this.calendarViewMixin_changeDayView({
        numberOfDay: this.numberOfDaysViewAllLocalStorage || this.defaultNumberOfDaysViewAll,
        resourceId:  0,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-schedule.scss";
</style>
