<template>
  <div class="section-overall-revenue">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.overall-revenue') }}</h3>
      <report-ai-summary :ai-summary="aiSummary" />
    </div>

    <!-- Charts -->
    <div :class="overallRevenueChartsClass">
      <overall-revenue-chart
        :section-data="sectionData"
        :disabled-display-item="rightChartDisplayItem"
        default-display-item="revenueTotal"
        @display-item-change="leftChartDisplayItem = $event"
      />
      <overall-revenue-chart
        :section-data="sectionData"
        :disabled-display-item="leftChartDisplayItem"
        default-display-item="amountPerSale"
        @display-item-change="rightChartDisplayItem = $event"
      />
    </div>

    <!-- Hidden print-only charts wrapper (excludes dropdowns) -->
    <div
      ref="chartsPrintSection"
      class="charts-print-section"
    >
      <div class="chart-print-item">
        <div class="chart-print-title">
          {{ leftChartLabel }}
        </div>
        <chart-line
          v-if="hasChartData"
          :data="leftChartData"
          :is_decimal="true"
        />
        <chart-legend
          v-if="hasChartData"
          :chart_data="leftChartData"
        />
      </div>
      <div class="chart-print-item">
        <div class="chart-print-title">
          {{ rightChartLabel }}
        </div>
        <chart-line
          v-if="hasChartData"
          :data="rightChartData"
          :is_decimal="true"
        />
        <chart-legend
          v-if="hasChartData"
          :chart_data="rightChartData"
        />
      </div>
    </div>

    <!-- Table -->
    <overall-revenue-table
      ref="tableSection"
      :section-data="sectionData"
    />
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth } from 'Utils/format-data.js'
// Constants
import print_options from 'Options/print-options.js'
// Components
import ReportAiSummary from 'Modules/reports/report-ai-summary/report-ai-summary.vue'
import OverallRevenueChart from './overall-revenue-chart.vue'
import OverallRevenueTable from './overall-revenue-table.vue'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'
import { formatYearMonthLabel } from 'Utils/format-data.js'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

export default {
  mixins: [
    DeviceMixin,
  ],

  components: {
    ReportAiSummary,
    OverallRevenueChart,
    OverallRevenueTable,
    ChartLine,
    ChartLegend,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
    aiSummary: {
      type:    Array,
      default: () => [],
    },
  },

  data() {
    return {
      leftChartDisplayItem:  'revenueTotal',
      rightChartDisplayItem: 'amountPerSale',
    }
  },

  computed: {
    overallRevenueChartsClass() {
      return ['overall-revenue-charts', {
        'overall-revenue-charts--mobile': this.isMobileDevice,
      }]
    },

    // Excel Data
    excelTableHeaders() {
      return [
        this.$t('general.month'),
        this.$t('report.service'),
        this.$t('report.product'),
        this.$t('report.revenue-total'),
        this.$t('report.no-of-clients'),
        this.$t('report.amount-per-sale'),
        this.$t('report.prepaid-card-sales'),
        this.$t('report.prepaid-service-sales'),
      ]
    },

    // Custom styles for table columns alignment (PDF & Excel)
    tableCustomStyles() {
      return [
        { halign: 'center' },
        { halign: 'right' },
        { halign: 'right' },
        { halign: 'right' },
        { halign: 'center' },
        { halign: 'right' },
        { halign: 'right' },
        { halign: 'right' },
      ]
    },

    // Chart data for print section
    chartLabels() {
      if (!this.sectionData?.data) return []
      return this.sectionData.data.map(item => formatYearMonthLabel(item.yearMonth))
    },

    hasChartData() {
      return this.chartLabels.length > 0
    },

    leftChartLabel() {
      return this.getDisplayItemLabel(this.leftChartDisplayItem)
    },

    rightChartLabel() {
      return this.getDisplayItemLabel(this.rightChartDisplayItem)
    },

    leftChartData() {
      return this.buildChartData(this.leftChartDisplayItem, this.leftChartLabel)
    },

    rightChartData() {
      return this.buildChartData(this.rightChartDisplayItem, this.rightChartLabel)
    },

    excelTableRows() {
      if (!this.sectionData?.data) return []

      const rows = this.sectionData.data.map(item => [
        formatYearMonth(item.yearMonth),
        formatMoney(item.servicesAmountTotal || 0, 0),
        formatMoney(item.productsAmountTotal || 0, 0),
        formatMoney(item.revenueTotal || 0, 0),
        formatMoney(item.numberOfClients || 0, 0),
        formatMoney(item.amountPerSale || 0, 0),
        formatMoney(item.prepaidCardAmountTotal || 0, 0),
        formatMoney(item.prepaidServicesAmountTotal || 0, 0),
      ])

      if (this.sectionData?.total) {
        const total = this.sectionData.total
        rows.push([
          this.$t('general.total'),
          formatMoney(total.servicesAmountTotal || 0, 0),
          formatMoney(total.productsAmountTotal || 0, 0),
          formatMoney(total.revenueTotal || 0, 0),
          formatMoney(total.numberOfClients || 0, 0),
          formatMoney(total.amountPerSale || 0, 0),
          formatMoney(total.prepaidCardAmountTotal || 0, 0),
          formatMoney(total.prepaidServicesAmountTotal || 0, 0),
        ])
      }

      return rows
    },
  },

  methods: {
    getDisplayItemLabel(displayItem) {
      const labelMap = {
        revenueTotal:              this.$t('report.revenue-total'),
        servicesAmountTotal:       this.$t('report.service'),
        productsAmountTotal:       this.$t('report.product'),
        numberOfClients:           this.$t('report.no-of-clients'),
        amountPerSale:             this.$t('report.amount-per-sale'),
        prepaidCardAmountTotal:    this.$t('report.prepaid-card-sales'),
        prepaidServicesAmountTotal: this.$t('report.prepaid-service-sales'),
      }
      return labelMap[displayItem] || ''
    },

    buildChartData(displayItem, label) {
      if (!this.sectionData?.data) {
        return { labels: [], datasets: [] }
      }
      return {
        labels:   this.chartLabels,
        datasets: [{
          label: label,
          data:  this.sectionData.data.map(item => item[displayItem] || 0),
          color: '#1976D2',
        }],
      }
    },

    // Expose method for parent to get print sections
    getPrintSections() {
      const sections = []

      // Header + AI Summary as CANVAS
      if (this.$refs.headerSection) {
        sections.push({
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.headerSection,
        })
      }

      // Charts as CANVAS (hidden print section with both charts side by side, no dropdowns)
      if (this.$refs.chartsPrintSection) {
        sections.push({
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.chartsPrintSection,
        })
      }

      // Table as TABLE type
      const tableComponent = this.$refs.tableSection
      if (tableComponent?.$refs.tableRef) {
        const vgtWrapper = tableComponent.$refs.tableRef.$el
        const tableEl = vgtWrapper?.querySelector('table')
        if (tableEl) {
          sections.push({
            ref_type:            print_options.print_ref_type.table,
            section_ref:         tableEl,
            customStyles:        this.tableCustomStyles,
            section_excel_table: {
              headers: this.excelTableHeaders,
              rows:    this.excelTableRows,
            },
          })
        }
      }

      return sections
    },
  },
}
</script>

<style lang="scss">
@import './section-overall-revenue.scss';
</style>
