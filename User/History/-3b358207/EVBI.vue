<template>
  <div
    id="calendar"
    :class="calendarClass"
  >
    <div class="calendar__container">
      <calendar-accessible-panel class="calendar__accessible-panel" />
      <calendar-setup class="calendar__setup" />

      <!-- <calendar-dates-list v-if="isMobileDevice" class="calendar__dates-list" /> -->

      <calendar-content class="calendar__content">
        <template
          v-if="!isMobileDevice"
          #sidebar
        >
          <calendar-sidebar class="calendar__sidebar">
            <template
              v-if="isCalendarReady"
              #date-picker
            >
              <calendar-date-picker />
            </template>

            <template
              v-if="!hideWaiting"
              #waitings
            >
              <calendar-waitings />
            </template>
          </calendar-sidebar>
        </template>

        <template
          v-if="isCalendarReady"
          #schedule
        >
          <calendar-schedule ref="calendar" />
        </template>
      </calendar-content>
    </div>

    <template v-if="isCalendarReady">
      <booking-action
        :visible="bookingActionVisible"
        @hidden="handleBookingActionHidden"
        @booking-added="handleBookingAdded"
      />

      <booking-description-action v-if="isMobileDevice" />

      <calendar-waiting-list
        v-if="isWaitingListModalVisible && !hideWaiting"
        :visible="isWaitingListModalVisible"
        @hidden="handleCalendarWaitingListHiden"
      />

      <calendar-booking-list
        v-if="isBookingListModalVisible"
        ref="calendarBookingList"
        :visible="isBookingListModalVisible"
        @hidden="handleCalendarBookingListHiden"
      />

      <calendar-booking-deposit-list
        v-if="isBookingDepositListModalVisible"
        :visible="isBookingDepositListModalVisible"
        @hidden="handleCalendarBookingDepositListHiden"
      />

      <waiting-action
        v-if="!hideWaiting"
        :visible="waitingActionVisible"
        @hidden="handleWaitingActionHidden"
        @waiting-added="handleWaitingAdded"
        @waiting-updated="handleWaitingUpdated"
      />

      <checkout-action
        @checked-out="handleBookingCheckedOut"
        @draft-document-added="handleDraftDocumentAdded"
        @draft-document-deleted="handleDraftDocumentDeleted"
      />

      <booking-deposit-action
        ref="bookingDepositAdd"
      />

      <booking-deposit-payment-add-action
        ref="bookingDepositPaymentAdd"
        @send-message="handleSendBookingMessage"
        @booking-deposit-update="handleBookingDepositUpdate"
      />

      <booking-deposit-payment-detail-action
        ref="bookingDepositPaymentDetail"
      />

      <booking-deposit-payment-edit-action
        ref="bookingDepositPaymentEdit"
        @delete="handleBookingDepositPaymentEditDelete"
      />

      <booking-deposit-refund-action
        ref="bookingDepositRefund"
      />

      <blocked-time-action
        ref="blockedTimeAction"
        @added="handleBlockedTimeAdded"
        @updated="handleBlockedTimeUpdated"
      />

      <client-connectable-action
        ref="clientConnectable"
      />

      <cancel-booking-action
        ref="bookingCancel"
      />

      <sales-detail
        ref="salesDetail"
        :is-from-calendar="true"
        @sales-edited="handleCheckoutSalesEdited"
        @show-add-payment="isAddPaymentShown = true"
        @show-edit-cancellation-staff-only="setShowEditCancellationFeeSaleStaffOnlyFromCalendar(true)"
      />

      <checkout-success-modal
        ref="checkoutSuccessModal"
      />

      <send-message-action
        ref="sendMessageAction"
      />

      <no-show-booking-action
        ref="noShowBooking"
      />

      <client-information-action
        ref="clientInformationAction"
        :is-show-group-button="isBookingAdding"
        :is-note-editable="isBookingAdding"
        :is-client-editable="isBookingAdding"
        :is-family-editable="isBookingAdding"
        :is-consent-formable="isBookingAdding"

        @update-notes="handleUpdatedNote"
        @update-client="handleUpdatedClient"
        @delete-client="handleDeletedClient"
        @update-client-family="handleUpdatedClientFamily"
      />

      <booking-deposit-guide-alarm
        ref="bookingDepositGuideAlarm"
      />

      <booking-deposit-payment-confirmation-alarm
        ref="bookingDepositPaymentConfirmationAlarm"
      />

      <booking-deposit-setup-alarm
        ref="bookingDepositSetupAlarm"
      />

      <cancel-booking-deposit-paid :visible="isShowCancelBookingDepositPaid" />

      <booking-deposit-edit-action
        :value="bookingDeposit"
        :visible="isBookingDepositEditVisible"

        @input="handleBookingDepositUpdate"
        @delete="handleBookingDepositEditDelete"
        @hidden="isBookingDepositEditVisible = false"
        @cancel="isBookingDepositEditVisible = false"
      />

      <!-- Checked out booking - Sales detail - Add payment -->
      <sales-payment-action
        :visible="isAddPaymentShown"
        @hidden="isAddPaymentShown = false"
        @hide-add-payment="isAddPaymentShown = false"
        @added-sales-payment="handleSalesPaymentAdded"
      />

      <!-- Modal - Select sales assignment -->
      <select-sales-assignment :visible="isShowSelectSalesAssignment" />

      <!-- Modal - Search visitor and add sales -->
      <search-visitor-actions :visible="isShowSearchVisitorActions" />

      <!-- Modal - Tab Sales History - Edit cancellation fee sale staff only -->
      <edit-cancellation-fee-sale-staff-only
        :visible="isShowEditCancellationFeeSaleStaffOnlyFromCalendar"
        @edit-cancellation-fee-sale-staff-only-success="onEditedSales"
      />

      <!-- Modal - Work Calendar -->
      <modal-work-calendar
        ref="workCalendarModal"
        :visible="isWorkCalendarModalVisible"
        @cancel="handleCloseWorkCalendar"
      />
    </template>
    <alert-confirm
      :id="alertExceedMaxCalendarColsId"
      :hide_yes="alert_hide_yes"
      :label_no="alert_label_no"
      :data_alerts="alert_exceed_max_calendar_cols_data"

      @cancel="handleCancelAlertExceedMaxCalendarCols"
    />

    <notes-action
      ref="notesActionRef"
      :is-small-note="true"
      :is-max-big-notes="true"
      :is-show-save-button="true"
      :modal-title-text="$t('bookings.notes')"
      @submit="handleUpdateBookingNote"
    />
  </div>
</template>

<script>
// Utilities
import moment from 'moment'
import i18n from 'Translate'
import store from 'VuexStore'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { CalendarEventBus, convertTimestampToMomentUTC, getLatestFinishTimeInfo, calculateCustomizeSelectedTodayDay } from 'Modules/calendar/utils/index'
import { getShopId, convertDateToTimeStamp, getVibilityChangeConfigure, convertTimeStampToDate, getStartAndFinishTime, isExceedMaxCalendarCols } from 'CommonHelpers'

// Apis
import { getSidebarNotes, updateSidebarNotes } from 'Modules/api/booking/waiting-api.js'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import localStorageEventMixin from 'Mixins/localStorageEventMixin'
import NaverBookingMixin from 'Modules/calendar/mixins/naver_booking'
import CalendarViewMixin from 'Modules/calendar/mixins/calendar-view'
import CancellationFeeMixin from 'Modules/calendar/mixins/cancellation-fee'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Calendar Components
import NotesAction from 'Components//bookings/notes-action/notes-action.vue'
import BookingAction from 'Modules/calendar/components/booking-action/booking-action.vue'
import WaitingAction from 'Modules/calendar/components/waiting-action/waiting-action.vue'
import CalendarSetup from 'Modules/calendar/components/calendar/calendar-setup/calendar-setup.vue'
import CalendarContent from 'Modules/calendar/components/calendar/calendar-content/calendar-content.vue'
import CalendarSchedule from 'Modules/calendar/components/calendar/calendar-schedule/calendar-schedule.vue'

// Models
// eslint-disable-next-line no-unused-vars
import Booking from 'Models/booking/booking'
import BlockedTime from 'Models/blockedTime/blockedTime'
import BookingDeposit from 'Models/booking/bookingDeposit'

// Constant
import { options } from 'OptionsHelpers'
import {
  BOOKING_STATUS,
  NOTIFICATON_TYPE,
  CELL_HEIGHT_SETTING_NAME,
  CELL_HEIGHT_SETTING_DEFAULT,
  NUMBER_OF_DAYS_VIEW_ALL_SETTING_NAME,
} from 'Constant'
import SalesDraftDocumentApi from 'API/sales/draft-document-api'

// const SELECTED_ALL_VALUE = 0
const SELECTED_ALL_VALUE = -1
const SELECTED_EXCLUDE_OFF_VALUE = -2
const MILISECOND_UNIT = 1000
const NAVER_STATE_LINK = 1
const checkedOutStatuses = [
  BOOKING_STATUS.CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_CHECKED_OUT,
  BOOKING_STATUS.EXTERNAL_AUTO_CHECKED_OUT,
]

export default {
  components: {
    NotesAction,
    BookingAction,
    WaitingAction,
    CalendarSetup,
    CalendarContent,
    CalendarSchedule,

    // Test
    // ClientAction: () => import('Modules/clients/components/client-action/client-action.vue'),
    AlertConfirm:                           () => import('CommonComponents/alert/alert-confirm.vue'),
    SalesDetail:                            () => import('Modules/calendar/components/sales-detail/sales-detail.vue'),
    CheckoutAction:                         () => import('Modules/calendar/components/checkout-action/checkout-action.vue'),
    SalesPaymentAction:                     () => import('Components/sales/sales-payment-action/sales-payment-action.vue'),
    ModalWorkCalendar:                      () => import('Modules/calendar/components/work-calendar/modal-work-calendar.vue'),
    BlockedTimeAction:                      () => import('Modules/calendar/components/blocked-time-action/blocked-time-action.vue'),
    SendMessageAction:                      () => import('Modules/calendar/components/send-message-action/send-message-action.vue'),
    CalendarSidebar:                        () => import('Modules/calendar/components/calendar/calendar-sidebar/calendar-sidebar.vue'),
    CalendarWaitings:                       () => import('Modules/calendar/components/calendar/calendar-waitings/calendar-waitings.vue'),
    CancelBookingAction:                    () => import('Modules/calendar/components/cancel-booking-action/cancel-booking-action.vue'),
    NoShowBookingAction:                    () => import('Modules/calendar/components/no-show-booking-action/no-show-booking-action.vue'),
    BookingDepositAction:                   () => import('Modules/calendar/components/booking-deposit-action/booking-deposit-action.vue'),
    CalendarDatesList:                      () => import('Modules/calendar/components/calendar/calendar-dates-list/calendar-dates-list.vue'),
    CheckoutSuccessModal:                   () => import('Modules/calendar/components/checkout-success-modal/checkout-success-modal.vue'),
    SearchVisitorActions:                   () => import('Modules/bookings/components/search-visitor-actions/search-visitor-actions.vue'),
    CalendarDatePicker:                     () => import('Modules/calendar/components/calendar/calendar-date-picker/calendar-date-picker.vue'),
    SelectSalesAssignment:                  () => import('Modules/bookings/components/select-sales-assignment/select-sales-assignment.vue'),
    CalendarBookingList:                    () => import('Modules/calendar/components/calendar/calendar-booking-list/calendar-booking-list.vue'),
    CalendarWaitingList:                    () => import('Modules/calendar/components/calendar/calendar-waiting-list/calendar-waiting-list.vue'),
    ClientConnectableAction:                () => import('Modules/clients/components/client-connectable-action/client-connectable-action.vue'),
    BookingDescriptionAction:               () => import('Modules/calendar/components/booking-description-action/booking-description-action.vue'),
    BookingDepositSetupAlarm:               () => import('Modules/calendar/components/booking-deposit-setup-alarm/booking-deposit-setup-alarm.vue'),
    CancelBookingDepositPaid:               () => import('Modules/bookings/components/cancel-booking-deposit-paid/cancel-booking-deposit-paid.vue'),
    CalendarAccessiblePanel:                () => import('Modules/calendar/components/calendar/calendar-accessible-panel/calendar-accessible-panel.vue'),
    ClientInformationAction:                () => import('Modules/clients/components/client-information-action/client-information-action.vue'),
    CalendarBookingDepositList:             () => import('Modules/calendar/components/calendar/calendar-booking-deposit-list/calendar-booking-deposit-list.vue'),
    EditCancellationFeeSaleStaffOnly:       () => import('Components/bookings/bookings/edit-cancellation-fee-sale-staff-only/edit-cancellation-fee-sale-staff-only.vue'),
    BookingDepositGuideAlarm:               () => import('Modules/calendar/components/send-message-action/components/booking-deposit-guide-alarm/booking-deposit-guide-alarm.vue'),
    BookingDepositEditAction:               () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-edit-action/booking-deposit-edit-action.vue'),
    BookingDepositRefundAction:             () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-refund-action/booking-deposit-refund-action.vue'),
    BookingDepositPaymentAddAction:         () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-add-action/booking-deposit-payment-add-action.vue'),
    BookingDepositPaymentEditAction:        () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-edit-action/booking-deposit-payment-edit-action.vue'),
    BookingDepositPaymentDetailAction:      () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-detail-action/booking-deposit-payment-detail-action.vue'),
    BookingDepositPaymentConfirmationAlarm: () => import('Modules/calendar/components/send-message-action/components/booking-deposit-payment-confirmation-alarm/booking-deposit-payment-confirmation-alarm.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    SalesCacheMixin,
    BookingCacheMixin,
    NaverBookingMixin,
    CalendarViewMixin,
    CancellationFeeMixin,
    localStorageEventMixin,
  ],

  data() {
    return {
      isCalendarReady: false,

      // Waitings
      isWaitingListModalVisible: false,

      // Bookings
      isBookingListModalVisible: false,

      // Booking deposit
      isBookingDepositListModalVisible: false,

      isWorkCalendarModalVisible: false,

      openingHours: [],

      hideWaiting:        (localStorage.getItem('hideWaiting') == 'true'),
      isMoveNaverBooking: false,
      naverMoveBooking:   null,

      isBookingDepositEditVisible: false,
      bookingDeposit:              new BookingDeposit(),
      isAddPaymentShown:           false,

      alert_hide_yes:                      true,
      alert_exceed_max_calendar_cols_data: [],
      notes:                               '',
    }
  },

  computed: {
    ...mapState('authentication', [
      'user',
    ]),

    ...mapGetters('signalR', {
      isSignalRConnectionDisconnected: 'isDisconnected',
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
      'isShowCancelBookingDepositPaid',
      'isSyncBookingWhenDeleteSales',
    ]),

    ...mapState('_calendar/bookingAction', {
      bookingActionVisible: 'visible',
      booking:              'booking',
    }),

    ...mapState('_calendar/waitingAction', {
      waitingActionVisible: 'visible',
    }),

    ...mapState('sales', [
      'isShowEditCancellationFeeSaleStaffOnlyFromCalendar',
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

    isBookingAdding() {
      return !this.booking.bookingId
    },

    alert_label_no(){return this.$t('general.close')},

    exceed_max_calendar_cols(){return this.$t('bookings.exceed-max-calendar-cols')},

    alertExceedMaxCalendarColsId() {
      return 'alert-exceed-max-calendar-cols-modal'
    },

    calendarClass() {
      return ['calendar', {
        'calendar--mobile': this.isMobileDevice,
      }]
    },

    visibilityState() {
      return getVibilityChangeConfigure()
    },

    IsClientShopIdNotBelongCurrentShop() {
      const clientShopId = parseInt(this.$route.query.clientShopId)
      return this.$route.query.clientShopId && (clientShopId !== this.shop_data.shop_id)
    },

    isChainIdDifferentShop() {
      const chainId = parseInt(this.$route.query.chainId)
      return this.$route.query.chainId && ((chainId !== this.shop_data.chain_id) || chainId === 0)
    },

    numberOfDaysViewAllLocalStorage () {
      let listNumberOfDaysViewAllStorage = []
      try {
        listNumberOfDaysViewAllStorage = JSON.parse(localStorage.getItem(NUMBER_OF_DAYS_VIEW_ALL_SETTING_NAME)) || []
      } catch(error) {
        throw error
      }
      const shopExistingInViewAllLocalStorage = listNumberOfDaysViewAllStorage.find(item => item.shop_id === this.shop_data.shop_id)

      if (shopExistingInViewAllLocalStorage) {
        return shopExistingInViewAllLocalStorage.value
      }
      return shopExistingInViewAllLocalStorage
    },
  },

  watch: {
    isCalendarReady: {
      immediate: true,
      handler(isCalendarReady) {
        if (isCalendarReady) {
          this.$nextTick(() => {
            this.setCalendarRef(this.$refs.calendar.$el)
          })
        }
      },
    },
    schedule() {
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

      // SET TODAY DATE:
      const endTimeMinute = getStartAndFinishTime([...openingHoursConvert])
      const { finishTime: finalFinishTime, crossDate } = getLatestFinishTimeInfo({ openingHoursConvert, crossDate: startEndFinishTime.crossDate, finishTime: endTimeMinute.finishTime }, this.bookingResources)

      const calcToday = calculateCustomizeSelectedTodayDay(finalFinishTime, crossDate)
      this.setToday(calcToday)
    },
    // Detect when change date from URL based on _key
    '$route.query._key'(newDateTS, oldDateTS) {
      if (newDateTS !== oldDateTS) {
        if(this.$route.query && this.$route.query.dateTS) {
          const recentBookingDate = parseInt(this.$route.query.dateTS)
          const momentUTC = convertTimestampToMomentUTC(recentBookingDate)
          this.setSelectedDate(momentUTC)
        }
      }
    },
  },
  async created() {
    if(this.IsClientShopIdNotBelongCurrentShop && this.isChainIdDifferentShop) {
      this._showDialogAlert(this.$t('general.alert-booking-different-chain'))
      return
    }
    try {
      this.preLoader()
      const bookingEntries = Object.entries(this.bookingSet).map(([key, value]) => ({ [key]: value }))
      bookingEntries.forEach(booking => {
        const bookingId = Object.keys(booking)[0]
        const bookingData = booking[bookingId]
        store.commit(`_calendar/bookings/${bookingData.bookingDateTS}_${bookingData.bookedResources[0].bookingResourceSetupId}/setItems`, [])
      })

      await this.loadCalendarSetup(true)
      await this.loadResourceSettings()
      this.$bookingCacheMixin_getBookingDepositDefaultSetup({ shopId: this.shop_data.shop_id })
      this.$salesCacheMixin_getAllSalesSetup({ shopId: this.shop_data.shop_id })
      if(isExceedMaxCalendarCols(this.numberOfDaysViewAllLocalStorage, this.bookingResources.length)) {
        this.showAlertExceedMaxCalendarCols()
      }
      // change caller window ahacall app
      if(this.$route.query && this.$route.query.dateTS) {
        const recentBookingDate = parseInt(this.$route.query.dateTS)
        const momentUTC = convertTimestampToMomentUTC(recentBookingDate)
        this.setSelectedDate(momentUTC)

      } else {
        // Init Date when Route page
        if (!this.isMoveNaverBooking) {
          this.setSelectedDate(this.today)
          // this.setSelectedDate(convertDateToMomentUTC(convertDateToTimezone(new Date())).startOf('day'))
        } else {
          this.setSelectedDate(moment.utc(this.naverMoveBooking.bookingDateTimeTS * MILISECOND_UNIT).startOf('day'))
          this.$nextTick(() => {
            if (this.isMoveNaverBooking) {
              if (this.$refs.calendar) {
                this.$refs.calendar.handleViewBookingOnCalendar({ data: this.naverMoveBooking, type: 'naver-list' })
              }
            }
          })
        }
      }

      if(this.allCalendarSetup.booking_naver_link_setup.state === NAVER_STATE_LINK) {
        this.loadResourceNaverLink()
      }

      this.loadBookingCalendar()
      this.setIsMenuShown(false) // auto hide menu pc when load page
      this.isCalendarReady = true
      this.registerSignalREvents()
    } catch(error) {
      this._showDialogAlert(error.message)
    } finally {
      this.preLoader(false)
    }
  },

  async mounted() {
    this.calculatedCalendarCellHeight()
    this.cancelCalendarSlotAccessible()

    CalendarEventBus.$on('add-blocked-time-context', this.handleBlockedTimeAdded)
    CalendarEventBus.$on('cancel-booking', this.handleCancelBooking)
    CalendarEventBus.$on('no-show-booking', this.handleNoShowBooking)

    CalendarEventBus.$on('add-blocked-time', this.handleAddBlockedTime)
    CalendarEventBus.$on('edit-blocked-time', this.handleEditBlockedTime)

    CalendarEventBus.$on('booking-deposit-click', this.handleBookingDepositClick)

    CalendarEventBus.$on('open-waiting-list', this.handleOpenWaitingList)
    CalendarEventBus.$on('open-booking-list', this.handleOpenBookingList)
    CalendarEventBus.$on('open-booking-deposit-list', this.handleOpenBookingDepositList)
    CalendarEventBus.$on('open-work-calendar', this.handleOpenWorkCalendar)
    CalendarEventBus.$on('open-notes', this.handleOpenNotes)
    CalendarEventBus.$on('on-close-booking-deposit-list', this.handleCalendarBookingDepositListHiden)

    CalendarEventBus.$on('view-sales-detail', this.handleViewSalesDetail)
    CalendarEventBus.$on('view-client-information', this.handleViewClientInformation)
    CalendarEventBus.$on('view-client-information-action', this.handleViewClientInformationAction)

    CalendarEventBus.$on('sales-draft-click', this.handleOpenSalesDraft)
    CalendarEventBus.$on('sales-draft-click-from-list', this.handleOpenSalesDraftFromList)
    CalendarEventBus.$on('load-booking-calendar', this.loadBookingCalendar)
    CalendarEventBus.$on('add-booking-deposit', this.handleBookingDepositAdd)
    CalendarEventBus.$on('load-calendar-setup', this.handleEventLoadCalendarSetup)
    CalendarEventBus.$on('click-move-naver-notify', this.handleCloseAllModal)

    CalendarEventBus.$on('close-waiting-list', this.handleCalendarWaitingListHiden)
    CalendarEventBus.$on('close-booking-list', this.handleCalendarBookingListHiden)

    // Event for Work Calendar
    CalendarEventBus.$on('work-schedule-setup', this.handleResourceWorkScheduleSetup)

    // Event for Booking Lookup from AhaAi
    CalendarEventBus.$on('booking-lookup-from-aha-ai', this.handleBookingLookupFromAhaAi)

    window.addEventListener('online', this.handleReconnection)
    window.addEventListener(this.visibilityState.visibilityChange, this.handleVisibilityChange)
  },

  beforeDestroy() {
    this.unregisterSignalREvents()
    CalendarEventBus.$off('add-blocked-time-context', this.handleBlockedTimeAdded)
    CalendarEventBus.$off('cancel-booking', this.handleCancelBooking)
    CalendarEventBus.$off('no-show-booking', this.handleNoShowBooking)

    CalendarEventBus.$off('add-blocked-time', this.handleAddBlockedTime)
    CalendarEventBus.$off('edit-blocked-time', this.handleEditBlockedTime)

    CalendarEventBus.$off('booking-deposit-click', this.handleBookingDepositClick)

    CalendarEventBus.$off('open-waiting-list', this.handleOpenWaitingList)
    CalendarEventBus.$off('open-booking-list', this.handleOpenBookingList)
    CalendarEventBus.$off('open-booking-deposit-list', this.handleOpenBookingDepositList)
    CalendarEventBus.$off('open-work-calendar', this.handleOpenWorkCalendar)
    CalendarEventBus.$off('open-notes', this.handleOpenNotes)
    CalendarEventBus.$off('on-close-booking-deposit-list', this.handleCalendarBookingDepositListHiden)

    CalendarEventBus.$off('view-sales-detail', this.handleViewSalesDetail)
    CalendarEventBus.$off('view-client-information', this.handleViewClientInformation)
    CalendarEventBus.$off('view-client-information-action', this.handleViewClientInformationAction)

    CalendarEventBus.$off('sales-draft-click', this.handleOpenSalesDraft)
    CalendarEventBus.$off('sales-draft-click-from-list', this.handleOpenSalesDraftFromList)
    CalendarEventBus.$off('load-booking-calendar', this.loadBookingCalendar)
    CalendarEventBus.$off('add-booking-deposit', this.handleBookingDepositAdd)
    CalendarEventBus.$off('load-calendar-setup', this.handleEventLoadCalendarSetup)
    CalendarEventBus.$off('click-move-naver-notify', this.handleCloseAllModal)

    CalendarEventBus.$off('close-waiting-list', this.handleCalendarWaitingListHiden)
    CalendarEventBus.$off('close-booking-list', this.handleCalendarBookingListHiden)

    // Event for Work Calendar
    CalendarEventBus.$off('work-schedule-setup', this.handleResourceWorkScheduleSetup)

    // Event for Booking Lookup from AhaAi
    CalendarEventBus.$off('booking-lookup-from-aha-ai', this.handleBookingLookupFromAhaAi)

    window.removeEventListener('online', this.handleReconnection)
    window.removeEventListener(this.visibilityState.visibilityChange, this.handleVisibilityChange)
  },

  visibilityChangeTimeout: null,

  methods: {
    ...mapMutations('menu', [
      'setIsMenuShown',
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
      'setShowCancelBookingDepositPaid',
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

    handleUpdatedClient() {
      this.updateClientInformation()
    },

    handleUpdatedNote() {
      this.updateClientInformation()
    },

    handleUpdatedClientFamily() {
      this.updateClientInformation()
    },

    async loadResourceNaverLink() {
      try {
        this.preLoader()
        const response = await this.$naverBookingMixin_getBookingResourceConnectedNaverLink(this.allCalendarSetup).catch(error => {
          this._showDialogAlert(error.message)
          return
        })

        this.setBookedResourceNaverLink(response)
      } catch (error) {
        this._showDialogAlert([error?.message || ''])
      } finally {
        this.preLoader(false)
      }
    },

    updateClientInformation() {
      try {
        this.refreshClientInformation()
        this.refreshClientInformationWaitingAction()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleDeletedClient() {
      this.closeClientInformation()
      CalendarEventBus.$emit('close-client-search-information')
    },

    registerSignalREvents() {
      // Booking events
      this.$signalR.on(NOTIFICATON_TYPE.BOOKINGS_UPDATED, this.handleBookingsUpdated)
      this.$signalR.on(NOTIFICATON_TYPE.BOOKINGS_CREATED, this.handleBookingsCreated)
      this.$signalR.on(NOTIFICATON_TYPE.BOOKINGS_CANCELLED, this.handleBookingsCancelled)

      // Blocked time events
      this.$signalR.on(NOTIFICATON_TYPE.BLOCKED_TIME_CREATED, this.handleBlockedTimeChanged)
      this.$signalR.on(NOTIFICATON_TYPE.BLOCKED_TIME_UPDATED, this.handleBlockedTimeChanged)
      this.$signalR.on(NOTIFICATON_TYPE.BLOCKED_TIME_DELETED, this.handleBlockedTimeDeleted)

      // Specific day events
      this.$signalR.on(NOTIFICATON_TYPE.SPECIFIC_DAY_CREATED, this.handleSpecificDayCreated)
      this.$signalR.on(NOTIFICATON_TYPE.SPECIFIC_WORKING_DAY_CREATED, this.handleEventLoadCalendarSetup)
      this.$signalR.on(NOTIFICATON_TYPE.SPECIFIC_WORKING_DAY_UPDATED, this.handleEventLoadCalendarSetup)
      this.$signalR.on(NOTIFICATON_TYPE.SPECIFIC_WORKING_DAY_DELETED, this.handleEventLoadCalendarSetup)
      this.$signalR.on(NOTIFICATON_TYPE.RESOURCE_SPECIFIC_OFF_DAY_CREATED, this.handleEventLoadCalendarSetup)
      this.$signalR.on(NOTIFICATON_TYPE.RESOURCE_SPECIFIC_OFF_DAY_DELETED, this.handleEventLoadCalendarSetup)
      this.$signalR.on(NOTIFICATON_TYPE.SHOP_SPECIFIC_OFF_DAY_CHANGED, this.handleEventLoadCalendarSetup)

      // Save drafts events
      this.$signalR.on(NOTIFICATON_TYPE.SALES_DRAFT_DELETED, this.handleSaveDraftDeleted)

      // Client Transfer events
      this.$signalR.on(NOTIFICATON_TYPE.SALES_TRANSFER_CLIENT, this.handleSalesTransferClient)
    },

    async unregisterSignalREvents() {
      // Booking events
      this.$signalR.off(NOTIFICATON_TYPE.BOOKINGS_UPDATED, this.handleBookingsUpdated)
      this.$signalR.off(NOTIFICATON_TYPE.BOOKINGS_CREATED, this.handleBookingsCreated)
      this.$signalR.off(NOTIFICATON_TYPE.BOOKINGS_CANCELLED, this.handleBookingsCancelled)

      // Blocked time events
      this.$signalR.off(NOTIFICATON_TYPE.BLOCKED_TIME_CREATED, this.handleBlockedTimeChanged)
      this.$signalR.off(NOTIFICATON_TYPE.BLOCKED_TIME_UPDATED, this.handleBlockedTimeChanged)
      this.$signalR.off(NOTIFICATON_TYPE.BLOCKED_TIME_DELETED, this.handleBlockedTimeDeleted)

      // Specific day events
      this.$signalR.off(NOTIFICATON_TYPE.SPECIFIC_DAY_CREATED, this.handleSpecificDayCreated)
      this.$signalR.off(NOTIFICATON_TYPE.SPECIFIC_WORKING_DAY_UPDATED, this.handleEventLoadCalendarSetup)
      this.$signalR.off(NOTIFICATON_TYPE.SPECIFIC_WORKING_DAY_DELETED, this.handleEventLoadCalendarSetup)
      this.$signalR.off(NOTIFICATON_TYPE.SPECIFIC_WORKING_DAY_CREATED, this.handleEventLoadCalendarSetup)
      this.$signalR.off(NOTIFICATON_TYPE.RESOURCE_SPECIFIC_OFF_DAY_CREATED, this.handleEventLoadCalendarSetup)
      this.$signalR.off(NOTIFICATON_TYPE.RESOURCE_SPECIFIC_OFF_DAY_DELETED, this.handleEventLoadCalendarSetup)
      this.$signalR.off(NOTIFICATON_TYPE.SHOP_SPECIFIC_OFF_DAY_CHANGED, this.handleEventLoadCalendarSetup)

      // Save drafts events
      this.$signalR.off(NOTIFICATON_TYPE.SALES_DRAFT_DELETED, this.handleSaveDraftDeleted)

      // Client Transfer events
      this.$signalR.off(NOTIFICATON_TYPE.SALES_TRANSFER_CLIENT, this.handleSalesTransferClient)
    },

    handleSalesTransferClient(client) {
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
      const clientIds = totalCalendarBookingCurrentDate.map(booking => booking.clientId)
      if(clientIds.includes(client.clientTransfer.clientId)) {
        const bookingEntries = Object.entries(this.bookingSet).map(([key, value]) => ({ [key]: value }))
        bookingEntries.forEach(booking => {
          const bookingId = Object.keys(booking)[0]
          const bookingData = booking[bookingId]
          store.commit(`_calendar/bookings/${bookingData.bookingDateTS}_${bookingData.bookedResources[0].bookingResourceSetupId}/setItems`, [])
        })

        this.loadCalendarData()
      }
    },

    getSelectedResourceFromLocal() {
      try {
        return JSON.parse(localStorage.getItem('selected-resource')) || []
      } catch (error) {
        return []
      }
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

    async loadResourceSettings() {
      let selectedResourceId = options.selected_resources_options.all
      if(this.bookingResources.length === 1 && this.isMobileDevice) {
        selectedResourceId = this.bookingResources[0].id
      } else {
        const shopId = this.shop_data.shop_id
        const selectedResourceLocal = this.getSelectedResourceFromLocal() || []
        selectedResourceId = (() => {
          const findShopResource = selectedResourceLocal.find(resource => {
            return resource.shop_id === shopId
          })

          return findShopResource?.resource_id ?? options.selected_resources_options.all
        })()
      }
      const viewModeByShops = await this.calendarViewMixin_getCalendarViewModeByShopsFromLocal()
      const numberOfDay = [SELECTED_EXCLUDE_OFF_VALUE, SELECTED_ALL_VALUE].includes(selectedResourceId)
        ? this.numberOfDaysViewAllLocalStorage || this.defaultNumberOfDaysViewAll
        : viewModeByShops[this.shop_data.shop_id] || (this.numberOfDaysViewByResourceLocalStorage || this.defaultNumberOfDaysViewByResource)
      this.setNumberOfDay(numberOfDay)
      const bookingResourcesLocalStorage = this.getResourceFromLocalStorage()
      await this.loadResourceDefaultSelection(bookingResourcesLocalStorage)
    },

    getResourceFromLocalStorage() {
      const resourceLocalStorage = (() => {
        try {
          return JSON.parse(localStorage.getItem('selected-resource')) || []
        } catch (error) {
          return []
        }
      })()
      const result = resourceLocalStorage.find(resource => resource.shop_id === this.shop_data.shop_id)

      return result
    },

    async loadBookingCalendar(totalBooking = [], isVisibilityChange = false) {
      const bookingFilter = {
        typeDate:               this.typeDate,
        shopId:                 this.shop_data.shop_id,
        bookingResourceSetupId: this.selectedResourceId,

        toDateTS:   convertDateToTimeStamp(this.toDate),
        fromDateTS: convertDateToTimeStamp(this.fromDate),
        totalBooking,
        isVisibilityChange,
      }

      await this.getBookingCalendarLive(bookingFilter)
    },

    calculatedCalendarCellHeight() {
      const cellHeightPercentage = localStorage.getItem(CELL_HEIGHT_SETTING_NAME) ?? CELL_HEIGHT_SETTING_DEFAULT
      this.calculateTimeSlotHeight(cellHeightPercentage)
    },

    async handleBookingsUpdated(data) {
      const sessionToken = data?.sessionToken
      if (sessionToken === this.user.session_token) {
        return
      }

      const booking = data.booking
      this.updateBooking({ booking })

      if(this.isSyncBookingWhenDeleteSales) {
        await this.updateNoShowBooking(booking)
        this.setSyncBookingWhenDeleteSales(false)
        this.preSubLoad(false)
      }
    },

    async handleBookingsCreated(data) {
      const sessionToken = data?.sessionToken
      if (sessionToken === this.user.session_token) {
        return
      }

      const booking = data.booking
      this.addBooking({ booking })
    },

    async handleBookingsCancelled(data) {
      const sessionToken = data?.sessionToken
      if (sessionToken === this.user.session_token) {
        return
      }

      const bookings = data?.bookings ?? []
      bookings.forEach(booking => {
        this.removeBookingById({ bookingId: booking.bookingId })
      })
    },

    async handleSaveDraftDeleted(data) {
      if(data.shopId !== getShopId()) {
        return
      }

      this.deleteSaveDraft(data)
    },

    handleBookingActionHidden() {
      this.closeBookingAction()
    },

    /**
     * Handles the event when work calendar setup of resource is clicked.
     * This function calls the API based on resourceId to filter work schedule setup.
     * in the `modal-work-schedule-setup.vue` component.
     * currentSelectedDate is an additional param for setting defaultFromPage in the `modal-work-calendar.vue` component
     * @param resourceId
     */
    handleResourceWorkScheduleSetup (resourceId) {
      const currentSelectedDate = new Date(this.selectedDate)
      this.$refs.workCalendarModal.openWorkScheduleSetup(resourceId, currentSelectedDate)
    },

    async confirmAddBookingDepositButtonClick(data) {
      /**@type {Booking} */
      const booking = data.booking
      const bookingDeposit = booking.bookingDeposit ?? new BookingDeposit()
      this.$refs.bookingDepositAdd.show({
        bookingDeposit,
        forceSetup: !!data.forceSetup,
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

          if (booking.clientMobileNumber) {
            await this.sendAddedBookingMessage({ booking })
          }

          this.$refs.bookingDepositAdd.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /** @param {Booking} booking */
    async handleBookingDepositPaymentAdd(booking) {
      /**@type {Booking} */
      const clonedBooking = booking.clone()

      this.$refs.bookingDepositPaymentAdd.showFromBooking({ booking })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.preLoader()

          await this.addBookingDepositPayment({
            bookingDeposit: changedBookingDeposit,
          })

          clonedBooking.bookingDeposit = changedBookingDeposit

          if (clonedBooking.clientMobileNumber) {
            await this.sendBookingMessage({ booking: clonedBooking })
          }

          this.$refs.bookingDepositPaymentAdd.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async handleBookingDepositAdd(data) {
      try {
        this.preLoader()

        const booking = Booking.build(data)

        const bookingDepositDefaultSetup = await this.$bookingCacheMixin_getBookingDepositDefaultSetup({
          shopId: this.shop_data.shop_id,
        })

        const hasBookingDepositSetup = this.$bookingCacheMixin_checkHasBookingDepositSetup(bookingDepositDefaultSetup)

        if (!hasBookingDepositSetup) {
          this.$refs.bookingDepositSetupAlarm.show()(event => {
            this.confirmAddBookingDepositButtonClick({
              booking,
              forceSetup: event === 'setup-now',
            })
          })
        } else {
          this.confirmAddBookingDepositButtonClick({ booking })
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
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

    /**@param {Booking} booking */
    async handleViewBookingDepositPaymentDetail(booking) {
      this.$refs.bookingDepositPaymentDetail.showFromBooking({ booking })((event) => {
        if (event === 'edit-payment-click') {
          this.handleBookingDepositPaymentEdit(booking)
        } else if (event === 'send-message-click') {
          this.handleSendDepositPaymentConfirmMessage(booking)
        } else if (event === 'add-refund-click') {
          this.handleBookingDepositRefundAdd(booking)
        } else if (event === 'edit-refund-click') {
          this.handleBookingDepositRefundEdit(booking)
        }
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

          this.$refs.bookingDepositRefund.hide()
          this.$refs.bookingDepositPaymentDetail.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /** @param {Booking} booking */
    async handleBookingDepositPaymentEdit(booking) {
      this.$refs.bookingDepositPaymentEdit.showFromBooking({ booking })(async changedBookingDeposit => {
        try {
          if (!changedBookingDeposit) return

          this.preLoader()

          await this.updateBookingDepositPayment({
            bookingDeposit: changedBookingDeposit,
          })

          this.$refs.bookingDepositPaymentEdit.hide()
          this.$refs.bookingDepositPaymentDetail.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /** @param {Booking} booking */
    async handleSendDepositPaymentConfirmMessage(booking) {
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

    handleBookingDepositClick(data) {
      const selectedBooking = this.bookingSet?.[data.bookingId]
      if (!selectedBooking) {
        return
      }

      /**@type {Booking} */
      const booking = Booking.build(selectedBooking)

      /** @type {BookingDeposit} */
      const bookingDeposit = BookingDeposit.build(selectedBooking.bookingDeposit)

      if (bookingDeposit.status !== options.booking_deposit_status.exist) {
        this.handleBookingDepositAdd(selectedBooking)
      } else if (bookingDeposit.bookingDepositPayment?.status === options.booking_deposit_status.exist) {
        this.handleViewBookingDepositPaymentDetail(booking)
      } else if (checkedOutStatuses.includes(booking.status) && bookingDeposit.depositType === options.deposit_type.not_paid_yet) {
        this.bookingDeposit = bookingDeposit
        this.isBookingDepositEditVisible = true
      } else {
        this.handleBookingDepositPaymentAdd(booking)
      }
    },

    handleBookingDepositPaymentEditCancel() {
      this.$refs.bookingDepositPaymentEdit.hide()
    },

    /**@param {BookingDeposit} bookingDeposit */
    async handleBookingDepositUpdate(bookingDeposit = new BookingDeposit()) {
      try {
        this.preLoader()

        await this.updateBookingDeposit({ bookingDeposit })

        this.$refs.bookingDepositPaymentAdd.hide()
        this.isBookingDepositEditVisible = false
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleBookingDepositEditDelete() {
      try {
        this.preLoader()

        await this.deleteBookingDeposit({ bookingDeposit: this.bookingDeposit })
        this.isBookingDepositEditVisible = false
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**@param {BookingDeposit} bookingDeposit */
    async handleBookingDepositPaymentEditDelete(bookingDeposit = new BookingDeposit()) {
      try {
        this.preLoader()

        await this.deleteBookingDepositPayment({ bookingDeposit })

        this.$refs.bookingDepositPaymentEdit.hide()
        this.$refs.bookingDepositPaymentDetail.hide()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleBookingCheckedOut(booking) {
      this.updateBooking({ booking })
    },

    handleDraftDocumentAdded(booking) {
      this.updateBooking({ booking })
    },

    async handleDraftDocumentDeleted(booking) {
      const isNaverProxyBooking = booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo

      if (isNaverProxyBooking) {
        this.preLoader()
        setTimeout(async () => {
          await this.loadBookingCalendar()
          this.preLoader(false)
        }, 3000)
      } else {
        await this.updateBooking({booking})
      }
    },

    handleOpenBookingList() {
      this.isBookingListModalVisible = true
    },

    handleCalendarBookingListHiden() {
      this.isBookingListModalVisible = false
    },

    handleOpenWaitingList() {
      this.isWaitingListModalVisible = true
    },

    handleCalendarWaitingListHiden() {
      this.isWaitingListModalVisible = false
    },

    handleOpenBookingDepositList() {
      this.isBookingDepositListModalVisible = true
    },

    handleOpenWorkCalendar() {
      this.isWorkCalendarModalVisible = true
    },

    handleCloseWorkCalendar() {
      this.isWorkCalendarModalVisible = false
    },

    handleCalendarBookingDepositListHiden() {
      this.isBookingDepositListModalVisible = false
    },

    async handleWaitingActionHidden() {
      this.closeWaitingAction()
    },

    async handleBookingAdded(addedBooking) {
      this.sendAddedBookingMessage({ booking: addedBooking })
    },

    async handleWaitingAdded() {
      try {
        await this.getWaitingsFromToday()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async handleWaitingUpdated() {
      try {
        await this.getWaitingsFromToday()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleBlockedTimeAdded(blockedTime) {
      /** @description This action includes adding and updating a blocked time */
      this.addBlockedTime(blockedTime)
    },

    async handleAddBlockedTime({ date, startTime, resource }) {
      const blockedTime = new BlockedTime()
      blockedTime.blockedDateTS = date.unix()
      blockedTime.bookingResourceSetupId = resource.id

      blockedTime.fromTimeInMinutes = startTime
      blockedTime.toTimeInMinutes = startTime + this.timeSlot

      this.$refs.blockedTimeAction.loadForm(blockedTime)
    },

    handleEditBlockedTime(data) {
      const blockedTime = BlockedTime.build(data)
      this.$refs.blockedTimeAction.loadForm(blockedTime)
    },

    handleBlockedTimeUpdated(blockedTime) {
      /** @description This action includes adding and updating a blocked time */
      this.addBlockedTime(blockedTime)
    },

    handleBlockedTimeChanged(blockedTime) {
      const sessionToken = blockedTime?.sessionToken
      if (sessionToken === this.user.session_token) {
        return
      }

      this.addBlockedTime(blockedTime)
    },

    handleBlockedTimeDeleted(blockedTime) {
      const sessionToken = blockedTime?.sessionToken
      if (sessionToken === this.user.session_token) {
        return
      }

      this.deleteBlockedTime(blockedTime)
    },

    async handleCancelBooking(data) {
      if (!data.bookingId) return

      const booking = Booking.build(data)

      this.$refs.bookingCancel.show({ booking })(async (cancelResult) => {
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

    async updateNoShowBooking(booking) {
      try {
        const updateStatus = (() => {
          if (booking.status === BOOKING_STATUS.NO_SHOW) {
            return BOOKING_STATUS.COMPLETED
          }

          return BOOKING_STATUS.NO_SHOW
        })()

        this.preLoader()

        await this.updateBookingStatus({
          status:    updateStatus,
          bookingId: booking.bookingId,
        })
      } catch (error) {
        await this.$mixin_handleConfirmHasCancellationFee({
          shopId:                                booking.shopId,
          bookingId:                             booking.bookingId,
          useDeleteCancellationFeeSalesEndpoint: true,
        })
      } finally {
        this.preLoader(false)
      }
    },

    handleNoShowBooking(data) {
      if (!data.booking?.bookingId) return

      const booking = Booking.build(data.booking)

      /**
       * Modal type : NoShowBookingDepositPaid (#2595)
       * - In cases where the booking is Naver and the deposit has been paid
       * - In cases where the booking is normal, the deposit has been paid, there is no cancellation fee, and the status is not no-show
       */
      const isNoShow = booking?.status === options.booking.booking_status.no_show
      const isNaverBooking = booking?.isNaverBooking
      const hasPaidDeposit = booking?.bookingDeposit?.hasDeposit && booking?.bookingDeposit?.depositType === options.deposit_type.paid
      const hasCancellationFee = booking?.cancellationFee
      if (
        (isNaverBooking && hasPaidDeposit) ||
        (hasPaidDeposit && !hasCancellationFee && !isNoShow)
      ) {
        this.setBookingItem({
          data:   booking,
          action: options.booking.booking_status.no_show,
        })
        this.setShowCancelBookingDepositPaid(true)
        return
      }

      /**
       * Update immediately if it is not a Naver booking and there is no booking deposit paid
       */
      if(!data?.isNaverBooking) {
        this.updateNoShowBooking(booking)
        return
      }

      /**
       * Modal type : NoShowBooking ( Old Code )
       * - In all other cases outside the above conditions
       */
      this.$refs.noShowBooking.show({ booking })(async (noShowResult) => {
        try {
          if (!noShowResult) return

          this.preLoader()

          await this.noShowNaverBooking({
            noShowInfo: noShowResult,
          })

          this.$refs.noShowBooking.hide()

        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    /**@param {Booking} booking */
    async viewRegisteredClientInformation (booking) {
      try {
        this.preLoader()

        await this.checkoutBookingFromClientInformation({ booking })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**@param {Booking} booking */
    async viewUnregisteredClientInformation (booking) {
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

          this.$refs.clientConnectable.hide()
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async handleViewClientInformation(data) {
      const originalBooking = this.bookingSet[data.bookingId]
      if (!originalBooking) return

      /**@type {Booking} */
      const booking = Booking.build(originalBooking)

      if (!booking.clientId) {
        this.viewUnregisteredClientInformation(booking)
      } else {
        this.viewRegisteredClientInformation(booking)
      }
    },

    async handleViewClientInformationAction(client) {
      try {
        this.preLoader()
        await this.openClientInformation({
          client,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleViewSalesDetail(data) {
      try {
        /**@type {Booking} */
        const booking = Booking.build(data)

        this.$refs.salesDetail.showFromBooking(booking)

      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleCheckoutSalesEdited(sales) {
      this.$refs.checkoutSuccessModal.show({
        clientId:     sales.client_id,
        clientShopId: sales.client_shop_id,
      })
    },

    async handleOpenSalesDraftFromList(data) {
      try {
        this.preLoader()

        const booking = Booking.build(data)

        const isNaverProxyBooking = booking?.isNaverBooking && booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo

        if (booking.draftDocumentId && isNaverProxyBooking) {
          const salesDraftDocumentApi = new SalesDraftDocumentApi()
          const response = await salesDraftDocumentApi.getSalesDraft({
            draftDocumentId: booking.draftDocumentId,
            shopId:          this.shop_data.shop_id,
          })

          this.setBookingItem({
            data:   booking,
            action: options.booking.booking_status.external_checked_out,
          })

          // Set the client visitor here so that when performing sales draft actions,
          // we still have the clientId to display the UI in the client-information.vue component
          if (booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo) {
            this.setClientVisitor({
              clientId:           response?.data?.draftDetail?.clientId,
              clientName:         response?.data?.draftDetail?.clientName,
              clientMobileNumber: response?.data?.draftDetail?.clientMobileNumber,
              shopId:             response?.data?.draftDetail?.shopId,
            })
          }

          await this.checkoutBooking({
            booking: {
              ...booking,
              clientId:     response?.data?.clientId,
              clientName:   response?.data?.clientName,
              clientShopId: response?.data?.draftDetail?.clientShopId,
            },
            isAddBookingToSalesImmediate: true,
          })
        } else {
          this.setBookingItem({
            data:   booking,
            action: booking.status,
          })
          await this.checkoutBooking({
            booking,
            isAddBookingToSalesImmediate: true,
          })
        }
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleOpenSalesDraft(data) {
      try {
        this.preLoader()

        const booking = Booking.build(
          this.bookingSet[data.bookingId],
        )
        const isNaverProxyBooking = booking?.isNaverBooking && booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo

        if (booking.draftDocumentId && isNaverProxyBooking) {
          const salesDraftDocumentApi = new SalesDraftDocumentApi()
          const response = await salesDraftDocumentApi.getSalesDraft({
            draftDocumentId: booking.draftDocumentId,
            shopId:          this.shop_data.shop_id,
          })

          this.setBookingItem({
            data:   booking,
            action: options.booking.booking_status.external_checked_out,
          })

          // Set the client visitor here so that when performing sales draft actions,
          // we still have the clientId to display the UI in the client-information.vue component
          if (booking?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo) {
            this.setClientVisitor({
              clientId:           response?.data?.draftDetail?.clientId,
              clientName:         response?.data?.draftDetail?.clientName,
              clientMobileNumber: response?.data?.draftDetail?.clientMobileNumber,
              shopId:             response?.data?.draftDetail?.shopId,
            })
          }

          await this.checkoutBooking({
            booking: {
              ...booking,
              clientId:     response?.data?.clientId,
              clientName:   response?.data?.clientName,
              clientShopId: response?.data?.draftDetail?.clientShopId,
            },
            isAddBookingToSalesImmediate: true,
          })
        } else {
          this.setBookingItem({
            data:   booking,
            action: booking.status,
          })
          await this.checkoutBooking({
            booking,
            isAddBookingToSalesImmediate: true,
          })
        }
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onEditedSales() {
      this.$refs.salesDetail.isSalesDetailShown = false
    },

    async loadCalendarData() {
      try {
        await Promise.all([
          this.loadCalendarSetup(true),
          this.loadBookingCalendar(),
          this.getWaitingsFromToday(),
        ])
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleReconnection() {
      this.loadCalendarData()
    },

    async handleVisibilityChange() {
      clearTimeout(this.$options.visibilityChangeTimeout)

      if (document[this.visibilityState.hidden]) return

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

      this.$options.visibilityChangeTimeout = setTimeout(async () => {
        this.loadCalendarDataVisibility(totalCalendarBookingCurrentDate, true)
        clearTimeout(this.$options.visibilityChangeTimeout)
      }, 1000)
    },

    async loadCalendarDataVisibility(totalBooking, visibilityChange) {
      try {
        await Promise.all([
          this.loadCalendarSetup(true),
          this.loadBookingCalendar(totalBooking, visibilityChange),
          this.getWaitingsFromToday(),
        ])
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async handleSpecificDayCreated(data) {
      const sessionToken = data?.sessionToken
      if (sessionToken === this.user.session_token) {
        return
      }

      this.changeBookingSetupResourceSpecificDay(data)
    },

    showBookingDepositMessageSetupAlarm(bookingDeposit) {
      if (bookingDeposit.depositType === options.deposit_type.not_paid_yet) {
        this.$refs.bookingDepositGuideAlarm.show()
      } else if (bookingDeposit.depositType === options.deposit_type.paid) {
        this.$refs.bookingDepositPaymentConfirmationAlarm.show()
      }
    },

    handleEventLoadCalendarSetup() {
      this.loadCalendarSetup(true)
    },

    onLocalStorageChange() {
      this.calculatedCalendarCellHeight()
    } ,

    handleCloseAllModal() {
      this.handleCalendarBookingListHiden()
      this.handleCalendarWaitingListHiden()
      this.handleCalendarBookingDepositListHiden()
      this.handleWaitingActionHidden()
    },

    showAlertExceedMaxCalendarCols() {
      this.alert_exceed_max_calendar_cols_data = [this.exceed_max_calendar_cols]
      this.showDialogById(this.alertExceedMaxCalendarColsId)
    },

    handleCancelAlertExceedMaxCalendarCols() {
      this.$router.push('/booking-calendar-settings')
    },

    customFunction() {
      try {
        const moveBooking = sessionStorage.getItem('moveBooking')
        this.naverMoveBooking = moveBooking ? JSON.parse(moveBooking) : null
      } catch (error) {
        this._showDialogAlert(error.message)
        this.naverMoveBooking = null // Handle the error by setting a default value
      }

      this.isMoveNaverBooking = !!this.naverMoveBooking
      sessionStorage.removeItem('moveBooking')
    },

    handleSalesPaymentAdded() {
      this.$refs.salesDetail.isSalesDetailShown = false
    },

    async handleOpenNotes() {

      try {
        const payload = { shopId: this.shop_data.shop_id }
        const result = await getSidebarNotes(payload)

        this.notes = result.data?.result?.content || ''

        this.$nextTick(() => {
          this.$refs.notesActionRef.showModal({
            notes:      this.notes,
            isEditable: true,
          })
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async handleUpdateBookingNote({ notes }) {
      try {
        this.preLoader()
        const payload = {
          content:      notes,
          shopId:       this.shop_data.shop_id,
          sessionToken: this.user.session_token,
        }
        await updateSidebarNotes(payload)
        this.notes = notes
        this.$refs?.notesActionRef.hideModal?.()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleBookingLookupFromAhaAi(bookingLookupResult) {
      console.log('bookingLookupResult', bookingLookupResult)
      if(bookingLookupResult.result.items.length === 1) {
        this.$refs.calendar.handleViewBookingOnCalendar({
          data: bookingLookupResult.result.items[0],
          type: 'booking-list',
        })
        return
      }

      this.isBookingListModalVisible = true
    },
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from?.name) vm.customFunction()
    })
  },
}
</script>

<style lang="scss">
#app .app-layout--calendar-page {
  display: flex;
  height: 100vh;
  height: var(--window-height);
  flex-direction: column;
}
</style>

<style lang="scss" scoped>
@import './calendar.scss';
</style>
