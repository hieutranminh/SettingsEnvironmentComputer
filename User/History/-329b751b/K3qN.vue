<template>
  <div
    ref="tableBookingListRef"
    :class="bookingListClass"
  >
    <div class="booking-list__actions mb-2">
      <a-button
        variant="primary"
        class="booking-list__action-button"
        @click="handlePrintClick"
      >
        {{ $t('booking-list.print') }}
      </a-button>
      <a-button
        v-if="isAllowSendMessageClient"
        variant="primary"
        class="booking-list__action-button"
        @click="handleSendMessageClick"
      >
        {{ $t('messages.send') }}
      </a-button>
      <a-button
        variant="blue-light"
        class="booking-list__action-button"
        @click="$emit('hide')"
      >
        {{ $t('general.close') }}
      </a-button>
    </div>
    <booking-filter
      :value="filter"
      class="booking-list__filter"
      @input="handleFilterChange"
    />
    <booking-table
      :bookings="bookings"
      :paging-info="pagingInfo"
      :booking-ids="sendSMSFilters.bookingIds"
      :booking-ids-search-type="sendSMSFilters.bookingIdsSearchType"

      class="booking-list__table"
      @print="handlePrintClick"
      @edit-booking="handleBookingEdit"
      @cancel-booking="handleBookingCancel"
      @update-booking="handleBookingUpdate"
      @send-message="handleSendMessageClick"
      @bookings-checked="handleBookingChecked"
      @bookings-unchecked="handleBookingUnChecked"
      @delete-booking="handleDeleteBookingCanceled"
      @update-booking-notes="handleUpdateBookingNote"
      @view-on-calendar="handleViewBookingOnCalendar"
      @on-client-name-clicked="handleClientNameClicked"
      @add-booking-deposit="handleAddBookingDepositClick"
      @booking-checked-change="handleBookingCheckedChange"
      @add-booking-deposit-payment="handleBookingDepositPaymentAdd"
      @booking-ids-select-type-change="handleBookingIdsSearchTypeChange"
      @edit-booking-deposit-payment="handleViewBookingDepositPaymentDetail"
      @delete-cancellation-fee-success="handleDeleteCancellationFeeSuccess"
    />

    <pagination
      :pagination="pagination"
      @change-page="handlePageChange"
    />

    <p class="booking-list__hint">
      {{ $t('booking-list.booking-list-description') }}
    </p>
    <p class="booking-list__hint">
      {{ $t('booking-list.booking-list-description-2') }}
    </p>

    <booking-deposit-action
      ref="bookingDepositAdd"
    />

    <booking-deposit-payment-add-action
      ref="bookingDepositPaymentAdd"
      @send-message="handleSendBookingMessage"
      @booking-deposit-update="handleBookingDepositUpdate"
      @booking-deposit-delete="handleBookingDepositDelete"
    />

    <booking-deposit-payment-edit-action
      ref="bookingDepositPaymentEdit"
      :is-disabled-form="isDisabledDepositForm"
      @delete="handleBookingDepositPaymentDelete"
    />

    <booking-deposit-payment-detail-action
      ref="bookingDepositPaymentDetail"
    />

    <booking-deposit-refund-action
      ref="bookingDepositRefund"
    />

    <booking-deposit-setup-alarm
      ref="bookingDepositSetupAlarm"
    />

    <booking-deposit-guide-alarm
      ref="bookingDepositGuideAlarm"
    />

    <booking-deposit-payment-confirmation-alarm
      ref="bookingDepositPaymentConfirmationAlarm"
    />

    <client-connectable-action
      ref="clientConnectable"
    />

    <cancel-booking-action
      ref="bookingCancel"
    />

    <report-print-preview-with-worker-modal
      :is-error="isWorkerErrorMixin"
      :pdf-blob-url="pdfBlobUrlMixin"
      :is-processing="!isWorkerDoneMixin"
      :modal-id="reportPrintPreviewModal"
      :percentage="progressPercentageMixin"
      :is-landscape="isLandscapePrintContentMixin"

      @hide="onHidePreviewModalMixin"
      @on-click-retry="handlePrintClick"
      @on-click-save-as-pdf="onClickSaveAsPdfMixin(modalTitle)"
      @on-click-save-as-excel="onClickSaveAsExcelMixin(modalTitle)"
    />

    <client-information-modal
      :client-id="clientInfoId"
      :visible="clientInformationModalShow"

      @hidden="clientInformationModalShow = false"
    />

    <!-- Alert confirm delete -->
    <alert-confirm
      :id="modalConfirmDelete"
      :label_no="$t('general.cancel')"
      :label_yes="$t('general.delete')"
      :data_alerts="[$t('general.warning-delete')]"

      yes-button-variant="red"
      @confirm="onDeleteBookingCanceled"
    />

    <!-- Alert has a paid booking deposit -->
    <alert-confirm
      :id="modalHasPaidBookingDeposit"
      :hide_yes="true"
      :label_no="$t('general.close')"
      :data_alerts="[$t('booking-list.alert-cannot-delete-booking-with-paid')]"
    />
  </div>
</template>

<script>
// Utilities
import i18n from 'Translate'
import { mapActions, mapMutations } from 'vuex'
import { formatTSToUTCDate, convertDateToTimeStamp } from 'DatetimeHelpers'
import { convertDateToTimezone, convertDateToMomentUTC, CalendarEventBus } from 'Modules/calendar/utils/index'
import { parseTimezoneToNumber } from 'CommonHelpers'

// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import BookingTable from '../booking-table/booking-table.vue'
import BookingFilter from '../booking-filter/booking-filter.vue'
import Pagination from 'CommonComponents/pagination/pagination.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import PrintPreviewMixin from 'Mixins/print-preview-mixin.js'
import EnvironmentMixin from 'Mixins/environment-setup-mixin.js'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import ClientCacheMixin from 'Modules/cache/mixins/client_cache.js'

// Apis
import * as bookingApi from 'Modules/api/booking/booking-api'
import { deleteBookingCanceled } from 'Modules/api/booking/booking-api'

// Models
import Booking from 'Models/booking/booking'
import BookingDeposit from 'Models/booking/bookingDeposit'

// Constant
import { options } from 'OptionsHelpers'
import {BOOKING_STATUS, NOTIFICATON_TYPE, PRINT_PREVIEW_WORKER_ACTION_TYPES} from 'Constant'

const checkedOutStatuses = [
  BOOKING_STATUS.CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_AUTO_CHECKED_OUT,
]
const BOOKING_LIST = 'booking-list'

export default {
  components: {
    AButton,
    Pagination,
    BookingTable,
    AlertConfirm,
    BookingFilter,

    ClientInformationModal:                 () => import('Components/clients/client-information/client-information-modal.vue'),
    CancelBookingAction:                    () => import('Modules/calendar/components/cancel-booking-action/cancel-booking-action.vue'),
    BookingDepositAction:                   () => import('Modules/calendar/components/booking-deposit-action/booking-deposit-action.vue'),
    ClientConnectableAction:                () => import('Modules/clients/components/client-connectable-action/client-connectable-action.vue'),
    BookingDepositSetupAlarm:               () => import('Modules/calendar/components/booking-deposit-setup-alarm/booking-deposit-setup-alarm.vue'),
    ReportPrintPreviewWithWorkerModal:      () => import('CommonComponents/report-print-preview-with-worker-modal/report-print-preview-with-worker-modal.vue'),
    BookingDepositGuideAlarm:               () => import('Modules/calendar/components/send-message-action/components/booking-deposit-guide-alarm/booking-deposit-guide-alarm.vue'),
    BookingDepositRefundAction:             () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-refund-action/booking-deposit-refund-action.vue'),
    BookingDepositPaymentAddAction:         () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-add-action/booking-deposit-payment-add-action.vue'),
    BookingDepositPaymentEditAction:        () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-edit-action/booking-deposit-payment-edit-action.vue'),
    BookingDepositPaymentDetailAction:      () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-detail-action/booking-deposit-payment-detail-action.vue'),
    BookingDepositPaymentConfirmationAlarm: () => import('Modules/calendar/components/send-message-action/components/booking-deposit-payment-confirmation-alarm/booking-deposit-payment-confirmation-alarm.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    ClientCacheMixin,
    EnvironmentMixin,
    BookingCacheMixin,
    PrintPreviewMixin('tableBookingListRef'),
  ],

  props: {
    bookingLookupResult: {
      type:    Object,
      default: null,
    },
  },

  data() {
    const now = convertDateToTimezone()

    const fromBookingDate = convertDateToMomentUTC(now).startOf('day')
    const toBookingDate = convertDateToMomentUTC(now).add(30, 'day').startOf('day')

    return {
      filter: {
        chainId:                0,
        clientId:               0,
        status:                 null,
        pageNumber:             1,
        ascOrdering:            true,
        nameOrMobile:           '',
        bookingItem:            null,
        filterDateType:         0,
        bookingSource:          null,
        bookingClientType:      1,
        hasUpcomingBookings:    true,
        bookingResourceSetupId: null,
        pageSize:               options.pagination.default,
        typeDate:               options.type_date.date_range,

        toBookingDateTS:   toBookingDate.unix(),
        fromBookingDateTS: fromBookingDate.unix(),
      },

      sendSMSFilters: {
        bookingIds:           [],
        bookingIdsSearchType: options.booking.bookingIdSelectType.exclude,
      },

      bookings: [],

      pagingInfo: {
        pageSize:   0,
        pageNumber: 0,
        totalItems: 0,
      },

      clientSetup:                null,
      clientInfoId:               0,
      dateRangePrintText:         '',
      isCheckedOutBooking:        false,
      clientInformationModalShow: false,
      isBookingMultipleResource:  false,
    }
  },

  computed: {
    pagination() {
      return {
        page_size:   this.pagingInfo.pageSize,
        page_number: this.pagingInfo.pageNumber,
        total_items: this.pagingInfo.totalItems,
        total_pages: Math.ceil(this.pagingInfo.totalItems / this.pagingInfo.pageSize),
      }
    },

    modalTitle() {
      return this.$t('booking-list.booking-list')
    },

    reportHeaderText() {
      return [
        this.modalTitle,
        this.dateFilterPrintText,
      ]
    },

    tableHeaderPrint() {
      return [
        this.$t('booking-list.src'),
        this.$t('booking-list.registered-date'),
        this.$t('booking-list.booking-date'),
        `${this.$t('booking-list.booking-time')}\r\n(${this.$t('bookings.estimated-time')})`,
        this.$t('booking-list.client-name'),
        this.$t('booking-list.resource'),
        this.$t('booking-list.booking-items'),
        this.$t('booking-list.status'),
        this.$t('booking-list.booking-deposit'),
        this.$t('booking-list.notes'),
      ]
    },

    dateFilterPrintText() {
      const fromDate = formatTSToUTCDate(this.filter?.fromBookingDateTS, options.standard_date_format.ymd)
      const toDate = this.filter?.toBookingDateTS ? formatTSToUTCDate(this.filter?.toBookingDateTS, options.standard_date_format.ymd) : null
      if(this.filter.typeDate === options.type_date.date_range) {
        return `(${fromDate}${toDate ? ` - ${toDate}` : ''})`
      }

      if(this.filter.typeDate === options.type_date.date) {
        return `(${fromDate})`
      }

      return ''
    },

    bookingListClass() {
      return ['booking-list', {
        'booking-list--mobile': this.isMobileDevice,
      }]
    },

    isDisabledDepositForm() {
      return this.isCheckedOutBooking
    },

    reportPrintPreviewModal() {
      return 'booking-list-print-preview-id'
    },

    modalConfirmDelete() {
      return 'confirm-delete'
    },

    modalHasPaidBookingDeposit() {
      return 'has-paid-booking-deposit'
    },

    isAllowSendMessageClient() {
      if(!this.isStaffRole) return true
      return this.allowSendTextMessageToStaff
    },
  },

  created() {
    this.initialSearchQueryFromBookingLookupResult()
    this.registerSignalREvents()
    this.loadBookings()
    this.loadClientSetup()
    this.$bus.on('cancel-booking-deposit-success', this.onCancelBookingSuccess)
  },

  beforeDestroy() {
    this.unregisterSignalREvents()
    this.$bus.off('cancel-booking-deposit-success', this.onCancelBookingSuccess)
  },

  methods: {
    ...mapActions('_calendar/bookings', [
      'cancelBooking',
      'updateBooking',
      'connectClient',
      'cancelNaverBooking',
      'addBookingDeposit',
      'updateBookingDeposit',
      'addBookingDepositPayment',
      'updateBookingDepositPayment',
      'deleteBookingDepositPayment',
      'addBookingDepositPaymentRefund',
      'updateBookingDepositPaymentRefund',
      'deleteBookingDepositPaymentRefund',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'openBookingActionForUpdating',
    ]),

    ...mapActions('_calendar/sendMessageAction', [
      'sendBookingMessage',
      'sendBookingMessages',
      'sendAddedBookingMessage',
      'sendDepositPaymentConfirmMessage',
    ]),

    ...mapMutations('sales',[
      'setClientShopIdUsingSales',
    ]),

    registerSignalREvents() {
      this.$signalR.on(NOTIFICATON_TYPE.BOOKINGS_UPDATED, this.loadBookings)
    },

    unregisterSignalREvents() {
      this.$signalR.off(NOTIFICATON_TYPE.BOOKINGS_UPDATED, this.loadBookings)
    },

    async loadBookings() {
      try {
        this.preLoader()

        const response = await bookingApi.getBookingList({
          ...this.filter,
          shopId:                 this.shop_data.shop_id,
          shopTimeZone:           parseTimezoneToNumber(this.shop_data.timezone),
          bookingSource:          this.filter.bookingSource || null,
          bookingResourceSetupId: this.filter.bookingResourceSetupId || null,
        })

        this.bookings = response?.data?.result?.items ?? []
        this.pagingInfo = response?.data?.result?.pagingInfo ?? {}
        this.printFilter = {
          ...this.filter,
          shopId:       this.shop_data.shop_id,
          shopTimeZone: parseTimezoneToNumber(this.shop_data.timezone),
          totalItems:   this.pagingInfo.totalItems,
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async loadClientSetup() {
      this.clientSetup = await this.$clientCacheMixin_getClientShopInfo({
        shopId: this.shop_data.shop_id,
      })

      if(this.isNullObject(this.clientSetup)) {
        this.showMissingClientsSetupAlert()
      }
    },

    async handleFilterChange(filter) {
      this.filter = {
        ...this.filter,
        ...filter,
        pageNumber: 1,
      }

      await this.loadBookings()

      this.sendSMSFilters.bookingIds = []
      this.sendSMSFilters.bookingIdsSearchType = options.booking.bookingIdSelectType.exclude
    },

    handlePageChange(pageNumber) {
      this.filter = {
        ...this.filter,
        pageNumber,
      }

      this.loadBookings()
    },

    async handleUpdateBookingNote(booking) {
      try {
        this.preLoader()
        const payload = {
          notes:            booking?.notes,
          bookingId:        booking?.bookingId,
          shopId:           this.shop_data.shop_id,
          bookingSource:    booking?.bookingSource,
          sessionToken:     this.x_user?.session_token,
          shopLocation:     this.shop_data?.shop_location,
          editedDateTimeTS: convertDateToTimeStamp(new Date(), true, true),
        }

        await bookingApi.updateNotes(payload)

        this.updateBooking({booking})

        this.loadBookings()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingUpdate(data) {
      try {
        this.preLoader()

        const booking = Booking.build(data)
        const updatedBookings = await booking.update()
        updatedBookings.forEach(booking => {
          this.updateBooking({ booking })
        })

        this.loadBookings()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingEdit(data) {
      try {
        this.preLoader()

        const booking = Booking.build(data)

        const updateBookingCallback = await this.openBookingActionForUpdating({ booking })

        updateBookingCallback(result => {
          if (!result) return

          this.loadBookings()
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingDepositUpdate(bookingDeposit) {
      try {
        this.preLoader()

        await this.updateBookingDeposit({
          bookingDeposit,
        })

        this.loadBookings()
        this.$refs.bookingDepositPaymentAdd.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingDepositDelete() {
      try {
        this.preLoader()

        this.loadBookings()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /** @param {Object} data */
    /** @param {Booking} data.booking */
    /** @param {Boolean} data.forceSetup */
    async handleAddBookingDeposit(data) {
      /**@type {Booking} */
      const booking = data.booking
      const bookingDeposit = booking.bookingDeposit ?? new BookingDeposit()

      this.$refs.bookingDepositAdd.show({
        bookingDeposit,
        forceSetup: !!data.forceSetup,
        booking,
      })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.showBookingDepositMessageSetupAlarm(changedBookingDeposit)

          this.preLoader()

          changedBookingDeposit.bookingId = booking.bookingId

          await this.addBookingDeposit({
            bookingDeposit: changedBookingDeposit,
          })

          booking.bookingDeposit = changedBookingDeposit

          await this.sendAddedBookingMessage({ booking })

          this.loadBookings()
          this.$refs.bookingDepositAdd.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /** @param {Object} data */
    async handleAddBookingDepositClick(data) {
      try {
        this.preLoader()

        const booking = Booking.build(data)

        const bookingDepositDefaultSetup = await this.$bookingCacheMixin_getBookingDepositDefaultSetup({
          shopId: this.shop_data.shop_id,
        })

        const hasBookingDepositSetup = this.$bookingCacheMixin_checkHasBookingDepositSetup(bookingDepositDefaultSetup)

        if (!hasBookingDepositSetup) {
          this.$refs.bookingDepositSetupAlarm.show()(event => {
            this.handleAddBookingDeposit({
              booking,
              forceSetup: event === 'setup-now',
            })
          })
        } else {
          this.handleAddBookingDeposit({ booking })
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingDepositPaymentAdd(data) {
      /**@type {Booking} */
      const booking = Booking.build(data)

      this.$refs.bookingDepositPaymentAdd.showFromBooking({ booking })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.preLoader()

          await this.addBookingDepositPayment({
            bookingDeposit: changedBookingDeposit,
          })

          booking.bookingDeposit = changedBookingDeposit
          await this.sendAddedBookingMessage({ booking })

          this.loadBookings()
          this.$refs.bookingDepositPaymentAdd.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /**@param {Booking} booking */
    async handleSendBookingMessage(booking) {
      try {
        await this.sendBookingMessage({ booking })

        this.$refs.bookingDepositPaymentAdd.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    /**@param {Object} data */
    async handleViewBookingDepositPaymentDetail(data) {
      /**@type {Booking} */
      const booking = Booking.build(data)

      this.$refs.bookingDepositPaymentDetail.showFromBooking({ booking })((event) => {
        if (event === 'edit-payment-click') {
          this.handleBookingDepositPaymentEdit(data)
        } else if (event === 'send-message-click') {
          this.handleDepositPaymentConfirmMessage(booking)
        } else if (event === 'add-refund-click') {
          this.handleBookingDepositRefundAdd(booking)
        } else if (event === 'edit-refund-click') {
          this.handleBookingDepositRefundEdit(booking)
        }
      })
    },

    handleDeleteCancellationFeeSuccess(booking) {
      this.bookings = this.bookings.map(item => {
        if (item.bookingId === booking.bookingId) {
          item.cancellationFee = null
        }

        return item
      })
    },

    /**@param {Booking} booking */
    handleBookingDepositRefundAdd(booking) {
      this.$refs.bookingDepositRefund.show({
        bookingDeposit: booking.bookingDeposit,
      })(async (event, { bookingDeposit }) => {
        try {
          this.preLoader()

          await this.addBookingDepositPaymentRefund({ bookingDeposit })

          this.loadBookings()

          this.$refs.bookingDepositRefund.hide()
          this.$refs.bookingDepositPaymentDetail.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /**@param {Booking} booking */
    handleBookingDepositRefundEdit(booking) {
      this.$refs.bookingDepositRefund.show({
        bookingDeposit: booking.bookingDeposit,
      })(async (event, { bookingDeposit }) => {
        try {
          this.preLoader()

          if (event === 'input') {
            await this.updateBookingDepositPaymentRefund({ bookingDeposit })
          } else if (event === 'delete') {
            await this.deleteBookingDepositPaymentRefund({ bookingDeposit })
          }

          this.loadBookings()

          this.$refs.bookingDepositRefund.hide()
          this.$refs.bookingDepositPaymentDetail.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async handleBookingDepositPaymentEdit(data) {
      /**@type {Booking} */
      const booking = Booking.build(data)

      this.isCheckedOutBooking = checkedOutStatuses.includes(booking.status)

      this.$refs.bookingDepositPaymentEdit.showFromBooking({ booking })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.preLoader()

          await this.updateBookingDepositPayment({
            bookingDeposit: changedBookingDeposit,
          })

          this.loadBookings()
          this.$refs.bookingDepositPaymentEdit.hide()
          this.$refs.bookingDepositPaymentDetail.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /**@param {Booking} booking */
    async handleDepositPaymentConfirmMessage(booking) {
      try {
        this.preLoader()

        await this.sendDepositPaymentConfirmMessage({ booking })

        this.$refs.bookingDepositPaymentDetail.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingDepositPaymentDelete(bookingDeposit) {
      try {
        await this.deleteBookingDepositPayment({ bookingDeposit })

        this.loadBookings()
        this.$refs.bookingDepositPaymentEdit.hide()
        this.$refs.bookingDepositPaymentDetail.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingCancel(data) {
      if (!data.bookingId) return

      const booking = Booking.build(data)
      this.isBookingMultipleResource = booking?.bookedResources?.length > 1

      this.$refs.bookingCancel.show({ booking })(async cancelResult => {
        try {
          if (!cancelResult) return

          this.preLoader()
          if (booking.bookingSource === options.booking.booking_source.naver) {
            await this.cancelNaverBooking({
              booking,
              cancellation: cancelResult,
            })
          } else {
            await this.cancelBooking({
              booking,
              option: cancelResult.option,
              reason: cancelResult.reason,
            })
          }

          this.loadBookings()
          this.$refs.bookingCancel.hide()
        } catch (error) {
          if(error?.isApiError()) {
            this._showDialogAlert(i18n.t('bookings.cancel-booking-intro'))
            return
          }

          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async handleClientNameClicked(data) {
      /**@type {Booking} */
      const booking = Booking.build(data)

      if(booking?.clientId > 0) {
        this.clientInfoId = booking.clientId
        this.setClientShopIdUsingSales(booking.clientShopId)
        this.$nextTick(() => {
          this.clientInformationModalShow = true
        })
      }
      else {
        this.$refs.clientConnectable.show({
          clientName:         booking.clientName,
          clientMobileNumber: booking.clientMobileNumber,
        })(async (connectClient) => {
          try {
            if (!connectClient) return

            this.preLoader()

            await this.connectClient({
              client:    connectClient,
              bookingId: booking.bookingId,
            })

            this.loadBookings()
            this.$refs.clientConnectable.hide()
          } catch(error) {
            this._showDialogAlert(error.message)
          } finally {
            this.preLoader(false)
          }
        })
      }
    },

    handleViewBookingOnCalendar(data) {
      this.$emit('hide')
      CalendarEventBus.$emit('view-booking-on-calendar', { data, type: BOOKING_LIST })
    },

    handlePrintClick() {
      this.showDialogById(this.reportPrintPreviewModal)
      this.postMessageToPrintPreviewWorkerMixin({
        tableHeaders:      this.tableHeaderPrint,
        reportHeaders:     this.reportHeaderText,
        additionalOptions: {
          clientSetup: this.clientSetup,
          userInfo:    this.x_user,
          shopInfo:    this.shop_data,
        },
        requestPayload: this.printFilter,
        workerType:     PRINT_PREVIEW_WORKER_ACTION_TYPES.BOOKING_LIST_CALENDAR_V2,
      })
    },

    async handleSendMessageClick() {
      try {
        this.preLoader()

        this.$salesCacheMixin_clearEnvironmentSetup()
        await this.getEnvironmentSetupCache()

        if (!this.isAllowSendMessageClient) {
          return this._showDialogAlert(this.$t('general.user-unauthorized'))
        }

        await this.sendBookingMessages({
          filter: {
            ...this.filter,
            ...this.sendSMSFilters,
            shopTimeZone: parseTimezoneToNumber(this.shop_data.timezone),
          },
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleBookingIdsSearchTypeChange(bookingIdsSearchType) {
      this.sendSMSFilters.bookingIds = []
      this.sendSMSFilters.bookingIdsSearchType = bookingIdsSearchType
    },

    addSendSMSBookingIds(bookings) {
      return bookings.reduce((data, booking) => {
        if (data.includes(booking.bookingId)) return data

        data.push(booking.bookingId)

        return data
      }, this.sendSMSFilters.bookingIds)
    },

    removeSendSMSBookingIds(bookings) {
      return this.sendSMSFilters.bookingIds.filter(bookingId => !bookings.find(booking => booking.bookingId === bookingId))
    },

    handleBookingChecked(bookings) {
      if (this.sendSMSFilters.bookingIdsSearchType === options.booking.bookingIdSelectType.exclude) {
        this.sendSMSFilters.bookingIds = this.removeSendSMSBookingIds(bookings)
      } else {
        this.sendSMSFilters.bookingIds = this.addSendSMSBookingIds(bookings)
      }
    },

    handleBookingUnChecked(bookings) {
      if (this.sendSMSFilters.bookingIdsSearchType === options.booking.bookingIdSelectType.exclude) {
        this.sendSMSFilters.bookingIds = this.addSendSMSBookingIds(bookings)
      } else {
        this.sendSMSFilters.bookingIds = this.removeSendSMSBookingIds(bookings)
      }
    },

    handleBookingCheckedChange(booking, isChecked) {
      const excludeBookingIds = (booking) => {
        return this.sendSMSFilters.bookingIds.filter(bookingId => {
          return booking.bookingId !== bookingId
        })
      }

      const includeBookingIds = (booking) => {
        const bookingIds = [...this.sendSMSFilters.bookingIds]

        if (!bookingIds.includes(booking.bookingId)) {
          bookingIds.push(booking.bookingId)
        }

        return bookingIds
      }

      if (this.sendSMSFilters.bookingIdsSearchType === options.booking.bookingIdSelectType.exclude) {
        if (isChecked) {
          this.sendSMSFilters.bookingIds = excludeBookingIds(booking)
        } else {
          this.sendSMSFilters.bookingIds = includeBookingIds(booking)
        }
      } else {
        if (isChecked) {
          this.sendSMSFilters.bookingIds = includeBookingIds(booking)
        } else {
          this.sendSMSFilters.bookingIds = excludeBookingIds(booking)
        }
      }
    },

    showBookingDepositMessageSetupAlarm(bookingDeposit) {
      if (bookingDeposit.depositType === options.deposit_type.not_paid_yet) {
        this.$refs.bookingDepositGuideAlarm.show()
      } else if (bookingDeposit.depositType === options.deposit_type.paid) {
        this.$refs.bookingDepositPaymentConfirmationAlarm.show()
      }
    },

    handleDeleteBookingCanceled (booking) {
      this.bookingItem = Booking.build(booking)
      const hasPaidBookingDeposit =
        this.bookingItem?.bookingDeposit?.hasDeposit && this.bookingItem?.bookingDeposit?.hasPayment

      hasPaidBookingDeposit
        ? this.showDialogById(this.modalHasPaidBookingDeposit)
        : this.showDialogById(this.modalConfirmDelete)
    },

    async onDeleteBookingCanceled() {
      try {
        this.preLoader()

        const payload = {
          shopId:           this.shop_data.shop_id,
          bookingId:        this.bookingItem.bookingId,
          deleteDataTimeTS: convertDateToMomentUTC().unix(),
        }

        await deleteBookingCanceled(payload)
        await this.loadBookings()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onCancelBookingSuccess () {
      this.loadBookings()
    },

    initialSearchQueryFromBookingLookupResult() {
      if (this.bookingLookupResult && Object.keys(this.bookingLookupResult).length) {
        this.filter.nameOrMobile = this.bookingLookupResult.searchValue
        // Reset toBookingDateTS to null to search for bookings without any future date limitation
        this.filter.toBookingDateTS = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './booking-list.scss';
</style>
