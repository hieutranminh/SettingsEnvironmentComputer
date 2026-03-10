// composables/usePrintPreview.ts
import { storeToRefs } from 'pinia'

import { usePrintPreviewStore } from '@/stores/print-preview.store'
import type { PrintPreviewOptions } from '@/types/print-preview.types'

export function usePrintPreview() {
  const store = usePrintPreviewStore()
  const { isModalOpen, isLoading, isProcessing, progress, pdfBlobUrl, excelBlob, error } = storeToRefs(store)

  const openPreview = async (options: PrintPreviewOptions) => {
    store.openModal()
    await store.generatePreview(options)
  }

  const closePreview = () => {
    store.closeModal()
    store.resetState()
  }

  const saveAsPdf = async (fileName: string) => {
    await store.saveAsPdf(fileName)
  }

  const saveAsExcel = async (fileName: string) => {
    await store.saveAsExcel(fileName)
  }

  return {
    // State
    isModalOpen,
    isLoading,
    isProcessing,
    progress,
    pdfBlobUrl,
    excelBlob,
    error,

    // Actions
    openPreview,
    closePreview,
    saveAsPdf,
    saveAsExcel,
  }
}
