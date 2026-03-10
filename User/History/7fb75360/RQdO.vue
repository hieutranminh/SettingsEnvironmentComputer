<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-sales-type.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useServiceSalesBySalesTypeReport } from '@/composables/report-by-branch/useServiceSalesBySalesType'
import { useDateFormat } from '@/composables/useDateFormat'
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

const handleResetFilterIds = (): void => {
  filters.value.categoryId = FILTER_VALUES.ALL
  filters.value.serviceId = FILTER_VALUES.ALL
  filters.value.staffId = FILTER_VALUES.ALL
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
const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value

  handleResetFilterIds()
  handleFetchReport()
}

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0

  handleResetFilterIds()
  handleFetchReport()
})
</script>
