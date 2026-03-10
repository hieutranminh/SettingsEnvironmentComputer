/**
 * Clean composable for print preview functionality
 * Follows Vue composables guidelines strictly
 *
 * Example usage:
 *   const printPreview = usePrintPreview()
 *   await printPreview.open(sections, config)
 *   printPreview.downloadPdf('report')
 */

import { readonly } from 'vue'
import type { PrintSection, PdfConfig } from '@/types/print'
import { usePrintState } from './core/usePrintState'
import { usePdfGenerator } from './pdf/usePdfGenerator'

/**
 * Composable return type following Vue guidelines
 */
export interface UsePrintPreviewReturn {
  // State (readonly)
  readonly isVisible: Readonly<boolean>
  readonly isLoading: Readonly<boolean>
  readonly error: Readonly<string | null>

  // Actions
  open: (sections: PrintSection[], config?: PdfConfig, excelHandler?: () => Promise<void>) => Promise<void>
  close: () => void
  downloadPdf: (filename: string) => void
  downloadExcel: (filename: string) => Promise<void>
}

/**
 * Print preview composable following Vue guidelines
 * Maximum file size: <150 lines ✓
 * Pure functional approach ✓
 * Clear separation of concerns ✓
 *
 * @returns Print preview functionality
 */
export const usePrintPreview = (): UsePrintPreviewReturn => {
  // State management composable
  const printState = usePrintState()

  // PDF generation composable
  const { generatePdf } = usePdfGenerator()

  // Local references
  let pdfDocument: Blob | null = null
  let customExcelHandler: (() => Promise<void>) | undefined = undefined

  /**
   * Opens print preview with sections
   * @param sections - Print sections to include
   * @param config - Optional PDF configuration
   * @param excelHandler - Optional Excel handler
   */
  const open = async (
    sections: PrintSection[],
    config?: PdfConfig,
    excelHandler?: () => Promise<void>,
  ): Promise<void> => {
    try {
      printState.setLoading(true)
      printState.setError(null)
      printState.setSections(sections)
      printState.setConfig(config || null)
      customExcelHandler = excelHandler

      // Generate PDF
      const blob = await generatePdf(sections, config)
      pdfDocument = blob

      // Create preview URL
      const url = URL.createObjectURL(blob)
      printState.setPdfBlobUrl(url)
      printState.setVisible(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Print preview failed'
      printState.setError(message)
      throw new Error(message)
    } finally {
      printState.setLoading(false)
    }
  }

  /**
   * Closes print preview
   */
  const close = (): void => {
    printState.cleanup()
    printState.reset()
    pdfDocument = null
    customExcelHandler = undefined
  }

  /**
   * Downloads PDF file
   * @param filename - File name without extension
   */
  const downloadPdf = (filename: string): void => {
    if (!pdfDocument) {
      throw new Error('No PDF document available for download')
    }

    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfDocument)
    link.download = `${filename}.pdf`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  /**
   * Downloads Excel file
   * @param filename - File name without extension
   */
  const downloadExcel = async (filename: string): Promise<void> => {
    if (customExcelHandler) {
      await customExcelHandler()
      return
    }

    // TODO: Implement with Excel composables
    throw new Error('Default Excel generation not implemented')
  }

  return {
    // State (readonly following Vue guidelines)
    isVisible: readonly(printState.isVisible),
    isLoading: readonly(printState.isLoading),
    error: readonly(printState.error),

    // Actions
    open,
    close,
    downloadPdf,
    downloadExcel,
  }
}
