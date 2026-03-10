// composables/useMessageDialog.ts
import { inject, ref, computed } from "vue";

interface ErrorDetail {
  errorCode: string;
  errorMessage: string;
  errorValues: string[];
}

interface DialogRef {
  value: {
    data: {
      type: string;
      message: string | string[] | ErrorDetail[] | (string | ErrorDetail)[];
    };
    close: () => void;
  };
}

export const useMessageDialog = () => {
  const dialogRef = inject<DialogRef>('dialogRef');

  const dialogType = ref<string>('');
  const message = ref<string | string[] | ErrorDetail[] | (string | ErrorDetail)[]>('');
  const showErrorDetails = ref<boolean>(false);

  const isArrayMessage = computed((): boolean => {
    return Array.isArray(message.value) &&
           message.value.length > 0 &&
           typeof message.value[0] === 'string';
  });

  const hasStructuredErrors = computed((): boolean => {
    return Array.isArray(message.value) &&
           message.value.length > 0 &&
           message.value.some(isErrorDetail);
  });

  const structuredErrors = computed((): ErrorDetail[] => {
    if (!hasStructuredErrors.value || !Array.isArray(message.value)) {
      return [];
    }

    return message.value.filter(isErrorDetail) as ErrorDetail[];
  });

  const isErrorDetail = (item: unknown): item is ErrorDetail => {
    return typeof item === 'object' &&
           item !== null &&
           'errorCode' in item &&
           'errorMessage' in item;
  };

  const handleClose = (): void => {
    if (dialogRef?.value?.close) {
      dialogRef.value.close();
    }
  };

  const handleToggleErrorDetails = (): void => {
    showErrorDetails.value = !showErrorDetails.value;
  };

  const initializeDialog = (): void => {
    if (dialogRef?.value?.data?.message) {
      dialogType.value = dialogRef.value.data.type;
      message.value = dialogRef.value.data.message;
    }
  };

  return {
    dialogType,
    message,
    showErrorDetails,
    isArrayMessage,
    hasStructuredErrors,
    structuredErrors,
    handleClose,
    handleToggleErrorDetails,
    initializeDialog,
  };
};
