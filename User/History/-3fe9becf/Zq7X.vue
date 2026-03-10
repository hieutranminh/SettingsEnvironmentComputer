<template>
  <main class="app-content">
    <section class="content report-operational-trend-analysis-page">
      <report-has-chart-wrapper
        :report-name="reportName"
        @print-report="onClickPrintReport"
      >
        <template #default="scope">
          <!-- Filter -->
          <div class="filter-wrapper">
            <report-operational-trend-analysis-filter
              @init="onFilterInit"
              @search="onSearch"
            />
          </div>

          <!-- Content -->
          <div class="content-wrapper">
            <!-- Overall Revenue -->
            <section-overall-revenue
              ref="sectionOverallRevenue"
              :section-data="overallRevenueData"
              :ai-summary="aiSummaryOverallRevenue"
              :hide-display-item="hideChartDisplayItem"
            />

            <!-- Number of Clients -->
            <section-number-of-clients
              ref="sectionNumberOfClients"
              :section-data="numberOfClientsData"
              :ai-summary="aiSummaryNumberOfClients"
              :hide-display-item="hideChartDisplayItem"
            />

            <!-- Revenue by Staff -->
            <section-revenue-by-staff
              ref="sectionRevenueByStaff"
              :section-data="revenueByStaffData"
              :ai-summary="aiSummaryRevenueByStaff"
              :hide-display-item="hideChartDisplayItem"
            />

            <!-- Revenue by Service -->
            <section-revenue-by-service
              ref="sectionRevenueByService"
              :section-data="revenueByServiceData"
              :ai-summary="aiSummaryRevenueByService"
              :hide-display-item="hideChartDisplayItem"
            />

            <!-- Booking -->
            <section-booking ref="sectionBooking" />
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
      @hide="onPrintPreviewModalHide"
    />
  </main>
</template>

<script>
// Vuex
import { mapGetters, mapActions } from 'vuex'
// Utils
import { formatDateLocalized } from 'CommonHelpers'
// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ReportHasChartWrapper from 'Pages/report/report-has-chart-wrapper/report-has-chart-wrapper.vue'
import ReportPrintPreviewModal from 'CommonComponents/report-print-preview-modal/report-print-preview-modal.vue'
import ReportInsights from 'Modules/reports/report-insights/report-insights.vue'
import ReportOperationalTrendAnalysisFilter from './partials/report-operational-trend-analysis-filter.vue'
import SectionOverallRevenue from './partials/section-overall-revenue/section-overall-revenue.vue'
import SectionNumberOfClients from './partials/section-number-of-clients/section-number-of-clients.vue'
import SectionRevenueByService from './partials/section-revenue-by-service/section-revenue-by-service.vue'
import SectionRevenueByStaff from './partials/section-revenue-by-staff/section-revenue-by-staff.vue'
import SectionBooking from './partials/section-booking/section-booking.vue'
// API
import { getOperationalTrendAnalysisReportSaleWithAISetup } from 'Modules/api/sales/sales-api.js'

export default {
  components: {
    ReportHasChartWrapper,
    ReportPrintPreviewModal,
    ReportInsights,
    ReportOperationalTrendAnalysisFilter,
    SectionOverallRevenue,
    SectionNumberOfClients,
    SectionRevenueByService,
    SectionRevenueByStaff,
    SectionBooking,
  },

  extends: ComponentBase,

  data() {
    return {
      reportPrintPreviewModalId: 'report-print-preview-modal',
      reportDataSales:           null,
      printFilter:               {
        fromDateTs: 0,
        toDateTs:   0,
      },
      isSectionRefsReady:   false,
      hideChartDisplayItem: false,
    }
  },

  computed: {
    ...mapGetters('shop', ['getShopInfoAction']),

    reportName() {
      return this.$t('report.operational-trend-analysis')
    },

    dateFilterPrintText() {
      return `(${formatDateLocalized(this.printFilter.fromDateTs, this.app_language)} - ${formatDateLocalized(this.printFilter.toDateTs, this.app_language)})`
    },

    reportHeaderText() {
      return [
        this.reportName,
        this.dateFilterPrintText,
      ]
    },

    printSections() {
      // Reactive flag to ensure computed re-evaluates after refs are ready
      if (!this.isSectionRefsReady) return []

      // Delegate to child components - each section knows how to prepare its print data
      const sections = []

      // Overall Revenue Section
      if (this.$refs.sectionOverallRevenue?.getPrintSections) {
        sections.push(...this.$refs.sectionOverallRevenue.getPrintSections())
      }

      if (this.$refs.sectionNumberOfClients?.getPrintSections) {
        sections.push(...this.$refs.sectionNumberOfClients.getPrintSections())
      }

      if (this.$refs.sectionRevenueByStaff?.getPrintSections) {
        sections.push(...this.$refs.sectionRevenueByStaff.getPrintSections())
      }

      if (this.$refs.sectionRevenueByService?.getPrintSections) {
        sections.push(...this.$refs.sectionRevenueByService.getPrintSections())
      }

      return sections
    },

    // Section Data
    overallRevenueData() {
      return this.reportDataSales?.overallRevenue ?? null
    },

    numberOfClientsData() {
      return this.reportDataSales?.numberOfClients ?? null
    },

    revenueByStaffData() {
      return this.reportDataSales?.revenueByStaff ?? null
    },

    revenueByServiceData() {
      return this.reportDataSales?.revenueByService ?? null
    },

    // AI Output Parsed
    parsedAiOutput() {
      if (!this.reportDataSales?.aiOutput) {
        return null
      }
      try {
        return JSON.parse(this.reportDataSales.aiOutput)
      } catch (error) {
        return null
      }
    },

    // AI Summaries by Section
    aiSummaryOverallRevenue() {
      // If has data but no overall_revenue section, show error message
      if (this.overallRevenueData && !this.hasAiSection('overall_revenue')) {
        return [this.$t('report.ai-analysis-failed')]
      }
      return this.getAiSummaryBySection('overall_revenue')
    },

    aiSummaryNumberOfClients() {
      // If has data but no client_trends section, show error message
      if (this.numberOfClientsData && !this.hasAiSection('client_trends')) {
        return [this.$t('report.ai-analysis-failed')]
      }
      return this.getAiSummaryBySection('client_trends')
    },

    aiSummaryRevenueByStaff() {
      // If has data but no staff_performance section, show error message
      if (this.revenueByStaffData && !this.hasAiSection('staff_performance')) {
        return [this.$t('report.ai-analysis-failed')]
      }
      return this.getAiSummaryBySection('staff_performance')
    },

    aiSummaryRevenueByService() {
      // If has data but no service_mix section, show error message
      if (this.revenueByServiceData && !this.hasAiSection('service_mix')) {
        return [this.$t('report.ai-analysis-failed')]
      }
      return this.getAiSummaryBySection('service_mix')
    },
  },

  methods: {
    ...mapActions('shop', ['setShopInfoActionDataAsync']),

    getAiSummaryBySection(sectionKey) {
      if (!this.parsedAiOutput?.sections) {
        return []
      }
      const section = this.parsedAiOutput.sections.find(item => item.section === sectionKey)
      return section?.summary ?? []
    },

    hasAiSection(sectionKey) {
      if (!this.parsedAiOutput?.sections) {
        return false
      }
      return this.parsedAiOutput.sections.some(item => item.section === sectionKey)
    },

    onClickPrintReport() {
      this.hideChartDisplayItem = true
      this.showDialogById(this.reportPrintPreviewModalId)
    },

    onPrintPreviewModalHide() {
      this.hideChartDisplayItem = false
    },

    async onFilterInit(filter) {
      this.printFilter = filter
      await this.fetchShopInfo()
      await this.fetchReportDataSales(filter)
    },

    async onSearch(filter) {
      const isSuccess = await this.fetchReportDataSales(filter)
      if (isSuccess) {
        this.printFilter = filter
      }
    },

    async fetchShopInfo() {
      try {
        this.preLoader()
        await this.setShopInfoActionDataAsync({
          shop_id: this.shop_data.shop_id,
        })

        if(!this.getShopInfoAction.is_ok) {
          this._showDialogAlert(this.getShopInfoAction.error_messages)
          return
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async fetchReportDataSales(filter) {
      try {
        this.preLoader()

        const payload = {
          shopId:           this.shop_data.shop_id,
          businessTypeName: this.getShopInfoAction.data.business_type_name,
          fromDateTS:       filter.fromDateTs,
          toDateTS:         filter.toDateTs,
        }

        const response = await getOperationalTrendAnalysisReportSaleWithAISetup(payload)

        if(!response.data.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return false
        }

        this.reportDataSales = response.data.result

        // Set flag after DOM updates to enable printSections computed
        this.$nextTick(() => {
          this.isSectionRefsReady = true
        })

        return true
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      } finally {
        this.preLoader(false)
      }
    },

    onRequestAnalysis() {
      console.log('onRequestAnalysis')
    },
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis.scss';
</style>
