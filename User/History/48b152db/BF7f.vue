<!-- eslint-disable vue/no-template-key -->
<template>
  <div :class="bookingsClass">
    <div class="bookings__intro">
      <p class="bookings__intro-total">
        {{ $t('booking-list.total', [totalItems]) }}
      </p>

      <a-checkbox
        v-model="isAllPageChecked"
        class="bookings__intro-checkbox"
      >
        {{ $t('bookings.check-all-page') }}
      </a-checkbox>
    </div>

    <div class="bookings__wrapper">
      <table
        ref="tableWrapperRef"
        :class="bookingsTableClass"
      >
        <thead>
          <tr>
            <th
              v-if="hasBookings"
              class="th-checkbox-item"
            >
              <a-checkbox v-model="isAllItemChecked" />
            </th>
            <th class="th-src">
              {{ $t('booking-list.src') }}
            </th>
            <th class="th-registered-date">
              {{ $t('booking-list.registered-date') }}
            </th>
            <th class="th-booking-date">
              {{ $t('booking-list.booking-date') }}
            </th>
            <th class="th-booking-time">
              <p>{{ $t('booking-list.booking-time') }}</p>
              <p>({{ $t('bookings.estimated-time') }})</p>
            </th>
            <th class="th-client-name">
              {{ $t('booking-list.client-name') }}
            </th>
            <th class="th-mobile-number">
              {{ $t('booking-list.mobile-number') }}
            </th>
            <th class="th-resource-name">
              {{ $t('booking-list.resource') }}
            </th>
            <th class="th-booking-items">
              {{ $t('booking-list.booking-items') }}
            </th>
            <th class="th-booking-status">
              {{ $t('booking-list.status') }}
            </th>
            <th class="th-booking-deposit">
              {{ $t('booking-list.booking-deposit') }}
            </th>
            <th>{{ $t('booking-list.notes') }}</th>
            <th class="th-edit">
              {{ $t('general.edit') }}
            </th>
            <th class="th-calendar-move">
              {{ $t('booking-list.calendar') }}
            </th>
          </tr>
        </thead>

        <template v-if="!hasBookings">
          <tbody>
            <tr>
              <td colspan="13">
                {{ $t('general.table-empty') }}
              </td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody
            v-for="booking in bookings"
            :key="`booking_${booking.bookingId}`"
          >
            <tr
              v-for="(bookedResource, index) in booking.bookedResources"
              :key="`booked_resource__${bookedResource.bookedResourceId}`"
            >
              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-checkbox-item"
              >
                <a-checkbox
                  :value="checkBoookingChecked(booking)"
                  @input="isChecked => handleCheckedBookingChange(booking, isChecked)"
                />
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-src"
              >
                <a-booking-source
                  :booking="booking"
                  class="bookings__booking-source"
                />
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-registered-date"
              >
                <span>{{ booking.createdDateTimeTS | formatDateHourMin }}</span>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-booking-date"
              >
                {{ formatBookingDate(booking.bookingDateTS) }}
              </td>

              <td class="td-booking-time">
                <p>{{ formatBookedResourceStartTime(bookedResource) }}</p>
                <p v-if="isRepeatBooking(booking)">
                  ({{ $t('booking-list.repeat') }})
                </p>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-client-name"
              >
                <div
                  :class="formatClientClass(booking)"
                  style="cursor:pointer"
                  @click="$emit('on-client-name-clicked', booking)"
                >
                  {{ booking.clientName }}
                </div>
                <div
                  v-if="isShowVisitorInfoName(booking)"
                  class="visitor-info"
                >
                  <span>[{{ $t('naver-booking-description.visitor') }}]</span>
                  <span>
                    {{ visitorName(booking) }}
                  </span>
                </div>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-mobile-number"
              >
                <client-mobile-number
                  :id="booking.clientId"
                  :mobile-number="booking.clientMobileNumber"
                  :registration-date="booking.clientRegistrationDateTS"
                />
                <p
                  v-if="isShowVisitorInfoMobile"
                  class="bookings__visitor-mobile"
                >
                  {{ visitorPhone(booking) }}
                </p>
              </td>

              <td class="td-resource-name">
                {{ bookedResource.resourceName }}
              </td>

              <td class="td-booking-items">
                <ul class="bookings__booked-items">
                  <li
                    v-for="bookedItem in bookedResource.bookedItems"
                    :key="`booked_item_${bookedItem.bookedItemId}`"
                  >
                    {{ bookedItem.bookedRefName }}
                  </li>
                </ul>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-booking-status"
              >
                <a-booking-status-text :booking="booking" />
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-booking-deposit"
              >
                <template v-if="!checkHasBookingDeposit(booking)">
                  <a-button
                    v-if="!isBookingNaverDeposit(booking)"
                    ghost
                    class="mx-auto"
                    variant="primary"
                    @click="$emit('add-booking-deposit', booking)"
                  >
                    {{ $t('booking-list.add') }}
                  </a-button>
                </template>
                <template v-else-if="!checkHasBookingDepositPayment(booking)">
                  <a-due-date-text
                    v-b-tooltip.hover
                    :class="'bookings__original-amount'"
                    :disabled="isBookingDepositDisabled(booking)"
                    :due-date-ts="booking.bookingDeposit.dueDateTS"
                    :title="formatBookingDepositNotPaidTooltip(booking)"
                    @click="handleAddBookingDepositPaymentClick(booking)"
                  >
                    {{ formatBookingDepositAmount(booking.bookingDeposit) }}
                  </a-due-date-text>
                </template>
                <div
                  v-else
                  :ref="`depositPayment-${booking.bookingId}-${index}`"
                  :class="depositPaymentClass(booking)"
                  @click="handleEditBookingDepositPaymentClick(booking)"
                >
                  <span
                    class="bookings__paid-amount"
                  >
                    {{ formatBookingDepositPaymentAmount(booking.bookingDeposit) }}
                  </span>

                  <span
                    v-if="checkHasBookingDepositRefund(booking)"
                    class="bookings__refund-amount"
                  >
                    (-{{ formatBookingDepositPaymentRefundAmount(booking.bookingDeposit) }})
                  </span>
                </div>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="bookings__booking-note"
                @click="() => handleNoteEdit(booking)"
              >
                <div class="notes-detail color-gray">
                  <aha-note-with-tooltip
                    v-if="booking.notes"
                    :value="booking.notes"
                    :tooltip-id="`booking-list-note-tooltip-${booking.bookingId}`"
                    custom-class="booking-list-note-tooltip"
                    class="bookings__booking-note"
                  />
                </div>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-edit"
              >
                <div class="bookings__actions">
                  <template v-if="isBookingActionsShown(booking) || isNaverBooking(booking)">
                    <b-nav-item-dropdown
                      v-if="hasEditButton(booking)"
                      :boundary="$refs.tableWrapperRef"
                      no-caret
                      dropleft
                      class="booking-item-menu"
                    >
                      <template slot="button-content">
                        <aha-button class="btn-edit">
                          {{ $t('booking-list.edit') }}
                        </aha-button>
                      </template>

                      <b-dropdown-item
                        @click="$emit('edit-booking', booking)"
                      >
                        {{ $t('booking-list.edit-booking') }}
                      </b-dropdown-item>

                      <b-dropdown-item
                        v-if="isCancelShown(booking)"
                        @click="$emit('cancel-booking', booking)"
                      >
                        {{ $t('booking-list.cancel-booking') }}
                      </b-dropdown-item>
                    </b-nav-item-dropdown>
                  </template>
                  <template v-else-if="hasDeleteButton(booking)">
                    <a-button
                      ghost
                      variant="primary"
                      class="booking__actions-button"
                      @click="$emit('delete-booking', booking)"
                    >
                      {{ $t('general.delete') }}
                    </a-button>
                  </template>
                </div>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="td-calendar-move"
              >
                <a-button
                  v-if="isViewOnCalendarShown(booking)"

                  ghost
                  variant="primary"
                  class="booking__actions-button booking__actions-button--calendar"
                  @click="$emit('view-on-calendar', booking)"
                >
                  ➝
                </a-button>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>

    <a-note
      :value="selectedBookingNotes"
      :visible="isBookingNotesVisible"
      :notify-max-notes-length="notifyMaxNotesLengthComputed"
      @input="handleBookingNoteInput"
      @hidden="handleBookingNoteHidden"
    />
  </div>
</template>

<script>
// Utilities
import cloneDeep from 'lodash/cloneDeep'
import { formatMoney, formatMobileAndPhoneNumber, formatDateHourMin } from 'CommonHelpers'
import { formatTimeInMinutes, convertTimestampToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import ANote from 'Modules/aha/a-note/a-note.vue'
import { BIconCalendarWeekFill } from 'bootstrap-vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import ACheckbox from 'Modules/aha/a-checkbox/a-checkbox.vue'
import ADueDateText from 'Modules/aha/a-due-date-text/a-due-date-text.vue'
import ABookingSource from 'Modules/aha/a-booking-source/a-booking-source.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ABookingStatusText from 'Modules/aha/a-booking-status-text/a-booking-status-text.vue'
import AhaNoteWithTooltip from 'CommonComponents/aha-note-with-tooltip/aha-note-with-tooltip.vue'
import ClientMobileNumber from 'Modules/clients/components/client-mobile-phone/client-mobile-phone.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import BookingMixin from 'Modules/calendar/mixins/booking'
import PrintPreviewMixin from 'Mixins/print-preview-mixin.js'
import CancellationFeeMixin from 'Modules/calendar/mixins/cancellation-fee'

// Models
import BookedResource from 'Models/booking/bookedResource'

// Options
import {
  USER_ROLES,
  BOOKING_STATUS,
  BOOKING_SOURCE,
  BOOKING_EXTERNAL_SYSTEM_PAYMENT,
} from 'Constant'
import { options } from 'OptionsHelpers'
import { BOOKING_DATA_RULES } from 'SystemDataRules'

const checkedOutStatuses = [
  BOOKING_STATUS.CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_AUTO_CHECKED_OUT,
]

const bookingNaverDepositType = [
  BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PREPAYMENT,
  BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON_DEPOSIT,
]

export default {
  components: {
    ANote,
    AButton,
    ACheckbox,
    ADueDateText,
    ABookingSource,
    ClientMobileNumber,
    AhaNoteWithTooltip,
    ABookingStatusText,
    BIconCalendarWeekFill,
  },

  filters: {
    formatDateHourMin(value) {
      return formatDateHourMin(value)
    },
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    BookingMixin,
    CancellationFeeMixin,
    PrintPreviewMixin('tableWrapperRef'),
  ],

  props: {
    bookings: {
      type:    Array,
      default: () => [],
    },

    pagingInfo: {
      type:    Object,
      default: () => ({}),
    },

    bookingIds: {
      type:    Array,
      default: () => [],
    },

    bookingIdsSearchType: {
      type:    Number,
      default: options.booking.bookingIdSelectType.exclude,
    },
  },

  data() {
    return {
      selectedBooking:       null,
      isBookingNotesVisible: null,
    }
  },

  computed: {
    hasBookings() {
      return this.bookings.length > 0
    },

    totalItems() {
      return this.pagingInfo?.totalItems ?? 0
    },

    bookingsClass() {
      return ['bookings', {
        'bookings--mobile': this.isMobileDevice,
      }]
    },

    selectedBookingNotes() {
      return this.selectedBooking?.notes ?? ''
    },

    isAllPageChecked: {
      get() {
        if (this.bookingIdsSearchType === options.booking.bookingIdSelectType.exclude && this.bookingIds.length === 0) {
          return true
        }

        return false
      },

      set(isAllPageChecked) {
        if (isAllPageChecked) {
          this.$emit('booking-ids-select-type-change', options.booking.bookingIdSelectType.exclude)
        } else {
          this.$emit('booking-ids-select-type-change', options.booking.bookingIdSelectType.include)
        }
      },
    },

    isAllItemChecked: {
      get() {
        if (this.bookingIdsSearchType === options.booking.bookingIdSelectType.exclude) {
          if (this.bookingIds.length == 0) {
            return true
          }

          return !this.bookings.some(booking => this.bookingIds.includes(booking.bookingId))
        }

        return !this.bookings.some(booking => !this.bookingIds.includes(booking.bookingId))
      },

      set(isAllItemChecked) {
        if (isAllItemChecked) {
          this.$emit('bookings-checked', this.bookings)
        } else {
          this.$emit('bookings-unchecked', this.bookings)
        }
      },
    },

    isKorean () {
      return this.app_language === options.language.korean
    },

    bookingsTableClass () {
      return ['bookings__table', {
        'bookings__table--korean': this.isKorean,
      }]
    },

    notifyMaxNotesLengthComputed() {
      return BOOKING_DATA_RULES.MAX_BIG_NOTES_LENGTH
    },
  },

  methods: {
    isCancelShown(booking) {
      return ![
        options.booking.booking_status.no_show,
        options.booking.booking_status.arrived,
        options.booking.booking_status.checked_out,
        options.booking.booking_status.external_checked_out,
        options.booking.booking_status.external_auto_checked_out,
      ].includes(booking.status)
    },

    isBookingActionsShown(booking) {
      return ![
        options.booking.booking_status.no_show,
        options.booking.booking_status.canceled,
        options.booking.booking_status.checked_out,
        options.booking.booking_status.payment_in_progress,
      ].includes(booking.status)
    },

    isBookingDepositDisabled(booking) {
      return [
        options.booking.booking_status.payment_in_progress,
      ].includes(booking.status)
    },

    isViewOnCalendarShown(booking) {
      return ![options.booking.booking_status.canceled].includes(booking.status)
    },

    isRepeatBooking(booking) {
      return !!booking.originalBookingId
    },

    formatRowSpan(booking) {
      return booking?.bookedResources?.length ?? 1
    },

    formatClientClass(booking) {
      return ['bookings__client-name', {
        'bookings__client-name--unregistered': !booking.clientId,
      }]
    },

    formatBookingDate(bookingDateTS) {
      return convertTimestampToMomentUTC(bookingDateTS).format('YYYY-MM-DD')
    },

    formatBookingStatus(status) {
      const option = options.booking.option_booking_status.find(option => {
        return option.value === status
      })

      return this.$t(option.text)
    },

    formatBookedResourceStartTime(bookedResource) {
      return formatTimeInMinutes({
        prefix:  this.$t('general.next-day-text'),
        minutes: BookedResource.getStartTimeInMinutes({
          startTime: bookedResource.startTime,
          isNextDay: bookedResource.isNextDay,
        }),
      }) + ` (${bookedResource?.estimatedTime})`
    },

    formatBookingDepositAmount(bookingDeposit) {
      return formatMoney(bookingDeposit.originalAmount, 0)
    },

    formatBookingDepositPaymentAmount(bookingDeposit) {
      return formatMoney(bookingDeposit.bookingDepositPayment.amount, 0)
    },

    formatBookingDepositPaymentRefundAmount(bookingDeposit) {
      return formatMoney(bookingDeposit.bookingDepositPayment.bookingDepositPaymentRefund.amount, 0)
    },

    formatBookingDepositNotPaidTooltip(booking) {
      const dueDate = convertTimestampToMomentUTC(booking?.bookingDeposit?.dueDateTS).format('YYYY-MM-DD HH:mm')

      return `${this.$t('bookings.due-date-time')}\n${dueDate}`
    },

    checkHasBookingDeposit(booking) {
      return booking?.bookingDeposit?.status === options.booking_deposit_status.exist
    },

    checkHasBookingDepositPayment(booking) {
      return this.checkHasBookingDeposit(booking) && booking?.bookingDeposit?.bookingDepositPayment?.status === options.booking_deposit_status.exist
    },

    checkHasBookingDepositRefund(booking) {
      const bookingDepositPayment = booking?.bookingDeposit?.bookingDepositPayment
      return this.checkHasBookingDepositPayment(booking) && bookingDepositPayment?.bookingDepositPaymentRefund?.status === options.booking_deposit_status.exist
    },

    handleNoteEdit(booking) {
      this.selectedBooking = booking
      this.isBookingNotesVisible = true
    },

    handleBookingNoteInput(notes) {
      this.selectedBooking.notes = notes
      const updatedBooking = cloneDeep(this.selectedBooking)

      this.$emit('update-booking-notes', updatedBooking)
    },

    handleBookingNoteHidden() {
      this.selectedBooking = null
      this.isBookingNotesVisible = false
    },

    isEnableAddDeposit(booking) {
      return !checkedOutStatuses.includes(booking.status)
    },

    tooltipTarget(bookingId, resourceIndex) {
      return () => this.$refs[`depositPayment-${bookingId}-${resourceIndex}`]?.[0]
    },

    isNaverBooking(booking) {
      return booking.bookingSource === BOOKING_SOURCE.NAVER
    },

    isBookingNaverDeposit(booking) {
      const bookingNaverDeposit = bookingNaverDepositType.includes(booking.extSystemBookingType)

      return this.isNaverBooking(booking) && bookingNaverDeposit
    },

    handleAddBookingDepositPaymentClick(booking) {
      if (this.isBookingDepositDisabled(booking)) {
        return
      }

      this.$emit('add-booking-deposit-payment', booking)
    },

    handleEditBookingDepositPaymentClick(booking) {
      if(this.isBookingNaverDeposit(booking)) {
        return
      }

      if (booking.cancellationFee) {
        return this.$mixin_handleConfirmHasCancellationFee({
          shopId:    booking.shopId,
          bookingId: booking.bookingId,
        }, () => {
          this.$emit('delete-cancellation-fee-success', booking)
          this.$emit('edit-booking-deposit-payment', booking)
        })
      }

      this.$emit('edit-booking-deposit-payment', booking)
    },

    depositPaymentClass(booking) {
      return [
        'bookings__deposit-payment',
        {
          'bookings__deposit-payment--naver': this.isBookingNaverDeposit(booking),
        },
      ]
    },

    checkBoookingChecked(booking) {
      if (this.isAllItemChecked) {
        return true
      }

      const isBookingInBookingIds = this.bookingIds.includes(booking.bookingId)
      if (this.bookingIdsSearchType === options.booking.bookingIdSelectType.exclude) {
        return !isBookingInBookingIds
      }

      return isBookingInBookingIds
    },

    handleCheckedBookingChange(booking, isChecked) {
      this.$emit('booking-checked-change', booking, isChecked)
    },

    hasEditButton(booking) {
      if(this.isNaverBooking(booking) && [options.booking.booking_status.canceled].includes(booking.status)) {
        return false
      }

      if(this.isNaverBooking(booking) && [options.booking.booking_status.payment_in_progress].includes(booking.status)) {
        return false
      }

      const isAllowEditNaverBooking = this.isNaverBooking(booking) || this.isAllowCancelBooking(booking)
      const isNotAllowEditByStatus = [
        options.booking.booking_status.no_show,
        options.booking.booking_status.canceled,
        options.booking.booking_status.payment_in_progress,
      ].includes(booking.status)

      return (
        isAllowEditNaverBooking ||
        (!this.isNaverBooking(booking) && !isNotAllowEditByStatus && !booking.draftDocumentId)
      )
    },

    isAllowCancelBooking(booking) {
      return booking.status == options.booking.booking_status.requested || booking.status == options.booking.booking_status.completed
    },

    hasDeleteButton (booking) {
      const isMasterRole = this.x_user.user_role_code === USER_ROLES.MASTER
      const isCanceledBooking = booking.status === options.booking.booking_status.canceled
      const isNaverBooking = booking.bookingSource === BOOKING_SOURCE.NAVER

      return isMasterRole && isCanceledBooking && !isNaverBooking
    },

    isShowVisitorInfoName(booking) {
      const visitorInfo = booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo || {}
      if(visitorInfo) {
        return visitorInfo.hasVisitor && visitorInfo.visitorName !== ''
      }
      return false
    },

    visitorName(booking) {
      return booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo?.visitorName || ''
    },

    isShowVisitorInfoMobile(booking) {
      const visitorInfo = booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo || {}
      if(visitorInfo) {
        return visitorInfo.hasVisitor && visitorInfo.visitorPhone !== ''
      }
      return false
    },

    visitorPhone(booking) {
      const isHideClientInfo = this.$bookingMixin_checkHideClientInformation(booking)
      return formatMobileAndPhoneNumber(booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo?.visitorPhone, isHideClientInfo)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./booking-table.scss";
</style>
