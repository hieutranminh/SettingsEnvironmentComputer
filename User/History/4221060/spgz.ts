// stores/print-preview.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { PrintPreviewState, PrintPreviewOptions } from '../types/print-preview.types'

export const usePrintPreviewStore = defineStore('printPreview', () => {
  // State
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const progress = ref(0)
  const pdfBlobUrl = ref<string | null>(null)
  const excelBlob = ref<Blob | null>(null)
  const error = ref<Error | null>(null)

  // Actions
  const generatePreview = async (options: PrintPreviewOptions) => {
    resetState()
    isProcessing.value = true

    try {
      // Initialize worker
      const worker = new Worker(new URL('../workers/print-preview.worker.ts', import.meta.url), { type: 'module' })

      // Handle worker messages
      worker.onmessage = (event) => {
        const {
          isDone,
          progress: workerProgress,
          pdfBlobUrl: workerPdfBlobUrl,
          excelBlob: workerExcelBlob,
          error: workerError,
        } = event.data

        progress.value = workerProgress

        if (isDone) {
          isProcessing.value = false
          pdfBlobUrl.value = workerPdfBlobUrl
          excelBlob.value = workerExcelBlob
          worker.terminate()
        }

        if (workerError) {
          error.value = workerError
          isProcessing.value = false
          worker.terminate()
        }
      }

      // Send message to worker
      worker.postMessage(options)
    } catch (err) {
      error.value = err as Error
      isProcessing.value = false
    }
  }

  const resetState = () => {
    isLoading.value = false
    isProcessing.value = false
    progress.value = 0
    pdfBlobUrl.value = null
    excelBlob.value = null
    error.value = null
  }

  const saveAsPdf = async (fileName: string) => {
    if (!pdfBlobUrl.value) return

    const { saveAs } = await import('file-saver')
    saveAs(pdfBlobUrl.value, `${fileName}.pdf`)
  }

  const saveAsExcel = async (fileName: string) => {
    if (!excelBlob.value) return

    const { saveAs } = await import('file-saver')
    saveAs(excelBlob.value, `${fileName}.xlsx`)
  }

  // Return all state and actions
  return {
    // State
    isLoading,
    isProcessing,
    progress,
    pdfBlobUrl,
    excelBlob,
    error,

    // Actions
    generatePreview,
    resetState,
    saveAsPdf,
    saveAsExcel,
  }
})
