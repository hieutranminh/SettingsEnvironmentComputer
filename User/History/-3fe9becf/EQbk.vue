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
            <section-booking
              ref="sectionBooking"
              :section-data="bookingData"
              :ai-summary="aiSummaryBooking"
            />
          </div>

          <!-- Insights -->
          <div class="insights-wrapper">
            <report-insights
              ref="sectionInsights"
              :insights-content="insightsContent"
              :hide-actions="hideChartDisplayItem"
              :is-loading="isLoadingInsights"
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
import { getOperationalTrendAnalysisReportBookingWithAISetup } from 'Modules/api/booking/booking-api.js'
import { getOperationalTrendAnalysisReportInsights } from 'Modules/api/aha-ai/aha-ai-api.js'
import { options } from 'OptionsHelpers'

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
      reportDataBooking:         null,
      reportDataInsights:        null,
      printFilter:               {
        fromDateTs: 0,
        toDateTs:   0,
      },
      isSectionRefsReady:   false,
      hideChartDisplayItem: false,
      isLoadingInsights:    false,
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

      const sectionRefs = [
        this.$refs.sectionOverallRevenue,
        this.$refs.sectionNumberOfClients,
        this.$refs.sectionRevenueByStaff,
        this.$refs.sectionRevenueByService,
        this.$refs.sectionBooking,
        this.$refs.sectionInsights,
      ]

      return sectionRefs
        .filter(ref => ref?.getPrintSections)
        .flatMap(ref => ref.getPrintSections())
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

    bookingData() {
      return this.reportDataBooking?.booking ?? null
    },

    // AI Output Parsed for Sales
    parsedAiOutputSales() {
      return this.parseAiOutput(this.reportDataSales?.aiOutput)
    },

    // AI Output Parsed for Booking
    parsedAiOutputBooking() {
      return this.parseAiOutput(this.reportDataBooking?.aiOutput)
    },

    // AI Context for Sales sections
    salesAiContext() {
      return {
        parsedOutput:     this.parsedAiOutputSales,
        isFailedGenerate: this.reportDataSales?.isFailedGenerate,
        rawAiOutput:      this.reportDataSales?.aiOutput,
      }
    },

    // AI Context for Booking section
    bookingAiContext() {
      return {
        parsedOutput:     this.parsedAiOutputBooking,
        isFailedGenerate: this.reportDataBooking?.isFailedGenerate,
        rawAiOutput:      this.reportDataBooking?.aiOutput,
      }
    },

    // AI Summaries by Section
    aiSummaryOverallRevenue() {
      return this.getAiSummaryWithFallback({
        ...this.salesAiContext,
        sectionKey:  'overall_revenue',
        sectionData: this.overallRevenueData,
      })
    },

    aiSummaryNumberOfClients() {
      return this.getAiSummaryWithFallback({
        ...this.salesAiContext,
        sectionKey:  'client_trends',
        sectionData: this.numberOfClientsData,
      })
    },

    aiSummaryRevenueByStaff() {
      return this.getAiSummaryWithFallback({
        ...this.salesAiContext,
        sectionKey:  'staff_performance',
        sectionData: this.revenueByStaffData,
      })
    },

    aiSummaryRevenueByService() {
      return this.getAiSummaryWithFallback({
        ...this.salesAiContext,
        sectionKey:  'service_mix',
        sectionData: this.revenueByServiceData,
      })
    },

    aiSummaryBooking() {
      return this.getAiSummaryWithFallback({
        ...this.bookingAiContext,
        sectionKey:  'booking_efficiency',
        sectionData: this.bookingData,
      })
    },

    // Insights
    insightsContent() {
      return this.reportDataInsights?.output ?? ''
    },
  },

  methods: {
    ...mapActions('shop', ['setShopInfoActionDataAsync']),

    // Build base payload for API requests
    buildBasePayload(filter) {
      return {
        shopId:           this.shop_data.shop_id,
        businessTypeName: this.getShopInfoAction.data.business_type_name,
        fromDateTS:       filter.fromDateTs,
        toDateTS:         filter.toDateTs,
        language:         this.x_user.language === options.language.english ? 0 : 1,
      }
    },

    // Generic AI helper methods
    parseAiOutput(aiOutputString) {
      if (!aiOutputString) return null
      try {
        return JSON.parse(aiOutputString)
      } catch (error) {
        return null
      }
    },

    getAiSummaryBySection(parsedOutput, sectionKey) {
      if (!parsedOutput?.sections) return []
      const section = parsedOutput.sections.find(item => item.section === sectionKey)
      return section?.summary ?? []
    },

    hasAiSection(parsedOutput, sectionKey) {
      if (!parsedOutput?.sections) return false
      return parsedOutput.sections.some(item => item.section === sectionKey)
    },

    getAiSummaryWithFallback({ parsedOutput, sectionKey, sectionData, isFailedGenerate, rawAiOutput }) {
      // If AI generation explicitly failed, show error message
      if (isFailedGenerate) {
        return [this.$t('report.ai-analysis-failed')]
      }

      // If aiOutput is null (not failed, just no data), hide the summary
      if (rawAiOutput === null) {
        return []
      }

      // If section data exists but no AI section found in output, hide the summary
      if (sectionData && !this.hasAiSection(parsedOutput, sectionKey)) {
        return []
      }

      return this.getAiSummaryBySection(parsedOutput, sectionKey)
    },

    onClickPrintReport() {
      this.hideChartDisplayItem = true
      this.showDialogById(this.reportPrintPreviewModalId)
    },

    onPrintPreviewModalHide() {
      this.hideChartDisplayItem = false
    },

    async onFilterInit(filter) {
      try {
        this.preLoader()
        this.printFilter = filter
        // Ensure shop info is ready before fetching report data
        await this.fetchShopInfo()
        await this.fetchReportData(filter)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onSearch(filter) {
      try {
        this.preLoader()
        const isSuccess = await this.fetchReportData(filter)
        if (isSuccess) {
          this.printFilter = filter
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async fetchReportData(filter) {
      const [salesSuccess, bookingSuccess, insightsSuccess] = await Promise.all([
        this.fetchReportDataSales(filter),
        this.fetchReportDataBooking(filter),
        this.fetchReportDataInsights(filter),
      ])

      return salesSuccess && bookingSuccess && insightsSuccess
    },

    async fetchShopInfo() {
      // Skip if already fetched
      if (this.getShopInfoAction?.data?.business_type_name) return

      await this.setShopInfoActionDataAsync({
        shop_id: this.shop_data.shop_id,
      })

      if (!this.getShopInfoAction.is_ok) {
        throw new Error(this.getShopInfoAction.error_messages)
      }
    },

    async fetchReportDataSales(filter) {
      try {
        const response = await getOperationalTrendAnalysisReportSaleWithAISetup(this.buildBasePayload(filter))

        if (!response.data.isOK) {
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
      }
    },

    async fetchReportDataBooking(filter) {
      try {
        const response = await getOperationalTrendAnalysisReportBookingWithAISetup(this.buildBasePayload(filter))

        if (!response.data.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return false
        }

        this.reportDataBooking = response.data.result
        return true
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      }
    },

    async fetchReportDataInsights(filter, insightsOptions) {
      try {
        const payload = {
          ...this.buildBasePayload(filter),
          businessTypeCode: this.shop_data.business_type_code,
          isRegenerate:     insightsOptions?.isRegenerate ?? false,
          overallRevenue:   insightsOptions?.overallRevenue ?? null,
          numberOfClients:  insightsOptions?.numberOfClients ?? null,
          revenueByStaff:   insightsOptions?.revenueByStaff ?? null,
          revenueByService: insightsOptions?.revenueByService ?? null,
          booking:          insightsOptions?.booking ?? null,
        }

        const response = await getOperationalTrendAnalysisReportInsights(payload)

        if (!response.data.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return false
        }

        this.reportDataInsights = response.data.result
        return true
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      }
    },

    async onRequestAnalysis() {
      try {
        this.preLoader()
        this.isLoadingInsights = true

        const insightsOptions = {
          isRegenerate:     true,
          overallRevenue:   this.reportDataSales?.overallRevenue ?? null,
          numberOfClients:  this.reportDataSales?.numberOfClients ?? null,
          revenueByStaff:   this.reportDataSales?.revenueByStaff ?? null,
          revenueByService: this.reportDataSales?.revenueByService ?? null,
          booking:          this.reportDataBooking?.booking ?? null,
        }

        await this.fetchReportDataInsights(this.printFilter, insightsOptions)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
        this.isLoadingInsights = false
      }
    },
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis.scss';
</style>
