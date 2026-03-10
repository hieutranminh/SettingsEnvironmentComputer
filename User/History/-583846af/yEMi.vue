<template>
  <div class="login-container">
    <div class="login-card">
      <h1>{{ $t('auth.login') }}</h1>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">{{ $t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :placeholder="$t('auth.email')"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ $t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :placeholder="$t('auth.password')"
            class="form-input"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? $t('common.loading') : $t('auth.login') }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="login-links">
        <router-link to="/register">{{ $t('auth.register') }}</router-link>
        <a href="#" @click.prevent="handleForgotPassword">{{ $t('auth.forgotPassword') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleSubmit = async (): Promise<void> => {
  if (!email.value || !password.value) {
    error.value = t('validation.required')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    const redirectPath = route.query.redirect as string || '/dashboard'
    router.push(redirectPath)
  } catch (err) {
    error.value = t('auth.loginError')
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = (): void => {
  // TODO: Implement forgot password functionality
  console.log('Forgot password clicked')
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
}

.btn-primary {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  text-align: center;
}

.login-links {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
