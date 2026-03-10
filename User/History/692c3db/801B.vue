<template>
  <div class="section-overall-revenue">
    <!-- Header + AI Summary -->
    <div>
      <h3 ref="titleRef">
        {{ $t('report.overall-revenue') }}
      </h3>
      <report-ai-summary
        v-if="showAiSummary"
        :ai-summary="aiSummary"
      />
    </div>

    <!-- Charts -->
    <div
      ref="chartsSection"
      :class="overallRevenueChartsClass"
    >
      <overall-revenue-chart
        :section-data="sectionData"
        :disabled-display-item="rightChartDisplayItem"
        :hide-display-item="hideDisplayItem"
        default-display-item="revenueTotal"
        @display-item-change="leftChartDisplayItem = $event"
      />
      <overall-revenue-chart
        :section-data="sectionData"
        :disabled-display-item="leftChartDisplayItem"
        :hide-display-item="hideDisplayItem"
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
// Utils
import { getAiSummaryPlainText } from 'Utils/report-ai-summary-utils'
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
    hideDisplayItem: {
      type:    Boolean,
      default: false,
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
        this.formatValue(item.serviceSalesAmount),
        this.formatValue(item.productSalesAmount),
        this.formatValue(item.revenueTotal),
        this.formatValue(item.numberOfSales),
        this.formatValue(item.amountPerSale),
        this.formatValue(item.prepaidCardSalesAmount),
        this.formatValue(item.prepaidServiceSalesAmount),
      ])

      if (this.sectionData?.total) {
        const total = this.sectionData.total
        rows.push([
          this.$t('general.total'),
          this.formatValue(total.serviceSalesAmount),
          this.formatValue(total.productSalesAmount),
          this.formatValue(total.revenueTotal),
          this.formatValue(total.numberOfSales),
          this.formatValue(total.amountPerSale),
          this.formatValue(total.prepaidCardSalesAmount),
          this.formatValue(total.prepaidServiceSalesAmount),
        ])
      }

      return rows
    },

    showAiSummary() {
      return this.aiSummary && this.aiSummary.length > 0
    },

    aiSummaryPlainText() {
      return getAiSummaryPlainText(this.aiSummary)
    },
  },

  methods: {
    formatValue(value) {
      if (value === null || value === undefined) {
        return '-'
      }
      return formatMoney(value, 0)
    },

    // Expose method for parent to get print sections
    getPrintSections() {
      const sections = []

      // Title Section
      if (this.$refs.titleRef) {
        sections.push({
          ref_type:           print_options.print_ref_type.text,
          section_ref:        this.$refs.titleRef,
          section_excel_text: this.$t('report.overall-revenue'),
          alignment:          print_options.text_ref_type_alignment.left,
          fontWeight:         'bold',
          fontSize:           10,
          marginBottom:       0,
        })
      }

      // AI Summary Section
      if (this.aiSummaryPlainText) {
        sections.push({
          ref_type:           print_options.print_ref_type.text,
          section_ref:        this.$refs.titleRef,
          section_excel_text: this.aiSummaryPlainText,
          alignment:          print_options.text_ref_type_alignment.left,
          enableWordWrap:     true,
          fontSize:           12,
          hangingIndent:      10,
          drawBorder:         true,
          borderPadding:      10,
        })
      }

      // Charts as CANVAS
      if (this.$refs.chartsSection) {
        sections.push({
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.chartsSection,
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
