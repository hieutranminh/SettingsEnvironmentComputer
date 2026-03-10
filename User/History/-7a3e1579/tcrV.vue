<template>
  <div class="booking-chart-cancellation">
    <div class="chart-container">
      <template v-if="hasChartData">
        <chart-line
          :data="chartData"
          :is_decimal_data="true"
          :is_decimal_percent="true"
          :options="chartOptions"
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
import { formatMoney } from 'CommonHelpers'
import { formatYearMonthLabel } from 'Utils/format-data.js'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'

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

  computed: {
    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => formatYearMonthLabel(item.yearMonth))
    },

    lateCancellationAndNoShowRatioData() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => item.lateCancellationAndNoShowRatio || 0)
    },

    hasChartData() {
      return this.chartLabels.length > 0
    },

    chartOptions() {
      return {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback:    (value, index, values) => {
                const maxValue = Math.max(...values)
                // Format with 1 decimal if max < 10, otherwise no decimal
                const decimal = (maxValue !== 0 && Math.abs(maxValue) < 10) ? 1 : 0
                return `${formatMoney(value, decimal)}%`
              },
            },
          }],
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem) => `${formatMoney(tooltipItem.value, 1)}%`,
          },
        },
      }
    },

    chartData() {
      return {
        labels:   this.chartLabels,
        datasets: [
          {
            label: this.$t('report.late-cancellation-and-no-show'),
            data:  this.lateCancellationAndNoShowRatioData,
            color: '#FF9800',
          },
        ],
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.booking-chart-cancellation {
  flex: 1;
  min-width: 0;
  border: 1px solid $gray;
  padding: 10px;
  display: flex;
  flex-direction: column;

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
