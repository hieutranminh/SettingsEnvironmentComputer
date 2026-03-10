<!-- components/dialogs/ConfirmationDialog.vue -->
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
      :severity="cancelSeverity"
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
      cancelLabel: string;
      confirmLabel: string;
      cancelSeverity: string;
      confirmSeverity: string;
    };
    close: () => void;
  };
}

const dialogRef = inject<DialogRef>('dialogRef');
const type = ref<string>('');
const message = ref<string | string[]>('');
const cancelLabel = ref<string>('Cancel');
const confirmLabel = ref<string>('Confirm');
const cancelSeverity = ref<string>('secondary');
const confirmSeverity = ref<string>('primary');

const handleCancel = (): void => {
  if (dialogRef?.value?.close) {
    dialogRef.value.close();
  }
};

const handleConfirm = (): void => {
  if (dialogRef?.value?.close) {
    dialogRef.value.close();
  }
};

onMounted(() => {
  if (dialogRef?.value?.data) {
    const data = dialogRef.value.data;
    type.value = data.type;
    message.value = data.message;
    cancelLabel.value = data.cancelLabel || 'Cancel';
    confirmLabel.value = data.confirmLabel || 'Confirm';
    cancelSeverity.value = data.cancelSeverity || 'secondary';
    confirmSeverity.value = data.confirmSeverity || 'primary';
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
