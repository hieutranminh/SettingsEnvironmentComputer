<template>
  <template v-for="month in months" :key="`col-${month}`">
    <Column>
      <template #body="{ data }">
        {{ getRepeatClientsForMonth(data, month) }}
      </template>
    </Column>
    <Column>
      <template #body="{ data, index }">
        {{ formatRepeatPercentage(data, month, index) }}
      </template>
    </Column>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { formatPercentage } from '@/utils/common'
import type { TableRow } from './NewClientsRepeatTable.vue'

interface Props {
  months: number[]
  tableRows: TableRow[]
}

// Props
const props = defineProps<Props>()

/**
 * Gets repeat clients count for a specific month from table row
 * @param {TableRow} data - Table row data with repeat data map
 * @param {number} month - Month to get clients for (YYYYMM format)
 * @returns {number} Number of repeat clients for the month
 * @example getRepeatClientsForMonth(row, 202301) // 15
 */
const getRepeatClientsForMonth = (data: TableRow, month: number): number => {
  return data.repeatDataMap.get(month)?.totalRepeatClients ?? 0
}

/**
 * Calculates and formats repeat percentage for display
 * @param {TableRow} data - Table row data
 * @param {number} month - Month to calculate percentage for  
 * @param {number} rowIndex - Row index for cache lookup
 * @returns {string} Formatted percentage string
 * @example formatRepeatPercentage(row, 202301, 0) // "25.50%"
 */
const formatRepeatPercentage = (data: TableRow, month: number, rowIndex: number): string => {
  const clients = getRepeatClientsForMonth(data, month)
  if (clients === 0 || data.totalNewClients === 0) return ''
  
  const percentage = (clients / data.totalNewClients) * 100
  return formatPercentage(percentage)
}
</script>
</template>
