import { ref, computed, readonly } from 'vue'
import { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'
import type { PrintPreviewOptions, PrintPreviewState } from '@/types/print-preview.types'

export interface PrintSection {
  type: 'TABLE' | 'CANVAS' | 'TEXT'
  customStyles?: string[]
  sectionRef?: HTMLElement
}

export interface PrintPreviewConfig {
  headerTitle: string
  headerSubtitle: string
  headerDate?: string[]
  printSections: PrintSection[]
}

export function usePrintPreview() {
  // State
  const isModalOpen = ref(false)
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const progress = ref(0)
  const pdfBlobUrl = ref<string | null>(null)
  const excelBlob = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const currentConfig = ref<PrintPreviewConfig | null>(null)

  // Worker instance
  let worker: Worker | null = null

  // Computed
  const state = computed<PrintPreviewState>(() => ({
    isLoading: isLoading.value,
    isProcessing: isProcessing.value,
    progress: progress.value,
    pdfBlobUrl: pdfBlobUrl.value,
    excelBlob: excelBlob.value,
    error: error.value,
  }))

  // Methods
  const openPrintPreview = (config: PrintPreviewConfig): void => {
    currentConfig.value = config
    isModalOpen.value = true
    error.value = null
    pdfBlobUrl.value = null
    excelBlob.value = null
    progress.value = 0
  }

  const closePrintPreview = (): void => {
    isModalOpen.value = false
    currentConfig.value = null
    cleanupWorker()
  }

  const processPrintPreview = async (workerType: keyof typeof PRINT_PREVIEW_WORKER_ACTIONS): Promise<void> => {
    if (!currentConfig.value) {
      throw new Error('No print preview configuration available')
    }

    try {
      isLoading.value = true
      isProcessing.value = true
      error.value = null
      progress.value = 0

      // Create worker
      worker = new Worker(new URL('@/workers/print-preview.worker.ts', import.meta.url), {
        type: 'module',
      })

      // Prepare options
      const options: PrintPreviewOptions = {
        workerType,
        headerTitle: currentConfig.value.headerTitle,
        headerSubtitle: currentConfig.value.headerSubtitle,
        headerDate: currentConfig.value.headerDate,
      }

      // Send message to worker
      worker.postMessage(options)

      // Handle worker messages
      worker.onmessage = (event) => {
        const { type, progress: workerProgress, isDone, pdfBlob, excelBlob: workerExcelBlob, error: workerError } = event.data

        if (type === 'progress') {
          progress.value = workerProgress
        } else if (type === 'success' && isDone) {
          if (pdfBlob) {
            pdfBlobUrl.value = URL.createObjectURL(pdfBlob)
          }
          if (workerExcelBlob) {
            excelBlob.value = workerExcelBlob
          }
          progress.value = 100
          isProcessing.value = false
          isLoading.value = false
        } else if (type === 'error' && isDone) {
          error.value = new Error(workerError || 'Print preview processing failed')
          isProcessing.value = false
          isLoading.value = false
        }
      }

      // Handle worker errors
      worker.onerror = (event) => {
        error.value = new Error(`Worker error: ${event.message}`)
        isProcessing.value = false
        isLoading.value = false
        cleanupWorker()
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to process print preview')
      isProcessing.value = false
      isLoading.value = false
      cleanupWorker()
    }
  }

  const cleanupWorker = (): void => {
    if (worker) {
      worker.terminate()
      worker = null
    }
  }

  const downloadPdf = (): void => {
    if (pdfBlobUrl.value) {
      const link = document.createElement('a')
      link.href = pdfBlobUrl.value
      link.download = `${currentConfig.value?.headerTitle || 'report'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const downloadExcel = (): void => {
    if (excelBlob.value) {
      const url = URL.createObjectURL(excelBlob.value)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentConfig.value?.headerTitle || 'report'}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  // Cleanup on unmount
  const cleanup = (): void => {
    cleanupWorker()
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
    }
  }

  return {
    // State
    isModalOpen: readonly(isModalOpen),
    state,
    currentConfig: readonly(currentConfig),

    // Methods
    openPrintPreview,
    closePrintPreview,
    processPrintPreview,
    downloadPdf,
    downloadExcel,
    cleanup,
  }
}
