<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-period.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ClientsByTypeFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <ClientsByTypeTable ref="clientsByTypeTableRef" :clientSummary="clientSummary" :memberSummary="memberSummary" />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useClientsByPeriodReport } from '@/composables/report-by-branch/useClientsByTypeReport'
// Constants
import { REPORT_BY_TYPE_IN_CLIENTS_BY_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { ClientsByTypeFilterInterface } from '@/types/client-report/ClientsByType'
// Date utilities are now handled by useDateRangeFilter composable

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ClientsByTypeFilter from './partials/ClientsByTypeFilter.vue'
import ClientsByTypeTable from './partials/ClientsByTypeTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, fetchReport } = useClientsByTypeReport()
const { openPrintPreview } = usePrintPreview()

// State
const filters = ref<ClientsByTypeFilterInterface>({
  shopId: 0,
  chainId: shop.chainId,
  headquarterShopId: shop.shopId,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
})
const clientsByTypeTableRef = ref<InstanceType<typeof ClientsByTypeTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
})

// Date range logic is now handled by useDateRangeFilter composable
const handlePrint = async (): Promise<void> => {
  const sections = []
  if (!sections.length) return
  await openPrintPreview(sections, {
    title: t('clients-by-period.title'),
    dateRange: `(${dateRangeText.value})`,
  })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value

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

  handleFetchReport()
})
</script>
