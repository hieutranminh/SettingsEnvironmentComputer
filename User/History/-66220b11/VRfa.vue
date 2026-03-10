<!-- examples/ConfirmDialogExample.vue -->
<template>
  <div class="confirm-example">
    <h2>Confirm Dialog Examples</h2>

    <div class="button-group">
      <Button
        label="Delete Item"
        severity="danger"
        @click="handleDeleteClick"
      />

      <Button
        label="Save Changes"
        severity="success"
        @click="handleSaveClick"
      />

      <Button
        label="Custom Confirm"
        severity="info"
        @click="handleCustomConfirmClick"
      />
    </div>

    <div v-if="lastResult" class="result">
      <p>Last action result: <strong>{{ lastResult }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageDialog } from '@/composables/useMessageDialog'

const { showConfirm, showSuccess, showError } = useMessageDialog()
const lastResult = ref<string>('')

const handleDeleteClick = async (): Promise<void> => {
  const confirmed = await showConfirm(
    'Delete Item',
    'Are you sure you want to delete this item? This action cannot be undone.',
    {
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      confirmSeverity: 'error',
      type: 'error'
    }
  )

  if (confirmed) {
    // Simulate delete operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess('Success', 'Item has been deleted successfully.')
    lastResult.value = 'Item deleted'
  } else {
    lastResult.value = 'Delete cancelled'
  }
}

const handleSaveClick = async (): Promise<void> => {
  const confirmed = await showConfirm(
    'Save Changes',
    'Do you want to save your changes?',
    {
      confirmLabel: 'Save',
      cancelLabel: 'Don\'t Save',
      confirmSeverity: 'success',
      type: 'info'
    }
  )

  if (confirmed) {
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess('Success', 'Changes have been saved successfully.')
    lastResult.value = 'Changes saved'
  } else {
    lastResult.value = 'Save cancelled'
  }
}

const handleCustomConfirmClick = async (): Promise<void> => {
  const confirmed = await showConfirm(
    'Custom Action',
    'This is a custom confirmation dialog with different styling.',
    {
      confirmLabel: 'Proceed',
      cancelLabel: 'Abort',
      confirmSeverity: 'warn',
      type: 'warn',
      style: {
        width: '500px',
        maxWidth: '95vw'
      }
    }
  )

  if (confirmed) {
    showSuccess('Success', 'Custom action completed successfully.')
    lastResult.value = 'Custom action completed'
  } else {
    lastResult.value = 'Custom action cancelled'
  }
}
</script>

<style lang="scss" scoped>
.confirm-example {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #007bff;
}
</style>
