<template>
  <div class="dialog-example">
    <h1>Dialog Message Examples</h1>

    <div class="example-section">
      <h2>Basic Message Dialogs</h2>
      <div class="button-grid">
        <Button
          label="Success Message"
          severity="success"
          @click="handleSuccessClick"
          class="example-button"
        />
        <Button
          label="Info Message"
          severity="info"
          @click="handleInfoClick"
          class="example-button"
        />
        <Button
          label="Warning Message"
          severity="warn"
          @click="handleWarningClick"
          class="example-button"
        />
        <Button
          label="Error Message"
          severity="danger"
          @click="handleErrorClick"
          class="example-button"
        />
        <Button
          label="Secondary Message"
          severity="secondary"
          @click="handleSecondaryClick"
          class="example-button"
        />
        <Button
          label="Contrast Message"
          severity="contrast"
          @click="handleContrastClick"
          class="example-button"
        />
      </div>

      <h2>Advanced Examples</h2>
      <div class="button-grid">
        <Button
          label="Multiple Errors"
          severity="danger"
          @click="handleMultipleErrorsClick"
          class="example-button"
        />
        <Button
          label="Error with Callback"
          severity="danger"
          @click="handleErrorWithCallbackClick"
          class="example-button"
        />
        <Button
          label="Queue Test"
          severity="info"
          @click="handleQueueTestClick"
          class="example-button"
        />
        <Button
          label="Clear Queue"
          severity="secondary"
          @click="handleClearQueueClick"
          class="example-button"
        />
      </div>

      <h2>New Flexible Features</h2>
      <div class="button-grid">
        XXX
      </div>

      <h2>Array Message Examples</h2>
      <div class="button-grid">
        <Button
          label="Success Array"
          severity="success"
          @click="handleSuccessArrayClick"
          class="example-button"
        />
        <Button
          label="Info Array"
          severity="info"
          @click="handleInfoArrayClick"
          class="example-button"
        />
        <Button
          label="Warning Array"
          severity="warn"
          @click="handleWarningArrayClick"
          class="example-button"
        />
        <Button
          label="Error Array"
          severity="danger"
          @click="handleErrorArrayClick"
          class="example-button"
        />
        <Button
          label="Secondary Array"
          severity="secondary"
          @click="handleSecondaryArrayClick"
          class="example-button"
        />
        <Button
          label="Contrast Array"
          severity="contrast"
          @click="handleContrastArrayClick"
          class="example-button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import { useMessageDialog } from '@/composables/useMessageDialog'
import type { DialogAction } from '@/composables/useMessageDialog'

const { t } = useTranslation()

// Message dialog composable
const {
  showSuccess,
  showInfo,
  showWarning,
  showError,
  showSecondary,
  showContrast,
  showErrors,
  showConfirm,
  show,
  showNow,
  clearQueue,
  getQueueLength,
  isQueueProcessing,
  configure,
  getConfig
} = useMessageDialog()

const isProcessing = ref(false)

// Configure global settings
onMounted(() => {
  configure({
    queueDelay: 200,
    defaultStyle: {
      width: '500px',
      maxWidth: '95vw'
    }
  })
})

// Event handlers
const handleSuccessClick = (): void => {
  showSuccess(
    'Success!',
    'This is a success message. Everything went well!'
  )
}

const handleInfoClick = (): void => {
  showInfo(
    'Information',
    'This is an informational message. Here is some useful information.'
  )
}

const handleWarningClick = (): void => {
  showWarning(
    'Warning',
    'This is a warning message. Please be careful with this action.'
  )
}

const handleErrorClick = (): void => {
  showError(
    'Error',
    'This is an error message. Something went wrong!'
  )
}

const handleSecondaryClick = (): void => {
  showSecondary(
    'Secondary',
    'This is a secondary message with different styling.'
  )
}

const handleContrastClick = (): void => {
  showContrast(
    'Contrast',
    'This is a contrast message with high contrast styling.'
  )
}

const handleMultipleErrorsClick = (): void => {
  const errors = [
    { title: 'Validation Error', message: 'Please check your input fields.' },
    { title: 'Network Error', message: 'Unable to connect to the server.' },
    { title: 'Permission Error', message: 'You do not have permission to perform this action.' }
  ]
  showErrors(errors)
}

const handleErrorWithCallbackClick = (): void => {
  showError(
    'Error with Callback',
    'This error will trigger a callback when closed.',
    () => {
      console.log('Error dialog was closed!')
      showInfo('Callback Executed', 'The error dialog callback was successfully executed.')
    }
  )
}

const handleQueueTestClick = (): void => {
  isProcessing.value = true

  // Add multiple dialogs to queue
  showSuccess('Queue Test 1', 'First message in queue')
  showInfo('Queue Test 2', 'Second message in queue')
  showWarning('Queue Test 3', 'Third message in queue')
  showError('Queue Test 4', 'Fourth message in queue')

  // Reset processing status after a delay
  setTimeout(() => {
    isProcessing.value = false
  }, 2000)
}

const handleClearQueueClick = (): void => {
  clearQueue()
  showInfo('Queue Cleared', 'All pending dialogs have been cleared from the queue.')
}

// Array message handlers
const handleSuccessArrayClick = (): void => {
  showSuccess(
    'Success!',
    ['Operation completed', 'File uploaded successfully', 'Database updated']
  )
}

const handleInfoArrayClick = (): void => {
  showInfo(
    'Information',
    ['System status: Online', 'Last backup: 2 hours ago', 'Active users: 15']
  )
}

const handleWarningArrayClick = (): void => {
  showWarning(
    'Warning',
    ['Disk space low', 'Memory usage high', 'Consider maintenance']
  )
}

const handleErrorArrayClick = (): void => {
  showError(
    'Error',
    ['Network connection failed', 'Database timeout', 'Invalid input data']
  )
}

const handleSecondaryArrayClick = (): void => {
  showSecondary(
    'Secondary',
    [t('common.example_test', { name: 'John', age: 30 }), t('common.example_test', { name: 'Hieu', age: 25 })]
  )
}

const handleContrastArrayClick = (): void => {
  showContrast(
    'Contrast',
    ['High visibility', 'Bold presentation', 'Enhanced readability']
  )
}

// Lifecycle
onMounted(() => {
  console.log('Dialog Message Example component mounted')
  console.log('Current config:', getConfig())
})
</script>

<style lang="scss" scoped>
h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #34495e;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}

.example-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.example-button {
  min-height: 30px;
}
</style>
