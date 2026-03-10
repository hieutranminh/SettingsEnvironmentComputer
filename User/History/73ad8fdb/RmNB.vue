<template>
  <div class="revenue-by-staff-table">
    <aha-table :fixed-column-quantity="1">
      <table ref="tableRef">
        <thead>
          <tr>
            <th>{{ $t('general.month') }}</th>
            <th
              v-for="staff in staffList"
              :key="staff.staffId"
            >
              {{ getStaffDisplayName(staff) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in tableRows"
            :key="index"
          >
            <td>{{ row.month }}</td>
            <td
              v-for="staff in staffList"
              :key="staff.staffId"
              class="report-amount"
            >
              {{ formatMoney(row[`staff_${staff.staffId}`], 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </aha-table>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth } from 'Utils/format-data.js'
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
    // Get staff list from first data item, excluding staffId -1 (All)
    staffList() {
      if (!this.sectionData?.data?.[0]?.staffs) {
        return []
      }
      return this.sectionData.data[0].staffs.filter(staff => staff.staffId !== -1)
    },

    tableRows() {
      if (!this.sectionData?.data) {
        return []
      }

      return this.sectionData.data.map(item => {
        const row = {
          month: formatYearMonth(item.yearMonth),
        }

        // Add dynamic staff amounts
        item.staffs?.forEach(staff => {
          if (staff.staffId !== -1) {
            row[`staff_${staff.staffId}`] = staff.amount || 0
          }
        })

        return row
      })
    },
  },

  methods: {
    formatMoney,

    getStaffDisplayName(staff) {
      // staffId = 0 always displays as "Not Selected"
      if (staff.staffId === 0) {
        return this.$t('general.not-selected')
      }
      return staff.staffName
    },
  },
}
</script>

<style lang="scss" scoped>
.revenue-by-staff-table {
  width: 50%;
  min-width: 0;

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      min-width: 150px;
      padding: 8px 10px;
      border: 1px solid $gray;
      text-align: center;
      white-space: nowrap;
    }

    th {
      background-color: $light-blue;
      font-weight: bold;
    }

    td.report-amount {
      text-align: right;
    }
  }
}
</style>
