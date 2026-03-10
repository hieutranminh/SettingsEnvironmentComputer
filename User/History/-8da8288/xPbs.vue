<template>
  <Card>
    <template #content>
      <div class="select-display-item">
        <label for="#">{{ $t('sales-by-date.label-display-item') }}</label>
        <Select v-model="displayItemType" :options="displayItemTypeOptions" optionLabel="label" optionValue="value" />
      </div>

      <Chart type="line" :data="chartData" :options="chartOptions" :height="400" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import { useChartOptions } from '@/composables/useChartOptions'
// Constants
import { DISPLAY_ITEM_TYPE, PREPAID_SALES_COUNTING_TYPE } from '@/constants'
// Types
import type { SalesByDateReportItem } from '@/services/sales/sales-reports/sales-by-date-report.read'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data: SalesByDateReportItem[]
  prepaidSalesCountingType: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD,
})

// Composables
const { t } = useI18n()
const { chartOptions } = useChartOptions()

// State
const displayItemType = ref(DISPLAY_ITEM_TYPE.ALL)

/**
 * Computed property for display item type options
 * Conditionally includes prepaid card options based on counting type
 * This reactive property updates automatically when i18n locale changes
 */
const displayItemTypeOptions = computed(() => {
  const baseOptions: Array<{ label: string; value: number }> = [
    { label: t('general.all'), value: DISPLAY_ITEM_TYPE.ALL },
    { label: t('sales-by-date.label-service'), value: DISPLAY_ITEM_TYPE.SERVICE },
    { label: t('sales-by-date.label-product'), value: DISPLAY_ITEM_TYPE.PRODUCT },
  ]
  if (props.prepaidSalesCountingType === PREPAID_SALES_COUNTING_TYPE.SOLD) {
    baseOptions.push(
      { label: t('sales-by-date.label-prepaid-card'), value: DISPLAY_ITEM_TYPE.PREPAID_CARD },
      { label: t('sales-by-date.label-prepaid-service'), value: DISPLAY_ITEM_TYPE.PREPAID_SERVICE },
    )
  }
  return baseOptions
})

/**
 * Computed property for chart X-axis labels
 * Simple mapping of dates from data items
 */
const chartLabels = computed(() => {
  return props.data.map((item) => item.date)
})

/**
 * Computed property for current display type data points
 * Uses helper function to avoid code duplication
 * Re-computes when displayItemType changes
 */
const currentAmountByType: ComputedRef<number[]> = computed(() =>
  props.data.map((item) => getAmountByType(item, displayItemType.value)),
)

/**
 * Computed property for calculating totals across all data items
 * Uses reduce() for efficient single-pass calculation
 * Handles potential null/undefined values with fallback to 0
 */
const totals = computed(() => {
  return props.data.reduce(
    (acc, item) => ({
      serviceAmount: acc.serviceAmount + (item.serviceAmount || 0),
      productAmount: acc.productAmount + (item.productAmount || 0),
      prepaidCardAmount: acc.prepaidCardAmount + (item.prepaidCardAmount || 0),
      prepaidServiceAmount: acc.prepaidServiceAmount + (item.prepaidServiceAmount || 0),
      total: acc.total + (item.total || 0),
    }),
    {
      serviceAmount: 0,
      productAmount: 0,
      prepaidCardAmount: 0,
      prepaidServiceAmount: 0,
      total: 0,
    },
  )
})

/**
 * Computed property for calculating average amount
 * Prevents division by zero and uses the same logic as totals calculation
 */
const averageAmount: ComputedRef<number> = computed(() => {
  if (props.data.length === 0) return 0

  const totalAmount = getAmountByType(totals.value as SalesByDateReportItem, displayItemType.value)
  return totalAmount / props.data.length
})

/**
 * Computed property for average data array
 * PERFORMANCE OPTIMIZATION: Uses Array.fill() instead of map()
 *
 * Why Array.fill() is more performant:
 * 1. Array.fill() creates the array with a single value in one operation
 * 2. No iteration required - fills all positions with the same value instantly
 * 3. Lower memory allocation overhead
 * 4. No callback function execution for each element
 *
 * Previous approach: props.data.map(() => averageAmount.value)
 * - Iterates through each element in props.data
 * - Executes callback function props.data.length times
 * - Each callback creates a new closure
 *
 * Current approach: new Array(props.data.length).fill(averageAmount.value)
 * - Creates array of required length
 * - Fills all positions with the same value in single operation
 * - No iteration or callback overhead
 */
const averageData: ComputedRef<number[]> = computed(() => new Array(props.data.length).fill(averageAmount.value))

/**
 * Computed property for chart data structure
 * Combines labels and datasets for Chart.js consumption
 * Re-computes when displayItemType or data changes
 */
const chartData = computed(() => {
  return {
    labels: chartLabels.value,
    datasets: [
      {
        label: getLabelByType(displayItemType.value),
        data: currentAmountByType.value,
        fill: false,
        borderColor: 'green',
        pointBorderWidth: 3,
        pointBackgroundColor: 'green',
        tension: 0.3,
      },
      {
        label: `${t('general.average')} (${formatAmount(averageAmount.value) || 0})`,
        data: averageData.value,
        fill: false,
        borderColor: 'orange',
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.3,
      },
    ],
  }
})

/**
 * Computed property for chart configuration options
 * Handles theming, responsiveness, and chart behavior
 */
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 20,
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
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
})

/**
 * Helper function to get localized label for displayItemType
 * Centralizes label mapping to avoid repetitive if-else statements
 *
 * @param type - Display item type constant
 * @returns Localized label string for the specified type
 */
const getLabelByType = (type: number): string => {
  const labelMap: Record<number, string> = {
    [DISPLAY_ITEM_TYPE.ALL]: t('sales-by-date.label-total'),
    [DISPLAY_ITEM_TYPE.SERVICE]: t('sales-by-date.label-service'),
    [DISPLAY_ITEM_TYPE.PRODUCT]: t('sales-by-date.label-product'),
    [DISPLAY_ITEM_TYPE.PREPAID_CARD]: t('sales-by-date.label-prepaid-card'),
    [DISPLAY_ITEM_TYPE.PREPAID_SERVICE]: t('sales-by-date.label-prepaid-service'),
  }

  return labelMap[type] || t('general.all')
}

/**
 * Helper function to get amount value from item based on displayItemType
 * This eliminates code duplication by centralizing the type-to-property mapping
 *
 * @param item - Item containing different amount types
 * @param type - Display item type constant (ALL, SERVICE, PRODUCT, etc.)
 * @returns The amount value for the specified type, defaults to 0 if not found
 */
const getAmountByType = (item: SalesByDateReportItem, type: number): number => {
  const typeMap: Record<number, keyof SalesByDateReportItem> = {
    [DISPLAY_ITEM_TYPE.ALL]: 'total',
    [DISPLAY_ITEM_TYPE.SERVICE]: 'serviceAmount',
    [DISPLAY_ITEM_TYPE.PRODUCT]: 'productAmount',
    [DISPLAY_ITEM_TYPE.PREPAID_CARD]: 'prepaidCardAmount',
    [DISPLAY_ITEM_TYPE.PREPAID_SERVICE]: 'prepaidServiceAmount',
  }

  const key = typeMap[type]
  return key ? ((item[key] as number) ?? 0) : 0
}
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.select-display-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;

  .p-select {
    min-width: 200px;
  }
}
</style>
