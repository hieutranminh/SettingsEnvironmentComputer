import type { DialogConfig, DialogAction, DialogService } from '@/types/dialog'

// Global dialog service instance
let globalDialogService: DialogService | null = null

// We'll use a simple approach that can be extended with DynamicDialog
export const useDialog = (): DialogService => {
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
    // For now, we'll use a simple alert approach
    // This can be replaced with DynamicDialog implementation
    const actionLabels = config.actions?.map(a => a.label).join(', ') || 'Close'
    alert(`${config.title}\n\n${config.message}\n\nActions: ${actionLabels}`)
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
    // Dialog closing logic will be implemented
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
    globalDialogService = useDialog()
  }
  return globalDialogService
}
