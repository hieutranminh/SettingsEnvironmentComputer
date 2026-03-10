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
              {{ $t('report.same-date-cancel') }}
            </th>
            <th colspan="2">
              {{ $t('report.no-show') }}
            </th>
            <th colspan="2">
              {{ $t('report.same-day-cancel-and-no-show') }}
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

        <tbody v-if="tableRows.length > 0">
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

        <tbody v-else>
          <tr>
            <td
              colspan="11"
              class="text-center"
            >
              {{ $t('general.no-data-for-table') }}
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
        totalBookingsCount:             item.totalAllBookings || 0,
        totalBookingsRatio:             item.totalAllBookingsRatio || 0,
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
  },
}
</script>

<style lang="scss" scoped>
.booking-table {
  table {
    thead {
      tr:first-child {
        th:first-child {
          width: 10%;
        }
        th:not(:first-child) {
          width: calc(90%/5);
        }
      }
    }
  }
}
</style>
