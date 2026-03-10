<template>
  <aha-table :fixed-column-quantity="1">
    <table class="sales-total-detail-table">
      <thead>
        <tr>
          <th
            rowspan="2"
            width="16.66%"
          >
            {{ type_text }}
          </th>
          <th
            :width="isSalesTotal ? '16.66%' : '33.33%'"
            colspan="2"
          >
            {{ service_text }}
          </th>
          <th
            :width="isSalesTotal ? '16.66%' : '33.33%'"
            colspan="2"
          >
            {{ product_text }}
          </th>
          <th
            v-if="isSalesTotal"
            :width="isSalesTotal ? '16.66%' : 0"
            colspan="2"
          >
            {{ prepaid_card_text }}
          </th>
          <th
            v-if="isSalesTotal"
            :width="isSalesTotal ? '16.66%' : 0"
            colspan="2"
          >
            {{ prepaid_service_text }}
          </th>
          <th
            rowspan="2"
            width="16.66%"
          >
            {{ $t('general.total') }}
          </th>
        </tr>
        <tr>
          <th>{{ quantity_text }}</th>
          <th>{{ amount_text }}</th>
          <th>{{ quantity_text }}</th>
          <th>{{ amount_text }}</th>
          <th v-if="isSalesTotal">
            {{ quantity_text }}
          </th>
          <th v-if="isSalesTotal">
            {{ amount_text }}
          </th>
          <th v-if="isSalesTotal">
            {{ quantity_text }}
          </th>
          <th v-if="isSalesTotal">
            {{ amount_text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in sorted_sales_total_detail">
          <tr
            v-if="showRow(row) && isSalesTotal"
            :key="index"
            :class="rowClass(row)"
          >
            <td>{{ row.name === 'sales-total' ? $t(`report.sales-total-staff`) : $t(`report.${row.name}`) }}</td>
            <td :class="{ disabled: isDisabledCell(row.name, 'service', isSalesTotal) }">
              {{
                isDisabledCell(row.name, 'service', isSalesTotal) ? '' : displayDataDetailSalesTotal(
                  row.fields.service.quantity,
                  row.name,
                  "service-quantity"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'service', isSalesTotal) }]">
              {{
                isDisabledCell(row.name, 'service', isSalesTotal) ? '' : displayDataDetailSalesTotal(
                  row.fields.service.amount,
                  row.name,
                  "service-amount"
                )
              }}
            </td>
            <td :class="{ disabled: isDisabledCell(row.name, 'product', isSalesTotal) }">
              {{
                isDisabledCell(row.name, 'product', isSalesTotal) ? '' : displayDataDetailSalesTotal(
                  row.fields.product.quantity,
                  row.name,
                  "product-quantity"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'product', isSalesTotal) }]">
              {{
                isDisabledCell(row.name, 'product', isSalesTotal) ? '' : displayDataDetailSalesTotal(
                  row.fields.product.amount,
                  row.name,
                  "product-amount"
                )
              }}
            </td>
            <td :class="{ disabled: isDisabledCell(row.name, 'prepaid_card', isSalesTotal) }">
              {{
                isDisabledCell(row.name, 'prepaid_card', isSalesTotal) ? '' : displayDataDetailSalesTotal(
                  row.fields.prepaid_card.quantity,
                  row.name,
                  "prepaid-card-quantity"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'prepaid_card', isSalesTotal) }]">
              {{
                isDisabledCell(row.name, 'prepaid_card', isSalesTotal) ? '' : displayDataDetailSalesTotal(
                  row.fields.prepaid_card.amount,
                  row.name,
                  "prepaid-card-amount"
                )
              }}
            </td>
            <td :class="{ disabled: isDisabledCell(row.name, 'prepaid_service', isSalesTotal) }">
              {{
                displayDataDetailSalesTotal(
                  row.fields.prepaid_service.quantity,
                  row.name,
                  "prepaid-service-quantity"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'prepaid_service', isSalesTotal) }]">
              {{
                displayDataDetailSalesTotal(
                  row.fields.prepaid_service.amount,
                  row.name,
                  "prepaid-service-amount"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'total', isSalesTotal) }]">
              {{
                displayDataDetailSalesTotal(
                  row.fields.total.amount,
                  row.name,
                  "total-amount"
                )
              }}xxxx
            </td>
          </tr>
          <tr
            v-if="showRow(row) && isRevenueTotal"
            :key="index"
            :class="rowClass(row)"
          >
            <td>{{ row.name === 'sales-total' ? $t(`report.sales-total-staff-no-prepaid-goods`) : $t(`report.${row.name}`) }}</td>
            <td :class="{ disabled: isDisabledCell(row.name, 'service') }">
              {{
                displayDataDetailSalesTotal(
                  row.fields.service.quantity,
                  row.name,
                  "service-quantity"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'service') }]">
              {{
                displayDataDetailSalesTotal(
                  row.fields.service.amount,
                  row.name,
                  "service-amount"
                )
              }}
            </td>
            <td :class="{ disabled: isDisabledCell(row.name, 'product') }">
              {{
                displayDataDetailSalesTotal(
                  row.fields.product.quantity,
                  row.name,
                  "product-quantity"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'product') }]">
              {{
                displayDataDetailSalesTotal(
                  row.fields.product.amount,
                  row.name,
                  "product-amount"
                )
              }}
            </td>
            <td :class="['report-amount', { disabled: isDisabledCell(row.name, 'revenue-total') }]">
              {{ row.name === 'number-of-sales-&-amount-per-sale' && row.fields.totalNoPrepaidGoods.numberTotalSales ? (row.fields.totalNoPrepaidGoods.numberTotalSales + ' / ') : '' }}{{
                displayDataDetailSalesTotal(
                  row.fields.totalNoPrepaidGoods.amount,
                  row.name,
                  "total--no-prepaid-goods"
                )
              }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </aha-table>
</template>

<script>
// Utils
import { displayDataDetailSalesTotal } from 'Utils/report-sales-total.js'

// Components
import AhaTable from 'CommonComponents/aha-table/aha-table.vue'

export default {
  components: {
    AhaTable,
  },
  props: {
    sales_total_detail: {
      type:     Array,
      required: true,
    },

    isPrepaidGoodsHidden: {
      type:    Boolean,
      default: false,
    },

    isPointDeductionIncluded: {
      type:    Boolean,
      default: false,
    },

    isSalesTotal: {
      type:    Boolean,
      default: false,
    },

    isRevenueTotal: {
      type:    Boolean,
      default: false,
    },

  },

  data() {
    return {
      local_sales_total_detail: [], // Local copy of the prop
    }
  },

  computed: {
    type_text() {
      return this.$t('general.type')
    },
    product_text() {
      return this.$t('report.product')
    },
    service_text() {
      return this.$t('report.service')
    },
    prepaid_card_text() {
      return this.$t('report.prepaid-card')
    },
    prepaid_service_text() {
      return this.$t('report.prepaid-service')
    },
    quantity_text() {
      return this.$t('general.qty')
    },
    amount_text() {
      return this.$t('general.amount')
    },

    hiddenRows() {
      // if (this.isPrepaidGoodsHidden) {
      //   return [
      //     'revenue-total',
      //     'deduction-total',
      //     'balance-deduction',
      //     'service-deduction',
      //   ]
      // }
      if (this.isSalesTotal) {
        return [
          'revenue-total',
          'deduction-total',
          'service-deduction',
          'number-of-sales-&-amount-per-sale',
        ]
      }
      if (this.isRevenueTotal) {
        return [
          'sale',
          'refund',
          'points-deduction',
          'deduction-total',
        ]
      }
      return []
    },

    bgColorStyleRows() {
      return [
        'revenue-total',
        'sales-total',
        // 'deduction-total',
      ]
    },

    sorted_sales_total_detail() {
      return this.local_sales_total_detail
    },
  },

  watch: {
    sales_total_detail: {
      handler(newVal) {
        if (this.isSalesTotal) {
          // Sort the local copy if isSalesTotal is true
          this.local_sales_total_detail = [...newVal].sort((a, b) => {
            if (a.name === 'balance-deduction') return 1
            if (b.name === 'balance-deduction') return -1
            return 0
          })
        } else {
          // Simply copy the array if isSalesTotal is false
          this.local_sales_total_detail = [...newVal]
        }
      },
      immediate: true,
      deep:      true,
    },
  },
  methods: {
    displayDataDetailSalesTotal,

    isDisabledCell(row_name, col_name, isDisplayDisable) {
      if (row_name === 'balance-deduction' && isDisplayDisable) {
        return col_name == 'prepaid_card' || col_name == 'service' || col_name == 'product'
      }
      if (row_name === 'service-deduction') {
        return (
          col_name == 'total' ||
          col_name == 'product' ||
          col_name == 'prepaid-card' ||
          col_name == 'prepaid-service'
        )
      }
      if (
        // row_name === 'deduction-total' ||
        row_name === 'revenue-total' ||
        row_name === 'number-of-sales-&-amount-per-sale'
      ) {
        return (
          col_name == 'total' ||
          col_name == 'prepaid-card' ||
          col_name == 'prepaid-service'
        )
      }
      return false
    },

    showRow(row) {
      if (this.hiddenRows.includes(row.name) ||
      (row.name === 'points-deduction' && !row.fields.service.quantity && !row.fields.product.quantity && !row.fields.prepaid_card.quantity && !row.fields.prepaid_service.quantity && !this.isPointDeductionIncluded) ||
      (row.name === 'balance-deduction' && !row.fields.prepaid_service.quantity && this.isSalesTotal)) {
        return false
      }
      return true
    },

    rowClass(row) {
      return {
        'row-bg-green-color':  row.name == 'sales-total' && this.isSalesTotal,
        'font-weight-bold':    row.name == 'revenue-total' || (row.name == 'sales-total' && this.isSalesTotal),
        'row-bg-yellow-color': row.name == 'revenue-total',
        // 'row-bg-gray-lighten': row.name == 'deduction-total',
      }
    },

  },
}
</script>

<style lang="scss" scoped>
@import "./sales-total-detail-table-by-staff.scss";
</style>
