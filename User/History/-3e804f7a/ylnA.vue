<template>
  <Card>
    <template #content>
      <!-- Main Table -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        :tableStyle="`min-width: ${BRANCH_SALES_TABLE_CONFIG.MIN_WIDTH}`"
        :scrollHeight="BRANCH_SALES_TABLE_CONFIG.SCROLL_HEIGHT"
        :tableClass="BRANCH_SALES_TABLE_CONFIG.TABLE_CLASS"
        :dataKey="BRANCH_SALES_TABLE_CONFIG.DATA_KEY"
        showGridlines
      >
        <!-- Header -->
        <BranchSalesTableHeader
          :columns="mainTableColumns"
          :headerGroups="mainTableHeaderGroups"
        />

        <!-- Empty state -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <BranchSalesTableBody :columns="mainTableColumns" />

        <!-- Footer -->
        <BranchSalesTableFooter
          :columns="mainTableColumns"
          :summaryTotals="summaryTotals"
          :showFooter="transformedData.length > 0"
        />
      </DataTable>

      <!-- Print Table -->
      <BranchSalesPrintTable
        ref="printTableRef"
        :data="transformedData"
        :summaryTotals="summaryTotals"
      />

      <!-- Load More -->
      <div v-if="hasMoreItems" class="load-more">
        <p>
          {{
            $t('branch-sales.total-of-records', {
              sumItems: props.data?.length || 0,
              items: pagingInfo?.totalItems || 0,
            })
          }}
        </p>
        <Button :label="$t('general.more')" @click="handleLoadMore" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Components
import BranchSalesTableHeader from '@/components/tables/BranchSalesTableHeader.vue'
import BranchSalesTableBody from '@/components/tables/BranchSalesTableBody.vue'
import BranchSalesTableFooter from '@/components/tables/BranchSalesTableFooter.vue'
import BranchSalesPrintTable from '@/components/tables/BranchSalesPrintTable.vue'

// Constants
import { PRINT_TYPE } from '@/constants'
import { 
  BRANCH_SALES_TABLE_CONFIG, 
  MAIN_TABLE_COLUMNS, 
  MAIN_TABLE_HEADER_GROUPS 
} from '@/constants/branchSalesTable'

// Composables
import { useBranchSalesCalculations } from '@/composables/useBranchSalesCalculations'

// Types
import type { ListResponse } from '@/types/ApiResponse'
import type { PrintSection } from '@/types/print'
import type { BranchSalesTotalReportItem } from '@/types/sales-report/BranchSales'

interface Props {
  data?: BranchSalesTotalReportItem[]
  pagingInfo?: ListResponse<BranchSalesTotalReportItem>['pagingInfo']
}

interface Emits {
  (e: 'loadMore'): void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  pagingInfo: undefined,
})

const emit = defineEmits<Emits>()

// Refs
const dataTableRef = ref()
const printTableRef = ref()

// Use business logic composable
const { transformedData, summaryTotals } = useBranchSalesCalculations(props.data || [])

// Table configurations
const mainTableColumns = MAIN_TABLE_COLUMNS
const mainTableHeaderGroups = MAIN_TABLE_HEADER_GROUPS

// Check if there are more items to load
const hasMoreItems = computed(() => {
  if (!props.pagingInfo) return false
  const currentItems = props.data?.length || 0
  return currentItems < props.pagingInfo.totalItems
})

/**
 * Handle load more button click
 * Emits loadMore event to parent component
 */
const handleLoadMore = (): void => {
  emit('loadMore')
}

/**
 * Get DataTable DOM element for print functionality
 * 
 * @returns HTMLElement | null - The table element or null if not found
 */
const getDataTableDOM = (): HTMLElement | null => {
  if (printTableRef.value) {
    return printTableRef.value.getDataTableDOM()
  }
  return null
}

/**
 * Get print configuration for PDF generation
 * 
 * @returns PrintSection - Configuration object for print functionality
 * @throws Error if table element is not found
 */
const getPrintConfiguration = (): PrintSection => {
  const tableElement = getDataTableDOM()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    tableStyles: {
      // Custom cell parsing for this table
      didParseCell: (data: {
        column: { index: number }
        section: string
        cell: { styles: { halign?: string } }
      }): void => {
        // First column (index 0) should be center aligned for all sections
        if (data.column.index === 0) {
          data.cell.styles.halign = 'center'
        } else {
          // Other columns: check section type for proper alignment
          if (data.section === 'head') {
            // Header section - keep center alignment
            data.cell.styles.halign = 'center'
          } else {
            // Body and footer sections - right alignment
            data.cell.styles.halign = 'right'
          }
        }
      },
    },
  }
}

defineExpose({
  getDataTableDOM,
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

:deep(.branch-sales-table) {
  .p-datatable-column-header-content {
    text-align: center;
    justify-content: center;
  }

  .p-datatable-column-title {
    font-weight: 400;
  }

  .p-datatable-tbody,
  .p-datatable-tfoot {
    & > tr {
      & > td {
        text-align: right;
      }

      & > td.first-column {
        text-align: center;
        min-width: 150px;
      }
    }

    .p-datatable-empty-message {
      & > td {
        text-align: center;
      }
    }
  }

  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .bg-yellow {
    background-color: var(--p-yellow-100);
  }

  .bg-green {
    background-color: var(--p-green-100);
  }

  .border-bottom-0 {
    border-bottom: none;
  }

  .text-blue {
    color: var(--p-blue-500);
  }

  .text-no-wrap {
    white-space: nowrap;
  }
}

.load-more {
  @include flexCenter;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
