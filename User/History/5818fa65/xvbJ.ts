import { storeToRefs } from 'pinia'

import { usePrintPreviewStore } from '@/stores/print-preview.store'

// Types
export interface PrintSection {
  refType: 'TABLE' | 'CANVAS' | 'SECTION'
  sectionRef: HTMLElement
  customStyles: string[]
}

export function usePrintPreview() {
  const printPreviewStore = usePrintPreviewStore()
  const { isVisible, sections, pdfBlobUrl, isLoading, error } = storeToRefs(printPreviewStore)

  const openPrintPreview = async (printSections: PrintSection[]): Promise<void> => {
    await printPreviewStore.openPrintPreview(printSections)
  }

  const closePrintPreview = (): void => {
    printPreviewStore.closePrintPreview()
  }

  const print = async (): Promise<void> => {
    await printPreviewStore.print()
  }

  return {
    // State
    isVisible,
    sections,
    pdfBlobUrl,
    isLoading,
    error,

    // Actions
    openPrintPreview,
    closePrintPreview,
    print,
  }
}
