# Notification Dialog System

A reusable notification dialog system built with PrimeVue v4 and Vue 3, providing a simple and flexible way to display various types of notifications throughout your application.

## Features

- **Multiple Notification Types**: Info, Success, Warning, and Error dialogs
- **Customizable Content**: Custom titles, messages, and icons
- **Action Buttons**: Support for custom action buttons (Confirm, Retry, etc.)
- **Global Service**: Accessible from anywhere in the application
- **TypeScript Support**: Fully typed with TypeScript interfaces
- **PrimeVue Integration**: Uses PrimeVue's DialogService for consistent styling
- **Responsive Design**: Works well on all screen sizes

## Quick Start

### 1. Basic Usage

```typescript
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

// Simple string messages
notification.showInfo('This is an informational message.')
notification.showSuccess('Operation completed successfully!')
notification.showWarning('Please review your input.')
notification.showError('An error occurred.')
```

### 2. Custom Notifications

```typescript
// Custom title and message
notification.showCustom({
  title: 'Custom Notification',
  message: 'This is a custom notification with specific content.',
  icon: 'pi pi-star',
})

// With action buttons
notification.showCustom({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  actions: [
    {
      label: 'Confirm',
      severity: 'danger',
      onClick: () => {
        // Handle confirmation
        console.log('Confirmed!')
      },
    },
    {
      label: 'Cancel',
      severity: 'secondary',
      onClick: () => {
        console.log('Cancelled!')
      },
    },
  ],
})
```

## API Reference

### NotificationService Interface

```typescript
interface NotificationService {
  showInfo: (options: NotificationOptions | string) => void
  showSuccess: (options: NotificationOptions | string) => void
  showWarning: (options: NotificationOptions | string) => void
  showError: (options: NotificationOptions | string) => void
  showCustom: (options: NotificationOptions) => void
}
```

### NotificationOptions Interface

```typescript
interface NotificationOptions {
  title?: string // Dialog title (defaults based on type)
  message: string // Dialog message (required)
  icon?: string // Custom icon class (defaults based on type)
  actions?: NotificationAction[] // Custom action buttons
  closable?: boolean // Show close button (default: true)
  width?: string // Dialog width (default: '30rem')
  height?: string // Dialog height
  modal?: boolean // Modal behavior (default: true)
  draggable?: boolean // Draggable dialog (default: false)
  closeOnEscape?: boolean // Close on ESC key (default: true)
  dismissableMask?: boolean // Close on mask click (default: false)
  showCloseIcon?: boolean // Show close icon (default: true)
}
```

### NotificationAction Interface

```typescript
interface NotificationAction {
  label: string // Button text
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger'
  onClick?: () => void // Click handler
  disabled?: boolean // Disable button
}
```

## Usage Examples

### 1. Form Validation Errors

```typescript
const handleSubmit = () => {
  if (!validateForm()) {
    notification.showError({
      title: 'Validation Errors',
      message: 'Please correct the following errors before submitting.',
      actions: [
        {
          label: 'Fix Errors',
          severity: 'primary',
          onClick: () => {
            // Focus on first error field
            document.querySelector('.p-invalid')?.focus()
          },
        },
      ],
    })
    return
  }

  // Continue with form submission
}
```

### 2. Confirmation Dialogs

```typescript
const handleDelete = () => {
  notification.showCustom({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    icon: 'pi pi-exclamation-triangle',
    actions: [
      {
        label: 'Delete',
        severity: 'danger',
        onClick: () => {
          deleteItem()
          notification.showSuccess('Item deleted successfully!')
        },
      },
      {
        label: 'Cancel',
        severity: 'secondary',
        onClick: () => {
          notification.showInfo('Delete cancelled.')
        },
      },
    ],
  })
}
```

### 3. Network Error Handling

```typescript
const handleApiCall = async () => {
  try {
    const result = await apiCall()
    notification.showSuccess('Data loaded successfully!')
  } catch (error) {
    notification.showError({
      title: 'Connection Failed',
      message: 'Unable to connect to the server. Please check your internet connection.',
      actions: [
        {
          label: 'Retry',
          severity: 'primary',
          onClick: () => handleApiCall(),
        },
        {
          label: 'Go Offline',
          severity: 'secondary',
          onClick: () => {
            // Handle offline mode
          },
        },
      ],
    })
  }
}
```

### 4. Success with Actions

```typescript
const handleSave = async () => {
  try {
    await saveData()
    notification.showSuccess({
      message: 'Data saved successfully!',
      actions: [
        {
          label: 'View Details',
          severity: 'primary',
          onClick: () => {
            router.push('/details')
          },
        },
        {
          label: 'Continue Editing',
          severity: 'secondary',
          onClick: () => {
            // Continue editing
          },
        },
      ],
    })
  } catch (error) {
    notification.showError('Failed to save data.')
  }
}
```

## Default Icons and Titles

The system provides default icons and titles for each notification type:

| Type    | Default Icon                 | Default Title |
| ------- | ---------------------------- | ------------- |
| Info    | `pi pi-info-circle`          | Information   |
| Success | `pi pi-check-circle`         | Success       |
| Warning | `pi pi-exclamation-triangle` | Warning       |
| Error   | `pi pi-times-circle`         | Error         |

## Styling

The notification dialogs use PrimeVue's default styling and CSS custom properties for colors:

- **Info**: `var(--blue-500)`
- **Success**: `var(--green-500)`
- **Warning**: `var(--orange-500)`
- **Error**: `var(--red-500)`

## Best Practices

1. **Keep Messages Concise**: Use clear, actionable messages
2. **Provide Context**: Include relevant information in error messages
3. **Use Appropriate Actions**: Only include action buttons when necessary
4. **Consistent Severity**: Use the correct severity level for your message type
5. **Handle User Actions**: Always provide a way for users to dismiss dialogs

## Integration with Existing Code

The notification system is designed to work seamlessly with existing Vue 3 components:

```typescript
// In any Vue component
<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

// Use in methods, computed, or anywhere in your component
const handleClick = () => {
  notification.showInfo('Button clicked!')
}
</script>
```

## Troubleshooting

### Dialog Not Showing

- Ensure `DialogService` is properly configured in `main.ts`
- Check that the `NotificationDialog` component is registered globally
- Verify that PrimeVue is properly installed and configured

### TypeScript Errors

- Make sure all types are properly imported
- Check that the notification composable is imported correctly
- Verify that action handlers are properly typed

### Styling Issues

- Ensure PrimeVue CSS is properly imported
- Check that the theme is correctly configured
- Verify that custom styles don't conflict with PrimeVue defaults
