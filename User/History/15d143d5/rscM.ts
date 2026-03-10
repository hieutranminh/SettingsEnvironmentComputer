import { useDialog } from 'primevue/usedialog'
import type { NotificationOptions, NotificationType } from '@/types/Notification'

const getDefaultIcon = (type: NotificationType): string => {
  switch (type) {
    case 'info':
      return 'pi pi-info-circle'
    case 'success':
      return 'pi pi-check-circle'
    case 'warning':
      return 'pi pi-exclamation-triangle'
    case 'error':
      return 'pi pi-times-circle'
    default:
      return 'pi pi-info-circle'
  }
}

const getDefaultTitle = (type: NotificationType): string => {
  switch (type) {
    case 'info':
      return 'Information'
    case 'success':
      return 'Success'
    case 'warning':
      return 'Warning'
    case 'error':
      return 'Error'
    default:
      return 'Notification'
  }
}

const getDefaultSeverity = (type: NotificationType): string => {
  switch (type) {
    case 'info':
      return 'info'
    case 'success':
      return 'success'
    case 'warning':
      return 'warn'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
}

const normalizeOptions = (
  options: NotificationOptions | string,
  type: NotificationType
): NotificationOptions => {
  if (typeof options === 'string') {
    return {
      message: options,
      title: getDefaultTitle(type),
      icon: getDefaultIcon(type),
      closable: true,
      showCloseIcon: true,
      closeOnEscape: true,
      dismissableMask: false,
      modal: true
    }
  }

  return {
    title: options.title || getDefaultTitle(type),
    message: options.message,
    icon: options.icon || getDefaultIcon(type),
    actions: options.actions,
    closable: options.closable ?? true,
    showCloseIcon: options.showCloseIcon ?? true,
    closeOnEscape: options.closeOnEscape ?? true,
    dismissableMask: options.dismissableMask ?? false,
    modal: options.modal ?? true,
    width: options.width,
    height: options.height,
    draggable: options.draggable,
    resizable: options.resizable
  }
}

export const useNotification = () => {
  const dialog = useDialog()

  const showNotification = (options: NotificationOptions | string, type: NotificationType) => {
    const normalizedOptions = normalizeOptions(options, type)
    const severity = getDefaultSeverity(type)

    dialog.open('NotificationDialog', {
      props: {
        header: normalizedOptions.title,
        modal: normalizedOptions.modal,
        closable: normalizedOptions.closable,
        closeOnEscape: normalizedOptions.closeOnEscape,
        dismissableMask: normalizedOptions.dismissableMask,
        draggable: normalizedOptions.draggable,
        style: {
          width: normalizedOptions.width || '30rem'
        }
      },
      data: {
        message: normalizedOptions.message,
        icon: normalizedOptions.icon,
        severity,
        actions: normalizedOptions.actions || []
      }
    })
  }

  const showInfo = (options: NotificationOptions | string) => {
    showNotification(options, 'info')
  }

  const showSuccess = (options: NotificationOptions | string) => {
    showNotification(options, 'success')
  }

  const showWarning = (options: NotificationOptions | string) => {
    showNotification(options, 'warning')
  }

  const showError = (options: NotificationOptions | string) => {
    showNotification(options, 'error')
  }

  const showCustom = (options: NotificationOptions) => {
    showNotification(options, 'info')
  }

  return {
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showCustom
  }
}
