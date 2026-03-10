<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input__label">
      {{ label }}
      <span v-if="required" class="input__required">*</span>
    </label>

    <div class="input__container">
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
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeyDown"
      />

      <div v-if="error" class="input__error">
        {{ error }}
      </div>

      <div v-if="hint" class="input__hint">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  autocomplete?: string
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
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const inputValue = computed({
  get: () => String(props.modelValue || ''),
  set: (value: string) => emit('update:modelValue', value)
})

const inputClasses = computed(() => [
  'input',
  `input--${props.size}`,
  {
    'input--error': !!props.error,
    'input--disabled': props.disabled,
    'input--readonly': props.readonly
  }
])

const handleInput = (event: Event): void => {
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

defineExpose({ focus })
</script>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  cursor: pointer;
}

.input__required {
  color: var(--error-color);
  margin-left: var(--spacing-xs);
}

.input__container {
  position: relative;
}

.input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family-primary);
  transition: all var(--transition-fast);
  outline: none;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &:disabled {
    background-color: var(--bg-light);
    color: var(--text-light);
    cursor: not-allowed;
  }

  &:readonly {
    background-color: var(--bg-light);
  }

  &--error {
    border-color: var(--error-color);

    &:focus {
      border-color: var(--error-color);
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
  }

  // Sizes
  &--sm {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    min-height: 32px;
  }

  &--md {
    padding: var(--spacing-md);
    font-size: var(--font-size-md);
    min-height: 40px;
  }

  &--lg {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
    min-height: 48px;
  }

  &::placeholder {
    color: var(--text-light);
  }
}

.input__error {
  font-size: var(--font-size-sm);
  color: var(--error-color);
  margin-top: var(--spacing-xs);
}

.input__hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
