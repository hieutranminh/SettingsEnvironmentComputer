/**
 * Print preview store for backward compatibility
 * Delegates to clean composables for actual functionality
 *
 * @deprecated Use usePrintPreview composable instead
 */

import { defineStore } from 'pinia'
import type { PrintSection, PdfConfig } from '@/types/print'
import { usePrintState } from './core/usePrintState'
import { usePdfGenerator } from './pdf/usePdfGenerator'

/**
 * Print preview store using Pinia (backward compatibility)
 *
 * @deprecated Prefer usePrintPreview composable for new code
 */
export const usePrintPreviewStore = defineStore('printPreview', () => {
  // Delegate to composables for clean architecture
  const printState = usePrintState()
  const { generatePdf } = usePdfGenerator()

  // Store-specific state
  let pdfDocument: Blob | null = null
  let customExcelHandler: (() => Promise<void>) | undefined = undefined

  /**
   * Opens print preview - delegates to composables
   */
  const openPrintPreview = async (
    printSections: PrintSection[],
    pdfConfig?: PdfConfig,
    excelHandler?: () => Promise<void>,
  ): Promise<void> => {
    try {
      printState.setLoading(true)
      printState.setError(null)
      printState.setSections(printSections)
      printState.setConfig(pdfConfig || null)
      customExcelHandler = excelHandler

      const blob = await generatePdf(printSections, pdfConfig)
      pdfDocument = blob

      const url = URL.createObjectURL(blob)
      printState.setPdfBlobUrl(url)
      printState.setVisible(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open print preview'
      printState.setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      printState.setLoading(false)
    }
  }

  const closePrintPreview = (): void => {
    printState.cleanup()
    printState.reset()
    pdfDocument = null
    customExcelHandler = undefined
  }

  const downloadPdf = (filename: string): void => {
    if (!pdfDocument) {
      throw new Error('No PDF document available')
    }

    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfDocument)
    link.download = `${filename}.pdf`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const downloadExcel = async (filename: string): Promise<void> => {
    if (customExcelHandler) {
      await customExcelHandler()
      return
    }
    throw new Error('Excel generation not yet implemented in refactored version')
  }

  return {
    // State
    state: printState.state,
    isVisible: printState.isVisible,
    sections: printState.sections,
    pdfBlobUrl: printState.pdfBlobUrl,
    isLoading: printState.isLoading,
    error: printState.error,
    config: printState.config,

    // Actions
    openPrintPreview,
    closePrintPreview,
    setIsLoading: printState.setLoading,
    downloadPdf,
    downloadExcel,
  }
})
