<template>
  <div class="dialog-demo">
    <h2>Dialog System Demo</h2>

    <div class="demo-section">
      <h3>Basic Dialogs</h3>
      <div class="button-group">
        <Button label="Show Info" @click="handleShowInfo" />
        <Button label="Show Success" severity="success" @click="handleShowSuccess" />
        <Button label="Show Warning" severity="warning" @click="handleShowWarning" />
        <Button label="Show Error" severity="danger" @click="handleShowError" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Confirmation Dialog</h3>
      <div class="button-group">
        <Button label="Show Confirm" severity="secondary" @click="handleShowConfirm" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Custom Dialog</h3>
      <div class="button-group">
        <Button label="Custom Dialog" @click="handleShowCustom" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Dialog with Actions</h3>
      <div class="button-group">
        <Button label="Dialog with Actions" @click="handleShowWithActions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { useDialog } from '@/composables/useDialog'

const { showInfo, showSuccess, showWarning, showError, showConfirm, show } = useDialog()

const handleShowInfo = async (): Promise<void> => {
  await showInfo('This is an information message. It provides useful details to the user.')
}

const handleShowSuccess = async (): Promise<void> => {
  await showSuccess('Operation completed successfully! Your changes have been saved.')
}

const handleShowWarning = async (): Promise<void> => {
  await showWarning('Please review your input before proceeding. Some fields may need attention.')
}

const handleShowError = async (): Promise<void> => {
  await showError('An error occurred while processing your request. Please try again.')
}

const handleShowConfirm = async (): Promise<void> => {
  const result = await showConfirm('Are you sure you want to delete this item? This action cannot be undone.')

  if (result?.label === 'Confirm') {
    await showSuccess('Item deleted successfully!')
  } else {
    await showInfo('Operation cancelled.')
  }
}

const handleShowCustom = async (): Promise<void> => {
  await show({
    title: 'Custom Dialog',
    message: 'This is a custom dialog with a specific title and no default icon.',
    width: '600px',
    actions: [
      {
        label: 'Retry',
        severity: 'warning',
        onClick: () => {
          console.log('Retry clicked')
        }
      },
      {
        label: 'Skip',
        severity: 'secondary'
      }
    ]
  })
}

const handleShowWithActions = async (): Promise<void> => {
  const result = await show({
    title: 'Multiple Actions',
    message: 'This dialog has multiple action buttons. Choose your preferred action.',
    icon: 'pi pi-cog',
    actions: [
      {
        label: 'Save',
        severity: 'success'
      },
      {
        label: 'Save as Draft',
        severity: 'secondary'
      },
      {
        label: 'Cancel',
        severity: 'danger'
      }
    ]
  })

  if (result) {
    await showInfo(`You selected: ${result.label}`)
  }
}
</script>

<style scoped lang="scss">
.dialog-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    color: var(--primary-color);
    margin-bottom: 2rem;
    text-align: center;
  }

  .demo-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    background: var(--surface-card);

    h3 {
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  }
}
</style>
