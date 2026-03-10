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

// Color palette for dynamic staff colors
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
]

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
        text:    staff.staffName,
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
      // Initialize with all staff selected
      this.selectedItems = [...this.displayItemOptions]
    },

    getDatasetValues(staffId) {
      if (!this.sectionData?.data) return []

      return this.sectionData.data.map(monthData => {
        const staff = monthData.staffs?.find(s => s.staffId === staffId)
        return staff?.amount || 0
      })
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
