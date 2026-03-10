<template>
  <div class="revenue-by-staff-table">
    <view-table
      ref="tableRef"
      :data="tableData"
      :use_aha_table="true"
      :fixed_column_quantity="1"
    >
      <!-- Dynamic slots for each staff column -->
      <template
        v-for="staff in staffList"
        :slot="`staff_${staff.staffId}`"
        slot-scope="{row}"
      >
        {{ formatMoney(row[`staff_${staff.staffId}`], 0) }}
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
    // Get staff list from first data item, excluding staffId -1 (All)
    staffList() {
      if (!this.sectionData?.data?.[0]?.staffs) {
        return []
      }
      return this.sectionData.data[0].staffs.filter(staff => staff.staffId !== -1)
    },

    tableFields() {
      // Month column
      const fields = [
        { field: 'month', label: 'general.month', sortable: false, width: '120px' },
      ]

      // Dynamic staff columns
      this.staffList.forEach(staff => {
        fields.push({
          field:    `staff_${staff.staffId}`,
          label:    this.getStaffDisplayName(staff),
          sortable: false,
          expand:   true,
          tdClass:  'report-amount',
          width:    '120px',
          is_custom_translate: true,
        })
      })

      return fields
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
}
</style>
