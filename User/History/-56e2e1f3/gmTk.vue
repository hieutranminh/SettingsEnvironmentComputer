<template>
  <pre>{{ filters }}</pre>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />

  <!-- Filter -->
  <ServiceSalesFilter v-model="filters" />

  <!-- Chart -->

  <!-- Table -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { TIMEZONE_TYPE, DATE_TYPE, FILTER_VALUES, REPORT_BY_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ServiceSalesFilterInterface } from '@/types/sales-report/ServiceSalesFilter'
// Utils
import { getStartOf, getEndOf, getCurrentDate, toUnixTimestamp } from '@/utils/dateUtils'

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

import ServiceSalesFilter from './partials/ServiceSalesFilter.vue'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const printPreviewStore = usePrintPreviewStore()

// State
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

const handlePrint = async (): Promise<void> => {
  // const sections = []
  // if (salesByDateChartRef.value) sections.push(salesByDateChartRef.value.getPrintConfiguration())
  // if (salesByDateTableRef.value) sections.push(salesByDateTableRef.value.getPrintConfiguration())
  // if (!sections.length) return
  // await printPreviewStore.openPrintPreview(sections, {
  //   title: t('sales-by-date.title'),
  //   dateRange: `(${dateMappedText.value})`,
  // })
}

const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value
  // fetchReport(filters.value)
}

onMounted(() => {
  filters.value.shopId = Number(route.query?.branchShopId) || 0
  if (!filters.value.shopId) return

  // fetchReport(filters.value)
})
</script>
