<template>
  <Column :colspan="group.colspan" :headerClass="group.headerClass">
    <template #header>
      <span>{{ $t(group.labelKey) }}</span>
    </template>
  </Column>
</template>

<script setup lang="ts">
import type { HeaderGroup } from '@/types/sales-report/BranchSalesTable'

interface Props {
  group: HeaderGroup
}

defineProps<Props>()
</script>
