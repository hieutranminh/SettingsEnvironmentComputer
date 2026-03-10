<template>
  <div class="client-prepaid-services">
    <client-prepaid-services
      :items="items"
      :client="client"
      :paging-info="pagingInfo"
      :client-id="client.clientId"
      :is-edit-enabled="isEditEnabled"
      :include-expired="includeExpired"

      @histories-click="$emit('histories-click', $event)"
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
import { PAGINATION } from 'Constant'

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
    ClientPrepaidServicesInventoryMixin('_calendar/clientInformation'),
  ],

  props: {
    isEditEnabled: {
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
      pageNumber:     1,
      includeExpired: getShowExpiredFromLocalStorage(),
      pageSize:       PAGINATION.DEFAULT,
    }
  },

  created() {
    this._MIXIN_clientPrepaidServicesInventory_loadClientPrepaidServices()
  },
}
</script>

<style lang="scss" scoped>
  @import './client-prepaid-services.scss';
</style>
