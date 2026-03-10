<template>
  <div class="dialog-demo">
    <h2>Dialog System Demo</h2>

    <div class="demo-section">
      <h3>Basic Dialogs</h3>
      <div class="button-group">
        <Button label="Show Error" severity="danger" @click="handleShowError" />
        <Button label="Show Info" severity="info" @click="handleShowInfo" />
        <Button label="Show Warning" severity="warn" @click="handleShowWarning" />
        <Button label="Show Success" severity="success" @click="handleShowSuccess" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Confirmation Dialog</h3>
      <div class="button-group">
        <Button label="Show Confirm" severity="secondary" @click="handleShowConfirm" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Custom Dialog with Actions</h3>
      <div class="button-group">
        <Button label="Custom Dialog" severity="primary" @click="handleShowCustom" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Programmatic Usage</h3>
      <div class="button-group">
        <Button label="From Service" severity="secondary" @click="handleShowFromService" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue/button'
import { useDialog } from '@/composables/useDialog'
import { getDialogService } from '@/composables/useDialog'
import type { DialogAction } from '@/types/dialog'

const dialog = useDialog()
const dialogService = getDialogService()

const handleShowError = (): void => {
  dialog.showError(
    'This is an error message. Something went wrong with your request.',
    'Error Occurred',
    [
      {
        label: 'Retry',
        severity: 'primary',
        onClick: () => {
          console.log('Retry clicked')
        }
      }
    ]
  )
}

const handleShowInfo = (): void => {
  dialog.showInfo(
    'This is an informational message. Here is some useful information for you.',
    'Information'
  )
}

const handleShowWarning = (): void => {
  dialog.showWarning(
    'This is a warning message. Please be careful with this action.',
    'Warning',
    [
      {
        label: 'Proceed Anyway',
        severity: 'danger',
        onClick: () => {
          console.log('Proceed clicked')
        }
      }
    ]
  )
}

const handleShowSuccess = (): void => {
  dialog.showSuccess(
    'This is a success message. Your action was completed successfully!',
    'Success',
    [
      {
        label: 'Continue',
        severity: 'success',
        onClick: () => {
          console.log('Continue clicked')
        }
      }
    ]
  )
}

const handleShowConfirm = (): void => {
  dialog.showConfirm(
    'Are you sure you want to delete this item? This action cannot be undone.',
    'Confirm Deletion',
    () => {
      console.log('Confirmed deletion')
      dialog.showSuccess('Item deleted successfully!')
    },
    () => {
      console.log('Deletion cancelled')
    }
  )
}

const handleShowCustom = (): void => {
  const customActions: DialogAction[] = [
    {
      label: 'Save Draft',
      severity: 'secondary',
      onClick: () => {
        console.log('Save draft clicked')
      }
    },
    {
      label: 'Publish',
      severity: 'success',
      onClick: () => {
        console.log('Publish clicked')
      }
    },
    {
      label: 'Cancel',
      severity: 'danger',
      onClick: () => {
        console.log('Cancel clicked')
      }
    }
  ]

  dialog.showCustom({
    title: 'Custom Dialog',
    message: 'This is a custom dialog with multiple action buttons. You can configure it however you want.',
    icon: 'pi pi-cog',
    severity: 'info',
    actions: customActions,
    width: '500px',
    modal: true,
    closeOnEscape: true,
    dismissableMask: false
  })
}

const handleShowFromService = (): void => {
  // This demonstrates using the global service from anywhere
  dialogService.showInfo(
    'This dialog was triggered from the global service!',
    'Global Service Demo'
  )
}
</script>

<style scoped lang="scss">
.dialog-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }

  .demo-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    background-color: #f8f9fa;

    h3 {
      color: #495057;
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
