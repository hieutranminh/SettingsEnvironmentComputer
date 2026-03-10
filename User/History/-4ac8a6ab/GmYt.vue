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
      return (ws, startRowIndex) => {
        const headerRow1Index = startRowIndex + 1
        const headerRow2Index = startRowIndex + 2

        // Row 1: Main headers with colspan
        const mainHeaders = {
          [`A${headerRow1Index}:A${headerRow2Index}`]: this.$t('general.month'),
          [`B${headerRow1Index}:C${headerRow1Index}`]: this.$t('report.booking-total'),
          [`D${headerRow1Index}:E${headerRow1Index}`]: this.$t('report.naver-bookings'),
          [`F${headerRow1Index}:G${headerRow1Index}`]: `${this.$t('report.late-cancellation')}\n${this.$t('report.within-24-hours')}`,
          [`H${headerRow1Index}:I${headerRow1Index}`]: this.$t('report.no-show'),
          [`J${headerRow1Index}:K${headerRow1Index}`]: this.$t('report.late-cancellation-and-no-show'),
        }

        // Apply main headers with merge
        Object.entries(mainHeaders).forEach(([range, label]) => {
          ws.mergeCells(range)
          const cell = ws.getCell(range.split(':')[0])
          cell.value = label
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }
          this.applyBorderToCell(cell)
        })

        // Row 2: Sub headers (Count, Ratio)
        const subHeaderCells = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
        const subHeaderLabels = [
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
          this.$t('report.count'), this.$t('report.ratio'),
        ]

        subHeaderCells.forEach((col, index) => {
          const cell = ws.getCell(`${col}${headerRow2Index}`)
          cell.value = subHeaderLabels[index]
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }
          this.applyBorderToCell(cell)
        })

        // Set row heights for headers
        ws.getRow(headerRow1Index).height = 35
        ws.getRow(headerRow2Index).height = 20

        // Table Body
        let rowsAdded = 2 // 2 header rows
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
