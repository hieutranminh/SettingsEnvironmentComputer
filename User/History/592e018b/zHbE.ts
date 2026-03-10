// composables/useMessageDialog.ts
import { defineAsyncComponent, ref, readonly, type Component } from 'vue'
import { useDialog } from 'primevue/usedialog'

// Enhanced configuration interfaces with better type safety
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

// Discriminated union for better type safety
type MessageType = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

interface MessageConfig {
  type: MessageType
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

// Global configuration interface
interface MessageDialogConfig {
  defaultStyle?: DialogStyle
  defaultBreakpoints?: Record<string, string>
  queueDelay?: number
  autoZIndex?: boolean
  baseZIndex?: number
}

// Validation function for message types
const isValidMessageType = (type: string): type is MessageType => {
  return ['success', 'info', 'warn', 'error', 'secondary', 'contrast'].includes(type)
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

  // Reactive state for error handling and loading
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  // Configuration management
  const configure = (config: Partial<MessageDialogConfig>): void => {
    try {
      globalConfig = { ...globalConfig, ...config }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to configure message dialog'
    }
  }

  const getConfig = (): MessageDialogConfig => {
    return { ...globalConfig }
  }

  const processQueue = async (): Promise<void> => {
    if (isProcessing || dialogQueue.length === 0) return

    isProcessing = true
    isLoading.value = true
    const config = dialogQueue.shift()!

    try {
      await showSingleDialog(config)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to show dialog'
    } finally {
      isLoading.value = false
    }

    isProcessing = false

    // Process next dialog in queue
    if (dialogQueue.length > 0) {
      setTimeout(() => processQueue(), globalConfig.queueDelay)
    }
  }

  const mergeConfig = (config: MessageConfig): MessageConfig => {
    // Validate message type
    if (!isValidMessageType(config.type)) {
      throw new Error(`Invalid message type: ${config.type}. Must be one of: success, info, warn, error, secondary, contrast`)
    }

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
    showErrors,
    showImmediateDialog,

    // Queue management
    clearQueue,
    getQueueLength,
    isQueueProcessing,

    // State
    error: readonly(error),
    isLoading: readonly(isLoading)
  }
}

// Export types for external use
export type { MessageConfig, DialogAction, DialogStyle, MessageDialogConfig }
