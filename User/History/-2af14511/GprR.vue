<template>
  <main class="app-content">
    <section class="content report-staff-performance-analysis-page">
      <report-has-chart-wrapper
        :report-name="reportName"
        @print-report="onClickPrintReport"
      >
        <template #default="scope">
          <!-- Filter -->
          <div class="filter-wrapper">
            <report-staff-performance-analysis-filter
              @search="onSearch"
            />
          </div>

          <!-- Content -->
          <div class="content-wrapper">
            Staff Performance Analysis
          </div>

          <!-- Insights -->
          <div class="insights-wrapper">
            <report-insights
              @request-analysis="onRequestAnalysis"
            />
          </div>
        </template>
      </report-has-chart-wrapper>
    </section>

    <!-- Print Preview Modal -->
    <report-print-preview-modal
      :print_sections="printSections"
      :header_text="reportHeaderText"
      :modal_id="reportPrintPreviewModalId"
      use_export_excel_default
    />
  </main>
</template>

<script>
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ReportHasChartWrapper from 'Pages/report/report-has-chart-wrapper/report-has-chart-wrapper.vue'
import ReportPrintPreviewModal from 'CommonComponents/report-print-preview-modal/report-print-preview-modal.vue'
import ReportInsights from 'Modules/reports/report-insights/report-insights.vue'
import ReportStaffPerformanceAnalysisFilter from './partials/report-staff-performance-analysis-filter.vue'

export default {
  components: {
    ReportHasChartWrapper,
    ReportPrintPreviewModal,
    ReportInsights,
    ReportStaffPerformanceAnalysisFilter,
  },

  extends: ComponentBase,

  data() {
    return {
      reportPrintPreviewModalId: 'report-print-preview-modal',
    }
  },

  computed: {
    reportName() {
      return this.$t('report.staff-performance-analysis')
    },

    reportHeaderText() {
      return [
        this.reportName,
        new Date(),
      ]
    },

    printSections() {
      return []
    },
  },

  methods: {
    onClickPrintReport() {
      this.showDialogById(this.reportPrintPreviewModalId)
    },

    onSearch(filter) {
      console.log('onSearch', filter)
    },

    onRequestAnalysis() {
      console.log('onRequestAnalysis')
    },
  },
}
</script>

<style lang="scss">
@import './report-staff-performance-analysis.scss';
</style>
