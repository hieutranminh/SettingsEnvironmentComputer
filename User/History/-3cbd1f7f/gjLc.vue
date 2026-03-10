<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-month.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ServiceSalesByMonthFilter v-model="filters" @filtersChanged="handleFiltersChanged" />
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
import { PREPAID_SALES_COUNTING_TYPE, TIMEZONE_TYPE, FILTER_VALUES } from '@/constants'
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

  fetchReport(filters.value)
}

/**
 * Handles filter change event
 * Fetches new report data with updated filters
 */
const handleFiltersChanged = (): void => {
  fetchReport(filters.value)
}

// onMounted(() => {
//   filters.value.shopId = Number(route.query?.branchShopId) || 0
//   if (!filters.value.shopId) return

//   fetchReport(filters.value)
// })
</script>
