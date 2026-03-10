<!-- components/dialogs/MessageDialog.vue -->
<template>
  <div class="dialog-content">
    <Message :severity="dialogType">
      <template v-if="hasStructuredErrors">
        <p
          v-for="(error, index) in structuredErrors"
          :key="index"
          class="message-item"
        >
          {{ error.errorMessage }}
        </p>
      </template>
      <template v-else-if="isArrayMessage">
        <p
          v-for="(item, index) in message"
          :key="index"
          class="message-item"
          v-html="item"
        />
      </template>
      <p v-else v-html="message"/>
    </Message>

    <ErrorDetailsSection
      v-if="hasStructuredErrors"
      :errors="structuredErrors"
      :is-expanded="showErrorDetails"
      @toggle="handleToggleErrorDetails"
    />
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
import { onMounted } from "vue";
import { useMessageDialog } from "@/composables/useMessageDialog";
import ErrorDetailsSection from "./ErrorDetailsSection.vue";

const {
  dialogType,
  message,
  showErrorDetails,
  isArrayMessage,
  hasStructuredErrors,
  structuredErrors,
  handleClose,
  handleToggleErrorDetails,
  initializeDialog,
} = useMessageDialog();

onMounted(() => {
  initializeDialog();
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
