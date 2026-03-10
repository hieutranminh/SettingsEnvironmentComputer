<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-sales-type.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ServiceSalesBySalesTypeFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Table -->
    <ServiceSalesBySalesTypeTable
      ref="serviceSalesBySalesTypeTableRef"
      :data="items"
      :salesTypeData="salesType"
    />

    <!-- Note -->
    <ServiceSalesBySalesTypeNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrintPreview } from '@/composables/print'
import { useServiceSalesBySalesTypeReport } from '@/composables/report-by-branch/useServiceSalesBySalesType'
import { useSalesType } from '@/composables/useSalesType'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  PREPAID_SALES_COUNTING_TYPE,
  PAGINATION,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { IServiceSalesBySalesTypeFilterInterface } from '@/types/sales-report/ServiceSalesBySalesType'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ServiceSalesBySalesTypeFilter from './partials/ServiceSalesBySalesTypeFilter.vue'
import ServiceSalesBySalesTypeNote from './partials/ServiceSalesBySalesTypeNote.vue'
import ServiceSalesBySalesTypeTable from './partials/ServiceSalesBySalesTypeTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { salesType, fetchSalesType } = useSalesType()
const { items, fetchReport } = useServiceSalesBySalesTypeReport()
const { openPrintPreview } = usePrintPreview()

// State
const filters = ref<IServiceSalesBySalesTypeFilterInterface>({
  dateType: DATE_TYPE.MONTH,
  fromDateTs: 0,
  toDateTs: 0,
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  categoryId: FILTER_VALUES.ALL,
  serviceId: FILTER_VALUES.ALL,
  staffId: FILTER_VALUES.ALL,
  prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD,
  isPointDeductionIncluded: false,
  salesTypeIds: [],
})
const serviceSalesBySalesTypeTableRef = ref<InstanceType<
  typeof ServiceSalesBySalesTypeTable
> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
})

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (serviceSalesBySalesTypeTableRef.value)
    sections.push(serviceSalesBySalesTypeTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await openPrintPreview(sections, {
    title: t('service-sales-by-sales-type.title'),
    dateRange: `(${dateRangeText.value})`,
  })
}

const handleFiltersChanged = (): void => {
  handleFetchReport()
}

const handleResetFilterIds = (): void => {
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL
  filters.value.staffId = FILTER_VALUES.ALL
}

const handleFetchReport = (): void => {
  if (!filters.value.shopId) return

  fetchReport(filters.value)
}

const handleFetchSalesType = async (): Promise<void> => {
  await fetchSalesType({
    shopId: filters.value.shopId,
    headquarterShopId: shop.shopId,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    status: 1,
  })

  filters.value.salesTypeIds = salesType.value.map((item) => item.id)
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = async (value: number): Promise<void> => {
  filters.value.shopId = value

  await handleFetchSalesType()
  handleResetFilterIds()
  handleFetchReport()
}

onMounted(async () => {
  // Initialize date range with default values
  initializeWithDefaultRange()

  filters.value.shopId = Number(route.query?.branchShopId) || 0

  await handleFetchSalesType()
  handleResetFilterIds()
  handleFetchReport()
})
</script>
