<template>
  <main class="login">
    <Card class="login-card">
      <template #title>
        <h1>Login</h1>
      </template>

      <template #content>
        <Form v-slot="$form" :resolver="resolver" @submit="onFormSubmit">
          <!-- Username Field -->
          <div class="field">
            <label for="username" class="sr-only">Username</label>
            <InputText
              id="username"
              name="username"
              placeholder="Username"
              :disabled="authStore.loading" autofocus autocomplete="username"
              aria-describedby="username-error"
            />
            <Message
              v-if="$form.username?.invalid"
              id="username-error"
              severity="error"
              size="small"
              variant="simple"
              role="alert"
            >
              {{ $form.username.error.message }}
            </Message>
          </div>

          <!-- Password Field -->
          <div class="field">
            <label for="password" class="sr-only">Password</label>
            <Password
              id="password"
              name="password"
              placeholder="Password"
              :feedback="false"
              toggle-mask
              :disabled="authStore.loading"
              autocomplete="current-password"
              aria-describedby="password-error"
            />
            <Message
              v-if="$form.password?.invalid"
              id="password-error"
              severity="error"
              size="small"
              variant="simple"
              role="alert"
            >
              {{ $form.password.error?.message }}
            </Message>
          </div>

          <!-- Global Error Message -->
          <Message
            v-if="errorMessage"
            severity="error"
            size="small"
            role="alert"
            aria-live="polite"
          >
            {{ errorMessage }}
          </Message>

          <!-- Submit Button -->
          <Button
            type="submit"
            label="Login"
            :loading="authStore.loading"
            :disabled="authStore.loading || !$form.valid"
            class="w-full"
            aria-describedby="login-button-help"
          />
        </Form>
      </template>

      <template #footer>
        <div class="text-center">
          <router-link
            to="/auth/forgot-password"
            class="text-primary forgot-password-link"
            aria-label="Navigate to forgot password page"
          >
            Forgot Password?
          </router-link>
        </div>
      </template>
    </Card>
  </main>
</template>

<script setup lang="ts">
// Vue imports
import { ref, nextTick } from 'vue'
// Form validation
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { loginSchema } from '@/schemas/loginSchema'
// Store and composables
import { useAuthStore } from '@/stores/auth'
import { useRouterNavigation } from '@/composables/useRouterNavigation'
// Constants and types
import { ROUTE_NAMES } from '@/constants'
import type { LoginCredentials } from '@/api'
import type { ApiError } from '@/types/api'

// Types
interface LoginFormValues {
  username: string
  password: string
}

interface FormSubmitEvent {
  valid: boolean
  values: LoginFormValues
}

// Composables and state
const { navigateTo } = useRouterNavigation()
const authStore = useAuthStore()
const resolver = yupResolver(loginSchema)
const errorMessage = ref<string>('')

// Constants
const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Invalid username or password. Please try again.',
  GENERIC_ERROR: 'An error occurred during login. Please try again.',
} as const

// Form submission handler
const onFormSubmit = async ({ valid, values }: FormSubmitEvent): Promise<void> => {
  if (!valid) return

  try {
    // Clear previous error and ensure UI updates
    errorMessage.value = ''
    await nextTick()

    const credentials: LoginCredentials = {
      username: values.username.trim(),
      password: values.password,
      fcm_token: getFcmToken(), // Use helper function instead of hardcoded value
    }

    const response = await authStore.login(credentials)

    if (response.success) {
      await navigateTo(ROUTE_NAMES.HOME)
    } else {
      errorMessage.value = response.message || ERROR_MESSAGES.LOGIN_FAILED
    }
  } catch (error: unknown) {
    handleLoginError(error)
  }
}

// Helper function to get FCM token (placeholder for future implementation)
const getFcmToken = (): string => {
  // TODO: Implement FCM token retrieval when push notifications are needed
  // For now, return empty string as backend expects this field
  return ''
}

// Centralized error handling for login
const handleLoginError = (error: unknown): void => {
  const apiError = error as ApiError

  // Use specific error message if available, otherwise use generic fallback
  if (apiError.message) {
    errorMessage.value = apiError.message
  } else {
    errorMessage.value = ERROR_MESSAGES.GENERIC_ERROR
  }

  // Log error in development for debugging
  if (import.meta.env.DEV) {
    console.error('[Login Error]', apiError)
  }
}
</script>

<style scoped lang="scss"></style>
