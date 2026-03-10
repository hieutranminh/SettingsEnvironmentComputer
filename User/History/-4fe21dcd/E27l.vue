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

<style scoped lang="scss"></style>
