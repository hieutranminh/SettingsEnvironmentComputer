<template>
  <div class="section-number-of-clients">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.number-of-clients') }}</h3>
      <report-ai-summary :ai-summary="aiSummary" />
    </div>

    <!-- Chart and Table -->
    <div class="number-of-clients-content">
      <!-- Chart -->
      <number-of-clients-chart
        ref="chartSection"
        :section-data="sectionData"
        :hide-display-item="hideDisplayItem"
      />

      <!-- Table -->
      <number-of-clients-table
        ref="tableSection"
        :section-data="sectionData"
      />
    </div>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth } from 'Utils/format-data.js'
// Constants
import print_options from 'Options/print-options.js'
// Components
import ReportAiSummary from 'Modules/reports/report-ai-summary/report-ai-summary.vue'
import NumberOfClientsChart from './partials/number-of-clients-chart.vue'
import NumberOfClientsTable from './partials/number-of-clients-table.vue'

export default {
  components: {
    ReportAiSummary,
    NumberOfClientsChart,
    NumberOfClientsTable,
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

  computed: {
    // Excel Data
    excelTableHeaders() {
      return [
        this.$t('general.month'),
        this.$t('report-client-by-period.new'),
        this.$t('report-client-by-period.revisit'),
        this.$t('report.unregistered'),
        this.$t('general.total'),
      ]
    },

    // Custom styles for table columns alignment (PDF & Excel)
    tableCustomStyles() {
      return [
        { halign: 'center' },
        { halign: 'center' },
        { halign: 'center' },
        { halign: 'center' },
        { halign: 'center' },
      ]
    },

    excelTableRows() {
      if (!this.sectionData?.data) return []

      const rows = this.sectionData.data.map(item => [
        formatYearMonth(item.yearMonth),
        formatMoney(item.numberOfNewClients || 0, 0),
        formatMoney(item.numberOfRevisitClients || 0, 0),
        formatMoney(item.numberOfUnregisteredClients || 0, 0),
        formatMoney(item.totalClients || 0, 0),
      ])

      if (this.sectionData?.total) {
        const total = this.sectionData.total
        rows.push([
          this.$t('general.total'),
          formatMoney(total.numberOfNewClients || 0, 0),
          formatMoney(total.numberOfRevisitClients || 0, 0),
          formatMoney(total.numberOfUnregisteredClients || 0, 0),
          formatMoney(total.totalClients || 0, 0),
        ])
      }

      return rows
    },
  },

  methods: {
    // Expose method for parent to get print sections
    getPrintSections() {
      const sections = []

      // Header + AI Summary as CANVAS - with page break before to start new page
      if (this.$refs.headerSection) {
        sections.push({
          ref_type:          print_options.print_ref_type.canvas,
          section_ref:       this.$refs.headerSection,
          page_break_before: true,
        })
      }

      // Chart as CANVAS
      if (this.$refs.chartSection) {
        sections.push({
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.chartSection.$el,
        })
      }

      // Table as TABLE type for Excel export
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
@import './section-number-of-clients.scss';
</style>
