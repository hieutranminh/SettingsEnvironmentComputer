<template>
  <div class="date-picker-examples">
    <h2>DatePickerField Examples</h2>

    <div class="example-section">
      <h3>Basic Date Picker</h3>
      <DatePickerField v-model="basicDate" label="Select a date" placeholder="Choose a date" />
      <p class="result">Selected: {{ formatDate(basicDate) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DatePickerField } from '@/components/common'

const basicDate = ref<Date | null>(null)

const formatDate = (date: Date | null): string => {
  if (!date) {
    return 'Not selected'
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped lang="scss">
.date-picker-examples {
  padding: 1rem;
}

.example-section {
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .result {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: var(--surface-100);
    border-radius: 4px;
    font-family: monospace;
    color: var(--text-color-secondary);
  }
}
</style>
