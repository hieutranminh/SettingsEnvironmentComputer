// composables/usePrintPreview.ts
import { storeToRefs } from 'pinia'

import { usePrintPreviewStore } from '@/stores/print-preview.store'
import type { PrintPreviewOptions, PrintPreviewConfig } from '@/types/print-preview.types'

export function usePrintPreview() {
  const store = usePrintPreviewStore()
  const { isModalOpen, isLoading, isProcessing, progress, pdfBlobUrl, excelBlob, error } = storeToRefs(store)

  const openPreview = async (options: PrintPreviewOptions) => {
    store.openModal()
    await store.generatePreview(options)
  }

  // Simplified method for direct config usage
  const openPreviewWithConfig = async (
    type: string,
    config: PrintPreviewConfig,
    data?: unknown[],
  ) => {
    const options: PrintPreviewOptions = {
      type: type as any, // Type assertion for flexibility
      config,
      data,
    }
    
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
    openPreviewWithConfig,
    closePreview,
    saveAsPdf,
    saveAsExcel,
  }
}
