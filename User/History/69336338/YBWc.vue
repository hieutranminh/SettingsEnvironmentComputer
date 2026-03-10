<template>
  <div class="clients-by-period-data-table">
    <h4>{{ title }}</h4>
    <DataTable
      :ref="tableRefName"
      :value="data"
      :rowHover="true"
      :scrollable="true"
      tableStyle="min-width: 30rem"
      tableClass="clients-by-period-table"
      showGridlines
    >
      <!-- Dynamic Header -->
      <ColumnGroup type="header">
        <Row v-for="(row, rowIndex) in headerRows" :key="`header-row-${rowIndex}`">
          <Column
            v-for="(column, colIndex) in row.columns"
            :key="`header-col-${rowIndex}-${colIndex}`"
            :header="column.header"
            :headerClass="column.headerClass"
            :rowspan="column.rowspan"
            :colspan="column.colspan"
          />
        </Row>
      </ColumnGroup>

      <!-- Dynamic Body Columns -->
      <Column
        v-for="field in bodyFields"
        :key="`body-${field}`"
        :field="field"
      />

      <!-- Empty State -->
      <template #empty>
        {{ $t('general.no-data-for-table') }}
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
import type { TableRowData, TableHeaderRowConfig } from '@/types/client-report/ClientsByPeriodTable'

interface Props {
  title: string
  data: TableRowData[]
  headerRows: TableHeaderRowConfig[]
  bodyFields: string[]
  tableRefName: string
}

const props = defineProps<Props>()

// Computed properties for better readability
const tableRef = computed(() => props.tableRefName)
</script>

<style lang="scss" scoped>
.clients-by-period-data-table {
  h4 {
    margin-bottom: 0.5rem;
  }
}

:deep(.clients-by-period-table) {
  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .border-bottom-0 {
    border-bottom: none;
  }

  .p-datatable-thead {
    & > tr {
      & > th {
        .p-datatable-column-header-content {
          justify-content: center;
          text-align: center;
        }
      }
    }
  }

  .p-datatable-tbody,
  .p-datatable-tfoot {
    & > tr {
      & > td {
        text-align: center;
      }
    }

    .p-datatable-empty-message {
      & > td {
        text-align: center;
      }
    }
  }
}
</style>