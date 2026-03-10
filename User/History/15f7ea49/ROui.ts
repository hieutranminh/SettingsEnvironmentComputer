import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ErrorDialogOptions, ErrorDialogInstance, ErrorDialogState } from '@/types/ErrorDialog'

export const useErrorDialogStore = defineStore('errorDialog', () => {
  const dialogs = ref<ErrorDialogInstance[]>([])
  const nextZIndex = ref(1000)

  const state = computed<ErrorDialogState>(() => ({
    dialogs: dialogs.value,
    nextZIndex: nextZIndex.value
  }))

  const visibleDialogs = computed(() =>
    dialogs.value.filter(dialog => dialog.isVisible)
  )

  const showDialog = (options: ErrorDialogOptions): string => {
    const id = `error-dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const zIndex = options.zIndex ?? nextZIndex.value++

    const dialog: ErrorDialogInstance = {
      id,
      options: {
        title: options.title ?? 'Error',
        message: options.message,
        details: options.details,
        severity: options.severity ?? 'error',
        showDetails: options.showDetails ?? false,
        closable: options.closable ?? true,
        onClose: options.onClose,
        onConfirm: options.onConfirm,
        confirmText: options.confirmText ?? 'OK',
        cancelText: options.cancelText ?? 'Cancel',
        showCancelButton: options.showCancelButton ?? false,
        zIndex: options.zIndex
      },
      isVisible: true,
      zIndex
    }

    dialogs.value.push(dialog)
    return id
  }

  const hideDialog = (id: string): void => {
    const dialog = dialogs.value.find(d => d.id === id)
    if (dialog) {
      dialog.isVisible = false
      // Remove from array after animation completes
      setTimeout(() => {
        const index = dialogs.value.findIndex(d => d.id === id)
        if (index > -1) {
          dialogs.value.splice(index, 1)
        }
      }, 300) // Match transition duration
    }
  }

  const hideAllDialogs = (): void => {
    dialogs.value.forEach(dialog => {
      dialog.isVisible = false
    })
    setTimeout(() => {
      dialogs.value = []
    }, 300)
  }

  const showError = (message: string, options?: Partial<ErrorDialogOptions>): string => {
    return showDialog({
      message,
      severity: 'error',
      title: options?.title ?? 'Error',
      ...options
    })
  }

  const showWarning = (message: string, options?: Partial<ErrorDialogOptions>): string => {
    return showDialog({
      message,
      severity: 'warning',
      title: options?.title ?? 'Warning',
      ...options
    })
  }

  const showInfo = (message: string, options?: Partial<ErrorDialogOptions>): string => {
    return showDialog({
      message,
      severity: 'info',
      title: options?.title ?? 'Information',
      ...options
    })
  }

  return {
    state,
    visibleDialogs,
    showDialog,
    hideDialog,
    hideAllDialogs,
    showError,
    showWarning,
    showInfo
  }
})
