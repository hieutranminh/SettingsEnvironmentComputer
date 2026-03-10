<template>
  <div>
    <b-modal
      :visible="visible"
      :modal-class="modalClass"
      :title="$t('bookings.client-search')"

      static
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      @show="onLoadForm()"
      @hide="onCancel()"
    >
      <!-- Search -->
      <div class="search-client-top">
        <search-client
          ref="searchClient"
          :has-condition-search="true"
          :has-option-include-other-branches="true"
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
      </div>

      <!-- Table -->
      <div class="search-client-table">
        <div class="search-client-table__table-head">
          <span>{{ totalText }}</span>
          <span class="ml-3">{{ $t('clients.click-row-to-select-client') }}</span>
        </div>

        <div class="search-client-table__table-result">
          <view-table
            :data="tableData"
            @click-rows="handleRowClick"
          >
            <template #branchNumber="{ row }">
              <div
                v-b-tooltip.hover.right
                :title="row.shopName"
                class="branch-number"
              >
                {{ getBranchNumber(row.branchNumber, row.shopId) }}
              </div>
            </template>

            <template #mobilePhone="{ row }">
              <client-mobile-phone
                :id="row.clientId"
                :phone-number="row.phoneNumber"
                :mobile-number="row.mobileNumber"
                :registration-date="row.registrationDate"
                date
              />
            </template>

            <template #clientRatingAndGroup="{ row }">
              <span v-if="row.clientRatingName">{{ row.clientRatingName }}</span>
              {{ row.clientRatingName && row.clientGroupName ? ' / ' : '' }}
              {{ row.clientGroupName || '' }}
            </template>

            <template #birthday="{ row }">
              {{ formatClientBirthday(row) }}
            </template>

            <template #preferredStaffName="{ row }">
              <p v-if="row.preferredStaffId">
                {{ row.preferredStaffName }}
              </p>
            </template>

            <template #recentVisitDateTime="{ row }">
              {{ formatClientRecentVisitDateTime(row) }}
            </template>

            <template #notes="{ row }">
              <aha-note-with-tooltip
                v-if="row.notes"
                :value="row.notes"
                :tooltip-id="`client-notes-${row.clientId}`"
                placement="left"
                custom-class="client-notes-tooltip"
              />
            </template>
          </view-table>

          <pagination
            :pagination.sync="paginationConverted"
            @change-page="handlePageChange"
          />
        </div>
      </div>
    </b-modal>

    <!-- Client action -->
    <client-action
      :visible="isShowAddClientAction"
      @hidden="handleAddClientActionHidden"
      @added-client-successfully="handleAddSuccessfullyClient"
    />
  </div>
</template>
<script>
// Utils
import {mapActions, mapMutations} from 'vuex'
import moment from 'moment'
import { addDateZero, getBranchNumber } from 'CommonHelpers'
// API
import * as clientApi from 'Modules/api/client/client-api'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import Pagination from 'CommonComponents/pagination/pagination.vue'
import ClientAction from 'Components/clients/client-action/client-action.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SearchClient from 'Modules/calendar/components/search-client/search-client.vue'
import AhaNoteWithTooltip from 'CommonComponents/aha-note-with-tooltip/aha-note-with-tooltip.vue'
import ClientMobilePhone from 'Modules/clients/components/client-mobile-phone/client-mobile-phone.vue'
// Constants
import { options } from 'OptionsHelpers'

export default {
  components: {
    ClientAction,
    AButton,
    AhaNoteWithTooltip,
    ClientMobilePhone,
    Pagination,
    ViewTable,
    SearchClient,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
    listData: {
      type:    Array,
      default: () => ([]),
    },
    paginationData: {
      type:    Object,
      default: () => ({}),
    },
    filterData: {
      type:    Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      items:      [],
      filter:     {},
      pagination: {
        totalItems: 0,
        pageNumber: 1,
        pageSize:   options.pagination.default,
      },

      isShowAddClientAction: false,
    }
  },

  computed: {
    modalClass () {
      return ['modal-search-client', {
        'modal-search-client--mobile': this.isMobileDevice,
      }]
    },

    totalText() {
      return this.$t('clients.all', {
        '0': this.pagination.totalItems,
      })
    },

    fields() {
      const fields = [
        { field: 'memberNumber', label: 'clients.client-number', sortable: false, width: '150px' },
        { field: 'clientName', label: 'clients.client-name', sortable: false, width: '140px' },
        { field: 'mobilePhone', label: 'clients.mobile-phone', sortable: false, expand: true, width: '140px' },
        { field: 'clientRatingAndGroup', label: 'clients.client-rating-and-group', sortable: false, expand: true, width: '140px' },
        { field: 'preferredStaffName', label: 'bookings.preferred-staff', sortable: false, expand: true, width: '140px' },
        { field: 'birthday', label: 'clients.birthday', sortable: false, expand: true, width: '100px' },
        { field: 'recentVisitDateTime', label: 'bookings.recent-visit-date', sortable: false, expand: true, width: '100px' },
        { field: 'notes', label: 'general.notes', sortable: false, expand: true },
      ]

      if (this.shop_data.chain_id) {
        fields.unshift({ field: 'branchNumber', label: 'general.location', sortable: false, expand: true, width: '80px', tdClass: 'location' })
      }

      return fields
    },

    tableData() {
      return {
        rows:    this.items,
        fields:  this.fields,
        options: {
          pagination: false,
          table_type: options.view_table_types.client,
        },
      }
    },

    paginationConverted() {
      return {
        page_size:   this.pagination.pageSize,
        page_number: this.pagination.pageNumber,
        total_items: this.pagination.totalItems,
        total_pages: Math.ceil(this.pagination.totalItems / this.pagination.pageSize),
      }
    },
  },

  methods: {
    ...mapMutations('client', [
      'setClientAction',
    ]),
    ...mapActions('clientRecentlySelected', [
      'addClient',
    ]),

    getBranchNumber,

    formatClientBirthday(client) {
      return [client.birthYear, client.birthMonth, client.birthDD].filter(Boolean).map(item => {
        return addDateZero(item)
      }).join('-')
    },

    formatClientRecentVisitDateTime(client) {
      if (!client.recentVisitDateTimeTS) {
        return ''
      }

      return moment.unix(client.recentVisitDateTimeTS).utc().format('YYYY-MM-DD')
    },

    onLoadForm () {
      this.items = this.listData
      this.filter = this.filterData
      this.pagination = this.paginationData

      this.$refs.searchClient.setSearchValue(this.filterData.searchValue ? this.filterData.searchValue : '')
    },

    onCancel () {
      this.$emit('cancel')
      this.$refs.searchClient.clearSearchValue()
    },

    async loadClientSearch() {
      try {
        this.preLoader()
        const response = await clientApi.clientSearch({
          ...this.filter,
          pageNumber: this.pagination.pageNumber,
          pageSize:   this.pagination.pageSize,
          shopId:     this.shop_data.shop_id,
        })

        this.items = response?.data?.result?.items ?? []
        this.pagination = response?.data?.result?.pagingInfo ?? {}

        // Open popup client detail if only 1 client found
        if (this.items.length === 1) {
          await this.handleRowClick({ row: this.items[0], pageIndex: 0 })
          return
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleSearch (searchFilter) {
      this.filter = searchFilter
      this.pagination.pageNumber = 1
      this.loadClientSearch()
      this.$emit('search-in-branches-change', searchFilter)
    },

    async handleRowClick (data) {
      await this.addClient(this.items[data.pageIndex])

      this.$emit('selected-client', data)
    },

    handlePageChange (pageNumber) {
      if (this.pagination.pageNumber !== pageNumber) {
        this.pagination.pageNumber = pageNumber
        this.loadClientSearch()
      }
    },

    handleAddClientActionHidden () {
      this.isShowAddClientAction = false
    },

    handleAddSuccessfullyClient (client) {
      this.$emit('added-client-successfully', client)
    },

    handleAddClient() {
      this.setClientAction({
        action: options.form_actions.add,
      })

      this.isShowAddClientAction = true
    },
  },
}
</script>

<style lang="scss">
@import "./modal-search-client.scss";

.modal-search-client {
  .client-notes-tooltip {
    .tooltip-inner {
      max-width: 500px!important;
      text-align: left;
    }
  }
}
</style>
