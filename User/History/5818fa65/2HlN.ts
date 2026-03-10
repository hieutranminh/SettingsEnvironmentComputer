import { usePrintPreviewStore } from '@/stores/print-preview.store'

// Types
export interface PrintSection {
  refType: 'TABLE' | 'DIV' | 'SECTION'
  sectionRef: HTMLElement
  customStyles: string[]
}

export function usePrintPreview() {
  const printPreviewStore = usePrintPreviewStore()

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
    // State - these are already computed refs from the store
    isVisible: printPreviewStore.isVisible,
    sections: printPreviewStore.sections,
    pdfBlobUrl: printPreviewStore.pdfBlobUrl,
    isLoading: printPreviewStore.isLoading,
    error: printPreviewStore.error,

    // Actions
    openPrintPreview,
    closePrintPreview,
    print,
  }
}
