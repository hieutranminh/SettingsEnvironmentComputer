<template>
  <Dialog
    modal
    maximizable
    class="print-preview-dialog"
    v-model:visible="isModalOpen"
    :header="$t('general.print-preview')"
    :draggable="false"
    :resizable="false"
    :close-on-escape="false"
    :style="{ width: '95vw', height: '95vh' }"
    :pt="{
      root: { style: 'background: var(--p-surface-50);' },
      content: { style: 'height: 100%;' },
    }"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
      <p>{{ $t('general.generating-print-preview') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <Message severity="error" :closable="false">
        {{ error }}
      </Message>
    </div>

    <!-- Preview Container -->
    <div v-else class="preview-container">
      <div class="preview-header">
        <PrintPreviewActions
          :is-processing="isLoading"
          :current-page="currentPage"
          :total-pages="totalPages"
          :skip-excel-download="config?.skipExcelDownload || false"
          @print="handlePrint"
          @download="handleDownload"
          @setPage="handleSetPage"
        />
      </div>

      <div class="preview-content">
        <iframe
          v-if="pdfBlobUrl"
          :src="pdfBlobUrl"
          ref="printContentRef"
          class="iframe-pdf"
          width="100%"
          height="600px"
          frameborder="0"
          type="application/pdf"
        />

        <VuePdfEmbed :page="currentPage" :class="previewContentPdfClass" :source="pdfBlobUrl" @loaded="onLoaded" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

// Composables
import { usePrintPreview } from '@/composables/print'
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { DOWNLOAD_TYPE } from '@/constants'
// Stores

// Components
import PrintPreviewActions from './PrintPreviewActions.vue'

// Types
interface PDFDocumentProxy {
  numPages: number
}

// Initialize composable
// const printPreviewStore = usePrintPreviewStore()
// const { isVisible, pdfBlobUrl, error, config, isLoading } = storeToRefs(printPreviewStore)
const { isVisible, pdfBlobUrl, error, config, isLoading, closePrintPreview, downloadPdf, downloadExcel } =
  usePrintPreview()
const { formatDate } = useDateFormat()

// Ref
const currentPage = ref(1)
const totalPages = ref(0)
const printContentRef = ref<HTMLIFrameElement | null>(null)

// Computed
const isModalOpen = computed({
  get: () => isVisible.value,
  set: (value: boolean) => {
    if (!value) {
      currentPage.value = 1
      closePrintPreview()
    }
  },
})

const reportDownloadFileName = computed(() => {
  return `${config.value?.title} (${formatDate(new Date(), { format: 'YYYY-MM-DD_HH_mm_ss' })})`
})

const previewContentPdfClass = computed(() => ['preview-content-pdf', 'preview-content-pdf-landscape'])

// Actions
const handlePrint = () => {
  printContentRef.value?.contentWindow?.print()
}

const handleDownload = (type: string) => {
  if (type === DOWNLOAD_TYPE.PDF) {
    downloadPdf(reportDownloadFileName.value)
  } else {
    downloadExcel(reportDownloadFileName.value)
  }
}

const handleSetPage = (page: number) => {
  currentPage.value = page
}

const onLoaded = (doc: PDFDocumentProxy) => {
  totalPages.value = doc.numPages
}
</script>

<style lang="scss" scoped>
.print-preview-dialog {
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
    height: 100%;

    p {
      margin: 0;
      color: var(--text-color-secondary);
    }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    height: 100%;
  }

  .preview-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;

    .preview-header {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .preview-content {
      .iframe-pdf {
        display: none;
      }

      .preview-content-pdf {
        margin: auto auto 2rem;
        border: 2px solid #dee2e6;

        &.preview-content-pdf-portrait {
          max-width: 210mm;
          max-height: 297mm;
        }

        &.preview-content-pdf-landscape {
          max-width: 297mm;
          max-height: 210mm;
        }
      }
    }
  }
}
</style>
