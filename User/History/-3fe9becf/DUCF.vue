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

      if (this.$refs.sectionBooking?.getPrintSections) {
        sections.push(...this.$refs.sectionBooking.getPrintSections())
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

    // AI Summaries by Section
    aiSummaryOverallRevenue() {
      return this.getAiSummaryWithFallback(this.parsedAiOutputSales, 'overall_revenue', this.overallRevenueData)
    },

    aiSummaryNumberOfClients() {
      return this.getAiSummaryWithFallback(this.parsedAiOutputSales, 'client_trends', this.numberOfClientsData)
    },

    aiSummaryRevenueByStaff() {
      return this.getAiSummaryWithFallback(this.parsedAiOutputSales, 'staff_performance', this.revenueByStaffData)
    },

    aiSummaryRevenueByService() {
      return this.getAiSummaryWithFallback(this.parsedAiOutputSales, 'service_mix', this.revenueByServiceData)
    },

    aiSummaryBooking() {
      return this.getAiSummaryWithFallback(this.parsedAiOutputBooking, 'booking_efficiency', this.bookingData)
    },
  },

  methods: {
    ...mapActions('shop', ['setShopInfoActionDataAsync']),

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

    getAiSummaryWithFallback(parsedOutput, sectionKey, sectionData) {
      if (sectionData && !this.hasAiSection(parsedOutput, sectionKey)) {
        return [this.$t('report.ai-analysis-failed')]
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
      this.printFilter = filter
      await this.fetchShopInfo()
      await this.fetchReportData(filter)
    },

    async onSearch(filter) {
      const isSuccess = await this.fetchReportData(filter)
      if (isSuccess) {
        this.printFilter = filter
      }
    },

    async fetchReportData(filter) {
      try {
        this.preLoader()

        const [salesSuccess, bookingSuccess, insightsSuccess] = await Promise.all([
          this.fetchReportDataSales(filter),
          this.fetchReportDataBooking(filter),
          this.fetchReportDataInsights(filter),
        ])

        return salesSuccess && bookingSuccess && insightsSuccess
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      } finally {
        this.preLoader(false)
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
        const payload = {
          shopId:           this.shop_data.shop_id,
          businessTypeName: this.getShopInfoAction.data.business_type_name,
          fromDateTS:       filter.fromDateTs,
          toDateTS:         filter.toDateTs,
          language:         this.x_user.language === options.language.english ? 0 : 1,
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
      }
    },

    async fetchReportDataBooking(filter) {
      try {
        const payload = {
          shopId:           this.shop_data.shop_id,
          businessTypeName: this.getShopInfoAction.data.business_type_name,
          fromDateTS:       filter.fromDateTs,
          toDateTS:         filter.toDateTs,
          language:         this.x_user.language === options.language.english ? 0 : 1,
        }

        const response = await getOperationalTrendAnalysisReportBookingWithAISetup(payload)

        if(!response.data.isOK) {
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
          shopId:           this.shop_data.shop_id,
          businessTypeName: this.getShopInfoAction.data.business_type_name,
          businessTypeCode: this.shop_data.business_type_code,
          fromDateTS:       filter.fromDateTs,
          toDateTS:         filter.toDateTs,
          language:         this.x_user.language === options.language.english ? 0 : 1,
          isRegenerate:     insightsOptions?.isRegenerate ?? false,
          overallRevenue:   insightsOptions?.overallRevenue ?? null,
          numberOfClients:  insightsOptions?.numberOfClients ?? null,
          revenueByStaff:   insightsOptions?.revenueByStaff ?? null,
          revenueByService: insightsOptions?.revenueByService ?? null,
          booking:          insightsOptions?.booking ?? null,
        }

        const response = await getOperationalTrendAnalysisReportInsights(payload)

        if(!response.data.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return false
        }

        this.reportDataInsights = response.data.result
        console.log('this.reportDataInsights', this.reportDataInsights)

        return true
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      }
    },

    async onRequestAnalysis() {
      try {
        this.preLoader()

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
      }
    },
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis.scss';
</style>
