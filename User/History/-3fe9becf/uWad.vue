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
      return 'insightsContent**[종합 진단]**  \n2025년 7월부터 12월까지 매출은 월별로 큰 변동성을 보이며, 8월과 10월에 상대적으로 높은 매출을 기록했습니다. 고객 수는 전반적으로 매우 적고 신규 고객 유입도 미미해 재방문 고객 확보에 어려움이 있습니다. 직원별 매출과 근무일 수를 고려하면, 일부 직원의 근무일 수가 적어 전체 업무량 대비 매출 기여도가 낮은 편입니다. 예약 취소 및 노쇼 비율이 12월에 급증해 운영 효율성에 부정적 영향을 미쳤습니다.\n\n**[핵심 요인 및 근본 원인]**  \n1. 매출 변동성은 고객 수가 적고 불규칙한 방문 패턴에서 기인합니다. 특히 8월과 10월에 매출이 집중된 것은 일부 고객과 직원 근무일이 몰린 결과로 보입니다.  \n2. 신규 고객 유입이 거의 없고, 재방문 고객도 극히 적어 고객 기반이 매우 취약합니다. 이는 장기적 매출 안정성에 부정적입니다.  \n3. 직원별 근무일 수가 월별로 크게 차이나며, 일부 직원은 한 달에 1~3일만 근무해 업무량 대비 매출 기여도가 낮습니다. 이는 인력 운영의 비효율성을 시사합니다.  \n4. 예약 취소 및 노쇼 비율이 12월에 14.8%로 급증해 예약 관리와 고객 신뢰도에 문제가 있음을 나타냅니다.  \n5. 서비스 믹스는 헤어 서비스가 주를 이루나, 예약 취소 수수료가 11월에 1,300만원 발생해 고객 이탈과 예약 불안정성을 반영합니다.\n\n**[운영 리스크 및 구조적 이슈]**  \n- 고객 수가 극히 적고 신규 유입이 거의 없어 매출 기반이 매우 취약하며, 이는 장기적 매장 안정성에 큰 리스크입니다.  \n- 직원 근무일 수가 불규칙하고 일부 직원의 근무일이 극히 적어 인력 운영의 구조적 불안정성이 존재합니다.  \n- 예약 취소 및 노쇼가 빈번해 예약 시스템과 고객 관리에 구조적 문제가 있으며, 이는 매출 손실과 고객 신뢰 저하로 이어집니다.\n\n**[전략적 제안 및 우선순위]**  \n1. **고객 확보 및 재방문 전략 강화**: 신규 고객 유입을 위한 마케팅과 재방문 유도를 위한 고객 관리 프로그램을 우선 도입해야 합니다.  \n2. **직원 근무 일정 최적화**: 근무일 수가 적은 직원들의 근무 일정을 조정해 업무 집중도를 높이고, 인력 운영의 효율성을 개선해야 합니다.  \n3. **예약 관리 시스템 개선**: 예약 취소 및 노쇼를 줄이기 위한 사전 알림, 페널티 정책 강화 등 예약 관리 프로세스를 개선해야 합니다.  \n4. **서비스 믹스 재검토**: 예약 취소 수수료 발생 원인을 분석해 서비스 품질과 고객 만족도를 높이는 방향으로 서비스 구성을 조정해야 합니다.  \n5. **매출 변동성 완화**: 매출이 집중되는 특정 월에 집중된 프로모션을 분산시키고, 안정적인 매출 흐름을 만들기 위한 장기 계획을 수립해야 합니다.  \n6. 위 조치들은 고객 기반 안정화와 인력 운영 효율성 개선에 중점을 두어, 매출과 운영 안정성을 동시에 확보하는 데 우선순위를 두어야 합니다.'
      // return this.reportDataInsights?.output ?? ''
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
