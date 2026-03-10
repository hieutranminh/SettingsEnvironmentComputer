# Message Dialog System

A reusable and convenient dialog system built with PrimeVue v4's `useDialog` that allows you to easily show different types of dialogs throughout your application.

## Features

- **Multiple Dialog Types**: Error, Success, Warning, and Info dialogs
- **Queue System**: Automatically queues multiple dialogs to prevent overlapping
- **Custom Dialogs**: Support for custom dialog components
- **TypeScript Support**: Fully typed with TypeScript interfaces
- **Responsive Design**: Responsive breakpoints for mobile devices
- **Accessibility**: Built with accessibility in mind

## Basic Usage

### Import the Composable

```typescript
import { useMessageDialog } from '@/composables/useMessageDialog'

const { showError, showSuccess, showWarning, showInfo } = useMessageDialog()
```

### Show Different Types of Dialogs

```typescript
// Error Dialog
showError('Error Title', 'Something went wrong. Please try again.', () =>
  console.log('Error dialog closed'),
)

// Success Dialog
showSuccess('Success!', 'Your operation was completed successfully.', () =>
  console.log('Success dialog closed'),
)

// Warning Dialog
showWarning('Warning', 'This action cannot be undone. Are you sure?', () =>
  console.log('Warning dialog closed'),
)

// Info Dialog
showInfo('Information', 'Here is some important information for you.', () =>
  console.log('Info dialog closed'),
)
```

### Show Multiple Errors

```typescript
const { showErrors } = useMessageDialog()

showErrors([
  { title: 'Validation Error', message: 'Email is required' },
  { title: 'Network Error', message: 'Failed to connect to server' },
  { title: 'Permission Error', message: 'You do not have access' },
])
```

## Custom Dialogs

### Using showCustomDialog

```typescript
import { defineAsyncComponent } from 'vue'
import { useMessageDialog } from '@/composables/useMessageDialog'

const { showCustomDialog } = useMessageDialog()

const CustomComponent = defineAsyncComponent(() => import('@/components/CustomDialog.vue'))

showCustomDialog(
  CustomComponent,
  {
    header: 'Custom Dialog',
    title: 'My Custom Dialog',
    message: 'This is a custom dialog component',
  },
  {
    width: '600px',
    draggable: true,
    maximizable: true,
  },
)
```

### Custom Dialog Component Example

```vue
<template>
  <div class="custom-dialog">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <div class="actions">
      <button @click="handleCancel">Cancel</button>
      <button @click="handleConfirm">Confirm</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
}

defineProps<Props>()

const handleCancel = () => {
  // Dialog will close automatically
  console.log('Cancelled')
}

const handleConfirm = () => {
  // Dialog will close automatically
  console.log('Confirmed')
}
</script>
```

## Dialog Options

The `showCustomDialog` function accepts an optional `DialogOptions` object:

```typescript
interface DialogOptions {
  width?: string // Dialog width (default: '450px')
  height?: string // Dialog height
  closable?: boolean // Show close button (default: true)
  draggable?: boolean // Allow dragging (default: false)
  maximizable?: boolean // Allow maximizing (default: false)
  position?:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
}
```

## Queue Management

The dialog system automatically queues multiple dialogs to prevent overlapping. You can manage the queue:

```typescript
const { clearQueue, queueLength } = useMessageDialog()

// Clear all pending dialogs
clearQueue()

// Check how many dialogs are in the queue
console.log('Queue length:', queueLength())
```

## Integration with API Calls

### Error Handling in API Calls

```typescript
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useApi } from '@/composables/useApi'

const { showError, showSuccess } = useMessageDialog()
const { apiCall } = useApi()

const handleSubmit = async (data: FormData) => {
  try {
    await apiCall.post('/api/submit', data)
    showSuccess('Success', 'Data submitted successfully!')
  } catch (error) {
    showError('Error', 'Failed to submit data. Please try again.')
  }
}
```

### Validation Errors

```typescript
const handleFormSubmit = async (formData: FormData) => {
  try {
    const response = await apiCall.post('/api/submit', formData)
    showSuccess('Success', 'Form submitted successfully!')
  } catch (error) {
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors.map((err: any) => ({
        title: 'Validation Error',
        message: err.message,
      }))
      showErrors(errors)
    } else {
      showError('Error', 'An unexpected error occurred.')
    }
  }
}
```

## Best Practices

1. **Use Descriptive Titles**: Make dialog titles clear and actionable
2. **Keep Messages Concise**: Keep dialog messages short and to the point
3. **Handle Callbacks**: Use the `onClose` callback for cleanup or navigation
4. **Queue Management**: Use `clearQueue()` when navigating away from pages
5. **Custom Dialogs**: Use `showCustomDialog` for complex forms or confirmations
6. **Error Handling**: Always provide meaningful error messages to users

## Examples

See the example components in `src/components/examples/` for complete usage examples:

- `DialogExample.vue` - Basic dialog usage examples
- `CustomDialogExample.vue` - Custom dialog component example

## Migration from Old System

If you're migrating from the old dialog system:

1. Replace individual dialog component imports with the unified `MessageDialog.vue`
2. Update function calls to use the new composable
3. Remove old dialog component files if no longer needed
4. Update any custom dialog implementations to use `showCustomDialog`
