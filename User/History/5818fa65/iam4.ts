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
      type: type as keyof typeof import('@/constants/print-preview.constants').PRINT_PREVIEW_WORKER_ACTIONS,
      config,
      data,
    }

    store.openModal()
    await store.generatePreview(options)
  }

  // Ultra-simple method for quick preview
  const quickPreview = async (
    type: string,
    title: string,
    fromDate?: string,
    toDate?: string,
    landscape = false,
    data?: unknown[],
  ) => {
    const config: PrintPreviewConfig = {
      header: {
        title,
        showCurrentDate: true,
        showPageNumber: true,
        ...(fromDate && toDate && { dateRange: { from: fromDate, to: toDate } }),
      },
      page: {
        orientation: landscape ? 'landscape' : 'portrait',
        paperSize: 'A4',
        margins: {
          top: 36,
          bottom: 36,
          left: 36,
          right: 36,
        },
        font: {
          family: 'NanumGothic-Regular',
          size: 12,
          color: '#000000',
        },
        spacing: {
          section: 18,
          line: 14,
        },
      },
      exportType: 'both',
    }

    await openPreviewWithConfig(type, config, data)
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
    quickPreview,
    closePreview,
    saveAsPdf,
    saveAsExcel,
  }
}
