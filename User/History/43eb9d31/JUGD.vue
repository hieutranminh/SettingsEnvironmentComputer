<template>
  <div class="table-print-template">
    <div class="print-table-container">
      <table class="print-table">
        <thead>
          <tr>
            <th
              v-for="column in visibleColumns"
              :key="column.field"
              :style="{ width: column.width ? `${column.width}px` : 'auto' }"
              :class="column.align ? `text-${column.align}` : ''"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in visibleData"
            :key="index"
            class="print-table-row"
          >
            <td
              v-for="column in visibleColumns"
              :key="column.field"
              :class="column.align ? `text-${column.align}` : ''"
            >
              {{ formatCellValue(row[column.field]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { PrintData, PrintConfiguration, TableColumn } from '@/types/print'

interface Props {
  printData: PrintData
  currentPage: number
  configuration: PrintConfiguration
}

const props = defineProps<Props>()

const visibleColumns = computed(() => {
  return props.printData.columns || []
})

const visibleData = computed(() => {
  if (!props.printData.printData) return []

  if (!props.printData.enablePagination) {
    return props.printData.printData
  }

  const rowsPerPage = props.printData.rowsPerPage || 20
  const startIndex = (props.currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  return props.printData.printData.slice(startIndex, endIndex)
})

const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
</script>

<style scoped>
.table-print-template {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.print-table-container {
  width: 100%;
}

.print-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--surface-border);
}

.print-table th,
.print-table td {
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  text-align: left;
}

.print-table th {
  background-color: var(--surface-100);
  font-weight: 600;
}

.print-table-row:nth-child(even) {
  background-color: var(--surface-50);
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

@media print {
  .table-print-template {
    overflow: visible;
  }

  .print-table {
    page-break-inside: auto;
  }

  .print-table-row {
    page-break-inside: avoid;
  }
}
</style>
