<template>
  <DataTable
    ref="dataTableRef"
    :value="data"
    :rowHover="true"
    :scrollable="true"
    :style="{ display: 'none' }"
    :scrollHeight="BRANCH_SALES_TABLE_CONFIG.SCROLL_HEIGHT"
    :tableClass="BRANCH_SALES_TABLE_CONFIG.TABLE_CLASS"
    :dataKey="BRANCH_SALES_TABLE_CONFIG.DATA_KEY"
    showGridlines
  >
    <!-- Print-specific header -->
    <ColumnGroup type="header">
      <Row>
        <Column :rowspan="2" :header="$t('branch-sales.label-branch')" headerClass="bg-gray" />
        
        <!-- Service group header -->
        <Column
          v-for="group in printHeaderGroups"
          :key="group.label"
          :colspan="group.colspan"
          headerClass="bg-yellow border-bottom-0"
        >
          <template #header>
            <p>
              {{ $t(group.label) }}
              <span v-if="'suffix' in group && group.suffix" class="text-no-wrap"> ({{ group.suffix }})</span>
            </p>
          </template>
        </Column>
        
        <!-- Revenue total header -->
        <Column :rowspan="2" headerClass="bg-yellow">
          <template #header>
            <p>
              {{ $t('branch-sales.label-revenue-total') }} <br />
              (<span class="text-no-wrap">A + B</span>)
            </p>
          </template>
        </Column>
        
        <!-- Prepaid goods group header -->
        <Column
          :colspan="2"
          :header="$t('branch-sales.label-prepaid-goods-sales')"
          headerClass="bg-green border-bottom-0"
        />
        
        <!-- Sales total header -->
        <Column :rowspan="2" headerClass="bg-green">
          <template #header>
            <p>
              {{ $t('branch-sales.label-sales-total') }} <br />
              (<span class="text-blue text-no-wrap">S1 + S2 + S3 + S4</span>)
            </p>
          </template>
        </Column>
        
        <!-- Deduction header -->
        <Column
          :rowspan="2"
          :header="$t('branch-sales.label-prepaid-goods-deduction-total')"
          headerClass="bg-gray"
        />
      </Row>

      <!-- Sub-header row -->
      <Row>
        <Column
          v-for="column in printColumns"
          :key="column.field"
          :field="column.field"
          :headerClass="column.headerClass"
        >
          <template #header>
            <p class="text-no-wrap">
              {{ $t(column.headerKey) }}
              <span v-if="'headerSuffix' in column && column.headerSuffix" class="text-blue"> ({{ column.headerSuffix }})</span>
            </p>
          </template>
        </Column>
      </Row>
    </ColumnGroup>

    <!-- Empty state -->
    <template #empty> {{ $t('general.no-data-for-table') }} </template>

    <!-- Body -->
    <Column field="branch" bodyClass="first-column" />
    <Column
      v-for="column in printColumns"
      :key="column.field"
      :field="column.field"
      :bodyClass="column.bodyClass"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'amount'">
          {{ formatAmount(slotProps.data[column.field]) }}
        </template>
        <template v-else>
          {{ slotProps.data[column.field] }}
        </template>
      </template>
    </Column>

    <!-- Footer -->
    <ColumnGroup v-if="data.length" type="footer">
      <Row>
        <Column :footer="$t('general.totals')" footerClass="bg-gray first-column" />
        <Column
          v-for="column in printColumns"
          :key="column.field"
          :footer="formatAmount(summaryTotals[column.field as keyof typeof summaryTotals])"
          :footerClass="column.headerClass"
        />
      </Row>
    </ColumnGroup>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatAmount } from '@/utils/common'
import { 
  BRANCH_SALES_TABLE_CONFIG, 
  PRINT_TABLE_COLUMNS, 
  PRINT_TABLE_HEADER_GROUPS 
} from '@/constants/branchSalesTable'
import type { BranchSalesReportData, BranchSalesSummaryTotals } from '@/composables/useBranchSalesCalculations'

interface Props {
  data: BranchSalesReportData[]
  summaryTotals: BranchSalesSummaryTotals
}

defineProps<Props>()

const dataTableRef = ref()

// Use print-specific configurations
const printColumns = PRINT_TABLE_COLUMNS
const printHeaderGroups = PRINT_TABLE_HEADER_GROUPS

/**
 * Get DataTable DOM element for print functionality
 * 
 * @returns HTMLElement | null - The table element or null if not found
 */
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

defineExpose({
  getDataTableDOM,
})
</script>
