<template>
  <div class="table-print-template">
    <h2 class="text-2xl font-bold mb-4">{{ config.title }}</h2>

    <table class="print-table">
      <thead>
        <tr>
          <th
            v-for="column in visibleColumns"
            :key="column.field"
            :style="getColumnStyle(column)"
          >
            {{ column.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
        >
          <td
            v-for="column in visibleColumns"
            :key="column.field"
            :style="getColumnStyle(column)"
          >
            {{ formatCellValue(row, column) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: Array,
  config: Object
})

const visibleColumns = computed(() => {
  if (props.config.selectedColumns?.length > 0) {
    return props.config.selectedColumns
  }

  // Auto-generate columns from data
  if (props.data?.length > 0) {
    return Object.keys(props.data[0]).map(key => ({
      field: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
    }))
  }

  return []
})

const getColumnStyle = (column) => {
  const width = props.config.columnWidths?.[column.field]
  const align = column.align || 'left'

  return {
    width: width ? \`\${width}px\` : 'auto',
    textAlign: align
  }
}

const formatCellValue = (row, column) => {
  const value = row[column.field]

  if (column.formatter) {
    return column.formatter(value, row)
  }

  if (value === null || value === undefined) {
    return ''
  }

  if (column.type === 'date' && value) {
    return new Date(value).toLocaleDateString()
  }

  if (column.type === 'currency' && typeof value === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return value
}
</script>

<style scoped>
.print-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.print-table th,
.print-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.print-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: left;
}

.print-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

@media print {
  .print-table {
    page-break-inside: auto;
  }

  .print-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
