<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('product-sales-by-month.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ProductSalesByMonthFilter
      v-model="filters"
      :chartDisplayType="chartDisplayType"
      :chartDisplayValue="chartDisplayValue"
      @chartDisplayTypeChanged="chartDisplayType = $event"
      @chartDisplayValueChanged="chartDisplayValue = $event"
      @filtersChanged="handleFiltersChanged"
    />

    <div class="section-container">
      <!-- Chart -->
      <div class="section-left">
        <ProductSalesByMonthChart
          ref="productSalesByMonthChartRef"
          :data="items"
          :chartDisplayType="chartDisplayType"
          :chartDisplayValue="chartDisplayValue"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ProductSalesByMonthTable ref="productSalesByMonthTableRef" :data="items" />

        <ProductSalesByMonthNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useProductSalesByMonthReport } from '@/composables/report-by-branch/useProductSalesByMonthReport'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import {
  TIMEZONE_TYPE,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  FILTER_VALUES,
  type ChartDisplayType,
  type ChartDisplayValue,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ProductSalesByMonthFilterInterface } from '@/types/sales-report/ProductSalesByMonth'
// Utils
import { getCurrentDate, getEndOf, getStartOf, toUnixTimestamp, fromUnixTimestamp } from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ProductSalesByMonthChart from './partials/ProductSalesByMonthChart.vue'
import ProductSalesByMonthFilter from './partials/ProductSalesByMonthFilter.vue'
import ProductSalesByMonthNote from './partials/ProductSalesByMonthNote.vue'
import ProductSalesByMonthTable from './partials/ProductSalesByMonthTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useProductSalesByMonthReport()
const printPreviewStore = usePrintPreviewStore()

// State
const MONTHS_TO_SUBTRACT = 8
const startOfMonth = getStartOf(getCurrentDate(), 'month').subtract(MONTHS_TO_SUBTRACT, 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<ProductSalesByMonthFilterInterface>({
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  categoryId: FILTER_VALUES.ALL,
  productId: FILTER_VALUES.ALL,
  staffId: FILTER_VALUES.ALL,
})
const chartDisplayType = ref<ChartDisplayType>(CHART_DISPLAY_TYPE.LINE)
const chartDisplayValue = ref<ChartDisplayValue>(CHART_DISPLAY_VALUE.AMOUNT)
const productSalesByMonthChartRef = ref<InstanceType<typeof ProductSalesByMonthChart> | null>(null)
const productSalesByMonthTableRef = ref<InstanceType<typeof ProductSalesByMonthTable> | null>(null)

/**
 * Computed property for formatted date range text
 * Used in print preview and display purposes
 * @returns Formatted date range string
 */
const dateMappedText = computed(() => {
  const fromDate = filterData?.value?.fromDateTs
  const toDate = filterData?.value?.toDateTs

  if (!fromDate || !toDate) {
    return ''
  }

  return `${formatDate(fromUnixTimestamp(fromDate), { timezone: TIMEZONE_TYPE.UTC, format: 'YYYY-MM' })} - ${formatDate(fromUnixTimestamp(toDate), { timezone: TIMEZONE_TYPE.UTC, format: 'YYYY-MM' })}`
})

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (productSalesByMonthChartRef.value) sections.push(productSalesByMonthChartRef.value.getPrintConfiguration())
  if (productSalesByMonthTableRef.value) sections.push(productSalesByMonthTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('product-sales-by-month.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value

  handleResetFilterIds()
  handleFetchReport()
}

/**
 * Handles filter change event
 * Fetches new report data with updated filters
 */
const handleFiltersChanged = (): void => {
  handleFetchReport()
}

const handleResetFilterIds = (): void => {
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.productId = FILTER_VALUES.ALL
  filters.value.staffId = FILTER_VALUES.ALL
}

const handleFetchReport = (): void => {
  if (!filters.value.shopId) return
  fetchReport(filters.value)
}

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0

  handleResetFilterIds()
  handleFetchReport()
})
</script>

<style lang="scss" scoped>
.section-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(ipadLandscape) {
    flex-direction: column;
  }

  .section-left {
    width: 50%;

    @include maxResponsive(ipadLandscape) {
      width: 100%;
    }
  }

  .section-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include maxResponsive(ipadLandscape) {
      width: 100%;
    }
  }
}
</style>
