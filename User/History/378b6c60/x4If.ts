import { ref, type Ref } from 'vue'
import type { DialogOptions, DialogAction } from '@/types/dialog'

interface DialogState {
  visible: boolean
  options: DialogOptions
  resolve: (value: DialogAction | null) => void
}

const dialogState: Ref<DialogState | null> = ref(null)

export const dialogService = {
  show(options: DialogOptions): Promise<DialogAction | null> {
    return new Promise((resolve) => {
      dialogState.value = {
        visible: true,
        options,
        resolve
      }
    })
  },

  close(result: DialogAction | null = null): void {
    if (dialogState.value) {
      dialogState.value.resolve(result)
      dialogState.value.visible = false
      dialogState.value = null
    }
  },

  getState(): Ref<DialogState | null> {
    return dialogState
  },

  showInfo(message: string, title?: string): Promise<DialogAction | null> {
    return this.show({
      title: title ?? 'Information',
      message,
      icon: 'pi pi-info-circle',
      actions: []
    })
  },

  showSuccess(message: string, title?: string): Promise<DialogAction | null> {
    return this.show({
      title: title ?? 'Success',
      message,
      icon: 'pi pi-check-circle',
      actions: []
    })
  },

  showWarning(message: string, title?: string): Promise<DialogAction | null> {
    return this.show({
      title: title ?? 'Warning',
      message,
      icon: 'pi pi-exclamation-triangle',
      actions: []
    })
  },

  showError(message: string, title?: string): Promise<DialogAction | null> {
    return this.show({
      title: title ?? 'Error',
      message,
      icon: 'pi pi-times-circle',
      actions: []
    })
  },

  showConfirm(
    message: string,
    title?: string
  ): Promise<DialogAction | null> {
    const actions: DialogAction[] = [
      {
        label: 'Cancel',
        severity: 'secondary'
      },
      {
        label: 'Confirm',
        severity: 'primary'
      }
    ]

    return this.show({
      title: title ?? 'Confirm',
      message,
      icon: 'pi pi-question-circle',
      actions,
      closable: false
    })
  }
}
