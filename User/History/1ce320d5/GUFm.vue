<template>
  <div :class="loadingClasses" :style="{ display: storeLoading.isLoading ? 'block' : 'none' }">
    <div class="loading-content">
      <!-- PrimeVue ProgressSpinner -->
      <ProgressSpinner
        :style="{ width: '50px', height: '50px' }"
        strokeWidth="3"
        fill="none"
        :animationDuration="animationDuration"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import { computed } from 'vue'

import { useLoadingStore } from '@/stores/common/loading'

const props = withDefaults(defineProps<Props>(), {
  show: true,
  message: '',
  size: 'medium',
  type: 'overlay',
  backdrop: true,
  color: 'primary',
})

// Constants
const ANIMATION_DURATION = '1.2s'

interface Props {
  show?: boolean
  message?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'overlay' | 'inline' | 'card'
  backdrop?: boolean
  color?: 'primary' | 'secondary' | 'white'
}

const loadingClasses = computed(() => [
  'loading',
  `loading-${props.type}`,
  `loading-${props.size}`,
  {
    'loading-backdrop': props.backdrop && props.type === 'overlay',
    'loading-no-backdrop': !props.backdrop && props.type === 'overlay',
  },
])

const animationDuration = ANIMATION_DURATION
const storeLoading = useLoadingStore()
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;

  // Overlay type - full screen
  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: 1rem;
  }

  &-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;

    &.loading-backdrop {
      background-color: rgb(0 0 0 / 50%);
    }

    &.loading-no-backdrop {
      background-color: transparent;
      pointer-events: none;

      .loading-content {
        pointer-events: all;
      }
    }
  }

  // Inline type - fits container
  &-inline {
    position: relative;
    width: 100%;
    min-height: 60px;
  }

  // Card type - with background
  &-card {
    position: relative;
    background: $white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    padding: 2rem;
    min-width: 200px;
  }

  &__message {
    font-size: 0.9rem;
    text-align: center;
    font-weight: 500;
  }
}

// Responsive adjustments
@media (width <= 768px) {
  .loading {
    &--card {
      margin: 1rem;
      min-width: auto;
      width: calc(100% - 2rem);
    }
  }
}
</style>
