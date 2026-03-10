<template>
  <div class="date-picker-examples">
    <h2>DatePickerField Examples</h2>

    <div class="example-section">
      <h3>Basic Date Picker</h3>
      <DatePickerField v-model="basicDate" label="Select a date" placeholder="Choose a date" />
      <p class="result">Selected: {{ formatDate(basicDate) }}</p>
    </div>

    <Divider />

    <div class="example-section">
      <h3>Required Date Picker</h3>
      <DatePickerField
        v-model="requiredDate"
        label="Birth Date"
        placeholder="Select your birth date"
        :required="true"
        hint="This field is required"
      />
      <p class="result">Selected: {{ formatDate(requiredDate) }}</p>
    </div>

    <Divider />

    <div class="example-section">
      <h3>Date Picker with Error</h3>
      <DatePickerField
        v-model="errorDate"
        label="Date with Error"
        placeholder="Select a date"
        error="This date is invalid"
      />
      <p class="result">Selected: {{ formatDate(errorDate) }}</p>
    </div>

    <Divider />

    <div class="example-section">
      <h3>Disabled Date Picker</h3>
      <DatePickerField
        v-model="disabledDate"
        label="Disabled Date"
        placeholder="Cannot select"
        :disabled="true"
      />
    </div>

    <Divider />

    <div class="example-section">
      <h3>Date Range Restrictions</h3>
      <DatePickerField
        v-model="restrictedDate"
        label="Future Dates Only"
        placeholder="Select a future date"
        :min-date="today"
        hint="Only future dates are allowed"
      />
      <p class="result">Selected: {{ formatDate(restrictedDate) }}</p>
    </div>

    <Divider />

    <div class="example-section">
      <h3>DateTime Picker</h3>
      <DatePickerField
        v-model="dateTime"
        label="Date and Time"
        placeholder="Select date and time"
        mode="dateTime"
        :masks="{ input: 'YYYY-MM-DD HH:mm' }"
      />
      <p class="result">Selected: {{ formatDateTime(dateTime) }}</p>
    </div>

    <Divider />

    <div class="example-section">
      <h3>Custom Color</h3>
      <DatePickerField
        v-model="coloredDate"
        label="Custom Color Date Picker"
        placeholder="Select a date"
        color="purple"
      />
      <p class="result">Selected: {{ formatDate(coloredDate) }}</p>
    </div>

    <Divider />

    <div class="example-section">
      <h3>Form Example</h3>
      <form class="form-example" @submit.prevent="handleSubmit">
        <DatePickerField
          v-model="formData.startDate"
          label="Start Date"
          placeholder="Select start date"
          :required="true"
          :error="formErrors.startDate"
        />
        <DatePickerField
          v-model="formData.endDate"
          label="End Date"
          placeholder="Select end date"
          :required="true"
          :min-date="formData.startDate"
          :error="formErrors.endDate"
          hint="Must be after start date"
        />
        <Button label="Submit" type="submit" />
      </form>
      <div v-if="submittedData" class="submitted-data">
        <h4>Submitted Data:</h4>
        <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { DatePickerField } from '@/components/common'

const basicDate = ref<Date | null>(null)
const requiredDate = ref<Date | null>(null)
const errorDate = ref<Date | null>(null)
const disabledDate = ref<Date | null>(new Date())
const restrictedDate = ref<Date | null>(null)
const dateTime = ref<Date | null>(null)
const coloredDate = ref<Date | null>(null)

const today = new Date()

const formData = reactive({
  startDate: null as Date | null,
  endDate: null as Date | null,
})

const formErrors = reactive({
  startDate: '',
  endDate: '',
})

const submittedData = ref<typeof formData | null>(null)

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

const formatDateTime = (date: Date | null): string => {
  if (!date) {
    return 'Not selected'
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleSubmit = (): void => {
  formErrors.startDate = ''
  formErrors.endDate = ''

  if (!formData.startDate) {
    formErrors.startDate = 'Start date is required'
    return
  }

  if (!formData.endDate) {
    formErrors.endDate = 'End date is required'
    return
  }

  if (formData.endDate < formData.startDate) {
    formErrors.endDate = 'End date must be after start date'
    return
  }

  submittedData.value = { ...formData }
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

.form-example {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.submitted-data {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--surface-100);
  border-radius: 4px;

  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  pre {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-color);
  }
}
</style>
