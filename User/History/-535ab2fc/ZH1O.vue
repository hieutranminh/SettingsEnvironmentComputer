<template>
  <div v-tooltip.focus="{ value: tooltip, escape: false, class: 'tooltip-mw-400' }" class="icon-question-tooltip">
    <i class="pi pi-question-circle" size="32" />
  </div>
  <Button v-tooltip.focus.top="'Enter your username'" type="text" placeholder="Focus">â</Button>
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
