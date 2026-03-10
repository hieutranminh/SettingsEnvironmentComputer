<template>
  <div class="section-revenue-by-staff">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.revenue-by-staff') }}</h3>

      <!-- AI Error Message -->
      <div
        v-if="aiError"
        class="ai-error-message"
      >
        {{ aiError }}
      </div>

      <!-- AI Summary (hide when error or empty summary) -->
      <report-ai-summary
        v-else-if="showAiSummary"
        :ai-summary="aiSummary"
      />
    </div>

    <!-- Chart and Table -->
    <div :class="revenueByStaffContentClass">
      <!-- Chart -->
      <revenue-by-staff-chart
        ref="chartSection"
        :section-data="sectionData"
        :hide-display-item="hideDisplayItem"
      />

      <!-- Table -->
      <revenue-by-staff-table
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
import RevenueByStaffChart from './partials/revenue-by-staff-chart.vue'
import RevenueByStaffTable from './partials/revenue-by-staff-table.vue'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

export default {
  mixins: [
    DeviceMixin,
  ],

  components: {
    ReportAiSummary,
    RevenueByStaffChart,
    RevenueByStaffTable,
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
    aiError: {
      type:    String,
      default: null,
    },
    hideDisplayItem: {
      type:    Boolean,
      default: false,
    },
  },

  computed: {
    // Get staff list from first data item, excluding staffId -1 (All)
    staffList() {
      if (!this.sectionData?.data?.[0]?.staffs) {
        return []
      }
      return this.sectionData.data[0].staffs.filter(staff => staff.staffId !== -1)
    },

    // Excel Data - Dynamic headers based on staff
    excelTableHeaders() {
      const headers = [this.$t('general.month')]
      this.staffList.forEach(staff => {
        headers.push(this.getStaffDisplayName(staff))
      })
      return headers
    },

    // Custom styles for table columns alignment (PDF & Excel)
    tableCustomStyles() {
      const styles = [{ halign: 'center' }]
      this.staffList.forEach(() => {
        styles.push({ halign: 'center' })
      })
      return styles
    },

    excelTableRows() {
      if (!this.sectionData?.data) return []

      return this.sectionData.data.map(item => {
        const row = [formatYearMonth(item.yearMonth)]
        this.staffList.forEach(staff => {
          const staffData = item.staffs?.find(s => s.staffId === staff.staffId)
          row.push(formatMoney(staffData?.amount || 0, 0))
        })
        return row
      })
    },

    revenueByStaffContentClass() {
      return ['revenue-by-staff-content', {
        'revenue-by-staff-content--mobile': this.isMobileDevice,
      }]
    },

    // Show AI summary only when no error and summary is not empty
    showAiSummary() {
      return !this.aiError && this.aiSummary?.length > 0
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

<style lang="scss">
@import './section-revenue-by-staff.scss';
</style>
