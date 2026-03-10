<template>
  <main class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Forgot Password</h1>
      <p class="auth-description">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <BaseInput
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          required
          :error="errors.email"
        />
        <BaseButton
          type="submit"
          :loading="isLoading"
          class="auth-submit-btn"
        >
          Send Reset Link
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

interface ForgotPasswordFormData {
  email: string
}

interface FormErrors {
  email?: string
}

const router = useRouter()

const formData = reactive<ForgotPasswordFormData>({
  email: ''
})

const errors = reactive<FormErrors>({})
const isLoading = ref(false)

const validateForm = (): boolean => {
  // Reset errors
  errors.email = undefined

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
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
    // TODO: Implement forgot password API call
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success message and redirect
    alert('Password reset link sent to your email')
    router.push('/login')
  } catch (error) {
    if (error instanceof Error) {
      errors.email = error.message
    } else {
      errors.email = 'Failed to send reset link'
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
