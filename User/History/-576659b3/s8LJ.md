# Dialog System Documentation

A reusable dialog system built with PrimeVue v4 and Vue 3, providing a simple and flexible way to display dialogs throughout your application.

## Features

- ✅ **Simple API**: Easy-to-use composable with intuitive methods
- ✅ **Multiple Dialog Types**: Info, Success, Warning, Error, and Confirm dialogs
- ✅ **Custom Dialogs**: Fully customizable with custom titles, messages, icons, and actions
- ✅ **Action Buttons**: Support for multiple action buttons with different severities
- ✅ **Promise-based**: All dialogs return promises for easy async handling
- ✅ **Global Service**: Access dialogs from anywhere in your application
- ✅ **PrimeVue Integration**: Uses PrimeVue's default styling and components
- ✅ **TypeScript Support**: Full type safety with comprehensive interfaces

## Quick Start

### 1. Basic Usage

```typescript
import { useDialog } from '@/composables/useDialog'

const { showInfo, showSuccess, showWarning, showError, showConfirm } = useDialog()

// Show a simple info dialog
await showInfo('This is an information message')

// Show a success dialog
await showSuccess('Operation completed successfully!')

// Show a warning dialog
await showWarning('Please review your input before proceeding')

// Show an error dialog
await showError('An error occurred while processing your request')
```

### 2. Confirmation Dialogs

```typescript
const result = await showConfirm('Are you sure you want to delete this item?')

if (result?.label === 'Confirm') {
  // User confirmed the action
  await showSuccess('Item deleted successfully!')
} else {
  // User cancelled
  await showInfo('Operation cancelled')
}
```

### 3. Custom Dialogs

```typescript
const result = await show({
  title: 'Custom Dialog',
  message: 'This is a custom dialog with specific options',
  icon: 'pi pi-cog',
  width: '600px',
  actions: [
    {
      label: 'Save',
      severity: 'success',
    },
    {
      label: 'Cancel',
      severity: 'secondary',
    },
  ],
})

if (result?.label === 'Save') {
  // Handle save action
}
```

## API Reference

### useDialog Composable

The `useDialog` composable provides the following methods:

#### `showInfo(message: string, title?: string): Promise<DialogAction | null>`

Shows an information dialog with a blue info icon.

#### `showSuccess(message: string, title?: string): Promise<DialogAction | null>`

Shows a success dialog with a green check icon.

#### `showWarning(message: string, title?: string): Promise<DialogAction | null>`

Shows a warning dialog with a yellow warning icon.

#### `showError(message: string, title?: string): Promise<DialogAction | null>`

Shows an error dialog with a red error icon.

#### `showConfirm(message: string, title?: string): Promise<DialogAction | null>`

Shows a confirmation dialog with Cancel and Confirm buttons.

#### `show(options: DialogOptions): Promise<DialogAction | null>`

Shows a custom dialog with full configuration options.

### DialogOptions Interface

```typescript
interface DialogOptions {
  title?: string // Dialog title
  message: string // Dialog message (required)
  icon?: string // Icon class (e.g., 'pi pi-info-circle')
  actions?: DialogAction[] // Array of action buttons
  closable?: boolean // Whether to show close button (default: true)
  width?: string // Dialog width (default: '450px')
  height?: string // Dialog height
  modal?: boolean // Whether dialog is modal (default: true)
  draggable?: boolean // Whether dialog is draggable (default: false)
  resizable?: boolean // Whether dialog is resizable (default: false)
  maximizable?: boolean // Whether dialog is maximizable (default: false)
  minimizable?: boolean // Whether dialog is minimizable (default: false)
  closeOnEscape?: boolean // Close on Escape key (default: true)
  closeOnOverlayClick?: boolean // Close on overlay click (default: false)
}
```

### DialogAction Interface

```typescript
interface DialogAction {
  label: string // Button label
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
  onClick?: () => void | Promise<void> // Optional click handler
  disabled?: boolean // Whether button is disabled
}
```

## Examples

### Basic Information Dialog

```typescript
const { showInfo } = useDialog()

const handleShowInfo = async (): Promise<void> => {
  await showInfo('This is an information message. It provides useful details to the user.')
}
```

### Success Dialog with Custom Title

```typescript
const { showSuccess } = useDialog()

const handleShowSuccess = async (): Promise<void> => {
  await showSuccess('Operation completed successfully!', 'Great Job!')
}
```

### Confirmation with Custom Actions

```typescript
const { show } = useDialog()

const handleDeleteConfirm = async (): Promise<void> => {
  const result = await show({
    title: 'Delete Confirmation',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    icon: 'pi pi-exclamation-triangle',
    actions: [
      {
        label: 'Cancel',
        severity: 'secondary',
      },
      {
        label: 'Delete',
        severity: 'danger',
      },
    ],
  })

  if (result?.label === 'Delete') {
    // Perform delete operation
    await deleteItem()
    await showSuccess('Item deleted successfully!')
  }
}
```

### Custom Dialog with Multiple Actions

```typescript
const { show } = useDialog()

const handleShowCustom = async (): Promise<void> => {
  const result = await show({
    title: 'Save Options',
    message: 'Choose how you want to save your changes:',
    icon: 'pi pi-save',
    width: '500px',
    actions: [
      {
        label: 'Save',
        severity: 'success',
        onClick: () => console.log('Save clicked'),
      },
      {
        label: 'Save as Draft',
        severity: 'secondary',
        onClick: () => console.log('Save as draft clicked'),
      },
      {
        label: 'Cancel',
        severity: 'danger',
      },
    ],
  })

  if (result) {
    console.log(`User selected: ${result.label}`)
  }
}
```

### Error Handling with Retry

```typescript
const { showError, show } = useDialog()

const handleApiCall = async (): Promise<void> => {
  try {
    await apiCall()
    await showSuccess('Data saved successfully!')
  } catch (error) {
    const result = await show({
      title: 'Error',
      message: 'Failed to save data. Please try again.',
      icon: 'pi pi-times-circle',
      actions: [
        {
          label: 'Retry',
          severity: 'warning',
        },
        {
          label: 'Cancel',
          severity: 'secondary',
        },
      ],
    })

    if (result?.label === 'Retry') {
      await handleApiCall() // Retry the operation
    }
  }
}
```

## Integration with Vue Components

### In a Vue Component

```vue
<template>
  <div>
    <Button label="Show Info" @click="handleShowInfo" />
    <Button label="Show Success" severity="success" @click="handleShowSuccess" />
    <Button label="Show Warning" severity="warning" @click="handleShowWarning" />
    <Button label="Show Error" severity="danger" @click="handleShowError" />
    <Button label="Show Confirm" @click="handleShowConfirm" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { useDialog } from '@/composables/useDialog'

const { showInfo, showSuccess, showWarning, showError, showConfirm } = useDialog()

const handleShowInfo = async (): Promise<void> => {
  await showInfo('This is an information message.')
}

const handleShowSuccess = async (): Promise<void> => {
  await showSuccess('Operation completed successfully!')
}

const handleShowWarning = async (): Promise<void> => {
  await showWarning('Please review your input before proceeding.')
}

const handleShowError = async (): Promise<void> => {
  await showError('An error occurred while processing your request.')
}

const handleShowConfirm = async (): Promise<void> => {
  const result = await showConfirm('Are you sure you want to proceed?')

  if (result?.label === 'Confirm') {
    await showSuccess('Action confirmed!')
  } else {
    await showInfo('Action cancelled.')
  }
}
</script>
```

## File Structure

```
src/
├── components/
│   └── dialogs/
│       ├── BaseDialog.vue          # Main dialog component
│       └── DialogContainer.vue     # Global dialog container
├── composables/
│   └── useDialog.ts               # Dialog composable
├── services/
│   └── dialogService.ts           # Global dialog service
├── types/
│   └── dialog.ts                  # TypeScript interfaces
└── components/examples/
    └── DialogDemo.vue             # Demo component
```

## Demo

Visit `/dialog-demo` in your application to see all dialog types in action.

## Best Practices

1. **Use Appropriate Dialog Types**: Choose the right dialog type for your use case

   - Use `showInfo` for informational messages
   - Use `showSuccess` for successful operations
   - Use `showWarning` for warnings and cautions
   - Use `showError` for error messages
   - Use `showConfirm` for user confirmations

2. **Handle Promise Results**: Always handle the promise returned by dialog methods

   ```typescript
   const result = await showConfirm('Are you sure?')
   if (result?.label === 'Confirm') {
     // Handle confirmation
   }
   ```

3. **Use Descriptive Messages**: Write clear, actionable messages

   ```typescript
   // ✅ Good
   await showError('Failed to save user data. Please check your internet connection and try again.')

   // ❌ Bad
   await showError('Error occurred.')
   ```

4. **Customize When Needed**: Use the `show` method for complex dialogs with multiple actions

   ```typescript
   await show({
     title: 'Complex Operation',
     message: 'This operation has multiple steps. Choose your preferred action:',
     actions: [
       { label: 'Proceed', severity: 'success' },
       { label: 'Skip', severity: 'secondary' },
       { label: 'Cancel', severity: 'danger' },
     ],
   })
   ```

5. **Error Handling**: Always wrap dialog calls in try-catch when appropriate
   ```typescript
   try {
     await showConfirm('Delete this item?')
     // Handle confirmation
   } catch (error) {
     console.error('Dialog error:', error)
   }
   ```

## Troubleshooting

### Dialog Not Showing

- Ensure `DialogContainer` is included in your `App.vue`
- Check that PrimeVue is properly configured in `main.ts`
- Verify that the dialog service is being called correctly

### TypeScript Errors

- Make sure all imports are correct
- Check that the dialog types are properly imported
- Ensure you're using the latest version of PrimeVue

### Styling Issues

- The dialog system uses PrimeVue's default styling
- Custom styles can be added to `BaseDialog.vue` if needed
- Ensure PrimeVue theme is properly configured

## Migration from Other Dialog Systems

If you're migrating from another dialog system:

1. Replace direct dialog component usage with `useDialog` composable
2. Convert callback-based dialogs to promise-based
3. Update action handling to use the returned `DialogAction` object
4. Test all dialog interactions thoroughly

## Contributing

When adding new features to the dialog system:

1. Update the TypeScript interfaces in `src/types/dialog.ts`
2. Add new methods to `src/services/dialogService.ts`
3. Update the composable in `src/composables/useDialog.ts`
4. Add examples to the demo component
5. Update this documentation
