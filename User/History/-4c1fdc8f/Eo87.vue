<template>
  <div class="section-revenue-by-service">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.revenue-by-service') }}</h3>
      <report-ai-summary
        :ai-summary="aiSummary"
      />
    </div>

    <!-- Chart -->
    <revenue-by-service-chart
      ref="chartSection"
      :section-data="sectionData"
      :hide-display-item="hideDisplayItem"
      @view-type-change="onViewTypeChange"
    />

    <!-- Table -->
    <revenue-by-service-table
      ref="tableSection"
      :section-data="sectionData"
      :view-type="viewType"
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
import RevenueByServiceChart from './partials/revenue-by-service-chart.vue'
import RevenueByServiceTable from './partials/revenue-by-service-table.vue'

// View type constants
const VIEW_TYPE = {
  CATEGORY: 'category',
  SERVICE:  'service',
}

export default {
  components: {
    ReportAiSummary,
    RevenueByServiceChart,
    RevenueByServiceTable,
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
      viewType: VIEW_TYPE.CATEGORY,
    }
  },

  computed: {
    isViewByCategory() {
      return this.viewType === VIEW_TYPE.CATEGORY
    },

    // Get current data source based on view type
    currentDataSource() {
      if (!this.sectionData) return []

      if (this.isViewByCategory) {
        return this.sectionData.categoryData || []
      }
      return this.sectionData.serviceData || []
    },

    // Get list of yearMonth values
    yearMonthList() {
      if (!this.currentDataSource) {
        return []
      }
      return this.currentDataSource.map(item => item.yearMonth)
    },

    // Get unique items list (for Excel export)
    itemList() {
      if (!this.currentDataSource || this.currentDataSource.length === 0) {
        return []
      }

      const itemMap = new Map()

      this.currentDataSource.forEach(monthData => {
        const items = this.isViewByCategory ? monthData.categories : monthData.services
        if (!items) return

        items.forEach(item => {
          const itemId = this.isViewByCategory ? item.categoryId : item.serviceId
          if (itemMap.has(itemId)) return

          itemMap.set(itemId, {
            id:           itemId,
            name:         this.isViewByCategory ? item.categoryName : item.serviceName,
            categoryName: item.categoryName || '',
          })
        })
      })

      return Array.from(itemMap.values())
    },

    // Excel Data - Dynamic headers based on yearMonth
    excelTableHeaders() {
      const headers = []

      // For Service view: add Category column first
      if (!this.isViewByCategory) {
        headers.push(this.$t('report.category'))
      }

      // Item name column (Category or Service)
      headers.push(this.isViewByCategory ? this.$t('report.category') : this.$t('report.service'))

      // YearMonth columns
      this.yearMonthList.forEach(yearMonth => {
        headers.push(formatYearMonth(yearMonth))
      })
      return headers
    },

    // Custom styles for table columns alignment (PDF & Excel)
    tableCustomStyles() {
      const styles = []

      // For Service view: add style for Category column
      if (!this.isViewByCategory) {
        styles.push({ halign: 'left' })
      }

      // Item name column is left-aligned
      styles.push({ halign: 'left' })

      // Month columns are right-aligned
      this.yearMonthList.forEach(() => {
        styles.push({ halign: 'right' })
      })
      return styles
    },

    excelTableRows() {
      if (!this.currentDataSource) return []

      return this.itemList.map(item => {
        const row = []

        // For Service view: add Category name first
        if (!this.isViewByCategory) {
          row.push(item.categoryName)
        }

        // Item name (Category or Service)
        row.push(item.name)

        // Month amounts
        this.currentDataSource.forEach(monthData => {
          const items = this.isViewByCategory ? monthData.categories : monthData.services

          if (!items) {
            row.push(formatMoney(0, 0))
            return
          }

          const found = items.find(i =>
            this.isViewByCategory ? i.categoryId === item.id : i.serviceId === item.id,
          )
          row.push(formatMoney(found?.amount || 0, 0))
        })

        return row
      })
    },
  },

  methods: {
    onViewTypeChange(newViewType) {
      this.viewType = newViewType
    },

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
@import './section-revenue-by-service.scss';
</style>
