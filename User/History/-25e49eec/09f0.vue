<template>
  <!-- Header -->
  <BranchSalesHeader @print="handlePrint" />

  <!-- Filter -->
  <BranchSalesFilter ref="branchSalesFilterRef" v-model="filters" @filtersChanged="handleFiltersChanged" />

  <!-- Table -->
  <BranchSalesTable ref="branchSalesTableRef" :data="items" :paging-info="pagingInfo" @load-more="handleLoadMore" />

  <!-- Note -->
  <BranchSalesNote />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { usePrintPreview } from '@/composables/print'
import { useBranchSalesTotalReport } from '@/composables/useBranchSalesTotalReport'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import { DATE_TYPE, FILTER_VALUES, PAGINATION, PRINT_ORIENTATION } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { BranchSalesFilterInterface } from '@/types/sales-report/BranchSales'

// Components
import BranchSalesFilter from './partials/BranchSalesFilter.vue'
import BranchSalesHeader from './partials/BranchSalesHeader.vue'
import BranchSalesNote from './partials/BranchSalesNote.vue'
import BranchSalesTable from './partials/BranchSalesTable.vue'

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, pagingInfo, fetchData } = useBranchSalesTotalReport()
const { openPrintPreview } = usePrintPreview()

// Filters state
const filters = ref<BranchSalesFilterInterface>({
  dateType: DATE_TYPE.DATE,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
  headquarterShopId: shop.shopId,
  branchName: '',
  branchShopIds: [],
  branchGroupId: FILTER_VALUES.ALL,
  customBranchTypeId: FILTER_VALUES.ALL,
})
const branchSalesTableRef = ref<InstanceType<typeof BranchSalesTable> | null>(null)
const branchSalesFilterRef = ref<InstanceType<typeof BranchSalesFilter> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.DATE,
  autoUpdateOnDateTypeChange: true,
})

// Handle filters change
const handleFiltersChanged = (): void => {
  fetchData(filters.value)
}

// Handle load more
const handleLoadMore = async (): Promise<void> => {
  filters.value = { ...filters.value, pageNumber: filters.value.pageNumber + 1 }
  await fetchData(filters.value, true) // Pass true to append new data
}

// Handle print
const handlePrint = async (): Promise<void> => {
  if (branchSalesTableRef.value) {
    const printConfigTable = branchSalesTableRef.value.getPrintConfiguration()

    await openPrintPreview([printConfigTable], {
      title: t('branch-sales.title'),
      dateRange: `(${dateRangeText.value})`,
      orientation: PRINT_ORIENTATION.LANDSCAPE,
    })
  }
}

onMounted(async () => {
  console.log('onMounted', import.meta.env)
  // Initialize date range with default values
  initializeWithDefaultRange()

  if (branchSalesFilterRef.value) {
    await branchSalesFilterRef.value.initializeFilters()
  }

  fetchData(filters.value)
})
</script>

<style scoped></style>
