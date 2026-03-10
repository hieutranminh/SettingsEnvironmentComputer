# Error Dialog System

A global error dialog system built with PrimeVue v4 that supports nesting dialogs and provides a comprehensive API for displaying error messages, warnings, and confirmations throughout your Vue application.

## Features

- **Global Access**: Use anywhere in your application
- **Nesting Support**: Multiple dialogs can be displayed simultaneously with proper z-index stacking
- **Multiple Severity Levels**: Error, Warning, and Info dialogs
- **Detailed Error Information**: Expandable details section for technical information
- **Customizable**: Full control over titles, messages, buttons, and callbacks
- **Accessible**: Built with accessibility features and keyboard navigation
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Quick Start

### Basic Usage

```typescript
import { useErrorDialog } from '@/composables/useErrorDialog'

const { showError, showWarning, showInfo } = useErrorDialog()

// Show a simple error
showError('Something went wrong!')

// Show a warning
showWarning('Please review your input')

// Show information
showInfo('Operation completed successfully')
```

### Advanced Usage

```typescript
import { useErrorDialog } from '@/composables/useErrorDialog'

const { showDialog } = useErrorDialog()

// Show error with details
showDialog({
  title: 'API Error',
  message: 'Failed to fetch user data',
  details: 'Technical error details here...',
  severity: 'error',
  showDetails: true,
  onConfirm: () => {
    console.log('User acknowledged the error')
  },
})

// Show confirmation dialog
showDialog({
  title: 'Delete Confirmation',
  message: 'Are you sure you want to delete this item?',
  severity: 'warning',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  showCancelButton: true,
  onConfirm: () => {
    // Handle confirmation
  },
})
```

## API Reference

### useErrorDialog Composable

#### Methods

- `showError(message: string, options?: Partial<ErrorDialogOptions>): string`
- `showWarning(message: string, options?: Partial<ErrorDialogOptions>): string`
- `showInfo(message: string, options?: Partial<ErrorDialogOptions>): string`
- `showDialog(options: ErrorDialogOptions): string`
- `hideDialog(id: string): void`
- `hideAllDialogs(): void`

### ErrorDialogOptions Interface

```typescript
interface ErrorDialogOptions {
  title?: string // Dialog title (defaults based on severity)
  message: string // Main message text
  details?: string // Optional technical details
  severity?: 'error' | 'warning' | 'info' // Visual style
  showDetails?: boolean // Whether to show details section
  closable?: boolean // Whether dialog can be closed
  onClose?: () => void // Callback when dialog is closed
  onConfirm?: () => void // Callback when confirmed
  confirmText?: string // Confirm button text
  cancelText?: string // Cancel button text
  showCancelButton?: boolean // Whether to show cancel button
  zIndex?: number // Custom z-index for nesting
}
```

## Nesting Support

The system automatically handles dialog nesting by:

1. **Z-Index Management**: Each dialog gets an incrementing z-index
2. **Stacking**: Multiple dialogs can be displayed simultaneously
3. **Focus Management**: Proper focus handling for accessibility
4. **Animation**: Smooth transitions when dialogs appear/disappear

### Nesting Example

```typescript
// Show multiple dialogs
showError('First dialog')
setTimeout(() => {
  showWarning('Second dialog (nested)')
  setTimeout(() => {
    showInfo('Third dialog (nested further)')
  }, 1000)
}, 1000)
```

## Integration with Error Handling

### API Error Handling

```typescript
try {
  const response = await api.getUserData()
  // Handle success
} catch (error) {
  showDialog({
    title: 'API Error',
    message: 'Failed to fetch user data',
    details: error.stack || error.message,
    severity: 'error',
    showDetails: true,
  })
}
```

### Form Validation

```typescript
const validateForm = () => {
  const errors = []

  if (!email) errors.push('Email is required')
  if (!password) errors.push('Password is required')

  if (errors.length > 0) {
    showDialog({
      title: 'Validation Error',
      message: 'Please fix the following errors:',
      details: errors.join('\n'),
      severity: 'error',
      showDetails: true,
    })
    return false
  }

  return true
}
```

## Styling

The error dialog system uses PrimeVue's theming system and CSS custom properties. You can customize the appearance by overriding the CSS variables:

```scss
// Customize dialog colors
:root {
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
}
```

## Components

### ErrorDialog.vue

The main dialog component that renders individual dialogs.

### ErrorDialogContainer.vue

Container component that manages all dialogs and handles the global state.

### ErrorDialogDemo.vue

Demo component showcasing all features of the error dialog system.

## Store

### errorDialog.ts

Pinia store that manages the global state of all error dialogs, including:

- Dialog instances
- Z-index management
- Show/hide operations
- Nesting support

## Best Practices

1. **Use Appropriate Severity Levels**:

   - `error`: For actual errors that prevent functionality
   - `warning`: For issues that don't prevent functionality but need attention
   - `info`: For informational messages

2. **Provide Meaningful Details**:

   - Include stack traces for technical errors
   - Add request IDs for API errors
   - Include relevant context for validation errors

3. **Handle User Actions**:

   - Use `onConfirm` for actions that require user acknowledgment
   - Use `onClose` for cleanup operations
   - Provide clear button text that indicates the action

4. **Accessibility**:

   - The system includes proper ARIA attributes
   - Keyboard navigation is supported
   - Screen reader friendly

5. **Performance**:
   - Dialogs are automatically cleaned up after animation
   - Z-index management prevents memory leaks
   - Minimal re-renders with efficient state management
