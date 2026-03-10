<!-- components/dialogs/MessageDialog.vue -->
<template>
  <div class="dialog-content">
    <Message :severity="type">
      <template v-if="isStructuredError">
        <p
          v-for="(error, index) in structuredErrors"
          :key="index"
          class="message-item"
        >
          {{ error.errorMessage }}
        </p>
      </template>
      <template v-else-if="Array.isArray(message)">
        <p
          v-for="(item, index) in message"
          :key="index"
          class="message-item"
          v-html="item"
        />
      </template>
      <p v-else v-html="message"/>
    </Message>

    <!-- Error Details Section -->
    <div v-if="isStructuredError" class="error-details-section">
      <Button
        :label="showErrorDetails ? 'Hide Error Details' : 'Show Error Details'"
        severity="secondary"
        text
        @click="handleToggleErrorDetails"
        class="error-details-toggle"
      />

      <div v-if="showErrorDetails" class="error-details-content">
        <div
          v-for="(error, index) in structuredErrors"
          :key="index"
          class="error-detail-item"
        >
          <div class="error-code">
            <strong>Error Code:</strong> {{ error.errorCode }}
          </div>
          <div class="error-message">
            <strong>Error Message:</strong> {{ error.errorMessage }}
          </div>
          <div v-if="error.errorValues && error.errorValues.length > 0" class="error-values">
            <strong>Error Values:</strong>
            <ul>
              <li v-for="(value, valueIndex) in error.errorValues" :key="valueIndex">
                {{ value }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="dialog-actions">
    <Button
      label="Close"
      severity="info"
      @click="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, computed } from "vue";

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

const dialogRef = inject<DialogRef>('dialogRef');
const type = ref<string>('');
const message = ref<string | string[] | ErrorDetail[] | (string | ErrorDetail)[]>('');
const showErrorDetails = ref<boolean>(false);

const isStructuredError = computed((): boolean => {
  return Array.isArray(message.value) &&
         message.value.length > 0 &&
         message.value.some(item =>
           typeof item === 'object' &&
           item !== null &&
           'errorCode' in item &&
           'errorMessage' in item
         );
});

const structuredErrors = computed((): ErrorDetail[] => {
  if (isStructuredError.value && Array.isArray(message.value)) {
    return message.value.filter((item) =>
      typeof item === 'object' &&
      item !== null &&
      'errorCode' in item &&
      'errorMessage' in item
    ) as ErrorDetail[];
  }
  return [];
});

const handleClose = (): void => {
  if (dialogRef?.value?.close) {
    dialogRef.value.close();
  }
};

const handleToggleErrorDetails = (): void => {
  showErrorDetails.value = !showErrorDetails.value;
};

onMounted(() => {
  if (dialogRef?.value?.data?.message) {
    type.value = dialogRef.value.data.type;
    message.value = dialogRef.value.data.message;
  }
});
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 1rem 0;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 1rem;
}

.error-details-section {
  margin-top: 1rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.error-details-toggle {
  margin-bottom: 0.5rem;
}

.error-details-content {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 0.5rem;
}

.error-detail-item {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.error-code {
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-family: monospace;
}

.error-message {
  margin-bottom: 0.5rem;
  color: #495057;
}

.error-values {
  margin-top: 0.5rem;

  ul {
    margin: 0.25rem 0 0 1rem;
    padding: 0;
  }

  li {
    margin-bottom: 0.25rem;
    color: #6c757d;
  }
}
</style>
