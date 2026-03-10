<template>
  <div :class="clientConnectableClass">
    <unregistered-client
      :client-name="clientName"
      :client-mobile-number="clientMobileNumber"
      class="client-connectable__unregistered-client"
      @add-as-new-client="handleAddAsNewClientClick"
    />

    <div class="client-connectable__form">
      <h3 class="client-connectable__form-title">
        {{ $t('bookings.connect-to-existing-client') }}
      </h3>

      <div class="client-connectable__form-group client-connectable__form-group--client-matching">
        <label class="client-connectable__form-label">{{ $t('bookings.client-matching') }}</label>

        <div class="client-connectable__form-control">
          <client-connectable-matching
            :value="filter.searchClientConnectableCondition"
            @input="handleSearchClientConnectableConditionChange"
          />
        </div>
      </div>

      <div class="client-connectable__form-group client-connectable__form-group--client-search">
        <label class="client-connectable__form-label">{{ $t('bookings.client-search') }}</label>

        <div class="client-connectable__form-control">
          <client-connectable-search
            ref="clientConnectableSearch"
            :value="filter.searchValue"
            @submit="handleSearchClientSubmit"
          />

          <a-checkbox
            v-if="isSearchAllBranchesShow"
            v-model="filter.searchInBranches"
            @change="handleSearchInBranchesChange"
          >
            {{ $t('bookings.search-in-all-branches') }}
          </a-checkbox>
        </div>
      </div>
    </div>

    <div class="client-connectable__total">
      <strong>{{ totalText }}:</strong> {{ totalConnectableClients }} {{ $t('bookings.clients') }}
    </div>

    <client-connectable-table
      :items="items"
      :paging-info="pagingInfo"
      class="client-connectable__table"
      @edit-client="handleClientEdit"
      @change-page="handlePageNumberChange"
      @connect-client="handleClientConnect"
    />

    <pagination
      :pagination="pagination"
      class="client-connectable__pagination"
      @change-page="handlePageNumberChange"
    />

    <div
      v-if="isHintShown"
      class="client-connectable__hint"
    >
      <p v-html="$t('bookings.connect-client-description-first')" />
      <p>{{ $t('bookings.connect-client-description-second') }}</p>
    </div>

    <div class="client-connectable__footer">
      <a-button
        variant="primary"
        class="client-connectable__footer-button"
        @click="$emit('close', $event)"
      >
        {{ $t('general.close') }}
      </a-button>
    </div>

    <client-action
      :visible="isClientActionVisible"
      @deleted="handleClientDeleted"
      @hidden="handleClientActionHidden"
      @added-client-successfully="handleClientAdded"
      @updated-client-successfully="handleClientUpdated"
    />
  </div>
</template>

<script>
// Utilities
import i18n from 'Translate'
import { ApiError } from 'HTTPHelpers'
import { mapActions, mapMutations } from 'vuex'

// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ACheckbox from 'Modules/aha/a-checkbox/a-checkbox.vue'
import Pagination from 'CommonComponents/pagination/pagination.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import UnregisteredClient from '../unregistered-client/unregistered-client.vue'
import ClientConnectableTable from '../client-connectable-table/client-connectable-table.vue'
import ClientConnectableSearch from '../client-connectable-search/client-connectable-search.vue'
import ClientConnectableMatching from '../client-connectable-matching/client-connectable-matching.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Apis
import * as clientApi from 'Modules/api/client/client-api'
import { updateIncludeOtherBranches } from 'Modules/api/authentication/authentication-api'

// Constant
import { options } from 'OptionsHelpers'
import { OPTIONS_CONNECT_CLIENT_SEARCH_CONDITION } from 'Constant'

export default {
  components: {
    AButton,
    ACheckbox,
    Pagination,
    UnregisteredClient,
    ClientConnectableTable,
    ClientConnectableSearch,
    ClientConnectableMatching,

    ClientAction: () => import('Components/clients/client-action/client-action.vue'),
  },

  extends: ComponentBase,

  mixins: [DeviceMixin],

  props: {
    value: {
      type:    Object,
      default: () => ({
        clientName:         null,
        clientMobileNumber: null,
      }),
    },
  },

  data() {
    return {
      clientName:         null,
      clientMobileNumber: null,

      searchType: 'connectable', // connectable, clients

      filter: {
        pageNumber: 1,
        pageSize:   options.pagination.default,

        searchClientConnectableCondition: OPTIONS_CONNECT_CLIENT_SEARCH_CONDITION.ALL,

        searchValue:      '',
        searchInBranches: false,
        searchCondition:  options.booking.options_connect_client_search_condition.all,
      },

      items: [],

      pagingInfo: {
        pageSize:   0,
        pageNumber: 1,
        totalItems: 0,
      },

      isClientActionVisible: false,
    }
  },

  computed: {
    totalText() {
      if (this.searchType === 'clients') {
        return this.$t('bookings.client-search-total')
      }

      if (this.filter.searchClientConnectableCondition === OPTIONS_CONNECT_CLIENT_SEARCH_CONDITION.NAME) {
        return this.$t('bookings.client-with-only-same-name')
      }

      if (this.filter.searchClientConnectableCondition === OPTIONS_CONNECT_CLIENT_SEARCH_CONDITION.MOBILE) {
        return this.$t('bookings.client-with-only-mobile')
      }

      return this.$t('bookings.client-with-same-name-and-mobile')
    },

    totalConnectableClients() {
      return this.pagingInfo.totalItems ?? 0
    },

    isHintShown() {
      return this.searchType !== 'connectable' || this.filter.searchClientConnectableCondition !== OPTIONS_CONNECT_CLIENT_SEARCH_CONDITION.ALL
    },

    pagination() {
      return {
        page_size:   this.pagingInfo.pageSize,
        page_number: this.pagingInfo.pageNumber,
        total_items: this.pagingInfo.totalItems,
        total_pages: Math.ceil(this.pagingInfo.totalItems / this.pagingInfo.pageSize),
      }
    },

    clientConnectableClass() {
      return ['client-connectable', {
        'client-connectable--mobile': this.isMobileDevice,
      }]
    },

    isSearchAllBranchesShow() {
      return this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client
    },
  },

  watch: {
    'x_user.is_client_searched_in_branches': {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.filter.searchInBranches = this.x_user.is_client_searched_in_branches
        }
      },
    },

    value: {
      deep:      true,
      immediate: true,
      handler(value) {
        this.clientName = value.clientName
        this.clientMobileNumber = value.clientMobileNumber

        this.loadClients()
      },
    },
  },

  methods: {
    ...mapActions('client', [
      'setClientActionDataAsync',
    ]),

    ...mapMutations('client', [
      'setClientAction',
    ]),

    ...mapMutations('authentication', [
      'setIsClientSearchedInBranches',
    ]),

    loadSearchClients() {
      return clientApi.clientSearch({
        searchCondition:  1,
        searchInBranches: this.filter.searchInBranches,
        shopId:           this.shop_data.shop_id,
        pageSize:         this.filter.pageSize,
        pageNumber:       this.filter.pageNumber,
        searchValue:      this.filter.searchValue,
      })
    },

    loadConnectableClients() {
      return clientApi.getClientConnectable({
        clientName:                       this.clientName,
        searchInBranches:                 this.filter.searchInBranches,
        pageSize:                         this.filter.pageSize,
        shopId:                           this.shop_data.shop_id,
        pageNumber:                       this.filter.pageNumber,
        mobileNumber:                     this.clientMobileNumber,
        searchClientConnectableCondition: this.filter.searchClientConnectableCondition,
      })
    },

    async loadClients() {
      try {
        this.preLoader()

        const response = await (async () => {
          if (this.searchType === 'connectable') {
            return this.loadConnectableClients()
          }
          return this.loadSearchClients()
        })()

        this.items = response?.data?.result?.items ?? []
        this.pagingInfo = response?.data?.result?.pagingInfo ?? {}
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handlePageNumberChange(pageNumber) {
      this.filter.pageNumber = pageNumber
      this.loadClients()
    },

    handleSearchClientSubmit(searchValue) {
      this.searchType = 'clients'

      this.filter.pageNumber = 1
      this.filter.searchValue = searchValue

      this.loadClients()
    },

    handleSearchClientConnectableConditionChange(searchClientConnectableCondition) {
      this.searchType = 'connectable'

      this.filter.pageNumber = 1
      this.filter.searchValue = ''
      this.filter.searchClientConnectableCondition = searchClientConnectableCondition

      this.loadClients()
    },

    handleClientActionHidden() {
      this.isClientActionVisible = false
    },

    async handleClientEdit(data) {
      try {
        this.preLoader()

        const response = await this.setClientActionDataAsync({
          client_id: data.clientId,
          shop_id:   this.shop_data.shop_id,
          action:    options.form_actions.edit,
        })

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

    handleClientUpdated() {
      this.loadClients()
    },

    handleAddAsNewClientClick() {
      this.setClientAction({
        client_name:   this.clientName,
        action:        options.form_actions.add,
        mobile_number: this.clientMobileNumber,
      })

      this.isClientActionVisible = true
    },

    connectClient(data) {
      this.$emit('connect', data)
    },

    async handleClientConnect(client) {
      try {
        const isConfirmed = await this._showDialogConfirm(i18n.t('bookings.booking-will-be-changed-to-select-client-booking'))
        if (!isConfirmed) return

        const data = {
          clientId:                 client.clientId,
          clientShopId:             client.shopId,
          clientName:               client.clientName,
          clientMemberNumber:       client.memberNumber,
          clientMobileNumber:       client.mobileNumber,
          clientRegistrationDateTS: client.clientInputDateTimeTS,
        }

        this.connectClient(data)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    /**@description getConnectableClientInformation is used for convert ClientViewModel to connectable client result */
    getConnectableClientInformation(client) {
      return {
        clientId:                 client.id,
        clientShopId:             client.shop_id,
        clientName:               client.client_name,
        clientMemberNumber:       client.member_number,
        clientMobileNumber:       client.mobile_number,
        clientRegistrationDateTS: client.client_input_date_ts,
      }
    },

    handleClientAdded(client) {
      const data = {
        isAddNewClient: true,
        ...this.getConnectableClientInformation(client),
      }

      this.connectClient(data)
    },

    handleClientDeleted() {
      this.loadClients()
    },

    async handleSearchInBranchesChange() {
      this.searchType = 'clients'

      if (
        this.filter.searchInBranches &&
        this.filter.searchCondition === options.clients_enums.client_search_condition_type.notes
      ) {
        this.filter.searchCondition = options.clients_enums.client_search_condition_type.name_or_phone
      }

      const payload = {
        userID:                     this.x_user?.user_name,
        shopId:                     this.shop_data?.shop_id,
        isClientSearchedInBranches: this.filter?.searchInBranches,
      }

      try {
        this.preLoader()
        await updateIncludeOtherBranches(payload)
        this.setIsClientSearchedInBranches(this.filter?.searchInBranches)

        await this.handleSearchClientSubmit(this.$refs.clientConnectableSearch.searchValue)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-connectable-form.scss";
</style>
