<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-repeat-clients.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <SalesByRepeatClientsFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Table -->
    <SalesByRepeatClientsTable ref="salesByRepeatClientsTableRef" :data="items" />

    <!-- Note -->
    <SalesByRepeatClientsNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useSalesByRepeatClientsReport } from '@/composables/report-by-branch/useSalesByRepeatClients'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import { TIMEZONE_TYPE, DATE_TYPE, FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { SalesByRepeatClientsFilterInterface } from '@/types/client-report/SalesByRepeatClients'
// Date utilities are now handled by useDateRangeFilter composable

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import SalesByRepeatClientsFilter from './partials/SalesByRepeatClientsFilter.vue'
import SalesByRepeatClientsNote from './partials/SalesByRepeatClientsNote.vue'
import SalesByRepeatClientsTable from './partials/SalesByRepeatClientsTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const printPreviewStore = usePrintPreviewStore()
const { filterData, items, fetchReport } = useSalesByRepeatClientsReport()

// State
const filters = ref<SalesByRepeatClientsFilterInterface>({
  dateType: DATE_TYPE.MONTH,
  fromDateTs: 0, // Will be initialized by useDateRangeFilter
  toDateTs: 0, // Will be initialized by useDateRangeFilter
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  staffId: FILTER_VALUES.ALL,
  reportByType: 0,
})

// Component refs
const salesByRepeatClientsTableRef = ref<InstanceType<typeof SalesByRepeatClientsTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
})

// Use the date range text from the composable instead of custom logic
const dateMappedText = dateRangeText

// Date range logic is now handled by useDateRangeFilter composable

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (salesByRepeatClientsTableRef.value) sections.push(salesByRepeatClientsTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('sales-by-repeat-clients.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

const handleFiltersChanged = (): void => {
  handleFetchReport()
}

const handleFetchReport = (): void => {
  if (!filters.value.shopId) return
  fetchReport(filters.value)
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = async (value: number): Promise<void> => {
  filters.value.shopId = value
  handleFetchReport()
}

// Date type change watching is now handled by useDateRangeFilter composable

onMounted(async () => {
  // Initialize date range with default values
  initializeWithDefaultRange()
  
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  handleFetchReport()
})
</script>
