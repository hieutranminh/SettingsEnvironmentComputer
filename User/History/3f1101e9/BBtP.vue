<template>
  <div class="booking-table">
    <aha-table :fixed-column-quantity="1">
      <table ref="tableRef">
        <thead>
          <tr>
            <th
              rowspan="2"
              class="col-month"
            >
              {{ $t('general.month') }}
            </th>
            <th colspan="2">
              {{ $t('report.booking-total') }}
            </th>
            <th colspan="2">
              {{ $t('report.naver-bookings') }}
            </th>
            <th colspan="2">
              {{ $t('report.late-cancellation-within-24h') }}
            </th>
            <th colspan="2">
              {{ $t('report.no-show') }}
            </th>
            <th colspan="2">
              {{ $t('report.late-cancellation-and-no-show') }}
            </th>
          </tr>
          <tr>
            <th>
              {{ $t('report.count') }}
            </th>
            <th>
              {{ $t('report.ratio') }}
            </th>
            <th>
              {{ $t('report.count') }}
            </th>
            <th>
              {{ $t('report.ratio') }}
            </th>
            <th>
              {{ $t('report.count') }}
            </th>
            <th>
              {{ $t('report.ratio') }}
            </th>
            <th>
              {{ $t('report.count') }}
            </th>
            <th>
              {{ $t('report.ratio') }}
            </th>
            <th>
              {{ $t('report.count') }}
            </th>
            <th>
              {{ $t('report.ratio') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in tableRows"
            :key="index"
            :class="{ 'row-total': row.isTotal }"
          >
            <td>
              {{ row.month }}
            </td>
            <td class="text-center">
              {{ formatNumber(row.totalBookingsCount) }}
            </td>
            <td class="text-center">
              {{ formatPercent(row.totalBookingsRatio) }}
            </td>
            <td class="text-center">
              {{ formatNumber(row.naverBookingsCount) }}
            </td>
            <td class="text-center">
              {{ formatPercent(row.naverBookingsRatio) }}
            </td>
            <td class="text-center">
              {{ formatNumber(row.lateCancellationCount) }}
            </td>
            <td class="text-center">
              {{ formatPercent(row.lateCancellationRatio) }}
            </td>
            <td class="text-center">
              {{ formatNumber(row.noShowCount) }}
            </td>
            <td class="text-center">
              {{ formatPercent(row.noShowRatio) }}
            </td>
            <td class="text-center">
              {{ formatNumber(row.lateCancellationAndNoShowCount) }}
            </td>
            <td class="text-center">
              {{ formatPercent(row.lateCancellationAndNoShowRatio) }}
            </td>
          </tr>
        </tbody>
      </table>
    </aha-table>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth, formatPercentNumber } from 'Utils/format-data.js'
import AhaTable from 'CommonComponents/aha-table/aha-table.vue'

export default {
  components: {
    AhaTable,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
  },

  computed: {
    tableRows() {
      if (!this.sectionData?.data) {
        return []
      }

      const rows = this.sectionData.data.map(item => ({
        month:                          formatYearMonth(item.yearMonth),
        totalBookingsCount:             item.totalBookings || 0,
        totalBookingsRatio:             item.totalBookingsRatio || 0,
        naverBookingsCount:             item.naverBookings || 0,
        naverBookingsRatio:             item.naverBookingsRatio || 0,
        lateCancellationCount:          item.lateCancellationWithin24h || 0,
        lateCancellationRatio:          item.lateCancellationWithin24hRatio || 0,
        noShowCount:                    item.noShow || 0,
        noShowRatio:                    item.noShowRatio || 0,
        lateCancellationAndNoShowCount: item.lateCancellationAndNoShow || 0,
        lateCancellationAndNoShowRatio: item.lateCancellationAndNoShowRatio || 0,
        isTotal:                        false,
      }))

      // Add total row
      if (this.sectionData?.total) {
        const total = this.sectionData.total
        rows.push({
          month:                          this.$t('general.total'),
          totalBookingsCount:             total.totalBookings || 0,
          totalBookingsRatio:             total.totalAllBookingsRatio || 0,
          naverBookingsCount:             total.naverBookings || 0,
          naverBookingsRatio:             this.calculateTotalRatio(total.naverBookings, total.totalBookings),
          lateCancellationCount:          total.lateCancellationWithin24h || 0,
          lateCancellationRatio:          this.calculateTotalRatio(total.lateCancellationWithin24h, total.totalBookings),
          noShowCount:                    total.noShow || 0,
          noShowRatio:                    this.calculateTotalRatio(total.noShow, total.totalBookings),
          lateCancellationAndNoShowCount: total.lateCancellationAndNoShow || 0,
          lateCancellationAndNoShowRatio: this.calculateTotalRatio(total.lateCancellationAndNoShow, total.totalBookings),
          isTotal:                        true,
        })
      }

      return rows
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
  table {

    tbody {
      .row-total {
        background: $gray-light;
        font-weight: bold;
      }

      .text-center {
        text-align: center;
      }
    }
  }
}
</style>
