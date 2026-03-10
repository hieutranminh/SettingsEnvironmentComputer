<!-- components/dialogs/ConfirmDialog.vue -->
<template>
  <div class="dialog-content">
    <Message :severity="type">
      <template v-if="Array.isArray(message)">
        <p
          v-for="(item, index) in message"
          :key="index"
          class="message-item"
          v-html="item"
        />
      </template>
      <p v-else v-html="message"/>
    </Message>
  </div>

  <div class="dialog-actions">
    <Button
      :label="cancelLabel"
      severity="secondary"
      @click="handleCancel"
    />
    <Button
      :label="confirmLabel"
      :severity="confirmSeverity"
      @click="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";

interface DialogRef {
  value: {
    data: {
      type: string;
      message: string | string[];
      confirmLabel: string;
      cancelLabel: string;
      confirmSeverity: string;
      onConfirm: () => void;
      onCancel: () => void;
    };
    close: () => void;
  };
}

const dialogRef = inject<DialogRef>('dialogRef');
const type = ref<string>('');
const message = ref<string | string[]>('');
const confirmLabel = ref<string>('Confirm');
const cancelLabel = ref<string>('Cancel');
const confirmSeverity = ref<string>('danger');

const handleConfirm = (): void => {
  // Call the onConfirm callback and close the dialog
  if (dialogRef?.value?.data?.onConfirm) {
    dialogRef.value.data.onConfirm();
  }
  if (dialogRef?.value?.close) {
    dialogRef.value.close();
  }
};

const handleCancel = (): void => {
  // Call the onCancel callback and close the dialog
  if (dialogRef?.value?.data?.onCancel) {
    dialogRef.value.data.onCancel();
  }
  if (dialogRef?.value?.close) {
    dialogRef.value.close();
  }
};

onMounted(() => {
  if (dialogRef?.value?.data) {
    const data = dialogRef.value.data;
    type.value = data.type;
    message.value = data.message;
    confirmLabel.value = data.confirmLabel;
    cancelLabel.value = data.cancelLabel;
    confirmSeverity.value = data.confirmSeverity;
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
</style>
