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
      :severity="cancelSeverity"
      @click="handleCancel"
      :disabled="cancelDisabled"
    />
    <Button
      :label="confirmLabel"
      :severity="confirmSeverity"
      @click="handleConfirm"
      :disabled="confirmDisabled"
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
      cancelSeverity: string;
      confirmDisabled: boolean;
      cancelDisabled: boolean;
    };
    close: () => void;
  };
}

const dialogRef = inject<DialogRef>('dialogRef');
const type = ref<string>('');
const message = ref<string | string[]>('');
const confirmLabel = ref<string>('Confirm');
const cancelLabel = ref<string>('Cancel');
const confirmSeverity = ref<string>('primary');
const cancelSeverity = ref<string>('secondary');
const confirmDisabled = ref<boolean>(false);
const cancelDisabled = ref<boolean>(false);

const handleConfirm = (): void => {
  if (dialogRef?.value?.close) {
    dialogRef.value.close();
  }
};

const handleCancel = (): void => {
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
    cancelSeverity.value = data.cancelSeverity;
    confirmDisabled.value = data.confirmDisabled;
    cancelDisabled.value = data.cancelDisabled;
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
