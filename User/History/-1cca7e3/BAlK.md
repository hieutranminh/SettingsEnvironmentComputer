# Message Dialog Flexibility Guide

This document provides comprehensive examples and explanations of how to make the message dialog system more flexible and powerful.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Custom Styling](#custom-styling)
3. [Dialog Behavior Options](#dialog-behavior-options)
4. [Custom Components](#custom-components)
5. [Advanced Callbacks](#advanced-callbacks)
6. [Global Configuration](#global-configuration)
7. [Queue Management](#queue-management)
8. [Responsive Design](#responsive-design)
9. [Z-Index Management](#z-index-management)
10. [Best Practices](#best-practices)

## Basic Usage

The message dialog system provides several predefined methods for common use cases:

```typescript
import { useMessageDialog } from '@/composables/useMessageDialog'

const {
  showSuccess,
  showInfo,
  showWarning,
  showError,
  showSecondary,
  showContrast,
  show,
  showNow,
} = useMessageDialog()

// Basic usage
showSuccess('Success!', 'Operation completed successfully')
showError('Error!', 'Something went wrong')
```

## Custom Styling

### Custom Dimensions and Layout

```typescript
// Custom width and height
showSuccess('Custom Size', 'This dialog has custom dimensions', {
  style: {
    width: '600px',
    height: '400px',
    maxWidth: '80vw',
    maxHeight: '80vh',
  },
})

// Custom styling for specific use cases
showInfo('Large Dialog', 'Content that needs more space', {
  style: {
    width: '800px',
    height: '600px',
    minWidth: '400px',
    minHeight: '300px',
  },
})
```

### Responsive Styling

```typescript
showWarning('Responsive Dialog', 'Adapts to different screen sizes', {
  style: {
    width: '600px',
  },
  breakpoints: {
    '1200px': '60vw', // Large screens
    '960px': '80vw', // Medium screens
    '641px': '95vw', // Small screens
    '480px': '98vw', // Mobile screens
  },
})
```

## Dialog Behavior Options

### Non-Modal Dialogs

```typescript
// Allow interaction with background
showInfo('Non-Modal', 'You can interact with the background', {
  modal: false,
  dismissableMask: true,
})
```

### Draggable Dialogs

```typescript
// Make dialog draggable
showInfo('Draggable Dialog', 'Drag the header to move this dialog', {
  draggable: true,
  style: {
    width: '500px',
  },
})
```

### Resizable Dialogs

```typescript
// Make dialog resizable
showSecondary('Resizable Dialog', 'Resize by dragging corners/edges', {
  resizable: true,
  style: {
    width: '450px',
    height: '300px',
    minWidth: '300px',
    minHeight: '200px',
  },
})
```

### Escape Key and Mask Behavior

```typescript
showWarning('Custom Behavior', 'Custom escape and mask settings', {
  closeOnEscape: false, // Disable escape key
  dismissableMask: true, // Allow clicking mask to close
  closable: false, // Hide close button
})
```

## Custom Components

### Using Custom Vue Components

```typescript
// Define a custom component
const CustomFormDialog = {
  template: `
    <div class="custom-form-dialog">
      <h3>{{ title }}</h3>
      <form @submit.prevent="handleSubmit">
        <input v-model="formData.name" placeholder="Name" />
        <input v-model="formData.email" placeholder="Email" />
        <button type="submit">Submit</button>
        <button type="button" @click="handleCancel">Cancel</button>
      </form>
    </div>
  `,
  props: ['title'],
  setup() {
    const formData = ref({ name: '', email: '' })

    const handleSubmit = () => {
      console.log('Form submitted:', formData.value)
      // Handle form submission
    }

    const handleCancel = () => {
      // Close dialog
    }

    return { formData, handleSubmit, handleCancel }
  },
}

// Use custom component
show({
  type: 'info',
  title: 'Custom Form',
  message: 'This dialog uses a custom component',
  component: CustomFormDialog,
  customProps: {
    title: 'User Registration',
  },
})
```

### Inline Component Definition

```typescript
show({
  type: 'success',
  title: 'Inline Component',
  message: 'Custom inline component',
  component: {
    template: `
      <div class="inline-dialog">
        <h3>Inline Component</h3>
        <p>This component was defined inline</p>
        <div class="actions">
          <button @click="handleAction">Action</button>
          <button @click="handleClose">Close</button>
        </div>
      </div>
    `,
    setup() {
      const handleAction = () => {
        showSuccess('Action', 'Custom action executed!')
      }

      const handleClose = () => {
        // Close logic
      }

      return { handleAction, handleClose }
    },
  },
})
```

## Advanced Callbacks

### Single Callback

```typescript
showError('Error with Callback', 'This will trigger a callback when closed', {
  onClose: () => {
    console.log('Dialog was closed')
    showInfo('Callback Executed', 'The callback was successfully executed')
  },
})
```

### Chained Callbacks

```typescript
showWarning('Chained Callbacks', 'Multiple callbacks will execute', {
  onClose: () => {
    console.log('First callback')
    showInfo('First Callback', 'First callback executed')

    setTimeout(() => {
      showWarning('Second Callback', 'Second callback executed')

      setTimeout(() => {
        showSuccess('Final Callback', 'All callbacks completed')
      }, 1000)
    }, 1000)
  },
})
```

### Conditional Callbacks

```typescript
let shouldShowFollowUp = true

showInfo('Conditional Callback', 'Callback behavior depends on state', {
  onClose: () => {
    if (shouldShowFollowUp) {
      showSuccess('Follow-up', 'Showing follow-up dialog')
      shouldShowFollowUp = false
    }
  },
})
```

## Global Configuration

### Setting Global Defaults

```typescript
import { useMessageDialog } from '@/composables/useMessageDialog'

const { configure, getConfig } = useMessageDialog()

// Configure global defaults
configure({
  queueDelay: 500, // Delay between queued dialogs
  autoZIndex: true, // Auto-manage z-index
  baseZIndex: 1000, // Starting z-index
  defaultStyle: {
    width: '500px',
    maxWidth: '85vw',
  },
  defaultBreakpoints: {
    '960px': '75vw',
    '641px': '90vw',
  },
})

// Get current configuration
const config = getConfig()
console.log('Current config:', config)
```

### Runtime Configuration Updates

```typescript
// Update configuration based on user preferences
const updateDialogConfig = (userPreferences: UserPreferences) => {
  configure({
    queueDelay: userPreferences.dialogSpeed === 'fast' ? 200 : 500,
    defaultStyle: {
      width: userPreferences.dialogSize === 'large' ? '600px' : '450px',
    },
  })
}
```

## Queue Management

### Immediate Display (No Queue)

```typescript
// Show dialog immediately without queuing
await showNow({
  type: 'success',
  title: 'Immediate Dialog',
  message: 'This dialog appears immediately',
  style: { width: '450px' },
})

// Continue with queued dialogs
showInfo('Queued Dialog', 'This dialog is queued normally')
```

### Queue Control

```typescript
const { clearQueue, getQueueLength, isQueueProcessing } = useMessageDialog()

// Check queue status
console.log('Queue length:', getQueueLength())
console.log('Is processing:', isQueueProcessing())

// Clear all pending dialogs
clearQueue()
showInfo('Queue Cleared', 'All pending dialogs have been cleared')
```

### Multiple Error Handling

```typescript
const handleMultipleErrors = (errors: ValidationError[]) => {
  // Show all errors in sequence
  errors.forEach((error) => {
    showError(error.field, error.message)
  })
}

// Or use the built-in method
showErrors([
  { title: 'Validation Error', message: 'Please check your input' },
  { title: 'Network Error', message: 'Unable to connect to server' },
])
```

## Responsive Design

### Custom Breakpoints

```typescript
showInfo('Responsive Dialog', 'Adapts to different screen sizes', {
  breakpoints: {
    '1400px': '50vw', // Extra large screens
    '1200px': '60vw', // Large screens
    '960px': '80vw', // Medium screens
    '768px': '90vw', // Tablet
    '480px': '95vw', // Mobile
    '320px': '98vw', // Small mobile
  },
  style: {
    width: '700px',
  },
})
```

### Mobile-First Approach

```typescript
// Mobile-first responsive dialog
showWarning('Mobile Optimized', 'Optimized for mobile devices', {
  style: {
    width: '95vw',
    maxWidth: '400px',
  },
  breakpoints: {
    '768px': '70vw',
    '1024px': '50vw',
  },
})
```

## Z-Index Management

### High Priority Dialogs

```typescript
// Ensure dialog appears above other elements
showError('Critical Error', 'This dialog must appear on top', {
  autoZIndex: false,
  baseZIndex: 9999,
  style: { width: '450px' },
})
```

### Layered Dialogs

```typescript
// Create layered dialog system
const showLayeredDialog = (level: number) => {
  showInfo(`Layer ${level}`, `This is dialog layer ${level}`, {
    autoZIndex: false,
    baseZIndex: 1000 + level * 100,
    style: { width: '400px' },
  })
}

// Show multiple layered dialogs
showLayeredDialog(1)
setTimeout(() => showLayeredDialog(2), 500)
setTimeout(() => showLayeredDialog(3), 1000)
```

## Best Practices

### 1. Consistent Styling

```typescript
// Define consistent dialog styles
const DIALOG_STYLES = {
  small: { width: '400px' },
  medium: { width: '600px' },
  large: { width: '800px' },
  fullscreen: { width: '90vw', height: '90vh' },
}

// Use consistent styles
showSuccess('Success', 'Operation completed', {
  style: DIALOG_STYLES.medium,
})
```

### 2. Error Handling

```typescript
const showUserFriendlyError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'

  showError('Error', message, {
    onClose: () => {
      // Log error for debugging
      console.error('User error:', error)
    },
  })
}
```

### 3. Accessibility

```typescript
// Ensure dialogs are accessible
showInfo('Accessible Dialog', 'This dialog follows accessibility guidelines', {
  closeOnEscape: true,
  dismissableMask: true,
  style: { width: '500px' },
})
```

### 4. Performance Optimization

```typescript
// Use showNow for critical dialogs
const showCriticalDialog = async () => {
  await showNow({
    type: 'error',
    title: 'Critical Error',
    message: 'Immediate attention required',
    style: { width: '450px' },
  })
}

// Batch multiple dialogs
const showBatchDialogs = (messages: string[]) => {
  messages.forEach((message, index) => {
    setTimeout(() => {
      showInfo(`Message ${index + 1}`, message)
    }, index * 100)
  })
}
```

### 5. Type Safety

```typescript
// Define proper types for dialog configurations
interface CustomDialogConfig {
  title: string
  message: string
  severity: 'success' | 'error' | 'warning'
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

const showTypedDialog = (config: CustomDialogConfig) => {
  show({
    type: config.severity,
    title: config.title,
    message: config.message,
    onClose: () => {
      // Handle close
    },
  })
}
```

## Advanced Patterns

### Dialog Factory

```typescript
const createDialogFactory = () => {
  const baseConfig = {
    style: { width: '500px' },
    closeOnEscape: true,
    dismissableMask: true,
  }

  return {
    success: (title: string, message: string, options = {}) => {
      showSuccess(title, message, { ...baseConfig, ...options })
    },
    error: (title: string, message: string, options = {}) => {
      showError(title, message, { ...baseConfig, ...options })
    },
    confirm: (title: string, message: string, onConfirm: () => void) => {
      show({
        type: 'warning',
        title,
        message,
        ...baseConfig,
        onClose: onConfirm,
      })
    },
  }
}

const dialogFactory = createDialogFactory()
dialogFactory.success('Success', 'Operation completed')
```

### Dialog Chain

```typescript
const showDialogChain = async (steps: Array<{ type: string; title: string; message: string }>) => {
  for (const step of steps) {
    await showNow({
      type: step.type as any,
      title: step.title,
      message: step.message,
      style: { width: '450px' },
    })
  }
}

// Usage
showDialogChain([
  { type: 'info', title: 'Step 1', message: 'First step completed' },
  { type: 'success', title: 'Step 2', message: 'Second step completed' },
  { type: 'warning', title: 'Step 3', message: 'Final step completed' },
])
```

This comprehensive guide demonstrates the flexibility and power of the message dialog system. The examples show how to customize every aspect of the dialogs while maintaining consistency and following best practices.
