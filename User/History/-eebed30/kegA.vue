<!-- examples/ConfirmationDialogExample.vue -->
<template>
  <div class="confirmation-example">
    <h2>Confirmation Dialog Example</h2>

    <div class="button-group">
      <Button
        label="Basic Confirmation"
        severity="info"
        @click="handleBasicConfirmation"
      />

      <Button
        label="Custom Confirmation"
        severity="warn"
        @click="handleCustomConfirmation"
      />

      <Button
        label="Danger Confirmation"
        severity="error"
        @click="handleDangerConfirmation"
      />
    </div>

    <div v-if="result" class="result">
      <p>Last action result: <strong>{{ result }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageDialog } from '@/composables/useMessageDialog'

const { showConfirmation } = useMessageDialog()
const result = ref<string>('')

const handleBasicConfirmation = async (): Promise<void> => {
  const confirmed = await showConfirmation(
    'Confirm Action',
    'Are you sure you want to proceed with this action?'
  )

  result.value = confirmed ? 'Confirmed' : 'Cancelled'
}

const handleCustomConfirmation = async (): Promise<void> => {
  const confirmed = await showConfirmation(
    'Delete Item',
    'This action cannot be undone. Are you sure you want to delete this item?',
    {
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      confirmSeverity: 'error',
      cancelSeverity: 'secondary',
      onConfirm: () => {
        console.log('Delete confirmed')
      },
      onCancel: () => {
        console.log('Delete cancelled')
      }
    }
  )

  result.value = confirmed ? 'Item Deleted' : 'Item Kept'
}

const handleDangerConfirmation = async (): Promise<void> => {
  const confirmed = await showConfirmation(
    'Dangerous Operation',
    'This is a dangerous operation that may cause data loss. Proceed with extreme caution.',
    {
      confirmLabel: 'Proceed Anyway',
      cancelLabel: 'Abort',
      confirmSeverity: 'error',
      cancelSeverity: 'success',
      style: {
        width: '500px'
      }
    }
  )

  result.value = confirmed ? 'Proceeded' : 'Aborted'
}
</script>

<style lang="scss" scoped>
.confirmation-example {
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
  border-radius: 4px;
  border-left: 4px solid #007bff;
}
</style>
