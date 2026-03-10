<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-period.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ClientsByPeriodFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <ClientsByPeriodTable
      ref="clientsByPeriodTableRef"
      :itemClientSummary="itemClientSummary"
      :itemMemberSummary="itemMemberSummary"
    />

    <ClientsByPeriodNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useClientsByPeriodReport } from '@/composables/report-by-branch/useClientsByPeriodReport'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import { TIMEZONE_TYPE, DATE_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { ClientsByPeriodFilterInterface } from '@/types/client-report/ClientsByPeriod'
// Date utilities are now handled by useDateRangeFilter composable

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ClientsByPeriodFilter from './partials/ClientsByPeriodFilter.vue'
import ClientsByPeriodNote from './partials/ClientsByPeriodNote.vue'
import ClientsByPeriodTable from './partials/ClientsByPeriodTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { itemMemberSummary, itemClientSummary, fetchReport } = useClientsByPeriodReport()
const { openPrintPreview } = usePrintPreview()

// State
const filters = ref<ClientsByPeriodFilterInterface>({
  shopId: 0,
  chainId: shop.chainId,
  headquarterShopId: shop.shopId,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
})
const clientsByPeriodTableRef = ref<InstanceType<typeof ClientsByPeriodTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
})

// Date range logic is now handled by useDateRangeFilter composable
const handlePrint = async (): Promise<void> => {
  const sections = []
  if (clientsByPeriodTableRef.value) {
    sections.push(clientsByPeriodTableRef.value.getPrintConfigurationVisitingClients())
    sections.push(clientsByPeriodTableRef.value.getPrintConfigurationVisitingMembers())
  }
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

// Date type change watching is now handled by useDateRangeFilter composable

onMounted(() => {
  // Initialize date range with default values
  initializeWithDefaultRange()

  filters.value.shopId = Number(route.query?.branchShopId) || 0

  handleFetchReport()
})
</script>
