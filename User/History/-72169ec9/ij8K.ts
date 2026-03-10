import { ref, computed, onUnmounted, type ComputedRef } from 'vue'

import type { PrintSection, PdfConfig } from '@/types/print'

import { usePdfGenerator, getDefaultConfig, checkLandscapeOrientation } from './pdf/usePdfGenerator'
// import { useExcelGenerator } from './excel/useExcelGenerator' // TODO: Implement

/**
 * Print preview state interface
 */
interface PrintPreviewState {
  isVisible: boolean
  sections: PrintSection[]
  pdfBlobUrl: string | null
  isLoading: boolean
  error: string | null
  config: PdfConfig | null
}

/**
 * Print preview composable return type
 */
export interface UsePrintPreviewReturn {
  // State (readonly)
  isVisible: ComputedRef<boolean>
  sections: ComputedRef<PrintSection[]>
  pdfBlobUrl: ComputedRef<string | null>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  config: ComputedRef<PdfConfig | null>

  // Actions
  openPrintPreview: (sections: PrintSection[], config?: PdfConfig, excelHandler?: () => Promise<void>) => Promise<void>
  closePrintPreview: () => void
  downloadPdf: (filename: string) => void
  downloadExcel: (filename: string) => Promise<void>
  setLoading: (loading: boolean) => void
}

/**
 * Creates initial state for print preview
 * @returns Initial state object
 */
const createInitialState = (): PrintPreviewState => ({
  isVisible: false,
  sections: [],
  pdfBlobUrl: null,
  isLoading: false,
  error: null,
  config: null,
})
const state = ref<PrintPreviewState>(createInitialState())
/**
 * Pure composable for print preview functionality
 * Handles PDF/Excel generation and preview dialog management [[memory:6155185]]
 *
 * @returns Print preview utilities and state
 *
 * Example:
 *   const { open, close, downloadPdf, isLoading } = usePrintPreview()
 *   await open(sections, { title: 'My Report' })
 */
export const usePrintPreview = (): UsePrintPreviewReturn => {
  // PDF generation composable
  const { generatePdf } = usePdfGenerator()

  // Internal references
  let pdfDocument: Blob | null = null
  let customExcelHandler: (() => Promise<void>) | undefined = undefined

  // Computed state (readonly for external access)
  const isVisible = computed(() => state.value.isVisible)
  const sections = computed(() => state.value.sections)
  const pdfBlobUrl = computed(() => state.value.pdfBlobUrl)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)
  const config = computed(() => state.value.config)

  /**
   * Cleans up blob URLs and resources
   */
  const cleanup = (): void => {
    if (state.value.pdfBlobUrl) {
      URL.revokeObjectURL(state.value.pdfBlobUrl)
      state.value.pdfBlobUrl = null
    }
  }

  /**
   * Sets loading state
   * @param loading - Loading state
   */
  const setLoading = (loading: boolean): void => {
    state.value.isLoading = loading
  }

  /**
   * Opens print preview with sections
   * @param printSections - Sections to print
   * @param pdfConfig - Optional PDF configuration
   * @param excelHandler - Optional custom Excel handler
   *
   * Example:
   *   await open(sections, { title: 'Sales Report', orientation: 'landscape' })
   */
  const openPrintPreview = async (
    printSections: PrintSection[],
    pdfConfig?: PdfConfig,
    excelHandler?: () => Promise<void>,
  ): Promise<void> => {
    try {
      setLoading(true)
      state.value.error = null
      state.value.sections = printSections
      state.value.config = pdfConfig || null
      customExcelHandler = excelHandler

      // Generate PDF
      const blob = await generatePdf(printSections, pdfConfig)
      pdfDocument = blob

      // Create blob URL for preview
      cleanup() // Clean up previous URL
      const url = URL.createObjectURL(blob)
      state.value.pdfBlobUrl = url

      // Show preview dialog
      state.value.isVisible = true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open print preview'
      state.value.error = errorMessage
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Closes print preview and cleans up resources
   */
  const closePrintPreview = (): void => {
    cleanup()
    state.value = createInitialState()
    pdfDocument = null
    customExcelHandler = undefined
  }

  /**
   * Downloads the generated PDF file
   * @param filename - Name for the PDF file (without extension)
   *
   * Example:
   *   downloadPdf('sales-report-2024')
   */
  const downloadPdf = (filename: string): void => {
    if (!pdfDocument) {
      throw new Error('No PDF document available for download')
    }

    // Create download link
    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfDocument)
    link.download = `${filename}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up blob URL
    URL.revokeObjectURL(link.href)
  }

  /**
   * Downloads Excel file using custom handler or default generator
   * @param filename - Name for the Excel file (without extension)
   *
   * Example:
   *   await downloadExcel('sales-report-2024')
   */
  const downloadExcel = async (filename: string): Promise<void> => {
    try {
      // Use custom handler if provided
      if (customExcelHandler) {
        await customExcelHandler()
        return
      }

      // TODO: Implement default Excel generation
      // const { generateExcel } = useExcelGenerator()
      // await generateExcel(state.value.sections, state.value.config, filename)

      throw new Error(`Excel generation not yet implemented for '${filename}'. Please provide custom handler.`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate Excel file'
      state.value.error = errorMessage
      throw new Error(errorMessage)
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State (readonly computed refs)
    isVisible,
    sections,
    pdfBlobUrl,
    isLoading,
    error,
    config,

    // Actions
    openPrintPreview,
    closePrintPreview,
    downloadPdf,
    downloadExcel,
    setLoading,
  }
}
