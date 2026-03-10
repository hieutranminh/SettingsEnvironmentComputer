<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-type.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ClientsByTypeFilter
      v-model="filters"
      :chartDisplayType="chartDisplayType"
      @chartDisplayTypeChanged="chartDisplayType = $event"
      @filtersChanged="handleFiltersChanged"
    />

    <div class="section-container">
      <!-- Chart -->
      <div class="section-left">
        <ClientsByTypeChart ref="clientsByTypeChartRef" :data="items" />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ClientsByTypeTable ref="clientsByTypeTableRef" :data="items" />
      </div>
    </div>
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
import { CHART_DISPLAY_TYPE, REPORT_TYPE_IN_CLIENTS_BY_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { ClientsByTypeFilterInterface } from '@/types/client-report/ClientsByType'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ClientsByTypeChart from './partials/ClientsByTypeChart.vue'
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
const chartDisplayType = ref<string>(CHART_DISPLAY_TYPE.PIE)
const filters = ref<ClientsByTypeFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  reportType: REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX,
})
const clientsByTypeChartRef = ref<InstanceType<typeof ClientsByTypeChart> | null>(null)
const clientsByTypeTableRef = ref<InstanceType<typeof ClientsByTypeTable> | null>(null)

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (clientsByTypeChartRef.value) {
    sections.push(clientsByTypeChartRef.value.getPrintConfiguration())
  }
  if (clientsByTypeTableRef.value) {
    sections.push(clientsByTypeTableRef.value.getPrintConfiguration())
  }
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

<style lang="scss" scoped>
.section-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(ipad) {
    flex-direction: column;
  }

  .section-left {
    width: 50%;

    @include maxResponsive(ipad) {
      width: 100%;
    }
  }

  .section-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include maxResponsive(ipad) {
      width: 100%;
    }
  }
}
</style>
