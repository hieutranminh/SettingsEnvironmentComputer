<template>
  <div class="prepaid-services">
    <div class="prepaid-services__header">
      <a-button
        v-if="isDeductPrepaidServicesButtonShown"
        :disabled="isDeductPrepaidServicesButtonDisabled"
        variant="primary"
        @click="handleDeductPrepaidServiceClick"
      >
        {{ $t('sales.deduct-prepaid-services') }}
      </a-button>

      <b-form-checkbox
        :value="true"
        :unchecked-value="false"
        :checked="includeExpired"
        @input="handleIncludeExpiredChange"
      >
        {{ $t('sales-prepaid-service-tab.show-expired') }}
      </b-form-checkbox>

      <slot name="view-old-data" />
    </div>

    <div class="prepaid-services__container">
      <!-- Mobile -->
      <div
        v-if="isMobileDevice || isAndroidSmallTablet"
        class="prepaid-services__wrapper"
      >
        <template v-if="prepaidServices.length">
          <div
            v-for="prepaidService in prepaidServices"

            :key="`client_prepaid_service${prepaidService.id}`"
            :class="prepaidServicesInnerClass(prepaidService.id, prepaidService)"
            @click="handlePrepaidServiceClick(prepaidService.id)"
          >
            <div
              class="prepaid-services__content"
            >
              <div class="prepaid-services__content--left">
                <b-form-checkbox
                  v-if="haveMoreThanOneValidPrepaidService && isDeductPrepaidServicesButtonShown && !isCheckboxDisabled(prepaidService)"
                  class="prepaid-services__checkbox"
                  @change="selectedPrepaidService(prepaidService)"
                />
              </div>

              <div class="prepaid-services__content--right">
                <div class="prepaid-services__prepaid-service-name row">
                  {{ prepaidService.prepaidServiceName }}
                  <span v-if="formatShopAndFamilyInfo(prepaidService)">
                    {{ formatShopAndFamilyInfo(prepaidService) }}
                  </span>
                </div>

                <div class="prepaid-services__prepaid-service-quantity row">
                  <p class="col-6">
                    {{ $t('sales-prepaid-service-tab.remaining-quantity') }}
                  </p>
                  <p class="col-6">
                    {{ prepaidService.quantity | formatQuantity }}
                  </p>
                </div>

                <div class="prepaid-services__prepaid-service-expiry-date row">
                  <p class="col-6">
                    {{ $t('sales-prepaid-service-tab.expiry-date') }}
                  </p>
                  <p class="col-6">
                    {{ prepaidService.expiryDateTS | formatExpiryDate }}
                  </p>
                </div>

                <template v-if="isExpanded(prepaidService.id)">
                  <div class="prepaid-services__prepaid-service-initial-quantity row">
                    <p class="col-6">
                      {{ $t('sales-prepaid-service-tab.initial-quantity') }}
                    </p>
                    <p class="col-6">
                      {{ prepaidService.initialQuantity | formatQuantity }}
                    </p>
                  </div>

                  <div class="prepaid-services__prepaid-service-revenue-per-service row">
                    <p class="col-6">
                      {{ $t('sales-prepaid-service-tab.revenue-per-service') }}
                    </p>
                    <p class="col-6">
                      {{ prepaidService.relatedServiceUnitPrice | formatRevenuePerService }}
                    </p>
                  </div>

                  <div class="prepaid-services__prepaid-service-issue-date row">
                    <p class="col-6">
                      {{ $t('sales-prepaid-service-tab.issue-date') }}
                    </p>
                    <p class="col-6">
                      {{ prepaidService.invoiceDateTimeTS | formatIssueDate }}
                    </p>
                  </div>

                  <div class="prepaid-services__prepaid-service-group-button row">
                    <div
                      v-if="!isPaymentInProcess"
                      class="prepaid-services__actions"
                    >
                      <a-button
                        v-if="isShowEditAction(prepaidService)"
                        class="prepaid-services__actions-button prepaid-services__actions-button--edit"
                        ghost
                        variant="primary"
                        @click="editPrepaidServicesHandler(prepaidService)"
                      >
                        {{ $t('general.edit') }}
                      </a-button>
                    </div>

                    <div class="prepaid-services__actions">
                      <a-button
                        class="prepaid-services__actions-button prepaid-services__actions-button--histories"
                        ghost
                        variant="primary"
                        @click="$emit('histories-click', prepaidService)"
                      >
                        {{ $t('sales.view-history') }}
                      </a-button>
                    </div>
                  </div>
                </template>

                <div
                  :class="showMoreClass(prepaidService.id)"
                  @click="handleShowMoreClick(prepaidService.id)"
                >
                  >
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="prepaid-services__table-empty">
            {{ $t('general.table-empty') }}
          </div>
        </template>
      </div>

      <!-- Desktop -->
      <table
        v-else
        class="prepaid-services__table thead-sticky"
      >
        <thead>
          <tr>
            <th
              v-if="haveMoreThanOneValidPrepaidService && isDeductPrepaidServicesButtonShown"
              style="width: 5%"
            >
              {{ $t('general.select') }}
            </th>
            <th v-if="hasChainAndShareClient">
              {{ $t('general.loc') }}
            </th>
            <th width="30%">
              {{ $t('sales-prepaid-service-tab.prepaid-service-name') }}
            </th>
            <th>{{ $t('sales-prepaid-service-tab.remaining-quantity') }}</th>
            <th>{{ $t('sales-prepaid-service-tab.expiry-date') }}</th>
            <th>{{ $t('sales-prepaid-service-tab.initial-quantity') }}</th>
            <th>{{ $t('sales-prepaid-service-tab.revenue-per-service') }}</th>
            <th>{{ $t('sales-prepaid-service-tab.issue-date') }}</th>
            <th v-if="isEditEnabled && !isPaymentInProcess">
              {{ $t('general.edit') }}
            </th>
            <th>{{ $t('general.history') }}</th>
          </tr>
        </thead>
        <template v-if="prepaidServices.length">
          <tbody
            v-for="prepaidService in prepaidServices"
            :key="`client_prepaid_service${prepaidService.id}`"
          >
            <tr :class="prepaidServiceClass(prepaidService)">
              <td
                v-if="haveMoreThanOneValidPrepaidService && isDeductPrepaidServicesButtonShown"
                class="custom-td-min-width"
              >
                <b-form-checkbox
                  v-if="!isCheckboxDisabled(prepaidService)"
                  class="prepaid-services__checkbox"
                  @change="selectedPrepaidService(prepaidService)"
                />
              </td>
              <td
                v-if="hasChainAndShareClient"
                style="min-width : 50px"
              >
                <div
                  v-b-tooltip.hover.right
                  :title="prepaidService.shopName"
                >
                  {{ getBranchNumber(prepaidService.branchNumber, prepaidService.shopId) }}
                </div>
              </td>

              <td>
                <div class="prepaid-services__prepaid-service-name">
                  {{ prepaidService.prepaidServiceName }}
                  <span v-if="formatShopAndFamilyInfo(prepaidService)">
                    {{ formatShopAndFamilyInfo(prepaidService) }}
                  </span>
                </div>
              </td>

              <td class="prepaid-services__remaining-quantity">
                {{ prepaidService.quantity | formatQuantity }}
              </td>

              <td>{{ prepaidService.expiryDateTS | formatExpiryDate }}</td>

              <td>{{ prepaidService.initialQuantity | formatQuantity }}</td>

              <td>{{ prepaidService.relatedServiceUnitPrice | formatRevenuePerService }}</td>

              <td>{{ prepaidService.invoiceDateTimeTS | formatIssueDate }}</td>

              <td v-if="isEditEnabled && !isPaymentInProcess">
                <div class="prepaid-services__actions">
                  <b-button
                    v-if="isShowEditAction(prepaidService)"
                    class="prepaid-services__actions-button prepaid-services__actions-button--edit"
                    variant="outline-primary"
                    @click="editPrepaidServicesHandler(prepaidService)"
                  >
                    {{ $t('general.edit') }}
                  </b-button>
                </div>
              </td>

              <td>
                <div class="prepaid-services__actions">
                  <b-button
                    class="prepaid-services__actions-button prepaid-services__actions-button--histories"
                    variant="outline-primary"
                    @click="$emit('histories-click', prepaidService)"
                  >
                    {{ $t('general.view') }}
                  </b-button>
                </div>
              </td>
            </tr>
          </tbody>
        </template>

        <template v-else>
          <tbody>
            <tr>
              <td colspan="10">
                {{ $t('general.table-empty') }}
              </td>
            </tr>
          </tbody>
        </template>
      </table>

      <div
        v-if="isShowPrepaidServiceComment"
        class="prepaid-services__desc mt-3"
      >
        <p>{{ $t('sales.please-select-the-prepaid-service-to-deduct') }}</p>
      </div>
    </div>

    <pagination
      :pagination="pagination"
      @change-page="$emit('change-page', $event)"
    />
  </div>
</template>

<script>

// Utilities
import i18n from 'Translate'
import { cloneDeep } from 'lodash'
import { isPermissionGranted } from 'PermissionHelpers'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { formatMoney, getBranchNumber } from 'CommonHelpers'
import { convertTimestampToMomentUTC, convertDateToTimezone, convertDateToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import ACheckbox from 'Modules/aha/a-checkbox/a-checkbox.vue'
import Pagination from 'CommonComponents/pagination/pagination.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Models
import ClientPrepaidService from 'Models/client/clientPrepaidService'

// Constants
import { options } from 'OptionsHelpers'
import { PERMISSION_TYPE } from 'Constant'
import { sales_options } from 'Options/sales-options'
import AButton from 'Modules/aha/a-button/a-button.vue'
import SalesViewModel from 'ViewModels/sales/sales/sales-view-model'

// Mixins
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'

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
  filters: {
    formatQuantity(value) {
      if (value === options.enum_no_limit) {
        return i18n.t('general.no-limit')
      }

      return formatMoney(value, 0)
    },

    formatIssueDate(invoiceDateTimeTS) {
      return convertTimestampToMomentUTC(invoiceDateTimeTS).format('YYYY-MM-DD')
    },

    formatExpiryDate(value) {
      if (value === options.enum_no_limit) {
        return i18n.t('general.no-limit')
      }

      return convertTimestampToMomentUTC(value).format('YYYY-MM-DD')
    },

    formatRevenuePerService(value) {
      return formatMoney(value, 0)
    },
  },

  components: {
    AButton,
    ACheckbox,
    Pagination,
  },

  extends: ComponentBase,

  mixins: [SalesCacheMixin],

  props: {
    items: {
      type:    Array,
      default: () => [],
    },

    clientId: {
      type:    Number,
      default: null,
    },

    pagingInfo: {
      type:    Object,
      default: () => ({
        pageSize:   0,
        pageNumber: 0,
        totalItems: 0,
      }),
    },

    includeExpired: {
      type:    Boolean,
      default: false,
    },

    isEditEnabled: {
      type:    Boolean,
      default: true,
    },

    client: {
      type:    Object,
      default: () => ({}),
    },

    isPaymentInProcess: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      expandedIds:                [],
      selectedPrepaidServiceId:   null,
      selectedPrepaidServiceList: [],
      allowEditRemaining:         sales_options.security_level_enum.master,
    }
  },

  computed: {
    ...mapGetters('device', ['isMobileDevice', 'isAndroidSmallTablet']),
    ...mapState('_calendar/checkoutAction', ['booking']),

    prepaidServices() {
      return this.items.map(item => ClientPrepaidService.build(item))
    },

    pagination() {
      return {
        page_size:   this.pagingInfo.pageSize,
        page_number: this.pagingInfo.pageNumber,
        total_items: this.pagingInfo.totalItems,
        total_pages: Math.ceil(this.pagingInfo.totalItems / this.pagingInfo.pageSize),
      }
    },

    hasChainAndShareClient () {
      return this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client
    },

    isCheckedOutBookingStatus () {
      return this.booking.status === options.booking.booking_status.checked_out
    },

    isNoShowBookingStatus () {
      return this.booking.status === options.booking.booking_status.no_show
    },

    isDisabled() {
      return !this.validPrepaidServices.length === 1 || (!this.validPrepaidServices.length || this.selectedPrepaidServiceList.length === 0)
    },

    isDeductPrepaidServicesButtonDisabled() {
      return !this.haveOnlyOneValidPrepaidService && (this.selectedPrepaidServiceList.length === 0 ||this.haveNoValidPrepaidService)
    },

    haveMoreThanOneValidPrepaidService() {
      return this.validPrepaidServices.length > 1
    },

    haveNoValidPrepaidService() {
      return this.validPrepaidServices.length === 0
    },

    validPrepaidServices() {
      const validPrepaidServices = this.prepaidServices.filter(prepaidService => {
        const { isOutOfQuantity, isExpired } = this.checkStatusPrepaidService(prepaidService)
        if(!isOutOfQuantity && !isExpired) {
          return prepaidService
        }
      })

      return validPrepaidServices
    },

    haveOnlyOneValidPrepaidService() {
      return this.validPrepaidServices.length === 1
    },

    isShowPrepaidServiceComment() {
      return this.haveMoreThanOneValidPrepaidService && this.isDeductPrepaidServicesButtonShown
    },

    isDeductPrepaidServicesButtonShown() {
      return this.isCheckedOutBookingStatus || this.isNoShowBookingStatus
    },

    isAllowEditSetup() {
      if (this.isStaffRole || this.isManagerRole) {
        const permissionType = this.isStaffRole
          ? PERMISSION_TYPE.STAFF
          : PERMISSION_TYPE.MANAGER

        return isPermissionGranted(permissionType, this.allowEditRemaining)
      }

      return true
    },
  },

  mounted() {
    this.initSalesSetup()
    document.addEventListener('click', this.handleOutsideClick)

    // Emit initial value from localStorage to sync with parent
    const savedShowExpired = getShowExpiredFromLocalStorage()
    if (savedShowExpired !== this.includeExpired) {
      this.$emit('include-expired-change', savedShowExpired)
    }
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
  },

  methods: {
    getBranchNumber,

    ...mapMutations('sales', [
      'setSalesAction',
    ]),

    async initSalesSetup() {
      const environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
        shopId:      this.shop_data.shop_id,
        countryCode: this.shop_data.country,
      })

      if (this.isNullObject(environmentSetup)) {
        this.showMissingSalesSetupAlert()
      } else {
        this.allowEditRemaining = environmentSetup?.data_protection_security?.fields?.allow_edit_balance_royalty_points_prepaid_services_remaining
      }
    },

    checkFamilyMemberPrepaidService(clientPrepaidService) {
      return clientPrepaidService.clientId !== this.clientId
    },

    checkDiffShopPrepaidService(clientPrepaidService) {
      return clientPrepaidService.shopId !== this.shop_data.shop_id
    },

    handleIncludeExpiredChange(includeExpired) {
      saveShowExpiredToLocalStorage(includeExpired)
      this.$emit('include-expired-change', includeExpired)
    },

    checkStatusPrepaidService(prepaidService) {
      const isOutOfQuantity = prepaidService.quantity !== options.enum_no_limit &&
      prepaidService.quantity <= 0

      const now = convertDateToTimezone()
      const isExpired = prepaidService.expiryDateTS !== options.enum_no_limit &&
      convertTimestampToMomentUTC(prepaidService.expiryDateTS).isBefore(convertDateToMomentUTC(now))

      return {
        isOutOfQuantity,
        isExpired,
      }
    },

    prepaidServiceClass(prepaidService) {
      const { isOutOfQuantity, isExpired } = this.checkStatusPrepaidService(prepaidService)

      return ['prepaid-service-row', {
        'prepaid-service-row--expired': isOutOfQuantity || isExpired,
      }]
    },

    isShowEditAction(prepaidService) {
      return this.isEditEnabled && !this.checkDiffShopPrepaidService(prepaidService) && this.isAllowEditSetup
    },

    selectedPrepaidService(selectedPrepaidService) {

      const seletedPrepaidServiceIndex = this.selectedPrepaidServiceList.findIndex(prepaidService => {
        return prepaidService.id === selectedPrepaidService.id
      })

      if(seletedPrepaidServiceIndex === -1) {
        this.selectedPrepaidServiceList.push(selectedPrepaidService)
      } else {
        this.selectedPrepaidServiceList.splice(seletedPrepaidServiceIndex, 1)
      }
    },

    isCheckboxDisabled(prepaidService) {
      const { isOutOfQuantity, isExpired } = this.checkStatusPrepaidService(prepaidService)
      return isOutOfQuantity || isExpired
    },

    async handleDeductPrepaidServiceClick() {
      const salesSetup = await this.$salesCacheMixin_getAllSalesSetup({
        shopId: this.shop_data.shop_id,
      })

      if(this.isMissingSalesSetup(salesSetup)) {
        this._showDialogAlert(salesSetup.error_messages)
      }

      let deductionPrepaidService = cloneDeep(this.selectedPrepaidServiceList)
      // Auto add the only active prepaid service
      if(this.haveOnlyOneValidPrepaidService) {
        deductionPrepaidService = cloneDeep(this.validPrepaidServices)
      }

      const tmpSales = new SalesViewModel()
      deductionPrepaidService.forEach(item => {
        const revertFields = tmpSales.revertDeductPrepaidServiceFieldData(item)
        tmpSales.mapDeductPrepaidServiceToSalesFromSalesPrepaidService(this.client, revertFields, salesSetup)
      })

      tmpSales.setFields({client_name: this.client.clientName})
      tmpSales.setFields({client_id: this.clientId})

      const salesAction = {
        data:    tmpSales.getFields(),
        action:  options.form_actions.add,
        options: {
          sales_goods_type: sales_options.sales_goods_type.service,
        },
      }

      this.setSalesAction(salesAction)
      this.$emit('sales-action-modal-show')

    },

    showMoreClass(id) {
      return ['prepaid-services__show-more-text', {
        'prepaid-services__show-more-text--active': this.isExpanded(id),
      }]
    },

    prepaidServicesInnerClass(id, prepaidService) {
      const { isOutOfQuantity, isExpired } = this.checkStatusPrepaidService(prepaidService)
      return ['prepaid-services__inner', {
        'prepaid-services__inner--active': this.selectedPrepaidServiceId === id,
        'prepaid-service-row--expired':    isOutOfQuantity || isExpired,
      }]
    },

    handleShowMoreClick(id) {
      const index = this.expandedIds.indexOf(id)

      if (index > -1) {
        this.expandedIds.splice(index, 1)
      } else {
        this.expandedIds.push(id)
      }
    },

    isExpanded(id) {
      return this.expandedIds.includes(id)
    },

    handlePrepaidServiceClick(id) {
      this.selectedPrepaidServiceId = id // Set the selectedPrepaidServiceId ID to the clicked item's ID
    },

    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.selectedPrepaidServiceId = null
      }
    },

    editPrepaidServicesHandler(prepaidServices) {
      prepaidServices.includeExpiredPrepaidServices = this.includeExpired
      this.$emit('edit-click', prepaidServices)
    },

    formatShopAndFamilyInfo(prepaidService) {
      // Create an array and add shopName if it's different and clientName if it's different
      const tmpInfos = [
        this.checkDiffShopPrepaidService(prepaidService) ? prepaidService.shopName : null,
        this.checkFamilyMemberPrepaidService(prepaidService) ? prepaidService.clientName : null,
      ].filter(Boolean) // Remove null or undefined values

      // If the tmpInfos array contains any values, join them with a comma and wrap in parentheses, otherwise return an empty string
      return tmpInfos.length ? `(${tmpInfos.join(', ')})` : ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-prepaid-services.scss";
</style>
