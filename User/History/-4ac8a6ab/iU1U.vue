<template>
  <div class="section-booking">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.booking') }}</h3>
      <report-ai-summary :ai-summary="aiSummary" />
    </div>

    <!-- Charts -->
    <div
      ref="chartsSection"
      :class="bookingChartsClass"
    >
      <booking-chart-left :section-data="sectionData" />
      <booking-chart-right :section-data="sectionData" />
    </div>

    <!-- Table -->
    <booking-table
      ref="tableSection"
      :section-data="sectionData"
    />

    <!-- Notes -->
    <ul class="notes">
      <li v-html="$t('report.note-report-analysis-booking-1')" />
      <li>{{ $t('report.note-report-analysis-booking-2') }}</li>
    </ul>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'
import { formatYearMonth } from 'Utils/format-data.js'
// Constants
import print_options from 'Options/print-options.js'
// Components
import ReportAiSummary from 'Modules/reports/report-ai-summary/report-ai-summary.vue'
import BookingChartLeft from './partials/booking-chart-left.vue'
import BookingChartRight from './partials/booking-chart-right.vue'
import BookingTable from './partials/booking-table.vue'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

export default {
  mixins: [
    DeviceMixin,
  ],

  components: {
    ReportAiSummary,
    BookingChartLeft,
    BookingChartRight,
    BookingTable,
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

  computed: {
    bookingChartsClass() {
      return ['booking-charts', {
        'booking-charts--mobile': this.isMobileDevice,
      }]
    },

    // Excel Data - 11 columns matching table structure
    excelTableHeaders() {
      return [
        this.$t('general.month'),
        this.$t('report.booking-total'),
        this.$t('report.ratio'),
        this.$t('report.naver-bookings'),
        this.$t('report.ratio'),
        this.$t('report.late-cancellation-within-24h'),
        this.$t('report.ratio'),
        this.$t('report.no-show'),
        this.$t('report.ratio'),
        this.$t('report.late-cancellation-and-no-show'),
        this.$t('report.ratio'),
      ]
    },

    excelTableRows() {
      if (!this.sectionData?.data) return []

      const rows = this.sectionData.data.map(item => [
        formatYearMonth(item.yearMonth),
        formatMoney(item.totalBookings || 0, 0),
        `${(item.totalBookingsRatio || 0).toFixed(1)}%`,
        formatMoney(item.naverBookings || 0, 0),
        `${(item.naverBookingsRatio || 0).toFixed(1)}%`,
        formatMoney(item.lateCancellationWithin24h || 0, 0),
        `${(item.lateCancellationWithin24hRatio || 0).toFixed(1)}%`,
        formatMoney(item.noShow || 0, 0),
        `${(item.noShowRatio || 0).toFixed(1)}%`,
        formatMoney(item.lateCancellationAndNoShow || 0, 0),
        `${(item.lateCancellationAndNoShowRatio || 0).toFixed(1)}%`,
      ])

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

      // Charts as CANVAS
      if (this.$refs.chartsSection) {
        sections.push({
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.chartsSection,
        })
      }

      // Table as TABLE type
      const tableComponent = this.$refs.tableSection
      const tableEl = tableComponent?.$refs.tableRef
      if (tableEl) {
        sections.push({
          ref_type:            print_options.print_ref_type.table,
          section_ref:         tableEl,
          section_excel_table: {
            headers: this.excelTableHeaders,
            rows:    this.excelTableRows,
          },
        })
      }

      return sections
    },
  },
}
</script>

<style lang="scss">
@import './section-booking.scss';
</style>
