<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-item.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ServiceSalesByItemFilter
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
        <ServiceSalesByItemChart
          ref="serviceSalesByItemChartRef"
          :data="items"
          :chartDisplayType="chartDisplayType"
          :chartDisplayValue="chartDisplayValue"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ServiceSalesByItemTable ref="serviceSalesByItemTableRef" :data="items" />

        <ServiceSalesByItemNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesByItemReport } from '@/composables/report-by-branch/useServiceSalesByItemReport'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  DATE_RANGE_PRESETS,
  REPORT_BY_TYPE,
  type DateType,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ServiceSalesByItemFilterInterface } from '@/types/sales-report/ServiceSalesByItem'
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

import ServiceSalesByItemChart from './partials/ServiceSalesByItemChart.vue'
import ServiceSalesByItemFilter from './partials/ServiceSalesByItemFilter.vue'
import ServiceSalesByItemNote from './partials/ServiceSalesByItemNote.vue'
import ServiceSalesByItemTable from './partials/ServiceSalesByItemTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useServiceSalesByItemReport()
const printPreviewStore = usePrintPreviewStore()

// State
const chartDisplayType = ref<string>(CHART_DISPLAY_TYPE.BAR)
const chartDisplayValue = ref<number>(CHART_DISPLAY_VALUE.AMOUNT)
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<ServiceSalesByItemFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
  reportByType: REPORT_BY_TYPE.STAFF,
  categoryId: FILTER_VALUES.ALL,
  serviceId: FILTER_VALUES.ALL,
})
const serviceSalesByItemChartRef = ref<InstanceType<typeof ServiceSalesByItemChart> | null>(null)
const serviceSalesByItemTableRef = ref<InstanceType<typeof ServiceSalesByItemTable> | null>(null)

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

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (serviceSalesByItemChartRef.value) sections.push(serviceSalesByItemChartRef.value.getPrintConfiguration())
  if (serviceSalesByItemTableRef.value) sections.push(serviceSalesByItemTableRef.value.getPrintConfiguration())
  if (!sections.length) return
  await printPreviewStore.openPrintPreview(sections, {
    title: t('service-sales-by-item.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL

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
  (newDateType, oldDateType): void => {
    if (newDateType !== oldDateType) {
      const dateRange = getDefaultDateRangeTs(newDateType)
      filters.value.fromDateTs = dateRange.fromDateTs
      filters.value.toDateTs = dateRange.toDateTs
    }
  },
)

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL

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
