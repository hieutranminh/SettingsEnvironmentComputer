// composables/useMessageDialog.ts
import { defineAsyncComponent, type Component } from 'vue'
import { useDialog } from 'primevue/usedialog'

// Enhanced configuration interfaces
interface DialogAction {
  label: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  onClick: () => void
  disabled?: boolean
}

interface DialogStyle {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

interface MessageConfig {
  type: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  title: string
  message: string | string[]
  onClose?: () => void
  style?: DialogStyle
  closable?: boolean
  modal?: boolean
  draggable?: boolean
  dismissableMask?: boolean
  closeOnEscape?: boolean
  autoZIndex?: boolean
  baseZIndex?: number
  breakpoints?: Record<string, string>
  component?: Component
  customProps?: Record<string, unknown>
  emits?: Record<string, (data?: unknown) => void>
}

interface ConfirmConfig {
  type: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  title: string
  message: string | string[]
  confirmLabel?: string
  cancelLabel?: string
  confirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  cancelSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  confirmDisabled?: boolean
  cancelDisabled?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  style?: DialogStyle
  closable?: boolean
  modal?: boolean
  draggable?: boolean
  dismissableMask?: boolean
  closeOnEscape?: boolean
  autoZIndex?: boolean
  baseZIndex?: number
  breakpoints?: Record<string, string>
  customProps?: Record<string, unknown>
}

// Global configuration interface
interface MessageDialogConfig {
  defaultStyle?: DialogStyle
  defaultBreakpoints?: Record<string, string>
  queueDelay?: number
  autoZIndex?: boolean
  baseZIndex?: number
}

// Default global configuration
const defaultConfig: MessageDialogConfig = {
  defaultStyle: {
    width: '450px',
    maxWidth: '90vw'
  },
  defaultBreakpoints: {
    '960px': '75vw',
    '641px': '90vw'
  },
  queueDelay: 300,
  autoZIndex: true,
  baseZIndex: 1000
}

// Queue to handle multiple dialogs
const dialogQueue: MessageConfig[] = []
let isProcessing = false
let globalConfig: MessageDialogConfig = { ...defaultConfig }

export const useMessageDialog = () => {
  const dialog = useDialog()

  // Configuration management
  const configure = (config: Partial<MessageDialogConfig>): void => {
    globalConfig = { ...globalConfig, ...config }
  }

  const getConfig = (): MessageDialogConfig => {
    return { ...globalConfig }
  }

  const processQueue = async (): Promise<void> => {
    if (isProcessing || dialogQueue.length === 0) return

    isProcessing = true
    const config = dialogQueue.shift()!

    await showSingleDialog(config)

    isProcessing = false

    // Process next dialog in queue
    if (dialogQueue.length > 0) {
      setTimeout(() => processQueue(), globalConfig.queueDelay)
    }
  }

  const mergeConfig = (config: MessageConfig): MessageConfig => {
    return {
      ...config,
      style: { ...globalConfig.defaultStyle, ...config.style },
      breakpoints: { ...globalConfig.defaultBreakpoints, ...config.breakpoints },
      modal: config.modal ?? true,
      closable: config.closable ?? true,
      draggable: config.draggable ?? false,
      dismissableMask: config.dismissableMask ?? false,
      closeOnEscape: config.closeOnEscape ?? true,
      autoZIndex: config.autoZIndex ?? globalConfig.autoZIndex,
      baseZIndex: config.baseZIndex ?? globalConfig.baseZIndex
    }
  }

  const showSingleDialog = (config: MessageConfig): Promise<void> => {
    return new Promise((resolve) => {
      const mergedConfig = mergeConfig(config)
      const messageDialogComponent = mergedConfig.component ||
        defineAsyncComponent(() => import('@/components/dialogs/MessageDialog.vue'))

      dialog.open(messageDialogComponent, {
        props: {
          header: mergedConfig.title,
          modal: mergedConfig.modal,
          closable: mergedConfig.closable,
          draggable: mergedConfig.draggable,
          dismissableMask: mergedConfig.dismissableMask,
          closeOnEscape: mergedConfig.closeOnEscape,
          autoZIndex: mergedConfig.autoZIndex,
          baseZIndex: mergedConfig.baseZIndex,
          style: mergedConfig.style,
          breakpoints: mergedConfig.breakpoints,
          ...mergedConfig.customProps
        },
        emits: mergedConfig.emits || {},
        data: {
          type: mergedConfig.type,
          message: mergedConfig.message,
        },
        onClose: () => {
          mergedConfig.onClose?.()
          resolve()
        }
      })
    })
  }

  // Enhanced show methods with optional configuration
  const showSuccess = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    dialogQueue.push({ type: 'success', title, message, ...options })
    processQueue()
  }

  const showInfo = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    dialogQueue.push({ type: 'info', title, message, ...options })
    processQueue()
  }

  const showWarning = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    dialogQueue.push({ type: 'warn', title, message, ...options })
    processQueue()
  }

  const showError = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    dialogQueue.push({ type: 'error', title, message, ...options })
    processQueue()
  }

  const showSecondary = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    dialogQueue.push({ type: 'secondary', title, message, ...options })
    processQueue()
  }

  const showContrast = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    dialogQueue.push({ type: 'contrast', title, message, ...options })
    processQueue()
  }

  const showConfirm = (
    title: string,
    message: string | string[],
    options?: Partial<Omit<ConfirmConfig, 'type' | 'title' | 'message'>>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const baseConfig = {
        type: 'info' as const,
        title,
        message,
        modal: options?.modal ?? true,
        closable: options?.closable ?? true,
        draggable: options?.draggable ?? false,
        dismissableMask: options?.dismissableMask ?? false,
        closeOnEscape: options?.closeOnEscape ?? true,
        autoZIndex: options?.autoZIndex ?? globalConfig.autoZIndex,
        baseZIndex: options?.baseZIndex ?? globalConfig.baseZIndex,
        style: { ...globalConfig.defaultStyle, ...options?.style },
        breakpoints: { ...globalConfig.defaultBreakpoints, ...options?.breakpoints },
        customProps: options?.customProps || {}
      }

      const confirmDialogComponent = defineAsyncComponent(() => import('@/components/dialogs/ConfirmDialog.vue'))

      dialog.open(confirmDialogComponent, {
        props: {
          header: baseConfig.title,
          modal: baseConfig.modal,
          closable: baseConfig.closable,
          draggable: baseConfig.draggable,
          dismissableMask: baseConfig.dismissableMask,
          closeOnEscape: baseConfig.closeOnEscape,
          autoZIndex: baseConfig.autoZIndex,
          baseZIndex: baseConfig.baseZIndex,
          style: baseConfig.style,
          breakpoints: baseConfig.breakpoints,
          ...baseConfig.customProps
        },
        data: {
          type: baseConfig.type,
          message: baseConfig.message,
          confirmLabel: options?.confirmLabel || 'Confirm',
          cancelLabel: options?.cancelLabel || 'Cancel',
          confirmSeverity: options?.confirmSeverity || 'primary',
          cancelSeverity: options?.cancelSeverity || 'secondary',
          confirmDisabled: options?.confirmDisabled || false,
          cancelDisabled: options?.cancelDisabled || false
        },
        onClose: () => {
          resolve(false) // Default to false when dialog is closed without explicit action
        },
        emits: {
          confirm: () => {
            options?.onConfirm?.()
            resolve(true)
          },
          cancel: () => {
            options?.onCancel?.()
            resolve(false)
          }
        }
      })
    })
  }

  // Display a dialog immediately, bypassing the queue
  const showImmediateDialog = (config: MessageConfig): Promise<void> => {
    return showSingleDialog(config)
  }

  const showErrors = (errors: Array<{ title: string; message: string }>): void => {
    errors.forEach(error => {
      showError(error.title, error.message)
    })
  }

  const clearQueue = (): void => {
    dialogQueue.length = 0
  }

  const getQueueLength = (): number => {
    return dialogQueue.length
  }

  const isQueueProcessing = (): boolean => {
    return isProcessing
  }

  return {
    // Configuration
    configure,
    getConfig,

    // Show methods
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showSecondary,
    showContrast,
    showConfirm,
    showErrors,
    showImmediateDialog,

    // Queue management
    clearQueue,
    getQueueLength,
    isQueueProcessing
  }
}

// Export types for external use
export type { MessageConfig, DialogAction, DialogStyle, MessageDialogConfig }
