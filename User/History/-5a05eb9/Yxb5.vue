<template>
  <div class="vee-validate-example">
    <div class="container">
      <h1>{{ t('vee_validate_example.titles.main_title') }}</h1>

      <!-- Form với inline errors -->
      <div class="form-section">
        <h2>Form với Inline Errors</h2>
        <Form
          @submit="submitForm"
          :resolver="resolver"
          v-slot="$form"
          :initialValues
          class="form"
        >
          <div class="form-group">
            <label for="name">full name</label>
            <InputText
              id="fullname"
              name="fullname"
              type="text"
              :placeholder="'enter full text'"
              class="form-input"
              :class="{ 'form-input-error': $form.fullname?.invalid }"
            />
            <Message
              v-if="$form.fullname?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.fullname.error.message }}</Message
            >
          </div>

          <div class="form-group">
            <label for="email">email</label>
            <InputText
              id="email"
              name="email"
              :placeholder="'Enter email'"
              class="form-input"
              :class="{ 'form-input-error': $form.email?.invalid }"
            />
            <Message
              v-if="$form.email?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.email.error.message }}</Message
            >
          </div>

          <div class="form-group">
            <label for="password">password</label>
            <InputText
              id="password"
              name="password"
              type="password"
              :placeholder="'Enter password'"
              class="form-input"
              :class="{ 'form-input-error': $form.password?.invalid }"
            />
            <Message
              v-if="$form.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.password.error.message }}</Message
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">confirm password</label>
            <InputText
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              :placeholder="'Confirm password'"
              class="form-input"
              :class="{ 'form-input-error': $form.confirmPassword?.invalid }"
            />
            <Message
              v-if="$form.confirmPassword?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.confirmPassword.error.message }}</Message
            >
          </div>

          <div class="form-group">
            <label for="phone">phone</label>
            <InputText
              id="phone"
              name="phone"
              type="tel"
              :placeholder="'Enter phone'"
              class="form-input"
              :class="{ 'form-input-error': $form.phone?.invalid }"
            />
            <Message
              v-if="$form.phone?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.phone.error.message }}</Message
            >
          </div>

          <button
            type="submit"
            class="submit-button"
          >
            Register
          </button>
        </Form>
      </div>

      <!-- Form mới với centralized errors -->
      <div class="form-section">
        <h2>Form với Centralized Errors</h2>
        <Form
          @submit="submitCentralizedForm"
          :resolver="centralizedResolver"
          v-slot="$form"
          :initialValues="centralizedValues"
          class="form centralized-form"
        >
          <div class="form-group">
            <label for="fullname2">Full Name</label>
            <InputText
              id="fullname2"
              name="fullname"
              type="text"
              :placeholder="'Enter full name'"
              class="form-input"
              :class="{ 'form-input-error': $form.fullname?.invalid }"
            />
          </div>

          <div class="form-group">
            <label for="email2">Email</label>
            <InputText
              id="email2"
              name="email"
              :placeholder="'Enter email'"
              class="form-input"
              :class="{ 'form-input-error': $form.email?.invalid }"
            />
          </div>

          <div class="form-group">
            <label for="password2">Password</label>
            <InputText
              id="password2"
              name="password"
              type="password"
              :placeholder="'Enter password'"
              class="form-input"
              :class="{ 'form-input-error': $form.password?.invalid }"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword2">Confirm Password</label>
            <InputText
              id="confirmPassword2"
              name="confirmPassword"
              type="password"
              :placeholder="'Confirm password'"
              class="form-input"
              :class="{ 'form-input-error': $form.confirmPassword?.invalid }"
            />
          </div>

          <div class="form-group">
            <label for="phone2">Phone</label>
            <InputText
              id="phone2"
              name="phone"
              type="tel"
              :placeholder="'Enter phone'"
              class="form-input"
              :class="{ 'form-input-error': $form.phone?.invalid }"
            />
          </div>

          <!-- Centralized Error Section -->
          <div
            v-if="hasErrors($form)"
            class="error-section"
          >
            <h4>{{ t('vee_validate_example.error_section.title') }}</h4>
            <ul class="error-list">
              <li
                v-if="$form.fullname?.invalid"
                class="error-item"
              >
                <strong>{{ t('vee_validate_example.form_labels.fullname') }}:</strong>
                {{ $form.fullname.error.message }}
              </li>
              <li
                v-if="$form.email?.invalid"
                class="error-item"
              >
                <strong>{{ t('vee_validate_example.form_labels.email') }}:</strong>
                {{ $form.email.error.message }}
              </li>
              <li
                v-if="$form.password?.invalid"
                class="error-item"
              >
                <strong>{{ t('vee_validate_example.form_labels.password') }}:</strong>
                {{ $form.password.error.message }}
              </li>
              <li
                v-if="$form.confirmPassword?.invalid"
                class="error-item"
              >
                <strong>{{ t('vee_validate_example.form_labels.confirm_password') }}:</strong>
                {{ $form.confirmPassword.error.message }}
              </li>
              <li
                v-if="$form.phone?.invalid"
                class="error-item"
              >
                <strong>{{ t('vee_validate_example.form_labels.phone') }}:</strong>
                {{ $form.phone.error.message }}
              </li>
            </ul>
          </div>

          <button
            type="submit"
            class="submit-button centralized-submit"
          >
            Register with Centralized Errors
          </button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useTranslation } from '@/composables/useTranslation'
import { validationFormSchema } from '@/middleware/schema/validationForm.schema'

interface FormValues {
  fullname: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

interface FormState {
  [key: string]: {
    invalid: boolean
    error: { message: string }
  }
}

const initialValues = ref<FormValues>({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
})

const centralizedValues = ref<FormValues>({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
})

// Use schema from separate file with reactive translation support
const resolver = ref(validationFormSchema())
const centralizedResolver = ref(validationFormSchema())

const submitForm = ({ values }: { values: FormValues }) => {
  console.log('Inline form submitted:', values)
}

const submitCentralizedForm = ({ values }: { values: FormValues }) => {
  console.log('Centralized form submitted:', values)
}

// Helper function to check if form has any errors
const hasErrors = (form: FormState) => {
  return (
    form.fullname?.invalid ||
    form.email?.invalid ||
    form.password?.invalid ||
    form.confirmPassword?.invalid ||
    form.phone?.invalid
  )
}

const { t } = useTranslation()
</script>

<style scoped>
.vee-validate-example {
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 3rem;
}

.form-section h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgb(0 123 255 / 25%);
}

.form-input-error {
  border-color: #dc3545;
}

.form-divider {
  margin: 3rem 0 2rem;
  padding: 1rem 0;
  border-top: 2px solid #e9ecef;
}

.form-divider h2 {
  text-align: center;
  color: #6c757d;
  font-size: 1.5rem;
  margin: 0;
}

.realtime-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  margin-top: 1rem;
}

.simple-form {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
}

.simple-form .form-group {
  margin-bottom: 1.25rem;
}

.simple-form label {
  color: #495057;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.realtime-form .form-group label {
  color: white;
  font-weight: 500;
}

.realtime-form .form-input {
  background: rgb(255 255 255 / 90%);
  border: 1px solid rgb(255 255 255 / 30%);
}

.realtime-form .form-input:focus {
  background: white;
  border-color: #fff;
  box-shadow: 0 0 0 2px rgb(255 255 255 / 30%);
}

.realtime-form .error-message {
  color: #ffd6d6;
  background: rgb(220 53 69 / 20%);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.realtime-form .submit-button {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.realtime-form .submit-button:hover {
  background: linear-gradient(45deg, #ee5a24, #ff6b6b);
  transform: translateY(-1px);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Animation for form appearance */
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Error section animation */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  60% {
    opacity: 1;
    transform: scale(1.05);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Enhanced styles for centralized form */
.centralized-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgb(102 126 234 / 30%);
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
  animation: slide-in-up 0.6s ease-out;
}

.centralized-form::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 5%) 100%);
  pointer-events: none;
}

.centralized-form .form-group {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.centralized-form label {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: block;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgb(0 0 0 / 10%);
}

.centralized-form .w-full {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid rgb(255 255 255 / 20%);
  border-radius: 12px;
  font-size: 1rem;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
}

.centralized-form .w-full:focus {
  outline: none;
  border-color: rgb(255 255 255 / 80%);
  background: rgb(255 255 255 / 100%);
  box-shadow:
    0 0 0 4px rgb(255 255 255 / 20%),
    0 8px 16px rgb(0 0 0 / 15%);
  transform: translateY(-1px);
}

.centralized-form .w-full.p-invalid {
  border-color: #ff6b9d;
  background: rgb(255 107 157 / 10%);
  box-shadow: 0 0 0 4px rgb(255 107 157 / 20%);
}

.centralized-form .error-section {
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border: none;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 12px 24px rgb(196 69 105 / 30%);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: bounce-in 0.5s ease-out;
}

.centralized-form .error-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 5%) 100%);
  pointer-events: none;
}

.centralized-form .error-section h4 {
  color: #fff;
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgb(0 0 0 / 20%);
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.centralized-form .error-section h4::before {
  content: '⚠️';
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.centralized-form .error-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
}

.centralized-form .error-item {
  color: #fff;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgb(255 255 255 / 20%);
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
}

.centralized-form .error-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.centralized-form .error-item::before {
  content: '•';
  color: #ffd6e8;
  font-weight: bold;
  margin-right: 0.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.centralized-form .error-item strong {
  color: #ffd6e8;
  font-weight: 700;
  margin-right: 0.25rem;
}

.centralized-form .p-button {
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgb(196 69 105 / 40%);
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 1rem;
}

.centralized-form .p-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 20%), transparent);
  transition: left 0.5s;
}

.centralized-form .p-button:hover {
  background: linear-gradient(135deg, #c44569 0%, #ff6b9d 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgb(196 69 105 / 50%);
}

.centralized-form .p-button:hover::before {
  left: 100%;
}

.centralized-form .p-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgb(196 69 105 / 40%);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background: #0056b3;
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.success-message {
  margin-top: 2rem;
  padding: 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
}

.success-message h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>
