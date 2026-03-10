<template>
  <div
    v-if="isMobileTooltip"
    v-tooltip.focus.bottom="{ value: tooltip, class: 'tooltip-mw-400' }"
    tabindex="1"
    class="icon-question-tooltip"
  >
    <i class="pi pi-question-circle" />
  </div>

  <div v-else v-tooltip.bottom="{ value: tooltip, class: 'tooltip-mw-400' }" tabindex="1" class="icon-question-tooltip">
    <i class="pi pi-question-circle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Composables
import { useDevice } from '@/composables/useDevice'

defineProps<{
  tooltip: string
}>()

const { isSmallScreen, isMediumScreen } = useDevice()

const isMobileTooltip = computed(() => {
  return isSmallScreen.value || isMediumScreen.value
})
</script>

<style lang="scss" scoped>
.icon-question-tooltip {
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: pointer;

  .pi {
    font-size: 20px;
    color: var(--p-primary-color);
  }
}
</style>
