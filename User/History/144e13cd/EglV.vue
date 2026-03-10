<template>
  <main class="app-content">
    <section class="content report-comprehensive-analysis-page">
      <report-has-chart-wrapper
        :report-name="reportName"
        @print-report="onClickPrintReport"
      >
        <template #default="scope">
          <div class="filter-wrapper">
            <!-- Filter -->
            Filter

            <!-- Body -->
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

export default {
  components: {
    ReportHasChartWrapper,
    ReportPrintPreviewModal,
  },

  extends: ComponentBase,

  data() {
    return {
      reportPrintPreviewModalId: 'report-print-preview-modal',
    }
  },

  computed: {
    reportName() {
      return this.$t('report.comprehensive-analysis')
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
  },
}
</script>

<style lang="scss">
@import './report-comprehensive-analysis.scss';
</style>
