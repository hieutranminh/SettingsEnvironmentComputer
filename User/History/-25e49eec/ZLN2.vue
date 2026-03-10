<template>
  <!-- Header -->
  <BranchSalesHeader @print="handlePrint" />

  <!-- Filter -->
  <BranchSalesFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

  <!-- Table -->
  <BranchSalesTable ref="branchSalesTableRef" :data="items" :paging-info="pagingInfo" @load-more="handleLoadMore" />

  <!-- Note -->
  <BranchSalesNote />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useBranchSalesTotalReport, useDateFormat } from '@/composables'
// Constants
import { DATE_TYPE, FILTER_VALUES, PAGINATION } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { BranchSalesFilterInterface } from '@/types/branch/BranchSalesFilter'
// Utils
import { fromUnixTimestamp, getCurrentUnixTimestamp } from '@/utils/dateUtils'

// Components
import BranchSalesFilter from './partials/BranchSalesFilter.vue'
import BranchSalesHeader from './partials/BranchSalesHeader.vue'
import BranchSalesNote from './partials/BranchSalesNote.vue'
import BranchSalesTable from './partials/BranchSalesTable.vue'

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, pagingInfo, fetchReport } = useBranchSalesTotalReport()
const { formatDate } = useDateFormat()
const printPreviewStore = usePrintPreviewStore()
const branchSalesTableRef = ref<InstanceType<typeof BranchSalesTable> | null>(null)

// Filters state
const filters = ref<BranchSalesFilterInterface>({
  dateType: DATE_TYPE.DATE,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  fromDateTs: getCurrentUnixTimestamp(),
  toDateTs: getCurrentUnixTimestamp(),
  isHeadquarterView: true,
  headquarterShopId: shop.shopId,
  branchName: '',
  branchShopIds: [],
  branchGroupId: FILTER_VALUES.ALL,
  customBranchTypeId: FILTER_VALUES.ALL,
})

// Computed properties
const dateMappedText = computed(() => {
  console.log('1', fromUnixTimestamp(filters.value.toDateTs))
  if (filters.value.dateType === DATE_TYPE.DATE) {
    return formatDate(fromUnixTimestamp(filters.value.fromDateTs))
  } else if (filters.value.dateType === DATE_TYPE.MONTH) {
    return formatDate(fromUnixTimestamp(filters.value.fromDateTs), { format: 'YYYY-MM' })
  } else if (filters.value.dateType === DATE_TYPE.RANGE) {
    return `${formatDate(fromUnixTimestamp(filters.value.fromDateTs))} - ${formatDate(fromUnixTimestamp(filters.value.toDateTs))}`
  }
  return ''
})

// Handle filters change
const handleFiltersChanged = async (newFilters: BranchSalesFilterInterface): Promise<void> => {
  filters.value = { ...filters.value, ...newFilters }

  // Fetch new data when filters change
  await fetchReport(filters.value)
}

// Handle load more
const handleLoadMore = async (): Promise<void> => {
  filters.value = { ...filters.value, pageNumber: filters.value.pageNumber + 1 }
  await fetchReport(filters.value, true) // Pass true to append new data
}

// Handle print
const handlePrint = async (): Promise<void> => {
  if (branchSalesTableRef.value) {
    const printConfigTable = branchSalesTableRef.value.getPrintConfiguration()

    await printPreviewStore.openPrintPreview(
      [printConfigTable],
      {
        title: t('branch-sales.title'),
        dateRange: `(${dateMappedText.value})`,
        totalItems: t('general.all-result', { total_records: pagingInfo.value?.totalItems || 0 }),
        orientation: 'landscape',
      },
      // Optional: You can pass a custom Excel handler or omit it to use default
    )
  }
}
</script>

<style scoped></style>
