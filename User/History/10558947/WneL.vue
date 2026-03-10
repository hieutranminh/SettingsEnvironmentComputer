<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('product-sales-by-item.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ProductSalesByItemFilter
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
        <ProductSalesByItemChart
          ref="productSalesByItemChartRef"
          :data="items"
          :chartDisplayType="chartDisplayType"
          :chartDisplayValue="chartDisplayValue"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ProductSalesByItemTable ref="productSalesByItemTableRef" :data="items" />

        <ProductSalesByItemNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useProductSalesByItemReport } from '@/composables/report-by-branch/useProductSalesByItemReport'
import { usePrintPreview } from '@/composables/print'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  REPORT_BY_TYPE_PRODUCT,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  type ChartDisplayType,
  type ChartDisplayValue,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { IProductSalesByItemFilterInterface } from '@/types/sales-report/ProductSalesByItem'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ProductSalesByItemChart from './partials/ProductSalesByItemChart.vue'
import ProductSalesByItemFilter from './partials/ProductSalesByItemFilter.vue'
import ProductSalesByItemNote from './partials/ProductSalesByItemNote.vue'
import ProductSalesByItemTable from './partials/ProductSalesByItemTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { savedFilters, items, fetchReport } = useProductSalesByItemReport()
const { openPrintPreview } = usePrintPreview()

// State
const chartDisplayType = ref<ChartDisplayType>(CHART_DISPLAY_TYPE.BAR)
const chartDisplayValue = ref<ChartDisplayValue>(CHART_DISPLAY_VALUE.AMOUNT)
const filters = ref<IProductSalesByItemFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  fromDateTs: 0,
  toDateTs: 0,
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
  reportByType: REPORT_BY_TYPE_PRODUCT.PRODUCT,
  staffId: FILTER_VALUES.ALL,
})
const productSalesByItemChartRef = ref<InstanceType<typeof ProductSalesByItemChart> | null>(null)
const productSalesByItemTableRef = ref<InstanceType<typeof ProductSalesByItemTable> | null>(null)

// Initialize date range filter composable
const { dateRangeText, initializeWithDefaultRange } = useDateRangeFilter(filters, {
  defaultDateType: DATE_TYPE.MONTH,
  autoUpdateOnDateTypeChange: true,
  timezone: TIMEZONE_TYPE.UTC,
  savedFilters,
})

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (productSalesByItemChartRef.value)
    sections.push(productSalesByItemChartRef.value.getPrintConfiguration())
  if (productSalesByItemTableRef.value)
    sections.push(productSalesByItemTableRef.value.getPrintConfiguration())
  if (!sections.length) return
  await openPrintPreview(sections, {
    title: t('product-sales-by-item.title'),
    dateRange: `(${dateRangeText.value})`,
  })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value
  filters.value.staffId = FILTER_VALUES.ALL

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
  // Initialize date range with default values
  initializeWithDefaultRange()

  filters.value.shopId = Number(route.query?.branchShopId) || 0
  filters.value.staffId = FILTER_VALUES.ALL

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
