<template>
  <div class="booking-table">
    <view-table
      ref="tableRef"
      :data="tableData"
    >
      <template
        slot="totalBookingsCount"
        slot-scope="{row}"
      >
        {{ formatNumber(row.totalBookingsCount) }}
      </template>
      <template
        slot="naverBookingsCount"
        slot-scope="{row}"
      >
        {{ formatNumber(row.naverBookingsCount) }}
      </template>
      <template
        slot="naverBookingsRatio"
        slot-scope="{row}"
      >
        {{ formatPercent(row.naverBookingsRatio) }}
      </template>
      <template
        slot="lateCancellationCount"
        slot-scope="{row}"
      >
        {{ formatNumber(row.lateCancellationCount) }}
      </template>
      <template
        slot="lateCancellationRatio"
        slot-scope="{row}"
      >
        {{ formatPercent(row.lateCancellationRatio) }}
      </template>
      <template
        slot="noShowCount"
        slot-scope="{row}"
      >
        {{ formatNumber(row.noShowCount) }}
      </template>
      <template
        slot="noShowRatio"
        slot-scope="{row}"
      >
        {{ formatPercent(row.noShowRatio) }}
      </template>
      <template
        slot="lateCancellationAndNoShowCount"
        slot-scope="{row}"
      >
        {{ formatNumber(row.lateCancellationAndNoShowCount) }}
      </template>
      <template
        slot="lateCancellationAndNoShowRatio"
        slot-scope="{row}"
      >
        {{ formatPercent(row.lateCancellationAndNoShowRatio) }}
      </template>
    </view-table>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth, formatPercentNumber } from 'Utils/format-data.js'
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
        // Total Bookings
        { field: 'totalBookingsCount', label: 'report.booking-total', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
        // Naver Bookings
        { field: 'naverBookingsCount', label: 'report.naver-bookings', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'naverBookingsRatio', label: 'ratio', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
        // Late Cancellation
        { field: 'lateCancellationCount', label: 'report.late-cancellation-within-24h', width: '12%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'lateCancellationRatio', label: 'ratio', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
        // No Show
        { field: 'noShowCount', label: 'report.no-show', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'noShowRatio', label: 'ratio', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
        // Late Cancellation + No Show
        { field: 'lateCancellationAndNoShowCount', label: 'report.late-cancellation-and-no-show', width: '12%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'lateCancellationAndNoShowRatio', label: 'ratio', width: '10%', sortable: false, expand: true, tdClass: 'text-center' },
      ]
    },

    tableRows() {
      if (!this.sectionData?.data) {
        return []
      }

      const rows = this.sectionData.data.map(item => ({
        month:                          formatYearMonth(item.yearMonth),
        totalBookingsCount:             item.totalBookings || 0,
        naverBookingsCount:             item.naverBookings || 0,
        naverBookingsRatio:             item.naverBookingsRatio || 0,
        lateCancellationCount:          item.lateCancellationWithin24h || 0,
        lateCancellationRatio:          item.lateCancellationWithin24hRatio || 0,
        noShowCount:                    item.noShow || 0,
        noShowRatio:                    item.noShowRatio || 0,
        lateCancellationAndNoShowCount: item.lateCancellationAndNoShow || 0,
        lateCancellationAndNoShowRatio: item.lateCancellationAndNoShowRatio || 0,
      }))

      // Add total row
      if (this.sectionData?.total) {
        const total = this.sectionData.total
        rows.push({
          month:                          this.$t('general.total'),
          totalBookingsCount:             total.totalBookings || 0,
          naverBookingsCount:             total.naverBookings || 0,
          naverBookingsRatio:             this.calculateTotalRatio(total.naverBookings, total.totalBookings),
          lateCancellationCount:          total.lateCancellationWithin24h || 0,
          lateCancellationRatio:          this.calculateTotalRatio(total.lateCancellationWithin24h, total.totalBookings),
          noShowCount:                    total.noShow || 0,
          noShowRatio:                    this.calculateTotalRatio(total.noShow, total.totalBookings),
          lateCancellationAndNoShowCount: total.lateCancellationAndNoShow || 0,
          lateCancellationAndNoShowRatio: this.calculateTotalRatio(total.lateCancellationAndNoShow, total.totalBookings),
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
    formatNumber(value) {
      return formatMoney(value, 0)
    },

    formatPercent(value) {
      const formattedValue = Number(value).toFixed(1)
      return formatPercentNumber(formattedValue)
    },

    calculateTotalRatio(value, total) {
      if (!total || total === 0) return 0
      return (value / total) * 100
    },
  },
}
</script>

<style lang="scss" scoped>
.booking-table {
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
