<template>
  <div class="calendar-search-client">
    <search-client
      v-if="!isMobileDevice"
      ref="searchClient"
      :has-quick-search="true"
      :has-recently-searched="true"
      :has-empty-client-found-message="true"
      :is-modal-search-open="isShowSearchClient"
      :filter-data="searchFilter"
      @search="handleSearch"
      @client-click="handleClientClick"
    />

    <!-- Modal - Search Client -->
    <modal-search-client
      ref="modalSearchClient"
      :list-data="items"
      :pagination-data="pagination"
      :filter-data="searchFilter"
      :visible="isShowSearchClient"
      @cancel="onCancelModalSearchClient"
      @selected-client="handleSelectedClient"
      @search-in-branches-change="handleSearchInBranchesChange"
      @added-client-successfully="handleAddSuccessfullyClient"
    />

    <!-- Modal - Client Information -->
    <template v-if="isShowClientInformation">
      <modal-client-information
        ref="modalClientInformation"
        :filter-data="searchFilter"
        :visible="isShowClientInformation"
        :is-modal-search-open="isShowSearchClient"
        @search="handleSearch"
        @cancel="onCancelModalClientInformation"
        @added-client-successfully="handleAddSuccessfullyClient"
      />
    </template>
  </div>
</template>

<script>
// Utilities
import {mapActions, mapState} from 'vuex'
import { CalendarEventBus } from 'Modules/calendar/utils'
// API
import * as clientApi from 'Modules/api/client/client-api'
// Components
import SearchClient from 'Modules/calendar/components/search-client/search-client.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ModalSearchClient from 'Modules/calendar/components/modal-search-client/modal-search-client.vue'
import ModalClientInformation from 'Modules/calendar/components/modal-client-information/modal-client-information.vue'
// Options
import { options } from 'OptionsHelpers'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10

export default {
  components: {
    SearchClient,
    ModalSearchClient,
    ModalClientInformation,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  data () {
    return {
      items:                   [],
      pagination:              {},
      searchFilter:            {},
      isShowSearchClient:      false,
      isShowClientInformation: false,
    }
  },

  computed: {
    ...mapState('_calendar/bookingAction', [
      'client',
    ]),

    isRegisteredClient() {
      return this.client?.clientId && this.client?.clientId > 0
    },
  },

  mounted() {
    CalendarEventBus.$on('close-client-search-information', this.handleCloseClientSearchInformation)
    CalendarEventBus.$on('client-lookup-from-aha-ai', this.handleClientLookupFromAhaAi)
  },

  methods: {
    ...mapActions('_calendar/bookingAction', [
      'getClient',
    ]),
    ...mapActions('clientRecentlySelected', [
      'addClient',
    ]),

    async handleSearch(searchFilter) {
      this.searchFilter = searchFilter
      await this.loadClientSearch(this.searchFilter)

      if (this.items.length === 0 && this.searchFilter.searchValue) {
        this.$refs.searchClient.emptyClientVisible = true

        if (this.$refs.modalClientInformation) {
          this.$refs.modalClientInformation.$refs.searchClient.emptyClientVisible = true
        }
        return
      }

      // Open popup client detail if only 1 client found
      if (this.items.length === 1) {
        this.isShowClientInformation = true

        await this.handleGetClient(this.items[0])
        return
      }

      // Open popup client list if more than 1 client found
      this.isShowSearchClient = true
    },

    handleCloseClientSearchInformation () {
      this.isShowClientInformation = false
    },

    beforeDestroy() {
      CalendarEventBus.$off('close-client-search-information', this.handleCloseClientSearchInformation)
      CalendarEventBus.$off('client-lookup-from-aha-ai', this.handleClientLookupFromAhaAi)
    },

    handleClientClick (client) {
      this.isShowClientInformation = true

      this.handleGetClient(client)
    },

    handleSelectedClient (client) {
      this.isShowSearchClient = false
      this.isShowClientInformation = true

      this.handleGetClient(client.row)
    },

    handleAddSuccessfullyClient(client) {
      this.isShowSearchClient = false
      this.isShowClientInformation = true

      this.handleGetClient({ clientId: client.id, shopId: client.shop_id })
    },

    async handleGetClient (client) {
      const { clientId, shopId } = client

      try {
        this.preLoader()
        const client = await this.getClient({ shopId, clientId, includeRecentInfo: true })
        await this.addClient(client)
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleSearchInBranchesChange(searchFilter) {
      this.searchFilter = searchFilter
    },

    async loadClientSearch(searchFilter) {
      try {
        const response = await clientApi.clientSearch({
          ...searchFilter,
          pageNumber: DEFAULT_PAGE_NUMBER,
          pageSize:   DEFAULT_PAGE_SIZE,
          shopId:     this.shop_data.shop_id,
        })

        this.items = response?.data?.result?.items ?? []
        this.pagination = response?.data?.result?.pagingInfo ?? {}
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.isSearching = false
      }
    },

    onCancelModalSearchClient() {
      this.isShowSearchClient = false
      this.$refs.searchClient.clearSearchValue()
    },

    onCancelModalClientInformation() {
      this.isShowClientInformation = false
      this.$refs.searchClient.clearSearchValue()
    },

    async handleClientLookupFromAhaAi(clientLookupResult) {
      this.searchFilter = {
        searchValue:      clientLookupResult.searchValue,
        // Waiting BE support field searchCondition & searchInBranches
        searchCondition:  options.clients_enums.client_search_condition_type.name_or_phone,
        searchInBranches: this.x_user?.is_client_searched_in_branches ?? false,
      }

      this.items = clientLookupResult.result.items ?? []
      this.pagination = clientLookupResult.result.pagingInfo ?? {}

      // Open popup client detail if only 1 client found
      if (this.items.length === 1) {
        this.isShowClientInformation = true

        await this.handleGetClient(this.items[0])
        return
      }

      // Open popup client list if more than 1 client found
      this.isShowSearchClient = true

    },
  },
}
</script>

<style lang="scss" scoped>
@import './calendar-search-client.scss';
</style>
