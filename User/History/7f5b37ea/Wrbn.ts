import { useErrorDialogStore } from '@/stores/errorDialog'
import type { ErrorDialogOptions } from '@/types/ErrorDialog'

export const useErrorDialog = () => {
  const errorDialogStore = useErrorDialogStore()

  const showError = (message: string, options?: Partial<ErrorDialogOptions>): string => {
    return errorDialogStore.showError(message, options)
  }

  const showWarning = (message: string, options?: Partial<ErrorDialogOptions>): string => {
    return errorDialogStore.showWarning(message, options)
  }

  const showInfo = (message: string, options?: Partial<ErrorDialogOptions>): string => {
    return errorDialogStore.showInfo(message, options)
  }

  const showDialog = (options: ErrorDialogOptions): string => {
    return errorDialogStore.showDialog(options)
  }

  const hideDialog = (id: string): void => {
    errorDialogStore.hideDialog(id)
  }

  const hideAllDialogs = (): void => {
    errorDialogStore.hideAllDialogs()
  }

  const showErrorWithDetails = (
    message: string,
    details: string,
    options?: Partial<ErrorDialogOptions>
  ): string => {
    return errorDialogStore.showError(message, {
      ...options,
      details,
      showDetails: true
    })
  }

  const showConfirmDialog = (
    message: string,
    onConfirm: () => void,
    options?: Partial<ErrorDialogOptions>
  ): string => {
    return errorDialogStore.showDialog({
      message,
      severity: 'warning',
      title: options?.title ?? 'Confirm Action',
      confirmText: options?.confirmText ?? 'Confirm',
      cancelText: options?.cancelText ?? 'Cancel',
      showCancelButton: true,
      onConfirm,
      ...options
    })
  }

  return {
    showError,
    showWarning,
    showInfo,
    showDialog,
    hideDialog,
    hideAllDialogs,
    showErrorWithDetails,
    showConfirmDialog
  }
}
