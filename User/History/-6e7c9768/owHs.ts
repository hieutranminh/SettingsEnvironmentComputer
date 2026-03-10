import { useDialog as usePrimeDialog } from 'primevue/usedialog'
import BaseDialog from '@/components/dialogs/BaseDialog.vue'
import type { DialogOptions, DialogInstance, DialogAction } from '@/types/dialog'

export const useDialog = () => {
  const { open } = usePrimeDialog()

  const show = (options: DialogOptions): DialogInstance => {
    const dialogRef = open(BaseDialog, {
      props: {
        options
      },
      on: {
        close: () => {
          dialogRef.close()
        },
        action: () => {
          // Handle action if needed
        }
      }
    })

    return {
      close: () => dialogRef.close(),
      update: (newOptions: Partial<DialogOptions>) => {
        dialogRef.updateProps({
          options: { ...options, ...newOptions }
        })
      }
    }
  }

  const showInfo = (message: string, title?: string): DialogInstance => {
    return show({
      title: title ?? 'Information',
      message,
      icon: 'pi pi-info-circle',
      actions: []
    })
  }

  const showSuccess = (message: string, title?: string): DialogInstance => {
    return show({
      title: title ?? 'Success',
      message,
      icon: 'pi pi-check-circle',
      actions: []
    })
  }

  const showWarning = (message: string, title?: string): DialogInstance => {
    return show({
      title: title ?? 'Warning',
      message,
      icon: 'pi pi-exclamation-triangle',
      actions: []
    })
  }

  const showError = (message: string, title?: string): DialogInstance => {
    return show({
      title: title ?? 'Error',
      message,
      icon: 'pi pi-times-circle',
      actions: []
    })
  }

  const showConfirm = (
    message: string,
    title?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): DialogInstance => {
    const actions: DialogAction[] = [
      {
        label: 'Cancel',
        severity: 'secondary',
        onClick: () => {
          onCancel?.()
        }
      },
      {
        label: 'Confirm',
        severity: 'primary',
        onClick: () => {
          onConfirm?.()
        }
      }
    ]

    return show({
      title: title ?? 'Confirm',
      message,
      icon: 'pi pi-question-circle',
      actions,
      closable: false
    })
  }

  return {
    show,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showConfirm
  }
}
