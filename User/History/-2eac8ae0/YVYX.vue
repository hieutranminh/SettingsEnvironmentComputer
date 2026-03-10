<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('prepaid-goods-repurchase.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <PrepaidGoodsRepurchaseFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <!-- Table -->
    <PrepaidGoodsRepurchaseTable ref="prepaidGoodsRepurchaseTableRef" :data="items" />

    <!-- Note -->
    <PrepaidGoodsRepurchaseNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { usePrepaidGoodsRepurchaseReport } from '@/composables/report-by-branch/usePrepaidGoodsRepurchase'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { TIMEZONE_TYPE, DATE_TYPE, FILTER_VALUES, DATE_RANGE_PRESETS, type DateType } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { PrepaidGoodsRepurchaseFilterInterface } from '@/types/client-report/PrepaidGoodsRepurchase'
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

import PrepaidGoodsRepurchaseFilter from './partials/PrepaidGoodsRepurchaseFilter.vue'
import PrepaidGoodsRepurchaseNote from './partials/PrepaidGoodsRepurchaseNote.vue'
import PrepaidGoodsRepurchaseTable from './partials/PrepaidGoodsRepurchaseTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const printPreviewStore = usePrintPreviewStore()
const { filterData, items, fetchReport } = usePrepaidGoodsRepurchaseReport()

// State
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<PrepaidGoodsRepurchaseFilterInterface>({
  dateType: DATE_TYPE.MONTH,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  shopId: 0,
  headquarterShopId: shop.shopId,
  isHeadquarterView: true,
  staffId: FILTER_VALUES.ALL,
  reportByType: 1,
})

// Component refs
const prepaidGoodsRepurchaseTableRef = ref<InstanceType<typeof PrepaidGoodsRepurchaseTable> | null>(null)

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

  if (prepaidGoodsRepurchaseTableRef.value) sections.push(prepaidGoodsRepurchaseTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('prepaid-goods-repurchase.title'),
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
