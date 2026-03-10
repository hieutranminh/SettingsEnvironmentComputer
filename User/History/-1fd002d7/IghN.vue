<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-repeat-clients.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <SalesByRepeatClientsFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Chart and Table Layout -->
    <div class="section-container">
      <!-- Chart -->
      <div class="section-left">
        <SalesByRepeatClientsChart ref="salesByRepeatClientsChartRef" :data="items" />
      </div>

      <!-- Table -->
      <div class="section-right">
        <SalesByRepeatClientsTable ref="salesByRepeatClientsTableRef" :data="items" />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { TIMEZONE_TYPE, DATE_TYPE, FILTER_VALUES, DATE_RANGE_PRESETS, type DateType } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { SalesByRepeatClientsFilterInterface } from '@/types/client-report/SalesByRepeatClients'
// Utils
import {
  getCurrentDate,
  getEndOf,
  getStartOf,
  toUnixTimestamp,
  fromUnixTimestamp,
  dateRangePresetHandlers,
} from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import SalesByRepeatClientsFilter from './partials/SalesByRepeatClientsFilter.vue'
import SalesByRepeatClientsTable from './partials/SalesByRepeatClientsTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useSalesByRepeatClientsReport()
const printPreviewStore = usePrintPreviewStore()

// State
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<SalesByRepeatClientsFilterInterface>({
  dateType: DATE_TYPE.MONTH,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  staffId: FILTER_VALUES.ALL,
  reportByType: REPORT_BY_TYPE.SERVICE,
})

// Component refs
const salesByDiscountCategoryChartRef = ref<InstanceType<typeof SalesByDiscountCategoryChart> | null>(null)
const salesByDiscountCategoryTableRef = ref<InstanceType<typeof SalesByDiscountCategoryTable> | null>(null)

const dateMappedText = computed(() => {
  if (filterData?.value?.dateType === DATE_TYPE.DATE) {
    return formatDate(fromUnixTimestamp(filterData?.value?.fromDateTs), { timezone: TIMEZONE_TYPE.UTC })
  } else if (filterData?.value?.dateType === DATE_TYPE.MONTH) {
    return formatDate(fromUnixTimestamp(filterData?.value?.fromDateTs), {
      format: 'YYYY-MM',
      timezone: TIMEZONE_TYPE.UTC,
    })
  } else if (filterData?.value?.dateType === DATE_TYPE.RANGE) {
    return `${formatDate(fromUnixTimestamp(filterData?.value?.fromDateTs), { timezone: TIMEZONE_TYPE.UTC })} - ${formatDate(fromUnixTimestamp(filterData?.value?.toDateTs), { timezone: TIMEZONE_TYPE.UTC })}`
  }
  return ''
})

/**
 * Get date range with date type is date
 * @returns Date range
 */
const getDateRangeWithDateTypeIsDate = () => {
  const startOfDay = getStartOf(getCurrentDate(), 'day').toDate()
  const endOfDay = getEndOf(getCurrentDate(), 'day').toDate()

  return {
    fromDateTs: toUnixTimestamp(startOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    toDateTs: toUnixTimestamp(endOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  }
}

/**
 * Get date range with date type is month
 * @returns Date range
 */
const getDateRangeWithDateTypeIsMonth = () => {
  const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
  const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()

  return {
    fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  }
}

/**
 * Get date range with date type is range
 * @returns Date range
 */
const getDateRangeWithDateTypeIsRange = () => {
  const handler = dateRangePresetHandlers[DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY]
  const [startDate, endDate] = handler()

  return {
    fromDateTs: toUnixTimestamp(startDate, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    toDateTs: toUnixTimestamp(endDate, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  }
}

/**
 * Get default date range ts
 * @param dataType - Date type
 * @returns Date range ts
 */
const getDefaultDateRangeTs = (dataType: DateType) => {
  switch (dataType) {
    case DATE_TYPE.DATE:
      return getDateRangeWithDateTypeIsDate()
    case DATE_TYPE.MONTH:
      return getDateRangeWithDateTypeIsMonth()
    case DATE_TYPE.RANGE:
      return getDateRangeWithDateTypeIsRange()
    default:
      return getDateRangeWithDateTypeIsDate()
  }
}

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (salesByDiscountCategoryChartRef.value)
    sections.push(salesByDiscountCategoryChartRef.value.getPrintConfiguration())
  if (salesByDiscountCategoryTableRef.value)
    sections.push(salesByDiscountCategoryTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('sales-by-discount-category.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

const handleFiltersChanged = (): void => {
  handleFetchReport()
}

const handleFetchReport = (): void => {
  if (!filters.value.shopId) return

  fetchReport(filters.value)
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = async (value: number): Promise<void> => {
  filters.value.shopId = value
  filters.value.staffId = FILTER_VALUES.ALL
  handleFetchReport()
}

watch(
  () => filters.value.dateType,
  (newDateType, oldDateType) => {
    if (newDateType !== oldDateType) {
      const dateRange = getDefaultDateRangeTs(newDateType)
      filters.value.fromDateTs = dateRange.fromDateTs
      filters.value.toDateTs = dateRange.toDateTs
    }
  },
)

onMounted(async () => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  handleFetchReport()
})
</script>
