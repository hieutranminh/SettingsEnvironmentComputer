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
        :aria-describedby="errorId"
        :aria-invalid="hasError"
        :class="inputClasses"
        :tabindex="disabled ? -1 : 0"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeyDown"
      />

      <div v-if="hasError" :id="errorId" class="base-input__error" role="alert">
        {{ errorMessage }}
      </div>

      <div v-if="hint" class="base-input__hint">
        {{ hint }}
      </div>
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
  error?: string
  hint?: string
  id?: string
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
  required: false
})

const emit = defineEmits<Emits>()

const inputRef = ref<HTMLInputElement>()
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
const errorId = computed(() => `${inputId.value}-error`)

const inputValue = computed({
  get: () => String(props.modelValue || ''),
  set: (value: string) => emit('update:modelValue', value)
})

const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error || '')

const inputClasses = computed(() => [
  'base-input--error',
  {
    'base-input--error': hasError.value,
    'base-input--disabled': props.disabled,
    'base-input--readonly': props.readonly
  }
])

const handleInput = (event: Event) => {
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleKeyDown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

// Expose focus method
const focus = async () => {
  await nextTick()
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<style scoped lang="scss">
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-input__label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.base-input__required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.base-input__container {
  position: relative;
}

.base-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #111827;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
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
}

.base-input__error {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.base-input__hint {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
