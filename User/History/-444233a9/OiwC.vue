<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <h2 class="text-center">Login</h2>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <label for="email" class="block text-900 font-medium mb-2">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              placeholder="Enter your email"
              required
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="password" class="block text-900 font-medium mb-2">Password</label>
            <Password
              id="password"
              v-model="form.password"
              class="w-full"
              :class="{ 'p-invalid': errors.password }"
              placeholder="Enter your password"
              :feedback="false"
              toggleMask
              required
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <div class="field">
            <Button
              type="submit"
              label="Login"
              class="w-full"
              :loading="loading"
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="field">
            <Message severity="error" :closable="false">
              {{ error.message }}
            </Message>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="text-center">
          <router-link to="/auth/forgot-password" class="text-primary">
            Forgot Password?
          </router-link>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { authApi, type LoginCredentials, type LoginResponse } from '@/api'
import Cookies from 'js-cookie'

const router = useRouter()

const form = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})

const { loading, error, execute } = useApi<LoginResponse>({
  onSuccess: (data) => {
    // Store token
    Cookies.set('auth_token', data.token)

    // Redirect to dashboard
    router.push('/admin')
  },
  onError: (apiError) => {
    // Handle validation errors
    if (apiError.status === 422 && apiError.details && typeof apiError.details === 'object' && 'errors' in apiError.details) {
      const validationErrors = apiError.details.errors as Record<string, string>
      Object.assign(errors, validationErrors)
    }
  },
})

const handleLogin = async (): Promise<void> => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validate form
  if (!form.email) {
    errors.email = 'Email is required'
  }
  if (!form.password) {
    errors.password = 'Password is required'
  }

  if (Object.keys(errors).length > 0) {
    return
  }

  // Execute login
  await execute(() => authApi.login(form))
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;

  :deep(.p-card-title) {
    margin-bottom: 1.5rem;
  }
}

.login-form {
  .field {
    margin-bottom: 1.5rem;
  }

  .field:last-child {
    margin-bottom: 0;
  }
}

.text-center {
  text-align: center;
}
</style>
