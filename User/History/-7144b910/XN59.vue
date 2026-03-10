<template>
  <div class="date-picker-examples">
    <div class="example-section">
      <DatePickerField
        v-model="basicDate"
        label="Select a date"
        placeholder="Choose a date"
        required
      />
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

<style scoped lang="scss"></style>
