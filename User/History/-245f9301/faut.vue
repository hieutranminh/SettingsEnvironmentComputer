<template>
  <div class="dialog-demo">
    <h2>Global Dialog Demo</h2>

    <div class="demo-buttons">
      <Button
        label="Show Confirm Dialog"
        @click="handleShowConfirm"
        class="p-button-primary"
      />

      <Button
        label="Show Alert Dialog"
        @click="handleShowAlert"
        class="p-button-info"
      />

      <Button
        label="Show Error Dialog"
        @click="handleShowError"
        class="p-button-danger"
      />

      <Button
        label="Show Success Dialog"
        @click="handleShowSuccess"
        class="p-button-success"
      />

      <Button
        label="Show Custom Dialog"
        @click="handleShowCustom"
        class="p-button-warning"
      />

      <Button
        label="Show Nested Dialogs"
        @click="handleShowNested"
        class="p-button-secondary"
      />
    </div>

    <div class="demo-results" v-if="results.length > 0">
      <h3>Dialog Results:</h3>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          {{ result }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalDialog } from '@/composables/useDialog'

const { showConfirm, showAlert, showError, showSuccess, showDialog } = useGlobalDialog()
const results = ref<string[]>([])

const addResult = (message: string): void => {
  results.value.push(`${new Date().toLocaleTimeString()}: ${message}`)
}

const handleShowConfirm = async (): Promise<void> => {
  const confirmed = await showConfirm('Are you sure you want to proceed with this action?', 'Confirm Action')
  addResult(`Confirm dialog result: ${confirmed ? 'Yes' : 'No'}`)
}

const handleShowAlert = async (): Promise<void> => {
  const result = await showAlert('This is an informational message for the user.', 'Information')
  addResult(`Alert dialog result: ${result ? 'OK' : 'Cancelled'}`)
}

const handleShowError = async (): Promise<void> => {
  const result = await showError('Something went wrong! Please try again later.', 'Error')
  addResult(`Error dialog result: ${result ? 'OK' : 'Cancelled'}`)
}

const handleShowSuccess = async (): Promise<void> => {
  const result = await showSuccess('Operation completed successfully!', 'Success')
  addResult(`Success dialog result: ${result ? 'OK' : 'Cancelled'}`)
}

const handleShowCustom = async (): Promise<void> => {
  const result = await showDialog({
    header: 'Custom Dialog',
    message: 'This is a custom dialog with custom styling and options.',
    acceptLabel: 'Proceed',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-warning',
    rejectClass: 'p-button-secondary',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    draggable: true,
    resizable: true,
    maximizable: true,
    position: 'center'
  })
  addResult(`Custom dialog result: ${result ? 'Proceed' : 'Cancel'}`)
}

const handleShowNested = async (): Promise<void> => {
  const firstResult = await showConfirm('Do you want to show another dialog?', 'First Dialog')
  addResult(`First dialog result: ${firstResult ? 'Yes' : 'No'}`)

  if (firstResult) {
    const secondResult = await showAlert('This is a nested dialog!', 'Second Dialog')
    addResult(`Second dialog result: ${secondResult ? 'OK' : 'Cancelled'}`)

    if (secondResult) {
      const thirdResult = await showSuccess('All dialogs completed!', 'Final Dialog')
      addResult(`Third dialog result: ${thirdResult ? 'OK' : 'Cancelled'}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  .demo-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;

    .p-button {
      width: 100%;
      max-width: 300px;
    }
  }

  .demo-results {
    margin-top: 2rem;
    padding: 1rem;
    background-color: var(--surface-card);
    border-radius: var(--border-radius);
    border: 1px solid var(--surface-border);

    h3 {
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--surface-border);
        color: var(--text-color-secondary);
        font-family: monospace;
        font-size: 0.875rem;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
