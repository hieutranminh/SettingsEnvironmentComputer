<template>
  <div
    v-tooltip.bottom="{ value: tooltip, escape: false, focus: true, class: 'tooltip-mw-400' }"
    tabindex="1"
    class="icon-question-tooltip"
  >
    <i class="pi pi-question-circle" size="32" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tooltip: string
}>()
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
