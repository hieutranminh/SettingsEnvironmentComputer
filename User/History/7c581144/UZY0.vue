<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('new-clients-repeat.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <NewClientsRepeatFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Table -->
    <NewClientsRepeatTable ref="newClientsRepeatTableRef" :data="items" />

    <!-- Note -->
    <NewClientsRepeatNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useNewClientsRepeatReport } from '@/composables/report-by-branch/useNewClientsRepeatReport'
// Constants
import { TIMEZONE_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { NewClientsRepeatFilterInterface } from '@/types/client-report/NewClientsRepeat'
// Utils
import { getCurrentDate, getEndOf, getStartOf, toUnixTimestamp, formatDate, fromUnixTimestamp } from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import NewClientsRepeatFilter from './partials/NewClientsRepeatFilter.vue'
import NewClientsRepeatNote from './partials/NewClientsRepeatNote.vue'
import NewClientsRepeatTable from './partials/NewClientsRepeatTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, fetchReport } = useNewClientsRepeatReport()
const { openPrintPreview } = usePrintPreview()

// State
const DATES_TO_SUBTRACT = 3
const dateOf3MonthsAgo = getCurrentDate().subtract(DATES_TO_SUBTRACT, 'month')
const startOfMonth = getStartOf(dateOf3MonthsAgo, 'month').toDate()
const endOfMonth = getEndOf(dateOf3MonthsAgo, 'month').toDate()
const filters = ref<NewClientsRepeatFilterInterface>({
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
})
const newClientsRepeatTableRef = ref<InstanceType<typeof NewClientsRepeatTable> | null>(null)

const dateMappedText = computed(() => {
  return `${formatDate(fromUnixTimestamp(filters.value.fromDateTs), { timezone: TIMEZONE_TYPE.UTC })}`
})

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (newClientsRepeatTableRef.value) sections.push(newClientsRepeatTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await openPrintPreview(sections, {
    title: t('new-clients-repeat.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

const handleFiltersChanged = (): void => {
  fetchReport(filters.value)
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = async (value: number): Promise<void> => {
  filters.value.shopId = value

  fetchReport(filters.value)
}

onMounted(async () => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  if (!filters.value.shopId) return
  fetchReport(filters.value)
})
</script>
