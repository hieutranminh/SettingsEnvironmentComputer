<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <div
    :id="containerId"
    class="client-sales-bookings tabbox-table slide-x large"
  >
    <div class="table-intro">
      {{ clientBookingsTableIntro }}
    </div>

    <div class="client-bookings">
      <table class="booking-list-table">
        <thead>
          <tr>
            <th
              class="mobile-view"
              colspan="9"
            >
              {{ clientBookingsTableIntro }}
            </th>
            <th
              v-if="shop_data.chain_id && shop_data.chain_sharing_settings.share_client"
              width="5%"
            >
              {{ $t('sales-booking-tab.loc') }}
            </th>
            <th width="12%">
              {{ $t('sales-booking-tab.booking-date') }}
            </th>
            <th width="9%">
              {{ $t('sales-booking-tab.booking-time') }}
            </th>
            <th width="20%">
              {{ $t('sales-booking-tab.booking-items') }}
            </th>
            <th width="12%">
              {{ $t('sales-booking-tab.resource-name') }}
            </th>
            <th width="12%">
              {{ $t('sales-booking-tab.status') }}
            </th>
            <th width="12%">
              {{ $t('sales-booking-tab.registered-date') }}
            </th>
            <th width="20%">
              {{ $t('sales-booking-tab.notes') }}
            </th>
            <th
              v-if="!isReadonly"
              width="5%"
            >
              {{ $t('general.edit') }}
            </th>
          </tr>
        </thead>
        <template v-if="tableData.rows && tableData.rows.length > 0">
          <tbody
            v-for="booking in tableData.rows"
            :key="booking.id"
            :class="{ 'row-span': booking.booked_resources && booking.booked_resources.length > 1}"
          >
            <template v-for="(bookedResource, bookedResourceIndex) in booking.booked_resources">
              <tr
                v-if="!is_mobile || is_mobile && bookedResourceIndex === 0"
                :key="bookedResource.booked_resource_id"
              >
                <td class="mobile-view">
                  {{ formatBookingDate(booking.booking_date) }} {{ getEarliestBookedTimeFormatted(booking.booked_resources) }}
                  <template v-for="bookedResource of booking.booked_resources">
                    <p
                      v-for="item of bookedResource.booked_items"
                      :key="item.booked_item_id"
                    >
                      {{ item.booked_ref_name }} <span>{{ bookedResource.resource_name }}</span><br>
                    </p>
                  </template>
                  <div
                    :class="['notes', {
                      'multiple-line-ellipsis': !booking.expand
                    }]"
                    @click="handleEditNotes(booking)"
                  ><span class="booking-notes">{{ booking.notes }}</span></div>

                  <div
                    v-if="booking.expand"
                    class="more-info"
                  >
                    <p class="booking-status">{{ $t('general.status') }}: <booking-status
                      :booking="booking"
                      :has-tooltip="false"
                    /></p>
                    <p>{{ $t('sales-booking-tab.registered-date') }}: {{ formatBookingDate(booking.registration_date) }}</p>
                    <b-nav-item-dropdown
                      v-if="!isReadonly && hasEditBookingButton(booking)"
                      dropup
                      no-caret
                    >
                      <template slot="button-content">
                        <aha-button>{{ $t('booking-list.edit') }}</aha-button>
                      </template>
                      <b-dropdown-item
                        @click="onEditBooking(booking)"
                      >
                        {{ $t('booking-list.edit-booking') }}
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-if="isAllowCancelBooking(booking)"
                        @click="onCancelBooking(booking)"
                      >
                        {{ $t('booking-list.cancel-booking') }}
                      </b-dropdown-item>
                    </b-nav-item-dropdown>
                  </div>
                  <div
                    :class="{ 'expand': booking.expand }"
                    class="show-more-text view-mobile"
                    @click="onClickShowMore(booking)"
                  >
                    >
                  </div>
                </td>

                <td
                  v-if="shop_data.chain_id && shop_data.chain_sharing_settings.share_client && bookedResourceIndex === 0"
                  :rowspan="booking.booked_resources.length"
                >
                  <div
                    :id="'tooltip-branch-number' + booking.id"
                    class="branch-number"
                  >
                    {{ getBranchNumber(booking.branch_number, booking.shop_id) }}
                  </div>
                  <aha-tooltip
                    :target="'tooltip-branch-number' + booking.id"
                    boundary="branch-number"
                    placement="right"
                  >
                    {{ booking.shop_name }}
                  </aha-tooltip>
                </td>
                <td
                  v-if="bookedResourceIndex === 0"
                  :rowspan="booking.booked_resources.length"
                >
                  {{ formatBookingDate(booking.booking_date) }}
                </td>
                <td>
                  <small v-if="bookedResource.is_next_day">{{ $t('general.next-day-text') }}</small>
                  {{ formatBookingTime(bookedResource.start_time) }}
                  <div v-if="booking.original_booking_id > 0 && !isNullObject(booking.repeat_booking)">
                    ({{ $t('booking-list.repeat') }})
                  </div>
                </td>
                <td>
                  <p
                    v-for="(bookedItem, index) in bookedResource.booked_items"
                    :key="booking.id +'-'+ index"
                  >
                    {{ bookedItem.booked_ref_name }}
                  </p>
                </td>
                <td>{{ bookedResource.resource_name }}</td>
                <td
                  v-if="bookedResourceIndex === 0"
                  :rowspan="booking.booked_resources.length"
                >
                  <booking-status
                    :booking="booking"
                    :container="containerId"
                  />
                </td>
                <td
                  v-if="bookedResourceIndex === 0"
                  :rowspan="booking.booked_resources.length"
                >
                  <div :id="'tooltip-registered-date' + booking.id">
                    {{ formatRegistrationDate(booking.created_date_time_ts) }}
                  </div>
                  <aha-tooltip
                    :target="'tooltip-registered-date' + booking.id"
                    boundary="registered-date"
                    placement="bottom"
                  >
                    <div><span>{{ $t('sales-booking-tab.registered-by') }} </span><span>{{ booking.created_by_name }}</span></div>
                    <div><span>{{ formatRegistrationDate(booking.created_date_time_ts) }} </span><span>{{ formatRegistrationTime(booking.created_date_time_ts) }}</span></div>
                  </aha-tooltip>
                </td>
                <td
                  v-if="bookedResourceIndex === 0"
                  :rowspan="booking.booked_resources.length"
                  class="notes"
                  @click="handleEditNotes(booking)"
                >
                  <aha-note-with-tooltip
                    :value="booking.notes"
                    :container="containerId"
                    :placement="notesTooltipPlacement"
                    :tooltip-id="`${containerId}-tooltip-${booking.id}`"
                    boundary="vgt-responsive"
                    custom-class="sales-booking-note-tooltip"
                  />
                </td>
                <td
                  v-if="!isReadonly && bookedResourceIndex === 0"
                  :rowspan="booking.booked_resources.length"
                >
                  <b-nav-item-dropdown
                    v-if="hasEditBookingButton(booking)"
                    dropleft
                    no-caret
                  >
                    <template slot="button-content">
                      <aha-button>{{ $t('booking-list.edit') }}</aha-button>
                    </template>
                    <b-dropdown-item
                      @click="onEditBooking(booking)"
                    >
                      {{ $t('booking-list.edit-booking') }}
                    </b-dropdown-item>
                    <b-dropdown-item
                      v-if="isAllowCancelBooking(booking)"
                      @click="onCancelBooking(booking)"
                    >
                      {{ $t('booking-list.cancel-booking') }}
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
        <tbody v-else>
          <tr>
            <td
              class="empty-table"
              colspan="9"
            >
              {{ $t('general.table-empty') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <pagination
      v-if="tableData.options.pagination"
      :pagination.sync="tableData.pagination"
      @change-page="onChangePage"
    />

    <booking-action
      :can_edit_client="false"
      :has-client-information-modal="false"
      :modal-id="bookingActionModalId"
      @edited-booking="onEditedBooking"
    />

    <booking-action-naver
      :visible="bookingActionVisible"
      :is-from-sales-booking="true"
      @hidden="handleBookingActionHidden"
      @booking-added="handleBookingAdded"
      @client-disconnected="handleDisconnect"
    />

    <cancel-repeat-booking
      :modal-id="repeatBookingCancelModalId"
      :cancel-booking-modal-id="bookingCancelModalId"
    />

    <cancel-booking
      :modal-id="bookingCancelModalId"
      @cancel-booking-alert="onCancelBookingAlert"
      @cancel-booking-success="handleCancelBookingSuccess"
    />

    <cancel-booking-deposit-paid
      :visible="isShowCancelBookingDepositPaid"
      :business-id="naverBusinessId"
      :external-system-code="naverExternalSystemCode"
      :external-system-booking-id="cancellingPrepaidBookingMixin.ext_system_booking_id"
      :booking-date-ts="cancellingPrepaidBookingDateTSMixin"
      :booked-resource-start-time="cancellingPrepaidBookingBookedResourceMixin.start_time"
      @cancel-booking-deposit-success="handleCancelBookingDepositSuccess"
    />

    <aha-naver-general-booking-cancel-modal
      v-model="naverGeneralBookingCancelMixin"
      :visible="isShowNaverGeneralBookingCancelModalMixin"
      no-close-on-backdrop
      @show="onShowNaverGeneralBookingCancelModalMixin"
      @hide="onHideNaverGeneralBookingCancelModalMixin"
      @ok="handleCancelGeneralNaverBookingMixin(naverBusinessId)"
    />

    <aha-naver-prepaid-booking-cancel-modal
      v-model="naverPrepaidBookingCancelMixin"
      :business-id="naverBusinessId"
      :visible="isShowNaverPrepaidBookingCancelModalMixin"
      :booking-date-ts="cancellingPrepaidBookingDateTSMixin"
      :booked-resource-start-time="cancellingPrepaidBookingBookedResourceMixin.start_time"
      no-close-on-backdrop
      @hide="onHideNaverPrepaidBookingCancelModalMixin"
      @on-click-cancel-button="onHideNaverPrepaidBookingCancelModalMixin"
      @show="onShowNaverPrepaidBookingCancelModalMixin(naverExternalSystemCode)"
      @on-click-save-button="handleCancelPrepaidNaverBookingMixin(naverBusinessId)"
    />

    <notes-action
      ref="notesActionRef"
      @submit="handleUpdateBookingNotes"
    />
  </div>
</template>

<script>
// Utils
import { debounce } from 'lodash'
import {
  guid,
  getBranchNumber,
  convertDateToTimezone,
  convertDateToTimeStamp,
  convertTimeStampToDate,
  getStartAndFinishTime,
} from 'CommonHelpers'
import moment from 'moment'
import store from 'VuexStore'
import cloneDeep from 'lodash/cloneDeep'
import {mapGetters, mapActions, mapMutations, mapState} from 'vuex'
import CancelBookingActionData from 'ViewModels/actions/bookings/cancel-booking-action-data.js'
import { getBookingStatus, formatBookingTime, getEarliestBookedTimeFormatted } from 'Utils/booking-utils.js'
import BookingValidator from 'Validators/booking/bookingValidator'

// Constant
import {
  BOOKING_SOURCE,
  NOTIFICATON_TYPE,
  BOOKING_EXTERNAL_SYSTEM_PAYMENT,
} from 'Constant'
import { options } from 'OptionsHelpers'

// Mixins
import ClientInfoMixin from 'Mixins/client-info-mixin.js'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import ClientDictionaryMixin from 'Mixins/client-dictionary-mixin'
import naverCancelPrepaidBookingMixin from 'Mixins/naver-cancel-prepaid-booking-mixin.js'
import naverCancelGeneralBookingMixin from 'Mixins/naver-cancel-general-booking-mixin.js'
import DeviceMixin from 'Modules/device/mixins/device'

// Apis
import BookingApi from 'API/bookings/booking-api.js'

//Components
import { AForm } from 'Modules/aha/a-form/a-form'
import AModal from 'Modules/aha/a-modal/a-modal.vue'
import pagination from 'CommonComponents/pagination/pagination.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import NotesAction from 'Components/bookings/notes-action/notes-action.vue'
import component_base from 'CommonComponents/component-base/component-base.vue'
import BookingActionNaver from 'Modules/calendar/components/booking-action/booking-action.vue'
import BookingAction from 'Components/bookings/bookings/booking-action/booking-action.vue'
import CancelBooking from 'Components/bookings/bookings/cancel-booking/cancel-booking.vue'
import BookingStatus from 'Components/bookings/bookings/booking-status/booking-status.vue'
import AhaNoteWithTooltip from 'CommonComponents/aha-note-with-tooltip/aha-note-with-tooltip.vue'
import CancelRepeatBooking from 'Components/bookings/bookings/cancel-repeat-booking/cancel-repeat-booking.vue'
import CancelBookingDepositPaid from 'Components/bookings/bookings/cancel-booking-deposit-paid/cancel-booking-deposit-paid.vue'
import AhaNaverGeneralBookingCancelModal from 'Components/bookings/aha-naver-general-booking-cancel-modal/aha-naver-general-booking-cancel-modal.vue'
import AhaNaverPrepaidBookingCancelModal from 'Components/bookings/aha-naver-prepaid-booking-cancel-modal/aha-naver-prepaid-booking-cancel-modal.vue'
import BookingFormNaver from 'Modules/calendar/components/booking-action/components/booking-form-naver/booking-form-naver.vue'

// View models
import ClientViewModel from 'ViewModels/clients/client-view-model'
import Booking from 'Models/booking/booking'

export default {
  components: {
    AhaTooltip,
    pagination,
    NotesAction,
    BookingStatus,
    BookingAction,
    BookingActionNaver,
    CancelBooking,
    AhaNoteWithTooltip,
    CancelRepeatBooking,
    CancelBookingDepositPaid,
    AhaNaverGeneralBookingCancelModal,
    AhaNaverPrepaidBookingCancelModal,
    BookingFormNaver,
    AForm,
    AModal,
  },

  extends: component_base,

  mixins: [
    ClientInfoMixin,
    BookingCacheMixin,
    ClientDictionaryMixin,
    naverCancelGeneralBookingMixin,
    naverCancelPrepaidBookingMixin,
    DeviceMixin,
  ],

  props: {
    client: {
      type:    Object,
      default: () => new ClientViewModel().fields,
    },

    isReadonly: {
      type:    Boolean,
      default: false,
    },

    isDisableNotes: {
      type:    Boolean,
      default: false,
    },
  },
  data(){
    return {
      bookingFilter: {
        shop_id:               0,
        chain_id:              0,
        status:                null,
        client_id:             0,
        page_number:           1,
        name_or_mobile:        '' ,
        asc_ordering:          false,
        booking_source:        null,
        booking_resource_id:   null,
        has_upcoming_bookings: true,
        page_size:             options.pagination.default,
        type_date:             options.type_date.date_range,
        booking_client_type:   options.booking_client_type.booked_client,
        from_booking_date:     moment(convertDateToTimezone(new Date(1))).toDate(),
        to_booking_date:       moment(convertDateToTimezone(new Date())).add(100, 'years').toDate(),
      },
      is_mobile: this.isMobile(),

      booking_setup:          {},
      handleVisibilitychange: null,
      openingHours:           [],
    }
  },
  computed: {
    ...mapGetters('client_dictionary', [
      'getClientBookingsById',
    ]),
    ...mapState('booking', {
      isShowCancelBookingDepositPaid: 'isShowCancelBookingDepositPaid',
    }),

    ...mapState('_calendar', [
      'today',
      'timeSlot',
      'timeSlotHeight',
      'bookingResources',
      'selectedResourceId',
      'selectedDate',
    ]),

    ...mapState('_calendar/bookings', [
      'bookingSet',
      'isShowSearchVisitorActions',
      'isShowSelectSalesAssignment',
    ]),

    ...mapGetters('_calendar', [
      'toDate',
      'typeDate',
      'fromDate',
      'schedule',
      'datesTs',
      'timeSlots',
      'isMultiDates',
    ]),

    ...mapState('_calendar/bookingAction', {
      bookingActionVisible: 'visible',
      booking:              'booking',
    }),

    uid() {
      return guid()
    },

    clientBookings() {
      return this.getClientBookingsById(this.client.id)
    },

    tableData() {
      return {
        rows:       this.clientBookings?.items ?? [],
        pagination: this.clientBookings?.pagination ?? {},
        options:    {
          pagination:   true,
          fixed_header: true,
        },
      }
    },

    notesTooltipPlacement() {
      return this.isReadonly ? 'left' : 'bottom'
    },
    containerId() {
      return this.isReadonly ? 'sales-bookings-readonly' : 'sales-bookings'
    },
    bookingActionModalId() {
      return `${this.uid}_client_booking_action`
    },
    bookingCancelModalId() {
      return `${this.uid}_client_booking_cancel`
    },
    repeatBookingCancelModalId() {
      return `${this.uid}_cancel-repeat-booking-modal`
    },
    clientBookingsTableIntro(){
      return this.$t('sales-booking-tab.all', {
        records: this.tableData?.pagination?.total_items ?? 0,
      })
    },
    naverBusinessId() {
      return this.booking_setup?.booking_naver_link_setup?.businessId
    },
    naverExternalSystemCode() {
      return this.booking_setup?.booking_naver_link_setup?.externalSystemCode
    },
    bookingValidateSchema() {
      const bookingValidator = new BookingValidator()

      return bookingValidator.schema
    },

    modalClass() {
      const isCheckedOutClass = this.isBookingCheckedOut || this.isNoShowBooking
      const isPortraitModeClass = this.portraitModeClass && !this.isDesktopDevice && !isCheckedOutClass
      const isLandScapeModeClass = this.landScapeModeClass && !this.isDesktopDevice && !isCheckedOutClass

      return [
        'booking-action__modal', this.$attrs['modal-class'], {
          'booking-action__modal--naver':                this.isNaverBooking,
          'booking-action__modal--checked-out':          isCheckedOutClass,
          'booking-action__modal--portrait-mode':        isPortraitModeClass,
          'booking-action__modal--land-scape-mode':      isLandScapeModeClass,
          'booking-action__modal--android-small-tablet': this.isAndroidSmallTablet,
        },
      ]
    },

    modalScale() {
      return this.isNaverBooking
    },

    bodyClass() {
      return ['booking-action__modal-body', this.$attrs['body-class']]
    },

    dialogClass() {
      return ['booking-action__modal-dialog', this.$attrs['dialog-class']]
    },

    contentClass() {
      return ['booking-action__modal-content', this.$attrs['content-class']]
    },

    headerClass() {
      return ['booking-action__header-class', this.$attrs['header-class']]
    },

    ...mapGetters('device', [
      'isIpad',
      'isPortraitMode',
      'isLandscapeMode',
      'isDesktopDevice',
      'isAndroidSmallTablet',
    ]),

    modalTitle() {
      return this.$t('bookings.edit-booking')
    },

  },

  async created() {
    try {
      this.preLoader()
      const bookingEntries = Object.entries(this.bookingSet).map(([key, value]) => ({ [key]: value }))
      bookingEntries.forEach(booking => {
        const bookingId = Object.keys(booking)[0]
        const bookingData = booking[bookingId]
        store.commit(`_calendar/bookings/${bookingData.bookingDateTS}_${bookingData.bookedResources[0].bookingResourceSetupId}/setItems`, [])
      })

      await this.loadCalendarSetup(true)
    } catch(error) {
      this._showDialogAlert(error.message)
    } finally {
      this.preLoader(false)
    }

    // Update the booking list when switching tabs to refresh the bookings
    this.handleVisibilitychange = debounce(() => {
      if (document.visibilityState === 'visible') {
        this.loadBookingsByClientAsync()
      }
    }, 200)
    this.$signalR.on(NOTIFICATON_TYPE.BOOKINGS_UPDATED, this.loadBookingsByClientAsync)
  },

  mounted() {
    const allAllowedBookingHours = []
    this.bookingResources.forEach((bookingResource) => {
      bookingResource.specificWorkingDays?.forEach((specificWorkingDay) => {
        if(this.datesTs.includes(specificWorkingDay.specificWorkingDayTS)) {
          const allowedBookingHours = specificWorkingDay.allowedBookingHours.map(( { startTime, finishTime, crossDate }) => {
            return {
              startTime,
              finishTime,
              crossDate,
            }
          })
          allAllowedBookingHours.push(...allowedBookingHours)
        }
      })
    })
    const openingHoursConvert = this.openingHours.map(( { start_time, finish_time, cross_date }) => {
      return {
        startTime:  start_time,
        finishTime: finish_time,
        crossDate:  cross_date,
      }
    })
    const startEndFinishTime = getStartAndFinishTime([...openingHoursConvert, ...allAllowedBookingHours])
    this.setCrossDate(startEndFinishTime.crossDate)
    this.setStartTime(startEndFinishTime.startTime)
    this.setFinishTime(startEndFinishTime.finishTime)

    document.addEventListener('visibilitychange', this.handleVisibilitychange)

    this.loadBookingsByClientAsync()
  },

  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilitychange)
    this.handleVisibilitychange.cancel()
    this.$signalR.off(NOTIFICATON_TYPE.BOOKINGS_UPDATED, this.loadBookingsByClientAsync)
  },

  methods: {
    getBranchNumber,
    formatBookingTime,
    getEarliestBookedTimeFormatted,

    ...mapActions('alert', [
      'removeAlertsData',
    ]),
    ...mapActions('booking', [
      'setBookingActionData',
      'updateBookingHelpsData',
    ]),
    ...mapActions('booking_cancel', [
      'setBookingCancelActionData',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'openBookingActionForUpdating',
    ]),

    ...mapMutations('booking', [
      'setShowCancelBookingDepositPaid',
    ]),

    ...mapMutations('_calendar', [
      'setTimeSlot',
      'setStartTime',
      'setFinishTime',
      'setCrossDate',
      'setToday',
      'setNumberOfDay',
      'setCalendarRef',
      'setSelectedDate',
      'setSpecificOffDays',
      'setBookingResources',
      'setDisplayCurrentTime',
      'setAllowDuplicateBookings',
      'setBookedResourceNaverLink',
    ]),

    ...mapMutations('_calendar/bookings', [
      'setBookingItem',
      'setSyncBookingWhenDeleteSales',
    ]),

    ...mapActions('_calendar', [
      'setCalendarShowUp',
      'registerCalendarModules',
      'calculateTimeSlotHeight',
      'loadResourceDefaultSelection',
      'calculateBookingOpeningHours',
      'changeBookingSetupResourceSpecificDay',
      'cancelCalendarSlotAccessible',
    ]),

    ...mapActions('_calendar/bookings', [
      'addBooking',
      'updateBooking',
      'cancelBooking',
      'connectClient',
      'deleteSaveDraft',
      'addBookingDeposit',
      'cancelNaverBooking',
      'removeBookingById',
      'noShowNaverBooking',
      'updateBookingStatus',
      'deleteBookingDeposit',
      'updateBookingDeposit',
      'getBookingCalendarLive',
      'addBookingDepositPayment',
      'deleteBookingDepositPayment',
      'updateBookingDepositPayment',
      'addBookingDepositPaymentRefund',
      'updateBookingDepositPaymentRefund',
      'deleteBookingDepositPaymentRefund',
    ]),

    ...mapActions('_calendar/clientInformation', [
      'openClientInformation',
      'closeClientInformation',
    ]),

    ...mapActions('_calendar/waitings', [
      'getWaitingsFromToday',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'closeBookingAction',
      'refreshClientInformation',
    ]),

    ...mapActions('_calendar/waitingAction', {
      closeWaitingAction:                    'closeWaitingAction',
      refreshClientInformationWaitingAction: 'refreshClientInformation',
    }),

    ...mapActions('_calendar/blockedTimes', [
      'addBlockedTime',
      'deleteBlockedTime',
    ]),

    ...mapActions('_calendar/checkoutAction', [
      'checkoutBooking',
      'checkoutBookingFromClientInformation',
    ]),

    ...mapActions('_calendar/sendMessageAction', [
      'sendBookingMessage',
      'sendAddedBookingMessage',
      'sendDepositPaymentConfirmMessage',
    ]),

    ...mapActions('booking_resources', [
      'getBookingResourcesDataAsync',
    ]),

    ...mapActions('opening_hours', [
      'getOpeningHoursDataAsync',
    ]),

    ...mapMutations('_calendar/checkoutAction/booking', [
      'setClientVisitor',
    ]),

    ...mapMutations('sales',[
      'setShowEditCancellationFeeSaleStaffOnlyFromCalendar',
    ]),

    async loadBookingsByClientAsync(data){
      this.removeAlertsData()

      this.booking_setup = await this.$bookingCacheMixin_getAllCalendarSetup({
        shopId: this.shop_data.shop_id,
      })

      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
        return
      }

      this.bookingFilter.client_id = this.client.id
      this.bookingFilter.shop_id = this.shop_data.shop_id
      this.bookingFilter.chain_id = this.shop_data.chain_id

      const isFilterDateRange = this.bookingFilter.type_date == options.type_date.date_range
      const isFilterRangeValid = convertDateToTimeStamp(this.bookingFilter.from_booking_date) < convertDateToTimeStamp(this.bookingFilter.to_booking_date)
      if(isFilterDateRange && !isFilterRangeValid) {
        this.showAlert([this.$i18n.t('validate_messages.from_to_time')])
        return
      }

      await this.clientDictionaryMixin_fetchClientBookings({
        clientId: this.client.id,
        filter:   this.bookingFilter,
      })

    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },
    hasEditBookingButton(booking) {
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
        options.booking.booking_status.checked_out,
      ].includes(booking.status)

      return (
        this.isDataOfCurrentShop(booking) &&
         (
           isAllowEditNaverBooking ||
          (!this.isNaverBooking(booking) && !isNotAllowEditByStatus && !booking.draft_document_id)
         )
      )
    },

    async loadCalendarSetup(refresh = false) {
      const calendarSetup = await this.$bookingCacheMixin_getAllCalendarSetup({
        shopId: this.shop_data.shop_id,
        refresh,
      })

      this.allCalendarSetup = calendarSetup

      const bookingResources = calendarSetup.booking_resources_setup.items

      bookingResources.forEach(item => {
        item.specific_working_days.forEach(day => {
          day.specific_working_days_format = convertTimeStampToDate(day.specificWorkingDayTS, true)
        })
      })

      const bookingTimeSlot = calendarSetup.booking_calendar_setup.booking_time_slot
      const bookingOpeningHours = calendarSetup.booking_opening_hours_setup.opening_hours
      this.openingHours = bookingOpeningHours || []
      const specificOffDays = calendarSetup.booking_opening_hours_setup.specific_off_days
      const displayCurrentTime = calendarSetup.booking_calendar_setup.display_current_time
      const allowDuplicateBookings = calendarSetup.booking_calendar_setup.allow_duplicate_bookings

      this.setTimeSlot(bookingTimeSlot)
      this.setSpecificOffDays(specificOffDays)
      this.setBookingResources(bookingResources)
      this.setDisplayCurrentTime(displayCurrentTime)
      this.setAllowDuplicateBookings(allowDuplicateBookings)

      this.setCalendarShowUp({
        timeShowUp:         calendarSetup.booking_calendar_setup.time_show_up,
        notesShowUp:        calendarSetup.booking_calendar_setup.notes_show_up,
        serviceShowUp:      calendarSetup.booking_calendar_setup.service_show_up,
        memberNumberShowUp: calendarSetup.booking_calendar_setup.member_number_show_up,
      })

      await this.calculateBookingOpeningHours(bookingOpeningHours)

      /**
       * Load Resource Default Selection
       * From issue: https://gitlab.com/aha.software.2018/aha-testing/-/issues/2138
       */

      await this.registerCalendarModules()
    },

    async onEditBooking(booking){
      if (!this.isNaverBooking(booking)) {
        let booking_action = {
          action:  options.form_actions.edit,
          data:    cloneDeep(booking),
          options: {
            booking_resource_setup_id: 0,
            booking_date:              booking.booking_date,
            start_time:                booking.booked_resources[0].start_time,
          },
        }
        this.updateBookingHelpsData({ date_picker: booking.booking_date })
        this.setBookingActionData(booking_action)
        this.showDialogById(this.bookingActionModalId)
      } else {
        try {
          this.preLoader()
          const bookingData = Booking.build(booking)
          const updateBookingCallback = await this.openBookingActionForUpdating({ booking: bookingData })

          updateBookingCallback(result => {
            if (!result) return

            this.loadBookingsByClientAsync()
          })
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      }
    },

    onEditedBooking(){
      this.loadBookingsByClientAsync()
    },
    onCancelBooking(booking){
      this.onActionBookingCancel(booking)
    },
    isAllowCancelBooking(booking) {
      return booking.status == options.booking.booking_status.requested || booking.status == options.booking.booking_status.completed
    },
    onActionBookingCancel(booking){
      if(booking.id > 0) booking.booking_id = booking.id

      const tmp_booking_date = convertDateToTimezone(booking.booking_date)
      const booking_resources_setup = this.booking_setup?.booking_resources_setup?.items
      let booking_cancel = new CancelBookingActionData(
        booking.booking_id,
        booking.booking_source,
        booking.booked_items,
        booking.booking_deposit,
        booking.client_id,
        booking.client_name,
        booking.client_mobile_number,
        tmp_booking_date,
        booking.booking_date_ts,
        booking.original_booking_id,
        booking.start_time,
        options.booking_cancel_type.booking_only,
        options.booking_reason.not_selected,
        options.booking.booking_source.administrator,
        '',
        booking.booked_resources,
        booking_resources_setup,
        booking.ext_system_booking_type,
        booking.ext_system_booking_id)

      booking_cancel = Object.assign(booking_cancel, this.shop_data)
      this.booking_cancel_action = {
        action: options.form_actions.add,
        data:   booking_cancel,
      }

      this.setBookingCancelActionData(this.booking_cancel_action)

      if (this.isGeneralOrPayAtSalonWithoutDepositNaverBooking(booking)) {
        if (booking.booking_deposit.hasDeposit && booking.booking_deposit.depositType === options.deposit_type.paid) {
          this.cancellingPrepaidBookingMixin = booking
          this.setShowCancelBookingDepositPaid(true)
        } else {
          this.cancellingBookingMixin = booking
          this.isShowNaverGeneralBookingCancelModalMixin = true
        }
        return
      }

      if (this.isPrepaymentOrPayAtSalonWithDepositNaverBooking(booking)) {
        this.cancellingPrepaidBookingMixin = booking
        return this.setShowCancelBookingDepositPaid(true)
      }

      if (booking.booking_deposit.hasDeposit && (booking.booking_deposit.depositType === options.deposit_type.paid)) {
        return this.setShowCancelBookingDepositPaid(true)
      }

      if(booking.original_booking_id == null){
        this.showDialogById(this.bookingCancelModalId)
      }
      else {
        this.showDialogById(this.repeatBookingCancelModalId)
      }
    },
    onCancelBookingAlert(){
      this.loadBookingsByClientAsync()
    },
    async onChangePage(page_num){
      this.bookingFilter.page_number = page_num
      await this.loadBookingsByClientAsync()
    },
    handleCancelBookingSuccess(result) {
      this.loadBookingsByClientAsync()
      this.$emit('cancel-booking-success', result)
    },

    handleCancelBookingDepositSuccess () {
      this.loadBookingsByClientAsync()
    },

    // viewing
    onClickShowMore(row){
      row.expand = !row.expand
    },
    formatBookingDate(booking_date){
      let tmp = convertDateToTimezone(booking_date)
      return moment(tmp).format(options.standard_date_format.ymd)
    },
    formatBookingStatus(booking){
      return getBookingStatus(booking.status)
    },

    isNaverBooking(booking = {}) {
      return booking.booking_source === BOOKING_SOURCE.NAVER
    },

    formatRegistrationDate(bookingRegistrationDate) {
      return moment.unix(bookingRegistrationDate).utc().format(options.standard_date_format.ymd)
    },

    formatRegistrationTime(bookingRegistrationDate) {
      return moment.unix(bookingRegistrationDate).utc().format(options.standard_hour_format.h24)
    },

    handleEditNotes(booking) {
      this.$refs.notesActionRef.showModal({
        id:            booking.id,
        isEditable:    !this.isDisableNotes,
        notes:         booking.notes,
        bookingSource: booking.booking_source,
      })
    },

    async handleUpdateBookingNotes({ id: bookingId, notes, bookingSource}) {
      try {
        this.preLoader()
        const bookingApi = new BookingApi()
        const result = await bookingApi.updateNotes({
          notes,
          bookingId,
          bookingSource,
          shopId:           this.shop_data?.shop_id,
          sessionToken:     this.x_user?.session_token,
          shopLocaltion:    this.shop_data?.shop_location,
          editedDateTimeTS: convertDateToTimeStamp(new Date(), true, true),
        })
        if(!result.is_ok) {
          this._showDialogAlert(result.error_messages)
          return
        }

        this.loadBookingsByClientAsync()
        this.$refs.notesActionRef.hideModal?.()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    isGeneralOrPayAtSalonWithoutDepositNaverBooking(booking = {}) {
      return (
        booking?.booking_source === BOOKING_SOURCE.NAVER &&
          (
            booking?.ext_system_booking_type === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_GENERAL ||
              booking?.ext_system_booking_type === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON
          )
      )
    },

    isPrepaymentOrPayAtSalonWithDepositNaverBooking(booking = {}) {
      return (
        booking?.booking_source === BOOKING_SOURCE.NAVER &&
          (
            booking?.ext_system_booking_type === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PREPAYMENT ||
              booking?.ext_system_booking_type === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON_DEPOSIT
          )
      )
    },

    async handleBookingAdded(addedBooking) {
      this.sendAddedBookingMessage({ booking: addedBooking })
    },

    handleBookingActionHidden() {
      this.closeBookingAction()
    },

    handleDisconnect(data) {
      this.loadBookingsByClientAsync(data)
    },
  },
}
</script>

<style lang="scss">
@import './sales-bookings.scss';
</style>

<style lang="scss" scoped>
// double tooltip default width
::v-deep .sales-booking-note-tooltip .tooltip-inner {
  max-width: 400px;
}
</style>
