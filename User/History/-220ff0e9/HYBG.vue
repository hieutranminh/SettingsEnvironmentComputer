<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span v-if="isLoading" class="loading-spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  isLoading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  isLoading: false,
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
    'base-button--loading': props.isLoading,
    'base-button--full-width': props.fullWidth
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.isLoading) {
    emit('click', event)
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.disabled && !props.isLoading) {
    emit('keydown', event)
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
  text-decoration: none;
  outline: none;

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  // Size variants
  &--small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &--medium {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &--large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
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

  // Full width
  &--full-width {
    width: 100%;
  }

  // Loading state
  &--loading {
    cursor: wait;
  }
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
