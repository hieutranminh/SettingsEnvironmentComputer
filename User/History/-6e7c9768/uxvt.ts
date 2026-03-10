import { dialogService } from '@/services/dialogService'
import type { DialogOptions, DialogAction } from '@/types/dialog'

export const useDialog = () => {
  const show = (options: DialogOptions): Promise<DialogAction | null> => {
    return dialogService.show(options)
  }

  const showInfo = (message: string, title?: string): Promise<DialogAction | null> => {
    return dialogService.showInfo(message, title)
  }

  const showSuccess = (message: string, title?: string): Promise<DialogAction | null> => {
    return dialogService.showSuccess(message, title)
  }

  const showWarning = (message: string, title?: string): Promise<DialogAction | null> => {
    return dialogService.showWarning(message, title)
  }

  const showError = (message: string, title?: string): Promise<DialogAction | null> => {
    return dialogService.showError(message, title)
  }

  const showConfirm = (message: string, title?: string): Promise<DialogAction | null> => {
    return dialogService.showConfirm(message, title)
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
