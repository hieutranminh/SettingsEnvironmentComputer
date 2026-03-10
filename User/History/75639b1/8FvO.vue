<template>
  <Dialog
    v-model:visible="isModalVisible"
    :modal="true"
    :closable="!isWorkerProcessing"
    :close-on-escape="!isWorkerProcessing"
    :dismissable-mask="!isWorkerProcessing"
    :header="modalTitle"
    :style="{ width: '90vw', maxWidth: '1200px' }"
    @hide="handleHide"
  >
    <div class="print-preview-modal">
      <!-- Loading State -->
      <div v-if="isWorkerProcessing" class="loading-container">
        <ProgressSpinner />
        <div class="loading-text">
          <h3>{{ loadingTitle }}</h3>
          <p>{{ loadingMessage }}</p>
          <div class="progress-bar">
            <ProgressBar :value="progressPercentage" :show-value="true" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="error-container">
        <div class="error-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="error-content">
          <h3>{{ t('common.error') }}</h3>
          <p>{{ errorMessage }}</p>
          <div class="error-actions">
            <Button 
              :label="t('common.retry')" 
              icon="pi pi-refresh" 
              @click="handleRetry"
            />
            <Button 
              :label="t('common.close')" 
              variant="outline" 
              @click="hidePrintPreviewModal"
            />
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="isReady" class="success-container">
        <div class="preview-content">
          <!-- PDF Preview -->
          <div class="pdf-preview">
            <h4>{{ t('print.preview.pdf') }}</h4>
            <div class="pdf-container">
              <iframe 
                v-if="pdfBlobUrl" 
                :src="pdfBlobUrl" 
                width="100%" 
                height="500"
                frameborder="0"
              />
            </div>
          </div>

          <!-- Download Actions -->
          <div class="download-actions">
            <h4>{{ t('print.preview.download') }}</h4>
            <div class="action-buttons">
              <Button 
                :label="t('print.preview.downloadPdf')" 
                icon="pi pi-file-pdf" 
                @click="handleDownloadPdf"
              />
              <Button 
                :label="t('print.preview.downloadExcel')" 
                icon="pi pi-file-excel" 
                @click="handleDownloadExcel"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-container">
        <div class="empty-icon">
          <i class="pi pi-file"></i>
        </div>
        <div class="empty-content">
          <h3>{{ t('print.preview.noPreview') }}</h3>
          <p>{{ t('print.preview.noPreviewDescription') }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <Button 
          :label="t('common.close')" 
          variant="outline" 
          @click="hidePrintPreviewModal"
        />
        <div v-if="isReady" class="footer-actions">
          <Button 
            :label="t('print.preview.print')" 
            icon="pi pi-print" 
            @click="handlePrint"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import ProgressBar from 'primevue/progressbar'
import { usePrintPreview } from '../composables/usePrintPreview'

interface Props {
  reportName?: string
}

const props = withDefaults(defineProps<Props>(), {
  reportName: 'Report',
})

const emit = defineEmits<{
  hide: []
  retry: []
  download: [type: 'pdf' | 'excel']
  print: []
}>()

const { t } = useI18n()
const {
  isModalVisible,
  isWorkerProcessing,
  hasError,
  isReady,
  progressPercentage,
  errorMessage,
  pdfBlobUrl,
  hidePrintPreviewModal,
  handleSaveAsPdf,
  handleSaveAsExcel,
} = usePrintPreview()

const modalTitle = computed(() => 
  isWorkerProcessing 
    ? t('print.preview.generating') 
    : t('print.preview.title')
)

const loadingTitle = computed(() => t('print.preview.generating'))
const loadingMessage = computed(() => t('print.preview.pleaseWait'))

const handleHide = (): void => {
  emit('hide')
}

const handleRetry = (): void => {
  emit('retry')
}

const handleDownloadPdf = (): void => {
  handleSaveAsPdf(props.reportName)
  emit('download', 'pdf')
}

const handleDownloadExcel = (): void => {
  handleSaveAsExcel(props.reportName)
  emit('download', 'excel')
}

const handlePrint = (): void => {
  if (pdfBlobUrl.value) {
    const printWindow = window.open(pdfBlobUrl.value, '_blank')
    if (printWindow) {
      printWindow.print()
    }
  }
  emit('print')
}
</script>

<style scoped lang="scss">
.print-preview-modal {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .loading-text {
    margin-top: 1rem;

    h3 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    p {
      margin-bottom: 1rem;
      color: var(--text-color-secondary);
    }

    .progress-bar {
      width: 300px;
      max-width: 100%;
    }
  }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .error-icon {
    font-size: 3rem;
    color: var(--red-500);
    margin-bottom: 1rem;
  }

  .error-content {
    h3 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    p {
      margin-bottom: 1.5rem;
      color: var(--text-color-secondary);
    }

    .error-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }
  }
}

.success-container {
  .preview-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    height: 600px;

    .pdf-preview {
      h4 {
        margin-bottom: 1rem;
        color: var(--text-color);
      }

      .pdf-container {
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        overflow: hidden;
        height: calc(100% - 3rem);
      }
    }

    .download-actions {
      h4 {
        margin-bottom: 1rem;
        color: var(--text-color);
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .p-button {
          justify-content: flex-start;
        }
      }
    }
  }
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .empty-icon {
    font-size: 3rem;
    color: var(--surface-400);
    margin-bottom: 1rem;
  }

  .empty-content {
    h3 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    p {
      color: var(--text-color-secondary);
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .footer-actions {
    display: flex;
    gap: 0.5rem;
  }
}

@media (width <= 768px) {
  .success-container .preview-content {
    grid-template-columns: 1fr;
    height: auto;
  }

  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style> 