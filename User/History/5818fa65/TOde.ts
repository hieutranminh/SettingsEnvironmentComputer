import { computed } from 'vue'

import { usePrintPreviewStore } from '@/stores/print-preview.store'

// Types
interface TableStyles {
  headStyles?: Record<string, unknown>
  footStyles?: Record<string, unknown>
  bodyStyles?: Record<string, unknown>
  columnStyles?: Record<string, Record<string, unknown>>
  styles?: Record<string, unknown>
  didParseCell?: (data: { column: { index: number }; section: string; cell: { styles: { halign?: string } } }) => void
}

export interface PrintSection {
  refType: 'TABLE' | 'CANVAS' | 'SECTION'
  sectionRef: HTMLElement
  alignment?: 'left' | 'center' | 'right'
  tableStyles?: TableStyles
}

export interface PdfConfig {
  format?: 'a3' | 'a4' | 'a5' | 'letter' | 'legal'
  unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc'
  orientation?: 'portrait' | 'landscape'
  title?: string
  subtitle?: string
  dateRange?: string
  totalItems?: number
}

export function usePrintPreview() {
  const printPreviewStore = usePrintPreviewStore()

  // Debug: Check if store is properly initialized
  if (!printPreviewStore) {
    console.error('PrintPreviewStore is not properly initialized')
    throw new Error('PrintPreviewStore is not properly initialized')
  }

  // Use computed properties to ensure reactivity
  const isVisible = computed(() => printPreviewStore.isVisible)
  const sections = computed(() => printPreviewStore.sections)
  const pdfBlobUrl = computed(() => printPreviewStore.pdfBlobUrl)
  const config = computed(() => printPreviewStore.config)
  const isLoading = computed(() => printPreviewStore.isLoading)
  const error = computed(() => printPreviewStore.error)

  const openPrintPreview = async (printSections: PrintSection[], config?: PdfConfig): Promise<void> => {
    await printPreviewStore.openPrintPreview(printSections, config)
  }

  const closePrintPreview = (): void => {
    printPreviewStore.closePrintPreview()
  }

  const setIsLoading = (isLoading: boolean): void => {
    console.log('setIsLoading called with:', isLoading)
    console.log('printPreviewStore:', printPreviewStore)

    if (!printPreviewStore) {
      console.error('Cannot set isLoading: store is undefined')
      return
    }

    try {
      printPreviewStore.setIsLoading(isLoading)
      console.log('setIsLoading successful')
    } catch (err) {
      console.error('Error setting isLoading:', err)
    }
  }

  return {
    // State
    isVisible,
    sections,
    pdfBlobUrl,
    config,
    isLoading,
    error,

    // Actions
    openPrintPreview,
    closePrintPreview,
    setIsLoading,
  }
}
