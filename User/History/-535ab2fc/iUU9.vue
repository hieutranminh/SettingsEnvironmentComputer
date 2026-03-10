<template>
  <div class="icon-question-tooltip">
    <i class="pi pi-question-circle" size="32" />
  </div>

  <Popover ref="op"> xxxx </Popover>
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
