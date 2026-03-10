export interface ErrorDialogOptions {
  title?: string
  message: string
  details?: string
  severity?: 'error' | 'warning' | 'info'
  showDetails?: boolean
  closable?: boolean
  onClose?: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  showCancelButton?: boolean
  zIndex?: number
}

export interface ErrorDialogInstance {
  id: string
  options: ErrorDialogOptions
  isVisible: boolean
  zIndex: number
}

export interface ErrorDialogState {
  dialogs: ErrorDialogInstance[]
  nextZIndex: number
}
