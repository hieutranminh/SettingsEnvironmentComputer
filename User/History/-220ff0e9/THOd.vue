<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span v-if="loading" class="button__loader">
      <svg class="button__spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    </span>
    <span v-else class="button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  rounded?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false,
  rounded: false
})

const emit = defineEmits<Emits>()

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    'button--disabled': props.disabled,
    'button--loading': props.loading,
    'button--full-width': props.fullWidth,
    'button--rounded': props.rounded
  }
])

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const handleKeyDown = (event: KeyboardEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('keydown', event)
  }
}
</script>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;

  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  // Variants
  &--primary {
    background-color: var(--primary-color);
    color: var(--text-white);

    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }
  }

  &--secondary {
    background-color: var(--secondary-color);
    color: var(--text-white);

    &:hover:not(:disabled) {
      background-color: var(--secondary-dark);
    }
  }

  &--success {
    background-color: var(--success-color);
    color: var(--text-white);

    &:hover:not(:disabled) {
      background-color: #229954;
    }
  }

  &--warning {
    background-color: var(--warning-color);
    color: var(--text-white);

    &:hover:not(:disabled) {
      background-color: var(--accent-dark);
    }
  }

  &--error {
    background-color: var(--error-color);
    color: var(--text-white);

    &:hover:not(:disabled) {
      background-color: #c0392b;
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);

    &:hover:not(:disabled) {
      background-color: var(--primary-color);
      color: var(--text-white);
    }
  }

  // Sizes
  &--sm {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    min-height: 32px;
  }

  &--md {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-md);
    min-height: 40px;
  }

  &--lg {
    padding: var(--spacing-lg) var(--spacing-xl);
    font-size: var(--font-size-lg);
    min-height: 48px;
  }

  // Modifiers
  &--full-width {
    width: 100%;
  }

  &--rounded {
    border-radius: var(--border-radius-xl);
  }

  &--loading {
    cursor: wait;
  }

  // Content
  &__content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__spinner {
    width: 1em;
    height: 1em;
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
