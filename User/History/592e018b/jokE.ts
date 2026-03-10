// composables/useMessageDialog.ts
import { defineAsyncComponent, type Component } from 'vue'
import { useDialog } from 'primevue/usedialog'

// Enhanced configuration interfaces
interface DialogAction {
  label: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  onClick: () => void
  disabled?: boolean
  icon?: string
  key?: string // For keyboard shortcuts
}

interface DialogStyle {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

interface DialogAnimation {
  enter?: string
  leave?: string
  duration?: number
}

interface DialogAccessibility {
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string
  tabIndex?: number
}

interface MessageConfig {
  type: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  title: string
  message: string | string[]
  onClose?: () => void
  actions?: DialogAction[]
  style?: DialogStyle
  animation?: DialogAnimation
  accessibility?: DialogAccessibility
  closable?: boolean
  modal?: boolean
  draggable?: boolean
  resizable?: boolean
  dismissableMask?: boolean
  closeOnEscape?: boolean
  autoZIndex?: boolean
  baseZIndex?: number
  breakpoints?: Record<string, string>
  component?: Component
  customProps?: Record<string, unknown>
  emits?: Record<string, (data?: unknown) => void>
  // New properties for enhanced functionality
  confirmable?: boolean
  confirmText?: string
  cancelText?: string
  persistent?: boolean // Prevents closing on backdrop click
  focusTrap?: boolean // Traps focus within dialog
}

// Confirmation dialog specific interface
interface ConfirmConfig extends Omit<MessageConfig, 'type' | 'confirmable'> {
  onConfirm: () => void
  onCancel?: () => void
  confirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  cancelSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
}

// Global configuration interface
interface MessageDialogConfig {
  defaultStyle?: DialogStyle
  defaultBreakpoints?: Record<string, string>
  defaultAnimation?: DialogAnimation
  defaultAccessibility?: DialogAccessibility
  queueDelay?: number
  autoZIndex?: boolean
  baseZIndex?: number
  // New global configuration options
  defaultConfirmText?: string
  defaultCancelText?: string
  defaultConfirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  defaultCancelSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  enableKeyboardShortcuts?: boolean
  enableFocusTrap?: boolean
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
  defaultAnimation: {
    enter: 'fadeIn',
    leave: 'fadeOut',
    duration: 300
  },
  defaultAccessibility: {
    role: 'dialog',
    tabIndex: 0
  },
  queueDelay: 300,
  autoZIndex: true,
  baseZIndex: 1000,
  defaultConfirmText: 'Confirm',
  defaultCancelText: 'Cancel',
  defaultConfirmSeverity: 'primary',
  defaultCancelSeverity: 'secondary',
  enableKeyboardShortcuts: true,
  enableFocusTrap: true
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
      animation: { ...globalConfig.defaultAnimation, ...config.animation },
      accessibility: { ...globalConfig.defaultAccessibility, ...config.accessibility },
      modal: config.modal ?? true,
      closable: config.closable ?? true,
      draggable: config.draggable ?? false,
      resizable: config.resizable ?? false,
      dismissableMask: config.dismissableMask ?? false,
      closeOnEscape: config.closeOnEscape ?? true,
      autoZIndex: config.autoZIndex ?? globalConfig.autoZIndex,
      baseZIndex: config.baseZIndex ?? globalConfig.baseZIndex,
      focusTrap: config.focusTrap ?? globalConfig.enableFocusTrap,
      persistent: config.persistent ?? false
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
          actions: mergedConfig.actions,
          animation: mergedConfig.animation,
          accessibility: mergedConfig.accessibility,
          confirmable: mergedConfig.confirmable,
          confirmText: mergedConfig.confirmText,
          cancelText: mergedConfig.cancelText,
          persistent: mergedConfig.persistent,
          focusTrap: mergedConfig.focusTrap
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

  // New confirmation dialog methods
  const showConfirm = (
    title: string,
    message: string | string[],
    onConfirm: () => void,
    onCancel?: () => void,
    options?: Partial<Omit<ConfirmConfig, 'type' | 'title' | 'message' | 'onConfirm' | 'onCancel'>>
  ): void => {
    const confirmText = options?.confirmText || globalConfig.defaultConfirmText
    const cancelText = options?.cancelText || globalConfig.defaultCancelText
    const confirmSeverity = options?.confirmSeverity || globalConfig.defaultConfirmSeverity
    const cancelSeverity = options?.cancelSeverity || globalConfig.defaultCancelSeverity

    const actions: DialogAction[] = [
      {
        label: confirmText,
        severity: confirmSeverity,
        onClick: () => {
          onConfirm()
          dialog.close()
        },
        key: 'Enter'
      },
      {
        label: cancelText,
        severity: cancelSeverity,
        onClick: () => {
          onCancel?.()
          dialog.close()
        },
        key: 'Escape'
      }
    ]

    dialogQueue.push({
      type: 'info',
      title,
      message,
      actions,
      confirmable: true,
      onClose: onCancel,
      ...options
    })
    processQueue()
  }

  const showConfirmNow = (
    title: string,
    message: string | string[],
    onConfirm: () => void,
    onCancel?: () => void,
    options?: Partial<Omit<ConfirmConfig, 'type' | 'title' | 'message' | 'onConfirm' | 'onCancel'>>
  ): Promise<void> => {
    return new Promise((resolve) => {
      const confirmText = options?.confirmText || globalConfig.defaultConfirmText
      const cancelText = options?.cancelText || globalConfig.defaultCancelText
      const confirmSeverity = options?.confirmSeverity || globalConfig.defaultConfirmSeverity
      const cancelSeverity = options?.cancelSeverity || globalConfig.defaultCancelSeverity

      const actions: DialogAction[] = [
        {
          label: confirmText,
          severity: confirmSeverity,
          onClick: () => {
            onConfirm()
            dialog.close()
            resolve()
          },
          key: 'Enter'
        },
        {
          label: cancelText,
          severity: cancelSeverity,
          onClick: () => {
            onCancel?.()
            dialog.close()
            resolve()
          },
          key: 'Escape'
        }
      ]

      showSingleDialog({
        type: 'info',
        title,
        message,
        actions,
        confirmable: true,
        onClose: () => {
          onCancel?.()
          resolve()
        },
        ...options
      })
    })
  }

  // Generic show method for maximum flexibility
  const show = (config: MessageConfig): void => {
    dialogQueue.push(config)
    processQueue()
  }

  // Show dialog immediately without queuing
  const showNow = (config: MessageConfig): Promise<void> => {
    return showSingleDialog(config)
  }

  const showErrors = (errors: Array<{ title: string; message: string }>): void => {
    errors.forEach(error => {
      showError(error.title, error.message)
    })
  }

  // Enhanced queue management
  const clearQueue = (): void => {
    dialogQueue.length = 0
  }

  const getQueueLength = (): number => {
    return dialogQueue.length
  }

  const isQueueProcessing = (): boolean => {
    return isProcessing
  }

  // New utility methods
  const showLoading = (
    title: string,
    message: string = 'Please wait...',
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): (() => void) => {
    const loadingConfig: MessageConfig = {
      type: 'info',
      title,
      message,
      closable: false,
      dismissableMask: false,
      closeOnEscape: false,
      persistent: true,
      ...options
    }

    showSingleDialog(loadingConfig)

    // Return a function to close the loading dialog
    return () => {
      dialog.close()
    }
  }

  const showInput = (
    title: string,
    message: string,
    defaultValue: string = '',
    onConfirm: (value: string) => void,
    onCancel?: () => void,
    options?: Partial<Omit<MessageConfig, 'type' | 'title' | 'message'>>
  ): void => {
    // This would require a custom input dialog component
    // For now, we'll use a basic confirmation approach
    showConfirm(
      title,
      `${message}\n\nDefault value: ${defaultValue}`,
      () => onConfirm(defaultValue),
      onCancel,
      options
    )
  }

  return {
    // Configuration
    configure,
    getConfig,

    // Show methods
    show,
    showNow,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showSecondary,
    showContrast,
    showErrors,

    // New confirmation methods
    showConfirm,
    showConfirmNow,

    // New utility methods
    showLoading,
    showInput,

    // Queue management
    clearQueue,
    getQueueLength,
    isQueueProcessing
  }
}

// Export types for external use
export type {
  MessageConfig,
  DialogAction,
  DialogStyle,
  DialogAnimation,
  DialogAccessibility,
  ConfirmConfig,
  MessageDialogConfig
}
