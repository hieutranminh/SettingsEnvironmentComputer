<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-item.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ServiceSalesByItemFilter
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
        <ServiceSalesByItemChart
          ref="serviceSalesByItemChartRef"
          :data="items"
          :chartDisplayType="chartDisplayType"
          :chartDisplayValue="chartDisplayValue"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ServiceSalesByItemTable ref="serviceSalesByItemTableRef" :data="items" />

        <ServiceSalesByItemNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesByItemReport } from '@/composables/report-by-branch/useServiceSalesByItemReport'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  REPORT_BY_TYPE,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreview } from '@/composables/print'
// Types
import type { IServiceSalesByItemFilterInterface } from '@/types/sales-report/ServiceSalesByItem'
import type { ChartDisplayType, ChartDisplayValue } from '@/constants'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'
import ServiceSalesByItemChart from './partials/ServiceSalesByItemChart.vue'
import ServiceSalesByItemFilter from './partials/ServiceSalesByItemFilter.vue'
import ServiceSalesByItemNote from './partials/ServiceSalesByItemNote.vue'
import ServiceSalesByItemTable from './partials/ServiceSalesByItemTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, fetchReport } = useServiceSalesByItemReport()
const { openPrintPreview } = usePrintPreview()

// State
const chartDisplayType = ref<ChartDisplayType>(CHART_DISPLAY_TYPE.BAR)
const chartDisplayValue = ref<ChartDisplayValue>(CHART_DISPLAY_VALUE.AMOUNT)
const filters = ref<IServiceSalesByItemFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
  reportByType: REPORT_BY_TYPE.STAFF,
  categoryId: FILTER_VALUES.ALL,
  serviceId: FILTER_VALUES.ALL,
})
const serviceSalesByItemChartRef = ref<InstanceType<typeof ServiceSalesByItemChart> | null>(null)
const serviceSalesByItemTableRef = ref<InstanceType<typeof ServiceSalesByItemTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
})

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (serviceSalesByItemChartRef.value)
    sections.push(serviceSalesByItemChartRef.value.getPrintConfiguration())
  if (serviceSalesByItemTableRef.value)
    sections.push(serviceSalesByItemTableRef.value.getPrintConfiguration())
  if (!sections.length) return
  await openPrintPreview(sections, {
    title: t('service-sales-by-item.title'),
    dateRange: `(${dateRangeText.value})`,
  })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL

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
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL

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
