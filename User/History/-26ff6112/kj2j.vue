<template>
  <div :class="prepaidServicesClass">
    <!-- <ul v-if="hasPrepaidServices" class="prepaid-services__list">
      <li
        v-for="prepaidService in prepaidServices"
        :class="'prepaid-services__item'"
        :key="`client_${prepaidService.clientId}_prepaid_service_${prepaidService.id}`"
      >
        <prepaid-service
          :value="prepaidService"
          :client-id="client.clientId"
          class="prepaid-services__prepaid-service"
          @book="$emit('book-prepaid-service', $event)"
        />
      </li>
    </ul> -->
    <div v-if="hasPrepaidServices">
      <table
        v-if="!isMobileDevice"
        class="vgt-table bordered "
      >
        <thead>
          <tr data-v-1a3bd028="">
            <th>
              <span>{{ $t('sales-prepaid-service-tab.prepaid-service-name') }}</span>
            </th>
            <th>
              <span data-v-1a3bd028="">{{ $t('sales-prepaid-service-tab.qty') }}</span>
            </th>
            <th>
              <span data-v-1a3bd028="">{{ $t('sales-prepaid-service-tab.expiry-date') }}</span>
            </th>
            <th v-if="hasColumnBook">
              <span data-v-1a3bd028="">{{ $t('sales-prepaid-service-tab.book') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="prepaidService in prepaidServices"
            :key="`client_${prepaidService.clientId}_prepaid_card_${prepaidService.id}`"
          >
            <td class="text-left">
              <span>{{ prepaidService.prepaidServiceName }}</span>
              <br>
              <p
                v-if="!isDataOfCurrentShop(prepaidService) || !isDataOfCurrentClient(prepaidService)"
                class="prepaid-service__shop-info prepaid-services__text-blue"
              >
                {{ formatShopAndFamilyInfo(prepaidService) }}
              </p>
            </td>
            <td>
              <span> {{ salesUtils.formatNoLimitNumber(prepaidService.quantity, 0) }}</span>
            </td>
            <td>
              <span>{{ salesUtils.formatNoLimitDateTs(prepaidService.expiryDateTS) }}</span>
            </td>
            <td
              v-if="hasColumnBook"
              class="p-5"
            >
              <aha-button
                class="btn-arrow"
                @click="$emit('book-prepaid-service', prepaidService)"
              >
                <b-icon-arrow-right-short />
              </aha-button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-else
        class="prepaid-services__list--mobile"
      >
        <div
          v-for="prepaidService in prepaidServices"
          :key="`client_${prepaidService.clientId}_prepaid_service_${prepaidService.id}`"
          :class="activeClass(prepaidService)"
          @click="$emit('book-prepaid-service', prepaidService)"
        >
          <p class="prepaid-services__prepaid-service-name">
            {{ prepaidService.prepaidServiceName }}
          </p>
          <p
            v-if="!isDataOfCurrentShop(prepaidService) || !isDataOfCurrentClient(prepaidService)"
            class="prepaid-service__shop-info"
          >
            {{ formatShopAndFamilyInfo(prepaidService) }}
          </p>
          <div class="prepaid-services__prepaid-service-qty">
            <span> {{ $t('export-download-data.remain-quantity') }}</span>
            <span> {{ salesUtils.formatNoLimitNumber(prepaidService.quantity, 0) }}</span>
          </div>
          <div class="prepaid-services__prepaid-service-expiry-date">
            <span>{{ $t('sales-prepaid-service-tab.expiry-date') }}</span>
            <span>{{ salesUtils.formatNoLimitDateTs(prepaidService.expiryDateTS) }}</span>
          </div>
        </div>

        <div
          v-if="hasNotePrepaidService"
          class="prepaid-service__description"
        >
          <p v-if="prepaidServices.length === 1">
            {{ $t('bookings.prepaid-service-select-one-desc') }}
          </p>
          <p v-else>
            {{ $t('bookings.prepaid-service-select-more-than-one-desc') }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="prepaid-services__list prepaid-services__list--empty"
    >
      {{ $t('bookings.there-is-no-prepaid-service') }}
    </div>
  </div>
</template>

<script>
// Utilities
import { mapState } from 'vuex'
import SalesUtils from 'Utils/sales-utils.js'

// Components
import { BIconArrowRightShort } from 'bootstrap-vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Models
import ClientPrepaidService from 'Models/client/clientPrepaidService'

export default {
  components: {
    BIconArrowRightShort,
    PrepaidService: () => import('./components/prepaid-service/prepaid-service.vue'),
  },

  extends: ComponentBase,

  mixins: [DeviceMixin],

  props: {
    hasColumnBook: {
      type:    Boolean,
      default: true,
    },
    hasNotePrepaidService: {
      type:    Boolean,
      default: true,
    },
  },

  data() {
    return {
      salesUtils: SalesUtils,
    }
  },

  computed: {
    ...mapState('_calendar/bookingAction', [
      'client',
    ]),

    ...mapState('_calendar/bookingAction/client/prepaidServices', [
      'items',
    ]),

    prepaidServices() {
      return this.items.map(item => ClientPrepaidService.build(item))
    },

    hasPrepaidServices() {
      return this.items.length > 0
    },

    prepaidServicesClass() {
      return ['prepaid-services', {
        'prepaid-services--mobile': this.isMobileDevice,
      }]
    },
  },

  methods: {
    isDataOfCurrentShop(row) {
      return row.shopId === this.shop_data.shop_id
    },

    isDataOfCurrentClient(row) {
      return row.clientId === this.client.clientId
    },

    formatShopAndFamilyInfo(row) {
      const tmpInfos = []
      if(!this.isDataOfCurrentShop(row)){
        tmpInfos.push(row.shopName)
      }
      if(!this.isDataOfCurrentClient(row)){
        tmpInfos.push(row.clientName)
      }
      return `(${tmpInfos.join(', ')})`
    },

    activeClass(prepaidService) {
      return {
        'prepaid-services__item': true,
        'active':                 prepaidService.isActivePrepaidService,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-prepaid-services.scss";
</style>
