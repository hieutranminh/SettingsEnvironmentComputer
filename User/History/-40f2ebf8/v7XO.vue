<template>
  <!-- Context Menu -> Client Information -> Prepaid Cards -->
  <div class="client-prepaid-cards">
    <client-prepaid-cards
      :items="items"
      :paging-info="pagingInfo"
      :client-id="client.clientId"
      :include-expired-card="includeExpiredCard"
      :is-payment-in-process="isPaymentInProcess"

      @change-page="_MIXIN_clientPrepaidCardsInventory_handlePageChange"
      @move-balance="$emit('move-balance', $event)"
      @edit-click="$emit('edit-click', $event)"
      @histories-click="$emit('histories-click', $event)"
      @include-expired-card-change="handleIncludeExpiredCardChange($event)"
    >
      <template #view-old-data>
        <aha-button
          v-if="isShowViewOldDataButton"
          class="client-prepaid-cards__old-data"
          variant="blue"
          @click="$emit('view-old-data')"
        >
          {{ $t('general.old-data') }}
        </aha-button>
      </template>
    </client-prepaid-cards>
  </div>
</template>

<script>
// Mixins
import ClientPrepaidCardsInventoryMixin from 'Modules/clients/mixins/client-prepaid-cards-inventory.js'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ClientPrepaidCards from 'Modules/clients/components/client-prepaid-cards/client-prepaid-cards.vue'

// Constants
import { options } from 'OptionsHelpers'

const SHOW_EXPIRED_STORAGE_KEY = 'prepaid_cards_show_expired'

function getShowExpiredFromLocalStorage() {
  try {
    if (typeof localStorage === 'undefined') return true
    const savedValue = localStorage.getItem(SHOW_EXPIRED_STORAGE_KEY)
    if (savedValue === null) {
      return true
    }
    return savedValue === 'true'
  } catch (error) {
    return true
  }
}

export default {
  components: {
    ClientPrepaidCards,
    ClientPrepaidCardHistories: () => import('Modules/clients/components/client-prepaid-card-histories/client-prepaid-card-histories.vue'),
  },

  extends: ComponentBase,

  mixins: [
    ClientPrepaidCardsInventoryMixin('_calendar/checkoutAction'),
  ],

  props: {
    isShowViewOldDataButton: {
      type:    Boolean,
      default: false,
    },

    isPaymentInProcess: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      pageNumber:         1,
      is_mobile:          this.isMobile(),
      includeExpiredCard: getShowExpiredFromLocalStorage(),
      pageSize:           options.pagination.default,
    }
  },

  created() {
    this._MIXIN_clientPrepaidCardsInventory_loadClientPrepaidCards()
  },

  methods: {
    handleIncludeExpiredCardChange(event) {
      this._MIXIN_clientPrepaidCardsInventory_handleIncludeExpiredCardChange(event)
      this.$emit('include-expired-card-change', event)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-prepaid-cards.scss";
</style>
