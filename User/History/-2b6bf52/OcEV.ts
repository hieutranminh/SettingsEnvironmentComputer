import { ref, readonly } from 'vue'

import type { FontConfig } from '@/workers/utils/font-utils'

export interface PdfFontInfo {
  name: string
  style: 'normal' | 'bold' | 'italic' | 'bolditalic'
  weight: 'normal' | 'bold'
  isAvailable: boolean
}

export function usePdfFonts() {
  const availableFonts = ref<PdfFontInfo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get list of available fonts for PDF generation
   */
  const getAvailableFonts = (): PdfFontInfo[] => {
    return [
      {
        name: 'NanumGothic',
        style: 'normal',
        weight: 'normal',
        isAvailable: true,
      },
      {
        name: 'NanumGothic',
        style: 'bold',
        weight: 'bold',
        isAvailable: true,
      },
      {
        name: 'helvetica',
        style: 'normal',
        weight: 'normal',
        isAvailable: true,
      },
      {
        name: 'helvetica',
        style: 'bold',
        weight: 'bold',
        isAvailable: true,
      },
    ]
  }

  /**
   * Load available fonts
   */
  const loadFonts = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      availableFonts.value = getAvailableFonts()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load fonts'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get font configuration by name and style
   */
  const getFontConfig = (name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal'): FontConfig | null => {
    const font = availableFonts.value.find(f => f.name === name && f.style === style)
    if (!font) return null

    return {
      name: font.name,
      style: font.style,
      weight: font.weight,
      file: null, // Font file will be loaded in worker context
    }
  }

  /**
   * Check if a font is available
   */
  const isFontAvailable = (name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal'): boolean => {
    return availableFonts.value.some(f => f.name === name && f.style === style)
  }

  /**
   * Get recommended fonts for different content types
   */
  const getRecommendedFonts = () => {
    return {
      headers: { name: 'NanumGothic', style: 'bold' as const },
      body: { name: 'NanumGothic', style: 'normal' as const },
      fallback: { name: 'helvetica', style: 'normal' as const },
    }
  }

  return {
    // State
    availableFonts: readonly(availableFonts),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    loadFonts,
    getFontConfig,
    isFontAvailable,
    getRecommendedFonts,
  }
} 