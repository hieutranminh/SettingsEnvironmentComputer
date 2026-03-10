<template>
  <div class="notification-demo">
    <h2>Notification Dialog System Demo</h2>

    <div class="demo-section">
      <h3>Basic Notifications</h3>
      <div class="button-group">
        <Button label="Show Info" severity="info" @click="handleShowInfo" />
        <Button label="Show Success" severity="success" @click="handleShowSuccess" />
        <Button label="Show Warning" severity="warn" @click="handleShowWarning" />
        <Button label="Show Error" severity="danger" @click="handleShowError" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Custom Notifications</h3>
      <div class="button-group">
        <Button label="Custom Title & Message" @click="handleShowCustom" />
        <Button label="With Custom Icon" @click="handleShowCustomIcon" />
        <Button label="With Actions" @click="handleShowWithActions" />
        <Button label="Confirmation Dialog" @click="handleShowConfirmation" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Advanced Examples</h3>
      <div class="button-group">
        <Button label="Retry Dialog" @click="handleShowRetry" />
        <Button label="Form Validation Error" @click="handleShowFormError" />
        <Button label="Network Error" @click="handleShowNetworkError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import type { NotificationAction } from '@/types/Notification'

const notification = useNotification()

const handleShowInfo = (): void => {
  notification.showInfo('This is an informational message.')
}

const handleShowSuccess = (): void => {
  notification.showSuccess('Operation completed successfully!')
}

const handleShowWarning = (): void => {
  notification.showWarning('Please review your input before proceeding.')
}

const handleShowError = (): void => {
  notification.showError('An error occurred while processing your request.')
}

const handleShowCustom = (): void => {
  notification.showCustom({
    title: 'Custom Notification',
    message: 'This is a custom notification with a specific title and message.',
    icon: 'pi pi-star'
  })
}

const handleShowCustomIcon = (): void => {
  notification.showCustom({
    title: 'Custom Icon',
    message: 'This notification uses a custom icon instead of the default one.',
    icon: 'pi pi-heart'
  })
}

const handleShowWithActions = (): void => {
  const actions: NotificationAction[] = [
    {
      label: 'Save',
      severity: 'success',
      onClick: () => {
        console.log('Save action clicked')
      }
    },
    {
      label: 'Cancel',
      severity: 'secondary',
      onClick: () => {
        console.log('Cancel action clicked')
      }
    }
  ]

  notification.showCustom({
    title: 'Action Required',
    message: 'Please choose an action to proceed.',
    actions
  })
}

const handleShowConfirmation = (): void => {
  const actions: NotificationAction[] = [
    {
      label: 'Confirm',
      severity: 'danger',
      onClick: () => {
        notification.showSuccess('Action confirmed!')
      }
    },
    {
      label: 'Cancel',
      severity: 'secondary',
      onClick: () => {
        notification.showInfo('Action cancelled.')
      }
    }
  ]

  notification.showCustom({
    title: 'Confirm Action',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    icon: 'pi pi-exclamation-triangle',
    actions
  })
}

const handleShowRetry = (): void => {
  const actions: NotificationAction[] = [
    {
      label: 'Retry',
      severity: 'primary',
      onClick: () => {
        notification.showInfo('Retrying operation...')
      }
    },
    {
      label: 'Skip',
      severity: 'secondary',
      onClick: () => {
        notification.showWarning('Operation skipped.')
      }
    }
  ]

  notification.showError({
    title: 'Connection Failed',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    actions
  })
}

const handleShowFormError = (): void => {
  const actions: NotificationAction[] = [
    {
      label: 'Fix Errors',
      severity: 'primary',
      onClick: () => {
        notification.showInfo('Please correct the highlighted fields.')
      }
    }
  ]

  notification.showError({
    title: 'Validation Errors',
    message: 'Please correct the following errors before submitting: Email is required, Password must be at least 8 characters.',
    actions
  })
}

const handleShowNetworkError = (): void => {
  const actions: NotificationAction[] = [
    {
      label: 'Retry',
      severity: 'primary',
      onClick: () => {
        notification.showInfo('Retrying network request...')
      }
    },
    {
      label: 'Go Offline',
      severity: 'secondary',
      onClick: () => {
        notification.showWarning('Switching to offline mode.')
      }
    }
  ]

  notification.showError({
    title: 'Network Error',
    message: 'Failed to load data from server. Error code: 503 Service Unavailable.',
    actions
  })
}
</script>

<style scoped lang="scss">
.notification-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    color: var(--text-color);
    margin-bottom: 2rem;
    text-align: center;
  }

  .demo-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid var(--surface-border);
    border-radius: var(--border-radius);
    background: var(--surface-card);

    h3 {
      color: var(--text-color);
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .p-button {
        min-width: 120px;
      }
    }
  }
}
</style>
