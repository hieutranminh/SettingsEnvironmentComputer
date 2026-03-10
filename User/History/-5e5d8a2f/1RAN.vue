<template>
  <div class="validation-example">
    <h2 class="text-2xl font-bold mb-6">Ví dụ sử dụng Vee-Validate</h2>

    <form @submit="onSubmit" class="space-y-6 max-w-md">
      <!-- Email field -->
      <div class="form-group">
        <label for="email" class="block text-sm font-medium mb-2">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': emailError }"
        />
        <span v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</span>
      </div>

      <!-- Password field -->
      <div class="form-group">
        <label for="password" class="block text-sm font-medium mb-2">Mật khẩu</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': passwordError }"
        />
        <span v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</span>
      </div>

      <!-- Confirm Password field -->
      <div class="form-group">
        <label for="confirmPassword" class="block text-sm font-medium mb-2"
          >Xác nhận mật khẩu</label
        >
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': confirmPasswordError }"
        />
        <span v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{
          confirmPasswordError
        }}</span>
      </div>

      <!-- Phone field -->
      <div class="form-group">
        <label for="phone" class="block text-sm font-medium mb-2">Số điện thoại</label>
        <input
          id="phone"
          v-model="phone"
          type="tel"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': phoneError }"
        />
        <span v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useField, useForm } from 'vee-validate'
import { commonRules } from '@/plugins/vee-validate'

// Form data
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')

// Validation using vee-validate
const { value: emailValue, errorMessage: emailError } = useField('email', [
  commonRules.required,
  commonRules.email,
])

const { value: passwordValue, errorMessage: passwordError } = useField('password', [
  commonRules.required,
  commonRules.minLength(6),
])

const { value: confirmPasswordValue, errorMessage: confirmPasswordError } = useField(
  'confirmPassword',
  [
    commonRules.required,
    (value: string) => {
      if (value !== password.value) {
        return 'Mật khẩu xác nhận không khớp'
      }
      return true
    },
  ],
)

const { value: phoneValue, errorMessage: phoneError } = useField('phone', [commonRules.phone])

// Sync refs with vee-validate
email.value = emailValue.value
password.value = passwordValue.value
confirmPassword.value = confirmPasswordValue.value
phone.value = phoneValue.value

// Form submission
const isSubmitting = ref(false)
const submitSuccess = ref(false)

const onSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Form data:', {
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      phone: phone.value,
    })

    submitSuccess.value = true

    // Reset form
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    phone.value = ''
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.validation-example {
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
</style>
