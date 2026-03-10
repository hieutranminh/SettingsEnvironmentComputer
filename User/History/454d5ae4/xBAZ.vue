<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useSalesByDateReport } from '@/composables/report-by-branch/useSalesByDateReport'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { PREPAID_SALES_COUNTING_TYPE, TIMEZONE_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { SalesByDateFilterInterface } from '@/types/sales-report/SalesByDateFilter'
// Utils
import { getCurrentDate, getEndOf, getStartOf, toUnixTimestamp, fromUnixTimestamp } from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import SalesByDateChart from './partials/SalesByDateChart.vue'
import SalesByDateFilter from './partials/SalesByDateFilter.vue'
import SalesByDateTable from './partials/SalesByDateTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useSalesByDateReport()
const { openPrintPreview } = usePrintPreview()

// State
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfDay = getEndOf(getCurrentDate(), 'day').toDate()
const filters = ref<SalesByDateFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  isHeadquarterView: true,
})
const salesByDateChartRef = ref<InstanceType<typeof SalesByDateChart> | null>(null)
const salesByDateTableRef = ref<InstanceType<typeof SalesByDateTable> | null>(null)

const dateMappedText = computed(() => {
  return `${formatDate(fromUnixTimestamp(filters.value.fromDateTs), { timezone: TIMEZONE_TYPE.UTC })} - ${formatDate(fromUnixTimestamp(filters.value.toDateTs), { timezone: TIMEZONE_TYPE.UTC })}`
})

const handlePrint = async (): Promise<void> => {
  const sections = []

  if (salesByDateChartRef.value) sections.push(salesByDateChartRef.value.getPrintConfiguration())
  if (salesByDateTableRef.value) sections.push(salesByDateTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await openPrintPreview(sections, {
    title: t('sales-by-date.title'),
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

<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-date.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <SalesByDateFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Chart -->
    <SalesByDateChart
      :data="items"
      :prepaidSalesCountingType="filterData?.prepaidSalesCountingType ?? PREPAID_SALES_COUNTING_TYPE.SOLD"
    />

    <!-- Table -->
    <SalesByDateTable ref="salesByDateTableRef" :data="items" />
  </template>
</template>
