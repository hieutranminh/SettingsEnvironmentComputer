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

    excelTableRows() {
      if (!this.sectionData?.data) return []

      return this.sectionData.data.map(item => [
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
    },
  },

  methods: {
    // Custom Excel handler for merged headers
    createExcelCustomHandler() {
      return (ws) => {
        // Add 2 empty rows for headers
        const headerRow1 = ws.addRow([])
        const headerRow2 = ws.addRow([])
        const row1Num = headerRow1.number
        const row2Num = headerRow2.number

        // Define header structure
        const mainHeaderCells = {
          A: { value: this.$t('general.month'), mergeRange: `A${row1Num}:A${row2Num}` },
          B: { value: this.$t('report.booking-total'), mergeRange: `B${row1Num}:C${row1Num}` },
          D: { value: this.$t('report.naver-bookings'), mergeRange: `D${row1Num}:E${row1Num}` },
          F: { value: `${this.$t('report.late-cancellation')}\n${this.$t('report.within-24-hours')}`, mergeRange: `F${row1Num}:G${row1Num}` },
          H: { value: this.$t('report.no-show'), mergeRange: `H${row1Num}:I${row1Num}` },
          J: { value: this.$t('report.late-cancellation-and-no-show'), mergeRange: `J${row1Num}:K${row1Num}` },
        }

        // Apply main headers with merge
        Object.entries(mainHeaderCells).forEach(([col, config]) => {
          ws.mergeCells(config.mergeRange)
          const cell = ws.getCell(`${col}${row1Num}`)
          cell.value = config.value
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }
          this.applyBorderToCell(cell)
        })

        // Sub headers (Count, Ratio) - Row 2
        const subHeaderCols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
        const subHeaderValues = [
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
        ]

        subHeaderCols.forEach((col, index) => {
          const cell = ws.getCell(`${col}${row2Num}`)
          cell.value = subHeaderValues[index]
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }
          this.applyBorderToCell(cell)
        })

        // Set row heights
        headerRow1.height = 35
        headerRow2.height = 20

        // Table Body
        let rowsAdded = 2
        this.excelTableRows.forEach(rowData => {
          const row = ws.addRow(rowData)
          row.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
            this.applyBorderToCell(cell)
          })
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
