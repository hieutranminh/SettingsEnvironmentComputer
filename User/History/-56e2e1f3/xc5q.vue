<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <template v-if="filters.shopId">
    <!-- Filter -->
    <ServiceSalesFilter
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
        <ServiceSalesChart
          ref="serviceSalesChartRef"
          :data="items"
          :chartDisplayType="chartDisplayType"
          :chartDisplayValue="chartDisplayValue"
        />
      </div>

      <!-- Table -->
      <div class="section-right">
        <ServiceSalesTable ref="serviceSalesTableRef" :data="items" />

        <ServiceSalesNote />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesReport } from '@/composables/report-by-branch/useServiceSalesReport'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import {
  TIMEZONE_TYPE,
  DATE_TYPE,
  FILTER_VALUES,
  REPORT_BY_TYPE,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  DATE_RANGE_PRESETS,
  type DateType,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ServiceSalesFilterInterface } from '@/types/sales-report/ServiceSales'
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

import ServiceSalesChart from './partials/ServiceSalesChart.vue'
import ServiceSalesFilter from './partials/ServiceSalesFilter.vue'
import ServiceSalesNote from './partials/ServiceSalesNote.vue'
import ServiceSalesTable from './partials/ServiceSalesTable.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useServiceSalesReport()
const printPreviewStore = usePrintPreviewStore()

// State
const chartDisplayType = ref<string>(CHART_DISPLAY_TYPE.BAR)
const chartDisplayValue = ref<number>(CHART_DISPLAY_VALUE.AMOUNT)
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfMonth = getEndOf(getCurrentDate(), 'month').toDate()
const filters = ref<ServiceSalesFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  isHeadquarterView: true,
  dateType: DATE_TYPE.MONTH,
  reportByType: REPORT_BY_TYPE.STAFF,
  staffId: FILTER_VALUES.ALL,
})
const serviceSalesChartRef = ref<InstanceType<typeof ServiceSalesChart> | null>(null)
const serviceSalesTableRef = ref<InstanceType<typeof ServiceSalesTable> | null>(null)

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
  if (serviceSalesChartRef.value) sections.push(serviceSalesChartRef.value.getPrintConfiguration())
  if (serviceSalesTableRef.value) sections.push(serviceSalesTableRef.value.getPrintConfiguration())
  if (!sections.length) return
  await printPreviewStore.openPrintPreview(sections, {
    title: t('service-sales.title'),
    dateRange: `(${dateMappedText.value})`,
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
  filters.value.staffId = FILTER_VALUES.ALL

  handleFetchReport()
})
</script>

<style lang="scss" scoped>
.section-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(smallMobile) {
    flex-direction: column;
  }

  .section-left {
    width: 50%;
  }

  .section-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
