<template>
  <div class="prepaid-services-wrapper">
    <div class="show-expired">
      <div class="show-expired-pc">
        <aha-button
          v-show="isDeductPrepaidServicesButtonShown"
          :disabled="isDeductPrepaidServicesButtonDisabled"
          variant="blue"
          @click="onClickDeductPrepaidServices(selectedPrepaidServicesList)"
        >
          {{ $t('sales.deduct-prepaid-services') }}
        </aha-button>

        <b-form-checkbox
          id="client-info-checkbox-2"
          v-model="prepaidServiceFilter.show_expired"
          class="sales-prepaid-services__checkbox"
          @input="onChangeShowExpiredAsync(prepaidServiceFilter.show_expired)"
        >
          <span class="checkbox-text">{{ $t('sales-prepaid-service-tab.show-expired') }}</span>
        </b-form-checkbox>
        <slot name="old-data" />
      </div>
    </div>
    <div
      :class="{ 'is-readonly': isReadonly }"
      class="prepaid-services-wrapper__view-table-wrapper"
    >
      <view-table
        v-if="isViewTableReadyToShow"
        :data="tableData"
        class="prepaid-services-wrapper__view-table"
        @change-page="onChangePage"
      >
        <!-- MOBILE -->
        <template
          slot="mobile"
          slot-scope="{row}"
        >
          <div class="sales-prepaid-services__wrapper--mobile">
            <b-form-checkbox
              v-if="haveMoreThanOneValidPrepaidServices && isDeductPrepaidServicesButtonShown"
              :disabled="isSelectRowCheckboxDisabled(row)"
              class="sales-prepaid-services__checkbox"
              @change="onSelectPrepaidServiceRowData(row)"
            />

            <div class="sales-prepaid-services__main-container--mobile">
              <div class="service-name-title">
                <p :class="{ 'family-prepaid-service': !isDataOfCurrentShop(row) || !isDataOfCurrentClient(row) }">
                  {{ row.prepaid_service_name }}
                  <span
                    v-if="!isDataOfCurrentShop(row) || !isDataOfCurrentClient(row)"
                    class="shop-and-family-info__detail"
                  >
                    {{ formatShopAndFamilyInfo(row) }}
                  </span>
                </p>
              </div>
              <div class="row row-remaining-quantity">
                <p class="col-6">
                  {{ $t('sales-prepaid-service-tab.remaining-quantity') }}
                </p>
                <p class="col-6">
                  {{ salesUtils.formatNoLimitNumber(row.quantity,0) }}
                </p>
              </div>
              <div class="row">
                <p class="col-6">
                  {{ $t('sales-prepaid-service-tab.expiry-date') }}
                </p>
                <p class="col-6">
                  {{ salesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
                </p>
              </div>

              <div
                v-if="row.expand"
                class="row"
              >
                <p class="col-6">
                  {{ $t('sales-prepaid-service-tab.initial-quantity') }}
                </p>
                <p class="col-6">
                  {{ salesUtils.formatNoLimitNumber(row.initial_quantity,0) }}
                </p>
              </div>
              <div
                v-if="row.expand"
                class="row"
              >
                <p class="col-6 whitespace-nowrap">
                  {{ $t('sales-prepaid-service-tab.revenue-per-service') }}
                </p>
                <p class="col-6">
                  {{ salesUtils.formatNoLimitNumber(row.related_service_unit_price, 0) }}
                </p>
              </div>
              <div
                v-if="row.expand"
                class="row"
              >
                <p class="col-6">
                  {{ $t('sales-prepaid-service-tab.issue-date') }}
                </p>
                <p class="col-6">
                  {{ salesUtils.formatNoLimitDateTs(row.invoice_date_time_ts) }}
                </p>
              </div>
              <div
                v-if="row.expand"
                class="row"
              >
                <div class="col-12">
                  <div class="group-button">
                    <template v-if="!isReadonly && isAllowEditPrepaidGoodsBySetupRole">
                      <aha-button
                        v-if="isDataOfCurrentShop(row)"
                        @click="onActionEditPrepaidService(commonOptions.form_actions.edit,row)"
                      >
                        {{ $t('general.edit') }}
                      </aha-button>
                    </template>
                    <aha-button @click="onClickViewPrepaidServiceHistory(row)">
                      {{ $t('sales.view-history') }}
                    </aha-button>
                  </div>
                </div>
              </div>
            </div>

            <div
              :class="{ expand: row.expand }"
              class="show-more-text"
              @click="row.expand = !row.expand"
            >
              >
            </div>
          </div>
        </template>

        <!-- PC -->
        <template
          slot="select_row"
          slot-scope="{row}"
        >
          <b-form-checkbox
            :unchecked-value="isSelectRowCheckboxDisabled(row)"
            :disabled="isSelectRowCheckboxDisabled(row)"
            class="sales-prepaid-services__checkbox"
            @change="onSelectPrepaidServiceRowData(row)"
          />
        </template>

        <template
          slot="branch_number"
          slot-scope="{row}"
        >
          <div
            :id="'tooltip-branch-number' + row.id"
            class="branch-number"
          >
            {{ getBranchNumber(row.branch_number, row.shop_id) }}
          </div>
          <aha-tooltip
            :target="'tooltip-branch-number' + row.id"
            boundary="branch-number"
            placement="right"
          >
            {{ row.shop_name }}
          </aha-tooltip>
        </template>
        <template
          slot="prepaid_service_name"
          slot-scope="{row}"
        >
          {{ row.prepaid_service_name }}
          <span
            v-if="!isDataOfCurrentShop(row) || !isDataOfCurrentClient(row)"
            class="shop-and-family-info__detail"
          >
            {{ formatShopAndFamilyInfo(row) }}
          </span>
        </template>
        <template
          slot="remaining_quantity"
          slot-scope="{row}"
        >
          <span class="quantity">{{ salesUtils.formatNoLimitNumber(row.quantity,0) }}</span>
        </template>
        <template
          slot="expiry_date_ts"
          slot-scope="{row}"
        >
          {{ salesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
        </template>
        <template
          slot="initial_quantity"
          slot-scope="{row}"
        >
          {{ salesUtils.formatNoLimitNumber(row.initial_quantity,0) }}
        </template>
        <template
          slot="related_service_unit_price"
          slot-scope="{row}"
        >
          <span class="related_service_unit_price">{{ salesUtils.formatNoLimitNumber(row.related_service_unit_price, 0) }}</span>
        </template>
        <template
          slot="issue_date_ts"
          slot-scope="{row}"
        >
          {{ salesUtils.formatNoLimitDateTs(row.invoice_date_time_ts) }}
        </template>
        <template
          v-if="!isReadonly"
          slot="edit"
          slot-scope="{row}"
        >
          <aha-button
            v-if="isDataOfCurrentShop(row) && isAllowEditPrepaidGoodsBySetupRole"
            @click="onActionEditPrepaidService(commonOptions.form_actions.edit,row)"
          >
            {{ $t('general.edit') }}
          </aha-button>
        </template>
        <template
          slot="detail"
          slot-scope="{row}"
        >
          <aha-button @click="onClickViewPrepaidServiceHistory(row)">
            {{ $t('general.view') }}
          </aha-button>
        </template>
      </view-table>
    </div>
    <div
      v-if="isShowPrepaidServiceComment"
      class="mt-3"
    >
      <p>{{ $t('sales.please-select-the-prepaid-service-to-deduct') }}</p>
    </div>

    <template v-if="isLoad">
      <sales-prepaid-services-action
        :client="client"
        :modal-id="prepaidServiceActionModalId"
        @reload-page="onReloadPage()"
      />
    </template>

    <prepaid-service-history-modal
      :table-id="tableId"
      :data="prepaidServiceHistoryTableData"
      :is-sort-by-create-date="isSortByCreateDate"
      :visible="isShowPrepaidServiceHistoryModal"
      :is-loading="isLoadingPrepaidServiceHistory"
      :prepaid-service-name="selectedPrepaidServiceHistory.prepaid_service_name"
      static
      size="llg"

      @sort-by-created-time="sortByCreatedTime"
      @on-view-sales-detail="onClickViewSales"
      @hide="togglePrepaidServiceHistoryModal"
      @change-page="loadPrepaidServiceHistoryTable"
      @on-delete-history="deletePrepaidServiceHistory"
      @on-note-prepaid-service-history="handleNotePrepaidServiceHistory"
    />

    <sales-detail :modal_id="salesDetailModalId" />
    <refund-detail :modal_id="refundDetailModalId" />

    <a-note
      :title="$t('sales-prepaid-service-tab.notes')"
      :value="prepaidServiceHistoryNote"
      :visible="prepaidServiceHistoryNoteVisible"
      :max-length="200"
      @input="handlePrepaidServiceHistoryNoteInput"
      @hidden="handlePrepaidServiceHistoryNoteHidden"
    />
  </div>
</template>

<script>
// Utils
import { ApiError } from 'HTTPHelpers'
import salesUtils from 'Utils/sales-utils.js'
import { isPermissionGranted } from 'PermissionHelpers'
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import { guid, getBranchNumber } from 'CommonHelpers'

// Constant
import { options } from 'OptionsHelpers'
import { PERMISSION_TYPE } from 'Constant'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'

// Mixin
import SalesMixin from 'Mixins/sales-mixin'
import RefundMixin from 'Mixins/refund-mixin'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import ClientDictionaryMixin from 'Mixins/client-dictionary-mixin'

// Apis
import PrepaidServicesApi from 'API/sales/prepaid-services-api'
import PrepaidServiceHistoryApi from 'API/sales/prepaid-services-history-api'
import { updatePrepaidServiceHistoryNote } from 'Modules/api/sales/sales-api'

// View Models
import ClientViewModel from 'ViewModels/clients/client-view-model'
import SalesViewModel from 'ViewModels/sales/sales/sales-view-model.js'
import SalesBriefViewModel from 'ViewModels/sales/sales/sales-brief-view-model.js'
import ClientPrepaidServiceViewModel from 'ViewModels/sales/prepaid-service/prepaid-service-view-model.js'

// Components
import ANote from 'Modules/aha/a-note/a-note.vue'
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import SalesDetail from 'Components/sales/sales-detail/sales-detail.vue'
import RefundDetail from 'Components/sales/refund-detail/refund-detail.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import PrepaidServiceHistoryModal from 'Components/sales/prepaid-service-history/prepaid-service-history-modal.vue'
import SalesPrepaidServicesAction from 'Components/sales/sales-prepaid-services-action/sales-prepaid-services-action.vue'

const DEFAULT_PREPAID_SERVICE_FIELDS = [
  {field: 'select_row', label: 'general.select', width: '5%', sortable: false, expand: true},
  {field: 'mobile', label: '', width: 'auto', sortable: false, thClass: 'mobile', expand: true, tdClass: 'mobile', column_expand: true},
  {field: 'prepaid_service_name', label: 'sales-prepaid-service-tab.prepaid-service-name', width: '30%', sortable: false, expand: true, tdClass: 'prepaid-service-name'},
  {field: 'remaining_quantity', label: 'sales-prepaid-service-tab.remaining-quantity', width: '10%', sortable: false, expand: true, tdClass: 'remaining-quantity'},
  {field: 'expiry_date_ts', label: 'sales-prepaid-service-tab.expiry-date', width: '10%', sortable: false, expand: true},
  {field: 'initial_quantity', label: 'sales-prepaid-service-tab.initial-quantity', width: '10%', sortable: false, expand: true},
  {field: 'related_service_unit_price', label: 'sales-prepaid-service-tab.revenue-per-service', width: '10%', sortable: false, expand: true},
  {field: 'issue_date_ts', label: 'sales-prepaid-service-tab.issue-date', width: '10%', sortable: false, expand: true},
]

const PREPAID_SERVICE_CUSTOM_FIELD = { field: 'branch_number', label: 'sales-prepaid-service-tab.loc', width: '4%', sortable: false, expand: true, tdClass: 'branch-number'}

const SHOW_EXPIRED_STORAGE_KEY = 'prepaid_services_show_expired'

function getShowExpiredFromLocalStorage() {
  const savedValue = localStorage.getItem(SHOW_EXPIRED_STORAGE_KEY)
  if (savedValue === null) {
    return true
  }
  return savedValue === 'true'
}

function saveShowExpiredToLocalStorage(value) {
  localStorage.setItem(SHOW_EXPIRED_STORAGE_KEY, String(value))
}

export default {
  components: {
    ANote,
    ViewTable,
    AhaTooltip,
    SalesDetail,
    RefundDetail,
    PrepaidServiceHistoryModal,
    SalesPrepaidServicesAction,
  },

  extends: ComponentBase,

  mixins: [
    SalesMixin,
    RefundMixin,
    SalesCacheMixin,
    ClientDictionaryMixin,
  ],

  props: {
    isReadonly: {
      type:    Boolean,
      default: false,
    },

    canDeduct: {
      type:    Boolean,
      default: true,
    },

    client: {
      type:    Object,
      default: () => new ClientViewModel().fields,
    },
  },

  data() {
    return {
      isLoad: true,

      isViewTableReadyToShow:      false,
      selectedPrepaidServicesList: [],

      prepaidServiceFilter: {
        shop_id:                0,
        client_id:              0,
        page_number:            1,
        show_expired:           true,
        include_family_service: true,
        page_size:              common_options.pagination.default,
      },

      // alowEditBalanceRoyaltyPointsPrepaidServicesRemaining
      alowEditBalanceRoyaltyPointsPrepaidServicesRemaining: sales_options.security_level_enum.master,

      tableId:                          '',
      isSortByCreateDate:               false,
      currentPrepaidServiceHistoryPage: 1,
      isLoadingPrepaidServiceHistory:   false,
      prepaidServiceHistoryWasModified: false,
      isShowPrepaidServiceHistoryModal: false,
      prepaidServiceHistoryTableData:   { rows: []},
      selectedPrepaidServiceHistory:    new ClientPrepaidServiceViewModel().getFields(),

      prepaidServiceHistoryId:          '',
      prepaidServiceHistoryNote:        '',
      prepaidServiceHistoryNoteVisible: false,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),

    ...mapGetters('client_dictionary', [
      'getClientPrepaidServiceById',
    ]),

    options() { return options },

    commonOptions() { return common_options },

    uid() {
      return guid()
    },

    salesDetailModalId() { return `${this.uid}_sales-detail-perpaid-service-modal` },

    refundDetailModalId() { return `${this.uid}_refund-detail-perpaid-service-modal` },

    prepaidServiceActionModalId() { return `${this.uid}_sales-prepaid-services-action-modal` },

    salesUtils() { return salesUtils },

    clientId() {
      return this.client.client_id || this.client.id
    },

    clientPrepaidService() {
      return this.getClientPrepaidServiceById(this.clientId)
    },

    prepaidServiceRows() {
      return this.clientPrepaidService?.items.map(prepaidService => {
        const isPrepaidServiceActive = !this.salesUtils.isExpiredCard(prepaidService.expiry_date_ts)
        const isPrepaidServiceAvailable = prepaidService.quantity === options.enum_no_limit || prepaidService.quantity > 0

        return {
          ...prepaidService,
          status: isPrepaidServiceActive && isPrepaidServiceAvailable ? options.good_status.active : options.good_status.inactive,
        }
      })
    },

    selectedPrepaidServiceOwnerId() {
      return this.selectedPrepaidServiceHistory.client_id
    },

    isDeductPrepaidServicesButtonShown() {
      return !this.isReadonly && this.canDeduct
    },

    isDeductPrepaidServicesButtonDisabled() {
      return !this.haveOnlyOneValidPrepaidServices && (this.selectedPrepaidServicesList.length === 0 || this.haveNoValidPrepaidService)
    },

    validPrepaidServices() {
      if(!Array.isArray(this.prepaidServiceRows)) {
        return []
      }

      return this.prepaidServiceRows.filter(row => row.status === options.good_status.active)
    },

    haveNoValidPrepaidService() {
      return this.validPrepaidServices.length === 0
    },

    haveOnlyOneValidPrepaidServices() {
      return this.validPrepaidServices.length === 1
    },

    haveMoreThanOneValidPrepaidServices() {
      return this.validPrepaidServices.length > 1
    },

    prepaidServiceFields() {
      const prepaidServiceFields = [...DEFAULT_PREPAID_SERVICE_FIELDS]

      if (!this.isReadonly) {
        prepaidServiceFields.push({field: 'edit', label: 'sales-prepaid-service-tab.edit', width: '5%', sortable: false, expand: true})
      }

      prepaidServiceFields.push({field: 'detail', label: 'general.history', width: '5%', sortable: false, expand: true})

      if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client){
        prepaidServiceFields.unshift(PREPAID_SERVICE_CUSTOM_FIELD)
      }

      return prepaidServiceFields
    },

    tableData() {
      return {
        rows:       this.prepaidServiceRows,
        options:    { pagination: true },
        fields:     this.prepaidServiceFields,
        pagination: this.clientPrepaidService?.pagination ?? {},
      }
    },

    isShowPrepaidServiceComment() {
      return this.haveMoreThanOneValidPrepaidServices && !this.isReadonly && this.canDeduct
    },

    isAllowEditPrepaidGoodsBySetupRole() {
      if (this.isStaffRole || this.isManagerRole) {
        const permissionType = this.isStaffRole
          ? PERMISSION_TYPE.STAFF
          : PERMISSION_TYPE.MANAGER

        return isPermissionGranted(permissionType, this.alowEditBalanceRoyaltyPointsPrepaidServicesRemaining)
      }

      return true
    },
  },

  watch: {
    clientId(newValue, oldValue){
      if(newValue !== oldValue && !!oldValue) {
        // Reset the filter ( not keep it when change client)
        // There is a lack when update filter, so we need update it to avoid map wrong value in getClientPrepaidServices
        this.$nextTick(() => {
          this.prepaidServiceFilter.show_expired = getShowExpiredFromLocalStorage()
          this.prepaidServiceFilter.client_id = newValue
          this.prepaidServiceFilter.shop_id = this.shop_data.shop_id
          this.resetSelectCheckBox()
          this.loadDataTableAsync()
        })
      }
    },
  },

  async created(){
    this.prepaidServiceFilter.shop_id = this.shop_data.shop_id
    this.prepaidServiceFilter.client_id = this.client.id
    this.prepaidServiceFilter.show_expired = getShowExpiredFromLocalStorage()

    const environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
      shopId:      this.shop_data.shop_id,
      countryCode: this.shop_data.country,
    })

    if(this.isNullObject(environmentSetup)) {
      this.showMissingSalesSetupAlert()
    } else {
      this.alowEditBalanceRoyaltyPointsPrepaidServicesRemaining = environmentSetup.data_protection_security.fields.allow_edit_balance_royalty_points_prepaid_services_remaining
    }

    await this.loadDataTableAsync()
  },

  updated() {
    this.$nextTick(() => {
      this.isViewTableReadyToShow = true
    })
  },

  methods: {
    getBranchNumber,

    ...mapMutations('sales_prepaid_services',[
      'setPrepaidServices',
      'setPrepaidServicesAction',
      'setPrepaidServicesFilter',
    ]),

    ...mapActions('sales_prepaid_services',[
      'loadSalesPrepaidServicesAsyncData',
    ]),

    ...mapMutations('sales',[
      'setSalesAction',
    ]),

    async loadDataTableAsync(){
      this.resetSelectCheckBox()
      this.setPrepaidServicesFilter(this.prepaidServiceFilter)

      await this.clientDictionaryMixin_fetchClientPrepaidServices({
        clientId: this.clientId,
        filter:   this.prepaidServiceFilter,
      })

      //Use for handling render table (see updated hook also)
      this.isViewTableReadyToShow = false
    },

    onSelectPrepaidServiceRowData(prepaidService) {
      const index = this.selectedPrepaidServicesList.findIndex(selectedPrepaidService => selectedPrepaidService.id === prepaidService.id)

      if (index === -1) {
        this.selectedPrepaidServicesList.push(prepaidService)
      } else {
        this.selectedPrepaidServicesList.splice(index, 1)
      }
    },

    async onChangeShowExpiredAsync(showExpired){
      this.prepaidServiceFilter.show_expired = showExpired
      this.prepaidServiceFilter.page_number = 1
      saveShowExpiredToLocalStorage(showExpired)
      await this.loadDataTableAsync()
    },

    async onChangePage(page){
      this.prepaidServiceFilter.page_number = page
      await this.loadDataTableAsync()
    },

    async onReloadPage(){
      await this.loadDataTableAsync()
    },

    resetSelectCheckBox() {
      //Reset select (checkbox) column and it will be updated automatically by computed prop
      this.prepaidServiceFields.shift()
      //Reset selected prepaid service list when page has any updates (edit/add)
      this.selectedPrepaidServicesList.splice(0)
    },

    onActionEditPrepaidService(action , prepaidServices){
      this.isLoad = true
      this.setPrepaidServicesAction({
        action: action,
        data:   prepaidServices,
      })
      this.$nextTick(() => {
        this.showDialogById(this.prepaidServiceActionModalId)
      })
    },

    async onClickDeductPrepaidServices(deductPrepaidService){
      // sales setup
      const salesSetup = await this.$salesCacheMixin_getAllSalesSetup({
        shopId: this.shop_data.shop_id,
      })

      if(this.isMissingSalesSetup(salesSetup)){
        this._showDialogAlert(salesSetup.error_messages)
      }

      //Auto add the only active prepaid service
      if(this.haveOnlyOneValidPrepaidServices) {
        deductPrepaidService = this.tableData.rows.filter(row => row.status === options.good_status.active)
      }

      const tmpSales = new SalesViewModel()
      deductPrepaidService.forEach(deduct_prepaid_service => {
        // map each deduct_prepaid_service to sales
        tmpSales.mapDeductPrepaidServiceToSalesFromSalesPrepaidService(this.client, deduct_prepaid_service, salesSetup)

        const salesAction = {
          data:    tmpSales.getFields(),
          action:  options.form_actions.add,
          options: {
            sales_goods_type: sales_options.sales_goods_type.service,
          },
        }
        this.setSalesAction(salesAction)
      })

      this.showDialogById('sales-action-modal')
    },

    async togglePrepaidServiceHistoryModal() {
      this.tableId = guid()
      this.isSortByCreateDate = false
      this.isShowPrepaidServiceHistoryModal = !this.isShowPrepaidServiceHistoryModal

      if (!this.isShowPrepaidServiceHistoryModal && this.prepaidServiceHistoryWasModified) {
        // refresh prepaid cards list
        await this.loadDataTableAsync(this.prepaidServiceFilter.page_number)
        this.prepaidServiceHistoryWasModified = false
      }
    },
    onClickViewPrepaidServiceHistory(row) {
      this.selectedPrepaidServiceHistory = Object.assign({}, row)
      this.togglePrepaidServiceHistoryModal()
      this.loadPrepaidServiceHistoryTable()
    },

    sortByCreatedTime(checkboxValue) {
      this.tableId = guid()
      this.isSortByCreateDate = checkboxValue
      this.loadPrepaidServiceHistoryTable()
    },

    async loadPrepaidServiceHistoryTable(page_number = 1) {
      try {
        this.preLoader()

        const payload = {
          page_number,
          shop_id:                      this.shop_data.shop_id,
          page_size:                    common_options.pagination.default,
          client_id:                    this.selectedPrepaidServiceOwnerId,
          is_sort_by_created_date_time: this.isSortByCreateDate,
          client_prepaid_service_id:    this.selectedPrepaidServiceHistory.id,
        }

        const prepaidServiceHistoryApi = new PrepaidServiceHistoryApi()
        const response = await prepaidServiceHistoryApi.getPrepaidServiceHistoriesAsync(payload)

        this.currentPrepaidServiceHistoryPage = page_number

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.prepaidServiceHistoryTableData.rows = response.data.items
        this.prepaidServiceHistoryTableData.pagination = response.data.pagination

      } catch(error) {
        this._showDialogAlert(error.messgae)
      } finally {
        this.preLoader(false)
      }
    },

    loadPrepaidServiceHistoriesAsync(page_number) {
      const filter = {
        page_number,
        shop_id:                      this.shop_data.shop_id,
        page_size:                    common_options.pagination.default,
        client_id:                    this.selectedPrepaidServiceOwnerId,
        is_sort_by_created_date_time: this.isSortByCreateDate,
        client_prepaid_service_id:    this.selectedPrepaidServiceHistory.id,
      }
      const prepaidServiceHistoryApi = new PrepaidServiceHistoryApi()
      return prepaidServiceHistoryApi.getPrepaidServiceHistoriesAsync(filter)
    },

    async onClickViewSales(prepaidServiceHistory) {
      const prepaidServiceHistoryType = prepaidServiceHistory.prepaid_service_history_type
      if (
        prepaidServiceHistoryType === sales_options.prepaid_service_history_type_enum.refund ||
        prepaidServiceHistoryType === sales_options.prepaid_service_history_type_enum.refund_deleted
      ) {
        const refundAction = {
          action: options.form_actions.view,
          data:   {
            shop_id: prepaidServiceHistory.shop_id,
            ref_id:  prepaidServiceHistory.refund_id,
          },
          options: {
            sales_goods_type: sales_options.sales_goods_type.service,
          },
        }
        this.setRefundAction(refundAction)
        this.showDialogById(this.refundDetailModalId)
      } else {
        const salesViewModel = new SalesBriefViewModel()
        salesViewModel.fields.shop_id = prepaidServiceHistory.shop_id
        salesViewModel.fields.status = prepaidServiceHistory.sales_status
        salesViewModel.fields.sales_number = prepaidServiceHistory.sales_number
        this.onActionSalesBriefMixin(options.form_actions.view, salesViewModel.getFields(), salesViewModel.fields.status, this.salesDetailModalId)
      }
    },

    async deletePrepaidServiceHistory(prepaidServiceHistory) {
      const payload = {
        shop_id:                  this.shop_data.shop_id,
        history_id:               prepaidServiceHistory.id,
        session_token:            this.user.session_token,
        shop_location:            this.shop_data.shop_location,
        client_id:                prepaidServiceHistory.client_id,
        prepaid_service_owner_id: prepaidServiceHistory.prepaid_service_owner_id,
      }

      try {
        this.preLoader()
        const prepaidServiceApi = new PrepaidServicesApi()
        const response = await prepaidServiceApi.deleteQuantityEditClientPrepaidService(payload)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.prepaidServiceHistoryWasModified = true
        this.loadPrepaidServiceHistoryTable(this.currentPrepaidServiceHistoryPage)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)

      }
    },

    // format
    isDataOfCurrentShop(row){
      return row.shop_id === this.shop_data.shop_id
    },

    isDataOfCurrentClient(row){
      return row.client_id === this.clientId
    },

    formatShopAndFamilyInfo(row){
      let tmpInfos = []
      if(!this.isDataOfCurrentShop(row)){
        tmpInfos.push(row.shop_name)
      }
      if(!this.isDataOfCurrentClient(row)){
        tmpInfos.push(row.client_name)
      }
      return `(${tmpInfos.join(', ')})`
    },

    handleNotePrepaidServiceHistory(item) {
      this.prepaidServiceHistoryNoteVisible = true
      this.prepaidServiceHistoryNote = item.notes.user_notes || ''
      this.prepaidServiceHistoryId = item.id
    },

    handlePrepaidServiceHistoryNoteHidden() {
      this.prepaidServiceHistoryNoteVisible = false
      this.prepaidServiceHistoryNote = ''
      this.prepaidServiceHistoryId = ''
    },

    async handlePrepaidServiceHistoryNoteInput(note) {
      try {
        this.preLoader()

        const payload = {
          id: this.prepaidServiceHistoryId,
          note,
        }

        await updatePrepaidServiceHistoryNote(payload)
        await this.loadPrepaidServiceHistoryTable()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    isSelectRowCheckboxDisabled(rowData) {
      return rowData.status === options.good_status.inactive
    },
  },
}
</script>

<style lang="scss">
@import './sales-prepaid-services.scss';
</style>
