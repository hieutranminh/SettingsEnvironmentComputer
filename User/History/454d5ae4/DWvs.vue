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
      ref="salesByDateChartRef"
      :data="items"
      :prepaidSalesCountingType="savedFilters?.prepaidSalesCountingType"
    />

    <!-- Table -->
    <SalesByDateTable
      ref="salesByDateTableRef"
      :data="items"
      :prepaidSalesCountingType="savedFilters?.prepaidSalesCountingType"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useSalesByDateReport } from '@/composables/report-by-branch/useSalesByDateReport'
import { useDateRange } from '@/composables/useDateRange'
// Constants
import { PREPAID_SALES_COUNTING_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { ISalesByDateFilterInterface } from '@/types/sales-report/SalesByDate'
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
const { savedFilters, items, fetchReport } = useSalesByDateReport()
const { openPrintPreview } = usePrintPreview()

// State
const filters = ref<ISalesByDateFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
})
const salesByDateChartRef = ref<InstanceType<typeof SalesByDateChart> | null>(null)
const salesByDateTableRef = ref<InstanceType<typeof SalesByDateTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRange(filters, { savedFilters })

const handlePrint = async (): Promise<void> => {
  const sections = []

  if (salesByDateChartRef.value) sections.push(salesByDateChartRef.value.getPrintConfiguration())
  if (salesByDateTableRef.value) sections.push(salesByDateTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await openPrintPreview(sections, {
    title: t('sales-by-date.title'),
    dateRange: dateRangeText.value,
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
  initializeWithDefaultRange()

  filters.value.shopId = Number(route.query?.branchShopId) || 0
  if (!filters.value.shopId) return

  fetchReport(filters.value)
})
</script>
