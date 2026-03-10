<!-- examples/ConfirmDialogExample.vue -->
<template>
  <div class="confirm-dialog-example">
    <h2>Confirm Dialog Examples</h2>

    <div class="button-group">
      <Button
        label="Basic Confirm"
        severity="primary"
        @click="handleBasicConfirm"
      />

      <Button
        label="Custom Labels"
        severity="secondary"
        @click="handleCustomLabels"
      />

      <Button
        label="Custom Severity"
        severity="warn"
        @click="handleCustomSeverity"
      />

      <Button
        label="With Callbacks"
        severity="info"
        @click="handleWithCallbacks"
      />

      <Button
        label="Delete Confirmation"
        severity="error"
        @click="handleDeleteConfirm"
      />
    </div>

    <div v-if="lastResult" class="result">
      <p>Last confirmation result: <strong>{{ lastResult ? 'Confirmed' : 'Cancelled' }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageDialog } from '@/composables/useMessageDialog'

const { showConfirm } = useMessageDialog()
const lastResult = ref<boolean | null>(null)

const handleBasicConfirm = async (): Promise<void> => {
  const result = await showConfirm(
    'Basic Confirmation',
    'Are you sure you want to proceed with this action?'
  )
  lastResult.value = result
}

const handleCustomLabels = async (): Promise<void> => {
  const result = await showConfirm(
    'Custom Labels',
    'Do you want to save your changes?',
    {
      confirmLabel: 'Save',
      cancelLabel: 'Don\'t Save',
      confirmSeverity: 'success',
      cancelSeverity: 'secondary'
    }
  )
  lastResult.value = result
}

const handleCustomSeverity = async (): Promise<void> => {
  const result = await showConfirm(
    'Custom Severity',
    'This action cannot be undone. Are you sure?',
    {
      confirmSeverity: 'error',
      cancelSeverity: 'info'
    }
  )
  lastResult.value = result
}

const handleWithCallbacks = async (): Promise<void> => {
  const result = await showConfirm(
    'With Callbacks',
    'This will trigger additional actions. Continue?',
    {
      onConfirm: () => {
        console.log('Confirmed with callback')
      },
      onCancel: () => {
        console.log('Cancelled with callback')
      }
    }
  )
  lastResult.value = result
}

const handleDeleteConfirm = async (): Promise<void> => {
  const result = await showConfirm(
    'Delete Confirmation',
    'Are you sure you want to delete this item? This action cannot be undone.',
    {
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      confirmSeverity: 'error',
      cancelSeverity: 'secondary',
      onConfirm: () => {
        console.log('Item deleted')
      }
    }
  )
  lastResult.value = result
}
</script>

<style lang="scss" scoped>
.confirm-dialog-example {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.result {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}
</style>
