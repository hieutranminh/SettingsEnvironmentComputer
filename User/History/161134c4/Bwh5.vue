<template>
  <div class="overall-revenue-table">
    <pre>{{ sectionData }}</pre>
    <view-table
      ref="tableRef"
      :data="tableData"
    >
      <template
        slot="service"
        slot-scope="{row}"
      >
        {{ formatValue(row.service) }}
      </template>
      <template
        slot="product"
        slot-scope="{row}"
      >
        {{ formatValue(row.product) }}
      </template>
      <template
        slot="revenueTotal"
        slot-scope="{row}"
      >
        {{ formatValue(row.revenueTotal) }}
      </template>
      <template
        slot="noOfClients"
        slot-scope="{row}"
      >
        {{ formatValue(row.noOfClients) }}
      </template>
      <template
        slot="amountPerSale"
        slot-scope="{row}"
      >
        {{ formatValue(row.amountPerSale) }}
      </template>
      <template
        slot="prepaidCardSales"
        slot-scope="{row}"
      >
        {{ formatValue(row.prepaidCardSales) }}
      </template>
      <template
        slot="prepaidServiceSales"
        slot-scope="{row}"
      >
        {{ formatValue(row.prepaidServiceSales) }}
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
        { field: 'prepaidCardSales', label: 'report.prepaid-card-sales', width: '12%', sortable: false, expand: true, tdClass: 'report-amount', thClass: 'th-prepaid-highlight' },
        { field: 'prepaidServiceSales', label: 'report.prepaid-service-sales', width: '12%', sortable: false, expand: true, tdClass: 'report-amount', thClass: 'th-prepaid-highlight' },
      ]
    },

    tableRows() {
      if (!this.sectionData?.data) {
        return []
      }

      const rows = this.sectionData.data.map(item => ({
        month:               formatYearMonth(item.yearMonth),
        service:             item.serviceSalesAmount,
        product:             item.productSalesAmount,
        revenueTotal:        item.revenueTotal,
        noOfClients:         item.numberOfSales,
        amountPerSale:       item.amountPerSale,
        prepaidCardSales:    item.prepaidCardSalesAmount,
        prepaidServiceSales: item.prepaidServiceSalesAmount,
      }))

      // Add total row
      if (this.sectionData?.total) {
        rows.push({
          month:               this.$t('general.total'),
          service:             this.sectionData.total.serviceSalesAmount,
          product:             this.sectionData.total.productSalesAmount,
          revenueTotal:        this.sectionData.total.revenueTotal,
          noOfClients:         this.sectionData.total.numberOfSales,
          amountPerSale:       this.sectionData.total.amountPerSale,
          prepaidCardSales:    this.sectionData.total.prepaidCardSalesAmount,
          prepaidServiceSales: this.sectionData.total.prepaidServiceSalesAmount,
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

    formatValue(value) {
      if (value === null || value === undefined) {
        return '-'
      }
      return formatMoney(value, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.overall-revenue-table {
  ::v-deep table {
    thead {
      th.th-prepaid-highlight {
        background: $gray-darken-3;
      }
    }
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
