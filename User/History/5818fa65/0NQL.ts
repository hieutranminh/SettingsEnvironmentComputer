// composables/usePrintPreview.ts
import { storeToRefs } from 'pinia'

import { DEFAULT_PRINT_CONFIG } from '@/constants/print-preview.constants'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
import type { PrintHeaderConfig, PrintPageConfig, PrintPreviewConfig, PrintPreviewOptions } from '@/types/print-preview.types'

export function usePrintPreview() {
  const store = usePrintPreviewStore()
  const { isModalOpen, isLoading, isProcessing, progress, pdfBlobUrl, excelBlob, error } = storeToRefs(store)

  const openPreview = async (options: PrintPreviewOptions) => {
    store.openModal()
    await store.generatePreview(options)
  }

  // Helper function to create default page config
  const createDefaultPageConfig = (orientation: 'portrait' | 'landscape' = 'portrait'): PrintPageConfig => {
    return {
      orientation,
      paperSize: 'A4',
      margins: {
        top: DEFAULT_PRINT_CONFIG.MARGINS.TOP,
        bottom: DEFAULT_PRINT_CONFIG.MARGINS.BOTTOM,
        left: DEFAULT_PRINT_CONFIG.MARGINS.LEFT,
        right: DEFAULT_PRINT_CONFIG.MARGINS.RIGHT,
      },
      font: {
        family: DEFAULT_PRINT_CONFIG.FONT.FAMILY,
        size: DEFAULT_PRINT_CONFIG.FONT.SIZE.BODY,
        color: DEFAULT_PRINT_CONFIG.FONT.COLOR,
      },
      spacing: {
        section: DEFAULT_PRINT_CONFIG.SPACING.SECTION,
        line: DEFAULT_PRINT_CONFIG.SPACING.LINE,
      },
    }
  }

  // Helper function to create header config
  const createHeaderConfig = (
    title: string,
    options: {
      subtitle?: string
      dateRange?: { from: string; to: string }
      customFields?: Array<{ label: string; value: string; position: 'left' | 'center' | 'right' }>
      showCurrentDate?: boolean
      showPageNumber?: boolean
    } = {},
  ): PrintHeaderConfig => {
    return {
      title,
      subtitle: options.subtitle,
      dateRange: options.dateRange,
      customFields: options.customFields,
      showCurrentDate: options.showCurrentDate ?? true,
      showPageNumber: options.showPageNumber ?? true,
    }
  }

  // Helper function to create complete print config
  const createPrintConfig = (
    title: string,
    options: {
      subtitle?: string
      dateRange?: { from: string; to: string }
      customFields?: Array<{ label: string; value: string; position: 'left' | 'center' | 'right' }>
      orientation?: 'portrait' | 'landscape'
      exportType?: 'pdf' | 'excel' | 'both'
      customData?: Record<string, unknown>
    } = {},
  ): PrintPreviewConfig => {
    return {
      header: createHeaderConfig(title, options),
      page: createDefaultPageConfig(options.orientation),
      exportType: options.exportType || 'both',
      customData: options.customData,
    }
  }

  // Quick preview with inline config
  const quickPreview = (
    type: keyof typeof import('@/constants/print-preview.constants').PRINT_PREVIEW_WORKER_ACTIONS,
    title: string,
    fromDate?: string,
    toDate?: string,
    landscape = false,
  ) => {
    const config = createPrintConfig(title, {
      dateRange: fromDate && toDate ? { from: fromDate, to: toDate } : undefined,
      orientation: landscape ? 'landscape' : 'portrait',
    })

    return openPreview({ type, config })
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
    quickPreview,
    closePreview,
    saveAsPdf,
    saveAsExcel,

    // Helper functions
    createPrintConfig,
    createHeaderConfig,
    createDefaultPageConfig,
  }
}
