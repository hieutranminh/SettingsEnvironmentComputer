<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-period.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ClientsByPeriodFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

    <ClientsByPeriodTable
      ref="clientsByPeriodTableRef"
      :itemClientSummary="itemClientSummary"
      :itemMemberSummary="itemMemberSummary"
    />

    <ClientsByPeriodNote />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useClientsByPeriodReport } from '@/composables/report-by-branch/useClientsByPeriodReport'
import { useDateFormat } from '@/composables/useDateFormat'

// Constants
import { TIMEZONE_TYPE, DATE_TYPE, DATE_RANGE_PRESETS, type DateType } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { ClientsByPeriodFilterInterface } from '@/types/client-report/ClientsByPeriod'
// Utils
import {
  getStartOf,
  getEndOf,
  getCurrentDate,
  toUnixTimestamp,
  dateRangePresetHandlers,
  fromUnixTimestamp,
} from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ClientsByPeriodFilter from './partials/ClientsByPeriodFilter.vue'
import ClientsByPeriodNote from './partials/ClientsByPeriodNote.vue'
import ClientsByPeriodTable from './partials/ClientsByPeriodTable.vue'

import { usePrintPreviewStore } from '@/composables/print/usePrintPreview'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, itemMemberSummary, itemClientSummary, fetchReport } = useClientsByPeriodReport()
const printPreviewStore = usePrintPreviewStore()

// State
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<ClientsByPeriodFilterInterface>({
  shopId: 0,
  chainId: shop.chainId,
  headquarterShopId: shop.shopId,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
})
const clientsByPeriodTableRef = ref<InstanceType<typeof ClientsByPeriodTable> | null>(null)

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

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (clientsByPeriodTableRef.value) sections.push(clientsByPeriodTableRef.value.getPrintConfiguration())
  if (!sections.length) return
  await printPreviewStore.openPrintPreview(sections, {
    title: t('clients-by-period.title'),
    dateRange: `(${dateMappedText.value})`,
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

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0

  handleFetchReport()
})
</script>
