<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-month.title')"
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
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Utils
import { getCurrentDate, getEndOf, getStartOf, toUnixTimestamp, fromUnixTimestamp } from '@/utils/dateUtils'

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

/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (serviceSalesByMonthChartRef.value) sections.push(serviceSalesByMonthChartRef.value.getPrintConfiguration())
  if (serviceSalesByMonthTableRef.value) sections.push(serviceSalesByMonthTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('service-sales-by-month.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = (value: number): void => {
  filters.value.shopId = value

  handleFetchReport()
}
</script>
