<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required" aria-label="required">*</span>
    </label>

    <div class="base-input__container">
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-describedby="errorId"
        :aria-invalid="hasError"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeyDown"
      />

      <div v-if="icon" class="base-input__icon" aria-hidden="true">
        <slot name="icon">
          <span class="base-input__icon-text">{{ icon }}</span>
        </slot>
      </div>
    </div>

    <div v-if="hasError" :id="errorId" class="base-input__error" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="hint" class="base-input__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  icon?: string
  hint?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md'
})

const emit = defineEmits<Emits>()

const inputRef = ref<HTMLInputElement>()
const inputValue = ref(props.modelValue)

// Generate unique IDs for accessibility
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const errorId = `error-${Math.random().toString(36).substr(2, 9)}`

// Computed properties
const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error || '')

const inputClasses = computed(() => [
  'base-input',
  `base-input--${props.size}`,
  {
    'base-input--error': hasError.value,
    'base-input--disabled': props.disabled,
    'base-input--readonly': props.readonly,
    'base-input--with-icon': !!props.icon
  }
])

// Event handlers
const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = target.value

  inputValue.value = value
  emit('update:modelValue', value)
  emit('input', event)
}

const handleBlur = (event: FocusEvent): void => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent): void => {
  emit('focus', event)
}

const handleKeyDown = (event: KeyboardEvent): void => {
  emit('keydown', event)
}

// Expose focus method
const focus = async (): Promise<void> => {
  await nextTick()
  inputRef.value?.focus()
}

// Expose blur method
const blur = (): void => {
  inputRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur
})
</script>

<style scoped lang="scss">
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.base-input__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.base-input__required {
  color: #ef4444;
  margin-left: 0.125rem;
}

.base-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  transition: all 0.2s ease-in-out;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }

  &:readonly {
    background-color: #f9fafb;
  }

  &--error {
    border-color: #ef4444;

    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  // Size variants
  &--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    min-height: 2rem;
  }

  &--md {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    min-height: 2.5rem;
  }

  &--lg {
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    min-height: 3rem;
  }

  // Icon positioning
  &--with-icon {
    padding-right: 2.5rem;
  }
}

.base-input__icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.base-input__icon-text {
  font-size: 1.25rem;
}

.base-input__error {
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.base-input__hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
</style>
