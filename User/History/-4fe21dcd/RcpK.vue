<template>
  <DatePicker
    v-model="internalValue"
    :mode="mode"
    :is-required="isRequired"
    :is-range="isRange"
    :disabled="disabled"
    :placeholder="placeholder"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    :masks="masks"
    :popover="popoverConfig"
    :color="color"
    :timezone="timezone"
    v-bind="$attrs"
  >
    <template #default="{ inputValue, inputEvents, isDragging }">
      <div class="app-date-picker">
        <input
          :class="['date-input', { 'is-dragging': isDragging, 'has-error': hasError }]"
          :placeholder="placeholder"
          :disabled="disabled"
          :value="inputValue"
          v-on="inputEvents"
        />
        <i class="pi pi-calendar calendar-icon" />
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DatePicker } from 'v-calendar'

type DateMode = 'date' | 'dateTime' | 'time'

interface Props {
  modelValue?: Date | { start: Date; end: Date } | null
  mode?: DateMode
  isRequired?: boolean
  isRange?: boolean
  disabled?: boolean
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | { start: Date; end: Date }[] | ((date: Date) => boolean)
  color?: string
  timezone?: string
  hasError?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: Date | { start: Date; end: Date } | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  mode: 'date',
  isRequired: false,
  isRange: false,
  disabled: false,
  placeholder: 'Select date',
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  color: 'blue',
  timezone: undefined,
  hasError: false,
})

const emit = defineEmits<Emits>()

const internalValue = computed<Date | { start: Date; end: Date } | null>({
  get: () => props.modelValue,
  set: (value: Date | { start: Date; end: Date } | null) => {
    emit('update:modelValue', value)
  },
})

const masks = computed(() => {
  if (props.mode === 'dateTime') {
    return {
      input: 'YYYY-MM-DD HH:mm',
    }
  }
  if (props.mode === 'time') {
    return {
      input: 'HH:mm',
    }
  }
  return {
    input: 'YYYY-MM-DD',
  }
})

const popoverConfig = computed(() => ({
  visibility: 'click' as const,
  placement: 'bottom-start' as const,
}))
</script>

<style scoped lang="scss">
.app-date-picker {
  position: relative;
  width: 100%;

  .date-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    font-size: var(--p-font-size-base);
    font-family: inherit;
    border: 1px solid var(--p-inputtext-border-color);
    border-radius: var(--p-border-radius);
    background: var(--p-inputtext-background);
    color: var(--p-inputtext-color);
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: var(--p-inputtext-hover-border-color);
    }

    &:focus {
      outline: none;
      border-color: var(--p-inputtext-focus-border-color);
      box-shadow: 0 0 0 0.2rem var(--p-focus-ring-color);
    }

    &:disabled {
      background: var(--p-inputtext-disabled-background);
      color: var(--p-inputtext-disabled-color);
      cursor: not-allowed;
      opacity: 0.6;
    }

    &.has-error {
      border-color: var(--p-error-color);

      &:focus {
        box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2);
      }
    }

    &.is-dragging {
      border-color: var(--p-primary-color);
      background: var(--p-primary-50);
    }

    &::placeholder {
      color: var(--p-inputtext-placeholder-color);
    }
  }

  .calendar-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-text-muted-color);
    pointer-events: none;
  }
}
</style>

