<template>
  <div class="sales-prepaid-card-wrapper">
    <div class="show-expired">
      <div class="show-expired-pc">
        <b-form-checkbox
          v-model="prepaidCardFilter.include_expired_card"
          @input="onChangeShowExpiredAsync(prepaidCardFilter.include_expired_card)"
        >
          <span class="checkbox-text">{{ $t('sales-prepaid-card-tab.show-expired') }}</span>
        </b-form-checkbox>
        <div
          v-if="!isReadonly"
          class="right"
        >
          <aha-button
            :disabled="isDisabledMoveBalanceButton"
            variant="blue"
            class="default fll move-balance"
            @click="onClickMoveBalance()"
          >
            {{ $t('sales-prepaid-card-tab.move-balance') }}
          </aha-button>
        </div>
        <slot name="old-data" />
      </div>
    </div>

    <div class="cl-info-inner sales-prepaid-card-wrapper__view-table-wrapper">
      <view-table
        :data="tableData"
        class="sales-prepaid-card-wrapper__view-table"
        @change-page="onChangePage"
      >
        <!-- MOBILE -->
        <template
          slot="mobile"
          slot-scope="{row}"
        >
          <div class="card-name">
            <p :class="{ 'shop-and-family-info': !isDataOfCurrentShop(row) || !isDataOfCurrentClient(row) }">
              {{ row.prepaid_card_name }}
              <span
                v-if="!isDataOfCurrentShop(row) || !isDataOfCurrentClient(row)"
                class="shop-and-family-info__detail"
              >
                {{ formatShopAndFamilyInfo(row) }}
              </span>
            </p>
          </div>
          <div class="row row-balance">
            <p class="col-6">
              {{ $t('sales-prepaid-card-tab.balance') }}
            </p>
            <p class="col-6">
              {{ salesUtils.formatNoLimitNumber(row.balance,0) }}
            </p>
          </div>
          <div class="row">
            <p class="col-6">
              {{ $t('sales-prepaid-card-tab.expiry-date') }}
            </p>
            <p class="col-6">
              {{ salesUtils.formatNoLimitDateTs(row.expiry_date_ts) }} - {{ row.expiry_date_ts }}
            </p>
          </div>
          <div
            v-if="row.expand"
            class="row"
          >
            <p class="col-6">
              {{ $t('sales-prepaid-card-tab.earned-amount') }}
            </p>
            <p class="col-6">
              {{ salesUtils.formatNoLimitNumber(row.initial_balance,0) }}
            </p>
          </div>
          <div
            v-if="row.expand"
            class="row"
          >
            <p class="col-6">
              {{ $t('sales-prepaid-card-tab.service-dc') }}
            </p>
            <p
              v-if="row.discount_for_service"
              class="col-6"
            >
              {{ row.discount_for_service }}%
            </p>
          </div>
          <div
            v-if="row.expand"
            class="row"
          >
            <p class="col-6">
              {{ $t('sales-prepaid-card-tab.product-dc') }}
            </p>
            <p
              v-if="row.discount_for_product"
              class="col-6"
            >
              {{ row.discount_for_product }}%
            </p>
          </div>
          <div
            v-if="row.expand"
            class="row"
          >
            <p class="col-6">
              {{ $t('sales-prepaid-card-tab.issue-date') }}
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
                <aha-button
                  v-if="!isReadonly && isDataOfCurrentShop(row) && isAllowEditPrepaidGoodsBySetupRole"
                  @click="onActionPrepaidCard(commonOptions.form_actions.edit, row)"
                >
                  {{ $t('general.edit') }}
                </aha-button>
                <aha-button @click="onClickViewCardHistory(row)">
                  {{ $t('sales.view-history') }}
                </aha-button>
              </div>
            </div>
          </div>
          <div
            :class="{expand : row.expand}"
            class="show-more-text"
            @click="row.expand = !row.expand"
          >
            >
          </div>
        </template>

        <!-- PC -->
        <template
          slot="branch_number"
          slot-scope="{row}"
        >
          <div :id="'tooltip-branch-number' + row.id">
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
          slot="prepaid_card_name"
          slot-scope="{row}"
        >
          <p :class="{ 'shop-and-family-info': !isDataOfCurrentShop(row) || !isDataOfCurrentClient(row) }">
            {{ row.prepaid_card_name }}
            <span
              v-if="!isDataOfCurrentShop(row) || !isDataOfCurrentClient(row)"
              class="shop-and-family-info__detail"
            >
              {{ formatShopAndFamilyInfo(row) }}
            </span>
          </p>
        </template>

        <template
          slot="balance"
          slot-scope="{row}"
        >
          {{ salesUtils.formatNoLimitNumber(row.balance,0) }}
        </template>

        <template
          slot="expiry_date"
          slot-scope="{row}"
        >
          {{ salesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
        </template>

        <template
          slot="initial_balance"
          slot-scope="{row}"
        >
          {{ salesUtils.formatNoLimitNumber(row.initial_balance,0) }}
        </template>

        <template
          slot="service_discount"
          slot-scope="{row}"
        >
          <template v-if="row.discount_for_service">
            {{ row.discount_for_service }}%
          </template>
        </template>

        <template
          slot="product_discount"
          slot-scope="{row}"
        >
          <template v-if="row.discount_for_product">
            {{ row.discount_for_product }}%
          </template>
        </template>

        <template
          slot="issue_date"
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
            @click="onActionPrepaidCard(commonOptions.form_actions.edit, row)"
          >
            {{ $t('general.edit') }}
          </aha-button>
        </template>

        <template
          slot="detail"
          slot-scope="{row}"
        >
          <aha-button @click="onClickViewCardHistory(row)">
            {{ $t('general.view') }}
          </aha-button>
        </template>
      </view-table>
    </div>

    <sales-prepaid-card-action
      :client="client"
      :modal-id="prepaidCardActionModalId"
      @edited-prepaid-card="onEditedPrepaidCard"
    />

    <sales-move-balance-action
      :client="client"
      :modal-id="moveBalanceActionModalId"
      :prepaid-cards="moveBalancePrepaidCards"
      @added-move-balance="onAddedMoveBalance"
    />

    <prepaid-card-history-modal
      :table-id="tableId"
      :is-readonly="isReadonly"
      :data="prepaidCardHistoryTableData"
      :visible="isShowPrepaidCardHistoryModal"
      :is-loading="isLoadingPrepaidCardHistory"
      :is-sort-by-create-date="isSortByCreateDate"
      :prepaid-card-type="selected_prepaid_card_history.prepaid_card_type"
      :prepaid-card-name="selected_prepaid_card_history.prepaid_card_name"
      static
      size="llg"

      @hide="togglePrepaidCardHistoryModal"
      @on-view-sales-detail="onClickViewSales"
      @sort-by-created-time="sortByCreatedTime"
      @change-page="loadPrepaidCardHistoryTable"
      @on-cancel-move-balance-history="cancelMoveBalancePrepaidCardHistory"
      @on-note-prepaid-card-history="handleNotePrepaidCardHistory"
    />

    <sales-detail :modal_id="salesDetailModalId" />
    <refund-detail :modal_id="refundDetailModalId" />

    <a-note
      :title="$t('sales-prepaid-card-tab.notes')"
      :value="prepaidCardHistoryNote"
      :visible="prepaidCardHistoryNoteVisible"
      :max-length="200"
      @input="handlePrepaidCardHistoryNoteInput"
      @hidden="handlePrepaidCardHistoryNoteHidden"
    />
  </div>
</template>

<script>

import ANote from 'Modules/aha/a-note/a-note.vue'

const PAGE_NUMBER_DEFAULT = 1

// Utils
import { ApiError } from 'HTTPHelpers'
import salesUtils from 'Utils/sales-utils.js'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { guid, isPermittedBySetupRole, getBranchNumber } from 'CommonHelpers'
import { isPermissionGranted } from 'PermissionHelpers'

// Constant
import { options } from 'OptionsHelpers'
import { PERMISSION_TYPE } from 'Constant'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'

// Apis
import BalanceMoveApi from 'API/sales/balance-move-api'
import PrepaidCardsApi from 'API/sales/prepaid-cards-api'
import PrepaidCardsHistoryAPI from 'API/sales/prepaid-cards-history-api'

// Mixins
import SalesMixin from 'Mixins/sales-mixin'
import RefundMixin from 'Mixins/refund-mixin'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import ClientDictionaryMixin from 'Mixins/client-dictionary-mixin'

// Components
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import SalesDetail from 'Components/sales/sales-detail/sales-detail.vue'
import RefundDetail from 'Components/sales/refund-detail/refund-detail.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import PrepaidCardHistoryModal from 'Components/sales/prepaid-card-history/prepaid-card-history-modal.vue'
import SalesPrepaidCardAction from 'Components/sales/sales-prepaid-card-action/sales-prepaid-card-action.vue'
import SalesMoveBalanceAction from 'Components/sales/sales-move-balance-action/sales-move-balance-action.vue'

// ViewModels
import ClientViewModel from 'ViewModels/clients/client-view-model'
import SalesBriefViewModel from 'ViewModels/sales/sales/sales-brief-view-model.js'
import ClientPrepaidCardViewModel from 'ViewModels/sales/prepaid-card/prepaid-card-view-model.js'
import { updatePrepaidCardHistoryNote } from 'Modules/api/sales/sales-api'

const SHOW_EXPIRED_STORAGE_KEY = 'prepaid_cards_show_expired'

function getShowExpiredFromLocalStorage() {
  try {
    if (typeof localStorage === 'undefined') return true
    const savedValue = localStorage.getItem(SHOW_EXPIRED_STORAGE_KEY)
    if (savedValue === null) return true
    return savedValue === 'true'
  } catch (_) {
    return true
  }
}

function saveShowExpiredToLocalStorage(value) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(SHOW_EXPIRED_STORAGE_KEY, String(value))
  } catch (_) {
    // no-op: storage is unavailable
  }
}

export default {
  components: {
    ANote,
    ViewTable,
    AhaTooltip,
    SalesDetail,
    RefundDetail,
    SalesPrepaidCardAction,
    SalesMoveBalanceAction,
    PrepaidCardHistoryModal,
  },

  extends: ComponentBase,

  mixins: [
    SalesMixin,
    RefundMixin,
    SalesCacheMixin,
    ClientDictionaryMixin,
  ],

  props: {
    client: {
      type:    Object,
      default: () => new ClientViewModel().fields,
    },

    isReadonly: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      prepaidCardFields: [
        {field: 'mobile', label: '', width: 'auto', sortable: false, expand: true, tdClass: 'mobile', thClass: 'mobile', column_expand: true},
        {field: 'prepaid_card_name', label: 'sales-prepaid-card-tab.card-name', width: '30%', sortable: false, expand: true, tdClass: 'prepaid-card-name' },
        {field: 'balance', label: 'sales-prepaid-card-tab.balance', width: '10%', sortable: false, expand: true, tdClass: 'balance'},
        {field: 'expiry_date', label: 'sales-prepaid-card-tab.expiry-date', width: '15%', sortable: false, expand: true},
        {field: 'initial_balance', label: 'sales-prepaid-card-tab.earned-amount', width: '15%', sortable: false, expand: true},
        {field: 'service_discount', label: 'sales-prepaid-card-tab.service-dc', width: 'auto', sortable: false, expand: true},
        {field: 'product_discount', label: 'sales-prepaid-card-tab.product-dc', width: 'auto', sortable: false, expand: true},
        {field: 'issue_date', label: 'sales-prepaid-card-tab.issue-date', width: '10%', sortable: false, expand: true},
      ],

      prepaidCardFilter: {
        shop_id:              0,
        client_id:            0,
        include_family_card:  true,
        include_expired_card: true,
        page_number:          PAGE_NUMBER_DEFAULT,
        page_size:            common_options.pagination.default,
        prepaid_card_type:    sales_options.prepaid_card_type.all,
      },

      moveBalancePrepaidCards: {
        items:      [],
        pagination: {},
      },

      alowEditBalanceRoyaltyPointsPrepaidCardsRemaining: sales_options.security_level_enum.master,

      prepaidCardHistoryTableData: {
        rows: [],
      },

      tableId:                                               '',
      isSortByCreateDate:                                    false,
      currentPrepaidCardHistoryPage:                         1,
      isLoadingPrepaidCardHistory:                           false,
      isShowPrepaidCardHistoryModal:                         false,
      is_needing_load_new_prepaid_cards_and_balance_account: false,
      selected_prepaid_card_history:                         new ClientPrepaidCardViewModel().getFields(),

      prepaidCardHistoryId:          '',
      prepaidCardHistoryNote:        '',
      prepaidCardHistoryNoteVisible: false,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),

    ...mapGetters('client_dictionary', [
      'getClientPrepaidCardById',
    ]),

    ...mapGetters('sales_prepaid_card',{
      x_prepaid_cards: 'getSalesPrepaidCards',
    }),

    options() { return options },

    commonOptions() { return common_options },

    salesUtils() { return salesUtils },

    clientPrepaidCard() {
      return this.getClientPrepaidCardById(this.clientId)
    },

    uid() {
      return guid()
    },

    moveBalanceActionModalId() { return `${this.uid}_move-balance-action-modal` },

    salesDetailModalId() { return `${this.uid}_sales-detail-perpaid-service-modal` },

    refundDetailModalId() { return `${this.uid}_refund-detail-perpaid-service-modal` },

    prepaidCardActionModalId() { return `${this.uid}_sales-prepaid-card-action-modal` },

    prepaidCardCustomFields() {
      return {field: 'branch_number', label: 'sales-prepaid-card-tab.loc', width: '5%', sortable: false, expand: true, tdClass: 'branch-number'}
    },

    tableData() {
      const rows = this.clientPrepaidCard?.items.map(prepaidCard => {
        const isCardEmptyBalance = prepaidCard?.balance <= 0
        const isCardExpired = this.salesUtils.isExpiredCard(prepaidCard.expiry_date_ts)

        const isCardInactive = (() => {
          if (prepaidCard.prepaid_card_type === options.prepaid_card_type.deposit_card) {
            return isCardExpired || isCardEmptyBalance
          }

          if (prepaidCard.prepaid_card_type === options.prepaid_card_type.discount_card) {
            return isCardExpired
          }

          return false
        })()

        return {
          ...prepaidCard,
          status: isCardInactive ? options.good_status.inactive : options.good_status.active,
        }
      })

      return {
        rows,
        options: {
          pagination: true,
        },
        fields:     this.prepaidCardFields,
        pagination: this.clientPrepaidCard?.pagination ?? {},
      }
    },

    clientId() {
      // have to check client_id data here because client data from API is not consistence
      return this.client.client_id || this.client.id
    },

    selectedPrepaidCardOwnerId() {
      return this.selected_prepaid_card_history.client_id
    },

    isDisabledMoveBalanceButton() {
      const validPrepaidCard = this.tableData.rows.find(card => {
        return card.status === options.good_status.active
      })

      return this.tableData.rows.length === 0 || !validPrepaidCard
    },

    isAllowEditPrepaidGoodsBySetupRole() {
      if (this.isStaffRole || this.isManagerRole) {
        const permissionType = this.isStaffRole
          ? PERMISSION_TYPE.STAFF
          : PERMISSION_TYPE.MANAGER

        return isPermissionGranted(permissionType, this.alowEditBalanceRoyaltyPointsPrepaidCardsRemaining)
      }

      return true
    },
  },

  watch: {
    clientId(newValue, oldValue) {
      if(oldValue !== newValue && !!oldValue) {
        this.prepaidCardFilter.client_id = newValue
        this.prepaidCardFilter.shop_id = this.shop_data.shop_id
        this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
      }
    },
  },

  async created(){
    this.prepaidCardFilter.client_id = this.client.id
    this.prepaidCardFilter.shop_id = this.shop_data.shop_id
    this.prepaidCardFilter.include_expired_card = getShowExpiredFromLocalStorage()

    const fields = [
      ...this.prepaidCardFields,
    ]

    if (!this.isReadonly) {
      fields.push({field: 'edit', label: 'sales-prepaid-card-tab.edit', width: '5%', sortable: false, expand: true})
    }
    fields.push({field: 'detail', label: 'general.history', width: '5%', sortable: false, expand: true})

    if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client){
      fields.unshift(this.prepaidCardCustomFields)
    }

    const environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
      shopId:      this.shop_data.shop_id,
      countryCode: this.shop_data.country,
    })

    if(this.isNullObject(environmentSetup)) {
      this.showMissingSalesSetupAlert()
    } else {
      this.alowEditBalanceRoyaltyPointsPrepaidCardsRemaining = environmentSetup.data_protection_security.fields.allow_edit_balance_royalty_points_prepaid_services_remaining
    }

    this.prepaidCardFields = fields
    this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
  },

  methods: {
    getBranchNumber,

    ...mapActions('sales_prepaid_card', [
      'setSalesPrepaidCardActionData',
      'loadSalesPrepaidCardsAsyncData',
    ]),

    ...mapMutations('sales_prepaid_card',[
      'setSalesPrepaidCardsFilter',
    ]),

    isPermittedBySetupRole,

    async loadDataTableAsync(pageNumber = PAGE_NUMBER_DEFAULT){
      this.prepaidCardFilter.page_number = pageNumber
      this.setSalesPrepaidCardsFilter(this.prepaidCardFilter)

      await this.clientDictionaryMixin_fetchClientPrepaidCards({
        clientId: this.clientId,
        filter:   this.prepaidCardFilter,
      })
    },

    onChangeShowExpiredAsync(includeExpiredCard){
      this.prepaidCardFilter.include_expired_card = includeExpiredCard
      saveShowExpiredToLocalStorage(includeExpiredCard)
      this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
    },

    onChangePage(pageNumber){
      this.prepaidCardFilter.page_number = pageNumber
      this.loadDataTableAsync(pageNumber)
    },

    // prepaid card
    onActionPrepaidCard(action, prepaidCard){
      this.prepaid_card_action = {action: action,data: prepaidCard}
      this.setSalesPrepaidCardActionData(this.prepaid_card_action)
      this.showDialogById(this.prepaidCardActionModalId)
    },

    onEditedPrepaidCard(){
      this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
      this.$emit('edited-prepaid-card')
    },

    async togglePrepaidCardHistoryModal() {
      this.tableId = guid()
      this.isSortByCreateDate = false
      this.isShowPrepaidCardHistoryModal = !this.isShowPrepaidCardHistoryModal

      if (!this.isShowPrepaidCardHistoryModal && this.is_needing_load_new_prepaid_cards_and_balance_account) {
        // refresh prepaid cards list
        await this.loadDataTableAsync(this.prepaidCardFilter.page_number)
        // refresh client-account
        this.$emit('canceled-move-balance-history')
        this.is_needing_load_new_prepaid_cards_and_balance_account = false
      }

    },

    onClickViewCardHistory(row) {
      this.selected_prepaid_card_history = Object.assign({}, row)
      this.togglePrepaidCardHistoryModal()
      this.loadPrepaidCardHistoryTable()
    },

    sortByCreatedTime(checkboxValue) {
      this.tableId = guid()
      this.isSortByCreateDate = checkboxValue
      this.loadPrepaidCardHistoryTable()
    },

    async loadPrepaidCardHistoryTable(page_number = 1) {
      try {
        this.preLoader()

        const payload = {
          page_number,
          shop_id:                      this.shop_data.shop_id,
          page_size:                    common_options.pagination.default,
          client_id:                    this.selectedPrepaidCardOwnerId,
          client_prepaid_card_id:       this.selected_prepaid_card_history.id,
          is_sort_by_created_date_time: this.isSortByCreateDate,
        }

        const prepaidCardHistoryApi = new PrepaidCardsHistoryAPI()

        const response = await prepaidCardHistoryApi.getPrepaidCardsHistoriesAsync(payload)
        this.currentPrepaidCardHistoryPage = page_number

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.prepaidCardHistoryTableData.rows = response.data.items
        this.prepaidCardHistoryTableData.pagination = response.data.pagination

      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onClickViewSales(prepaidCardHistory) {
      const prepaidCardHistoryType = prepaidCardHistory.prepaid_card_history_type

      const refundTypeOptions = [
        sales_options.prepaid_card_history_type_enum.refund,
        sales_options.prepaid_card_history_type_enum.refund_deleted,
      ]

      if (refundTypeOptions.includes(prepaidCardHistoryType)) {
        const refundAction = {
          action: options.form_actions.view,
          data:   {
            shop_id: prepaidCardHistory.shop_id,
            ref_id:  prepaidCardHistory.refund_id,
          },
          options: {
            sales_goods_type: sales_options.sales_goods_type.service,
          },
        }

        this.setRefundAction(refundAction)
        this.showDialogById(this.refundDetailModalId)
      } else {
        const salesViewModel = new SalesBriefViewModel()
        salesViewModel.fields.shop_id = prepaidCardHistory.shop_id
        salesViewModel.fields.status = prepaidCardHistory.sales_status
        salesViewModel.fields.sales_number = prepaidCardHistory.sales_number
        this.onActionSalesBriefMixin(options.form_actions.view, salesViewModel.getFields(), salesViewModel.fields.status, this.salesDetailModalId)
      }
    },

    async cancelMoveBalancePrepaidCardHistory(prepaidCardHistory) {
      const clientPrepaidCards = this.clientPrepaidCard.items || []
      const selectedPrepaidCard = clientPrepaidCards.find(
        prepaidCard => prepaidCard.id === prepaidCardHistory.client_prepaid_card_id,
      )

      if (selectedPrepaidCard?.balance < prepaidCardHistory.changed_balance) {
        // can not cancel move balance when current balance is not enough to return to the original card
        this._showDialogAlert(this.$t('sales-prepaid-card-tab.invalid-balance-to-return-warning'))
        return
      }

      const payload = {
        shop_id:               this.shop_data.shop_id,
        chain_id:              this.shop_data.chain_id,
        history_id:            prepaidCardHistory.id,
        created_by_id:         this.x_user.user_id,
        created_by_name:       this.x_user.user_name,
        client_id:             prepaidCardHistory.client_id,
        session_token:         this.x_user.session_token,
        branch_number:         this.shop_data.branch_number,
        shop_location:         this.shop_data.shop_location,
        history_ref_id:        prepaidCardHistory.history_ref_id,
        prepaid_card_owner_id: prepaidCardHistory.prepaid_card_owner_id,
      }

      try {
        this.preLoader()
        const balance_move_api = new BalanceMoveApi()

        const response = await balance_move_api.deleteBalanceMoveByHistoryIdAsync(payload)
        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        this.is_needing_load_new_prepaid_cards_and_balance_account = true
        this.loadPrepaidCardHistoryTable(this.currentPrepaidCardHistoryPage)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }

    },

    // balance move
    async onClickMoveBalance() {
      try {
        this.preLoader()

        const prepaidCardsApi = new PrepaidCardsApi()
        const response = await prepaidCardsApi.getPrepaidCardsAsync({
          ...this.prepaidCardFilter,

          page_number: 1,
          page_size:   options.pagination.max,
        })

        if (!response.is_ok) {
          throw new ApiError(response?.error_messages)
        }

        this.moveBalancePrepaidCards = response?.data
        this.showDialogById(this.moveBalanceActionModalId)

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onAddedMoveBalance(){
      this.loadDataTableAsync(PAGE_NUMBER_DEFAULT)
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

    handleNotePrepaidCardHistory(item) {
      this.prepaidCardHistoryNoteVisible = true
      this.prepaidCardHistoryNote = item.notes.user_notes || ''
      this.prepaidCardHistoryId = item.id
    },

    handlePrepaidCardHistoryNoteHidden() {
      this.prepaidCardHistoryNoteVisible = false
      this.prepaidCardHistoryNote = ''
      this.prepaidCardHistoryId = ''
    },

    async handlePrepaidCardHistoryNoteInput(note) {
      try {
        this.preLoader()

        const payload = {
          id: this.prepaidCardHistoryId,
          note,
        }

        await updatePrepaidCardHistoryNote(payload)
        await this.loadPrepaidCardHistoryTable()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },
  },
}
</script>

<style lang="scss">
@import './sales-prepaid-cards.scss';
</style>
