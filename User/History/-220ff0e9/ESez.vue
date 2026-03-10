<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span v-if="loading" class="loading-spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  ariaLabel: undefined
})

const emit = defineEmits<Emits>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
    'base-button--full-width': props.fullWidth
  }
])

const handleClick = (event: MouseEvent): void => {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const handleKeyDown = (event: KeyboardEvent): void => {
  if (props.disabled || props.loading) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event as unknown as MouseEvent)
  }
}
</script>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  // Size variants
  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-height: 2rem;
  }

  &--md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 2.5rem;
  }

  &--lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    min-height: 3rem;
  }

  // Width variant
  &--full-width {
    width: 100%;
  }

  // Color variants
  &--primary {
    background-color: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background-color: #2563eb;
    }

    &:active:not(:disabled) {
      background-color: #1d4ed8;
    }
  }

  &--secondary {
    background-color: #6b7280;
    color: white;

    &:hover:not(:disabled) {
      background-color: #4b5563;
    }

    &:active:not(:disabled) {
      background-color: #374151;
    }
  }

  &--danger {
    background-color: #ef4444;
    color: white;

    &:hover:not(:disabled) {
      background-color: #dc2626;
    }

    &:active:not(:disabled) {
      background-color: #b91c1c;
    }
  }

  &--success {
    background-color: #10b981;
    color: white;

    &:hover:not(:disabled) {
      background-color: #059669;
    }

    &:active:not(:disabled) {
      background-color: #047857;
    }
  }

  &--warning {
    background-color: #f59e0b;
    color: white;

    &:hover:not(:disabled) {
      background-color: #d97706;
    }

    &:active:not(:disabled) {
      background-color: #b45309;
    }
  }

  // Loading state
  &--loading {
    cursor: wait;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
