<template>
  <ColumnGroup v-if="showFooter" type="footer">
    <Row>
      <!-- Totals label -->
      <Column :footer="$t('general.totals')" footerClass="bg-gray first-column" />
      
      <!-- Data columns footer -->
      <Column
        v-for="column in columns"
        :key="column.field"
        :footer="formatAmount(summaryTotals[column.field as keyof typeof summaryTotals])"
        :footerClass="column.headerClass"
      />
    </Row>
  </ColumnGroup>
</template>

<script setup lang="ts">
import { formatAmount } from '@/utils/common'
import type { ColumnConfig } from '@/constants/branchSalesTable'
import type { BranchSalesSummaryTotals } from '@/composables/useBranchSalesCalculations'

interface Props {
  columns: ColumnConfig[]
  summaryTotals: BranchSalesSummaryTotals
  showFooter: boolean
}

defineProps<Props>()
</script>
