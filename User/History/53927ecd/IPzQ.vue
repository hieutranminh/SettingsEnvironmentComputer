<template>
  <b-modal
    v-bind="$attrs"
    :id="modalId"
    :modal-class="modalId"
    :no-close-on-backdrop="true"
    :title="$t('bookings.unregistered-client-information')"

    static
    hide-footer
    @show="onLoadForm"
    @hide="handleCloseButtonClick"
  >
    <div class="booking-client-connect">
      <div class="client-info-and-contacts">
        <div class="client-info">
          <p class="client-name">
            {{ client.client_name }}
          </p>
          <p class="client-mobile-number">
            {{ formatMobileAndPhoneNumber(client.client_mobile_number, isHideClientInfo) }}
          </p>
        </div>
        <div class="client-contact-actions">
          <client-send-call-action-wrapper
            :client-mobile-phone-number="client.client_mobile_number"
          >
            <template #send-call-action="{ onSendCall }">
              <i
                class="call-w-icon"
                @click="onSendCall"
              />
            </template>
          </client-send-call-action-wrapper>

          <i
            v-if="!hideSendTextMessageButton"
            class="message-w-icon"
            @click="handleMessageButtonClick"
          />
        </div>
      </div>

      <div class="add-to-client-wrapper">
        <aha-button
          variant="blue"
          @click="handleAddNewClientClick(client)"
        >
          {{ $t('general.add-as-new-clients') }}
        </aha-button>
      </div>
    </div>

    <div class="connect-client-wrapper">
      <div class="connect-client__title">
        <div class="connect-client__title--squared" />
        <h3 class="connect-client__title--text">
          {{ $t('bookings.connect-to-existing-client') }}
        </h3>
      </div>

      <div class="connect-client__content content">
        <div class="content__filter-row">
          <label :class="clientConnectActionLabel">
            {{ $t('bookings.client-matching') }}
          </label>

          <div class="content__filter-row--action button-group">
            <template v-for="group in buttonGroups">
              <div
                :key="group.id"
                class="button-group__item"
              >
                <aha-button @click="handleSearchClientButtonClick(group.id)">
                  {{ $t(group.buttonText) }}
                </aha-button>
              </div>
            </template>
          </div>
        </div>

        <div class="content__filter-row client-connect-search">
          <label :class="clientConnectActionLabel">{{ $t('bookings.client-search') }}</label>

          <div class="content__filter-row--action client-connect-search__form">
            <input
              v-model="inputSearchValue"
              :placeholder="$t('bookings.client-name-or-mobile')"
              class="form-control"

              @keydown.enter.prevent="handleSearchClientClick"
            >

            <aha-button
              variant="cyan"
              class="btn-search"
              @click="handleSearchClientClick"
            >
              <i class="btn-search-white" />
            </aha-button>
          </div>
        </div>

        <div class="content___table client-connect-table">
          <div class="client-connect-table__intro">
            <span class="client-connect-table__intro--text">
              {{ tableIntroText }}<template v-if="!isClientSearch">:</template>
            </span>
            <span class="client-connect-table__intro--number">{{ tableTotalItems }} {{ $t('bookings.clients') }}</span>
          </div>

          <view-table
            :data="tableData"
            @change-page="onChangePage"
          >
            <template
              slot="recentVisitDateTimeTS"
              slot-scope="{ row }"
            >
              {{ formatRecentVisitDateTime(row) }}
            </template>

            <template
              slot="mobileNumber"
              slot-scope="{ row }"
            >
              {{ formatHideInfoCol(row.mobileNumber, row.registrationDate) }}
            </template>

            <template
              slot="registrationDate"
              slot-scope="{ row }"
            >
              {{ formatDate(row.clientInputDate) }}
            </template>

            <template
              slot="edit"
              slot-scope="{ row }"
            >
              <aha-button @click="handleEditButtonClick(options.form_actions.edit, row.clientId)">
                {{ $t('general.edit') }}
              </aha-button>
            </template>

            <template
              slot="clientId"
              slot-scope="{ row }"
            >
              <aha-button @click="handleConnectButtonClick(row)">
                {{
                  $t('clients.connect')
                }}
              </aha-button>
            </template>
          </view-table>
        </div>
      </div>

      <div
        v-if="isShowDescription"
        class="client-connect-table__description"
      >
        <p
          v-for="(description, index) in clientConnectDescriptions"
          :key="`client-connect-description-${index}`"
          v-html="description"
        />
      </div>
    </div>

    <client-action
      :visible="isClientActionVisible"

      @hidden="hideClientActionModal"
      @reload-page="updatedClient"
    />

    <error-box :errors="errors" />

    <alert-confirm
      :id="alertConnectId"
      :label_no="$t('general.cancel')"
      :label_yes="$t('general.confirm')"
      :data_alerts="[$t('bookings.booking-will-be-changed-to-select-client-booking')]"
      yes-button-variant="blue"

      @confirm="onConnectClient"
    />

    <footer class="modal-footer">
      <aha-button
        variant="blue-light"
        @click="handleCloseButtonClick"
      >
        {{ $t('general.close') }}
      </aha-button>
    </footer>

    <send-message-modal
      :modal-id="sendMessageModalId"
      :is-hide-call-number="isHideClientInfo"
      :call-number="client.client_mobile_number"
      :type="options.messages_enums.send_page.unregister_client"
    />
  </b-modal>
</template>

<script>
// Constant
import { options } from 'OptionsHelpers'
import { CLIENTS_ENUMS } from 'Constant'
import { common_options } from 'Options/common-options'
import { sales_options } from 'Options/sales-options.js'

// Apis
import BookingApi from 'API/bookings/booking-api'

// View Model
import ClientViewModel from 'ViewModels/clients/client-view-model'

// Model
import Client from 'Models/client/client'

// Mixins
import ClientMixin from 'Modules/clients/mixins/client.js'
import BookingMixin from 'Modules/calendar/mixins/booking'
import ClientCacheMixin from 'Modules/cache/mixins/client_cache'

// Components
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import ErrorBox from 'CommonComponents/form/error-box/error-box.vue'
import ClientAction from 'Components/clients/client-action/client-action.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import RadioGroup from 'CommonComponents/form/radio/radio-group/radio-group.vue'
import SelectHour from 'CommonComponents/form/select/select-hour/select-hour.vue'
import BtnActionGroup from 'CommonComponents/button/btn-action-group/btn-action-group.vue'
import SendMessageModal from 'Components/messages/send-message-modal/send-message-modal.vue'
import ClientSendCallActionWrapper from 'Modules/clients/components/client-send-call-action-wrapper/client-send-call-action-wrapper.vue'

// Utilities
import {
  convertDateToTimeStamp,
  isPermittedBySetupRole,
  formatMobileAndPhoneNumber,
  getHideClientInfoPermission,
} from 'CommonHelpers'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import { ApiError } from 'HTTPHelpers'
import cloneDeep from 'lodash/cloneDeep'
import { formatTSToTimezoneDate } from 'DatetimeHelpers'
import { mapGetters, mapActions, mapMutations } from 'vuex'

const OPTIONS_LIST = {
  [options.booking.options_connect_client_search_condition.all]: {
    id:         options.booking.options_connect_client_search_condition.all,
    text:       'bookings.client-with-same-name-and-mobile',
    buttonText: 'bookings.client-name-and-mobile',
  },

  [options.booking.options_connect_client_search_condition.name]: {
    id:         options.booking.options_connect_client_search_condition.name,
    text:       'bookings.client-with-only-same-name',
    buttonText: 'bookings.client-name',
  },

  [options.booking.options_connect_client_search_condition.mobile]: {
    id:         options.booking.options_connect_client_search_condition.mobile,
    text:       'bookings.client-with-only-mobile',
    buttonText: 'bookings.mobile-number',
  },
}

const TABLE_DATA_FIELDS = [
  {
    width:    '15%',
    sortable: false,
    field:    'memberNumber',
    label:    'clients.client-number',
  },

  {
    width:    '15%',
    sortable: false,
    field:    'clientName',
    label:    'clients.client-name',
  },

  {
    width:    '15%',
    expand:   true,
    sortable: false,
    field:    'mobileNumber',
    label:    'clients.mobile-number',
  },

  {
    width:    '15%',
    expand:   true,
    sortable: false,
    thClass:  'recent-visit',
    field:    'recentVisitDateTimeTS',
    label:    'bookings.recent-visit-date',
  },

  {
    width:    '15%',
    expand:   true,
    sortable: false,
    field:    'registrationDate',
    label:    'general.registered-date',
  },
  {
    width:    '10%',
    expand:   true,
    sortable: false,
    field:    'edit',
    label:    'general.edit',
  },
  {
    width:    '15%',
    expand:   true,
    sortable: false,
    field:    'clientId',
    label:    'clients.connect-client',
  },
]

const TABLE_DATA_OPTIONS = {
  pagination: true,
  table_type: options.view_table_types.client,
}

export default {
  components: {
    ErrorBox,
    ViewTable,
    RadioGroup,
    SelectHour,
    ClientAction,
    AlertConfirm,
    BtnActionGroup,
    SendMessageModal,
    ClientSendCallActionWrapper,
  },

  extends: ComponentBase,

  mixins: [
    ClientMixin,
    BookingMixin,
    ClientCacheMixin,
  ],

  props: {
    modalId: {
      type:    String,
      default: 'booking-connect-client-action-modal',
    },
  },

  data() {
    return {
      options,
      selectClient: null,

      clientData: [],
      pagination: {
        total_pages: 1,
        total_items: 0,
      },

      tableSearch: {
        shop_id:            0,
        search_keyword:     '',
        search_all_branchs: false,
        page:               CLIENTS_ENUMS.PAGE.ADD_BOOKING,
        search_condition:   options.clients_enums.client_search_condition_type.name_or_phone,
      },

      tablePagination: {
        page_number: 1,
        page_size:   common_options.pagination.default,
      },

      clientSetup: {},

      client: {
        client_id:                  0,
        client_name:                '',
        client_shop_id:             0,
        client_shop_name:           '',
        client_member_number:       '',
        client_mobile_number:       '',
        client_first_visit_date_ts: 0,
      },

      inputSearchValue:      '',
      isClientSearch:        false,
      isClientActionVisible: false,
      searchCondition:       options.booking.options_connect_client_search_condition.all,

    }
  },

  computed: {
    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction',
    }),

    alertConnectId() {
      return 'client-connect-action-alert'
    },

    clientConnectActionLabel() {
      return [
        'content__filter-row--label',
        { 'content__filter-row--label-ko': this.$i18n.locale === 'ko' },
      ]
    },

    tableData() {
      return {
        rows:       this.clientData,
        fields:     TABLE_DATA_FIELDS,
        options:    TABLE_DATA_OPTIONS,
        pagination: this.pagination,
      }
    },

    tableTotalItems() {
      return this.pagination.total_items
    },

    buttonGroups() {
      return Object.values(OPTIONS_LIST)
    },

    tableIntroText() {
      if (this.isClientSearch) {
        return this.$t('bookings.client-search-total')
      }

      const modeText = OPTIONS_LIST?.[this.searchCondition]?.text || ''

      if (modeText) {
        return this.$t(modeText)
      }

      return ''
    },

    descriptionClass() {
      return [
        'client-connect-table__description',
      ]
    },

    isSearchSameNameandMobile() {
      return this.searchCondition === options.booking.options_connect_client_search_condition.all
    },

    isHideClientInfo() {
      return this.$bookingMixin_checkHideClientInformation(this.x_booking_action.data)
    },

    hideSendTextMessageButton() {
      if(!isEmpty(this.clientSetup)) {
        if(this.clientSetup.environments.allow_send_text_message_to_staff) {
          return false
        }

        return !isPermittedBySetupRole(sales_options.security_level_enum.manager_or_higher)
      }

      return true
    },

    isShowDescription() {
      return !this.isSearchSameNameandMobile || this.isClientSearch
    },

    clientConnectDescriptions() {
      return [
        this.$t('bookings.connect-client-description-first'),
        this.$t('bookings.connect-client-description-second'),
      ]
    },

    sendMessageModalId() {
      return 'send-message-modal-from-booking-connect-client-action'
    },
  },

  created() {
    this.initClientSetup()
  },

  methods: {
    formatMobileAndPhoneNumber,

    ...mapActions('alert', ['removeAlertsData']),

    ...mapMutations('booking', ['updateBooking']),

    ...mapActions('booking', ['setBookingActionData']),

    ...mapActions('client_connect', [
      'initConnectingClientToBooking',
      'resetConnectingClientToBooking',
    ]),

    ...mapActions('client', [
      'setClientActionDataAsync',
    ]),

    async initClientSetup() {
      this.clientSetup = await this.$clientCacheMixin_getClientShopInfo({
        shopId: this.shop_data.shop_id,
      })

      if (this.isNullObject(this.clientSetup)) {
        this.showMissingClientsSetupAlert()
      }
    },

    hideModal() {
      this.resetConnectClientModal()
      this.hideDialogById(this.modalId)
      this.$emit('hide')
    },

    handleCloseButtonClick() {
      this.resetConnectingClientToBooking()
      this.hideModal()
    },

    resetConnectClientModal() {
      this.selectClient = null
      this.inputSearchValue = ''
      this.isClientSearch = false
      this.isClientActionVisible = false
      this.tablePagination.page_number = 1
      this.searchCondition = options.booking.options_connect_client_search_condition.all

      this.resetTable()
    },

    resetTable() {
      this.clientData = []
      this.pagination = Object.assign({}, {
        total_pages: 1,
        total_items: 0,
      })
    },

    async onLoadForm() {
      this.setClientData()
      this.loadClients()
    },

    setClientData() {
      this.client.client_id = this.x_booking_action.data.client_id
      this.client.client_name = this.x_booking_action.data.client_name
      this.client.client_shop_id = this.x_booking_action.data.client_shop_id
      this.client.client_shop_name = this.x_booking_action.data.client_shop_name
      this.client.client_member_number = this.x_booking_action.data.client_member_number
      this.client.client_mobile_number = this.x_booking_action.data.client_mobile_number
      this.client.client_first_visit_date_ts = this.x_booking_action.data.client_first_visit_date_ts
    },

    formatHideInfoCol(mobile, registrationDate) {
      const isHideClientInfo = !isEmpty(this.clientSetup) && getHideClientInfoPermission(
        this.clientSetup.environments.contact_info_to_manager,
        this.clientSetup.environments.contact_info_to_staff,
        registrationDate,
      )

      return formatMobileAndPhoneNumber(mobile, isHideClientInfo)
    },

    async loadClients() {
      try {
        this.preLoader()

        const payload = {
          shopId:                           this.shop_data.shop_id,
          clientName:                       this.client.client_name,
          pageSize:                         this.tablePagination.page_size,
          pageNumber:                       this.tablePagination.page_number,
          mobileNumber:                     this.client.client_mobile_number,
          searchClientConnectableCondition: this.searchCondition,
        }

        const result = await this.$_client_clientConnectable(payload)

        this.clientData = result.items
        this.pagination = result.pagination
      } catch (error) {
        if(error?.isApiError()) {
          this.resetTable()
        }

        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleSearchClientClick() {
      this.isClientSearch = true
      this.tablePagination.page_number = 1
      this.tableSearch.shop_id = this.shop_data.shop_id
      this.tableSearch.search_keyword = this.inputSearchValue

      this.searchClientAsync()
    },

    async searchClientAsync(){
      try {
        this.preLoader()

        const payload = {
          searchInBranches: false,
          shopId:           this.tableSearch.shop_id,
          pageSize:         this.tablePagination.page_size,
          pageNumber:       this.tablePagination.page_number,
          searchCondition:  this.tableSearch.search_condition,
          searchValue:      (this.tableSearch.search_keyword || '').trim(),
        }

        const result = await this.$_client_clientSearch(payload)

        this.clientData = result.items || []
        this.pagination = result.pagination || {}
      } catch (error) {
        if(error?.isApiError()) {
          this.resetTable()
        }

        this.errors = error.message
      } finally {
        this.preLoader(false)
      }
    },

    onChangePage(pageNumber) {
      this.tablePagination.page_number = pageNumber
      this.updatedClient()
    },

    handleAddNewClientClick(client) {
      this.initConnectingClientToBooking(this.x_booking_action.data)
      this.$emit('on-click-add-to-client', client)
    },

    async handleConnectButtonClick(client) {
      const clientData = new ClientViewModel()
      clientData.mapAllFieldFromApi(Client.revert(client))
      this.selectClient = clientData.fields

      if (!this.selectClient.mobile_number) {
        this._showDialogAlert(this.$t('bookings.connect-client-no-mobile-number-alert'))
        return
      }

      this.showDialogById(this.alertConnectId)
    },

    async onConnectClient() {
      try {
        const booking = cloneDeep(this.x_booking_action.data)

        // update booking
        const payload = {
          booking_id:                  booking.id,
          shop_id:                     booking.shop_id,
          is_add_new_client:           false,
          client_id:                   this.selectClient.id,
          client_shop_id:              booking.shop_id,
          client_shop_name:            booking.shop_name,
          session_token:               booking.session_token,
          shop_location:               booking.shop_location,
          client_name:                 this.selectClient.client_name,
          client_member_number:        this.selectClient.member_number,
          client_mobile_number:        this.selectClient.mobile_number,
          client_registration_date_ts: convertDateToTimeStamp(this.selectClient.registration_date),
        }

        // update booking
        this.preLoader()
        this.removeAlertsData()

        const bookingApi = new BookingApi()
        const response = await bookingApi.updateBookingClientAsync(payload)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.$emit('update-booking-connect-client', response?.data?.items)

        this.hideModal()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleEditButtonClick(action, clientId = 0) {
      try {
        this.preLoader()

        const payload = {
          action:    action,
          client_id: clientId,
          shop_id:   this.shop_data.shop_id,
        }

        const response = await this.setClientActionDataAsync(payload)

        if(!response?.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.isClientActionVisible = true
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleSearchClientButtonClick(clientMode) {
      this.inputSearchValue = ''
      this.isClientSearch = false
      this.searchCondition = clientMode
      this.tablePagination.page_number = 1
      this.loadClients()
    },

    hideClientActionModal() {
      this.isClientActionVisible = false
    },

    updatedClient() {
      if (!this.isClientSearch) {
        this.loadClients()
        return
      }

      this.searchClientAsync()
    },

    handleMessageButtonClick() {
      this.showDialogById(this.sendMessageModalId)
    },

    formatDate(date) {
      return moment(date).format(options.standard_date_format.ymd)
    },

    formatRecentVisitDateTime(row) {
      if(!row.recentVisitDateTimeTS) {
        return ''
      }

      return formatTSToTimezoneDate(row.recentVisitDateTimeTS)
    },
  },
}
</script>

<style lang="scss">
@import './client-connect-action.scss';
</style>
