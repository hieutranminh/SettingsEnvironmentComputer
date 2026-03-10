<template>
  <div class="revenue-by-staff-chart">
    <div
      v-show="!hideDisplayItem"
      ref="displayItem"
      class="display-item"
    >
      <label>{{ $t('report.display-item') }}</label>
      <select-multiple-display-item
        v-model="selectedItems"
        :placeholder="$t('general.select')"
        :options="displayItemOptions"
      />
    </div>

    <div class="chart-container">
      <template v-if="hasChartData">
        <chart-line
          :data="chartData"
          :is_decimal="false"
          class="chart-line"
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
import { formatYearMonthLabel } from 'Utils/format-data.js'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'
import SelectMultipleDisplayItem from 'Modules/reports/select-multiple-display-item/select-multiple-display-item.vue'

// Color palette for dynamic staff colors (supports up to 50 staff)
const STAFF_COLORS = [
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

// Default number of staff to select initially
const DEFAULT_SELECTED_STAFF_COUNT = 5

export default {
  components: {
    ChartLine,
    ChartLegend,
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
      selectedItems: [],
    }
  },

  computed: {
    // Get staff list from first data item, excluding staffId -1 (All)
    staffList() {
      if (!this.sectionData?.data?.[0]?.staffs) {
        return []
      }
      return this.sectionData.data[0].staffs.filter(staff => staff.staffId !== -1)
    },

    displayItemOptions() {
      return this.staffList.map((staff, index) => ({
        value:   staff.staffId,
        text:    this.getStaffDisplayName(staff),
        color:   STAFF_COLORS[index % STAFF_COLORS.length],
        staffId: staff.staffId,
      }))
    },

    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => formatYearMonthLabel(item.yearMonth))
    },

    hasChartData() {
      return this.chartLabels.length > 0 && this.selectedItems.length > 0
    },

    chartData() {
      const datasets = this.selectedItems.map(item => ({
        label: item.text,
        data:  this.getDatasetValues(item.staffId),
        color: item.color,
      }))

      return {
        labels:   this.chartLabels,
        datasets: datasets,
      }
    },
  },

  watch: {
    // Re-initialize selected items when staff list changes
    staffList: {
      handler() {
        this.initializeSelectedItems()
      },
      immediate: true,
    },
  },

  methods: {
    initializeSelectedItems() {
      // Calculate total revenue for each staff across all months, excluding staffId 0 (Not Selected)
      const optionsWithRevenue = this.displayItemOptions
        .filter(option => option.staffId !== 0)
        .map(option => ({
          option:       option, // Keep reference to original option object
          totalRevenue: this.calculateStaffTotalRevenue(option.staffId),
        }))

      // Sort by total revenue descending and select top N staff
      const topStaffByRevenue = [...optionsWithRevenue]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, DEFAULT_SELECTED_STAFF_COUNT)

      // Use the original option objects (same references as displayItemOptions)
      this.selectedItems = topStaffByRevenue.map(item => item.option)
    },

    calculateStaffTotalRevenue(staffId) {
      if (!this.sectionData?.data) return 0

      return this.sectionData.data.reduce((total, monthData) => {
        const staff = monthData.staffs?.find(s => s.staffId === staffId)
        return total + (staff?.amount || 0)
      }, 0)
    },

    getDatasetValues(staffId) {
      if (!this.sectionData?.data) return []

      return this.sectionData.data.map(monthData => {
        const staff = monthData.staffs?.find(s => s.staffId === staffId)
        return staff?.amount || 0
      })
    },

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
.revenue-by-staff-chart {
  width: 50%;
  min-width: 0;
  border: 1px solid $gray;
  padding: 10px;
  display: flex;
  flex-direction: column;

  .display-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

  .chart-line {
    max-height: 300px;
  }
}
</style>
