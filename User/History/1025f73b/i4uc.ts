export interface NotificationAction {
  label: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger'
  onClick?: () => void
  disabled?: boolean
}

export interface NotificationOptions {
  title?: string
  message: string
  icon?: string
  actions?: NotificationAction[]
  closable?: boolean
  width?: string
  height?: string
  modal?: boolean
  draggable?: boolean
  resizable?: boolean
  closeOnEscape?: boolean
  dismissableMask?: boolean
  showCloseIcon?: boolean
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationService {
  showInfo: (options: NotificationOptions | string) => void
  showSuccess: (options: NotificationOptions | string) => void
  showWarning: (options: NotificationOptions | string) => void
  showError: (options: NotificationOptions | string) => void
  showCustom: (options: NotificationOptions) => void
}
