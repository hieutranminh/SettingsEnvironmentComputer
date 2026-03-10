<template>
  <!-- Context Menu -> Client Information -> Prepaid Services -->
  <div class="client-prepaid-services">
    <client-prepaid-services
      :items="items"
      :client="client"
      :paging-info="pagingInfo"
      :client-id="client.clientId"
      :include-expired="includeExpired"
      :is-payment-in-process="isPaymentInProcess"

      @edit-click="$emit('edit-click', $event)"
      @histories-click="$emit('histories-click', $event)"
      @sales-action-modal-show="onSalesActionShow"
      @change-page="_MIXIN_clientPrepaidServicesInventory_handlePageChange"
      @include-expired-change="_MIXIN_clientPrepaidServicesInventory_handleIncludeExpiredChange"
    >
      <template #view-old-data>
        <aha-button
          v-if="isShowViewOldDataButton"
          class="client-booking-histories__view-old-data"
          variant="blue"
          @click="$emit('view-old-data')"
        >
          {{ $t('general.old-data') }}
        </aha-button>
      </template>
    </client-prepaid-services>
  </div>
</template>

<script>
// Mixins
import ClientPrepaidServicesInventoryMixin from 'Modules/clients/mixins/client-prepaid-services-inventory.js'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ClientPrepaidServices from 'Modules/clients/components/client-prepaid-services/client-prepaid-services.vue'

// Constant
import { options } from 'OptionsHelpers'

const SHOW_EXPIRED_STORAGE_KEY = 'prepaid_services_show_expired'

function getShowExpiredFromLocalStorage() {
  const savedValue = localStorage.getItem(SHOW_EXPIRED_STORAGE_KEY)
  if (savedValue === null) {
    return true
  }
  return savedValue === 'true'
}

export default {
  components: {
    ClientPrepaidServices,
  },

  extends: ComponentBase,

  mixins: [
    ClientPrepaidServicesInventoryMixin('_calendar/checkoutAction'),
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
      pageNumber:     1,
      includeExpired: getShowExpiredFromLocalStorage(),
      is_mobile:      this.isMobile(),
      pageSize:       options.pagination.default,
    }
  },

  created() {
    this._MIXIN_clientPrepaidServicesInventory_loadClientPrepaidServices()
  },

  methods: {
    onSalesActionShow() {
      this.$emit('sales-action-modal-show')
    },
  },
}
</script>
