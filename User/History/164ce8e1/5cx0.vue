<template>
  <main class="app-content">
    <section class="content receivables-edit-history">
      <!-- BEGIN TITLE -->
      <div class="title">
        <h3>{{ $t('receivables-edit-history.outstanding-balance-edit-history') }}</h3>
        <div>
          <router-link :to="{ name: 'outstanding-by-clients' }">
            <aha-button variant="blue">
              {{ $t('receivables.outstanding-clients') }}
            </aha-button>
          </router-link>
        </div>
      </div>
      <!-- END TITLE -->

      <!-- BEGIN FILTER -->
      <div class="filter">
        <outstanding-balance-edit-history-filter
          :initial-value="initialFilter"

          @on-search="onSearchAsync"
        />
      </div>
      <!-- END FILTER -->

      <!-- BEGIN TABLE -->
      <div class="table">
        <p>{{ total_client_text }}</p>
        <view-table
          :data="tableData"
          @change-page="onChangePagesAsync"
        >
          <template
            slot="client_name"
            slot-scope="{ row }"
          >
            <span
              class="client-name"
              @click="onClickClientName(row)"
            >
              {{ (row.client_name) }}
            </span>
          </template>
          <template
            slot="date"
            slot-scope="{row}"
          >
            {{ row.created_date_time_ts | formatDateToYMD }}
          </template>
          <template
            slot="action"
            slot-scope="{row}"
          >
            {{ SalesUtils.formatOutstandingHistoryType(row.outstanding_history_type) }}
          </template>
          <template
            slot="old_balance"
            slot-scope="{row}"
          >
            {{ formatMoney(row.outstanding_before_change,0) }}
          </template>
          <template
            slot="new_balance"
            slot-scope="{row}"
          >
            {{ formatMoney(row.outstanding,0) }}
          </template>
        </view-table>
      </div>
      <!-- END TABLE -->
    </section>

    <!-- MODAL -->
    <client-information-modal :client-id="client_info_id" />
  </main>
</template>

<script>

const DEFAULT_NUMBER_PAGE = 1
const DEFAULT_GET_ALL_CLIENT = -1

// Utils
import {
  getEndOfTimezoneDateTS,
  getStartOfTimezoneDateTS,
} from 'DatetimeHelpers'
import { mapMutations } from 'vuex'
import { ApiError } from 'HTTPHelpers'
import SalesUtils from 'Utils/sales-utils.js'
import { formatMoney } from 'CommonHelpers'

// Components
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import ComponentBase from 'CommonComponents/component-base/component-base'
import ClientInformationModal from 'Components/clients/client-information/client-information-modal.vue'
import OutstandingBalanceEditHistoryFilter from 'Components/sales/outstanding-balance-edit-history-filter/outstanding-balance-edit-history-filter.vue'

// Apis
import OutstandingHistoryApi from 'API/sales/outstanding-history-api'

// Constants
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'

const TABLE_FIELD = [
  {field: 'date', label: 'receivables-edit-history.date', width: '10%', sortable: false, expand: true},
  {field: 'client_name', label: 'receivables-edit-history.clients', width: '20%', sortable: false, expand: true},
  {field: 'action', label: 'receivables-edit-history.action', width: '15%', sortable: false, expand: true},
  {field: 'old_balance', label: 'receivables-edit-history.old-balance', width: '15%', sortable: false, expand: true},
  {field: 'new_balance', label: 'receivables-edit-history.new-balance', width: '15%', sortable: false, expand: true},
  {field: 'notes', label: 'receivables-edit-history.note', width: '15%', sortable: false, tdClass: 'notes'},
]

export default {
  components: {
    ViewTable,
    ClientInformationModal,
    OutstandingBalanceEditHistoryFilter,
  },

  extends: ComponentBase,

  data() {
    return {
      SalesUtils,

      tableRowData:    [],
      tablePagination: {},
      initialFilter:   {
        keyword:   '',
        to_date:   {},
        from_date: {},
      },

      table_filter: {
        shop_id:                  0,
        page_number:              DEFAULT_NUMBER_PAGE,
        client_id:                DEFAULT_GET_ALL_CLIENT,
        page_size:                common_options.pagination.default,
        outstanding_history_type: sales_options.outstanding_history_type_enum.edited,
      },

      client_info_id: 0,
    }
  },

  computed: {
    totalClient() {
      return formatMoney(this.tablePagination?.total_items || 0, 0)
    },

    total_client_text() {
      return this.$t('receivables-edit-history.all-records-of-cliens-table', { records: this.totalClient })
    },

    tableData() {
      return {
        fields:     TABLE_FIELD,
        rows:       this.tableRowData,
        pagination: this.tablePagination,
        options:    {
          pagination: true,
        },
      }
    },
  },

  created() {
    this.setInitialFilter()
  },

  async mounted() {
    this.table_filter = {
      ...this.table_filter,
      ...this.initialFilter,
      shop_id: this.shop_data.shop_id,
    }
    this.loadDataTableAsync()
  },

  methods: {
    ...mapMutations('sales',[
      'setClientShopIdUsingSales',
    ]),

    formatMoney,

    setInitialFilter() {
      this.initialFilter = {
        ...this.initialFilter,
        from_date: { value: getStartOfTimezoneDateTS(new Date(), 'month') },
        to_date:   { value: getEndOfTimezoneDateTS() },
      }
    },

    async loadDataTableAsync() {
      try {
        this.preLoader()

        const outstanding_api = new OutstandingHistoryApi()
        let response = await outstanding_api.getOutstandingHistoriesAsync(this.table_filter)

        if (!response.is_ok) {
          throw new ApiError(response?.error_messages)
        }

        this.tableRowData = response.data.items
        this.tablePagination = response.data.pagination

      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onChangePagesAsync(page) {
      this.table_filter.page_number = page
      this.loadDataTableAsync()
    },

    async onSearchAsync(filter) {
      this.table_filter = {
        ...this.table_filter,
        ...filter,
        page_number: DEFAULT_NUMBER_PAGE,
      }

      this.loadDataTableAsync()
    },

    onClickClientName(row) {
      this.client_info_id = row.client_id
      this.setClientShopIdUsingSales(row.shop_id)
      this.$nextTick(function() {
        this.showDialogById('client-information-modal')
      })
    },
  },
}
</script>

<style lang="scss">
@import './outstanding-edit-history.scss';
</style>
