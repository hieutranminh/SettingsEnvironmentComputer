<template>
  <!-- Add Booking -> Details -> Prepaid Cards -->
  <div class="client-prepaid-cards">
    <client-prepaid-cards
      :items="items"
      :paging-info="pagingInfo"
      :client-id="client.clientId"
      :is-edit-enabled="isEditEnabled"
      :include-expired-card="includeExpiredCard"
      :is-move-balance-enabled="isMoveBalanceEnabled"

      @histories-click="$emit('histories-click', $event)"
      @change-page="_MIXIN_clientPrepaidCardsInventory_handlePageChange"
      @include-expired-card-change="_MIXIN_clientPrepaidCardsInventory_handleIncludeExpiredCardChange"
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
// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ClientPrepaidCards from 'Modules/clients/components/client-prepaid-cards/client-prepaid-cards.vue'

// Mixins
import ClientPrepaidCardsInventoryMixin from 'Modules/clients/mixins/client-prepaid-cards-inventory.js'

// Constants
import { PAGINATION } from 'Constant'

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
  },

  extends: ComponentBase,

  mixins: [
    ClientPrepaidCardsInventoryMixin('_calendar/clientInformation'),
  ],

  props: {
    isEditEnabled: {
      type:    Boolean,
      default: true,
    },

    isMoveBalanceEnabled: {
      type:    Boolean,
      default: true,
    },

    isCancelMoveEnabled: {
      type:    Boolean,
      default: true,
    },

    isShowViewOldDataButton: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      pageNumber:         1,
      includeExpiredCard: getShowExpiredFromLocalStorage(),
      pageSize:           PAGINATION.DEFAULT,
    }
  },

  created() {
    this._MIXIN_clientPrepaidCardsInventory_loadClientPrepaidCards()
  },
}
</script>

<style lang="scss" scoped>
  @import "./client-prepaid-cards.scss";
</style>
