<template>
  <div :class="loadingClasses">
    <div class="loading-content">
      <!-- PrimeVue ProgressSpinner -->
      <ProgressSpinner
        strokeWidth="3"
        fill="none"
        class="loading-spinner"
        :animationDuration="animationDuration"
      />

      <!-- <div class="loading-too-slow">
        <div class="loading-too-slow__text">
          {{ $t('general.loading-too-slow') }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useLoadingStore } from '@/stores/common/loading'

const props = withDefaults(defineProps<Props>(), {
  show: true,
  message: '',
  size: 'small',
  type: 'overlay',
  backdrop: true,
  color: 'primary',
})

// Constants
const ANIMATION_DURATION = '0.7s'
const BACKDROP_DELAY_MS = 800
const TOO_SLOW_DELAY_MS = 5000

interface Props {
  show?: boolean
  message?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'overlay' | 'inline' | 'card'
  backdrop?: boolean
  color?: 'primary' | 'secondary' | 'white'
}

const animationDuration = ANIMATION_DURATION
const storeLoading = useLoadingStore()

const isBackdropActive = ref(false)
const isTooSlow = ref(false)

let backdropTimeoutId: number | null = null
let tooSlowTimeoutId: number | null = null

const clearTimers = (): void => {
  if (backdropTimeoutId !== null) {
    window.clearTimeout(backdropTimeoutId)
    backdropTimeoutId = null
  }

  if (tooSlowTimeoutId !== null) {
    window.clearTimeout(tooSlowTimeoutId)
    tooSlowTimeoutId = null
  }
}

watch(
  () => storeLoading.isLoading,
  (nextIsLoading) => {
    clearTimers()

    if (!nextIsLoading) {
      isBackdropActive.value = false
      isTooSlow.value = false
      return
    }

    isBackdropActive.value = false
    isTooSlow.value = false

    backdropTimeoutId = window.setTimeout(() => {
      if (storeLoading.isLoading) {
        isBackdropActive.value = true
      }
    }, BACKDROP_DELAY_MS)

    tooSlowTimeoutId = window.setTimeout(() => {
      if (storeLoading.isLoading) {
        isTooSlow.value = true
      }
    }, TOO_SLOW_DELAY_MS)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearTimers()
})

const loadingClasses = computed(() => [
  'loading',
  `loading-${props.type}`,
  `loading-${props.size}`,
  {
    'loading-visible': storeLoading.isLoading,
    'loading-fade-out': !storeLoading.isLoading,
    'loading-backdrop': props.backdrop && props.type === 'overlay' && isBackdropActive.value,
    'loading-no-backdrop': !props.backdrop && props.type === 'overlay',
  },
])
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.5s ease,
    visibility 0.5s ease;

  &.loading-visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  &.loading-fade-out {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      visibility 0.3s ease,
      opacity 0.3s ease;
  }

  // Overlay type - full screen
  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: 0.5rem;

    .loading-spinner {
      width: 35px;
      height: 35px;
    }
  }

  &-too-slow {
    text-align: center;
    color: $blue-color;
  }

  &-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: transparent;
    transition: background-color 1s ease;

    &.loading-backdrop {
      background-color: $overlay-backdrop;
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

  &__message {
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
