<template>
  <VDatePicker
    v-model="internalValue"
    :mode="mode"
    :is-required="required"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    :timezone="timezone"
    :color="color"
    :is-dark="isDark"
    :masks="masks"
    :popover="{ visibility: 'click' }"
    :trim-weeks="trimWeeks"
    :show-iso-weeknumbers="showIsoWeeknumbers"
    v-bind="$attrs"
  >
    <template #default="{ inputValue, inputEvents }">
      <IconField>
        <InputText
          :model-value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          fluid
          v-on="inputEvents"
        />
        <InputIcon class="pi pi-calendar" />
      </IconField>
    </template>
  </VDatePicker>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: Date | null
  placeholder?: string
  required?: boolean
  disabled?: boolean
  mode?: 'date' | 'dateTime' | 'time'
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | { start: Date; end: Date }[]
  timezone?: string
  color?: string
  isDark?: boolean
  trimWeeks?: boolean
  showIsoWeeknumbers?: boolean
  masks?: {
    input?: string
    data?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select date',
  required: false,
  disabled: false,
  mode: 'date',
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  timezone: undefined,
  color: 'blue',
  isDark: false,
  trimWeeks: false,
  showIsoWeeknumbers: false,
  masks: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: Date | null): void
}>()

const internalValue = computed({
  get(): Date | null {
    return props.modelValue ?? null
  },
  set(value: Date | null): void {
    emit('update:modelValue', value)
  },
})
</script>

<style lang="scss">
// Remove gray background from calendar navigation hover
:deep(.vc-arrow) {
  &:hover {
    background-color: transparent !important;
  }
}

// Style for calendar navigation arrows
:deep(.vc-nav-arrow) {
  background-color: transparent !important;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }
}

// Ensure adjacent month dates are visible with reduced opacity
:deep(.vc-day.is-not-in-month) {
  opacity: 0.4;

  .vc-day-content {
    color: var(--text-color-secondary);
  }
}
</style>
