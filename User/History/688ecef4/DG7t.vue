<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-type.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ClientsByTypeFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <ClientsByTypeTable ref="clientsByTypeTableRef" :data="items" />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useClientsByTypeReport } from '@/composables/report-by-branch/useClientsByTypeReport'
// Constants
import { REPORT_TYPE_IN_CLIENTS_BY_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { ClientsByTypeFilterInterface } from '@/types/client-report/ClientsByType'

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
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  reportType: REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX,
})
const clientsByTypeTableRef = ref<InstanceType<typeof ClientsByTypeTable> | null>(null)

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (!sections.length) return
  await openPrintPreview(sections, {
    title: t('clients-by-type.title'),
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
  filters.value.shopId = Number(route.query?.branchShopId) || 0

  handleFetchReport()
})
</script>
