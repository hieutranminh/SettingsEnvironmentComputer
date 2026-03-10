<template>
  <div
    ref="bookingDepositListRef"
    :class="bookingDepositListClass"
  >
    <booking-deposit-filter
      :value="filter"
      :active-tab="activeTab"
      class="booking-deposit-list__filter"
      @input="handleFilterChange"
    />

    <div class="booking-deposit-list__total">
      <p>{{ $t('booking-deposit.all-record', { total: pagingInfo.totalItems }) }}</p>
    </div>

    <booking-deposit-table
      :items="items"
      :active-tab="activeTab"
      :is-from-sales-total="isFromSalesTotal"
      class="booking-deposit-list__table"
      @cancel-booking="handleBookingCancel"
      @on-client-name-clicked="handleClientNameClicked"
      @edit-booking-deposit="handleBookingDepositEdit"
      @on-cancellation-fee-clicked="handleCancellationFeeClicked"
      @add-booking-deposit-payment="handleBookingDepositPaymentAdd"
      @edit-booking-deposit-payment="handleViewBookingDepositPaymentDetail"
      @delete-cancellation-fee-success="handleDeleteCancellationFeeSuccess"
    />

    <div class="booking-deposit-list__hint">
      <template v-if="activeTab !== 'before-payment'">
        <p v-html="$t('booking-deposit.for-a-refund-click-edit-button-to-the-right-side-of-the-payment-amount')" />
        <p>* {{ $t('booking-deposit.note-cancellation-fee') }}</p>
      </template>

      <template v-else>
        <p>* {{ $t('booking-deposit.note-src') }}</p>
        <p>* {{ $t('booking-deposit.note-hover') }}</p>
      </template>
    </div>

    <pagination
      :pagination="pagination"
      @change-page="handlePageChange"
    />

    <booking-deposit-payment-detail-action
      ref="bookingDepositPaymentDetail"
    />

    <booking-deposit-refund-action
      ref="bookingDepositRefund"
    />

    <booking-deposit-edit-action
      ref="bookingDepositEdit"

      @delete="handleBookingDepositEditDelete"
    />

    <booking-deposit-payment-add-action
      ref="bookingDepositPaymentAdd"
      @send-message="handleSendBookingMessage"
      @booking-deposit-update="handleBookingDepositUpdate"
    />

    <booking-deposit-payment-edit-action
      ref="bookingDepositPaymentEdit"
      @delete="handleBookingDepositPaymentDelete"
      @send-message="handleSendDepositPaymentConfirmMessage"
    />

    <client-connectable-action
      ref="clientConnectable"
    />

    <cancel-booking-action
      ref="bookingCancel"
      :is-multiple-resource="isBookingMultipleResource"
    />

    <report-print-preview-with-worker-modal
      :is-error="isWorkerErrorMixin"
      :pdf-blob-url="pdfBlobUrlMixin"
      :is-processing="!isWorkerDoneMixin"
      :modal-id="reportPrintPreviewModal"
      :percentage="progressPercentageMixin"
      :is-landscape="isLandscapePrintContentMixin"

      @hide="onHidePreviewModalMixin"
      @on-click-retry="handlePrint"
      @on-click-save-as-pdf="onClickSaveAsPdfMixin(tableHeaderText)"
      @on-click-save-as-excel="onClickSaveAsExcelMixin(tableHeaderText)"
    />

    <client-information-modal
      :client-id="clientInfoId"
      :visible="clientInformationModalShow"

      @hidden="clientInformationModalShow = false"
    />

    <sales-detail
      ref="salesDetail"
      @sales-deleted="onDeletedSales"
      @show-edit-cancellation-staff-only="setShowEditCancellationFeeSaleStaffOnly(true)"
    />

    <!-- Modal - Tab Sales History - Edit cancellation fee sale staff only -->
    <edit-cancellation-fee-sale-staff-only
      :visible="isShowEditCancellationFeeSaleStaffOnly"
      @edit-cancellation-fee-sale-staff-only-success="onEditedSales"
    />
  </div>
</template>

<script>
// Utilities
import i18n from 'Translate'
import {mapActions, mapMutations, mapState} from 'vuex'
import { formatTSToUTCDate } from 'DatetimeHelpers'
import { convertDateToTimezone, convertDateToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import Pagination from 'CommonComponents/pagination/pagination.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ReportPrintPreviewWithWorkerModal from 'Components/common/report-print-preview-with-worker-modal/report-print-preview-with-worker-modal.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import PrintPreviewMixin from 'Mixins/print-preview-mixin.js'
import ClientCacheMixin from 'Modules/cache/mixins/client_cache'

// Booking deposit Copmponents
import BookingDepositTable from 'Modules/calendar/components/calendar/calendar-booking-deposit-list/components/booking-deposit-table/booking-deposit-table.vue'
import BookingDepositFilter from 'Modules/calendar/components/calendar/calendar-booking-deposit-list/components/booking-deposit-filter/booking-deposit-filter.vue'

// Apis
import * as bookingApi from 'Modules/api/booking/booking-api'
import * as bookingDepositApi from 'Modules/api/booking/booking-deposit-list-api'

// Models
import Booking from 'Models/booking/booking'
import BookingDeposit from 'Models/booking/bookingDeposit'

// Constant
import { options } from 'OptionsHelpers'
import { SEARCH_DATE_TYPE, STANDARD_DATE_FORMAT, PRINT_PREVIEW_WORKER_ACTION_TYPES } from 'Constant'

export default {
  components: {
    AButton,
    Pagination,
    BookingDepositTable,
    BookingDepositFilter,
    ReportPrintPreviewWithWorkerModal,

    SalesDetail:                       () => import('Modules/calendar/components/sales-detail/sales-detail.vue'),
    ClientInformationModal:            () => import('Components/clients/client-information/client-information-modal.vue'),
    CancelBookingAction:               () => import('Modules/calendar/components/cancel-booking-action/cancel-booking-action.vue'),
    ClientConnectableAction:           () => import('Modules/clients/components/client-connectable-action/client-connectable-action.vue'),
    EditCancellationFeeSaleStaffOnly:  () => import('Components/bookings/bookings/edit-cancellation-fee-sale-staff-only/edit-cancellation-fee-sale-staff-only.vue'),
    BookingDepositEditAction:          () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-edit-action/booking-deposit-edit-action.vue'),
    BookingDepositRefundAction:        () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-refund-action/booking-deposit-refund-action.vue'),
    BookingDepositPaymentAddAction:    () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-add-action/booking-deposit-payment-add-action.vue'),
    BookingDepositPaymentEditAction:   () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-edit-action/booking-deposit-payment-edit-action.vue'),
    BookingDepositPaymentDetailAction: () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-detail-action/booking-deposit-payment-detail-action.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    ClientCacheMixin,
    PrintPreviewMixin('bookingDepositListRef'),
  ],

  props: {
    toDateTs: {
      default: 0,
      type:    Number,
    },

    fromDateTs: {
      default: 0,
      type:    Number,
    },

    includeNaverPrepayment: {
      type:    Boolean,
      default: false,
    },

    searchType: {
      type:    Number,
      default: SEARCH_DATE_TYPE.PAYMENT_DATE,
    },

    activeTab: {
      type:    String,
      default: '',
    },

    isFromSalesTotal: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    const now = convertDateToTimezone()

    return {
      filter: {
        typeDate:               2,
        pageNumber:             1,
        nameOrMobile:           '',
        includeCanceled:        false,
        includeNaverPrepayment: false,
        searchDateType:         this.searchType,
        pageSize:               options.pagination.default,
        fromDateTS:             convertDateToMomentUTC(now).startOf('day').unix(),
        toDateTS:               convertDateToMomentUTC(now).add(1, 'month').subtract(1, 'day').endOf('day').unix(),
      },

      printFilter: {},

      items:      [],
      pagingInfo: {
        pageSize:   0,
        pageNumber: 1,
        totalItems: 0,
      },

      clientInfoId:               0,
      clientInformationModalShow: false,
      currentBookingDeposit:      {},
      isBookingMultipleResource:  false,
    }
  },

  computed: {
    ...mapState('authentication', [
      'shop',
    ]),

    ...mapState('sales', [
      'isShowEditCancellationFeeSaleStaffOnly',
    ]),

    reportHeaderTextForDateRange() {
      return [
        this.tableHeaderText,
        this.dateRangePrintText,
      ]
    },

    tableHeaderText() {
      return this.$t('booking-deposit.payment-history')
    },

    dateRangePrintText() {
      const fromDate = formatTSToUTCDate(this.filter?.fromDateTS, STANDARD_DATE_FORMAT.YMD)
      const toDate = formatTSToUTCDate(this.filter?.toDateTS, STANDARD_DATE_FORMAT.YMD)

      return `${fromDate} - ${toDate}`
    },

    reportHeaderTextForDate() {
      return [
        this.tableHeaderText,
        this.datePrintText,
      ]
    },

    datePrintText() {
      return formatTSToUTCDate(this.filter?.fromDateTS, STANDARD_DATE_FORMAT.YMD)
    },

    reportPrintPreviewModal() {
      return 'report-print-preview-booking-deposit-modal'
    },

    pagination() {
      return {
        page_size:   this.pagingInfo.pageSize,
        page_number: this.pagingInfo.pageNumber,
        total_items: this.pagingInfo.totalItems,
        total_pages: Math.ceil(this.pagingInfo.totalItems / this.pagingInfo.pageSize),
      }
    },

    propsFilter() {
      return {
        toDateTS:               this.toDateTs,
        fromDateTS:             this.fromDateTs,
        includeNaverPrepayment: this.includeNaverPrepayment,
      }
    },

    bookingDepositListClass() {
      return ['booking-deposit-list', {
        'booking-deposit-list--mobile': this.isMobileDevice,
      }]
    },
  },

  watch: {
    propsFilter: {
      deep:      true,
      immediate: true,
      handler(propsFilter) {
        this.filter.toDateTS = propsFilter.toDateTS
        this.filter.fromDateTS = propsFilter.fromDateTS
        this.filter.includeNaverPrepayment = propsFilter.includeNaverPrepayment
      },
    },
  },

  created() {
    this.loadBookingDeposit()
  },

  mounted() {
    this.$bus.on('on-print-deposit', this.handlePrint)
    this.$bus.on('cancel-booking-deposit-success', this.loadBookingDeposit)
    this.$bus.on('add-cancellation-fee-sale-success', this.loadBookingDeposit)
  },

  beforeDestroy() {
    this.$bus.off('on-print-deposit', this.handlePrint)
    this.$bus.off('cancel-booking-deposit-success', this.loadBookingDeposit)
    this.$bus.off('add-cancellation-fee-sale-success', this.loadBookingDeposit)
  },

  methods: {
    ...mapActions('_calendar/bookings', [
      'cancelBooking',
      'connectClient',
      'cancelNaverBooking',
      'updateBookingDeposit',
      'deleteBookingDeposit',
      'addBookingDepositPayment',
      'updateBookingDepositPayment',
      'deleteBookingDepositPayment',
      'addBookingDepositPaymentRefund',
      'updateBookingDepositPaymentRefund',
      'deleteBookingDepositPaymentRefund',
    ]),

    ...mapActions('_calendar/sendMessageAction', [
      'sendBookingMessage',
      'sendAddedBookingMessage',
      'sendDepositPaymentConfirmMessage',
    ]),

    ...mapMutations('sales',[
      'setClientShopIdUsingSales',
      'setShowEditCancellationFeeSaleStaffOnly',
    ]),

    async loadBookingDeposit() {
      try {
        this.preLoader()

        const response = await bookingDepositApi.getBookingDepositList({
          ...this.filter,
          shopId: this.shop.shop_id,
        })

        this.items = response?.data?.result?.items ?? []
        this.pagingInfo = response?.data?.result?.pagingInfo ?? {}
        this.printFilter = {
          ...this.filter,
          shopId:     this.shop_data.shop_id,
          totalItems: this.pagingInfo.totalItems,
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleFilterChange(filter) {
      this.filter = {
        ...this.filter,
        ...filter,

        pageNumber: 1,
      }

      this.loadBookingDeposit()

      this.$emit('filter-change', {
        typeDate:               this.filter.typeDate,
        toDateTS:               this.filter.toDateTS,
        fromDateTS:             this.filter.fromDateTS,
        includeNaverPrepayment: this.filter.includeNaverPrepayment,
        activeFilteredTab:      this.activeTab,
      })
    },

    handlePageChange(pageNumber) {
      this.filter = {
        ...this.filter,
        pageNumber,
      }
      this.loadBookingDeposit()
    },

    async handleBookingDepositEdit(data) {
      /**@type {Booking} */
      const booking = Booking.build(data)
      const bookingDeposit = booking.bookingDeposit ?? new BookingDeposit()

      this.$refs.bookingDepositEdit.show({ bookingDeposit })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.preLoader()

          await this.updateBookingDeposit({
            bookingDeposit: changedBookingDeposit,
          })

          this.loadBookingDeposit()
          this.$refs.bookingDepositEdit.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })

    },

    async handleBookingDepositUpdate(bookingDeposit) {
      try {
        this.preLoader()

        await this.updateBookingDeposit({
          bookingDeposit,
        })

        this.loadBookingDeposit()
        this.$refs.bookingDepositPaymentAdd.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**@param {Booking} data */
    async handleSendBookingMessage(data) {
      try {
        this.preLoader()

        const booking = await this.getBookingDetail(data.bookingId)

        await this.sendBookingMessage({ booking })

        this.$refs.bookingDepositPaymentAdd.hide()
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

          this.loadBookingDeposit()
          this.$refs.bookingDepositPaymentAdd.hide()
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

      this.$refs.bookingDepositPaymentEdit.showFromBooking({ booking })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.preLoader()

          await this.updateBookingDepositPayment({
            bookingDeposit: changedBookingDeposit,
          })

          this.loadBookingDeposit()

          this.$refs.bookingDepositPaymentEdit.hide()
          this.$refs.bookingDepositPaymentDetail.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async handleBookingDepositPaymentDelete(bookingDeposit) {
      try {
        this.preLoader()
        await this.deleteBookingDepositPayment({ bookingDeposit })

        this.loadBookingDeposit()

        this.$refs.bookingDepositPaymentEdit.hide()
        this.$refs.bookingDepositPaymentDetail.hide()

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingDepositEditDelete(bookingDeposit) {
      try {
        this.preLoader()
        await this.deleteBookingDeposit({ bookingDeposit })
        this.loadBookingDeposit()

        this.$refs.bookingDepositEdit.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**@param {Booking} booking */
    handleBookingDepositRefundAdd(booking) {
      this.$refs.bookingDepositRefund.show({
        bookingDeposit: booking.bookingDeposit,
      })(async (event, { bookingDeposit }) => {
        try {
          this.preLoader()

          await this.addBookingDepositPaymentRefund({ bookingDeposit })

          this.$refs.bookingDepositRefund.hide()
          this.$refs.bookingDepositPaymentDetail.hide()

          await this.loadBookingDeposit()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async handleViewBookingDepositPaymentDetail(data) {
      /**@type {Booking} */
      const booking = Booking.build(data)

      /**@type {BookingDeposit} */
      const bookingDespoit = booking.bookingDeposit
      const bookingDepositPayment = bookingDespoit?.bookingDepositPayment
      const bookingDepositPaymentRefund = bookingDepositPayment?.bookingDepositPaymentRefund

      const hasBookingDepositPaymentRefund = bookingDepositPaymentRefund.status === options.booking_deposit_status.exist

      if (hasBookingDepositPaymentRefund) {
        this.handleBookingDepositRefundEdit(booking)
        return
      }

      this.$refs.bookingDepositPaymentDetail.showFromBooking({ booking })((event) => {
        if (event === 'edit-payment-click') {
          this.handleBookingDepositPaymentEdit(data)
        } else if (event === 'send-message-click') {
          this.handleSendDepositPaymentConfirmMessage(data)
        } else if (event === 'add-refund-click') {
          this.handleBookingDepositRefundAdd(booking)
        }
      })
    },

    /**@param {Booking} data */
    async handleSendDepositPaymentConfirmMessage(data) {
      try {
        this.preLoader()

        const booking = await this.getBookingDetail(data.bookingId)

        await this.sendDepositPaymentConfirmMessage({ booking })

        this.$refs.bookingDepositPaymentDetail.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
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

          this.$refs.bookingDepositRefund.hide()

          await this.loadBookingDeposit()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    handleDeleteCancellationFeeSuccess(booking) {
      this.items = this.items.map(item => {
        if (item.bookingId === booking.bookingId) {
          item.cancellationFee = null
        }

        return item
      })

      console.log('handleDeleteCancellationFeeSuccess', booking)
    },

    async getBookingDetail(bookingId) {
      try {
        this.preLoader(true)

        const response = await bookingApi.getBookingLive({
          bookingId,
          shopId: this.shop_data.shop_id,
        })

        return Booking.build(response?.data?.result)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingCancel(data) {
      if (!data.bookingId) return

      const booking = await this.getBookingDetail(data?.bookingId)
      this.isBookingMultipleResource = booking.bookedResources.length > 1
      if (!booking) return

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

          this.$refs.bookingCancel.hide()

          await this.loadBookingDeposit()
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
      if (!data.bookingId) return

      if(data?.clientId > 0) {
        this.clientInfoId = data.clientId
        this.setClientShopIdUsingSales(data.clientShopId)
        this.$nextTick(() => {
          this.clientInformationModalShow = true
        })
      }

      else {
        this.$refs.clientConnectable.show({
          clientName:         data.clientName,
          clientMobileNumber: data.clientMobileNumber,
        })(async (connectClient) => {
          try {
            if (!connectClient) return

            await this.connectClient({
              client:    connectClient,
              bookingId: data.bookingId,
            })

            await this.loadBookingDeposit()

            this.$refs.clientConnectable.hide()
          } catch (error) {
            this._showDialogAlert(error.message)
          } finally {
            this.preLoader(false)
          }
        })
      }
    },

    handleCancellationFeeClicked (data) {
      this.currentBookingDeposit = data

      this.$refs.salesDetail.showFromBooking({
        shopId:       data.shopId,
        bookingId:    data.bookingId,
        clientShopId: data.clientShopId,
      })
    },

    async handlePrint() {
      const clientSetup = await this.$clientCacheMixin_getClientShopInfo({
        shopId: this.shop_data.shop_id,
      })

      if(this.isNullObject(clientSetup)) {
        this.showMissingClientsSetupAlert()
        return
      }

      this.showDialogById(this.reportPrintPreviewModal)
      this.postMessageToPrintPreviewWorkerMixin({
        reportHeaders: this.filter.typeDate === options.type_date.date
          ? this.reportHeaderTextForDate
          : this.reportHeaderTextForDateRange,
        additionalOptions: {
          userInfo:    this.x_user,
          shopInfo:    this.shop_data,
          clientSetup: clientSetup,
        },
        requestPayload: this.printFilter,
        workerType:     PRINT_PREVIEW_WORKER_ACTION_TYPES.BOOKING_DEPOSIT_PAYMENT_HISTORY,
      })
    },

    onEditedSales() {
      this.$refs.salesDetail.isSalesDetailShown = false
    },

    onDeletedSales(isDeleteError) {
      this.$refs.salesDetail.isSalesDetailShown = false
      !isDeleteError && this.handleDeleteCancellationFeeSuccess(this.currentBookingDeposit)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./booking-deposit-payment-history.scss";
</style>
