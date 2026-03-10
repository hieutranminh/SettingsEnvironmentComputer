<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-month.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <SalesByMonthFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Chart -->
    <SalesByMonthChart
      ref="salesByMonthChartRef"
      :data="items"
      :prepaidSalesCountingType="filterData?.prepaidSalesCountingType ?? PREPAID_SALES_COUNTING_TYPE.SOLD"
    />

    <!-- Table -->
    <SalesByMonthTable ref="salesByMonthTableRef" :data="items" />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useSalesByMonthReport } from '@/composables/report-by-branch/useSalesByMonthReport'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { PREPAID_SALES_COUNTING_TYPE, TIMEZONE_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { SalesByMonthFilterInterface } from '@/types/sales-report/SalesByMonthFilter'
// Utils
import { getCurrentDate, getEndOf, getStartOf, toUnixTimestamp, fromUnixTimestamp } from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import SalesByMonthChart from './partials/SalesByMonthChart.vue'
import SalesByMonthFilter from './partials/SalesByMonthFilter.vue'
import SalesByMonthTable from './partials/SalesByMonthTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useSalesByMonthReport()
const printPreviewStore = usePrintPreviewStore()

// State
const MONTHS_TO_SUBTRACT = 8
const startOfMonth = getStartOf(getCurrentDate(), 'month').subtract(MONTHS_TO_SUBTRACT, 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<SalesByMonthFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  isHeadquarterView: true,
})
const salesByMonthChartRef = ref<InstanceType<typeof SalesByMonthChart> | null>(null)
const salesByMonthTableRef = ref<InstanceType<typeof SalesByMonthTable> | null>(null)

const dateMappedText = computed(() => {
  return `${formatDate(fromUnixTimestamp(filters.value.fromDateTs), { timezone: TIMEZONE_TYPE.UTC })} - ${formatDate(fromUnixTimestamp(filters.value.toDateTs), { timezone: TIMEZONE_TYPE.UTC })}`
})

const handlePrint = async (): Promise<void> => {
  const sections = []

  if (salesByMonthChartRef.value) sections.push(salesByMonthChartRef.value.getPrintConfiguration())
  if (salesByMonthTableRef.value) sections.push(salesByMonthTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('sales-by-month.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value

  fetchReport(filters.value)
}

const handleFiltersChanged = (): void => {
  fetchReport(filters.value)
}

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  if (!filters.value.shopId) return

  fetchReport(filters.value)
})
</script>
