<template>
  <!-- Header -->
  <BranchPrepaidGoodsHeader @print="handlePrint" />

  <!-- Filter -->
  <BranchPrepaidGoodsFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

  <!-- Table -->
  <BranchPrepaidGoodsTable ref="branchPrepaidGoodsTableRef" :data="items" />

  <!-- Note -->
  <BranchPrepaidGoodsNote />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useBranchPrepaidGoods } from '@/composables'
// Constants
import { FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { BranchPrepaidGoodsFilterInterface } from '@/types/branch/BranchPrepaidGoodsFilter'

// Components
import BranchPrepaidGoodsFilter from './partials/BranchPrepaidGoodsFilter.vue'
import BranchPrepaidGoodsHeader from './partials/BranchPrepaidGoodsHeader.vue'
import BranchPrepaidGoodsNote from './partials/BranchPrepaidGoodsNote.vue'
import BranchPrepaidGoodsTable from './partials/BranchPrepaidGoodsTable.vue'

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, fetchReport } = useBranchPrepaidGoods()
const printPreviewStore = usePrintPreviewStore()
const branchPrepaidGoodsTableRef = ref<InstanceType<typeof BranchPrepaidGoodsTable> | null>(null)

// Filters state
const filters = ref<BranchPrepaidGoodsFilterInterface>({
  isHeadquarterView: true,
  headquarterShopId: shop.shopId,
  branchName: '',
  branchShopIds: [],
  branchGroupId: FILTER_VALUES.ALL,
  customBranchTypeId: FILTER_VALUES.ALL,
})

// Handle filters change
const handleFiltersChanged = async (newFilters: BranchPrepaidGoodsFilterInterface): Promise<void> => {
  filters.value = { ...filters.value, ...newFilters }

  // Fetch new data when filters change
  await fetchReport(filters.value)
}

// Handle print
const handlePrint = async (): Promise<void> => {
  if (branchPrepaidGoodsTableRef.value) {
    const printConfigTable = branchPrepaidGoodsTableRef.value.getPrintConfiguration()

    await printPreviewStore.openPrintPreview(
      [printConfigTable],
      {
        title: t('branch-prepaid-goods.title'),
        orientation: 'landscape',
        totalItems: 'total <b>bold</b> and  <i>italic</i> and <b>bold</b>',
      },
      // Optional: You can pass a custom Excel handler or omit it to use default
    )
  }
}
</script>

<style scoped></style>
