// composables/useMessageDialog.ts
import { useDialog } from 'primevue/usedialog'
import { defineAsyncComponent, type Component } from 'vue'

import { useTranslation } from '@/composables/useTranslation'

// Constants for magic numbers
const DEFAULT_QUEUE_DELAY_MS = 300
const DEFAULT_BASE_Z_INDEX = 1000
const DEFAULT_DIALOG_WIDTH = '450px'
const DEFAULT_MAX_WIDTH = '90vw'
const TABLET_BREAKPOINT = '960px'
const TABLET_WIDTH = '75vw'
const MOBILE_BREAKPOINT = '641px'
const MOBILE_WIDTH = '90vw'

// Enhanced configuration interfaces
interface IDialogAction {
  label: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'error' | 'contrast'
  onClick: () => void
  disabled?: boolean
}

interface IDialogStyle {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

interface IErrorDetail {
  errorCode: string
  errorMessage: string
  errorValues: string[]
}

interface IMessageConfig {
  type: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  title: string
  message: string | string[] | IErrorDetail[]
  onClose?: () => void
  style?: IDialogStyle
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
}

// Global configuration interface
interface IMessageDialogConfig {
  defaultStyle?: IDialogStyle
  defaultBreakpoints?: Record<string, string>
  queueDelay?: number
  autoZIndex?: boolean
  baseZIndex?: number
}

// Default global configuration
const defaultConfig: IMessageDialogConfig = {
  defaultStyle: {
    width: DEFAULT_DIALOG_WIDTH,
    maxWidth: DEFAULT_MAX_WIDTH,
  },
  defaultBreakpoints: {
    [TABLET_BREAKPOINT]: TABLET_WIDTH,
    [MOBILE_BREAKPOINT]: MOBILE_WIDTH,
  },
  queueDelay: DEFAULT_QUEUE_DELAY_MS,
  autoZIndex: true,
  baseZIndex: DEFAULT_BASE_Z_INDEX,
}

// Queue to handle multiple dialogs
const dialogQueue: IMessageConfig[] = []
let isProcessing = false
let globalConfig: IMessageDialogConfig = { ...defaultConfig }

export const useMessageDialog = () => {
  const dialog = useDialog()
  const { t } = useTranslation()

  // Configuration management
  const configure = (config: Partial<IMessageDialogConfig>): void => {
    globalConfig = { ...globalConfig, ...config }
  }

  const getConfig = (): IMessageDialogConfig => {
    return { ...globalConfig }
  }

  const processQueue = async (): Promise<void> => {
    if (isProcessing || dialogQueue.length === 0) return

    isProcessing = true
    const config = dialogQueue.shift()
    
    if (config) {
      await showSingleDialog(config)
    }

    isProcessing = false

    // Process next dialog in queue
    if (dialogQueue.length > 0) {
      setTimeout(() => processQueue(), globalConfig.queueDelay)
    }
  }

  const mergeConfig = (config: IMessageConfig): IMessageConfig => {
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
      baseZIndex: config.baseZIndex ?? globalConfig.baseZIndex,
    }
  }

  const showSingleDialog = (config: IMessageConfig): Promise<void> => {
    return new Promise((resolve) => {
      const mergedConfig = mergeConfig(config)
      const messageDialogComponent =
        mergedConfig.component ??
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
          ...mergedConfig.customProps,
        },
        data: {
          type: mergedConfig.type,
          message: mergedConfig.message,
        },
        onClose: () => {
          mergedConfig.onClose?.()
          resolve()
        },
      })
    })
  }

  // Enhanced show methods with optional configuration
  const showSuccess = (
    title: string,
    message: string | string[] | IErrorDetail[],
    options?: Partial<Omit<IMessageConfig, 'type' | 'title' | 'message'>>,
  ): void => {
    dialogQueue.push({ type: 'success', title, message, ...options })
    processQueue()
  }

  const showInfo = (
    title: string,
    message: string | string[] | IErrorDetail[],
    options?: Partial<Omit<IMessageConfig, 'type' | 'title' | 'message'>>,
  ): void => {
    dialogQueue.push({ type: 'info', title, message, ...options })
    processQueue()
  }

  const showWarning = (
    title: string,
    message: string | string[] | IErrorDetail[],
    options?: Partial<Omit<IMessageConfig, 'type' | 'title' | 'message'>>,
  ): void => {
    dialogQueue.push({ type: 'warn', title, message, ...options })
    processQueue()
  }

  const showError = (
    message?: string | string[] | IErrorDetail[],
    options?: Partial<Omit<IMessageConfig, 'type' | 'title' | 'message'>>,
  ): void => {
    dialogQueue.push({
      type: 'error',
      title: t('general.alert'),
      message: message ?? '',
      ...options,
    })
    processQueue()
  }

  const showSecondary = (
    title: string,
    message: string | string[] | IErrorDetail[],
    options?: Partial<Omit<IMessageConfig, 'type' | 'title' | 'message'>>,
  ): void => {
    dialogQueue.push({ type: 'secondary', title, message, ...options })
    processQueue()
  }

  const showContrast = (
    title: string,
    message: string | string[] | IErrorDetail[],
    options?: Partial<Omit<IMessageConfig, 'type' | 'title' | 'message'>>,
  ): void => {
    dialogQueue.push({ type: 'contrast', title, message, ...options })
    processQueue()
  }

  const showErrors = (errors: string[]): void => {
    console.log('errors', errors)
    errors.forEach((error) => {
      showError(t('general.alert'), error)
    })
  }

  // Display a dialog immediately, bypassing the queue
  const showImmediateDialog = (config: MessageConfig): Promise<void> => {
    return showSingleDialog(config)
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
  }
}

// Export types for external use
export type { MessageConfig, DialogAction, DialogStyle, MessageDialogConfig, ErrorDetail }
