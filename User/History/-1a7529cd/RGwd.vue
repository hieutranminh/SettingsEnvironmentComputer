<template>
  <div class="notification-test">
    <h2>Notification System Test</h2>
    <p>Click the buttons below to test different notification types:</p>

    <div class="test-buttons">
      <Button label="Test Info" severity="info" @click="testInfo" />
      <Button label="Test Success" severity="success" @click="testSuccess" />
      <Button label="Test Warning" severity="warn" @click="testWarning" />
      <Button label="Test Error" severity="danger" @click="testError" />
      <Button label="Test Custom" @click="testCustom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

const testInfo = (): void => {
  notification.showInfo('This is a test info message.')
}

const testSuccess = (): void => {
  notification.showSuccess('This is a test success message.')
}

const testWarning = (): void => {
  notification.showWarning('This is a test warning message.')
}

const testError = (): void => {
  notification.showError('This is a test error message.')
}

const testCustom = (): void => {
  notification.showCustom({
    title: 'Test Custom Dialog',
    message: 'This is a test custom notification with a custom title and message.',
    icon: 'pi pi-star',
    actions: [
      {
        label: 'OK',
        severity: 'primary',
        onClick: () => {
          notification.showSuccess('Custom dialog action clicked!')
        }
      }
    ]
  })
}
</script>

<style scoped lang="scss">
.notification-test {
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;

  h2 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color-secondary);
    margin-bottom: 2rem;
  }

  .test-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;

    .p-button {
      min-width: 120px;
    }
  }
}
</style>
