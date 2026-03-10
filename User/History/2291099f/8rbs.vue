<template>
  <aha-table
    :fixed-column-quantity="1"
    class="staff-payment-total"
  >
    <table class="staff-payment-total__table">
      <thead>
        <tr>
          <th width="16.66%">
            {{ $t('sales.payment-method') }}
          </th>
          <th width="16.66%">
            {{ $t('report.service') }}
          </th>
          <th width="16.66%">
            {{ $t('report.product') }}
          </th>
          <th width="16.66%">
            {{ $t('report.prepaid-card') }}
          </th>
          <th width="16.66%">
            {{ $t('report.prepaid-service') }}
          </th>
          <th width="16.66%">
            {{ $t('report-total.total') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="paymentTotals.length == 0">
          <tr>
            <td
              colspan="6"
              class="table-no-data"
            >
              {{ $t('general.no-data-for-table') }}
            </td>
          </tr>
        </template>

        <template v-else>
          <tr
            v-for="(item, index) in paymentTotals"
            :key="index"
            class="table-row"
          >
            <td>{{ item.paymentMethodName }}</td>

            <td class="payment-amount">
              <span>{{ formatAmount(item.servicesPaymentAmount) }}</span>
            </td>

            <td class="payment-amount">
              <span>{{ formatAmount(item.productPaymentAmount) }}</span>
            </td>

            <td class="payment-amount">
              <span>{{ formatAmount(item.prepaidCardPaymentAmount) }}</span>
            </td>

            <td class="payment-amount">
              <span>{{ formatAmount(item.prepaidServicePaymentAmount) }}</span>
            </td>

            <td class="payment-amount">
              <span>{{ formatMoney(item.paymentAmountTotal, 0) }}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </aha-table>
</template>

<script>
// Utils
import { formatMoney } from 'Utils/format-data'

// Components
import AhaTable from 'Components/common/aha-table/aha-table.vue'

export default {
  components: {
    AhaTable,
  },

  props: {
    paymentTotals: {
      type:    Array,
      default: () => ([]),
    },
  },

  methods: {
    formatMoney,
    formatAmount(amount) {
      if (!amount) {
        return ''
      }

      return formatMoney(amount, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './sales-payment-total-table';
</style>
