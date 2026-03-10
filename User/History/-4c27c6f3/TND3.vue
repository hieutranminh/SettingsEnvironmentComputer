<template>
  <BaseField
    :field-id="name"
    :label="label"
    :help-text="helpText"
    :error="error"
    :required="required"
  >
    <template #default="{ ariaDescribedBy }">
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
        :masks="computedMasks"
        :popover="{ visibility: 'click' }"
        v-bind="$attrs"

      >
        <template #default="{ inputValue, inputEvents }">
          <IconField>
            <InputText
              :id="name"
              :name="name"
              :model-value="inputValue"
              :placeholder="placeholder"
              :disabled="disabled"
              :invalid="!!error"
              :size="size"
              :aria-describedby="ariaDescribedBy"
              aria-haspopup="dialog"
              fluid
              v-on="inputEvents"
            />
            <InputIcon class="pi pi-calendar" />
          </IconField>
        </template>
      </VDatePicker>
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DEFAULT_DATE_MASKS, DEFAULT_DATETIME_MASKS, DEFAULT_TIME_MASKS } from '@/constants'
import BaseField from './BaseField.vue'
import type { FieldSize } from './types'

defineOptions({ inheritAttrs: false })

interface DateMasks {
  input?: string
  data?: string
}

type DateMode = 'date' | 'dateTime' | 'time'

interface Props {
  modelValue?: Date | null
  name: string
  label?: string
  placeholder?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  required?: boolean
  size?: FieldSize
  mode?: DateMode
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | { start: Date; end: Date }[]
  timezone?: string
  color?: string
  isDark?: boolean
  masks?: DateMasks
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: undefined,
  placeholder: 'Select date',
  helpText: undefined,
  error: null,
  disabled: false,
  required: false,
  size: undefined,
  mode: 'date',
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  timezone: undefined,
  color: 'blue',
  isDark: false,
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

function getDefaultMasksByMode(mode: DateMode): DateMasks {
  switch (mode) {
    case 'dateTime':
      return DEFAULT_DATETIME_MASKS
    case 'time':
      return DEFAULT_TIME_MASKS
    default:
      return DEFAULT_DATE_MASKS
  }
}

const computedMasks = computed((): DateMasks => {
  return props.masks ?? getDefaultMasksByMode(props.mode)
})
</script>

<style lang="scss">
/* Override v-calendar default to show adjacent month days */
.vc-monthly .is-not-in-month * {
  opacity: 0.35;
  pointer-events: auto;
}

/* Hover effect for adjacent month days */
.vc-monthly .is-not-in-month .vc-day-content:hover {
  opacity: 0.7;
}
</style>
