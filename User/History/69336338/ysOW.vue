<template>
  <div class="table-section">
    <h4>{{ title }}</h4>
    <DataTable
      :ref="tableRef"
      :value="tableData"
      :rowHover="true"
      :scrollable="true"
      :tableStyle="TABLE_CONFIG.MIN_WIDTH_STYLE"
      :tableClass="TABLE_CONFIG.TABLE_CLASS"
      showGridlines
    >
      <!-- Header -->
      <ColumnGroup type="header">
        <Row>
          <Column 
            :rowspan="2" 
            :header="$t('clients-by-period.label-counting-basis')" 
            :headerClass="TABLE_CONFIG.HEADER_CLASSES.GRAY" 
          />
          <Column
            :colspan="headerConfig.mainColumnSpan"
            :header="headerConfig.mainColumnTitle"
            :headerClass="`${TABLE_CONFIG.HEADER_CLASSES.GRAY} ${TABLE_CONFIG.HEADER_CLASSES.BORDER_BOTTOM_0}`"
          />
          <Column
            v-if="headerConfig.rightColumn"
            :rowspan="2"
            :header="headerConfig.rightColumn.title"
            :headerClass="TABLE_CONFIG.HEADER_CLASSES.GRAY"
          />
          <Column
            v-if="headerConfig.grandTotalColumn"
            :rowspan="2"
            :header="headerConfig.grandTotalColumn.title"
            :headerClass="TABLE_CONFIG.HEADER_CLASSES.GRAY"
          />
        </Row>

        <Row>
          <Column 
            v-for="subColumn in headerConfig.subColumns" 
            :key="subColumn.key"
            :header="subColumn.title" 
            :headerClass="TABLE_CONFIG.HEADER_CLASSES.GRAY" 
          />
        </Row>
      </ColumnGroup>

      <!-- Body -->
      <Column 
        v-for="column in bodyColumns" 
        :key="column.field"
        :field="column.field"
      />

      <!-- Empty -->
      <template #empty>
        {{ $t('general.no-data-for-table') }}
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'

// Types
interface HeaderConfig {
  mainColumnSpan: number
  mainColumnTitle: string
  subColumns: Array<{
    key: string
    title: string
  }>
  rightColumn?: {
    title: string
  }
  grandTotalColumn?: {
    title: string
  }
}

interface BodyColumn {
  field: string
}

interface Props {
  title: string
  tableData: Array<Record<string, any>>
  headerConfig: HeaderConfig
  bodyColumns: BodyColumn[]
  tableRefName: string
}

const props = defineProps<Props>()

// Constants
const TABLE_CONFIG = {
  MIN_WIDTH_STYLE: 'min-width: 30rem',
  TABLE_CLASS: 'clients-by-period-table',
  HEADER_CLASSES: {
    GRAY: 'bg-gray',
    BORDER_BOTTOM_0: 'border-bottom-0'
  }
} as const

// Refs
const tableRef: Ref<any> = ref()

// Methods
const getDataTableDOM = (): HTMLElement | null => {
  if (tableRef.value) {
    return tableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

defineExpose({
  getDataTableDOM,
  tableRef
})
</script>

<style lang="scss" scoped>
.table-section {
  flex: 1;
  min-width: 0;

  h4 {
    margin-bottom: 0.5rem;
  }

  @include maxResponsive(mobile) {
    &:first-child {
      margin-bottom: 2rem;
    }
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
