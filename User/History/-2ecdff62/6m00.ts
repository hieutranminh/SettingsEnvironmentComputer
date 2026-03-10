export interface DialogAction {
  label: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
  onClick?: () => void | Promise<void>
  disabled?: boolean
}

export interface DialogConfig {
  title?: string
  message: string
  icon?: string
  severity?: 'success' | 'info' | 'warn' | 'error'
  actions?: DialogAction[]
  closable?: boolean
  width?: string
  height?: string
  modal?: boolean
  draggable?: boolean
  resizable?: boolean
  closeOnEscape?: boolean
  dismissableMask?: boolean
}

export interface DialogService {
  showError: (message: string, title?: string, actions?: DialogAction[]) => void
  showInfo: (message: string, title?: string, actions?: DialogAction[]) => void
  showWarning: (message: string, title?: string, actions?: DialogAction[]) => void
  showSuccess: (message: string, title?: string, actions?: DialogAction[]) => void
  showConfirm: (message: string, title?: string, onConfirm?: () => void, onCancel?: () => void) => void
  showCustom: (config: DialogConfig) => void
  close: () => void
}
