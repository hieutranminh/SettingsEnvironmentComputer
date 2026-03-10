/**
 * Core state management for print preview functionality
 * 
 * Example usage:
 *   const { state, setLoading, setError, reset } = usePrintState()
 *   setLoading(true)
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { PrintSection, PdfConfig } from '@/types/print'

/**
 * Print preview state interface
 */
export interface PrintState {
  isVisible: boolean
  sections: PrintSection[]
  pdfBlobUrl: string | null
  isLoading: boolean
  error: string | null
  config: PdfConfig | null
}

/**
 * Print state composable return type
 */
export interface UsePrintStateReturn {
  // State
  state: Ref<PrintState>
  
  // Computed
  isVisible: ComputedRef<boolean>
  sections: ComputedRef<PrintSection[]>
  pdfBlobUrl: ComputedRef<string | null>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  config: ComputedRef<PdfConfig | null>
  
  // Actions
  setVisible: (visible: boolean) => void
  setSections: (sections: PrintSection[]) => void
  setPdfBlobUrl: (url: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setConfig: (config: PdfConfig | null) => void
  reset: () => void
  cleanup: () => void
}

/**
 * Creates initial state for print preview
 * @returns Initial state object
 */
const createInitialState = (): PrintState => ({
  isVisible: false,
  sections: [],
  pdfBlobUrl: null,
  isLoading: false,
  error: null,
  config: null,
})

/**
 * Composable for managing print preview state
 * @returns Print state management utilities
 * 
 * Example:
 *   const printState = usePrintState()
 *   printState.setLoading(true)
 *   printState.setSections([...])
 */
export const usePrintState = (): UsePrintStateReturn => {
  // State
  const state = ref<PrintState>(createInitialState())

  // Computed properties
  const isVisible = computed(() => state.value.isVisible)
  const sections = computed(() => state.value.sections)
  const pdfBlobUrl = computed(() => state.value.pdfBlobUrl)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)
  const config = computed(() => state.value.config)

  // Actions
  const setVisible = (visible: boolean): void => {
    state.value.isVisible = visible
  }

  const setSections = (sections: PrintSection[]): void => {
    state.value.sections = sections
  }

  const setPdfBlobUrl = (url: string | null): void => {
    // Clean up previous URL if exists
    if (state.value.pdfBlobUrl && state.value.pdfBlobUrl !== url) {
      URL.revokeObjectURL(state.value.pdfBlobUrl)
    }
    state.value.pdfBlobUrl = url
  }

  const setLoading = (loading: boolean): void => {
    state.value.isLoading = loading
  }

  const setError = (error: string | null): void => {
    state.value.error = error
  }

  const setConfig = (config: PdfConfig | null): void => {
    state.value.config = config
  }

  /**
   * Cleans up resources (blob URLs)
   */
  const cleanup = (): void => {
    if (state.value.pdfBlobUrl) {
      URL.revokeObjectURL(state.value.pdfBlobUrl)
      state.value.pdfBlobUrl = null
    }
  }

  /**
   * Resets state to initial values
   */
  const reset = (): void => {
    cleanup()
    state.value = createInitialState()
  }

  return {
    // State
    state,
    
    // Computed
    isVisible,
    sections,
    pdfBlobUrl,
    isLoading,
    error,
    config,
    
    // Actions
    setVisible,
    setSections,
    setPdfBlobUrl,
    setLoading,
    setError,
    setConfig,
    reset,
    cleanup,
  }
}
