<template>
  <div
    id="search-client"
    ref="searchClient"
    :class="searchClientClass"
  >
    <form
      class="search-client__form"
      @submit="handleSearch"
    >
      <b-dropdown
        v-if="hasConditionSearch"
        class="search-client__condition-dropdown"
      >
        <b-dropdown-item
          v-for="{ value, text } in clientSearchConditionOptions"
          :key="`search_condition_${value}`"
          @click.prevent="() => handleSearchConditionChange(value)"
        >
          {{ text }}
        </b-dropdown-item>
      </b-dropdown>

      <div class="search-client__input">
        <a-input
          v-model="filter.searchValue"
          :autofocus="isDesktopDevice"
          :placeholder="placeholderText"
          autocomplete="off"
          @input="handleClientSearchInput"
          @keydown="handleClientSearchKeyDown"
        />

        <template v-if="hasRecentlySearched">
          <a
            id="recently-searched-clients"
            :class="recentlySelectedToggle"
            :title="$t('clients.recently-searched-clients')"
            @click.prevent="handleRecentlySelectedToggleClick"
          >
            <div class="recent-selected-clients" />
          </a>

          <b-tooltip
            triggers="hover"
            container="#calendar"
            target="recently-searched-clients"
          >
            {{ $t('clients.recently-searched-clients') }}
          </b-tooltip>
        </template>
      </div>

      <a-button
        type="submit"
        variant="primary"
        class="a-button--search"
      >
        <b-icon-search />
      </a-button>
    </form>

    <!-- Recently search clients -->
    <div
      v-if="recentlySelectedVisible"
      class="search-client__recently-selected"
    >
      <recently-search-clients @client-click="handleRecentlySelectedClientClick" />
    </div>

    <!-- Suggestion clients -->
    <div
      v-if="isShowSuggestion"
      class="search-client__suggestion"
    >
      <ul class="search-client__suggestion-list">
        <li
          v-for="item in suggestionItems"
          :key="`suggest_${item.clientId}`"
          class="search-client__suggestion-item"
        >
          <sugguestion-client
            v-bind="item"
            :class="suggestionClientClass(item)"
            @click="handleSuggestionClientClick"
          />
        </li>
      </ul>

      <a
        v-if="hasMore"
        class="search-client__suggestion-link"
        @click.prevent="handleViewMoreClick"
      >
        {{ $t('bookings.view-more') }}
      </a>
    </div>

    <!-- Empty client found -->
    <div
      v-if="emptyClientVisible && hasEmptyClientFoundMessage"
      class="search-client__suggestion"
    >
      <ul class="search-client__suggestion-list">
        <li class="search-client__suggestion-item">
          <p class="search-client__empty-client">
            {{ $t('bookings.no-client-found') }}
          </p>
        </li>
      </ul>
    </div>

    <a-checkbox
      v-if="hasOptionIncludeOtherBranches && isSearchAllBranchesShow"
      v-model="filter.searchInBranches"
      class="ml-3"
      @change="handleSearchInBranchesChange"
    >
      {{ $t('bookings.search-in-all-branches') }}
    </a-checkbox>
  </div>
</template>

<script>
// Utilities
import { debounce } from 'lodash'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { isValidStringSearchValue } from 'CommonHelpers'

// API
import * as clientApi from 'Modules/api/client/client-api'
import { updateIncludeOtherBranches } from 'Modules/api/authentication/authentication-api'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache.js'
// Components
import { BIconSearch } from 'bootstrap-vue'
import AInput from 'Modules/aha/a-input/a-input.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import ACheckbox from 'Modules/aha/a-checkbox/a-checkbox.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SugguestionClient from 'Modules/clients/components/client-search-bar/components/sugguestion-client/sugguestion-client.vue'
import RecentlySearchClients from 'Modules/clients/components/client-search-bar/components/recently-search-clients/recently-search-clients.vue'
// Constants
import { options } from 'OptionsHelpers'
import { CLIENT_STATUS } from 'Constant'

const SUGGESTION_PER_PAGE = 5
const SUGGESTION_PAGE_NUMBER = 1
const ESC_KEY_CODE = ['Esc', 'Escape']

export default {
  components: {
    ACheckbox,
    AInput,
    AButton,
    BIconSearch,
    SugguestionClient,
    RecentlySearchClients,
  },

  extends: ComponentBase,

  mixins: [
    SalesCacheMixin,
    DeviceMixin,
  ],

  props: {
    hasRecentlySearched: {
      type:    Boolean,
      default: false,
    },

    hasQuickSearch: {
      type:    Boolean,
      default: false,
    },

    hasConditionSearch: {
      type:    Boolean,
      default: false,
    },

    hasOptionIncludeOtherBranches: {
      type:    Boolean,
      default: false,
    },

    hasEmptyClientFoundMessage: {
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
      items:            [],
      suggestionItems:  [],
      environmentSetup: {},

      filter: {
        searchValue:      '',
        searchCondition:  options.clients_enums.client_search_condition_type.name_or_phone,
        searchInBranches: false,
      },

      selectedItemIndex:       -1,
      suggestionVisible:       false,
      emptyClientVisible:      false,
      recentlySelectedVisible: false,
    }
  },

  computed: {
    ...mapGetters('device', [
      'isDesktopDevice',
    ]),

    isSearchAllBranchesShow() {
      return this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client
    },

    recentlySelectedToggle() {
      return ['recent-selected-toggle', {
        'recent-selected-toggle--active': this.recentlySelectedVisible,
      }]
    },

    clientSearchConditionOptions() {
      const searchConditionOptions = [
        {
          text:  this.$t('general.client-name-or-mobile'),
          value: options.clients_enums.client_search_condition_type.name_or_phone,
        },
        {
          text:  this.$t('general.client-name-or-client-no'),
          value: options.clients_enums.client_search_condition_type.name_or_number,
        },
      ]

      if (!this.filter.searchInBranches) {
        searchConditionOptions.push({
          text:  this.$t('environment-setup.notes'),
          value: options.clients_enums.client_search_condition_type.notes,
        })
      }

      return searchConditionOptions
    },

    selectedClientSearchConditionOption() {
      if (!this.filter?.searchCondition) return {}

      return this.clientSearchConditionOptions.find(option => option.value === this.filter.searchCondition)
    },

    placeholderText() {
      return this.selectedClientSearchConditionOption?.text
    },

    hasMore() {
      return this.suggestionItems?.length >= SUGGESTION_PER_PAGE
    },

    selectedSuggestionItem() {
      return this.suggestionItems[this.selectedItemIndex]
    },

    isShowSuggestion() {
      return this.suggestionVisible && this.hasQuickSearch && !this.isModalSearchOpen
    },

    searchClientClass() {
      return ['search-client', {
        'search-client--mobile': this.isMobileDevice,
      }]
    },
  },

  watch: {
    'x_user.is_client_searched_in_branches'(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.filter.searchInBranches = this.x_user.is_client_searched_in_branches

        if(this.filter.searchCondition === options.clients_enums.client_search_condition_type.notes && this.filter.searchInBranches) {
          this.filter.searchCondition = options.clients_enums.client_search_condition_type.name_or_phone
        }

        if (Object.keys(this.filterData).length) {
          this.filter.searchCondition = this.filterData.searchCondition
        }
      }
    },

    suggestionVisible(suggestionVisible) {
      if (!suggestionVisible) {
        this.selectedItemIndex = -1
      } else {
        this.recentlySelectedVisible = false
      }
    },

    'filter.searchValue' () {
      if (this.emptyClientVisible && this.hasEmptyClientFoundMessage) {
        this.emptyClientVisible = false
      }
    },

    'filterData': {
      handler (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.filter = this.filterData
        }
      },
      deep: true,
    },
  },

  async created() {
    this.environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
      shopId:      this.shop_data.shop_id,
      countryCode: this.shop_data.country,
    })

    this.filter.searchCondition = this.environmentSetup?.client_environment_model.fields.client_search_condition
    this.filter.searchInBranches = this.x_user.is_client_searched_in_branches
    if(this.filter.searchCondition === options.clients_enums.client_search_condition_type.notes && this.filter.searchInBranches) {
      this.filter.searchCondition = options.clients_enums.client_search_condition_type.name_or_phone
    }

    if (Object.keys(this.filterData).length) {
      this.filter.searchCondition = this.filterData.searchCondition
    }
  },

  mounted() {
    this.$bus.on('calendar-slot-mouseup', this.onCloseRecentlySelected)
    document.body.addEventListener('click', this.handleWindowClick)
    document.body.addEventListener('keydown', this.handleWindowKeydown)
  },

  beforeDestroy() {
    this.$bus.off('calendar-slot-mouseup', this.onCloseRecentlySelected)
    document.body.removeEventListener('click', this.handleWindowClick)
    document.body.removeEventListener('keydown', this.handleWindowKeydown)
  },

  methods: {
    ...mapActions('_calendar/bookingAction', [
      'getClient',
    ]),

    ...mapActions('clientRecentlySelected', [
      'addClient',
    ]),

    ...mapMutations('authentication', [
      'setIsClientSearchedInBranches',
    ]),

    suggestionClientClass(item) {
      return [{
        'suggestion-client--selected': item.clientId === this.selectedSuggestionItem?.clientId,
      }]
    },

    onCloseRecentlySelected() {
      this.recentlySelectedVisible = false
    },

    setSearchCondition(condition) {
      this.filter.searchCondition = condition
    },

    setSearchValue(value) {
      this.filter.searchValue = value
    },

    clearSearchValue() {
      this.filter.searchValue = ''
    },

    handleSearch (event) {
      event.preventDefault()
      this.suggestionVisible = false
      this.$emit('search', this.filter)
    },

    handleClientSearchInput: debounce(function (searchValue) {
      this.filter.searchValue = searchValue

      if (this.hasQuickSearch) {
        if (isValidStringSearchValue(this.filter.searchValue)) {
          this.loadClientSearchSuggestion()
        } else {
          this.suggestionVisible = false
        }
      }
    }, 500),

    async handleClientSearchKeyDown () {
      const UP_KEY_CODE = ['Up', 'ArrowUp']
      const DOWN_KEY_CODE = ['Down', 'ArrowDown']

      if (!this.suggestionVisible) return

      if (UP_KEY_CODE.includes(event.key)) {
        if (this.selectedItemIndex === 0) {
          this.selectedItemIndex = this.suggestionItems.length - 1
        } else {
          this.selectedItemIndex = this.selectedItemIndex - 1
        }
        return
      }

      if (DOWN_KEY_CODE.includes(event.key)) {
        if (this.selectedItemIndex === this.suggestionItems.length - 1) {
          this.selectedItemIndex = 0
        } else {
          this.selectedItemIndex = this.selectedItemIndex + 1
        }
        return
      }

      const ENTER_KEY_CODE = 'Enter'
      if (event.key === ENTER_KEY_CODE) {
        this.suggestionVisible = false

        if (this.selectedItemIndex !== -1) {
          event.preventDefault()
          event.stopPropagation()

          if (this.selectedSuggestionItem) {
            const { clientName, clientId, shopId } = this.selectedSuggestionItem

            this.filter.searchValue = clientName
            // this.filter.searchCondition = options.clients_enums.client_search_condition_type.name_or_phone

            const client = await this.getClient({ shopId, clientId, includeRecentInfo: true })
            await this.addClient(client)

            this.$emit('client-click', client)
          }
        }
      }
    },

    handleRecentlySelectedToggleClick () {
      this.recentlySelectedVisible = !this.recentlySelectedVisible
      this.suggestionVisible = false
      this.emptyClientVisible = false
    },

    async handleRecentlySelectedClientClick (item) {
      const { clientName, clientId, shopId } = item
      this.recentlySelectedVisible = false
      this.filter.searchValue = clientName

      try {
        this.preLoader()
        // Check if client is deleted from API before showing client information
        // The code here cannot use getClient from bookingAction because if it's used here, the client will be updated before checking the status
        const clientResponse = await clientApi.getClient({ clientId, clientShopId: shopId, shopId: this.shop_data?.shop_id })
        if(clientResponse.data.result.status === CLIENT_STATUS.UNCOMPLETED_DELETE) {
          throw new Error(this.$t('clients.client-not-exist'))
        }

        const client = await this.getClient({ shopId, clientId, includeRecentInfo: true })
        this.$emit('client-click', client)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleSuggestionClientClick (item) {
      this.suggestionVisible = false
      const { clientName, clientId, shopId } = item

      this.filter.searchValue = clientName

      const client = await this.getClient({ shopId, clientId, includeRecentInfo: true })
      await this.addClient(client)

      this.$emit('client-click', client)
    },

    handleWindowClick(event) {
      if (!this.$refs.searchClient.contains(event.target)) {
        this.suggestionVisible = false
        this.emptyClientVisible = false
        this.recentlySelectedVisible = false
      }
    },

    handleWindowKeydown(event) {
      if (ESC_KEY_CODE.includes(event.key)) {
        this.suggestionVisible = false
        this.recentlySelectedVisible = false
      }
    },

    handleViewMoreClick () {
      this.suggestionVisible = false
      this.$emit('search', this.filter)
    },

    handleSearchConditionChange(value) {
      this.filter.searchCondition = value
    },

    async handleSearchInBranchesChange() {
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

        this.$emit('search', this.filter)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async loadClientSearchSuggestion() {
      // Don't make the API call if modal is open
      if (this.isModalSearchOpen) {
        return
      }

      try {
        const response = await clientApi.clientSearch({
          ...this.filter,
          pageNumber: SUGGESTION_PAGE_NUMBER,
          pageSize:   SUGGESTION_PER_PAGE,
          shopId:     this.shop_data.shop_id,
        })

        this.suggestionItems = response?.data?.result?.items ?? []
        this.suggestionVisible = !this.isModalSearchOpen
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './search-client.scss';
</style>
