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
    v-bind="$attrs"
  >
    <template #default="{ inputValue, inputEvents }">
      <IconField>
        <InputText
          :id="inputId"
          :model-value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          fluid
          v-on="inputEvents"
        />
        <InputIcon class="pi pi-search" />
      </IconField>
    </template>
  </VDatePicker>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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
  masks: () => ({
    input: 'YYYY-MM-DD',
  }),
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: Date | null): void
}>()

const inputId = ref(`date-picker-${Math.random().toString(36).substr(2, 9)}`)

const internalValue = computed({
  get(): Date | null {
    return props.modelValue
  },
  set(value: Date | null): void {
    emit('update:modelValue', value)
  },
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue
    }
  },
)
</script>

<style scoped lang="scss"></style>
