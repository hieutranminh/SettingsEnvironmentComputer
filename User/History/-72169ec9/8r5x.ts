import { ref, computed, onUnmounted, type ComputedRef } from 'vue'

import { PRINT_ORIENTATION } from '@/constants'
import { useExcelGenerator } from './excel/useExcelGenerator' // TODO: Implement
import { usePdfGenerator, getDefaultConfig, checkLandscapeOrientation } from './pdf/usePdfGenerator'

import type { IPrintSection, IPdfConfig, IPrintPreviewState } from '@/types/print'
import { parseError } from '@/utils/common'

/**
 * Print preview composable return type
 */
export interface IUsePrintPreviewReturn {
  // State (readonly)
  isVisible: ComputedRef<boolean>
  sections: ComputedRef<IPrintSection[]>
  pdfBlobUrl: ComputedRef<string | null>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  config: ComputedRef<IPdfConfig | null>

  // Actions
  openPrintPreview: (
    sections: IPrintSection[],
    config?: IPdfConfig,
    excelHandler?: () => Promise<void>,
  ) => Promise<void>
  closePrintPreview: () => void
  downloadPdf: (filename: string) => void
  downloadExcel: (filename: string) => Promise<void>
  setLoading: (loading: boolean) => void
}

/**
 * Creates initial state for print preview
 * @returns Initial state object
 */
const createInitialState = (): IPrintPreviewState => ({
  isVisible: false,
  sections: [],
  pdfBlobUrl: null,
  isLoading: false,
  error: null,
  config: null,
  customExcelHandler: null,
})
// Global shared state for print preview - allows state sharing across components
const state = ref<IPrintPreviewState>(createInitialState())

/**
 * Shared state composable for print preview functionality
 * Handles PDF/Excel generation and preview dialog management [[memory:6155185]]
 * Example:
 *   const { openPrintPreview, closePrintPreview, downloadPdf, isLoading } = usePrintPreview()
 *   await openPrintPreview(sections, { title: 'My Report' })
 */
export const usePrintPreview = (): IUsePrintPreviewReturn => {
  // PDF generation composable
  const { generatePdf, pdfDocumentInstance } = usePdfGenerator()

  // Excel generation composable - initialize once
  const { generateExcel } = useExcelGenerator()

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
   * Example: setLoading(true) // Shows loading spinner
   */
  const setLoading = (loading: boolean): void => {
    state.value.isLoading = loading
  }

  /**
   * Opens print preview with sections
   * @param printSections - Sections to print
   * @param pdfConfig - Optional PDF configuration (uses getDefaultConfig if not provided)
   * @param excelHandler - Optional custom Excel handler
   *
   * Example:
   *   await openPrintPreview(sections, { title: 'Sales Report', orientation: 'landscape' })
   */
  const openPrintPreview = async (
    printSections: IPrintSection[],
    pdfConfig?: IPdfConfig,
    excelHandler?: () => Promise<void>,
  ): Promise<void> => {
    if (!printSections || printSections.length === 0) {
      throw new Error('Print sections are required and cannot be empty')
    }

    try {
      setLoading(true)
      state.value.error = null
      state.value.sections = printSections

      // Use getDefaultConfig if no config provided
      const isLandscape = checkLandscapeOrientation(printSections)
      const finalConfig = {
        ...getDefaultConfig(isLandscape),
        ...pdfConfig,
      }
      state.value.config = finalConfig
      state.value.customExcelHandler = excelHandler ?? null

      // Generate PDF
      const blob = await generatePdf(printSections, finalConfig)

      // Create blob URL for preview
      cleanup() // Clean up previous URL
      const url = URL.createObjectURL(blob)
      state.value.pdfBlobUrl = url

      // Show preview dialog
      state.value.isVisible = true
    } catch (error) {
      const errorMessage = parseError(error, 'Failed to open print preview')
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
  }

  /**
   * Downloads the generated PDF file
   * @param filename - Name for the PDF file (without extension)
   *
   * Example:
   *   downloadPdf('sales-report-2024')
   */
  const downloadPdf = (filename: string): void => {
    if (!filename || filename.trim() === '') {
      throw new Error('Filename is required for PDF download')
    }

    if (!state.value.pdfBlobUrl) {
      throw new Error('No PDF document available for download')
    }

    if (!pdfDocumentInstance.value) {
      throw new Error('PDF document instance is not available')
    }

    pdfDocumentInstance.value.save(filename)
  }

  /**
   * Downloads Excel file using custom handler or default generator
   * @param filename - Name for the Excel file (without extension)
   *
   * Example:
   *   await downloadExcel('sales-report-2024')
   */
  const downloadExcel = async (filename: string): Promise<void> => {
    if (!filename || filename.trim() === '') {
      throw new Error('Filename is required for Excel download')
    }

    try {
      // Use custom handler if provided
      if (state.value.customExcelHandler) {
        await state.value.customExcelHandler()
        return
      }

      if (!state.value.config) {
        throw new Error('Configuration is required for Excel generation')
      }

      if (!state.value.sections || state.value.sections.length === 0) {
        throw new Error('No sections available for Excel generation')
      }

      // Create a properly typed config by merging with defaults
      // Use landscape detection from current config instead of hardcoded false
      const isLandscape = state.value.config.orientation === PRINT_ORIENTATION.LANDSCAPE
      const finalConfig = { ...getDefaultConfig(isLandscape), ...state.value.config }
      await generateExcel(state.value.sections, finalConfig, filename)
    } catch (error) {
      state.value.error = parseError(error, 'Failed to generate Excel file')
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
