<template>
  <div class="number-of-clients-chart">
    <div
      ref="displayItem"
      class="display-item"
    >
      <label>{{ $t('report.display-item') }}</label>
      <b-form-select
        v-model="selectedDisplayItems"
        :options="displayItemOptions"
        class="display-item__select"
        multiple
        :select-size="1"
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

// Display item configuration
const DISPLAY_ITEMS = [
  { value: 'numberOfNewClients', i18nKey: 'report-client-by-period.new', color: '#1976D2' },
  { value: 'numberOfRevisitClients', i18nKey: 'report-client-by-period.revisit', color: '#FF9800' },
  { value: 'numberOfUnregisteredClients', i18nKey: 'report.unregistered', color: '#4CAF50' },
]

const DEFAULT_DISPLAY_ITEMS = ['numberOfNewClients', 'numberOfRevisitClients', 'numberOfUnregisteredClients']

export default {
  components: {
    ChartLine,
    ChartLegend,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
  },

  data() {
    return {
      selectedDisplayItems: [...DEFAULT_DISPLAY_ITEMS],
    }
  },

  computed: {
    displayItemOptions() {
      return DISPLAY_ITEMS.map(item => ({
        value: item.value,
        text:  this.$t(item.i18nKey),
      }))
    },

    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => formatYearMonthLabel(item.yearMonth))
    },

    hasChartData() {
      return this.chartLabels.length > 0 && this.selectedDisplayItems.length > 0
    },

    chartData() {
      const datasets = DISPLAY_ITEMS
        .filter(item => this.selectedDisplayItems.includes(item.value))
        .map(item => ({
          label: this.$t(item.i18nKey),
          data:  this.sectionData?.data?.map(d => d[item.value] || 0) || [],
          color: item.color,
        }))

      return {
        labels:   this.chartLabels,
        datasets: datasets,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.number-of-clients-chart {
  flex: 1;
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

    &__select {
      max-width: 200px;
    }
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
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
