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
  masks?: {
    input?: string
    data?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date',
  mode: 'date',
  color: 'blue',
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

<style scoped lang="scss"></style>
