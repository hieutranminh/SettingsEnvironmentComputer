<template>
  <div class="revenue-by-service-table">
    <view-table
      ref="tableRef"
      :data="tableData"
      :use_aha_table="true"
      :fixed_column_quantity="fixedColumnQuantity"
    >
      <!-- Category name slot (for Service view) -->
      <template
        v-if="!isViewByCategory"
        slot="categoryName"
        slot-scope="{row}"
      >
        {{ row.categoryName }}
      </template>

      <!-- Item name slot (Category name or Service name) -->
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

    // Get unique items list
    itemList() {
      if (!this.currentDataSource || this.currentDataSource.length === 0) {
        return []
      }

      const itemMap = new Map()

      console.log('currentDataSource', this.currentDataSource)
      this.currentDataSource.forEach(monthData => {
        const items = this.isViewByCategory ? monthData.categories : monthData.services
        if (!items) return

        items.forEach(item => {
          const itemId = this.isViewByCategory ? item.categoryId : item.serviceId
          if (itemMap.has(itemId)) return

          itemMap.set(itemId, {
            id:           itemId,
            name:         this.isViewByCategory ? item.categoryName : item.serviceName,
            categoryName: item.categoryName || '',
          })
        })
      })

      const items = Array.from(itemMap.values())

      // Service view: sort by category name to group items together
      // if (!this.isViewByCategory) {
      //   return items.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
      // }

      return items
    },

    // Number of fixed columns (1 for Category view, 2 for Service view)
    fixedColumnQuantity() {
      return this.isViewByCategory ? 1 : 2
    },

    // Items to display based on current pagination
    displayedItems() {
      return this.itemList.slice(0, this.displayedItemCount)
    },

    // Check if there are more items to show
    hasMoreItems() {
      return this.displayedItemCount < this.itemList.length
    },

    tableFields() {
      const fields = []

      // For Service view: add Category column first
      if (!this.isViewByCategory) {
        fields.push({
          field:    'categoryName',
          label:    'report.category',
          sortable: false,
          width:    '180px',
        })
      }

      // Item name column (Category name for Category view, Service name for Service view)
      fields.push({
        field:    'itemName',
        label:    this.isViewByCategory ? 'report.category' : 'report.service',
        sortable: false,
        width:    '180px',
      })

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
          itemId:       item.id,
          itemName:     item.name,
          categoryName: item.categoryName,
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
