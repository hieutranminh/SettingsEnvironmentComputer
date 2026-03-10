<template>
  <div class="booking-description-action">
    <a-drawer
      :visible="visible"
      @close="hideBookingDescription"
    >
      <template>
        <div
          ref="content"
          class="booking-description__content"
        >
          <client-information
            @send-message="handleSendMessage"
            @hide-client-information="handleHideDescription"
          />

          <div class="booking-description__body">
            <booking-info-mobile
              :booking="booking"
              class="booking-description__information"
              @booking-deposit-click="handleBookingDepositClick"
            />

            <booking-naver-info
              v-if="isNaverBooking"
              :booking="booking"
              class="booking-description__naver-info"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="booking-description__footer">
          xxxx
          <booking-actions
            v-if="visible"
            :is-naver-booking="isNaverBooking"
            :booking-cancellation-fee="booking.cancellationFee"
            class="booking-description__actions"
            @checkout-click="handleCheckoutClick"
            @hide-description="handleHideDescription"
            @cancel-booking="handleCancelBookingClick"
            @add-booking-click="handleAddBookingClick"
            @view-sales-detail="handleViewSalesDetail"
            @no-show-booking="handleNoShowBookingClick"
            @edit-booking-click="handleEditBookingClick"
            @delete-booking-click="handleDeleteBookingClick"
            @add-booking-deposit="handleAddBookingDeposit"
          />
        </div>
      </template>
    </a-drawer>

    <send-message-modal
      :modal-id="sendMessageModalId"
      v-bind="sendMessageOptions"

      @on-add-booking="addTextMessageSuccess"
    />
  </div>
</template>
<script>
// Utilities
import cloneDeep from 'lodash/cloneDeep'
import { mapActions, mapState, mapMutations } from 'vuex'
import { CalendarEventBus, convertTimestampToMomentUTC, convertDateToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import { BIconX } from 'bootstrap-vue'
import ADrawer from 'Modules/aha/a-drawer/a-drawer.vue'
import DeviceView from 'Modules/device/components/device-view'
import BookingActions from './components/booking-actions/booking-actions.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SendMessageModal from 'Components/messages/send-message-modal/send-message-modal.vue'
import ClientInformation from 'Modules/calendar/components/calendar/calendar-booking/components/booking-description/components/client-infomation/client-infomation.vue'
// Booking Description Component
import BookingIsVip from 'Modules/calendar/components/calendar/calendar-booking/components/booking-is-vip/booking-is-vip.vue'
import BookingColor from 'Modules/calendar/components/calendar/calendar-booking/components/booking-description/components/booking-color/booking-color.vue'
import BookingNaverInfo from 'Modules/calendar/components/calendar/calendar-booking/components/booking-description/components/booking-naver-info/booking-naver-info.vue'
import BookingInfoMobile from 'Modules/calendar/components/calendar/calendar-booking/components/booking-description/components/booking-info-mobile/booking-info-mobile.vue'

//Api
import { deleteBookingCanceled } from 'Modules/api/booking/booking-api'

// Mixins
import { generateBookingRules } from 'Modules/calendar/mixins/booking'

// Models
import Booking from 'Models/booking/booking'

// Constants
import { options } from 'OptionsHelpers'
import { BOOKING_COLORS } from 'Modules/calendar/constant'

export default {
  components: {
    BIconX,
    ADrawer,
    DeviceView,
    BookingColor,
    BookingIsVip,
    BookingActions,
    SendMessageModal,
    BookingNaverInfo,
    BookingInfoMobile,
    ClientInformation,
  },

  extends: ComponentBase,

  mixins: [
    generateBookingRules('booking'),
  ],

  data() {
    return {
      options,
      sendMessageOptions: {},
    }
  },

  computed: {
    ...mapState('_calendar', [
      'timeSlot',
    ]),

    ...mapState('_calendar/bookings', [
      'bookingSet',
    ]),

    ...mapState('_calendar/bookingDescription', [
      'booking',
      'visible',
      'clickedAtMinutes',
    ]),

    descriptionClass() {
      return [
        'booking-description',
        ...(BOOKING_COLORS?.[this.booking.status] && [`booking-description--${BOOKING_COLORS[this.booking.status]}`]), {
          'booking-description--visible': this.visible,
        },
      ]
    },

    descriptionHeaderClass() {
      return ['booking-description__header', {
        'booking-description__header--is-vip': this.booking.isVip,
      }]
    },

    bookingTitle() {
      const bookingStatusOption = options.booking.option_booking_status.find(option => {
        return option.value === this.booking.status
      })

      return this.$t(bookingStatusOption.text)
    },

    sendMessageModalId() {
      return `${this.uid}_send-message-modal-from-booking-description`
    },
  },

  mounted() {
    this.calculateContentHeight()
  },

  methods: {
    ...mapActions('_calendar/bookingAction', [
      'openBookingActionBySlot',
      'openBookingActionForUpdating',
    ]),

    ...mapActions('_calendar/checkoutAction', [
      'checkoutBooking',
    ]),

    ...mapActions('_calendar/bookingDescription', [
      'closeBookingDescription',
    ]),

    ...mapMutations('_calendar/bookingAction', [
      'setActiveWizardStep',
    ]),

    ...mapMutations('_calendar/bookings', [
      'setNaverProxyBooking',
      'setShowSelectSalesAssignment',
    ]),

    calculateContentHeight() {
      const contentHeight = this.$refs?.content?.clientHeight ?? 0

      this.$refs?.description?.style.setProperty('--content-height', `${contentHeight}px`)
    },

    hideBookingDescription() {
      this.closeBookingDescription()
    },

    handleBackdropClick() {
      this.hideBookingDescription()
    },

    async handleCheckoutClick(event) {
      event.preventDefault()

      try {
        this.preLoader()

        const booking = Booking.build(
          this.bookingSet[this.booking.bookingId],
        )

        this.hideBookingDescription()

        if (
          booking?.isNaverBooking
          && booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo
        ) {
          if (booking.draftDocumentId) {
            CalendarEventBus.$emit('sales-draft-click', booking)
          } else {
            this.setNaverProxyBooking(booking)
            this.setShowSelectSalesAssignment(true)
          }
        } else {
          if (booking.draftDocumentId) {
            CalendarEventBus.$emit('sales-draft-click', booking)
          } else {
            await this.checkoutBooking({
              booking,
              isAddBookingToSalesImmediate: true,
            })
          }
        }

      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleViewSalesDetail() {
      CalendarEventBus.$emit('view-sales-detail', this.booking)
      this.hideBookingDescription()
    },

    async handleEditBookingClick() {
      this.setActiveWizardStep('resources')

      try {
        this.preLoader()

        const booking = Booking.build(
          this.bookingSet[this.booking.bookingId],
        )

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
        this.hideBookingDescription()
      }
    },

    async handleAddBookingDeposit() {
      CalendarEventBus.$emit('booking-deposit-click', this.booking)
      this.hideBookingDescription()
    },

    handleHideDescription() {
      this.hideBookingDescription()
    },

    async handleAddBookingClick(event) {
      try {
        this.preLoader()

        event.preventDefault()

        const clickedBooking = cloneDeep(this.booking)
        const [clickedBookedResource] = clickedBooking.bookedResources

        const resource = {
          id:            clickedBookedResource.bookingResourceSetupId,
          resource_name: clickedBookedResource.resourceName,
        }

        const startTime = clickedBookedResource.startTimeInMinutes + this.clickedAtMinutes

        await this.openBookingActionBySlot({
          resource,
          startTime,
          date: convertTimestampToMomentUTC(clickedBooking.bookingDateTS),
        })

        this.hideBookingDescription()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleDeleteBookingClick() {
      try {
        const isConfirm = await this._showDialogConfirm(this.$t('bookings.confirm-delete-message'), {
          confirmBtnColor: 'red',
          confirmBtnText:  this.$t('general.delete'),
        })

        if(isConfirm) {
          this.preLoader()

          const payload = {
            shopId:           this.shop_data.shop_id,
            bookingId:        this.booking.bookingId,
            deleteDataTimeTS: convertDateToMomentUTC().unix(),
          }

          await deleteBookingCanceled(payload)

          this.hideBookingDescription()

          CalendarEventBus.$emit('load-booking-calendar', this.booking)
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleCancelBookingClick() {
      CalendarEventBus.$emit('cancel-booking', this.booking)
      this.hideBookingDescription()
    },

    handleNoShowBookingClick() {
      CalendarEventBus.$emit('no-show-booking', { booking: this.booking, isNaverBooking: this.isNaverBooking})
      this.hideBookingDescription()
    },

    handleBookingDepositClick() {
      CalendarEventBus.$emit('booking-deposit-click', this.booking.bookingDeposit)
      this.hideBookingDescription()
    },

    handleViewClientInformationClick() {
      CalendarEventBus.$emit('view-client-information', this.booking)
      this.hideBookingDescription()
    },

    handleSendMessage(options) {
      this.sendMessageOptions = {...options}
      this.showDialogById(this.sendMessageModalId)
    },

    addTextMessageSuccess() {
      this.sendMessageOptions = {}
      this.hideDialogById(this.sendMessageModalId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './booking-description-action.scss';
</style>
