<template>
  <div class="overall-revenue-table">
    <view-table
      ref="tableRef"
      :data="tableData"
    >
      <template
        slot="service"
        slot-scope="{row}"
      >
        {{ formatMoney(row.service, 0) }}
      </template>
      <template
        slot="product"
        slot-scope="{row}"
      >
        {{ formatMoney(row.product, 0) }}
      </template>
      <template
        slot="revenueTotal"
        slot-scope="{row}"
      >
        {{ formatMoney(row.revenueTotal, 0) }}
      </template>
      <template
        slot="noOfClients"
        slot-scope="{row}"
      >
        {{ row.noOfClients }}
      </template>
      <template
        slot="amountPerSale"
        slot-scope="{row}"
      >
        {{ formatMoney(row.amountPerSale, 0) }}
      </template>
      <template
        slot="prepaidCardSales"
        slot-scope="{row}"
      >
        {{ formatMoney(row.prepaidCardSales, 0) }}
      </template>
      <template
        slot="prepaidServiceSales"
        slot-scope="{row}"
      >
        {{ formatMoney(row.prepaidServiceSales, 0) }}
      </template>
    </view-table>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth } from 'Utils/format-data.js'
import ViewTable from 'CommonComponents/view-table/view-table.vue'

export default {
  components: {
    ViewTable,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
  },

  computed: {
    tableFields() {
      return [
        { field: 'month', label: 'general.month', width: '10%', sortable: false },
        { field: 'service', label: 'report.service', width: '12%', sortable: false, expand: true, tdClass: 'report-amount' },
        { field: 'product', label: 'report.product', width: '12%', sortable: false, expand: true, tdClass: 'report-amount' },
        { field: 'revenueTotal', label: 'report.revenue-total', width: '12%', sortable: false, expand: true, tdClass: 'report-amount' },
        { field: 'noOfClients', label: 'report.no-of-clients', width: '10%', sortable: false, expand: true },
        { field: 'amountPerSale', label: 'report.amount-per-sale', width: '12%', sortable: false, expand: true, tdClass: 'report-amount' },
        { field: 'prepaidCardSales', label: 'report.prepaid-card-sales', width: '12%', sortable: false, expand: true, tdClass: 'report-amount' },
        { field: 'prepaidServiceSales', label: 'report.prepaid-service-sales', width: '12%', sortable: false, expand: true, tdClass: 'report-amount' },
      ]
    },

    tableRows() {
      if (!this.sectionData?.data) {
        return []
      }

      const rows = this.sectionData.data.map(item => ({
        month:               formatYearMonth(item.yearMonth),
        service:             item.servicesAmountTotal || 0,
        product:             item.productsAmountTotal || 0,
        revenueTotal:        item.revenueTotal || 0,
        noOfClients:         item.numberOfClients || 0,
        amountPerSale:       item.amountPerSale || 0,
        prepaidCardSales:    item.prepaidCardAmountTotal || 0,
        prepaidServiceSales: item.prepaidServicesAmountTotal || 0,
      }))

      // Add total row
      if (this.sectionData?.total) {
        rows.push({
          month:               this.$t('general.total'),
          service:             this.sectionData.total.servicesAmountTotal || 0,
          product:             this.sectionData.total.productsAmountTotal || 0,
          revenueTotal:        this.sectionData.total.revenueTotal || 0,
          noOfClients:         this.sectionData.total.numberOfClients || 0,
          amountPerSale:       this.sectionData.total.amountPerSale || 0,
          prepaidCardSales:    this.sectionData.total.prepaidCardAmountTotal || 0,
          prepaidServiceSales: this.sectionData.total.prepaidServicesAmountTotal || 0,
        })
      }

      return rows
    },

    tableData() {
      return {
        rows:       this.tableRows,
        fields:     this.tableFields,
        pagination: { total_pages: 1 },
        options:    {
          pagination: false,
        },
      }
    },
  },

  methods: {
    formatMoney,
  },
}
</script>

<style lang="scss" scoped>
.overall-revenue-table {
  ::v-deep table {
    tbody {
      tr {
        &:last-of-type {
          background: $gray-light;
        }
      }
    }
  }
}
</style>
