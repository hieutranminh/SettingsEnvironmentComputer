<template>
  <div class="error-dialog-demo">
    <h2>Error Dialog Demo</h2>

    <div class="demo-section">
      <h3>Basic Dialogs</h3>
      <div class="demo-buttons">
        <BaseButton @click="showBasicError">Show Error</BaseButton>
        <BaseButton @click="showBasicWarning">Show Warning</BaseButton>
        <BaseButton @click="showBasicInfo">Show Info</BaseButton>
      </div>
    </div>

    <div class="demo-section">
      <h3>Advanced Dialogs</h3>
      <div class="demo-buttons">
        <BaseButton @click="showErrorWithDetails">Error with Details</BaseButton>
        <BaseButton @click="showConfirmDialog">Confirm Dialog</BaseButton>
        <BaseButton @click="showCustomDialog">Custom Dialog</BaseButton>
      </div>
    </div>

    <div class="demo-section">
      <h3>Nesting Demo</h3>
      <div class="demo-buttons">
        <BaseButton @click="showNestedDialogs">Show Nested Dialogs</BaseButton>
        <BaseButton @click="showMultipleDialogs">Show Multiple Dialogs</BaseButton>
        <BaseButton @click="hideAllDialogs">Hide All Dialogs</BaseButton>
      </div>
    </div>

    <div class="demo-section">
      <h3>Error Handling Demo</h3>
      <div class="demo-buttons">
        <BaseButton @click="simulateApiError">Simulate API Error</BaseButton>
        <BaseButton @click="simulateValidationError">Simulate Validation Error</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorDialog } from '@/composables/useErrorDialog'
import BaseButton from './BaseButton.vue'

const {
  showError,
  showWarning,
  showInfo,
  showDialog,
  hideAllDialogs
} = useErrorDialog()

const showBasicError = () => {
  showError('This is a basic error message')
}

const showBasicWarning = () => {
  showWarning('This is a warning message')
}

const showBasicInfo = () => {
  showInfo('This is an informational message')
}

const showErrorWithDetails = () => {
  showDialog({
    title: 'Error with Details',
    message: 'An error occurred while processing your request',
    details: `Error: 500 Internal Server Error
Stack Trace:
  at processRequest (api.js:45)
  at handleUserAction (userService.js:23)
  at async processUserData (main.js:67)

Request ID: abc123-def456-ghi789
Timestamp: ${new Date().toISOString()}`,
    severity: 'error',
    showDetails: true
  })
}

const showConfirmDialog = () => {
  showDialog({
    title: 'Delete Confirmation',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    severity: 'warning',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    showCancelButton: true,
    onConfirm: () => {
      showInfo('Item deleted successfully!')
    }
  })
}

const showCustomDialog = () => {
  showDialog({
    title: 'Custom Dialog',
    message: 'This is a custom dialog with specific options.',
    severity: 'info',
    showCancelButton: true,
    confirmText: 'Proceed',
    cancelText: 'Go Back',
    onConfirm: () => {
      showInfo('Custom action completed!')
    },
    onClose: () => {
      showWarning('Dialog was closed')
    }
  })
}

const showNestedDialogs = () => {
  // Show first dialog
  showError('First dialog opened')

  // Show second dialog after a delay
  setTimeout(() => {
    showWarning('Second dialog (nested)')

    // Show third dialog after another delay
    setTimeout(() => {
      showInfo('Third dialog (nested further)')
    }, 1000)
  }, 1000)
}

const showMultipleDialogs = () => {
  // Show multiple dialogs quickly to demonstrate stacking
  showError('Dialog 1: Error message')
  setTimeout(() => showWarning('Dialog 2: Warning message'), 200)
  setTimeout(() => showInfo('Dialog 3: Info message'), 400)
  setTimeout(() => showError('Dialog 4: Another error'), 600)
  setTimeout(() => showWarning('Dialog 5: Another warning'), 800)
}

const simulateApiError = () => {
  showDialog({
    title: 'API Error',
    message: 'Failed to fetch user data',
    details: `API Error: GET /api/users/123
Status: 404 Not Found
Response: {"error": "User not found", "code": "USER_404"}

Request Details:
- URL: https://api.example.com/users/123
- Method: GET
- Headers: {"Authorization": "Bearer ***", "Content-Type": "application/json"}
- Timestamp: ${new Date().toISOString()}

Stack Trace:
  at fetchUserData (userService.js:45)
  at loadUserProfile (profileComponent.js:23)`,
    severity: 'error',
    showDetails: true
  })
}

const simulateValidationError = () => {
  showDialog({
    title: 'Validation Error',
    message: 'Form validation failed',
    details: `Validation Errors:
1. Email: "invalid-email" is not a valid email address
2. Password: Must be at least 8 characters long
3. Confirm Password: Passwords do not match
4. Age: Must be a number between 18 and 120

Form Data:
{
  "email": "invalid-email",
  "password": "123",
  "confirmPassword": "456",
  "age": "abc"
}

Field: email
Value: "invalid-email"
Rule: email format validation
Error: Invalid email format`,
    severity: 'error',
    showDetails: true
  })
}
</script>

<style scoped lang="scss">
.error-dialog-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    margin-bottom: 2rem;
    color: var(--text-color);
    font-size: 1.5rem;
    font-weight: 600;
  }

  .demo-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid var(--surface-300);
    border-radius: 0.5rem;
    background-color: var(--surface-50);

    h3 {
      margin: 0 0 1rem 0;
      color: var(--text-color);
      font-size: 1.125rem;
      font-weight: 500;
    }

    .demo-buttons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      .base-button {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
