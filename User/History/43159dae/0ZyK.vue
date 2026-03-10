<template>
  <div>
    <component
      v-bind="$attrs"
      :is="bookingActionsComponent"
      ref="actions"

      v-on="$listeners"
      @move-booking="handleMoveBookingClick"
      @update-booking-status="handleUpdateBookingStatus"
    />
  </div>
</template>

<script>
// Utilities
import i18n from 'Translate'
import {mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { convertDateToMomentUTC, convertTimeToMinutes, formatTimeSlotAtMobile, formatTimeSlot, convertTimestampToMomentUTC } from 'Modules/calendar/utils/index'
import { BookingApiError } from 'Validators/booking/bookingValidator'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

const PerformanceResourceConfirm = () => import('Modules/calendar/components/common-form/performance-resource-confirm/performance-resource-confirm.vue')

// Mixins
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import { generateBookingRules } from 'Modules/calendar/mixins/booking'
import CancellationFeeMixin from 'Modules/calendar/mixins/cancellation-fee'

// Models
import Booking from 'Models/booking/booking'

// Constants
import { options } from 'OptionsHelpers'
import { BOOKING_SOURCE, BOOKING_EXTERNAL_SYSTEM_PAYMENT } from 'Constant'

const NoShowActions = () => import('./components/no-show-actions/no-show-actions.vue')
const ArrivedActions = () => import('./components/arrived-actions/arrived-actions.vue')
const CompletedActions = () => import('./components/completed-actions/completed-actions.vue')
const CheckedOutActions = () => import('./components/checked-out-actions/checked-out-actions.vue')
const PaymentInProgressActions = () => import('./components/payment-in-progress-actions/payment-in-progress-actions.vue')
const ExternalCheckedOutActions = () => import('./components/external-checked-out-actions/external-checked-out-actions.vue')
const ExternalAutoCheckedOutActions = () => import('./components/external-auto-checked-out-actions/external-auto-checked-out-actions.vue')

export default {
  extends: ComponentBase,

  mixins: [
    BookingCacheMixin,
    generateBookingRules('booking'),
    CancellationFeeMixin,
  ],

  data() {
    return {
      isMoreMenuShown:  false,
      allCalendarSetup: null,
    }
  },

  computed: {
    ...mapState('_calendar/bookingDescription', [
      'booking',
    ]),

    ...mapGetters('_calendar', [
      'resourcesBreakingTimesBySchedule',
    ]),

    ...mapState('_calendar', [
      'startTime',
      'finishTime',
      'crossDate',
      'bookedResourceNaverLink',
    ]),

    ...mapGetters('_calendar/timeIndicator', [
      'nowInMinutes',
    ]),

    bookingActionsComponent() {
      const actionsMap = {
        isCompletedBooking:              CompletedActions,
        isArrivedBooking:                ArrivedActions,
        isNoShowBooking:                 NoShowActions,
        isExternalCheckedOutBooking:     ExternalCheckedOutActions,
        isExternalAutoCheckedOutBooking: ExternalAutoCheckedOutActions,
        isBookingPaymentInProgress:      PaymentInProgressActions,
        isBookingCheckedOut:             CheckedOutActions,
      }

      for (const [key, action] of Object.entries(actionsMap)) {
        if (this[key]) {
          return action
        }
      }

      return null
    },

  },

  finishedMovingBookingCallback: null,

  methods: {
    ...mapActions('_calendar', [
      'triggerCalendarSlotAccessible',
    ]),

    ...mapActions('_calendar/bookings', [
      'moveBookingToSlot',
      'updateBookingStatus',
    ]),

    ...mapMutations('_calendar/bookings', [
      'setSyncBookingWhenDeleteSales',
    ]),

    ...mapMutations('_calendar', [
      'setMoveBookingMode',
    ]),

    naverBookingTimeSlotOptions(calendarSetup) {
      const startTimeInMinutes = convertTimeToMinutes(this.startTime)
      const finishTimeInMinutes = convertTimeToMinutes(this.finishTime) + Number(this.crossDate) * options.minutes_of_24h
      const naverBookingTimeSlots = calendarSetup?.booking_naver_link_setup?.bookingTimeSlot || 60

      // Cache translation
      const nextDayText = i18n.t('general.next-day-text')

      //Cache format function based on device
      const formatFn = this.isMobileDevice ? formatTimeSlotAtMobile : formatTimeSlot
      const timeSlots = []
      const slots = (finishTimeInMinutes - startTimeInMinutes) / naverBookingTimeSlots

      for(let index = 0; index < slots; index++) {
        const minutes = startTimeInMinutes + (naverBookingTimeSlots * index)

        timeSlots.push({
          text: formatFn({prefix: nextDayText, minutes}),
          minutes,
        })
      }

      return timeSlots
    },

    async handleUpdateBookingStatus(status) {
      try {
        this.preLoader()

        const updateStatus = (() => {
          if (status === options.booking.booking_status.no_show && this.booking.status === options.booking.booking_status.no_show) {
            return options.booking.booking_status.completed
          }

          if (status === options.booking.booking_status.arrived && this.booking.status === options.booking.booking_status.arrived) {
            return options.booking.booking_status.completed
          }

          return status
        })()

        await this.updateBookingStatus({
          status:    updateStatus,
          bookingId: this.booking.bookingId,
        })

        this.$emit('hide-description')
      } catch (error) {
        await this.$mixin_handleConfirmHasCancellationFee({
          shopId:                                this.booking.shopId,
          bookingId:                             this.booking.bookingId,
          useDeleteCancellationFeeSalesEndpoint: true,
        }, () => {
          console.log('callback', this.booking)
          this.setSyncBookingWhenDeleteSales(true)
          this.$emit('hide-description')
        })
      } finally {
        this.preLoader(false)
      }
    },

    resourceWorkingHour(resource, date) {
      const dates = date.day()
      const resourcesBreakingTimesBySchedule = this.resourcesBreakingTimesBySchedule

      if (!resourcesBreakingTimesBySchedule[resource.id]) {
        return {
          startTime:     null,
          finishTime:    null,
          breakingTimes: [],
        }
      }

      const dateTS = convertDateToMomentUTC(date).startOf('day').unix()
      const resourceWorkingHours = resourcesBreakingTimesBySchedule[resource.id]
      const resourceWorkingHourOfDay = resourceWorkingHours.find(resourceWorkingHour => {
        return resourceWorkingHour.dayOfWeek === dates && resourceWorkingHour.timestamp === dateTS
      })

      return resourceWorkingHourOfDay?.workingHours
    },

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

    validateBooking(date, startTime, booking, calendarSetup) {
      const errors = []
      const currentDateUTC = convertDateToMomentUTC(new Date()).startOf('day')

      const isGeneralNaverBooking = booking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL
      const isPastBookingDates = date.isBefore(currentDateUTC)
      const isTodayBookingDate = date.isSame(currentDateUTC)
      const isStartTimeInPast = startTime <= this.nowInMinutes

      const isPreventMovingNaverBooking = isGeneralNaverBooking && ((isPastBookingDates) || (isTodayBookingDate && isStartTimeInPast))
      if(isPreventMovingNaverBooking) {
        errors.push(i18n.t('bookings.you-can-not-change-the-booking-time-on-naver-booking-to-earlier-than-now'))
        return errors
      }

      const naverBookingTimeSlot = this.naverBookingTimeSlotOptions(calendarSetup)
      const convertTimeSlotsMinuteToHours = naverBookingTimeSlot.map(timeSlot => timeSlot.minutes / 60)
      const isExistNaverTimeSlot = convertTimeSlotsMinuteToHours.includes(startTime / 60)
      if(!isExistNaverTimeSlot) {
        errors.push(i18n.t('bookings.the-start-time-for-naver-booking-only-available-in-minite', {
          minute: calendarSetup.booking_naver_link_setup.bookingTimeSlot,
        }))

        return errors
      }

      return errors
    },

    async moveBooking({ date, startTime, resource, booking, isConfirmMoving = false }) {
      try {
        if(booking.bookingSource === BOOKING_SOURCE.NAVER) {
          this.allCalendarSetup = await this.$bookingCacheMixin_getAllCalendarSetup({
            shopId: this.shop_data.shop_id,
          })
        }
        if(booking.bookingSource === BOOKING_SOURCE.NAVER) {
          const error = this.validateBooking(date, startTime, booking, this.allCalendarSetup)
          if(error.length) {
            this._showDialogAlert(error)
            return
          }

          const bookingStartTime = convertTimeToMinutes(booking.bookedResources[0].startTime)
          const bookingDateMomentUTC = convertTimestampToMomentUTC(booking.bookingDateTS)
          if(bookingStartTime === startTime && resource.id === booking.bookedResources[0].bookingResourceSetupId && bookingDateMomentUTC.isSame(date)) {
            return
          }
        }

        const resourceWorkingHours = this.resourceWorkingHour(resource, date)
        const isCrossBreakTimeHours = this.checkCrossWorkingHours(resourceWorkingHours, {newStartTime: startTime, bookingDuration: booking.bookedResources[0].estimatedTime})
        const bookingNaverType = booking.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL
        if(bookingNaverType && !isCrossBreakTimeHours && !isConfirmMoving) {
          const message = [
            i18n.t('bookings.booking-naver-general-moving-confirm-message'),
          ]
          const isBookingNaverGeneralConfirmed = await this._showDialogConfirm(message, {
            cancelBtnText:  i18n.t('general.cancel'),
            confirmBtnText: i18n.t('general.confirm'),
          })
          if(!isBookingNaverGeneralConfirmed) return
        }

        const changeTime = convertDateToMomentUTC(date).startOf('day').add(startTime, 'minutes')

        const isNonNaverWithoutConfirmation = booking.bookingSource !== BOOKING_SOURCE.NAVER && !isConfirmMoving
        const isNaverValidBooking = booking.bookingSource === BOOKING_SOURCE.NAVER && !isCrossBreakTimeHours && !isConfirmMoving
        if(isNonNaverWithoutConfirmation || isNaverValidBooking) {
          const isConfirmed = await this._showDialogConfirm(
            i18n.t('validate-message.specification.warning-confirm-moving-booking', {
              clientName: booking.clientName,
              dateTime:   changeTime.format('YYYY-MM-DD HH:mm A'),
            }), {
              cancelBtnText:  i18n.t('general.no'),
              confirmBtnText: i18n.t('general.yes'),
            },
          )

          if (!isConfirmed) return
        }

        this.preLoader()

        await this.moveBookingToSlot({
          booking,
          moveToSlot:    { date, startTime, resource },
          calendarSetup: this.allCalendarSetup,
        })

        this.callFinishedMovingBookingCallback()
      } catch (error) {
        if (error?.isApiError()) {
          this.handleMoveBookingError(new BookingApiError(error), { date, startTime, resource, booking })
          return
        }

        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**
     * @param {BookingApiError} error
     *
     * @param {Object} movingData
     * @param {Booking} movingData.booking
     */
    async handleMoveBookingError(error = new BookingApiError(), movingData) {
      let isConfirm = false
      if (error.hasUnacceptableErrors) {
        this._showDialogAlert(error.unacceptableErrorMessages)
        return
      }

      const booking = movingData.booking

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

        isConfirm = true
        booking.isBookingExceedsWorkHours = true
      }

      const bookingNaverType = movingData?.booking?.extSystemBookingType === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL

      if(bookingNaverType && isConfirm) {
        const message = [
          i18n.t('bookings.booking-naver-general-moving-confirm-message'),
        ]
        const isBookingNaverGeneralConfirmed = await this._showDialogConfirm(message, {
          cancelBtnText:  i18n.t('general.cancel'),
          confirmBtnText: i18n.t('general.confirm'),
        })
        if(!isBookingNaverGeneralConfirmed) {
          booking.isBookingExceedsWorkHours = false
          return
        }
      }

      if(booking.bookingSource === BOOKING_SOURCE.NAVER && isConfirm) {
        const changeTime = convertDateToMomentUTC(movingData.date).startOf('day').add(movingData.startTime, 'minutes')
        const isConfirmed = await this._showDialogConfirm(
          i18n.t('validate-message.specification.warning-confirm-moving-booking', {
            clientName: booking.clientName,
            dateTime:   changeTime.format('YYYY-MM-DD HH:mm A'),
          }),{
            cancelBtnText:  i18n.t('general.no'),
            confirmBtnText: i18n.t('general.yes'),
          },
        )

        if (!isConfirmed) {
          booking.isBookingExceedsWorkHours = false
          return
        }
      }

      if (error.hasResourceNotPerformanceServiceErrors) {
        const isMustCheckPerformanceResourceConfirmed = await this._showDialogConfirm(error.resourceNotPerformanceServiceErrorsMessages, {
          title:          i18n.t('general.alert'),
          component:      PerformanceResourceConfirm,
          cancelBtnText:  i18n.t('general.no'),
          confirmBtnText: i18n.t('general.yes'),
        })
        if (!isMustCheckPerformanceResourceConfirmed) {
          booking.isBookingExceedsWorkHours = false
          return
        }

        booking.mustCheckPerformanceResource = false
      }

      this.moveBooking({
        ...movingData,
        booking,
        isConfirmMoving: true,
      })
    },

    async handleMoveBookingClick(event) {
      event.preventDefault()

      this.setMoveBookingMode(true)

      const booking = Booking.revert(this.booking)

      this.triggerCalendarSlotAccessible({
        callback: async ({ date, startTime, resource }, finish) => {
          this.$options.finishedMovingBookingCallback = finish

          await this.moveBooking({ date, startTime, resource, booking })
        },
        options: {
          type: 'move-booking',
          text: this.$t('bookings.click-calendar-select-date-time'),
        },
      })

      this.$emit('hide-description')
    },

    callFinishedMovingBookingCallback() {
      if(typeof this.$options.finishedMovingBookingCallback === 'function') {
        this.$options.finishedMovingBookingCallback()
      }

      this.$options.finishedMovingBookingCallback = null
    },
  },
}
</script>

<style lang="scss" scoped>
@import './booking-actions.scss';
</style>
