<template>
  <div class="client-connectable">
    <table class="client-connectable__table">
      <thead>
        <tr>
          <th
            v-if="hasChainAndShareClient"
            width="10%"
          >
            {{ $t('general.location') }}
          </th>
          <th width="10%">
            {{ $t('clients.client-number') }}
          </th>
          <th width="15%">
            {{ $t('clients.client-name') }}
          </th>
          <th width="15%">
            {{ $t('clients.mobile-number') }}
          </th>
          <th width="15%">
            {{ $t('bookings.recent-visit-date') }}
          </th>
          <th width="13%">
            {{ $t('general.registered-date') }}
          </th>
          <th width="10%">
            {{ $t('general.edit') }}
          </th>
          <th width="12%">
            {{ $t('clients.connect-client') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="hasConnectableClients">
          <tr
            v-for="item in items"
            :key="`connectable_client_${item.clientId}`"
          >
            <td v-if="hasChainAndShareClient">
              <div
                v-b-tooltip.hover.right
                :title="item.shopName"
                class="branch-number"
              >
                {{ getBranchNumber(item.branchNumber, item.shopId) }}
              </div>
            </td>
            <td>{{ item.memberNumber }}</td>
            <td>{{ item.clientName }}</td>
            <td>
              <client-mobile-phone
                :id="item.clientId"
                :mobile-number="item.mobileNumber"
                :registration-date="item.clientInputDateTimeTS"
              />
            </td>
            <td>
              <template v-if="item.recentVisitDateTimeTS > 0">
                {{ formatRecentDate(item.recentVisitDateTimeTS) }}
              </template>
            </td>
            <td>{{ formatRegisteredDate(item.clientInputDateTimeTS) }}</td>
            <td>
              <a-button
                variant="out-line"
                @click="$emit('edit-client', item)"
              >
                {{ $t('general.edit') }}
              </a-button>
            </td>
            <td>
              <a-button
                variant="out-line"
                @click="$emit('connect-client', item)"
              >
                {{ $t('clients.connect') }}
              </a-button>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="hasChainAndShareClient ? 8 : 7">
            {{ $t('general.table-empty') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// Utilities
import moment from 'moment'
import {
  convertTimeStampMinusLocalzone,
  convertTimeStampToDate,
  getBranchNumber,
} from 'CommonHelpers'

// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ClientMobilePhone from 'Modules/clients/components/client-mobile-phone/client-mobile-phone.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import {options} from 'OptionsHelpers'

export default {
  components: {
    AButton,
    ClientMobilePhone,
  },

  extends: ComponentBase,

  props: {
    items: {
      type:    Array,
      default: () => [],
    },
  },

  computed: {
    hasConnectableClients() {
      return this.items.length > 0
    },

    hasChainAndShareClient () {
      return this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client
    },
  },

  methods: {
    getBranchNumber,

    formatRecentDate(recentVisitDateTimeTS) {
      if (!recentVisitDateTimeTS) {
        return moment().utc().format('YYYY-MM-DD')
      }

      const convertTime = convertTimeStampToDate(convertTimeStampMinusLocalzone(recentVisitDateTimeTS))
      return moment(convertTime).format(options.standard_date_format.ymd)
    },

    formatRegisteredDate(clientInputDateTimeTS) {
      return moment.unix(clientInputDateTimeTS).utc().format('YYYY-MM-DD')
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-connectable-table.scss";
</style>
