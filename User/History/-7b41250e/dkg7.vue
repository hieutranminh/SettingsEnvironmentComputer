<template>
  <main class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Reset Password</h1>
      <p class="auth-description">
        Enter your new password below.
      </p>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <BaseInput
          v-model="formData.password"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          required
          :error="errors.password"
        />
        <BaseInput
          v-model="formData.confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          required
          :error="errors.confirmPassword"
        />
        <BaseButton
          type="submit"
          :loading="isLoading"
          class="auth-submit-btn"
        >
          Reset Password
        </BaseButton>
      </form>
      <div class="auth-links">
        <router-link to="/login" class="auth-link">
          Back to Login
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

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

interface FormErrors {
  password?: string
  confirmPassword?: string
}

const router = useRouter()

const formData = reactive<ResetPasswordFormData>({
  password: '',
  confirmPassword: ''
})

const errors = reactive<FormErrors>({})
const isLoading = ref(false)

const validateForm = (): boolean => {
  // Reset errors
  errors.password = undefined
  errors.confirmPassword = undefined

  if (!formData.password) {
    errors.password = 'Password is required'
    return false
  }

  if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long'
    return false
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    return false
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }

  return true
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true
    // TODO: Implement reset password API call
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success message and redirect
    alert('Password reset successfully')
    router.push('/login')
  } catch (error) {
    if (error instanceof Error) {
      errors.password = error.message
    } else {
      errors.password = 'Failed to reset password'
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
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.auth-description {
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
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
