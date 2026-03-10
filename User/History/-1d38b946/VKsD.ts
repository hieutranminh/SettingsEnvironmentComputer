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
 * Create font files like this and import them as modules
 */
const loadFontModules = async (): Promise<void> => {
  try {
    // Dynamic imports for fonts
    await Promise.all([
      import('@/utils/fonts/NanumGothic-Regular-normal'),
      import('@/utils/fonts/NanumGothic-ExtraBold-bold'),
    ])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load font modules:', error)
  }
}

/**
 * Main font loading function with multiple strategies
 */
export const loadFonts = async (): Promise<boolean> => {
  if (fontsLoaded) return true

  if (fontsLoadingPromise) {
    await fontsLoadingPromise
    return fontsLoaded
  }

  fontsLoadingPromise = (async (): Promise<void> => {
    try {
      await loadFontModules()
      fontsLoaded = true
    } catch {
      fontsLoaded = false
    }
  })()

  await fontsLoadingPromise
  return fontsLoaded
}

/**
 * Safe font setter with multiple fallback levels
 * @param pdf - PDF document instance
 * @param fontName - Font name to set
 * @param fontStyle - Font style (normal, bold, italic, bolditalic)
 * @returns True if custom font was set successfully, false if fallback was used
 *
 * Example:
 *   const success = setFontSafely(pdf, FONTS.BOLD, 'bold')
 *   if (!success) console.log('Using fallback font')
 */
export const setFontSafely = (
  pdf: jsPDF,
  fontName: string,
  fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
): boolean => {
  try {
    // Check if fonts are loaded first
    if (!fontsLoaded) {
      // eslint-disable-next-line no-console
      console.warn('Custom fonts not loaded, using fallback')
      throw new Error('Fonts not loaded')
    }

    // Try custom font first
    pdf.setFont(fontName, fontStyle)
    return true
  } catch {
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
      // eslint-disable-next-line no-console
      console.error('Even fallback font failed:', fallbackError)
      // Last resort: use default font
      return setDefaultFont(pdf)
    }
  }
}

/**
 * Sets default font as last resort
 * @param pdf - PDF document instance
 * @returns Always false (fallback was used)
 */
const setDefaultFont = (pdf: jsPDF): boolean => {
  try {
    pdf.setFont('helvetica', 'normal')
    return false
  } catch {
    // eslint-disable-next-line no-console
    console.error('All font setting attempts failed')
    return false
  }
}

/**
 * Font utility factory interface
 */
interface IFontUtils {
  setRegular: (size?: number) => boolean
  setBold: (size?: number) => boolean
  setTitle: (size?: number) => boolean
  setSubtitle: (size?: number) => boolean
  setBody: (size?: number) => boolean
  isCustomFontAvailable: () => boolean
}

/**
 * Font utility factory with improved error handling
 * @param pdf - PDF document instance
 * @returns Font utility object with methods for setting fonts
 */
export const createFontUtils = (pdf: jsPDF): IFontUtils => {
  const DEFAULT_TITLE_SIZE = 28
  const DEFAULT_SUBTITLE_SIZE = 14
  const DEFAULT_BODY_SIZE = 12

  return {
    setRegular: (size?: number): boolean => {
      const success = setFontSafely(pdf, FONTS.REGULAR, 'normal')
      if (size) pdf.setFontSize(size)
      return success
    },

    setBold: (size?: number): boolean => {
      const success = setFontSafely(pdf, FONTS.BOLD, 'bold')
      if (size) pdf.setFontSize(size)
      return success
    },

    setTitle: (size: number = DEFAULT_TITLE_SIZE): boolean => {
      const success = setFontSafely(pdf, FONTS.BOLD, 'bold')
      pdf.setFontSize(size)
      return success
    },

    setSubtitle: (size: number = DEFAULT_SUBTITLE_SIZE): boolean => {
      const success = setFontSafely(pdf, FONTS.REGULAR, 'normal')
      pdf.setFontSize(size)
      return success
    },

    setBody: (size: number = DEFAULT_BODY_SIZE): boolean => {
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
    // eslint-disable-next-line no-console
    console.warn('Font loading failed, will use system fonts:', error)
  }
}

/**
 * Synchronous font check for PDF generation
 * @returns True if fonts are loaded and ready
 */
export const areFontsReady = (): boolean => {
  return fontsLoaded
}

/**
 * Wait for fonts to be ready with timeout
 * @param timeoutMs - Maximum time to wait in milliseconds
 * @returns Promise that resolves when fonts are ready
 */
const DEFAULT_TIMEOUT = 5000
const POLL_INTERVAL = 100

export const waitForFonts = async (timeoutMs: number = DEFAULT_TIMEOUT): Promise<boolean> => {
  const startTime = Date.now()
  const timeout = timeoutMs || DEFAULT_TIMEOUT

  while (!fontsLoaded && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
  }

  return fontsLoaded
}

/**
 * For backward compatibility - non-blocking font initialization
 */
export const initializeFonts = (): void => {
  loadFonts()
}

// Auto-initialize fonts when module loads (non-blocking)
if (typeof window !== 'undefined') {
  initializeFonts()
}
