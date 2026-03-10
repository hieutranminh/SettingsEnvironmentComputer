import { ref, reactive, computed } from 'vue';
import type { DialogOptions, ErrorDialogOptions, DialogInstance, DialogStack, DialogManager } from '@/types/Dialog';

const dialogs = reactive<DialogStack>({});
const currentZIndex = ref(1000);

const generateId = (): string => {
  return `dialog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getNextZIndex = (parentId?: string): number => {
  if (parentId && dialogs[parentId]) {
    const parentZIndex = dialogs[parentId].zIndex;
    const childDialogs = getChildDialogs(parentId);
    const maxChildZIndex = childDialogs.length > 0
      ? Math.max(...childDialogs.map(d => d.zIndex))
      : parentZIndex;
    return maxChildZIndex + 10;
  }
  return currentZIndex.value += 10;
};

const addDialog = (options: DialogOptions, parentId?: string): string => {
  const id = generateId();
  const zIndex = getNextZIndex(parentId);

  const dialogInstance: DialogInstance = {
    id,
    options: {
      ...options,
      baseZIndex: zIndex,
      autoZIndex: false,
      modal: options.modal ?? true,
      closable: options.closable ?? true,
      dismissableMask: options.dismissableMask ?? false,
      closeOnEscape: options.closeOnEscape ?? true,
      showCloseIcon: options.showCloseIcon ?? true,
      position: options.position ?? 'center',
      width: options.width ?? '400px',
      severity: options.severity ?? 'info'
    },
    visible: true,
    zIndex,
    parentId,
    children: []
  };

  dialogs[id] = dialogInstance;

  // Add to parent's children list
  if (parentId && dialogs[parentId]) {
    dialogs[parentId].children.push(id);
  }

  return id;
};

const removeDialog = (id: string): void => {
  const dialog = dialogs[id];
  if (!dialog) return;

  // Remove from parent's children list
  if (dialog.parentId && dialogs[dialog.parentId]) {
    const parent = dialogs[dialog.parentId];
    parent.children = parent.children.filter(childId => childId !== id);
  }

  // Remove all child dialogs
  const childrenToRemove = [...dialog.children];
  childrenToRemove.forEach(childId => removeDialog(childId));

  delete dialogs[id];
};

const showDialog = (id: string): void => {
  const dialog = dialogs[id];
  if (dialog) {
    dialog.visible = true;
    dialog.options.onShow?.();
  }
};

const hideDialog = (id: string): void => {
  const dialog = dialogs[id];
  if (dialog) {
    dialog.visible = false;
    dialog.options.onHide?.();
  }
};

const clearAll = (): void => {
  Object.keys(dialogs).forEach(id => removeDialog(id));
};

const getDialog = (id: string): DialogInstance | undefined => {
  return dialogs[id];
};

const getChildDialogs = (parentId: string): DialogInstance[] => {
  const parent = dialogs[parentId];
  if (!parent) return [];

  return parent.children
    .map(childId => dialogs[childId])
    .filter(Boolean);
};

const getVisibleDialogs = computed(() => {
  return Object.values(dialogs).filter(dialog => dialog.visible);
});

const getDialogStack = computed(() => {
  return Object.values(dialogs).sort((a, b) => a.zIndex - b.zIndex);
});

// Convenience methods for common dialog types
const showInfoDialog = (message: string, options?: Partial<DialogOptions>): string => {
  return addDialog({
    message,
    severity: 'info',
    header: options?.header ?? 'Information',
    ...options
  });
};

const showSuccessDialog = (message: string, options?: Partial<DialogOptions>): string => {
  return addDialog({
    message,
    severity: 'success',
    header: options?.header ?? 'Success',
    ...options
  });
};

const showWarningDialog = (message: string, options?: Partial<DialogOptions>): string => {
  return addDialog({
    message,
    severity: 'warn',
    header: options?.header ?? 'Warning',
    ...options
  });
};

const showErrorDialog = (message: string, error?: Error, options?: Partial<ErrorDialogOptions>): string => {
  return addDialog({
    message,
    severity: 'error',
    header: options?.header ?? 'Error',
    error,
    stackTrace: error?.stack,
    showStackTrace: options?.showStackTrace ?? false,
    retryAction: options?.retryAction,
    retryLabel: options?.retryLabel ?? 'Retry',
    showRetryButton: options?.showRetryButton ?? false,
    ...options
  } as ErrorDialogOptions);
};

const showConfirmDialog = (
  message: string,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void | Promise<void>,
  options?: Partial<DialogOptions>
): string => {
  return addDialog({
    message,
    severity: 'warn',
    header: options?.header ?? 'Confirm',
    showConfirmButton: true,
    showCancelButton: true,
    confirmLabel: options?.confirmLabel ?? 'Confirm',
    cancelLabel: options?.cancelLabel ?? 'Cancel',
    onConfirm,
    onCancel,
    ...options
  });
};

const showNestedErrorDialog = (
  message: string,
  parentDialogId: string,
  error?: Error,
  options?: Partial<ErrorDialogOptions>
): string => {
  return addDialog({
    message,
    severity: 'error',
    header: options?.header ?? 'Error',
    error,
    stackTrace: error?.stack,
    showStackTrace: options?.showStackTrace ?? false,
    retryAction: options?.retryAction,
    retryLabel: options?.retryLabel ?? 'Retry',
    showRetryButton: options?.showRetryButton ?? false,
    width: options?.width ?? '500px',
    ...options
  } as ErrorDialogOptions, parentDialogId);
};

export const useGlobalDialog = (): DialogManager & {
  getVisibleDialogs: typeof getVisibleDialogs;
  getDialogStack: typeof getDialogStack;
  showInfoDialog: typeof showInfoDialog;
  showSuccessDialog: typeof showSuccessDialog;
  showWarningDialog: typeof showWarningDialog;
  showErrorDialog: typeof showErrorDialog;
  showConfirmDialog: typeof showConfirmDialog;
  showNestedErrorDialog: typeof showNestedErrorDialog;
} => {
  return {
    dialogs,
    currentZIndex: currentZIndex.value,
    addDialog,
    removeDialog,
    showDialog,
    hideDialog,
    clearAll,
    getDialog,
    getChildDialogs,
    getVisibleDialogs,
    getDialogStack,
    showInfoDialog,
    showSuccessDialog,
    showWarningDialog,
    showErrorDialog,
    showConfirmDialog,
    showNestedErrorDialog
  };
};
