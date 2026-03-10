<template>
  <main class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Login</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
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
        <BaseButton
          type="submit"
          :loading="isLoading"
          class="auth-submit-btn"
        >
          Login
        </BaseButton>
      </form>
      <div class="auth-links">
        <router-link to="/forgot-password" class="auth-link">
          Forgot Password?
        </router-link>
        <router-link to="/register" class="auth-link">
          Don't have an account? Register
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

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const router = useRouter()
const { login } = useAuth()

const formData = reactive<LoginFormData>({
  email: '',
  password: ''
})

const errors = reactive<FormErrors>({})
const isLoading = ref(false)

const handleSubmit = async (): Promise<void> => {
  // Reset errors
  errors.email = undefined
  errors.password = undefined

  try {
    isLoading.value = true
    await login(formData.email, formData.password)
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('email')) {
        errors.email = error.message
      } else if (error.message.includes('password')) {
        errors.password = error.message
      } else {
        // General error handling
        console.error('Login error:', error)
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
