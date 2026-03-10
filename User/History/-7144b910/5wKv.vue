<template>
  <div class="date-picker-examples">
    <h2>AppDatePicker Examples</h2>

    <div class="example-section">
      <h3>Basic Date Picker</h3>
      <AppDatePicker v-model="singleDate" placeholder="Select a date" />
      <p class="selected-value">Selected: {{ formatDate(singleDate) }}</p>
    </div>

    <div class="example-section">
      <h3>Date Range Picker</h3>
      <AppDatePicker v-model="dateRange" is-range placeholder="Select date range" />
      <p class="selected-value">
        Selected: {{ formatDateRange(dateRange) }}
      </p>
    </div>

    <div class="example-section">
      <h3>Date Time Picker</h3>
      <AppDatePicker v-model="dateTime" mode="dateTime" placeholder="Select date and time" />
      <p class="selected-value">Selected: {{ formatDateTime(dateTime) }}</p>
    </div>

    <div class="example-section">
      <h3>Disabled Date Picker</h3>
      <AppDatePicker v-model="disabledDate" disabled placeholder="Disabled" />
    </div>

    <div class="example-section">
      <h3>Date Picker with Min/Max Dates</h3>
      <AppDatePicker
        v-model="constrainedDate"
        :min-date="minDate"
        :max-date="maxDate"
        placeholder="Select date (limited range)"
      />
      <p class="info">Min: {{ formatDate(minDate) }}, Max: {{ formatDate(maxDate) }}</p>
      <p class="selected-value">Selected: {{ formatDate(constrainedDate) }}</p>
    </div>

    <div class="example-section">
      <h3>Date Picker with Error State</h3>
      <AppDatePicker v-model="errorDate" has-error placeholder="Date with error" />
      <p class="error-message">This field has an error</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppDatePicker } from '@/components/common'

const singleDate = ref<Date | null>(null)
const dateRange = ref<{ start: Date; end: Date } | null>(null)
const dateTime = ref<Date | null>(null)
const disabledDate = ref<Date | null>(new Date())
const constrainedDate = ref<Date | null>(null)
const errorDate = ref<Date | null>(null)

const minDate = new Date()
minDate.setDate(minDate.getDate() - 7)

const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 7)

function formatDate(date: Date | null): string {
  if (!date) {
    return 'Not selected'
  }
  return date.toLocaleDateString()
}

function formatDateTime(date: Date | null): string {
  if (!date) {
    return 'Not selected'
  }
  return date.toLocaleString()
}

function formatDateRange(range: { start: Date; end: Date } | null): string {
  if (!range) {
    return 'Not selected'
  }
  return `${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`
}
</script>

<style scoped lang="scss">
.date-picker-examples {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    margin-bottom: 2rem;
    color: var(--p-text-color);
  }

  .example-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--p-surface-0);
    border-radius: var(--p-border-radius);
    border: 1px solid var(--p-surface-border);

    h3 {
      margin-bottom: 1rem;
      color: var(--p-text-color);
      font-size: 1.1rem;
    }

    .selected-value {
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: var(--p-surface-50);
      border-radius: var(--p-border-radius-sm);
      color: var(--p-text-color);
      font-family: monospace;
      font-size: 0.9rem;
    }

    .info {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--p-text-muted-color);
    }

    .error-message {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--p-error-color);
    }
  }
}
</style>

