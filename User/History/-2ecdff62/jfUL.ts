export interface DialogAction {
  label: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
  onClick?: () => void | Promise<void>
  disabled?: boolean
}

export interface DialogOptions {
  title?: string
  message: string
  icon?: string
  actions?: DialogAction[]
  closable?: boolean
  width?: string
  height?: string
  modal?: boolean
  draggable?: boolean
  resizable?: boolean
  maximizable?: boolean
  minimizable?: boolean
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export interface DialogInstance {
  close: () => void
  update: (options: Partial<DialogOptions>) => void
}

export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

export interface DialogService {
  show: (options: DialogOptions) => DialogInstance
  showInfo: (message: string, title?: string) => DialogInstance
  showSuccess: (message: string, title?: string) => DialogInstance
  showWarning: (message: string, title?: string) => DialogInstance
  showError: (message: string, title?: string) => DialogInstance
  showConfirm: (message: string, title?: string, onConfirm?: () => void, onCancel?: () => void) => DialogInstance
}
