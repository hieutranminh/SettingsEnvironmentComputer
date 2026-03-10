import type { jsPDF } from 'jspdf'

// Font constants
export const FONTS = {
  REGULAR: 'NanumGothic-Regular',
  BOLD: 'NanumGothic-ExtraBold',
} as const

// Track font loading status
let fontsLoadingPromise: Promise<void> | null = null
let fontsLoaded = false

/**
 * Method 1: Import fonts as modules (recommended)
 * Tạo các file font như sau và import như modules
 */
const loadFontModules = async (): Promise<void> => {
  try {
    // Dynamic imports cho fonts
    await Promise.all([
      import('@/utils/fonts/NanumGothic-Regular-normal'),
      import('@/utils/fonts/NanumGothic-ExtraBold-bold'),
    ])
    console.log('Fonts loaded via modules')
  } catch (error) {
    console.warn('Failed to load font modules:', error)
  }
}

/**
 * Main font loading function với multiple strategies
 */
export const loadFonts = async (): Promise<boolean> => {
  if (fontsLoaded) return true

  if (fontsLoadingPromise) {
    await fontsLoadingPromise
    return fontsLoaded
  }

  fontsLoadingPromise = (async () => {
    try {
      await loadFontModules()
      fontsLoaded = true
    } catch (error) {
      console.warn('Font module loading failed, trying scripts:', error)
      fontsLoaded = false
    }
  })()

  await fontsLoadingPromise
  return fontsLoaded
}

/**
 * Safe font setter với multiple fallback levels
 */
export const setFontSafely = (
  pdf: jsPDF,
  fontName: string,
  fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
): boolean => {
  try {
    // Try custom font first
    pdf.setFont(fontName, fontStyle)
    return true
  } catch (error) {
    // Fallback to built-in fonts
    try {
      const fallbackMap: Record<string, string> = {
        [FONTS.REGULAR]: 'helvetica',
        [FONTS.BOLD]: 'helvetica',
      }

      const fallbackFont = fallbackMap[fontName] || 'helvetica'
      const fallbackStyle = fontStyle === 'bold' ? 'bold' : 'normal'

      pdf.setFont(fallbackFont, fallbackStyle)
      return false
    } catch (fallbackError) {
      console.error('Even fallback font failed:', fallbackError)
      return false
    }
  }
}

/**
 * Font utility factory với improved error handling
 */
export const createFontUtils = (pdf: jsPDF) => {
  // Try to load embedded fonts first if external loading failed
  if (!fontsLoaded) {
    loadEmbeddedFonts(pdf)
  }

  return {
    setRegular: (size?: number) => {
      const success = setFontSafely(pdf, FONTS.REGULAR, 'normal')
      if (size) pdf.setFontSize(size)
      return success
    },

    setBold: (size?: number) => {
      const success = setFontSafely(pdf, FONTS.BOLD, 'bold')
      if (size) pdf.setFontSize(size)
      return success
    },

    setTitle: (size = 28) => {
      const success = setFontSafely(pdf, FONTS.BOLD, 'bold')
      pdf.setFontSize(size)
      return success
    },

    setSubtitle: (size = 14) => {
      const success = setFontSafely(pdf, FONTS.REGULAR, 'normal')
      pdf.setFontSize(size)
      return success
    },

    setBody: (size = 12) => {
      const success = setFontSafely(pdf, FONTS.REGULAR, 'normal')
      pdf.setFontSize(size)
      return success
    },

    // Utility to check if custom fonts are available
    isCustomFontAvailable: (): boolean => fontsLoaded,
  }
}

/**
 * Simple approach: Just ensure fonts work without blocking
 */
export const ensureFontsReady = async (): Promise<void> => {
  try {
    await loadFonts()
  } catch (error) {
    console.warn('Font loading failed, will use system fonts:', error)
  }
}

/**
 * For backward compatibility - non-blocking font initialization
 */
export const initializeFonts = (): void => {
  // Fire and forget - don't block app startup
  loadFonts().catch((error) => {
    console.warn('Font initialization failed (non-blocking):', error)
  })
}

// Auto-initialize fonts when module loads (non-blocking)
if (typeof window !== 'undefined') {
  initializeFonts()
}
