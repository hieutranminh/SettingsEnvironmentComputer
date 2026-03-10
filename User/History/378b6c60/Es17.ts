import type { DialogConfig, DialogAction, DialogService } from '@/types/dialog'
import AppDialog from '@/components/dialogs/AppDialog.vue'

// We'll use a different approach since useDynamicDialog might not be available
// Let's create a service that can work with the global DynamicDialog instance

// Global dialog service instance
let globalDialogService: DialogService | null = null

export const createDialogService = (): DialogService => {
  const { open } = useDynamicDialog()

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

export const getDialogService = (): DialogService => {
  if (!globalDialogService) {
    globalDialogService = createDialogService()
  }
  return globalDialogService
}

// Export a default instance for direct use
export const dialogService = getDialogService()
