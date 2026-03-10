<template>
  <div class="overall-revenue-table">
    <pre>{{ sectionData }}</pre>
    <view-table
      ref="tableRef"
      :data="tableData"
    >
      <template
        slot="month"
        slot-scope="{row}"
      >
        {{ row.month }}
      </template>
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
        { field: 'month', label: 'general.month', width: '10%', sortable: false, expand: true },
        { field: 'service', label: 'report.service', width: '12%', sortable: false, expand: true },
        { field: 'product', label: 'report.product', width: '12%', sortable: false, expand: true },
        { field: 'revenueTotal', label: 'report.revenue-total', width: '12%', sortable: false, expand: true },
        { field: 'noOfClients', label: 'report.no-of-clients', width: '10%', sortable: false, expand: true },
        { field: 'amountPerSale', label: 'report.amount-per-sale', width: '12%', sortable: false, expand: true },
        { field: 'prepaidCardSales', label: 'report.prepaid-card-sales', width: '12%', sortable: false, expand: true },
        { field: 'prepaidServiceSales', label: 'report.prepaid-service-sales', width: '12%', sortable: false, expand: true },
      ]
    },

    tableRows() {
      if (!this.sectionData?.data) {
        return this.fakeData
      }

      const rows = this.sectionData.data.map(item => ({
        month:               this.formatYearMonth(item.yearMonth),
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

    fakeData() {
      return [
        { month: '2025-01', service: 25000000, product: 7000000, revenueTotal: 32000000, noOfClients: 600, amountPerSale: 53333, prepaidCardSales: 13000000, prepaidServiceSales: 5000000 },
        { month: '2025-02', service: 28000000, product: 8000000, revenueTotal: 36000000, noOfClients: 550, amountPerSale: 65455, prepaidCardSales: 30000000, prepaidServiceSales: 6000000 },
        { month: '2025-03', service: 36000000, product: 7500000, revenueTotal: 43500000, noOfClients: 650, amountPerSale: 66923, prepaidCardSales: 20000000, prepaidServiceSales: 7000000 },
        { month: '2025-04', service: 35000000, product: 7200000, revenueTotal: 42200000, noOfClients: 580, amountPerSale: 72759, prepaidCardSales: 18000000, prepaidServiceSales: 5500000 },
        { month: '2025-05', service: 37000000, product: 6000000, revenueTotal: 43000000, noOfClients: 520, amountPerSale: 82692, prepaidCardSales: 17000000, prepaidServiceSales: 4800000 },
        { month: '2025-06', service: 40000000, product: 6800000, revenueTotal: 46800000, noOfClients: 540, amountPerSale: 86667, prepaidCardSales: 22000000, prepaidServiceSales: 6200000 },
        { month: this.$t('general.total'), service: 201000000, product: 42500000, revenueTotal: 243500000, noOfClients: 3440, amountPerSale: 70785, prepaidCardSales: 120000000, prepaidServiceSales: 34500000 },
      ]
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

    formatYearMonth(yearMonth) {
      if (!yearMonth || yearMonth.length !== 6) {
        return yearMonth
      }
      const year = yearMonth.substring(0, 4)
      const month = yearMonth.substring(4, 6)
      return `${year}-${month}`
    },
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
