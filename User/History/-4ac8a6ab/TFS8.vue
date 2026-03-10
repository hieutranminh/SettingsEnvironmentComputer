<template>
  <div class="section-booking">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.booking') }}</h3>
      <report-ai-summary
        v-if="showAiSummary"
        :ai-summary="aiSummary"
      />
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

    excelTableRows() {
      if (!this.sectionData?.data) return []

      return this.sectionData.data.map(item => [
        formatYearMonth(item.yearMonth),
        formatMoney(item.totalAllBookings || 0, 0),
        `${(item.totalAllBookingsRatio || 0).toFixed(1)}%`,
        formatMoney(item.naverBookings || 0, 0),
        `${(item.naverBookingsRatio || 0).toFixed(1)}%`,
        formatMoney(item.lateCancellationWithin24h || 0, 0),
        `${(item.lateCancellationWithin24hRatio || 0).toFixed(1)}%`,
        formatMoney(item.noShow || 0, 0),
        `${(item.noShowRatio || 0).toFixed(1)}%`,
        formatMoney(item.lateCancellationAndNoShow || 0, 0),
        `${(item.lateCancellationAndNoShowRatio || 0).toFixed(1)}%`,
      ])
    },

    showAiSummary() {
      return this.aiSummary && this.aiSummary.length > 0
    },
  },

  methods: {
    // Custom Excel handler for merged headers
    createExcelCustomHandler() {
      return (ws) => {
        // Get current row number for header placement
        const row1Num = ws.rowCount + 1
        const row2Num = ws.rowCount + 2

        // Header Row 1 - Main headers
        const headerRow1Data = [
          this.$t('general.month'),
          this.$t('report.booking-total'), '',
          this.$t('report.naver-bookings'), '',
          this.$t('report.same-date-cancel'), '',
          this.$t('report.no-show'), '',
          this.$t('report.same-day-cancel-and-no-show'), '',
        ]
        const headerRow1 = ws.addRow(headerRow1Data)

        // Header Row 2 - Sub headers (Count, Ratio)
        const headerRow2Data = [
          '',
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
        ]
        const headerRow2 = ws.addRow(headerRow2Data)

        // Merge cells AFTER adding rows with data
        const mergeCellRanges = [
          `A${row1Num}:A${row2Num}`, // Month (rowspan=2)
          `B${row1Num}:C${row1Num}`, // Total Bookings (colspan=2)
          `D${row1Num}:E${row1Num}`, // Naver Bookings (colspan=2)
          `F${row1Num}:G${row1Num}`, // Same-day Cancel (colspan=2)
          `H${row1Num}:I${row1Num}`, // No Show (colspan=2)
          `J${row1Num}:K${row1Num}`, // Late Cancel + No Show (colspan=2)
        ]

        mergeCellRanges.forEach(range => {
          ws.mergeCells(range)
        })

        // Style header row 1
        for (let col = 1; col <= 11; col++) {
          const cell = headerRow1.getCell(col)
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCDFE6' } }
          this.applyBorderToCell(cell)
        }
        headerRow1.height = 35

        // Style header row 2
        for (let col = 1; col <= 11; col++) {
          const cell = headerRow2.getCell(col)
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCDFE6' } }
          this.applyBorderToCell(cell)
        }
        headerRow2.height = 20

        // Table Body
        let rowsAdded = 2
        this.excelTableRows.forEach(rowData => {
          const row = ws.addRow(rowData)
          for (let col = 1; col <= rowData.length; col++) {
            const cell = row.getCell(col)
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
            this.applyBorderToCell(cell)
          }
          rowsAdded++
        })

        return rowsAdded
      }
    },

    applyBorderToCell(cell) {
      cell.border = {
        top:    { style: 'thin', color: { argb: '808080' } },
        left:   { style: 'thin', color: { argb: '808080' } },
        bottom: { style: 'thin', color: { argb: '808080' } },
        right:  { style: 'thin', color: { argb: '808080' } },
      }
    },

    // Expose method for parent to get print sections
    getPrintSections() {
      const sections = []

      // Header + AI Summary as CANVAS
      if (this.$refs.headerSection) {
        sections.push({
          ref_type:          print_options.print_ref_type.canvas,
          section_ref:       this.$refs.headerSection,
          page_break_before: true,
        })
      }

      // Charts as CANVAS
      if (this.$refs.chartsSection) {
        sections.push({
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.chartsSection,
        })
      }

      // Table as TABLE type with custom Excel handler
      const tableComponent = this.$refs.tableSection
      const tableEl = tableComponent?.$refs.tableRef
      if (tableEl) {
        sections.push({
          ref_type:                     print_options.print_ref_type.table,
          section_ref:                  tableEl,
          section_excel_custom_handler: this.createExcelCustomHandler(),
          section_excel_table:          {
            headers: [],
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
