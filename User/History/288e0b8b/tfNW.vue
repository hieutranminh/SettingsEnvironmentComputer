<template>
  <div class="booking-chart-left">
    <div class="chart-container">
      <template v-if="hasChartData">
        <chart-line
          :data="chartData"
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

    totalBookingsData() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => item.totalAllBookings || 0)
    },

    naverBookingsData() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => item.naverBookings || 0)
    },

    hasChartData() {
      return this.chartLabels.length > 0
    },

    chartData() {
      return {
        labels:   this.chartLabels,
        datasets: [
          {
            label: this.$t('report.booking-total'),
            data:  this.totalBookingsData,
            color: '#1976D2',
          },
          {
            label: this.$t('report.naver-bookings'),
            data:  this.naverBookingsData,
            color: '#FF9800',
          },
        ],
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.booking-chart-left {
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
