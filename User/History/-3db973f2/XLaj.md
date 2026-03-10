# Confirm Dialog Usage

The `useMessageDialog` composable now includes a `showConfirm` function for handling confirmation dialogs, such as delete confirmations or save prompts.

## Basic Usage

```typescript
import { useMessageDialog } from '@/composables/useMessageDialog'

const { showConfirm, showSuccess } = useMessageDialog()

const handleDelete = async (): Promise<void> => {
  const confirmed = await showConfirm(
    'Delete Item',
    'Are you sure you want to delete this item? This action cannot be undone.',
  )

  if (confirmed) {
    // User clicked confirm - proceed with delete
    await deleteItem()
    showSuccess('Success', 'Item deleted successfully')
  } else {
    // User clicked cancel - do nothing
    console.log('Delete cancelled')
  }
}
```

## Advanced Configuration

The `showConfirm` function accepts an optional third parameter for configuration:

```typescript
const confirmed = await showConfirm('Save Changes', 'Do you want to save your changes?', {
  confirmLabel: 'Save',
  cancelLabel: "Don't Save",
  confirmSeverity: 'success',
  style: {
    width: '500px',
    maxWidth: '95vw',
  },
  onConfirm: () => {
    console.log('User confirmed')
  },
  onCancel: () => {
    console.log('User cancelled')
  },
})
```

## Configuration Options

| Option            | Type          | Default     | Description                                                                                |
| ----------------- | ------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `confirmLabel`    | `string`      | `'Confirm'` | Text for the confirm button                                                                |
| `cancelLabel`     | `string`      | `'Cancel'`  | Text for the cancel button                                                                 |
| `confirmSeverity` | `string`      | `'error'`   | Severity for the confirm button (primary, secondary, success, info, warn, error, contrast) |
| `style`           | `DialogStyle` | `undefined` | Custom dialog styling                                                                      |
| `onConfirm`       | `() => void`  | `undefined` | Callback when user confirms                                                                |
| `onCancel`        | `() => void`  | `undefined` | Callback when user cancels                                                                 |
| `modal`           | `boolean`     | `true`      | Whether dialog is modal                                                                    |
| `closable`        | `boolean`     | `true`      | Whether dialog can be closed                                                               |
| `draggable`       | `boolean`     | `false`     | Whether dialog is draggable                                                                |
| `dismissableMask` | `boolean`     | `false`     | Whether clicking mask closes dialog                                                        |
| `closeOnEscape`   | `boolean`     | `true`      | Whether ESC key closes dialog                                                              |

## Return Value

The `showConfirm` function returns a `Promise<boolean>`:

- `true` when user clicks confirm
- `false` when user clicks cancel or closes the dialog

## Common Use Cases

### Delete Confirmation

```typescript
const confirmed = await showConfirm(
  'Delete Item',
  'Are you sure you want to delete this item? This action cannot be undone.',
  {
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
    confirmSeverity: 'error',
  },
)
```

### Save Changes

```typescript
const confirmed = await showConfirm('Save Changes', 'Do you want to save your changes?', {
  confirmLabel: 'Save',
  cancelLabel: "Don't Save",
  confirmSeverity: 'success',
})
```

### Custom Styling

```typescript
const confirmed = await showConfirm('Custom Action', 'This is a custom confirmation dialog.', {
  style: {
    width: '600px',
    maxWidth: '95vw',
  },
})
```

## Integration with Existing Dialogs

The confirm dialog integrates seamlessly with the existing message dialog system and follows the same styling and behavior patterns. It uses the same global configuration and can be customized using the same configuration methods.
