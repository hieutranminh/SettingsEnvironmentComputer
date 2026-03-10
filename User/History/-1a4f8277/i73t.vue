<template>
  <div class="number-of-clients-table">
    <view-table
      ref="tableRef"
      :data="tableData"
    >
      <template
        slot="numberOfNewClients"
        slot-scope="{row}"
      >
        {{ formatNumber(row.numberOfNewClients) }}
      </template>
      <template
        slot="numberOfRevisitClients"
        slot-scope="{row}"
      >
        {{ formatNumber(row.numberOfRevisitClients) }}
      </template>
      <template
        slot="numberOfUnregisteredClients"
        slot-scope="{row}"
      >
        {{ formatNumber(row.numberOfUnregisteredClients) }}
      </template>
      <template
        slot="totalClients"
        slot-scope="{row}"
      >
        {{ formatNumber(row.totalClients) }}
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
        { field: 'month', label: 'general.month', width: '20%', sortable: false },
        { field: 'numberOfNewClients', label: 'report-client-by-period.new', width: '20%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'numberOfRevisitClients', label: 'report-client-by-period.revisit', width: '20%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'numberOfUnregisteredClients', label: 'report.unregistered', width: '20%', sortable: false, expand: true, tdClass: 'text-center' },
        { field: 'totalClients', label: 'general.total', width: '20%', sortable: false, expand: true, tdClass: 'text-center' },
      ]
    },

    tableRows() {
      if (!this.sectionData?.data) {
        return []
      }

      const rows = this.sectionData.data.map(item => ({
        month:                       formatYearMonth(item.yearMonth),
        numberOfNewClients:          item.numberOfNewClients || 0,
        numberOfRevisitClients:      item.numberOfRevisitClients || 0,
        numberOfUnregisteredClients: item.numberOfUnregisteredClients || 0,
        totalClients:                item.totalClients || 0,
      }))

      // Add total row if exists
      if (this.sectionData?.total) {
        rows.push({
          month:                       this.$t('general.total'),
          numberOfNewClients:          this.sectionData.total.numberOfNewClients || 0,
          numberOfRevisitClients:      this.sectionData.total.numberOfRevisitClients || 0,
          numberOfUnregisteredClients: this.sectionData.total.numberOfUnregisteredClients || 0,
          totalClients:                this.sectionData.total.totalClients || 0,
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
  },
}
</script>

<style lang="scss" scoped>
.number-of-clients-table {
  flex: 1;
  min-width: 0;

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
