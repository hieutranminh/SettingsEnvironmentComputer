// composables/usePrintPreview.ts
import { storeToRefs } from 'pinia'

import { DEFAULT_PRINT_CONFIG } from '@/constants/print-preview.constants'
import { usePrintPreviewStore } from '@/stores/print-preview.store'
import type {
  PrintHeaderConfig,
  PrintPageConfig,
  PrintPreviewConfig,
  PrintPreviewOptions,
} from '@/types/print-preview.types'

export function usePrintPreview() {
  const store = usePrintPreviewStore()
  const { isModalOpen, isLoading, isProcessing, progress, pdfBlobUrl, excelBlob, error } = storeToRefs(store)

  const createDefaultPageConfig = (): PrintPageConfig => {
    return {
      orientation: 'portrait',
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

  const createDefaultHeaderConfig = (title: string): PrintHeaderConfig => {
    return {
      title,
      showCurrentDate: true,
      showPageNumber: true,
    }
  }

  const openPreview = async (
    type: PrintPreviewOptions['type'],
    config: {
      header: Partial<PrintHeaderConfig> & { title: string }
      page?: Partial<PrintPageConfig>
      exportType?: 'pdf' | 'excel' | 'both'
      customData?: Record<string, unknown>
    },
  ) => {
    // Merge with defaults
    const fullConfig: PrintPreviewConfig = {
      header: {
        ...createDefaultHeaderConfig(config.header.title),
        ...config.header,
      },
      page: {
        ...createDefaultPageConfig(),
        ...config.page,
      },
      exportType: config.exportType || 'both',
      customData: config.customData,
    }

    const options: PrintPreviewOptions = {
      type,
      config: fullConfig,
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
    closePreview,
    saveAsPdf,
    saveAsExcel,
  }
}
