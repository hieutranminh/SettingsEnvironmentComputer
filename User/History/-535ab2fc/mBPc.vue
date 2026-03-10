<template>
  <div
    v-if="isMobileTooltip"
    v-tooltip.focus.bottom="{ value: tooltip, escape: false, class: 'tooltip-mw-400' }"
    tabindex="1"
    class="icon-question-tooltip"
  >
    <i class="pi pi-question-circle" size="32" />
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
  display: inline-block;
  cursor: pointer;

  .pi {
    font-size: 20px;
    color: var(--p-primary-color);
  }
}
</style>
