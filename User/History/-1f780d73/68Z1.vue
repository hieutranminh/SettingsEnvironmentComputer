<template>
  <!-- Header -->
  <BranchPrepaidGoodsHeader @print="handlePrint" />
  <p>haha</p>

  <!-- Filter -->
  <BranchPrepaidGoodsFilter
    ref="branchPrepaidGoodsFilterRef"
    v-model="filters"
    @filtersChanged="handleFiltersChanged"
  />

  <!-- Table -->
  <BranchPrepaidGoodsTable ref="branchPrepaidGoodsTableRef" :data="items" />

  <!-- Note -->
  <BranchPrepaidGoodsNote />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { usePrintPreview } from '@/composables/print'
import { useBranchPrepaidGoods } from '@/composables'

// Constants
import { FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { IBranchPrepaidGoodsFilter } from '@/types/sales-report/BranchPrepaidGoods'

// Components
import BranchPrepaidGoodsFilter from './partials/BranchPrepaidGoodsFilter.vue'
import BranchPrepaidGoodsHeader from './partials/BranchPrepaidGoodsHeader.vue'
import BranchPrepaidGoodsNote from './partials/BranchPrepaidGoodsNote.vue'
import BranchPrepaidGoodsTable from './partials/BranchPrepaidGoodsTable.vue'

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, fetchReport } = useBranchPrepaidGoods()
const { openPrintPreview } = usePrintPreview()
const branchPrepaidGoodsFilterRef = ref<InstanceType<typeof BranchPrepaidGoodsFilter> | null>(null)
const branchPrepaidGoodsTableRef = ref<InstanceType<typeof BranchPrepaidGoodsTable> | null>(null)

// Filters state
const filters = ref<IBranchPrepaidGoodsFilter>({
  isHeadquarterView: true,
  headquarterShopId: shop.shopId,
  branchName: '',
  branchShopIds: [],
  branchGroupId: FILTER_VALUES.ALL,
  customBranchTypeId: FILTER_VALUES.ALL,
})

// Handle filters change
const handleFiltersChanged = (): void => {
  fetchReport(filters.value)
}

// Handle print
const handlePrint = async (): Promise<void> => {
  if (branchPrepaidGoodsTableRef.value) {
    const printConfigTable = branchPrepaidGoodsTableRef.value.getPrintConfiguration()

    await openPrintPreview([printConfigTable], {
      title: t('branch-prepaid-goods.title'),
      orientation: 'landscape',
    })
  }
}

onMounted(async () => {
  if (branchPrepaidGoodsFilterRef.value) {
    await branchPrepaidGoodsFilterRef.value.initializeFilters()
  }

  fetchReport(filters.value)
})
</script>

<style scoped></style>
