<template>
  <div class="revenue-by-service-table">
    <view-table
      ref="tableRef"
      :data="tableData"
      :use_aha_table="true"
      :fixed_column_quantity="1"
    >
      <!-- Item name slot -->
      <template
        slot="itemName"
        slot-scope="{row}"
      >
        {{ row.itemName }}
      </template>

      <!-- Dynamic slots for each yearMonth column -->
      <template
        v-for="month in yearMonthList"
        :slot="`month_${month}`"
        slot-scope="{row}"
      >
        {{ formatMoney(row[`month_${month}`], 0) }}
      </template>
    </view-table>

    <!-- Show More button -->
    <div
      v-if="hasMoreItems"
      class="show-more-wrapper"
    >
      <button
        class="btn-show-more"
        @click="onShowMore"
      >
        + {{ $t('general.more') }}
      </button>
    </div>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth } from 'Utils/format-data.js'
import ViewTable from 'CommonComponents/view-table/view-table.vue'

// View type constants
const VIEW_TYPE = {
  CATEGORY: 'category',
  SERVICE:  'service',
}

// Number of items to display initially and per load
const ITEMS_PER_PAGE = 5

export default {
  components: {
    ViewTable,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
    viewType: {
      type:    String,
      default: VIEW_TYPE.CATEGORY,
    },
  },

  data() {
    return {
      displayedItemCount: ITEMS_PER_PAGE,
    }
  },

  computed: {
    isViewByCategory() {
      return this.viewType === VIEW_TYPE.CATEGORY
    },

    // Get current data source based on view type
    currentDataSource() {
      if (!this.sectionData) return []

      if (this.isViewByCategory) {
        return this.sectionData.categoryData || []
      }
      return this.sectionData.serviceData || []
    },

    // Get list of yearMonth values
    yearMonthList() {
      if (!this.currentDataSource) {
        return []
      }
      return this.currentDataSource.map(item => item.yearMonth)
    },

    // Get unique items list sorted by total amount (descending)
    itemList() {
      if (!this.currentDataSource || this.currentDataSource.length === 0) {
        return []
      }

      // Build a map of items with their total amounts
      const itemMap = new Map()

      this.currentDataSource.forEach(monthData => {
        const items = this.isViewByCategory ? monthData.categories : monthData.services

        if (!items) return

        items.forEach(item => {
          const itemId = this.isViewByCategory ? item.categoryId : item.serviceId
          const itemName = this.isViewByCategory ? item.categoryName : item.serviceName

          if (!itemMap.has(itemId)) {
            itemMap.set(itemId, {
              id:          itemId,
              name:        itemName,
              totalAmount: 0,
            })
          }
          itemMap.get(itemId).totalAmount += item.amount || 0
        })
      })

      // Sort by total amount descending
      return Array.from(itemMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
    },

    // Items to display based on current pagination
    displayedItems() {
      return this.itemList.slice(0, this.displayedItemCount)
    },

    // Check if there are more items to show
    hasMoreItems() {
      return this.displayedItemCount < this.itemList.length
    },

    // Table column header label based on view type
    itemColumnLabel() {
      return this.isViewByCategory ? 'report.category' : 'report.service'
    },

    tableFields() {
      // Item name column (Category or Service)
      const fields = [
        { field: 'itemName', label: this.itemColumnLabel, sortable: false, width: '150px' },
      ]

      // Dynamic yearMonth columns
      this.yearMonthList.forEach(yearMonth => {
        fields.push({
          field:               `month_${yearMonth}`,
          label:               formatYearMonth(yearMonth),
          sortable:            false,
          expand:              true,
          tdClass:             'report-amount',
          width:               '120px',
          is_custom_translate: true,
        })
      })

      return fields
    },

    tableRows() {
      if (!this.currentDataSource || !this.displayedItems.length) {
        return []
      }

      return this.displayedItems.map(item => {
        const row = {
          itemId:   item.id,
          itemName: item.name,
        }

        // Add dynamic month amounts
        this.currentDataSource.forEach(monthData => {
          const yearMonth = monthData.yearMonth
          const items = this.isViewByCategory ? monthData.categories : monthData.services

          if (!items) {
            row[`month_${yearMonth}`] = 0
            return
          }

          const found = items.find(i =>
            this.isViewByCategory ? i.categoryId === item.id : i.serviceId === item.id,
          )
          row[`month_${yearMonth}`] = found?.amount || 0
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

  watch: {
    // Reset displayed count when view type changes
    viewType: {
      handler() {
        this.displayedItemCount = ITEMS_PER_PAGE
      },
    },

    // Reset displayed count when data changes
    sectionData: {
      handler() {
        this.displayedItemCount = ITEMS_PER_PAGE
      },
    },
  },

  methods: {
    formatMoney,

    onShowMore() {
      this.displayedItemCount += ITEMS_PER_PAGE
    },
  },
}
</script>

<style lang="scss">
.revenue-by-service-table {
  min-width: 0;

  .vgt-table {
    th, td {
      min-width: 120px;
    }
  }

  .show-more-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .btn-show-more {
    background: none;
    border: none;
    color: #1976D2;
    cursor: pointer;
    font-size: 14px;
    padding: 5px 10px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
