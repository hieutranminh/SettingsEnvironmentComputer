import { ref } from 'vue'
import { useDialog } from 'primevue/usedialog'

export interface DialogOptions {
  header?: string
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  acceptClass?: string
  rejectClass?: string
  acceptIcon?: string
  rejectIcon?: string
  closable?: boolean
  draggable?: boolean
  resizable?: boolean
  modal?: boolean
  position?: string
  maximizable?: boolean
  breakpoints?: Record<string, string>
  style?: Record<string, string>
  class?: string
  contentStyle?: Record<string, string>
  contentClass?: string
  maskStyle?: Record<string, string>
  maskClass?: string
  showHeader?: boolean
  baseZIndex?: number
  autoZIndex?: boolean
  dismissableMask?: boolean
  closeOnEscape?: boolean
  appendTo?: string
  pt?: Record<string, unknown>
  unstyled?: boolean
}

export interface DialogInstance {
  id: string
  options: DialogOptions
  resolve: (value: boolean) => void
  reject: (reason?: unknown) => void
}

const dialogService = useDialog()
const activeDialogs = ref<DialogInstance[]>([])

export const useGlobalDialog = () => {
  const showDialog = (options: DialogOptions = {}): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const dialogId = `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const dialogInstance: DialogInstance = {
        id: dialogId,
        options: {
          header: 'Confirm',
          message: 'Are you sure?',
          acceptLabel: 'Yes',
          rejectLabel: 'No',
          acceptClass: 'p-button-primary',
          rejectClass: 'p-button-secondary',
          closable: true,
          modal: true,
          closeOnEscape: true,
          dismissableMask: true,
          ...options
        },
        resolve,
        reject
      }

      activeDialogs.value.push(dialogInstance)

      dialogService.open(dialogInstance.options, {
        onAccept: () => {
          const index = activeDialogs.value.findIndex(d => d.id === dialogId)
          if (index > -1) {
            activeDialogs.value.splice(index, 1)
          }
          resolve(true)
        },
        onReject: () => {
          const index = activeDialogs.value.findIndex(d => d.id === dialogId)
          if (index > -1) {
            activeDialogs.value.splice(index, 1)
          }
          resolve(false)
        },
        onClose: () => {
          const index = activeDialogs.value.findIndex(d => d.id === dialogId)
          if (index > -1) {
            activeDialogs.value.splice(index, 1)
          }
          resolve(false)
        }
      })
    })
  }

  const showConfirm = (message: string, header?: string): Promise<boolean> => {
    return showDialog({
      header: header || 'Confirm',
      message,
      acceptLabel: 'Yes',
      rejectLabel: 'No'
    })
  }

  const showAlert = (message: string, header?: string): Promise<boolean> => {
    return showDialog({
      header: header || 'Information',
      message,
      acceptLabel: 'OK',
      rejectLabel: '',
      showHeader: true
    })
  }

  const showError = (message: string, header?: string): Promise<boolean> => {
    return showDialog({
      header: header || 'Error',
      message,
      acceptLabel: 'OK',
      rejectLabel: '',
      acceptClass: 'p-button-danger',
      showHeader: true
    })
  }

  const showSuccess = (message: string, header?: string): Promise<boolean> => {
    return showDialog({
      header: header || 'Success',
      message,
      acceptLabel: 'OK',
      rejectLabel: '',
      acceptClass: 'p-button-success',
      showHeader: true
    })
  }

  const closeAllDialogs = (): void => {
    activeDialogs.value.forEach(dialog => {
      dialog.resolve(false)
    })
    activeDialogs.value = []
  }

  return {
    showDialog,
    showConfirm,
    showAlert,
    showError,
    showSuccess,
    closeAllDialogs,
    activeDialogs: activeDialogs.value
  }
}
