# Message Dialog Improvements

## Overview

The `useMessageDialog` composable has been significantly enhanced to provide a more flexible and extensible approach for displaying message dialogs. This document outlines the improvements and how to use the new features.

## Key Improvements

### 1. Enhanced Configuration System

#### Global Configuration

You can now configure default behaviors across your application:

```typescript
import { useMessageDialog } from '@/composables/useMessageDialog'

const { configure } = useMessageDialog()

// Configure global defaults
configure({
  queueDelay: 300,
  defaultStyle: {
    width: '450px',
    maxWidth: '90vw',
  },
  defaultBreakpoints: {
    '960px': '75vw',
    '641px': '90vw',
  },
  autoZIndex: true,
  baseZIndex: 1000,
})
```

#### Per-Dialog Configuration

Each dialog can have its own configuration that overrides global defaults:

```typescript
showInfo('Custom Dialog', 'Message content', {
  style: {
    width: '60px',
    height: '400px',
  },
  draggable: true,
  closable: false,
  dismissableMask: true,
})
```

### 2. Flexible Dialog Options

#### Styling Options

```typescript
showInfo('Styled Dialog', 'Content', {
  style: {
    width: '80px',
    height: '400px',
    maxWidth: '90vw',
    maxHeight: '80vh',
    minWidth: '300px',
    minHeight: 200px,
  },
})
```

#### Behavior Options

```typescript
showInfo('Interactive Dialog', 'Content', {
  draggable: true, // Allow dragging
  closable: false, // Hide close button
  dismissableMask: true, // Close on mask click
  closeOnEscape: true, // Close on Escape key
  modal: true, // Modal behavior
})
```

### 3. Queue Management

Enhanced queue management capabilities:

```typescript
const { getQueueLength, isQueueProcessing, clearQueue } = useMessageDialog()

// Check queue status
console.log(`Queue length: ${getQueueLength()}`)
console.log(`Processing: ${isQueueProcessing()}`)

// Clear all pending dialogs
clearQueue()
```

### 4. Immediate Display

Show dialogs immediately without queuing:

```typescript
const { showImmediateDialog } = useMessageDialog()

// Show dialog immediately
await showImmediateDialog({
  type: 'success',
  title: 'Immediate',
  message: 'This dialog shows immediately',
})
```

### 5. Multiple Message Types Support

The composable supports various message types:

```typescript
const { showSuccess, showInfo, showWarning, showError, showSecondary, showContrast } = useMessageDialog()

// Basic usage
showSuccess('Success!', 'Operation completed successfully')
showInfo('Information', 'Here is some useful information')
showWarning('Warning', 'Please be careful with this action')
showError('Error', 'Something went wrong')
showSecondary('Secondary', 'Secondary information')
showContrast('Contrast', 'High contrast message')
```

### 6. Array Message Support

Display multiple messages in a single dialog:

```typescript
showSuccess('Success!', ['Operation completed', 'File uploaded successfully', 'Database updated'])

showError('Multiple Errors', ['Network connection failed', 'Database timeout', 'Invalid input data'])
```

### 7. Structured Error Support

Display structured error information with error codes and values:

```typescript
showError('Validation Errors', [
  {
    errorCode: 'VAL001',
    errorMessage: 'Email address is invalid',
    errorValues: [],
  },
  {
    errorCode: 'VAL002',
    errorMessage: 'Password must be at least 8 characters long',
    errorValues: [],
  },
  {
    errorCode: 'DB001',
    errorMessage: 'Foreign key constraint violation',
    errorValues: ['user_id: 12345', 'table: orders'],
  },
])
```

### 8. Multiple Error Dialogs

Show multiple error dialogs in sequence:

```typescript
const { showErrors } = useMessageDialog()

const errors = [
  { title: 'Validation Error', message: 'Please check your input fields.' },
  { title: 'Network Error', message: 'Unable to connect to the server.' },
  { title: 'Permission Error', message: 'You do not have permission to perform this action.' },
]
showErrors(errors)
```

## Type Safety

All features are fully typed with TypeScript:

```typescript
interface ErrorDetail {
  errorCode: string
  errorMessage: string
  errorValues: string[]
}

interface DialogStyle {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

interface MessageConfig {
  type: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  title: string
  message: string | string[] | ErrorDetail[]
  onClose?: () => void
  style?: DialogStyle
  closable?: boolean
  modal?: boolean
  draggable?: boolean
  dismissableMask?: boolean
  closeOnEscape?: boolean
  autoZIndex?: boolean
  baseZIndex?: number
  breakpoints?: Record<string, string>
  component?: Component
  customProps?: Record<string, unknown>
}

interface MessageDialogConfig {
  defaultStyle?: DialogStyle
  defaultBreakpoints?: Record<string, string>
  queueDelay?: number
  autoZIndex?: boolean
  baseZIndex?: number
}
```

## Migration Guide

### From Old API to New API

#### Before (Old API)

```typescript
showError('Error', 'Message', () => {
  console.log('Closed')
})
```

#### After (New API)

```typescript
showError('Error', 'Message', {
  onClose: () => {
    console.log('Closed')
  },
})
```

#### Before (Old API)

```typescript
showErrorNow('Error', 'Message', () => {
  console.log('Closed')
})
```

#### After (New API)

```typescript
showImmediateDialog({
  type: 'error',
  title: 'Error',
  message: 'Message',
  onClose: () => {
    console.log('Closed')
  },
})
```

## Best Practices

### 1. Global Configuration

Set up global configuration early in your application:

```typescript
// In main.ts or App.vue
const { configure } = useMessageDialog()

configure({
  queueDelay: 300,
  defaultStyle: {
    width: '500px',
    maxWidth: '95vw',
  },
})
```

### 2. Error Handling

Use the enhanced error dialog for better user experience:

```typescript
try {
  await performAction()
  showSuccess('Success!', 'Action completed successfully.')
} catch (error) {
  showError('Error', error.message, {
    onClose: () => {
      // Handle error dialog close
      console.log('Error dialog closed')
    },
  })
}
```

### 3. Queue Management

Monitor queue status for better UX:

```typescript
const handleMultipleActions = () => {
  showInfo('Processing', 'Starting multiple operations...')

  // Check if queue is processing
  if (isQueueProcessing()) {
    console.log('Dialog queue is currently processing')
  }

  // Clear queue if needed
  if (getQueueLength() > 5) {
    clearQueue()
    showWarning('Queue Cleared', 'Too many pending dialogs were cleared.')
  }
}
```

### 4. Structured Error Handling

Use structured errors for better error presentation:

```typescript
const handleValidationErrors = (errors: ErrorDetail[]) => {
  showError('Validation Failed', errors, {
    style: {
      width: 600,
      maxHeight: '70vh',
    },
  })
}
```

### 5. Immediate Dialogs

Use immediate dialogs for critical messages:

```typescript
const handleCriticalError = async () => {
  await showImmediateDialog({
    type: 'error',
    title: 'Critical Error',
    message: 'System is shutting down due to critical error',
    closable: false,
    modal: true,
  })

  // Perform cleanup after user acknowledges
  performSystemCleanup()
}
```

## Available Methods

The `useMessageDialog` composable provides the following methods:

### Configuration Methods

- `configure(config: Partial<MessageDialogConfig>)` - Set global configuration
- `getConfig()` - Get current global configuration

### Show Methods

- `showSuccess(title, message, options?)` - Show success dialog
- `showInfo(title, message, options?)` - Show info dialog
- `showWarning(title, message, options?)` - Show warning dialog
- `showError(title, message, options?)` - Show error dialog
- `showSecondary(title, message, options?)` - Show secondary dialog
- `showContrast(title, message, options?)` - Show contrast dialog
- `showErrors(errors)` - Show multiple error dialogs
- `showImmediateDialog(config)` - Show dialog immediately

### Queue Management Methods

- `clearQueue()` - Clear all pending dialogs
- `getQueueLength()` - Get number of pending dialogs
- `isQueueProcessing()` - Check if queue is currently processing

## Future Extensibility

The new structure is designed to be easily extensible for future needs:

1. **Custom Components**: Pass custom Vue components via the `component` property
2. **Animation Control**: Add animation configuration options
3. **Theming**: Support for theme-specific styling
4. **Accessibility**: Enhanced accessibility features
5. **Internationalization**: Better i18n support for message content
6. **Analytics**: Built-in analytics tracking for dialog interactions

## Conclusion

The improved `useMessageDialog` composable provides a much more flexible and extensible foundation for displaying message dialogs. The new features enable better user experience, more complex workflows, and easier maintenance while maintaining backward compatibility with existing code.

Key benefits:

- **Type Safety**: Full TypeScript support with proper interfaces
- **Flexibility**: Extensive configuration options for styling and behavior
- **Queue Management**: Robust handling of multiple dialogs
- **Error Handling**: Structured error display with detailed information
- **Performance**: Efficient queue processing with configurable delays
- **Extensibility**: Easy to extend with custom components and configurations
