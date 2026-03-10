<template>
  <div
    class="icon-question-popover"
    @click="togglePopover"
    @mouseenter="op?.show($event)"
    @mouseleave="op?.hide($event)"
  >
    <i class="pi pi-question-circle" size="32" />
  </div>

  <Popover ref="op" :pt="{ content: { class: 'tooltip-mw-400' } }"> xxxx </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  tooltip: string
}>()

const op = ref(null)
</script>

<style lang="scss" scoped>
.icon-question-popover {
  display: inline-block;
  cursor: pointer;

  .pi {
    font-size: 20px;
    color: var(--p-primary-color);
  }
}
</style>
