export interface DialogOptions {
  header?: string;
  message: string;
  severity?: 'info' | 'success' | 'warn' | 'error';
  closable?: boolean;
  dismissableMask?: boolean;
  width?: string;
  height?: string;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  modal?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closeOnEscape?: boolean;
  showCloseIcon?: boolean;
  baseZIndex?: number;
  autoZIndex?: boolean;
  keepInViewport?: boolean;
  minX?: number;
  minY?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

export interface ErrorDialogOptions extends DialogOptions {
  error?: Error;
  stackTrace?: string;
  showStackTrace?: boolean;
  retryAction?: () => void | Promise<void>;
  retryLabel?: string;
  showRetryButton?: boolean;
}

export interface DialogInstance {
  id: string;
  options: DialogOptions;
  visible: boolean;
  zIndex: number;
  parentId?: string;
  children: string[];
}

export interface DialogStack {
  [key: string]: DialogInstance;
}

export interface DialogManager {
  dialogs: DialogStack;
  currentZIndex: number;
  addDialog: (options: DialogOptions, parentId?: string) => string;
  removeDialog: (id: string) => void;
  showDialog: (id: string) => void;
  hideDialog: (id: string) => void;
  clearAll: () => void;
  getDialog: (id: string) => DialogInstance | undefined;
  getChildDialogs: (parentId: string) => DialogInstance[];
}
