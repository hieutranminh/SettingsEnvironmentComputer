<template>
  <div>
    <b-modal
      ref="modalClientInformation"
      :visible="visible"
      :modal-class="modalClass"
      :title="$t('bookings.client-information')"

      static
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      @show="onLoadForm()"
      @hide="onCancel"
    >
      <!-- Search -->
      <div
        v-if="!isMobileDevice"
        class="search-client-top"
      >
        <search-client
          ref="searchClient"
          :has-quick-search="true"
          :has-condition-search="true"
          :has-recently-searched="true"
          :has-empty-client-found-message="true"
          :is-modal-search-open="isModalSearchOpen"
          :filter-data="filterData"
          @search="handleSearch"
        />

        <a-button
          variant="primary"
          class="a-button--cyan"
          @click="handleAddClient"
        >
          {{ $t('bookings.add-client') }}
        </a-button>

        <a-button
          variant="primary"
          class="a-button--add-booking"
          @click="handleAddBooking"
        >
          {{ $t('bookings.add-booking') }}
        </a-button>
      </div>

      <div
        v-else
        class="search-client-top"
      >
        <a-button
          variant="primary"
          class="a-button--cyan"
          @click="handleAddClient"
        >
          {{ $t('bookings.add-client') }}
        </a-button>

        <a-button
          variant="primary"
          class="a-button--add-booking"
          @click="handleAddBooking"
        >
          {{ $t('bookings.add-booking') }}
        </a-button>
      </div>

      <div class="custom-divider" />

      <!-- Information -->
      <div class="information">
        <!-- Main -->
        <div class="information__main">
          <div class="information__main-left">
            <!-- Client image -->
            <div
              class="information__img"
              @click="handleClientAvatarClick"
            >
              <transition
                :duration="{ enter: 50, leave: 100 }"
                name="fade"
                mode="out-in"
              >
                <img
                  v-if="client.hasClientAvatar"
                  :src="client.clientAvatarURL"
                  :alt="client.imageName"
                  class="img-avatar"
                >
                <div
                  v-else
                  class="img-empty"
                >
                  {{ $t('client-photo.client-image') }}
                </div>
              </transition>
            </div>

            <div class="information__text">
              <!-- Client name -->
              <h3 class="client-summary__client-name">
                <a
                  v-b-tooltip.hover
                  :title="$t('sales.view-detail')"
                  @click="handleViewClientDetail"
                >
                  {{ client.clientName }}
                </a>
              </h3>

              <!-- Client types -->
              <p
                v-if="clientTypes.length"
                class="client-summary__client-types"
              >
                {{ clientTypes.join(', ') }}
              </p>

              <!-- Client shop name ( for another shop ) -->
              <p
                v-if="isClientAnotherShop"
                class="client-summary__client-shop-name"
              >
                ({{ client.shopName }})
              </p>

              <!-- Client mobile number -->
              <p class="client-summary__mobile-number">
                <span class="mobile-number">{{ formattedMobileNumber }}</span>

                <template v-if="client.mobileNumber">
                  <span
                    v-if="isSendCall"
                    class="d-none d-md-block call-w-icon ml-1"
                    @click="onSendCall(true)"
                  />
                  <span
                    v-if="!isHideInfo && !isNotAllowSendMessage"
                    class="message-w-icon ml-1"
                    @click="onSendMessage"
                  />
                  <span
                    v-if="!isHideInfo && isNotAllowSendMessage"
                    class="message-allow-icon ml-1"
                    @click="onSendMessage"
                  >
                    <img :src="messageIcon">
                  </span>
                </template>
              </p>

              <!-- Client phone number -->
              <p class="client-summary__phone-number">
                <span class="phone-number">{{ formattedPhoneNumber }}</span>

                <template v-if="client.phoneNumber">
                  <span
                    v-if="isSendCall"
                    class="d-none d-md-block call-w-icon ml-1"
                    @click="onSendCall(false)"
                  />
                </template>
              </p>
            </div>
          </div>

          <div class="information__main-right">
            <a-button
              variant="out-line"
              @click="handleViewClientDetail"
            >
              {{ $t('bookings.details') }}
            </a-button>
          </div>
        </div>

        <!-- Sub -->
        <div class="information__sub">
          <table>
            <tr>
              <td>{{ $t('clients.client-number') }}</td>
              <td>{{ client.memberNumber }}</td>
            </tr>
            <tr v-if="client.preferredStaffName">
              <td>{{ $t('clients.preferred-staff') }}</td>
              <td>{{ client.preferredStaffName }}</td>
            </tr>
            <tr v-if="client.birthday">
              <template v-if="isPetSalon">
                <td>{{ $t('clients.age-birthday') }}</td>
                <td><span v-html="renderClientAge" /></td>
              </template>
              <template v-else>
                <td>{{ $t('clients.birthday') }}</td>
                <td>{{ client.birthday }}</td>
              </template>
            </tr>
            <tr v-if="loyaltyPoints">
              <td>
                {{ $t('clients.points') }}
                <span v-if="client.familyId">({{ $t('client-information.family') }})</span>
              </td>
              <td>
                <span
                  class="client-loyalty"
                  @click="isLoyaltyPointsVisible = true"
                >
                  {{ loyaltyPoints | formatMoney }}
                </span>
              </td>
            </tr>
            <tr v-if="hasBalance">
              <td>{{ $t('clients.balance') }}</td>
              <td>
                {{ client.account.balance | formatMoney }}
                <span v-if="hasFamilyBalance">({{ $t('client-information.family-sum') }}: {{ familyBalance | formatMoney }})</span>
              </td>
            </tr>
            <tr v-if="client.outstanding">
              <td>{{ $t('client-information.outstanding') }}</td>
              <td>
                <span
                  class="client-outstanding"
                  @click="isOutstandingHistoriesVisible = true"
                >
                  {{ client.outstanding | formatMoney }}
                </span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('bookings.recent-visit-date') }}</td>
              <td>
                <span>{{ formatRecentVisitDate(client.recentVisitDateTimeTS) }}</span>
                <span v-if="passDay > 0">({{ passDayText }})</span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('bookings.past-year-bookings') }}</td>
              <td>
                <template v-if="hasBookings">
                  {{ client.pastYearBooking.totalBooking }}
                  <span v-html="renderPastYearSummary" />
                </template>
                <template v-else>
                  0
                </template>
              </td>
            </tr>
            <tr v-if="isUpcomingBooking">
              <td>{{ $t('bookings.upcoming-bookings') }}</td>
              <td>
                <div class="client-upcoming-booking">
                  <span>{{ client.recentBooking.bookingDateTS | formatUTCDateNoHour }} {{ client.recentBooking.isStartTimeCrossDay ? $t('general.next-day-text') : '' }} {{ isAmOrPm(client.recentBooking.startTimeInMinute, false) }}</span>
                  <aha-button
                    v-if="!isBookingAnotherShop"
                    class="btn-redirect"
                    @click="goToBookingWithDateTS"
                  >
                    ➝
                  </aha-button>
                </div>
                <div
                  v-if="isBookingAnotherShop"
                  class="client-summary__client-shop-name"
                >
                  ({{ clientRecentBookingShopName }})
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Note -->
        <div
          :class="[
            'information__note',
            {'information__note--disabled': isClientAnotherShop}
          ]"
          class="information__note"
          @click="handleClientNoteClicked"
        >
          <aha-note-with-tooltip
            v-if="client.notes"
            :value="client.notes"
            placement="bottom"
            boundary="note-box"
            tooltip-id="modal-client-information__notes-id"
            custom-class="client-summary__clients-tooltip"
          />
        </div>
      </div>

      <!-- Tabs -->
      <b-tabs
        v-model="activeTab"
        card
        pills
        @activate-tab="handleActiveTabChange"
      >
        <b-tab :title="$t('bookings.previous-booking-list')">
          <client-bookings
            :client="client"
            :has-rebook="false"
            @change-page="handleBookingsPageChange"
          />
        </b-tab>

        <b-tab :title="$t('sales-prepaid-card-tab.prepaid-cards')">
          <client-prepaid-cards />
        </b-tab>

        <b-tab :title="$t('services.prepaid-services')">
          <client-prepaid-services
            :has-column-book="false"
            :hide-note-prepaid-service="true"
          />
        </b-tab>
      </b-tabs>
    </b-modal>

    <!-- Modal - Client action -->
    <client-action
      :visible="isShowAddClientAction"
      @hidden="handleAddClientActionHidden"
      @added-client-successfully="handleAddSuccessfullyClient"
    />

    <!-- Modal - Client image action -->
    <client-image-action
      :client="targetClient"
      :modal-id="clientImageActionModalId"

      @deleted-avatar-client="handleRefreshClient"
      @created-avatar-client="handleRefreshClient"
    />

    <!-- Modal - Send message -->
    <send-message-modal
      :data="client.clientId"
      :modal-id="sendMessageModalId"
      :is-hide-call-number="isHideInfo"
      :type="options.messages_enums.send_page.client"
      :is-not-allow-send-message-client="isNotAllowSendMessage"
    />

    <!-- Modal - Send call -->
    <send-call-modal
      :call-number="callNumber"
      :modal-id="sendCallModalId"
      :is-hide-call-number="isHideInfo"
    />

    <!-- Modal - Client loyalty points histories -->
    <client-loyalty-points-histories
      :client="client"
      :visible="isLoyaltyPointsVisible"
      :allow-edit-loyalty-points="false"
      @hidden="isLoyaltyPointsVisible = false"
      @view-sales-detail="isSalesModalVisible = true"
      @view-refund-detail="isRefundModalVisible = true"
    />

    <!-- Modal - Client outstanding histories -->
    <client-outstanding-histories
      :client="client"
      :account="client.account"
      :allow-edit-outstanding="false"
      :visible="isOutstandingHistoriesVisible"
      @hidden="isOutstandingHistoriesVisible = false"
      @view-sales-detail="handleViewSalesDetailFromOutstandingHistories"
    />

    <!-- Modal - Sales detail -->
    <sales-detail
      :visible="isSalesModalVisible"
      :has-static="false"
      :is-outstanding-history="isOutstandingHistory"
      @hidden="handleSalesDetailHidden"
    />

    <!-- Modal - Refund detail -->
    <refund-detail
      :visible="isRefundModalVisible"
      :has-static="false"
      @hidden="handleRefundDetailHidden"
    />

    <!-- Modal - Note -->
    <a-note
      :value="client.notes"
      :editable="true"
      :visible="isClientNotesVisible"
      parent-id="modal-client-information-1050"
      :notify-max-notes-length="notifyMaxNotesLengthComputed"

      @input="handleClientNotesInput"
      @hidden="isClientNotesVisible = false"
    />
  </div>
</template>
<script>
// Utils
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { CalendarEventBus, convertDateToMomentUTC, convertTimestampToDate } from 'Modules/calendar/utils'
import {
  guid,
  isAmOrPm,
  formatMoney,
  formatMobileAndPhoneNumber,
  getHideClientInfoPermission,
  convertTimeStampToDate,
  convertTimeStampMinusLocalzone,
  convertDateToTimeStamp,
  convertDateToTimezone,
  convertHoursToMinutes,
  convertTimeStampToUtcDatetime,
  calculateClientAge,
} from 'CommonHelpers'
import {
  getDiffDateRange,
  getStartOfTimezoneDateTS,
} from 'DatetimeHelpers'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import WindowMessageMixin from 'Mixins/window-message-mixin.js'
import EnvironmentMixin from 'Mixins/environment-setup-mixin.js'
import ClientCacheMixin from 'Modules/cache/mixins/client_cache'
import ClientBookingMixin from 'Modules/calendar/mixins/client-booking.js'
// Models
import Client from 'Models/client/client'
import SalesApi from 'API/sales/sales-api'
import ClientViewModel from 'ViewModels/clients/client-view-model'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ClientAction from 'Components/clients/client-action/client-action.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SendCallModal from 'CommonComponents/header-block/cid-send-call-action.vue'
import SearchClient from 'Modules/calendar/components/search-client/search-client.vue'
import SendMessageModal from 'Components/messages/send-message-modal/send-message-modal.vue'
import AhaNoteWithTooltip from 'CommonComponents/aha-note-with-tooltip/aha-note-with-tooltip.vue'
// Constants
import { options } from 'OptionsHelpers'
import { MINUTES_OF_24H, PRIORITY_DISPLAY_CLIENT_PREPAID_GOODS, SECOND_OF_1M, MAX_BOOKING_SHOW_CLIENT_INFOR, BUSINESS_TYPE_CODE } from 'Constant'
import { BOOKING_DATA_RULES } from 'SystemDataRules'

const TAB_OPTIONS = {
  bookings:        0,
  prepaidCards:    1,
  prepaidServices: 2,
}

export default {
  filters: {
    formatMoney(value) {
      return formatMoney(value, 0)
    },
  },

  components: {
    AButton,
    ClientAction,
    SearchClient,
    SendCallModal,
    SendMessageModal,
    AhaNoteWithTooltip,

    ANote:                        () => import('Modules/aha/a-note/a-note.vue'),
    SalesDetail:                  () => import('Components/sales/sales-detail/sales-detail.vue'),
    RefundDetail:                 () => import('Components/sales/refund-detail/refund-detail.vue'),
    ClientImageAction:            () => import('Components/clients/client-image-action/client-image-action.vue'),
    ClientOutstandingHistories:   () => import('Modules/clients/components/client-outstanding-histories/client-outstanding-histories.vue'),
    ClientLoyaltyPointsHistories: () => import('Modules/clients/components/client-loyalty-points-histories/client-loyalty-points-histories.vue'),
    ClientBookings:               () => import('Modules/calendar/components/booking-action/components/booking-selected-client/components/client-bookings/client-bookings.vue'),
    ClientPrepaidCards:           () => import('Modules/calendar/components/booking-action/components/booking-selected-client/components/client-prepaid-cards/client-prepaid-cards.vue'),
    ClientPrepaidServices:        () => import('Modules/calendar/components/booking-action/components/booking-selected-client/components/client-prepaid-services/client-prepaid-services.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    SalesCacheMixin,
    EnvironmentMixin,
    ClientCacheMixin,
    WindowMessageMixin,
    ClientBookingMixin('_calendar/bookingAction/client'),
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
    isModalSearchOpen: {
      type:    Boolean,
      default: false,
    },
    filterData: {
      type:    Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      options,

      callNumber:                    '',
      clientSetup:                   null,
      sendMessageModalId:            'send-message-modal',
      sendCallModalId:               'cid-send-call-modal-from-client-info-summary',
      activeTab:                     TAB_OPTIONS.bookings,
      isClientNotesVisible:          false,
      isLoyaltyPointsVisible:        false,
      isOutstandingHistoriesVisible: false,
      isShowAddClientAction:         false,
      isSalesModalVisible:           false,
      isRefundModalVisible:          false,
      isOutstandingHistory:          false,
      isLoadingInventory:            false,
    }
  },

  computed: {
    ...mapGetters('shop', [
      'getShopEnvironment',
    ]),

    ...mapState('_calendar/bookingAction', [
      'client',
      'booking',
    ]),

    uid() {
      return guid()
    },

    clientImageActionModalId() {
      return `${this.uid}_client-image-action-modal`
    },

    messageIcon() {
      return '/template/images/not-allow-message.png'
    },

    passDay() {
      if(this.client?.recentVisitDateTimeTS === 0) {
        return 0
      }
      const recentVisitDateTime = convertTimestampToDate(this.client?.recentVisitDateTimeTS)
      const recentVisitDateTimeTS = convertDateToMomentUTC(recentVisitDateTime).startOf('day').unix()
      const currentTime = getStartOfTimezoneDateTS()
      const passDate = getDiffDateRange(recentVisitDateTimeTS, currentTime, 'day')
      return Math.round(passDate)
    },

    passDayText() {
      return this.$t('client-information.recent-visit-pass-date', { date: this.passDay })
    },

    clientId() {
      return this.client.clientId
    },

    clientTypes() {
      return [this.client.clientRatingName, this.client.clientGroupName].filter(Boolean)
    },

    loyaltyPoints() {
      if (this.client.familyId) {
        return this.client.familyLoyaltyPoints
      }

      return this.client.loyaltyPoints
    },

    familyBalance() {
      return this.client.account.familyBalance ?? 0
    },

    hasBalance() {
      return this.client.account.balance > 0 || this.hasFamilyBalance
    },

    hasFamilyBalance() {
      return this.client.account.familyId && this.client.account.familyBalance > 0
    },

    isPetSalon() {
      return this.shop_data.business_type_code === BUSINESS_TYPE_CODE.PET_SALON
    },

    renderClientAge() {
      const year = this.client?.birthYear
      const month = this.client?.birthMonth
      const day = this.client?.birthDD
      const birthday = this.client?.birthday

      return calculateClientAge(year, month, day, birthday)
    },

    hasBookings() {
      return this.client.pastYearBooking
    },

    isShowFull() {
      return this.client.pastYearBooking && this.client.pastYearBooking.totalBooking <= MAX_BOOKING_SHOW_CLIENT_INFOR && (this.client.pastYearBooking.totalCancel > 0 || this.client.pastYearBooking.totalNoShow > 0)
    },

    renderPastYearSummary() {
      if (!this.isShowFull) return ''

      const rb = this.client?.pastYearBooking || {}
      const details = []

      if ((rb.totalCancel || 0) > 0)
        details.push(`${this.$t('bookings.past-year-canceled')} ${rb.totalCancel}`)

      if ((rb.totalNoShow || 0) > 0) {
        details.push(`<span class="red-color">${this.$t('bookings.past-year-no-show')} ${rb.totalNoShow}</span>`)
      }

      return details.length ? `(${details.join(', ')})` : ''
    },

    modalClass () {
      return ['modal-client-information', {
        'modal-client-information--mobile': this.isMobileDevice,
      }]
    },

    registrationDateTime() {
      return convertDateToMomentUTC(this.client.registrationDate).toDate()
    },

    targetClient() {
      const targetClient = new ClientViewModel()
      targetClient.mapAllFieldFromApi(Client.revert(this.client))

      return targetClient.fields
    },

    isNotAllowSendMessage() {
      return this.client.allowedMessageType === options.allowed_message_type.not_message
    },

    isClientAnotherShop() {
      return this.client.shopId !== this.shop_data.shop_id
    },

    isBookingAnotherShop() {
      return this.client?.recentBooking?.shopId !== this.shop_data.shop_id
    },

    isHideInfo() {
      if (!this.client.clientId) return

      if (isEmpty(this.clientSetup)) return

      return getHideClientInfoPermission(
        this.clientSetup.environments?.contact_info_to_manager,
        this.clientSetup.environments?.contact_info_to_staff,
        this.registrationDateTime,
      )
    },

    isSendCall() {
      return !!this.getShopEnvironment?.data?.fields?.cid
    },

    formattedMobileNumber() {
      return formatMobileAndPhoneNumber(this.client.mobileNumber, this.isHideInfo)
    },

    formattedPhoneNumber() {
      return formatMobileAndPhoneNumber(this.client.phoneNumber, this.isHideInfo)
    },

    isUpcomingBooking () {
      const currentDateTime = convertDateToTimezone(new Date())
      const currentDateTimeTS = convertDateToTimeStamp(currentDateTime, false, true)

      const bookingDateStartTime = this.client?.recentBooking?.isStartTimeCrossDay
        ? (convertHoursToMinutes(this.client?.recentBooking?.startTime) + MINUTES_OF_24H) * SECOND_OF_1M
        : convertHoursToMinutes(this.client?.recentBooking?.startTime) * SECOND_OF_1M
      const currentBookingDateTime = convertTimeStampToUtcDatetime(this.client?.recentBooking?.bookingDateTS + bookingDateStartTime)
      const currentBookingDateTimeTS = convertDateToTimeStamp(currentBookingDateTime, false, true)

      return currentDateTimeTS < currentBookingDateTimeTS
    },

    clientRecentBookingShopName() {
      return this.client?.recentBooking?.shopName
    },

    notifyMaxNotesLengthComputed() {
      return BOOKING_DATA_RULES.MAX_BIG_NOTES_LENGTH
    },
  },

  watch: {
    clientId: {
      handler(clientId) {
        if (clientId && this.visible) {
          this.loadClientInventory()
        }
      },
    },
  },

  async created() {
    CalendarEventBus.$on('close-client-information-when-select-available-time', this.onCloseClientInformationWhenSelectAvailableTime)

    this.clientSetup = await this.$clientCacheMixin_getClientShopInfo({
      shopId: this.shop_data.shop_id,
    })
  },

  beforeDestroy() {
    CalendarEventBus.$off('close-client-information-when-select-available-time', this.onCloseClientInformationWhenSelectAvailableTime)

    this.setBookingClient(new ClientViewModel().fields)
  },

  methods: {
    ...mapActions('_calendar/clientInformation', [
      'openClientInformation',
      'closeClientInformation',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'updateClientNotes',
      'refreshClientInformation',
    ]),

    ...mapMutations('client', [
      'setClientAction',
      'setBookingClient',
    ]),

    ...mapMutations('_calendar/bookingAction', [
      'setBookingClients',
    ]),

    isAmOrPm,

    formatRecentVisitDate(date) {
      const convertTime = convertTimeStampToDate(convertTimeStampMinusLocalzone(date))
      if(date !== null && date !== 0)
        return moment(convertTime).format(options.standard_date_format.ymd)
    },

    onLoadForm () {
      this.client.clientId && this.loadClientInventory()
    },

    async onCancel () {
      const client = await this.getClient(this.client.clientId)
      this.setBookingClients(client)

      if (this.$refs.searchClient) {
        this.$refs.searchClient.clearSearchValue()
      }
      this.$emit('cancel')
    },

    onSendCall(isMobileNumber) {
      const valid = this.$isValidAllowCallingClient()
      if(!valid) {
        return
      }
      this.callNumber = isMobileNumber ? this.client.mobileNumber : this.client.phoneNumber
      this.$nextTick(() => this.showDialogById(this.sendCallModalId))
    },

    onSendMessage() {
      this.$nextTick(() => {
        this.showDialogById(this.sendMessageModalId)
      })
    },

    async getClientPriorityPrepaidGoods() {
      const salesApi = new SalesApi()
      const response = await salesApi.getPriorityPrepaidGoodsDisplayLiveAsync({
        client_id:       this.client.clientId,
        shop_id:         this.shop_data.shop_id,
        current_date_ts: convertDateToTimeStamp(new Date(), true),
      })

      if (response.is_ok) {
        return response.data
      }
      return
    },

    async loadClientInventory () {
      if (this.isLoadingInventory) {
        return
      }

      try {
        this.isLoadingInventory = true
        this.preLoader()

        const salesSetup = await this.$salesCacheMixin_getAllSalesSetup({ shopId: this.shop_data.shop_id })
        const priorityPrepaidGoodsDisplayDefault = salesSetup?.sales_general_setup?.priority_prepaid_goods_display_default ?? 0
        const response = await this.getClientPriorityPrepaidGoods() || {}
        const hasValidPrepaidCard = response.has_valid_prepaid_card
        const hasValidPrepaidService = response.has_valid_prepaid_service

        const [prepaidCardResponse, prepaidServiceResponse] = await Promise.all([
          this._MIXIN_clientBooking_loadClientPrepaidCards(false),
          this._MIXIN_clientBooking_loadClientPrepaidServices(false),
          this._MIXIN_clientBooking_loadClientHistoryBookings(false),
        ])

        const clientPrepaidCards = prepaidCardResponse?.data?.result?.items ?? []
        const clientPrepaidServices = prepaidServiceResponse?.data?.result?.items ?? []

        let targetTab = TAB_OPTIONS.bookings
        switch(priorityPrepaidGoodsDisplayDefault) {
          case PRIORITY_DISPLAY_CLIENT_PREPAID_GOODS.PREPAID_CARD_FIRST:
            if (hasValidPrepaidCard && clientPrepaidCards.length > 0) {
              targetTab = TAB_OPTIONS.prepaidCards
            } else if (hasValidPrepaidService && clientPrepaidServices.length > 0){
              targetTab = TAB_OPTIONS.prepaidServices
            }
            break

          case PRIORITY_DISPLAY_CLIENT_PREPAID_GOODS.PREPAID_SERVICE_FIRST:
            if (hasValidPrepaidService && clientPrepaidServices.length > 0) {
              targetTab = TAB_OPTIONS.prepaidServices
            } else if (hasValidPrepaidCard && clientPrepaidCards.length > 0) {
              targetTab = TAB_OPTIONS.prepaidCards
            }
            break

          default: {
            targetTab = TAB_OPTIONS.bookings
          }
        }

        this.activeTab = targetTab
        this.$nextTick(() => {
          this.isLoadingInventory = false
        })
      } catch (error) {
        this.isLoadingInventory = false
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleAddBooking() {
      const client = await this.getClient(this.client.clientId)
      this.setBookingClients(client)

      CalendarEventBus.$emit('show-search-available-times-popup-from-client-information')
    },

    handleSearch (searchFilter) {
      this.$emit('search', searchFilter)
    },

    handleAddClient () {
      this.setClientAction({
        action: options.form_actions.add,
      })

      this.isShowAddClientAction = true
    },

    handleAddClientActionHidden () {
      this.isShowAddClientAction = false
    },

    handleAddSuccessfullyClient (client) {
      this.$emit('added-client-successfully', client)
    },

    handleActiveTabChange (activeTab) {
      if (this.isLoadingInventory) {
        return
      }

      if (activeTab === TAB_OPTIONS.bookings) {
        this.filter.pageNumber = 1
        this._MIXIN_clientBooking_loadClientHistoryBookings()
      } else if (activeTab === TAB_OPTIONS.prepaidCards) {
        this._MIXIN_clientBooking_loadClientPrepaidCards()
      } else if (activeTab === TAB_OPTIONS.prepaidServices) {
        this._MIXIN_clientBooking_loadClientPrepaidServices()
      }
    },

    handleBookingsPageChange (pageNumber) {
      this.filter.pageNumber = pageNumber
      this._MIXIN_clientBooking_loadClientHistoryBookings()
    },

    async handleViewClientDetail () {
      try {
        this.preLoader()
        await this.openClientInformation({
          client: this.client,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleClientAvatarClick () {
      this.showDialogById(this.clientImageActionModalId)
    },

    async handleRefreshClient () {
      try {
        this.preLoader()

        await this.refreshClientInformation()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleViewSalesDetailFromOutstandingHistories() {
      this.isSalesModalVisible = true
      this.isOutstandingHistory = true
    },

    handleSalesDetailHidden() {
      this.isSalesModalVisible = false
      this.isOutstandingHistory = false
    },

    handleRefundDetailHidden() {
      this.isRefundModalVisible = false
    },

    handleClientNoteClicked () {
      if (!this.isClientAnotherShop) {
        this.isClientNotesVisible = true
      }
    },

    async handleClientNotesInput(notes) {
      try {
        this.preLoader()
        await this.updateClientNotes({ notes })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    goToBookingWithDateTS() {
      this.$emit('cancel')

      CalendarEventBus.$emit('view-booking-on-calendar', {
        data:              this.client.recentBooking,
        type:              'booking-list',
        isUpcomingBooking: true,
      })
    },

    onCloseClientInformationWhenSelectAvailableTime() {
      this.onCancel()
    },
  },
}
</script>

<style lang="scss">
@import "./modal-client-information.scss";
[parent-id="modal-client-information-1050"] {
  z-index: 1050 !important;
}
</style>
