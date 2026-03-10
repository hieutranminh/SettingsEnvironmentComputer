export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

export interface DialogAction {
  label: string
  action: () => void | Promise<void>
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
  outlined?: boolean
  disabled?: boolean
}

export interface DialogOptions {
  title?: string
  message: string
  type?: DialogType
  icon?: string
  actions?: DialogAction[]
  closable?: boolean
  width?: string
  height?: string
  draggable?: boolean
  resizable?: boolean
  modal?: boolean
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export interface DialogInstance {
  close: () => void
  update: (options: Partial<DialogOptions>) => void
}
