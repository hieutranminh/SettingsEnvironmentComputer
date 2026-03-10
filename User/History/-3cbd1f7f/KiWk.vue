<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-month.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <pre>{{ filters }}</pre>
    <!-- Filter -->
    <ServiceSalesByMonthFilter
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
        <ServiceSalesByMonthChart
          ref="serviceSalesByMonthChartRef"
          :data="items"
          :prepaidSalesCountingType="filterData?.prepaidSalesCountingType ?? PREPAID_SALES_COUNTING_TYPE.SOLD"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ServiceSalesByMonthTable ref="serviceSalesByMonthTableRef" :data="items" />

        <ServiceSalesByMonthNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesByMonthReport } from '@/composables/report-by-branch/useServiceSalesByMonthReport'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import {
  PREPAID_SALES_COUNTING_TYPE,
  TIMEZONE_TYPE,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  FILTER_VALUES,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ServiceSalesByMonthFilterInterface } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { getCurrentDate, getEndOf, getStartOf, toUnixTimestamp, fromUnixTimestamp } from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ServiceSalesByMonthChart from './partials/ServiceSalesByMonthChart.vue'
import ServiceSalesByMonthFilter from './partials/ServiceSalesByMonthFilter.vue'
import ServiceSalesByMonthNote from './partials/ServiceSalesByMonthNote.vue'
import ServiceSalesByMonthTable from './partials/ServiceSalesByMonthTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useServiceSalesByMonthReport()
const printPreviewStore = usePrintPreviewStore()

// State
const MONTHS_TO_SUBTRACT = 8
const startOfMonth = getStartOf(getCurrentDate(), 'month').subtract(MONTHS_TO_SUBTRACT, 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<ServiceSalesByMonthFilterInterface>({
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  categoryId: FILTER_VALUES.ALL,
  serviceId: FILTER_VALUES.ALL,
  staffId: FILTER_VALUES.ALL,
})
const chartDisplayType = ref<string>(CHART_DISPLAY_TYPE.BAR)
const chartDisplayValue = ref<number>(CHART_DISPLAY_VALUE.AMOUNT)
const serviceSalesByMonthChartRef = ref<InstanceType<typeof ServiceSalesByMonthChart> | null>(null)
const serviceSalesByMonthTableRef = ref<InstanceType<typeof ServiceSalesByMonthTable> | null>(null)

/**
 * Computed property for formatted date range text
 * Used in print preview and display purposes
 * @returns Formatted date range string
 */
const dateMappedText = computed(() => {
  return `${formatDate(fromUnixTimestamp(filters.value.fromDateTs), { timezone: TIMEZONE_TYPE.UTC })} - ${formatDate(fromUnixTimestamp(filters.value.toDateTs), { timezone: TIMEZONE_TYPE.UTC })}`
})

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (serviceSalesByMonthChartRef.value) sections.push(serviceSalesByMonthChartRef.value.getPrintConfiguration())
  if (serviceSalesByMonthTableRef.value) sections.push(serviceSalesByMonthTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('service-sales-by-month.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL
  filters.value.staffId = FILTER_VALUES.ALL

  handleFetchReport()
}

/**
 * Handles filter change event
 * Fetches new report data with updated filters
 */
const handleFiltersChanged = (): void => {
  handleFetchReport()
}

const handleFetchReport = (): void => {
  if (!filters.value.shopId) return
  fetchReport(filters.value)
}

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL
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
