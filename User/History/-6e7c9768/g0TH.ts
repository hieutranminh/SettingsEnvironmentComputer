import type { DialogConfig, DialogAction, DialogService } from '@/types/dialog'

export const useDialog = (): DialogService => {
  // We'll use the global DynamicDialog instance
  const openDialog = (component: any, options: any) => {
    // This will be implemented using the global DynamicDialog service
    console.log('Opening dialog:', component, options)
  }

  const createDialogConfig = (
    message: string,
    severity: 'success' | 'info' | 'warn' | 'error',
    title?: string,
    actions?: DialogAction[]
  ): DialogConfig => {
    const icons = {
      success: 'pi pi-check-circle',
      info: 'pi pi-info-circle',
      warn: 'pi pi-exclamation-triangle',
      error: 'pi pi-times-circle'
    }

    return {
      title: title ?? severity.charAt(0).toUpperCase() + severity.slice(1),
      message,
      icon: icons[severity],
      severity,
      actions,
      closable: true,
      modal: true,
      closeOnEscape: true,
      dismissableMask: false
    }
  }

  const showDialog = (config: DialogConfig): void => {
    open(AppDialog, {
      props: {
        config
      },
      onClose: () => {
        // Dialog closed
      },
      onAction: (action: DialogAction) => {
        // Action clicked
      }
    })
  }

  const showError = (message: string, title?: string, actions?: DialogAction[]): void => {
    const config = createDialogConfig(message, 'error', title, actions)
    showDialog(config)
  }

  const showInfo = (message: string, title?: string, actions?: DialogAction[]): void => {
    const config = createDialogConfig(message, 'info', title, actions)
    showDialog(config)
  }

  const showWarning = (message: string, title?: string, actions?: DialogAction[]): void => {
    const config = createDialogConfig(message, 'warn', title, actions)
    showDialog(config)
  }

  const showSuccess = (message: string, title?: string, actions?: DialogAction[]): void => {
    const config = createDialogConfig(message, 'success', title, actions)
    showDialog(config)
  }

  const showConfirm = (
    message: string,
    title?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): void => {
    const actions: DialogAction[] = [
      {
        label: 'Cancel',
        severity: 'secondary',
        onClick: onCancel
      },
      {
        label: 'Confirm',
        severity: 'danger',
        onClick: onConfirm
      }
    ]

    const config = createDialogConfig(message, 'warn', title ?? 'Confirm Action', actions)
    config.closable = false
    showDialog(config)
  }

  const showCustom = (config: DialogConfig): void => {
    showDialog(config)
  }

  const close = (): void => {
    // DynamicDialog handles closing automatically
    // This method is provided for API consistency
  }

  return {
    showError,
    showInfo,
    showWarning,
    showSuccess,
    showConfirm,
    showCustom,
    close
  }
}

// Global dialog service instance
let globalDialogService: DialogService | null = null

export const getDialogService = (): DialogService => {
  if (!globalDialogService) {
    globalDialogService = useDialog()
  }
  return globalDialogService
}

// Import the dialog component
import AppDialog from '@/components/dialogs/AppDialog.vue'
