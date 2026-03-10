<template>
  <div class="date-picker-field">
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
        <InputText
          :id="inputId"
          :model-value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :invalid="!!error"
          fluid
          v-on="inputEvents"
        />
      </template>
    </VDatePicker>
    <small v-if="error" class="error-message">{{ error }}</small>
    <small v-else-if="hint" class="hint-message">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: Date | null
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
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
  label: '',
  placeholder: 'Select date',
  required: false,
  disabled: false,
  error: '',
  hint: '',
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

<style scoped lang="scss">
.date-picker-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;

  .required-mark {
    color: var(--red-500);
    margin-left: 0.25rem;
  }
}

.error-message {
  color: var(--red-500);
  font-size: 0.875rem;
  margin: 0;
}

.hint-message {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin: 0;
}
</style>
