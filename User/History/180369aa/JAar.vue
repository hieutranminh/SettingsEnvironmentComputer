<template>
  <div class="usage-example">
    <h3>Notification System Usage Example</h3>

    <form @submit.prevent="handleSubmit" class="example-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <InputText
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          :class="{ 'p-invalid': errors.email }"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <Password
          id="password"
          v-model="form.password"
          placeholder="Enter your password"
          :class="{ 'p-invalid': errors.password }"
          :feedback="false"
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
      </div>

      <div class="form-actions">
        <Button type="submit" label="Submit" :loading="isSubmitting" />
        <Button
          type="button"
          label="Reset"
          severity="secondary"
          @click="handleReset"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
  }

  return !errors.email && !errors.password
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    notification.showError({
      title: 'Validation Errors',
      message: 'Please correct the errors in the form before submitting.',
      actions: [
        {
          label: 'Fix Errors',
          severity: 'primary',
          onClick: () => {
            // Focus on first error field
            const firstErrorField = document.querySelector('.p-invalid') as HTMLElement
            if (firstErrorField) {
              firstErrorField.focus()
            }
          }
        }
      ]
    })
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate random success/failure
    const isSuccess = Math.random() > 0.3

    if (isSuccess) {
      notification.showSuccess('Form submitted successfully! Your data has been saved.')
      handleReset()
    } else {
      throw new Error('Network error occurred')
    }
  } catch (error) {
    notification.showError({
      title: 'Submission Failed',
      message: 'Unable to submit the form. Please check your internet connection and try again.',
      actions: [
        {
          label: 'Retry',
          severity: 'primary',
          onClick: () => {
            handleSubmit()
          }
        },
        {
          label: 'Save Draft',
          severity: 'secondary',
          onClick: () => {
            notification.showInfo('Draft saved locally. You can continue later.')
          }
        }
      ]
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = (): void => {
  form.email = ''
  form.password = ''
  errors.email = ''
  errors.password = ''

  notification.showInfo('Form has been reset.')
}
</script>

<style scoped lang="scss">
.usage-example {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;

  h3 {
    color: var(--text-color);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .example-form {
    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        font-weight: 500;
      }

      .p-inputtext,
      .p-password {
        width: 100%;
      }

      .p-error {
        color: var(--red-500);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
  }
}
</style>
