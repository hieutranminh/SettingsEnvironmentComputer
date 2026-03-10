<template>
  <div class="prepaid-cards">
    <div class="prepaid-cards__header">
      <b-form-checkbox
        :value="true"
        :unchecked-value="false"
        :checked="includeExpiredCard"
        @input="handleIncludeExpiredCardChange"
      >
        {{ $t('sales-prepaid-card-tab.show-expired') }}
      </b-form-checkbox>

      <aha-button
        v-if="isMoveBalanceEnabled && !isPaymentInProcess"

        :disabled="isDisableMoveBalcance"
        variant="blue"
        @click="moveBalancePrepaidCardHandler()"
      >
        {{ $t('sales-prepaid-card-tab.move-balance') }}
      </aha-button>
      <slot name="view-old-data" />
    </div>

    <div class="prepaid-cards__container">
      <!-- Mobile -->
      <div
        v-if="isMobileDevice || isAndroidSmallTablet"
        class="prepaid-cards__wrapper"
      >
        <template v-if="prepaidCards.length">
          <div
            v-for="prepaidCard in prepaidCards"

            :key="`client_prepaid_card${prepaidCard.id}`"
            :class="prepaidCardsInnerClass(prepaidCard.id, prepaidCard)"
            @click="handlePrepaidCardClick(prepaidCard.id)"
          >
            <div class="prepaid-cards__prepaid-card-name row">
              {{ prepaidCard.prepaidCardName }}
              <span v-if="formatShopAndFamilyInfo(prepaidCard)">
                {{ formatShopAndFamilyInfo(prepaidCard) }}
              </span>
            </div>

            <div class="prepaid-cards__prepaid-card-balance row">
              <p class="col-6">
                {{ $t('sales-prepaid-card-tab.balance') }}
              </p>
              <p class="col-6">
                {{ prepaidCard.balance | formatMoney }}
              </p>
            </div>

            <div class="prepaid-cards__prepaid-card-expiry-date row">
              <p class="col-6">
                {{ $t('sales-prepaid-card-tab.expiry-date') }}
              </p>
              <p class="col-6">
                {{ prepaidCard | formmatExpiryDate }}
              </p>
            </div>

            <template v-if="isExpanded(prepaidCard.id)">
              <div class="prepaid-cards__prepaid-card-earned-amount row">
                <p class="col-6">
                  {{ $t('sales-prepaid-card-tab.earned-amount') }}
                </p>
                <p class="col-6">
                  {{ prepaidCard.initialBalance | formatMoney }}
                </p>
              </div>

              <div class="prepaid-cards__prepaid-card-service-dc row">
                <p class="col-6">
                  {{ $t('sales-prepaid-card-tab.service-dc') }}
                </p>
                <p class="col-6">
                  {{ prepaidCard.discountForService }}%
                </p>
              </div>

              <div class="prepaid-cards__prepaid-card-product-dc row">
                <p class="col-6">
                  {{ $t('sales-prepaid-card-tab.product-dc') }}
                </p>
                <p class="col-6">
                  {{ prepaidCard.discountForProduct }}%
                </p>
              </div>

              <div class="prepaid-cards__prepaid-card-issue-date row">
                <p class="col-6">
                  {{ $t('sales-prepaid-card-tab.issue-date') }}
                </p>
                <p class="col-6">
                  {{ prepaidCard.invoiceDateTimeTS | formatIssueDate }}
                </p>
              </div>

              <div class="prepaid-cards__prepaid-card-group-button row">
                <div
                  v-if="!isPaymentInProcess"
                  class="prepaid-cards__actions"
                >
                  <a-button
                    v-if="isShowEditAction(prepaidCard)"
                    class="prepaid-cards__actions-button prepaid-cards__actions-button--edit"
                    ghost
                    variant="primary"
                    @click="editPrepaidCardHandler(prepaidCard)"
                  >
                    {{ $t('general.edit') }}
                  </a-button>
                </div>

                <div class="prepaid-cards__actions">
                  <a-button
                    class="prepaid-cards__actions-button prepaid-cards__actions-button--histories"
                    ghost
                    variant="primary"
                    @click="$emit('histories-click', prepaidCard)"
                  >
                    {{ $t('sales.view-history') }}
                  </a-button>
                </div>
              </div>
            </template>

            <div
              :class="showMoreClass(prepaidCard.id)"
              @click="handleShowMoreClick(prepaidCard.id)"
            >
              >
            </div>
          </div>
        </template>

        <template v-else>
          <div class="prepaid-cards__table-empty">
            {{ $t('general.table-empty') }}
          </div>
        </template>
      </div>

      <!-- Desktop -->
      <table
        v-else
        class="prepaid-cards__table thead-sticky"
      >
        <thead>
          <tr>
            <th v-if="hasChainAndShareClient">
              {{ $t('general.loc') }}
            </th>
            <th>{{ $t('sales-prepaid-card-tab.card-name') }}</th>
            <th>{{ $t('sales-prepaid-card-tab.balance') }}</th>
            <th>{{ $t('sales-prepaid-card-tab.expiry-date') }}</th>
            <th>{{ $t('sales-prepaid-card-tab.earned-amount') }}</th>
            <th>{{ $t('sales-prepaid-card-tab.service-dc') }}</th>
            <th>{{ $t('sales-prepaid-card-tab.product-dc') }}</th>
            <th>{{ $t('sales-prepaid-card-tab.issue-date') }}</th>
            <th v-if="isEditEnabled && !isPaymentInProcess">
              {{ $t('general.edit') }}
            </th>
            <th>{{ $t('general.history') }}</th>
          </tr>
        </thead>

        <template v-if="prepaidCards.length">
          <tbody
            v-for="prepaidCard in prepaidCards"
            :key="`client_prepaid_card_${prepaidCard.id}`"
          >
            <tr :class="prepaidCardClass(prepaidCard)">
              <td v-if="hasChainAndShareClient">
                <div
                  v-b-tooltip.hover.right
                  :title="prepaidCard.shopName"
                >
                  {{ getBranchNumber(prepaidCard.branchNumber, prepaidCard.shopId) }}
                </div>
              </td>

              <td>
                <div class="prepaid-cards__prepaid-card-name">
                  {{ prepaidCard.prepaidCardName }}
                  <span v-if="formatShopAndFamilyInfo(prepaidCard)">
                    {{ formatShopAndFamilyInfo(prepaidCard) }}
                  </span>
                </div>
              </td>

              <td class="prepaid-cards__balance">
                {{ prepaidCard.balance | formatMoney }}
              </td>

              <td>{{ prepaidCard | formmatExpiryDate }}</td>

              <td>{{ prepaidCard.initialBalance | formatMoney }}</td>

              <td>
                <template v-if="prepaidCard.discountForService">
                  {{ prepaidCard.discountForService }}%
                </template>
              </td>

              <td>
                <template v-if="prepaidCard.discountForProduct">
                  {{ prepaidCard.discountForProduct }}%
                </template>
              </td>

              <td>{{ prepaidCard.invoiceDateTimeTS | formatIssueDate }}</td>

              <td v-if="isEditEnabled && !isPaymentInProcess">
                <div class="prepaid-cards__actions">
                  <b-button
                    v-if="isShowEditAction(prepaidCard)"
                    variant="outline-primary"
                    class="prepaid-cards__actions-button prepaid-cards__actions-button--edit"
                    @click="editPrepaidCardHandler(prepaidCard)"
                  >
                    {{ $t('general.edit') }}
                  </b-button>
                </div>
              </td>
              <td>
                <div class="prepaid-cards__actions">
                  <b-button
                    variant="outline-primary"
                    class="prepaid-cards__actions-button prepaid-cards__actions-button--histories"
                    @click="$emit('histories-click', prepaidCard)"
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
import { mapGetters } from 'vuex'
import { sales_options } from 'Options/sales-options'
import { isPermissionGranted } from 'PermissionHelpers'
import { formatMoney, getBranchNumber } from 'CommonHelpers'
import { convertTimestampToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import Pagination from 'CommonComponents/pagination/pagination.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'

// Constant
import { options } from 'OptionsHelpers'
import { PERMISSION_TYPE } from 'Constant'

// Models
import ClientPrepaidCard from 'Models/client/clientPrepaidCard'

// Mixins
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'

export default {
  filters: {
    formatMoney(value) {
      return formatMoney(value, 0)
    },

    formatIssueDate(invoiceDateTimeTS) {
      return convertTimestampToMomentUTC(invoiceDateTimeTS).format('YYYY-MM-DD')
    },

    formmatExpiryDate(clientPrepaidCard) {
      if (clientPrepaidCard.isNoLimit) {
        return i18n.t('general.no-limit')
      }

      return convertTimestampToMomentUTC(clientPrepaidCard.expiryDateTS).format('YYYY-MM-DD')
    },
  },

  components: {
    AButton,
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

    includeExpiredCard: {
      type:    Boolean,
      default: false,
    },

    isEditEnabled: {
      type:    Boolean,
      default: true,
    },

    isMoveBalanceEnabled: {
      type:    Boolean,
      default: true,
    },

    isPaymentInProcess: {
      type:    Boolean,
      default: false,
    },
  },

  data () {
    return {
      expandedIds:           [],
      selectedPrepaidCardId: null,
      allowEditRemaining:    sales_options.security_level_enum.master,
    }
  },

  computed: {
    ...mapGetters('device', ['isMobileDevice', 'isAndroidSmallTablet']),

    prepaidCards() {
      return this.items.map(item => ClientPrepaidCard.build(item))
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

    isDisableMoveBalcance () {

      const validPrepaidCard = this.prepaidCards.find(prepaidCard => {
        return prepaidCard.status === options.good_status.active
      })

      return this.prepaidCards.length === 0 || !validPrepaidCard
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
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
  },

  methods: {
    getBranchNumber,

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

    checkFamilyMemberPrepaidCard(clientPrepaidCard) {
      return clientPrepaidCard.clientId !== this.clientId
    },

    checkDiffShopPrepaidCard(clientPrepaidCard) {
      return clientPrepaidCard.shopId !== this.shop_data.shop_id
    },

    handleIncludeExpiredCardChange(includeExpiredCard) {
      this.selectedPrepaidCardId = null
      this.expandedIds = []
      this.$emit('include-expired-card-change', includeExpiredCard)
    },

    prepaidCardClass(prepaidCard) {
      return ['prepaid-card-row', {
        'prepaid-card-row--expired': prepaidCard.isExpired,
      }]
    },

    isShowEditAction(prepaidCard) {
      return this.isEditEnabled && !this.checkDiffShopPrepaidCard(prepaidCard) && this.isAllowEditSetup
    },

    showMoreClass(id) {
      return ['prepaid-cards__show-more-text', {
        'prepaid-cards__show-more-text--active': this.isExpanded(id),
      }]
    },

    prepaidCardsInnerClass(id, prepaidCard) {
      return ['prepaid-cards__inner', {
        'prepaid-cards__inner--active': this.selectedPrepaidCardId === id,
        'prepaid-card-row--expired':    prepaidCard.isExpired,
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

    handlePrepaidCardClick(id) {
      this.selectedPrepaidCardId = id // Set the selectedPrepaidCardId ID to the clicked item's ID
    },

    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.selectedPrepaidCardId = null
      }
    },

    editPrepaidCardHandler(prepaidCard) {
      prepaidCard.includeExpiredCard = this.includeExpiredCard
      this.$emit('edit-click', prepaidCard)
    },

    formatShopAndFamilyInfo(prepaidCard) {
      // Create an array and add shopName if it's different and clientName if it's different
      const tmpInfos = [
        this.checkDiffShopPrepaidCard(prepaidCard) ? prepaidCard.shopName : null,
        this.checkFamilyMemberPrepaidCard(prepaidCard) ? prepaidCard.clientName : null,
      ].filter(Boolean) // Remove null or undefined values

      // If the tmpInfos array contains any values, join them with a comma and wrap in parentheses, otherwise return an empty string
      return tmpInfos.length ? `(${tmpInfos.join(', ')})` : ''
    },

    moveBalancePrepaidCardHandler() {
      this.$emit('move-balance', this.includeExpiredCard)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-prepaid-cards.scss";
</style>
