<template>
  <Column
    :field="config.field"
    :headerClass="config.headerClass"
    :bodyClass="config.bodyClass"
    :footerClass="config.footerClass"
    :colspan="config.colspan"
    :rowspan="config.rowspan"
  >
    <!-- Header Template -->
    <template #header>
      <p v-if="config.customHeader" :class="textNoWrapClass">
        {{ $t(config.headerKey) }}
        <span v-if="config.customHeader" class="text-blue">({{ config.customHeader }})</span>
      </p>
      <p v-else-if="config.isAmount && config.customHeader" :class="textNoWrapClass">
        {{ $t(config.headerKey) }}
        <span class="text-blue">({{ config.customHeader }})</span>
      </p>
      <span v-else>{{ $t(config.headerKey) }}</span>
    </template>

    <!-- Body Template -->
    <template #body="{ data }">
      <span v-if="config.isAmount">{{ formatAmount(data[config.field]) }}</span>
      <span v-else>{{ data[config.field] }}</span>
    </template>

    <!-- Footer Template -->
    <template v-if="config.showInFooter" #footer>
      <span v-if="config.isAmount">{{ formatAmount(totalData[config.field]) }}</span>
      <span v-else>{{ totalData[config.field] }}</span>
    </template>
  </Column>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatAmount } from '@/utils/common'
import type { ColumnConfig, BranchSalesReportData } from '@/types/sales-report/BranchSalesTable'

interface Props {
  config: ColumnConfig
  data: BranchSalesReportData[]
  totalData: Omit<BranchSalesReportData, 'shopId' | 'branch'>
}

defineProps<Props>()

/**
 * Computed class for text no-wrap styling
 * @returns CSS class string for text no-wrap
 */
const textNoWrapClass = computed(() => 'text-no-wrap')
</script>
