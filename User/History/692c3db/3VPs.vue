<template>
  <div class="section-overall-revenue">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.overall-revenue') }}</h3>
      <report-ai-summary :ai-summary="aiSummary" />
    </div>

    <!-- Charts -->
    <div
      ref="chartsSection"
      :class="overallRevenueChartsClass"
    >
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

      // Charts as CANVAS (clone and remove display-item dropdowns)
      if (this.$refs.chartsSection) {
        const chartsPrintElement = this.createChartsPrintElement()
        if (chartsPrintElement) {
          sections.push({
            ref_type:    print_options.print_ref_type.canvas,
            section_ref: chartsPrintElement,
          })
        }
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
