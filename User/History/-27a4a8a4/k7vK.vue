<template>
  <div class="dialog-example">
    <h2>Message Dialog Examples</h2>

    <div class="button-group">
      <BaseButton @click="handleShowError" variant="danger">
        Show Error Dialog
      </BaseButton>

      <BaseButton @click="handleShowSuccess" variant="success">
        Show Success Dialog
      </BaseButton>

      <BaseButton @click="handleShowWarning" variant="warning">
        Show Warning Dialog
      </BaseButton>

      <BaseButton @click="handleShowInfo" variant="info">
        Show Info Dialog
      </BaseButton>

      <BaseButton @click="handleShowMultipleErrors">
        Show Multiple Errors
      </BaseButton>

      <BaseButton @click="handleShowCustomDialog">
        Show Custom Dialog
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageDialog } from '@/composables/useMessageDialog'
import { defineAsyncComponent } from 'vue'

const { showError, showSuccess, showWarning, showInfo, showErrors, showCustomDialog } = useMessageDialog()

const handleShowError = () => {
  showError(
    'Error Occurred',
    'Something went wrong while processing your request. Please try again.',
    () => console.log('Error dialog closed')
  )
}

const handleShowSuccess = () => {
  showSuccess(
    'Operation Successful',
    'Your data has been saved successfully!',
    () => console.log('Success dialog closed')
  )
}

const handleShowWarning = () => {
  showWarning(
    'Warning',
    'This action cannot be undone. Are you sure you want to proceed?',
    () => console.log('Warning dialog closed')
  )
}

const handleShowInfo = () => {
  showInfo(
    'Information',
    'This is an informational message for the user.',
    () => console.log('Info dialog closed')
  )
}

const handleShowMultipleErrors = () => {
  showErrors([
    { title: 'Validation Error', message: 'Email is required' },
    { title: 'Network Error', message: 'Failed to connect to server' },
    { title: 'Permission Error', message: 'You do not have access to this resource' }
  ])
}

const handleShowCustomDialog = () => {
  const CustomDialogComponent = defineAsyncComponent(() => import('./CustomDialogExample.vue'))

  showCustomDialog(
    CustomDialogComponent,
    {
      header: 'Custom Dialog',
      title: 'Custom Dialog Example',
      message: 'This is a custom dialog component'
    }
  )
}
</script>

<style lang="scss" scoped>
.dialog-example {
  padding: 2rem;

  h2 {
    margin-bottom: 2rem;
    color: #333;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
  }
}
</style>
