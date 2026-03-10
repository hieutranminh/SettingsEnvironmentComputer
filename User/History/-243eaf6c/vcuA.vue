<template>
  <div class="simple-form-example">
    <h2 class="text-2xl font-bold mb-6">Ví dụ sử dụng useSimpleForm</h2>

    <form @submit="handleSubmit" class="space-y-6 max-w-md">
      <!-- Name field -->
      <div class="form-group">
        <label for="name" class="block text-sm font-medium mb-2">Họ và tên</label>
        <input
          id="name"
          :value="formData.name"
          @input="setField('name', ($event.target as HTMLInputElement).value)"
          type="text"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.name }"
        />
        <span v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</span>
      </div>

      <!-- Email field -->
      <div class="form-group">
        <label for="email" class="block text-sm font-medium mb-2">Email</label>
        <input
          id="email"
          :value="formData.email"
          @input="setField('email', ($event.target as HTMLInputElement).value)"
          type="email"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.email }"
        />
        <span v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</span>
      </div>

      <!-- Age field -->
      <div class="form-group">
        <label for="age" class="block text-sm font-medium mb-2">Tuổi</label>
        <input
          id="age"
          :value="formData.age"
          @input="setField('age', ($event.target as HTMLInputElement).value)"
          type="number"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.age }"
        />
        <span v-if="errors.age" class="text-red-500 text-sm mt-1">{{ errors.age }}</span>
      </div>

      <!-- Website field -->
      <div class="form-group">
        <label for="website" class="block text-sm font-medium mb-2">Website</label>
        <input
          id="website"
          :value="formData.website"
          @input="setField('website', ($event.target as HTMLInputElement).value)"
          type="url"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.website }"
        />
        <span v-if="errors.website" class="text-red-500 text-sm mt-1">{{ errors.website }}</span>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Đang xử lý...' : 'Gửi form' }}
      </button>
    </form>

    <!-- Success message -->
    <div
      v-if="submitSuccess"
      class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
    >
      Form đã được gửi thành công!
    </div>

    <!-- Form data display -->
    <div class="mt-6 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Dữ liệu form:</h3>
      <pre class="text-sm">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSimpleForm, useValidation } from '@/composables/useValidation'
import type { ValidationRule } from '@/composables/useValidation'

interface FormData extends Record<string, unknown> {
  name: string
  email: string
  age: string
  website: string
}

// Initial form data
const initialData: FormData = {
  name: '',
  email: '',
  age: '',
  website: '',
}

// Use the simple form composable
const { formData, errors, isSubmitting, setField, validateForm, setSubmitting } =
  useSimpleForm<FormData>(initialData)

const { createRules } = useValidation()

// Validation schema
const validationSchema: Record<keyof FormData, ValidationRule[]> = {
  name: [createRules.required(), createRules.minLength(2)],
  email: [createRules.required(), createRules.email()],
  age: [createRules.required(), createRules.numeric()],
  website: [createRules.url()],
}

const submitSuccess = ref(false)

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  setSubmitting(true)
  submitSuccess.value = false

  try {
    const isValid = await validateForm(validationSchema)

    if (isValid) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Form submitted successfully:', formData)
      submitSuccess.value = true

      // Reset form
      Object.keys(initialData).forEach((key) => {
        setField(key as keyof FormData, '')
      })
    } else {
      console.log('Form validation failed:', errors)
    }
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    setSubmitting(false)
  }
}
</script>

<style scoped>
.simple-form-example {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
