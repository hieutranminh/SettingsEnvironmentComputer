<template>
  <main class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Register</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <BaseInput
          v-model="formData.firstName"
          type="text"
          label="First Name"
          placeholder="Enter your first name"
          required
          :error="errors.firstName"
        />
        <BaseInput
          v-model="formData.lastName"
          type="text"
          label="Last Name"
          placeholder="Enter your last name"
          required
          :error="errors.lastName"
        />
        <BaseInput
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          required
          :error="errors.email"
        />
        <BaseInput
          v-model="formData.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          :error="errors.password"
        />
        <BaseInput
          v-model="formData.confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          :error="errors.confirmPassword"
        />
        <BaseButton
          type="submit"
          :loading="isLoading"
          class="auth-submit-btn"
        >
          Register
        </BaseButton>
      </form>
      <div class="auth-links">
        <router-link to="/login" class="auth-link">
          Already have an account? Login
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/forms/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const router = useRouter()
const { handleRegister } = useAuth()

const formData = reactive<RegisterFormData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive<FormErrors>({})
const isLoading = ref(false)

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof FormErrors] = undefined
  })

  let isValid = true

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long'
    isValid = false
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true
    const success = await handleRegister({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    })

    if (success) {
      router.push('/')
    } else {
      throw new Error('Registration failed')
    }
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('email')) {
        errors.email = error.message
      } else if (error.message.includes('password')) {
        errors.password = error.message
      } else {
        // General error handling
        console.error('Registration error:', error)
      }
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 1rem;
}

.auth-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-submit-btn {
  margin-top: 1rem;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-link {
  color: #007bff;
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
}
</style>
