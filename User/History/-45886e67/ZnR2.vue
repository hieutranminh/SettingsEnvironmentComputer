<template>
  <div class="number-of-clients-chart">
    <div
      ref="displayItem"
      class="display-item"
    >
      <label>{{ $t('report.display-item') }}</label>
      <select-multiple-display-item
        v-model="selectedItems"
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

// Display item configuration with getValue function for each item
const DISPLAY_ITEMS = [
  {
    value:    'numberOfNewClients',
    i18nKey:  'report-client-by-period.new',
    color:    '#1976D2',
    getValue: (d) => d.numberOfNewClients || 0,
  },
  {
    value:    'numberOfRevisitClients',
    i18nKey:  'report-client-by-period.revisit',
    color:    '#FF9800',
    getValue: (d) => d.numberOfRevisitClients || 0,
  },
  {
    value:    'newPlusRevisit',
    i18nKey:  'report.new-plus-revisit',
    color:    '#4CAF50',
    getValue: (d) => (d.numberOfNewClients || 0) + (d.numberOfRevisitClients || 0),
  },
  {
    value:    'numberOfUnregisteredClients',
    i18nKey:  'report.unregistered',
    color:    '#9C27B0',
    getValue: (d) => d.numberOfUnregisteredClients || 0,
  },
  {
    value:    'totalClients',
    i18nKey:  'general.total',
    color:    '#F44336',
    getValue: (d) => d.totalClients || 0,
  },
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
  },

  data() {
    return {
      selectedItems: [],
    }
  },

  computed: {
    displayItemOptions() {
      return DISPLAY_ITEMS.map(item => ({
        value:    item.value,
        text:     this.$t(item.i18nKey),
        color:    item.color,
        getValue: item.getValue,
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
        data:  this.getDatasetValues(item),
        color: item.color,
      }))

      return {
        labels:   this.chartLabels,
        datasets: datasets,
      }
    },
  },

  created() {
    // Initialize with all items selected
    this.selectedItems = [...this.displayItemOptions]
  },

  methods: {
    getDatasetValues(item) {
      if (!this.sectionData?.data) return []
      return this.sectionData.data.map(item.getValue)
    },
  },
}
</script>

<style lang="scss" scoped>
.number-of-clients-chart {
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

    .multiselect.multi-checkbox {
      .multiselect__select {
        top: 15px;
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
