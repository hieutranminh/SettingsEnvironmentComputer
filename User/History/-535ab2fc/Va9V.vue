<template>
  <div
    v-tooltip.focus.bottom="{ value: tooltip, escape: false, class: 'tooltip-mw-400' }"
    tabindex="1"
    class="icon-question-tooltip"
  >
    <i class="pi pi-question-circle" size="32" />
  </div>
  <div v-if="isTablet">AA</div>
  <div v-else>BB</div>
</template>

<script setup lang="ts">
// Composables
import { useDevice } from '@/composables/useDevice'

defineProps<{
  tooltip: string
}>()

const { isTablet } = useDevice()
</script>

<style lang="scss" scoped>
.icon-question-tooltip {
  display: inline-block;
  cursor: pointer;

  .pi {
    font-size: 20px;
    color: var(--p-primary-color);
  }
}
</style>
