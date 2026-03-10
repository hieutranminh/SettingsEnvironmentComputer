<template>
  <!-- Header -->
  <BranchSalesHeader @print="handlePrint" />

  <!-- Filter -->
  <BranchSalesFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

  <Card>
    <template #content>
      <Chart ref="chartRef" type="bar" :data="chartData" :options="chartOptions" />
    </template>
  </Card>

  <!-- Table -->
  <BranchSalesTable ref="branchSalesTableRef" :data="items" :paging-info="pagingInfo" @load-more="handleLoadMore" />

  <!-- Note -->
  <BranchSalesNote />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useBranchSalesTotalReport } from '@/composables'
// Constants
import { DATE_TYPE, FILTER_VALUES, PAGINATION } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
// Types
import type { BranchSalesFilterInterface } from '@/types/branch/BranchSalesFilter'
// Utils
import { formatDate, fromUnixTimestamp, getCurrentUnixTimestamp } from '@/utils/dateUtils'

// Components
import BranchSalesFilter from './partials/BranchSalesFilter.vue'
import BranchSalesHeader from './partials/BranchSalesHeader.vue'
import BranchSalesNote from './partials/BranchSalesNote.vue'
import BranchSalesTable from './partials/BranchSalesTable.vue'

// Initialize composable
const { t } = useI18n()
const { shop } = useAuthStore()
const { items, pagingInfo, fetchReport } = useBranchSalesTotalReport()
const printPreviewStore = usePrintPreviewStore()
const branchSalesTableRef = ref<InstanceType<typeof BranchSalesTable> | null>(null)
const chartRef = ref()

// Filters state
const filters = ref<BranchSalesFilterInterface>({
  dateType: DATE_TYPE.DATE,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  fromDateTs: getCurrentUnixTimestamp(),
  toDateTs: getCurrentUnixTimestamp(),
  isHeadquarterView: true,
  headquarterShopId: shop.shopId,
  branchName: '',
  branchShopIds: [],
  branchGroupId: FILTER_VALUES.ALL,
  customBranchTypeId: FILTER_VALUES.ALL,
})

// Computed properties
const dateMappedText = computed(() => {
  if (filters.value.dateType === DATE_TYPE.DATE) {
    return formatDate(fromUnixTimestamp(filters.value.fromDateTs))
  } else if (filters.value.dateType === DATE_TYPE.MONTH) {
    return formatDate(fromUnixTimestamp(filters.value.fromDateTs), { format: 'yearMonth' })
  } else if (filters.value.dateType === DATE_TYPE.RANGE) {
    return `${formatDate(fromUnixTimestamp(filters.value.fromDateTs))} - ${formatDate(fromUnixTimestamp(filters.value.toDateTs))}`
  }
  return ''
})

// Handle filters change
const handleFiltersChanged = async (newFilters: BranchSalesFilterInterface): Promise<void> => {
  filters.value = { ...filters.value, ...newFilters }

  // Fetch new data when filters change
  await fetchReport(filters.value)
}

// Handle load more
const handleLoadMore = async (): Promise<void> => {
  filters.value = { ...filters.value, pageNumber: filters.value.pageNumber + 1 }
  await fetchReport(filters.value, true) // Pass true to append new data
}

// Handle print
const handlePrint = async (): Promise<void> => {
  if (branchSalesTableRef.value) {
    const printConfigTable = branchSalesTableRef.value.getPrintConfiguration()
    console.log('chartRef', chartRef)
    const printChartTable = {
      refType: 'CANVAS',
      sectionRef: chartRef.value,
    }

    await printPreviewStore.openPrintPreview(
      [printChartTable, printConfigTable],
      {
        title: t('branch-sales.title'),
        dateRange: `(${dateMappedText.value})`,
        totalItems: t('general.all-result', { total_records: pagingInfo.value?.totalItems || 0 }),
        orientation: 'landscape',
      },
      // Optional: You can pass a custom Excel handler or omit it to use default
    )
  }
}

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales',
        data: [540, 325, 702, 620],
        backgroundColor: [
          'rgba(249, 115, 22, 0.2)',
          'rgba(6, 182, 212, 0.2)',
          'rgb(107, 114, 128, 0.2)',
          'rgba(139, 92, 246 0.2)',
        ],
        borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
        borderWidth: 1,
      },
    ],
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
}
</script>

<style scoped></style>
