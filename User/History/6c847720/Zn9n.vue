<template>
  <!-- Branch name column -->
  <Column field="branch" bodyClass="first-column" />

  <!-- Data columns -->
  <Column v-for="column in columns" :key="column.field" :field="column.field" :bodyClass="column.bodyClass">
    <template #body="slotProps">
      <template v-if="column.type === 'amount'">
        {{ formatAmount(slotProps.data[column.field]) }}
      </template>
      <template v-else>
        {{ slotProps.data[column.field] }}
      </template>
    </template>
  </Column>
</template>

<script setup lang="ts">
import { formatAmount } from '@/utils/common'
import type { ColumnConfig } from '@/constants/branchSalesTable'

interface Props {
  columns: ColumnConfig[]
}

defineProps<Props>()
</script>
