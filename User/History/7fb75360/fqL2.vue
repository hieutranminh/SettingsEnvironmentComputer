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
    <ServiceSalesBySalesTypeTable ref="serviceSalesBySalesTypeTableRef" :data="items" :salesTypeData="salesType" />

    <!-- Note -->
    <ServiceSalesBySalesTypeNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesBySalesTypeReport } from '@/composables/report-by-branch/useServiceSalesBySalesType'
import { useDateFormat } from '@/composables/useDateFormat'
import { useSalesType } from '@/composables/useSalesType'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  DATE_RANGE_PRESETS,
  PREPAID_SALES_COUNTING_TYPE,
  type DateType,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ServiceSalesBySalesTypeFilterInterface } from '@/types/sales-report/ServiceSalesBySalesType'
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

import ServiceSalesBySalesTypeFilter from './partials/ServiceSalesBySalesTypeFilter.vue'
import ServiceSalesBySalesTypeNote from './partials/ServiceSalesBySalesTypeNote.vue'
import ServiceSalesBySalesTypeTable from './partials/ServiceSalesBySalesTypeTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { salesType, fetchSalesType } = useSalesType()
const { filterData, items, fetchReport } = useServiceSalesBySalesTypeReport()
const printPreviewStore = usePrintPreviewStore()

// State
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<ServiceSalesBySalesTypeFilterInterface>({
  dateType: DATE_TYPE.MONTH,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
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
const serviceSalesBySalesTypeTableRef = ref<InstanceType<typeof ServiceSalesBySalesTypeTable> | null>(null)

const dateMappedText = computed(() => {
  if (filterData?.value?.dateType === DATE_TYPE.DATE) {
    return formatDate(fromUnixTimestamp(filterData?.value?.fromDateTs), {
      timezone: TIMEZONE_TYPE.UTC,
    })
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
const getDateRangeWithDateTypeIsDate = (): { fromDateTs: number; toDateTs: number } => {
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
const getDateRangeWithDateTypeIsMonth = (): { fromDateTs: number; toDateTs: number } => {
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
const getDateRangeWithDateTypeIsRange = (): { fromDateTs: number; toDateTs: number } => {
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
const getDefaultDateRangeTs = (dataType: DateType): { fromDateTs: number; toDateTs: number } => {
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

  if (serviceSalesBySalesTypeTableRef.value)
    sections.push(serviceSalesBySalesTypeTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('service-sales-by-month.title'),
    dateRange: `(${dateMappedText.value})`,
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
    pageSize: 100,
    pageNumber: 1,
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

watch(
  () => filters.value.dateType,
  (newDateType, oldDateType): void => {
    if (newDateType !== oldDateType) {
      const dateRange = getDefaultDateRangeTs(newDateType)
      filters.value.fromDateTs = dateRange.fromDateTs
      filters.value.toDateTs = dateRange.toDateTs
    }
  },
)

onMounted(async () => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0

  await handleFetchSalesType()
  handleResetFilterIds()
  handleFetchReport()
})
</script>
