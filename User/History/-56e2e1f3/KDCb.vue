<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ServiceSalesFilter
      v-model="filters"
      :chartDisplayType="chartDisplayType"
      :chartDisplayValue="chartDisplayValue"
      @chartDisplayTypeChanged="chartDisplayType = $event"
      @chartDisplayValueChanged="chartDisplayValue = $event"
      @filtersChanged="handleFiltersChanged"
    />

    <div class="section-container">
      <!-- Chart -->
      <div class="section-left">
        <ServiceSalesChart
          ref="serviceSalesChartRef"
          :data="items"
          :chartDisplayType="chartDisplayType"
          :chartDisplayValue="chartDisplayValue"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ServiceSalesTable ref="serviceSalesTableRef" :data="items" :reportByType="reportByType" />

        <ServiceSalesNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesReport } from '@/composables/report-by-branch/useServiceSalesReport'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  REPORT_BY_TYPE,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreview } from '@/composables/print'
// Types
import type { IServiceSalesFilterInterface } from '@/types/sales-report/ServiceSales'
import type { ChartDisplayType, ChartDisplayValue } from '@/constants'
// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ServiceSalesChart from './partials/ServiceSalesChart.vue'
import ServiceSalesFilter from './partials/ServiceSalesFilter.vue'
import ServiceSalesNote from './partials/ServiceSalesNote.vue'
import ServiceSalesTable from './partials/ServiceSalesTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { savedFilters, items, reportByType, fetchReport } = useServiceSalesReport()
const { openPrintPreview } = usePrintPreview()

// State
const chartDisplayType = ref<ChartDisplayType>(CHART_DISPLAY_TYPE.BAR)
const chartDisplayValue = ref<ChartDisplayValue>(CHART_DISPLAY_VALUE.AMOUNT)
const filters = ref<IServiceSalesFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
  reportByType: REPORT_BY_TYPE.STAFF,
  staffId: FILTER_VALUES.ALL,
})
const serviceSalesChartRef = ref<InstanceType<typeof ServiceSalesChart> | null>(null)
const serviceSalesTableRef = ref<InstanceType<typeof ServiceSalesTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
  savedFilters,
})

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (serviceSalesChartRef.value) sections.push(serviceSalesChartRef.value.getPrintConfiguration())
  if (serviceSalesTableRef.value) sections.push(serviceSalesTableRef.value.getPrintConfiguration())
  if (!sections.length) return
  await openPrintPreview(sections, {
    title: t('service-sales.title'),
    dateRange: `(${dateRangeText.value})`,
  })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value
  filters.value.staffId = FILTER_VALUES.ALL

  handleFetchReport()
}

const handleFiltersChanged = (): void => {
  handleFetchReport()
}

const handleFetchReport = (): void => {
  if (!filters.value.shopId) return
  fetchReport(filters.value)
}

onMounted(() => {
  // Initialize date range with default values
  initializeWithDefaultRange()

  filters.value.shopId = Number(route.query?.branchShopId) || 0
  filters.value.staffId = FILTER_VALUES.ALL

  handleFetchReport()
})
</script>

<style lang="scss" scoped>
.section-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(ipadLandscape) {
    flex-direction: column;
  }

  .section-left {
    width: 50%;

    @include maxResponsive(ipadLandscape) {
      width: 100%;
    }
  }

  .section-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include maxResponsive(ipadLandscape) {
      width: 100%;
    }
  }
}
</style>
