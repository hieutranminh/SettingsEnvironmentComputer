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
        <Button
          label="Custom Styling"
          severity="info"
          @click="handleCustomStylingClick"
          class="example-button"
        />
        <Button
          label="Custom Actions"
          severity="success"
          @click="handleCustomActionsClick"
          class="example-button"
        />
        <Button
          label="Non-Modal Dialog"
          severity="warn"
          @click="handleNonModalClick"
          class="example-button"
        />
        <Button
          label="Draggable Dialog"
          severity="secondary"
          @click="handleDraggableClick"
          class="example-button"
        />
        <Button
          label="Custom Component"
          severity="primary"
          @click="handleCustomComponentClick"
          class="example-button"
        />
        <Button
          label="Multiple Callbacks"
          severity="info"
          @click="handleMultipleCallbacksClick"
          class="example-button"
        />
        <Button
          label="Global Configuration"
          severity="secondary"
          @click="handleGlobalConfigClick"
          class="example-button"
        />
        <Button
          label="Show Now (No Queue)"
          severity="success"
          @click="handleShowNowClick"
          class="example-button"
        />
        <Button
          label="Custom Breakpoints"
          severity="warn"
          @click="handleCustomBreakpointsClick"
          class="example-button"
        />
        <Button
          label="High Z-Index"
          severity="danger"
          @click="handleHighZIndexClick"
          class="example-button"
        />
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
import { ref,  } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import { useMessageDialog } from '@/composables/useMessageDialog'

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
  clearQueue,
  show,
  showNow,
  configure,
  getConfig,
} = useMessageDialog()

const isProcessing = ref(false)

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
    {
      onClose: () => {
        console.log('Error dialog was closed!')
        showInfo('Callback Executed', 'The error dialog callback was successfully executed.')
      }
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

// Flexible Features Handlers
const handleCustomStylingClick = (): void => {
  showSuccess(
    'Custom Styled Dialog',
    'This dialog has custom width, height, and styling.',
    {
      style: {
        width: '600px',
        height: '400px',
        maxWidth: '80vw',
        maxHeight: '80vh'
      }
    }
  )
}

const handleCustomActionsClick = (): void => {
  showInfo(
    'Custom Actions',
    'This dialog demonstrates custom action buttons and callbacks.',
    {
      onClose: () => {
        console.log('Dialog closed with custom action')
      }
    }
  )
}

const handleNonModalClick = (): void => {
  showWarning(
    'Non-Modal Dialog',
    'This dialog is not modal - you can interact with the background.',
    {
      modal: false,
      dismissableMask: true
    }
  )
}

const handleDraggableClick = (): void => {
  showInfo(
    'Draggable Dialog',
    'This dialog can be dragged around the screen. Try dragging the header!',
    {
      draggable: true,
      style: {
        width: '500px'
      }
    }
  )
}

const handleCustomComponentClick = (): void => {
  // Create a custom component for the dialog
  const CustomDialogComponent = {
    template: `
      <div class="custom-dialog">
        <h3>Custom Component Dialog</h3>
        <p>This dialog uses a completely custom component instead of the default MessageDialog.</p>
        <div class="custom-content">
          <p>You can put any Vue component here!</p>
          <ul>
            <li>Custom styling</li>
            <li>Custom logic</li>
            <li>Custom interactions</li>
          </ul>
        </div>
        <div class="custom-actions">
          <button @click="handleCustomAction">Custom Action</button>
          <button @click="handleClose">Close</button>
        </div>
      </div>
    `,
    setup() {
      const handleCustomAction = (): void => {
        console.log('Custom action executed!')
        showSuccess('Custom Action', 'The custom action was executed!')
      }

      const handleClose = (): void => {
        // This would be handled by the dialog system
        console.log('Custom dialog closed')
      }

      return {
        handleCustomAction,
        handleClose
      }
    }
  }

  show({
    type: 'info',
    title: 'Custom Component',
    message: 'This dialog uses a custom component',
    component: CustomDialogComponent,
    style: {
      width: '550px'
    }
  })
}

const handleMultipleCallbacksClick = (): void => {
  showError(
    'Multiple Callbacks',
    'This dialog demonstrates multiple callback scenarios.',
    {
      onClose: () => {
        console.log('Dialog closed')
        showInfo('Callback Chain', 'First callback executed')

        // Chain another callback
        setTimeout(() => {
          showWarning('Callback Chain', 'Second callback executed')
        }, 1000)
      }
    }
  )
}

const handleGlobalConfigClick = (): void => {
  // Show current configuration
  const currentConfig = getConfig()
  showInfo(
    'Current Global Configuration',
    `Queue Delay: ${currentConfig.queueDelay}ms\nAuto Z-Index: ${currentConfig.autoZIndex}\nBase Z-Index: ${currentConfig.baseZIndex}`,
    {
      style: {
        width: '500px'
      }
    }
  )

  // Update configuration
  setTimeout(() => {
    configure({
      queueDelay: 500,
      defaultStyle: {
        width: '500px',
        maxWidth: '85vw'
      }
    })

    showSuccess(
      'Configuration Updated',
      'Global configuration has been updated with new settings.',
      {
        style: {
          width: '500px'
        }
      }
    )
  }, 2000)
}

const handleShowNowClick = async (): Promise<void> => {
  // Show dialog immediately without queuing
  await showNow({
    type: 'success',
    title: 'Immediate Dialog',
    message: 'This dialog was shown immediately without queuing!',
    style: {
      width: '450px'
    }
  })

  // Show another dialog after the first one closes
  showInfo('Queue Test', 'This dialog was queued normally after the immediate dialog closed.')
}

const handleCustomBreakpointsClick = (): void => {
  showInfo(
    'Custom Breakpoints',
    'This dialog has custom responsive breakpoints for different screen sizes.',
    {
      breakpoints: {
        '1200px': '60vw',
        '960px': '80vw',
        '641px': '95vw',
        '480px': '98vw'
      },
      style: {
        width: '600px'
      }
    }
  )
}

const handleHighZIndexClick = (): void => {
  showWarning(
    'High Z-Index Dialog',
    'This dialog has a very high z-index to appear above other elements.',
    {
      autoZIndex: false,
      baseZIndex: 9999,
      style: {
        width: '450px'
      }
    }
  )
}
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
