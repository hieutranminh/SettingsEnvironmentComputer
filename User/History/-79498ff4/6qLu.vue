<template>
  <div class="print-preview">
    <!-- Print Content Reference -->
    <div
      v-if="printContentRef"
      :ref="printContentRef"
      class="print-content-reference"
    >
      <slot name="print-content" />
    </div>

    <!-- Print Preview Modal -->
    <PrintPreviewModal
      :report-name="reportName"
      @hide="handleModalHide"
      @retry="handleRetry"
      @download="handleDownload"
      @print="handlePrint"
    />

    <!-- Success/Error Messages -->
    <div
      v-if="successMessage"
      class="message success"
    >
      <i class="pi pi-check-circle"></i>
      <span>{{ successMessage }}</span>
      <Button
        icon="pi pi-times"
        variant="ghost"
        size="sm"
        @click="clearSuccess"
      />
    </div>

    <div
      v-if="errorMessage"
      class="message error"
    >
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ errorMessage }}</span>
      <Button
        icon="pi pi-times"
        variant="ghost"
        size="sm"
        @click="clearError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import PrintPreviewModal from './PrintPreviewModal.vue'
import { usePrintPreview } from '../composables/usePrintPreview'
import type { WorkerType, TableHeader, ReportHeader } from '../types/print-preview.types'

interface Props {
  workerType: WorkerType
  tableHeaders: TableHeader[]
  reportHeaders: ReportHeader[]
  requestPayload?: Record<string, any>
  additionalOptions?: Record<string, any>
  reportName?: string
  autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requestPayload: () => ({}),
  additionalOptions: () => ({}),
  reportName: 'Report',
  autoStart: false,
})

const emit = defineEmits<{
  start: []
  success: []
  error: [error: string]
  download: [type: 'pdf' | 'excel']
  print: []
  modalHide: []
}>()

const {
  printContentRef,
  isModalVisible,
  isWorkerProcessing,
  hasError,
  isReady,
  progressPercentage,
  errorMessage,
  successMessage,
  startPrintPreview,
  showPrintPreviewModal,
  hidePrintPreviewModal,
  clearMessages,
  clearError,
  clearSuccess,
} = usePrintPreview()

// Auto-start print preview if enabled
onMounted(() => {
  if (props.autoStart) {
    handleStartPrint()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  clearMessages()
})

const handleStartPrint = async (): Promise<void> => {
  emit('start')

  try {
    await startPrintPreview(
      props.workerType,
      props.tableHeaders,
      props.reportHeaders,
      props.requestPayload,
      props.additionalOptions,
    )

    showPrintPreviewModal()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    emit('error', errorMessage)
  }
}

const handleModalHide = (): void => {
  emit('modalHide')
}

const handleRetry = (): void => {
  handleStartPrint()
}

const handleDownload = (type: 'pdf' | 'excel'): void => {
  emit('download', type)
}

const handlePrint = (): void => {
  emit('print')
}

// Expose methods for parent components
defineExpose({
  startPrint: handleStartPrint,
  showModal: showPrintPreviewModal,
  hideModal: hidePrintPreviewModal,
  clearMessages,
  clearError,
  clearSuccess,
})
</script>

<style scoped lang="scss">
.print-preview {
  position: relative;
}

.print-content-reference {
  // This div is used as a reference for determining print content width
  // It should be hidden but still rendered for measurement
  position: absolute;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
  pointer-events: none;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  font-size: 0.875rem;

  i {
    font-size: 1rem;
  }

  span {
    flex: 1;
  }

  &.success {
    background-color: var(--green-50);
    color: var(--green-700);
    border: 1px solid var(--green-200);
  }

  &.error {
    background-color: var(--red-50);
    color: var(--red-700);
    border: 1px solid var(--red-200);
  }
}
</style>
