<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-date.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useDateFormat } from '@/composables/useDateFormat'
// Constants

import { TIMEZONE_TYPE, DATE_TYPE } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { ServiceSalesFilterInterface } from '@/types/sales-report/ServiceSalesFilter'
// Utils
import { getStartOf, getEndOf, getCurrentDate, toUnixTimestamp } from '@/utils/dateUtils'

// Router
const route = useRoute()

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { formatDate } = useDateFormat()
const { filterData, items, fetchReport } = useSalesByDateReport()
const printPreviewStore = usePrintPreviewStore()

// State
const startOfMonth = getStartOf(getCurrentDate(), 'month').toDate()
const endOfDay = getEndOf(getCurrentDate(), 'day').toDate()
const filters = ref<ServiceSalesFilterInterface>({
  shopId: 0,
  headquarterShopId: shop.shopId,
  fromDateTs: toUnixTimestamp(startOfMonth, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  toDateTs: toUnixTimestamp(endOfDay, TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  isHeadquarterView: true,
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
  // filters.value.shopId = value
  // fetchReport(filters.value)
}
</script>
