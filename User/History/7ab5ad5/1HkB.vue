<template>
  <div class="revenue-by-service-chart">
    <!-- View Type Radio and Display Item -->
    <div
      v-show="!hideDisplayItem"
      ref="displayItem"
      class="chart-controls"
    >
      <div class="view-type-control">
        <radio-group
          v-model="viewType"
          :options="viewTypeOptions"
        />
      </div>

      <div class="display-item">
        <label>{{ $t('report.display-item') }}</label>
        <select-multiple-display-item
          v-model="selectedItems"
          :placeholder="$t('general.select')"
          :options="displayItemOptions"
        />
      </div>
    </div>

    <div class="chart-container">
      <template v-if="hasChartData">
        <chart-bar
          :data="chartData"
          :options="chartOptions"
          class="chart-bar"
        />
        <chart-legend
          :chart_data="chartData"
          class="chart-legend mt-2"
        />
      </template>

      <div
        v-else
        class="chart-no-data"
      >
        {{ $t('report.no_data_for_chart') }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonthLabel } from 'Utils/format-data.js'
import ChartBar from 'CommonComponents/chart/chart-bar.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'
import RadioGroup from 'CommonComponents/form/radio/radio-group/radio-group.vue'
import SelectMultipleDisplayItem from 'Modules/reports/select-multiple-display-item/select-multiple-display-item.vue'

// View type constants
const VIEW_TYPE = {
  CATEGORY: 'category',
  SERVICE:  'service',
}

// Color palette for dynamic item colors (supports up to 50 items)
const ITEM_COLORS = [
  '#1976D2', // Blue
  '#FF9800', // Orange
  '#4CAF50', // Green
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#E91E63', // Pink
  '#3F51B5', // Indigo
  '#009688', // Teal
  '#CDDC39', // Lime
  '#FF5722', // Deep Orange
  '#673AB7', // Deep Purple
  '#2196F3', // Light Blue
  '#8BC34A', // Light Green
  '#FFC107', // Amber
  '#03A9F4', // Light Blue 2
  '#9E9E9E', // Grey
  '#FF4081', // Pink Accent
  '#7C4DFF', // Deep Purple Accent
  '#18FFFF', // Cyan Accent
  '#69F0AE', // Green Accent
  '#FFAB40', // Orange Accent
  '#536DFE', // Indigo Accent
  '#B388FF', // Purple Accent
  '#EA80FC', // Purple Accent 2
  '#FF80AB', // Pink Accent 2
  '#82B1FF', // Blue Accent
  '#B9F6CA', // Green Accent 2
  '#455A64', // Blue Grey Dark
  '#D32F2F', // Red Dark
  '#C2185B', // Pink Dark
  '#7B1FA2', // Purple Dark
  '#512DA8', // Deep Purple Dark
  '#303F9F', // Indigo Dark
  '#1976D2', // Blue Dark
  '#0288D1', // Light Blue Dark
  '#0097A7', // Cyan Dark
  '#00796B', // Teal Dark
  '#388E3C', // Green Dark
  '#689F38', // Light Green Dark
  '#AFB42B', // Lime Dark
  '#FBC02D', // Yellow Dark
  '#FFA000', // Amber Dark
  '#F57C00', // Orange Dark
  '#E64A19', // Deep Orange Dark
  '#5D4037', // Brown Dark
  '#616161', // Grey Dark
  '#37474F', // Blue Grey Dark 2
]

// Default number of items to select initially
const DEFAULT_SELECTED_ITEM_COUNT = 5

export default {
  components: {
    ChartBar,
    ChartLegend,
    RadioGroup,
    SelectMultipleDisplayItem,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
    hideDisplayItem: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      viewType:      VIEW_TYPE.CATEGORY,
      selectedItems: [],
    }
  },

  computed: {
    viewTypeOptions() {
      return [
        { value: VIEW_TYPE.CATEGORY, text: 'report.category' },
        { value: VIEW_TYPE.SERVICE, text: 'report.service' },
      ]
    },

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

      return Array.from(itemMap.values())
    },

    displayItemOptions() {
      return this.itemList.map((item, index) => ({
        value:  item.id,
        text:   item.name,
        color:  ITEM_COLORS[index % ITEM_COLORS.length],
        itemId: item.id,
      }))
    },

    chartLabels() {
      if (!this.currentDataSource) {
        return []
      }
      return this.currentDataSource.map(item => formatYearMonthLabel(item.yearMonth))
    },

    hasChartData() {
      return this.chartLabels.length > 0 && this.selectedItems.length > 0
    },

    // Calculate total for each month to show on stacked bars
    monthlyTotals() {
      if (!this.currentDataSource) return []

      return this.currentDataSource.map(monthData => {
        const items = this.isViewByCategory ? monthData.categories : monthData.services
        if (!items) return 0

        return this.selectedItems.reduce((sum, selectedItem) => {
          const itemId = selectedItem.itemId
          const found = items.find(item =>
            this.isViewByCategory ? item.categoryId === itemId : item.serviceId === itemId,
          )
          return sum + (found?.amount || 0)
        }, 0)
      })
    },

    chartData() {
      const datasets = this.selectedItems.map(item => ({
        label: item.text,
        data:  this.getDatasetValues(item.itemId),
        color: item.color,
      }))

      return {
        labels:   this.chartLabels,
        datasets: datasets,
      }
    },

    chartOptions() {
      return {
        custom_stacked: true,
        custom_data:    this.monthlyTotals.map(total => formatMoney(total, 0)),
      }
    },
  },

  watch: {
    // Re-initialize selected items when view type changes and emit event
    viewType: {
      handler(newValue) {
        this.initializeSelectedItems()
        this.$emit('view-type-change', newValue)
      },
    },

    // Re-initialize when data changes
    itemList: {
      handler() {
        this.initializeSelectedItems()
      },
      immediate: true,
    },
  },

  methods: {
    initializeSelectedItems() {
      // Initialize with top N items selected (sorted by total amount)
      this.selectedItems = this.displayItemOptions.slice(0, DEFAULT_SELECTED_ITEM_COUNT)
    },

    getDatasetValues(itemId) {
      if (!this.currentDataSource) return []

      return this.currentDataSource.map(monthData => {
        const items = this.isViewByCategory ? monthData.categories : monthData.services
        if (!items) return 0

        const item = items.find(i =>
          this.isViewByCategory ? i.categoryId === itemId : i.serviceId === itemId,
        )
        return item?.amount || 0
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.revenue-by-service-chart {
  min-width: 0;
  border: 1px solid $gray;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  .chart-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 10px;
    ::v-deep .custom-radio .custom-control-label {
      &::before, &::after {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .view-type-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .display-item {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      margin: 0;
      white-space: nowrap;
    }

    ::v-deep .multiselect.multi-checkbox {
      .multiselect__select {
        top: 15px;
      }
      .multiselect__placeholder {
        font-size: 14px;
      }
    }
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 330px;
  }

  .chart-no-data {
    margin-top: 10px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chart-bar {
    max-height: 300px;
  }
}
</style>
